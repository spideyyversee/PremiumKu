"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase";
import {
  Settings,
  Save,
  Globe,
  Lock,
  Bell,
  KeyRound,
  ShieldCheck,
  Smartphone,
  Mail,
  AlertTriangle,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const [password, setPassword] = useState("");
  const [isLoadingPwd, setIsLoadingPwd] = useState(false);
  const supabase = createClient();

  const handleUpdatePassword = async () => {
    if (!password || password.length < 6) {
      alert("Password baru minimal 6 karakter!");
      return;
    }

    setIsLoadingPwd(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoadingPwd(false);

    if (error) {
      alert("Gagal merubah password: " + error.message);
    } else {
      alert("Password berhasil diubah!");
      setPassword("");
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans selection:bg-slate-500/30 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <AdminSidebar />

      <main className="flex-1 overflow-y-auto pt-24 p-4 md:p-8 relative z-10">
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Pengaturan <span className="text-slate-500">Sistem</span>
          </h1>
          <p className="text-slate-400 mt-2 font-light">
            Konfigurasi aplikasi, keamanan, dan preferensi notifikasi.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100 fill-mode-both">
          <div className="lg:col-span-3 space-y-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Globe size={18} /> Profil Website
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === "security"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Lock size={18} /> Keamanan Akun
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === "notifications"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Bell size={18} /> Notifikasi Web
            </button>
          </div>

          <div className="lg:col-span-9">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl min-h-[500px]">
              {activeTab === "profile" && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
                    Informasi Website
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Nama Platform
                        </label>
                        <input
                          type="text"
                          defaultValue="PremiumKu."
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Email Kontak
                        </label>
                        <input
                          type="email"
                          defaultValue="support@premiumku.com"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Deskripsi Singkat (SEO)
                      </label>
                      <textarea
                        rows={4}
                        defaultValue="Penyedia layanan aplikasi premium legal nomor #1 di Indonesia."
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all resize-none"
                      ></textarea>
                    </div>
                    <div className="pt-6 border-t border-slate-800 flex justify-end gap-4">
                      <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/25 active:scale-95 transition-all">
                        <Save size={18} /> Simpan Profil
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
                    <KeyRound className="text-blue-500" /> Keamanan Akun
                  </h2>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">
                        Ubah Kata Sandi
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400">
                            Kata Sandi Baru
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 6 Karakter"
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleUpdatePassword}
                        disabled={isLoadingPwd}
                        className="mt-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-700"
                      >
                        {isLoadingPwd ? "Menyimpan..." : "Update Password"}
                      </button>
                    </div>

                    <hr className="border-slate-800" />

                    {/* 2FA */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">
                        Autentikasi Lanjutan
                      </h3>
                      <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-950/50 border border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                            <ShieldCheck size={24} />
                          </div>
                          <div>
                            <p className="text-white font-bold">
                              Two-Factor Authentication (2FA)
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Tambahkan lapisan keamanan ekstra pada akun admin
                              kamu.
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border border-slate-700"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
                    <Bell className="text-blue-500" /> Preferensi Notifikasi
                  </h2>

                  <div className="space-y-4">
                    <NotificationToggle
                      icon={
                        <Smartphone className="text-emerald-400" size={20} />
                      }
                      title="Pesanan Baru"
                      desc="Dapatkan notifikasi setiap kali ada pelanggan yang melakukan checkout."
                      defaultChecked={true}
                    />
                    <NotificationToggle
                      icon={<Mail className="text-blue-400" size={20} />}
                      title="Pendaftaran Pengguna Baru"
                      desc="Kirim email rekap harian untuk setiap pengguna baru yang mendaftar."
                      defaultChecked={false}
                    />
                    <NotificationToggle
                      icon={
                        <AlertTriangle className="text-orange-400" size={20} />
                      }
                      title="Peringatan Stok Habis"
                      desc="Beritahu saya ketika stok aplikasi (misal: Netflix) sedang kosong."
                      defaultChecked={true}
                    />
                  </div>

                  <div className="pt-8 mt-8 border-t border-slate-800 flex justify-end">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/25 active:scale-95 transition-all">
                      <Save size={18} /> Simpan Preferensi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NotificationToggle({
  icon,
  title,
  desc,
  defaultChecked,
}: {
  icon: any;
  title: string;
  desc: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 shadow-inner">
          {icon}
        </div>
        <div>
          <p className="text-white font-bold text-sm">{title}</p>
          <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          className="sr-only peer"
          defaultChecked={defaultChecked}
        />
        <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border border-slate-700"></div>
      </label>
    </div>
  );
}
