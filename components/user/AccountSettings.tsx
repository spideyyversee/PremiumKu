"use client";

import { useState, useEffect, useRef } from "react";
import { Settings, Save, Loader2, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function AccountSettings() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false); // ✅ State untuk loading reset password

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatarUrl: "",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (data) {
          setProfile({
            fullName: data.full_name || "",
            email: session.user.email || "",
            phone: data.phone || "",
            avatarUrl: data.avatar_url || "",
          });
        }
      }
      setLoading(false);
    }
    fetchProfile();
  }, [supabase]);

  // Fungsi Upload Avatar ke Supabase Storage
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      setMessage(null);

      const file = e.target.files?.[0];
      if (!file) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Tidak ada sesi login.");

      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatarUrl: publicUrl });
      setMessage({ type: "success", text: "Foto profil berhasil diunggah!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: "error", text: "Gagal mengunggah: " + error.message });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ✅ Fungsi untuk mengirim email reset password
  const handleResetPassword = async () => {
    if (!profile.email) return;

    setResettingPassword(true);
    setMessage(null);

    // Ganti window.location.origin dengan domain aslimu jika sudah production
    const redirectUrl = `${window.location.origin}/auth/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      setMessage({
        type: "error",
        text: "Gagal mengirim email reset: " + error.message,
      });
    } else {
      setMessage({
        type: "success",
        text: "Link reset password telah dikirim ke emailmu!",
      });
      setTimeout(() => setMessage(null), 5000);
    }
    setResettingPassword(false);
  };

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.fullName,
          phone: profile.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
        setTimeout(() => setMessage(null), 3000);
      }
    }
    setUpdating(false);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <Settings className="text-blue-500" size={26} /> Pengaturan Akun
      </h2>

      {message && (
        <div
          className={`p-4 rounded-xl mb-8 text-sm font-bold border flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* AVATAR UPLOAD SECTION */}
      <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <div
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-28 h-28 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden relative">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold text-3xl">
                {profile.fullName.substring(0, 2).toUpperCase() || "US"}
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploadingAvatar ? (
                <Loader2 className="animate-spin text-white" size={24} />
              ) : (
                <>
                  <Camera className="text-white mb-1" size={20} />
                  <span className="text-white text-[10px] font-bold">UBAH</span>
                </>
              )}
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="text-center sm:text-left pt-2">
          <h3 className="text-white font-bold text-lg">Foto Profil</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm">
            Klik foto di samping untuk mengubah avatar.
          </p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Alamat Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl px-5 py-3.5 text-slate-500 cursor-not-allowed opacity-70"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              No. WhatsApp
            </label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {/* ✅ BAGIAN PASSWORD YANG DIPERBARUI */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Password
            </label>
            <div className="flex gap-3">
              <input
                type="password"
                placeholder="••••••••"
                disabled
                className="w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl px-5 py-3.5 text-slate-500 cursor-not-allowed opacity-70"
              />
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resettingPassword || !profile.email}
                className="shrink-0 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold px-5 rounded-2xl transition-all disabled:opacity-50"
              >
                {resettingPassword ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Ubah"
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">
              *Klik tombol ubah untuk mengirimkan link reset ke emailmu.
            </p>
          </div>
        </div>

        <div className="pt-6 mt-8 border-t border-slate-800">
          <button
            type="submit"
            disabled={updating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
          >
            {updating ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {updating ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
