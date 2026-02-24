"use server";

import { createClient } from "@/utils/supabase/server";

export async function processCheckout() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Kamu harus login untuk melakukan pembayaran.");

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", user.id);

  if (!cartItems || cartItems.length === 0) {
    throw new Error("Keranjang kamu kosong.");
  }

  let subTotal = 0;
  cartItems.forEach((item: any) => {
    subTotal += item.products.price * item.quantity;
  });

  const adminFee = Math.round(subTotal * 0.1);
  const grossAmount = subTotal + adminFee;

  const orderId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
  const authString = Buffer.from(serverKey + ":").toString("base64");

  const response = await fetch(
    "https://app.sandbox.midtrans.com/snap/v1/transactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount,
        },
        customer_details: {
          first_name: user.user_metadata?.full_name || "Pelanggan",
          email: user.email,
          phone: user.user_metadata?.phone || "",
        },
      }),
    },
  );

  const snapData = await response.json();

  if (!snapData.token) {
    throw new Error("Gagal mendapatkan token pembayaran dari Midtrans.");
  }

  const transactionsToInsert: any[] = [];

  cartItems.forEach((item: any) => {
    for (let i = 0; i < item.quantity; i++) {
      transactionsToInsert.push({
        user_id: user.id,
        product_id: item.product_id,
        order_id: orderId,
        amount: item.products.price,
        status: "pending",
        snap_token: snapData.token,
      });
    }
  });

  const { error: trxError } = await supabase
    .from("transactions")
    .insert(transactionsToInsert);

  if (trxError) throw new Error(trxError.message);

  return snapData.token;
}
