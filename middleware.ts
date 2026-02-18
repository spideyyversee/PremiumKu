import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // 1. Setup Client Supabase untuk Middleware
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
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 2. Cek User yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // --- ATURAN 1: BELUM LOGIN ---
  // Jika user belum login tapi coba akses halaman admin/user, lempar ke login
  if (!user && (path.startsWith("/admin") || path.startsWith("/user"))) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // --- ATURAN 2: SUDAH LOGIN (CEK ROLE) ---
  if (user) {
    // Ambil Role dari tabel profiles
    // (Kita query cepat ke DB untuk memastikan keamanan)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "user";

    // KASUS A: ADMIN NYASAR KE USER DASHBOARD
    if (role === "admin" && path.startsWith("/user")) {
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }

    // KASUS B: USER BIASA NYASAR KE ADMIN
    if (role !== "admin" && path.startsWith("/admin")) {
      url.pathname = "/user/dashboard";
      return NextResponse.redirect(url);
    }

    // KASUS C: SUDAH LOGIN TAPI COBA BUKA HALAMAN LOGIN/REGISTER
    // Kita lempar balik ke dashboard masing-masing
    if (path.startsWith("/auth/login") || path.startsWith("/auth/register")) {
      if (role === "admin") {
        url.pathname = "/admin/dashboard";
      } else {
        url.pathname = "/user/dashboard";
      }
      return NextResponse.redirect(url);
    }
  }

  return response;
}

// Tentukan rute mana saja yang kena middleware ini
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
