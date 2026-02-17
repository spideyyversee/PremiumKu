"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
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
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Ambil session saat ini
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen perubahan status (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Helper untuk menutup menu saat link diklik
  const closeMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-black text-white tracking-tighter hover:opacity-80 transition"
        >
          PREMIUM<span className="text-blue-500 italic">KU.</span>
        </Link>

        {/* CENTER NAVIGATION (Desktop) */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-300">
          <Link href="/" className="hover:text-blue-400 transition">
            Beranda
          </Link>
          <Link href="/#products" className="hover:text-blue-400 transition">
            Katalog
          </Link>
          <Link href="/#features" className="hover:text-blue-400 transition">
            Keunggulan
          </Link>
          <Link href="/#faq" className="hover:text-blue-400 transition">
            Bantuan
          </Link>
        </div>

        {/* RIGHT SECTION (Icons & Auth) */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Cart Icon */}
          <Link
            href="/checkout"
            className="relative p-2 text-slate-400 hover:text-white transition"
          >
            <ShoppingCart size={22} />
            <span className="absolute top-0 right-0 h-4 w-4 bg-blue-600 rounded-full text-[10px] flex items-center justify-center font-bold text-white border border-slate-900">
              0
            </span>
          </Link>

          {!user ? (
            /* Button Group for Guest */
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
            /* User Dropdown */
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
                      Akun Saya
                    </p>
                    <p className="text-xs text-slate-300 truncate font-medium">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/user/dashboard"
                    onClick={closeMenus}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition ${
                      pathname === "/user/dashboard"
                        ? "text-blue-400 bg-blue-400/5 font-bold"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
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

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-300 p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 p-6 space-y-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={closeMenus}
              className="text-lg font-bold text-slate-200"
            >
              Beranda
            </Link>
            <Link
              href="/#products"
              onClick={closeMenus}
              className="text-lg font-bold text-slate-200"
            >
              Katalog
            </Link>
            <Link
              href="/#features"
              onClick={closeMenus}
              className="text-lg font-bold text-slate-200"
            >
              Keunggulan
            </Link>
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
