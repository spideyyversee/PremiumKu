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
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();

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

    await supabaseAdmin.from("profiles").upsert({
      id: adminId,
      full_name: "Super Admin",
      phone: "081234567890",
      role: "admin",
    });

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

    await supabaseAdmin.from("profiles").upsert({
      id: normalUserId,
      full_name: "John Doe",
      phone: "08987654321",
      role: "user",
    });

    return NextResponse.json({
      success: true,
      message:
        "Berhasil! Akun Admin & User beserta data Profile telah di-seed.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
