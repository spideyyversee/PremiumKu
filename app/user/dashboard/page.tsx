"use client";

import { useState } from "react";
import UserSidebar from "@/components/user/UserSidebar";
import PurchaseHistory from "@/components/user/PurchaseHistory";
import AccountSettings from "@/components/user/AccountSettings";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("history");

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30 flex flex-col pt-20">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Dashboard <span className="text-blue-400">Pengguna</span>
          </h1>
          <p className="text-slate-400 mt-2 font-light">
            Kelola langganan premium, riwayat transaksi, dan pengaturan akunmu
            di sini.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 shrink-0">
            <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <main className="flex-1 min-w-0">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "history" && <PurchaseHistory />}
              {activeTab === "settings" && <AccountSettings />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
