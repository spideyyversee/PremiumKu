"use client";

import { useState, useEffect } from "react";
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
  Menu, 
  X,
} from "lucide-react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
    <>
      <div className="lg:hidden fixed top-0 left-0 w-full p-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-[60] flex justify-between items-center">
        <h1 className="text-xl font-black text-white tracking-tighter">
          PREMIUM<span className="text-blue-500 italic">KU.</span>
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-slate-800 rounded-xl text-white hover:bg-slate-700 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-[80] w-72 bg-slate-900 lg:bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 
        p-6 flex flex-col h-screen transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:sticky lg:top-0
      `}
      >
        {/* Logo Section */}
        <div className="mb-10 px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter">
              PREMIUM<span className="text-blue-500 italic">KU.</span>
            </h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">
              Admin Panel
            </p>
          </div>
          <button
            className="lg:hidden text-slate-400"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
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
                className={
                  pathname === m.href ? "text-white" : "text-slate-500"
                }
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

      <div className="h-20 lg:hidden" />
    </>
  );
}
