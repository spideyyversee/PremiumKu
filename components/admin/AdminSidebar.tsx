"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  DollarSign,
  Settings,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const menus = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Aplikasi", icon: Package, href: "#" },
    { label: "Pelanggan", icon: Users, href: "#" },
    { label: "Laporan", icon: DollarSign, href: "#" },
    { label: "Settings", icon: Settings, href: "#" },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col p-6">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-black text-white tracking-tighter">
          PREMIUM<span className="text-blue-500 italic">KU.</span>
        </h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {menus.map((m) => (
          <Link
            key={m.label}
            href={m.href}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
              pathname === m.href
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <m.icon size={20} /> {m.label}
          </Link>
        ))}
      </nav>

      <button className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm">
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
}
