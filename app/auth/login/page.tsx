"use client";

import { useState, useEffect } from "react";
// Perhatikan: Kita import createClient (bukan instance supabase langsung)
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inisialisasi client di dalam component
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Proses Login
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      // JANGAN Redirect manual di sini.
      // Biarkan useEffect di bawah yang mendeteksi perubahan status login.
      console.log("Login berhasil, menunggu session sync...");
    }
  };

  // 2. DETEKTOR OTOMATIS (Anti-Stuck)
  // Kode ini akan jalan otomatis begitu Supabase mendeteksi user sudah login
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        console.log("Session terdeteksi! Mengalihkan...");

        // Cek Role sedikit (opsional, biar tidak salah kamar)
        // Kita pakai window.location agar browser melakukan HARD REFRESH
        // Ini penting agar Middleware membaca cookie baru.

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/user/dashboard";
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white">Selamat Datang</h1>
          <p className="text-slate-500 text-sm mt-2">Masuk ke akun kamu</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-xl mb-6">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 text-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 text-white"
          />
          <button
            disabled={loading}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Masuk Sekarang"
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="text-blue-400 font-bold">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
