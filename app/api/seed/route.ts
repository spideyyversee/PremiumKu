import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Baca dari Environment Variable
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SETUP ERROR: Pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY ada di .env.local",
  );
}

// Inisialisasi Admin Client
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function GET() {
  try {
    // 1. SEED PRODUCTS
    const products = [
      {
        name: "Netflix Premium 4K",
        description: "Sharing akun privat, anti hold, garansi full 30 hari.",
        category: "Streaming",
        price: 35000,
        original_price: 185000,
        stock_status: "in_stock",
        duration: "30 Hari",
        is_popular: true,
      },
      {
        name: "Spotify Individual",
        description:
          "Akun sendiri (bukan family), bebas pilih lagu, download offline.",
        category: "Music",
        price: 25000,
        original_price: 55000,
        stock_status: "in_stock",
        duration: "30 Hari",
        is_popular: false,
      },
      {
        name: "Youtube Premium",
        description:
          "Nonton tanpa iklan, putar background, youtube music premium.",
        category: "Video",
        price: 12000,
        original_price: 59000,
        stock_status: "in_stock",
        duration: "30 Hari",
        is_popular: true,
      },
      {
        name: "Canva Pro",
        description: "Unlock semua elemen premium, magic resize, brand kit.",
        category: "Design",
        price: 10000,
        original_price: 45000,
        stock_status: "in_stock",
        duration: "30 Hari",
        is_popular: false,
      },
      {
        name: "ChatGPT Plus",
        description: "Akses GPT-4, DALL-E 3, respon lebih cepat dan akurat.",
        category: "AI Tools",
        price: 150000,
        original_price: 300000,
        stock_status: "out_of_stock",
        duration: "30 Hari",
        is_popular: true,
      },
    ];

    const { error: productError } = await supabaseAdmin
      .from("products")
      .insert(products);

    if (productError) {
      console.log(
        "Info: Produk mungkin sudah ada atau error:",
        productError.message,
      );
    }

    // 2. SEED ADMIN USER
    const adminEmail = "admin@premiumku.com";
    const adminPassword = "password123";

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const adminExists = existingUsers.users.find((u) => u.email === adminEmail);

    if (!adminExists) {
      const { data: newAdmin, error: adminCreateError } =
        await supabaseAdmin.auth.admin.createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
          user_metadata: {
            full_name: "Super Admin",
            phone: "081234567890",
            role: "admin",
          },
        });

      if (adminCreateError) throw adminCreateError;

      if (newAdmin.user) {
        await supabaseAdmin
          .from("profiles")
          .update({ role: "admin" })
          .eq("id", newAdmin.user.id);
      }
    }

    // 3. SEED NORMAL USER
    const userEmail = "user@premiumku.com";
    const userPassword = "password123";

    const userExists = existingUsers.users.find((u) => u.email === userEmail);

    if (!userExists) {
      await supabaseAdmin.auth.admin.createUser({
        email: userEmail,
        password: userPassword,
        email_confirm: true,
        user_metadata: {
          full_name: "John Doe",
          phone: "08987654321",
          role: "user",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully via ENV!",
      details: "Products inserted. Admin & User created.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
