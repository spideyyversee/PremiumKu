import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CartClient from "./CartClient";

export const metadata = {
  title: "Keranjang Belanja - PremiumKu",
};

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      product_id,
      products (
        id,
        name,
        price,
        category,
        duration
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-slate-950 pt-10 pb-20 px-4 selection:bg-blue-500/30 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
          Keranjang <span className="text-blue-500">Belanja.</span>
        </h1>
        <p className="text-slate-400 mb-8 font-light">
          Periksa kembali pesanan kamu sebelum lanjut ke pembayaran.
        </p>

        <CartClient initialItems={cartItems || []} />
      </div>
    </div>
  );
}
