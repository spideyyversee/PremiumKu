"use server";

import { createClient } from "@/utils/supabase/server";

export async function processCheckout() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Kamu harus login untuk melakukan pembayaran.");

  // 1. Ambil data keranjang beserta detail produknya
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", user.id);

  if (!cartItems || cartItems.length === 0) {
    throw new Error("Keranjang kamu kosong.");
  }

  // 2. Kalkulasi Total + Biaya Layanan 10%
  let subTotal = 0;
  cartItems.forEach((item: any) => {
    subTotal += item.products.price * item.quantity;
  });

  const adminFee = Math.round(subTotal * 0.1); // Biaya layanan 10%
  const grossAmount = subTotal + adminFee;

  // 3. Buat SATU Order ID untuk Midtrans
  const orderId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // 4. Request Snap Token ke Midtrans
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

  // 5. SIAPKAN DATA MULTI-ROW UNTUK DATABASE KITA
  const transactionsToInsert: any[] = [];

  cartItems.forEach((item: any) => {
    // Jika customer beli quantity 2, buat 2 baris agar admin bisa kirim 2 akun yg beda
    for (let i = 0; i < item.quantity; i++) {
      transactionsToInsert.push({
        user_id: user.id,
        product_id: item.product_id,
        order_id: orderId, // Order ID sama agar tau ini dari 1 keranjang
        amount: item.products.price, // Harga per 1 aplikasi
        status: "pending",
        snap_token: snapData.token,
      });
    }
  });

  // 6. Insert semua baris secara bersamaan ke database
  const { error: trxError } = await supabase
    .from("transactions")
    .insert(transactionsToInsert);

  if (trxError) throw new Error(trxError.message);

  return snapData.token;
}
