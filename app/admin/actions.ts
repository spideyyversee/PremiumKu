"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// --- BACKEND: TAMBAH PRODUK ---
export async function addProduct(formData: FormData) {
  const supabase = await createClient();

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    price: parseFloat(formData.get("price") as string),
    original_price: formData.get("original_price")
      ? parseFloat(formData.get("original_price") as string)
      : null,
    stock_status: formData.get("stock_status") as string,
    duration: formData.get("duration") as string,
    is_popular: formData.get("is_popular") === "true",
  };

  const { error } = await supabase.from("products").insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
}

// --- BACKEND: EDIT PRODUK ---
export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    price: parseFloat(formData.get("price") as string),
    original_price: formData.get("original_price")
      ? parseFloat(formData.get("original_price") as string)
      : null,
    stock_status: formData.get("stock_status") as string,
    duration: formData.get("duration") as string,
    is_popular: formData.get("is_popular") === "true",
  };

  const { error } = await supabase.from("products").update(data).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
}

// --- BACKEND: HAPUS PRODUK ---
export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
}

// --- BACKEND: SETUJUI PESANAN & KIRIM AKUN ---
export async function approveOrder(transactionId: string, credentials: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("transactions")
    .update({ 
      status: "success", 
      account_credentials: credentials 
    })
    .eq("id", transactionId);

  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/reports");
}

// --- BACKEND: TOLAK/BATALKAN PESANAN ---
export async function rejectOrder(transactionId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("transactions")
    .update({ status: "failed" })
    .eq("id", transactionId);

  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}