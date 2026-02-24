"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import {
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("user");
  const [cartCount, setCartCount] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const whatsappNumber = "6281234567890";
  const waMessage = encodeURIComponent(
    "Halo Admin PremiumKu, saya ingin meminta bantuan atau melakukan pengaduan terkait layanan.",
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${waMessage}`;

  useEffect(() => {
    let cartSubscription: any;

    const fetchCartCount = async (userId: string) => {
      const { count } = await supabase
        .from("cart_items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      setCartCount(count || 0);
    };

    const getUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile) setRole(profile.role);
        fetchCartCount(session.user.id);

        cartSubscription = supabase
          .channel("cart_changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "cart_items",
              filter: `user_id=eq.${session.user.id}`,
            },
            () => {
              fetchCartCount(session.user.id);
            },
          )
          .subscribe();
      }
    };

    getUserData();

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => setRole(data?.role || "user"));

        fetchCartCount(session.user.id);
      } else {
        setRole("user");
        setCartCount(0);
      }
    });

    return () => {
      authSubscription.unsubscribe();
      if (cartSubscription) supabase.removeChannel(cartSubscription);
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const closeMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const dashboardLink =
    role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-black text-white tracking-tighter hover:opacity-80 transition"
        >
          PREMIUM<span className="text-blue-500 italic">KU.</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-300">
          <Link href="/" className="hover:text-blue-400 transition">
            Beranda
          </Link>
          <Link href="/katalog" className="hover:text-blue-400 transition">
            Katalog
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            Bantuan
          </a>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <Link
            href="/cart"
            className="relative p-2 text-slate-400 hover:text-white transition group"
          >
            <ShoppingCart
              size={22}
              className="group-hover:scale-110 transition-transform"
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 rounded-full text-[10px] flex items-center justify-center font-black text-white shadow-lg border-2 border-slate-900 animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </Link>

          {!user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-sm font-bold text-slate-300 hover:text-white px-4"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-full transition shadow-lg shadow-blue-500/20"
              >
                Daftar
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-slate-800 border border-slate-700 pl-1.5 pr-3 py-1.5 rounded-full hover:bg-slate-700 transition"
              >
                <div className="w-7 h-7 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black text-white uppercase shadow-inner">
                  {user.email?.[0]}
                </div>
                <span className="text-xs font-bold text-white hidden sm:block truncate max-w-[100px]">
                  {user.user_metadata?.full_name?.split(" ")[0] ||
                    user.email.split("@")[0]}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-slate-800 mb-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Akun {role === "admin" ? "Admin" : "Saya"}
                    </p>
                    <p className="text-xs text-slate-300 truncate font-medium">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href={dashboardLink}
                    onClick={closeMenus}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition ${pathname.includes("dashboard") ? "text-blue-400 bg-blue-400/5 font-bold" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <hr className="border-slate-800 mx-2 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 transition font-semibold"
                  >
                    <LogOut size={18} /> Keluar
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="md:hidden text-slate-300 p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 p-6 space-y-6 animate-in slide-in-from-top duration-300 absolute w-full left-0 top-20 shadow-2xl">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={closeMenus}
              className="text-lg font-bold text-slate-200"
            >
              Beranda
            </Link>
            <Link
              href="/katalog"
              onClick={closeMenus}
              className="text-lg font-bold text-slate-200"
            >
              Katalog
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenus}
              className="text-lg font-bold text-slate-200"
            >
              Bantuan
            </a>
            {user && (
              <Link
                href={dashboardLink}
                onClick={closeMenus}
                className="text-lg font-bold text-blue-400"
              >
                Dashboard
              </Link>
            )}
          </div>

          {!user && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <Link
                href="/auth/login"
                onClick={closeMenus}
                className="flex items-center justify-center py-3 rounded-xl border border-slate-700 text-sm font-bold text-white"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                onClick={closeMenus}
                className="flex items-center justify-center py-3 rounded-xl bg-blue-600 text-sm font-bold text-white"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
