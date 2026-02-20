"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// --- TAMBAH KE KERANJANG DARI KATALOG ---
export async function addToCart(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Harus login untuk menambah ke keranjang");

  // Cek apakah barang ini sudah ada di keranjang user
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existingItem) {
    // Jika sudah ada, tambahkan quantity-nya +1
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + 1 })
      .eq("id", existingItem.id);
    if (error) throw new Error(error.message);
  } else {
    // Jika belum ada, buat baris baru di keranjang
    const { error } = await supabase
      .from("cart_items")
      .insert([{ user_id: user.id, product_id: productId, quantity: 1 }]);
    if (error) throw new Error(error.message);
  }

  // Refresh path agar data terbaru terbaca
  revalidatePath("/cart");
  revalidatePath("/");
  revalidatePath("/katalog");
}

// --- UBAH JUMLAH BARANG DI HALAMAN KERANJANG ---
export async function updateCartQuantity(cartId: string, quantity: number) {
  const supabase = await createClient();
  if (quantity < 1) return;
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartId);
  if (error) throw new Error(error.message);
  revalidatePath("/cart");
}

// --- HAPUS BARANG DARI KERANJANG ---
export async function removeCartItem(cartId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("cart_items").delete().eq("id", cartId);
  if (error) throw new Error(error.message);
  revalidatePath("/cart");
}

// --- KOSONGKAN KERANJANG (Setelah sukses bayar) ---
export async function clearCart() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  // Refresh halaman keranjang dan navbar
  revalidatePath("/cart");
  revalidatePath("/");
}

