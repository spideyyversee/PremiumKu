"use client";

import { History, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserSidebar({ activeTab, setActiveTab }: any) {
  const supabase = createClient();
  const router = useRouter();
  const [userName, setUserName] = useState("Memuat...");
  const [userInitial, setUserInitial] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function getUserProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", session.user.id)
          .single();

        if (data?.full_name) {
          setUserName(data.full_name);
          setUserInitial(data.full_name.substring(0, 2).toUpperCase());
        } else {
          setUserName(session.user.email?.split("@")[0] || "User");
          setUserInitial("US");
        }

        if (data?.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      } else {
        router.push("/auth/login");
      }
    }
    getUserProfile();
  }, [router, activeTab]); // Re-fetch jika tab berubah (misal habis save setting)

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const menus = [
    { id: "history", label: "Riwayat Pembelian", icon: History },
    { id: "settings", label: "Pengaturan Akun", icon: Settings },
  ];

  return (
    <aside className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl h-fit sticky top-28">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
        {/* AVATAR AREA */}
        {avatarUrl ? (
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-700 shrink-0 relative">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-500/30 shrink-0">
            {userInitial}
          </div>
        )}

        <div className="overflow-hidden">
          <h3 className="font-bold text-white text-base truncate">
            {userName}
          </h3>
          <p className="text-xs text-blue-400 font-medium tracking-wide uppercase mt-1">
            Member Premium
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setActiveTab(menu.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
              activeTab === menu.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 font-bold"
                : "text-slate-400 hover:bg-slate-800 hover:text-white font-medium"
            }`}
          >
            <menu.icon
              size={20}
              className={
                activeTab === menu.id ? "text-white" : "text-slate-500"
              }
            />
            <span className="text-sm">{menu.label}</span>
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium group"
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
