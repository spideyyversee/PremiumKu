"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  LayoutDashboard,
  Package,
  Users,
  DollarSign,
  Settings,
  LogOut,
  ClipboardList,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const menus = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Pesanan", icon: ClipboardList, href: "/admin/orders" },
    { label: "Aplikasi", icon: Package, href: "/admin/products" },
    { label: "Pelanggan", icon: Users, href: "/admin/users" },
    { label: "Laporan", icon: DollarSign, href: "/admin/reports" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 hidden lg:flex flex-col p-6 h-screen sticky top-0 z-50">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-black text-white tracking-tighter">
          PREMIUM<span className="text-blue-500 italic">KU.</span>
        </h1>
        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {menus.map((m) => (
          <Link
            key={m.label}
            href={m.href}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
              pathname === m.href ||
              (pathname.startsWith(m.href) && m.href !== "/admin/dashboard")
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <m.icon
              size={20}
              className={pathname === m.href ? "text-white" : "text-slate-500"}
            />
            {m.label}
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-800 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-bold text-sm group"
        >
          <LogOut
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Keluar
        </button>
      </div>
    </aside>
  );
}
