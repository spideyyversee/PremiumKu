"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserSidebar from "@/components/user/UserSidebar";
import PurchaseHistory from "@/components/user/PurchaseHistory";
import AccountSettings from "@/components/user/AccountSettings";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("history");

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Navbar ini sudah otomatis memiliki link ke Beranda, Katalog, dll */}
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Kiri */}
          <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Konten Utama */}
          <main className="flex-1">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "history" && (
                <div className="space-y-6">
                  <PurchaseHistory />
                </div>
              )}

              {activeTab === "settings" && <AccountSettings />}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
