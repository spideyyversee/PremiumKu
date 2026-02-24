import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      order_id,
      transaction_status,
      fraud_status,
      status_code,
      gross_amount,
      signature_key,
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const hash = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    if (hash !== signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    let status = "pending";

    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      if (fraud_status === "accept" || !fraud_status) {
        status = "success";
      }
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      status = "failed";
    }

    if (status !== "pending") {
      const { error } = await supabase
        .from("transactions")
        .update({ status: status })
        .eq("order_id", order_id);

      if (error) {
        console.error("Gagal update database:", error.message);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json({ message: "Webhook berhasil diproses" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
