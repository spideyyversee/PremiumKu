import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SETUP ERROR: Pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY ada di .env.local",
  );
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET() {
  try {
    // ==========================================
    // 0. RESET DATA LAMA (Hanya tabel konten)
    // ==========================================
    await supabaseAdmin.from("cart_items").delete().not("id", "is", null);
    await supabaseAdmin.from("transactions").delete().not("id", "is", null);
    await supabaseAdmin.from("products").delete().not("id", "is", null);

    // ==========================================
    // 1. SEED PRODUCTS
    // ==========================================
    const productsToInsert = [
      {
        name: "Netflix Premium 4K",
        description:
          "Sharing akun privat, anti hold, garansi full 30 hari. Kualitas Ultra HD.",
        category: "Streaming",
        price: 35000,
        original_price: 185000,
        stock_status: "in_stock",
        duration: "1 Bulan",
        is_popular: true,
        sold_count: 1250,
      },
      {
        name: "Spotify Individual",
        description:
          "Akun sendiri (bukan family), bebas pilih lagu, download offline, tanpa iklan.",
        category: "Music",
        price: 25000,
        original_price: 55000,
        stock_status: "in_stock",
        duration: "1 Bulan",
        is_popular: true,
        sold_count: 980,
      },
      {
        name: "Youtube Premium",
        description:
          "Nonton tanpa iklan, putar background, gratis akses YouTube Music Premium.",
        category: "Video",
        price: 12000,
        original_price: 59000,
        stock_status: "in_stock",
        duration: "1 Bulan",
        is_popular: true,
        sold_count: 850,
      },
      {
        name: "Canva Pro",
        description:
          "Unlock semua elemen premium, magic resize, brand kit, dan template pro.",
        category: "Design",
        price: 10000,
        original_price: 45000,
        stock_status: "in_stock",
        duration: "1 Bulan",
        is_popular: true,
        sold_count: 1100,
      },
      {
        name: "ChatGPT Plus",
        description:
          "Akses GPT-4, DALL-E 3, respon lebih cepat dan akurat untuk produktivitas.",
        category: "AI Tools",
        price: 150000,
        original_price: 300000,
        stock_status: "in_stock",
        duration: "1 Bulan",
        is_popular: false,
        sold_count: 230,
      },
      {
        name: "Vidio Platinum",
        description:
          "Nonton bola liga lokal & internasional, film Indonesia, dan series original Vidio.",
        category: "Streaming",
        price: 25000,
        original_price: 39000,
        stock_status: "in_stock",
        duration: "1 Bulan",
        is_popular: false,
        sold_count: 450,
      },
      {
        name: "Paket Starter (Netflix + Spotify)",
        description: "Paket hiburan paling basic. Diskon 10%.",
        category: "Bundling",
        price: 54000,
        original_price: 60000,
        stock_status: "in_stock",
        duration: "1 Bulan",
        is_popular: false,
        sold_count: 320,
      },
      {
        name: "Paket Sultan (Semua Aplikasi)",
        description: "Akses ke SEMUA aplikasi di atas tanpa limit. Diskon 10%.",
        category: "Bundling",
        price: 180000,
        original_price: 200000,
        stock_status: "in_stock",
        duration: "1 Bulan",
        is_popular: false,
        sold_count: 80,
      },
    ];

    const { data: insertedProducts, error: productError } = await supabaseAdmin
      .from("products")
      .insert(productsToInsert)
      .select();

    if (productError) throw productError;

    // ==========================================
    // 2. SEED USERS & PROFILES (UPSERT)
    // ==========================================
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();

    // --- ADMIN ---
    const adminEmail = "admin@premiumku.com";
    let adminId = existingUsers.users.find((u) => u.email === adminEmail)?.id;

    if (!adminId) {
      const { data: newAdmin, error: adminCreateError } =
        await supabaseAdmin.auth.admin.createUser({
          email: adminEmail,
          password: "password123",
          email_confirm: true,
          user_metadata: {
            full_name: "Super Admin",
            phone: "081234567890",
            role: "admin",
          },
        });
      if (adminCreateError) throw adminCreateError;
      adminId = newAdmin.user.id;
    }

    // 🔥 PENTING: Gunakan upsert agar profil dibuat paksa jika sempat terhapus
    await supabaseAdmin.from("profiles").upsert({
      id: adminId,
      full_name: "Super Admin",
      phone: "081234567890",
      role: "admin",
    });

    // --- NORMAL USER ---
    const userEmail = "user@premiumku.com";
    let normalUserId = existingUsers.users.find(
      (u) => u.email === userEmail,
    )?.id;

    if (!normalUserId) {
      const { data: newUser, error: userCreateError } =
        await supabaseAdmin.auth.admin.createUser({
          email: userEmail,
          password: "password123",
          email_confirm: true,
          user_metadata: {
            full_name: "John Doe",
            phone: "08987654321",
            role: "user",
          },
        });
      if (userCreateError) throw userCreateError;
      normalUserId = newUser.user.id;
    }

    // 🔥 PENTING: Upsert profil untuk normal user
    await supabaseAdmin.from("profiles").upsert({
      id: normalUserId,
      full_name: "John Doe",
      phone: "08987654321",
      role: "user",
    });

    // ==========================================
    // 3. SEED DUMMY CART & TRANSACTIONS
    // ==========================================
    if (insertedProducts && insertedProducts.length >= 3 && normalUserId) {
      const { error: cartError } = await supabaseAdmin
        .from("cart_items")
        .insert([
          {
            user_id: normalUserId,
            product_id: insertedProducts[3].id,
            quantity: 1,
          },
          {
            user_id: normalUserId,
            product_id: insertedProducts[4].id,
            quantity: 1,
          },
        ]);
      if (cartError) throw cartError;

      const { error: trxError } = await supabaseAdmin
        .from("transactions")
        .insert([
          {
            user_id: normalUserId,
            product_id: insertedProducts[0].id,
            order_id: `ORDER-SEED-${Math.floor(Math.random() * 10000)}`,
            amount: insertedProducts[0].price,
            status: "success",
            payment_method: "qris",
            account_credentials:
              "Email: john.netflix@gmail.com | Pass: N3tfl1xPremiumku!",
            created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          },
          {
            user_id: normalUserId,
            product_id: insertedProducts[1].id,
            order_id: `ORDER-SEED-${Math.floor(Math.random() * 10000)}`,
            amount: insertedProducts[1].price,
            status: "pending",
            payment_method: "bank_transfer",
            created_at: new Date().toISOString(),
          },
        ]);
      if (trxError) throw trxError;
    }

    return NextResponse.json({
      success: true,
      message: "Berhasil! Database lengkap di-seed.",
      details:
        "Profile yang hilang berhasil direstorasi. Cart dan Riwayat Transaksi sudah diisi.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
