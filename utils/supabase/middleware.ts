import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // 1. Siapkan Response Awal
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Update cookie di Request (biar terbaca sekarang)
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          // Update cookie di Response (biar tersimpan di browser user)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 2. PENTING: Gunakan getSession() bukan getUser()
  // getUser() = Menghubungi database (Lama & sering gagal kalau beda negara)
  // getSession() = Cek validitas token di lokal (Cepat & Stabil)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Ambil user dari session (kalau ada)
  const user = session?.user;

  // Clone URL untuk redirect
  const url = request.nextUrl.clone();

  // --- LOGIKA PROTEKSI (Disederhanakan & Diperbaiki) ---

  // A. Proteksi Halaman User
  if (url.pathname.startsWith("/user") && !user) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // B. Proteksi Halaman Admin
  if (url.pathname.startsWith("/admin")) {
    if (!user) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    // Cek Role (Pastikan metadata role ada)
    const userRole = user.user_metadata?.role;
    if (userRole !== "admin") {
      url.pathname = "/user/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // C. Jika sudah login, tendang dari halaman Auth
  if (
    user &&
    (url.pathname.startsWith("/auth/login") ||
      url.pathname.startsWith("/auth/register"))
  ) {
    const userRole = user.user_metadata?.role;
    if (userRole === "admin") {
      url.pathname = "/admin/dashboard";
    } else {
      url.pathname = "/user/dashboard";
    }
    return NextResponse.redirect(url);
  }

  return response;
}
