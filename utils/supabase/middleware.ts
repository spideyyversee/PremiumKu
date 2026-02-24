import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  const url = request.nextUrl.clone();


  if (url.pathname.startsWith("/user") && !user) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/admin")) {
    if (!user) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    const userRole = user.user_metadata?.role;
    if (userRole !== "admin") {
      url.pathname = "/user/dashboard";
      return NextResponse.redirect(url);
    }
  }

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
