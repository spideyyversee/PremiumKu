"use client";

import { useState } from "react";
// ✅ Import fungsi client
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  // ✅ Inisialisasi Client
  const supabase = createClient();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // ✅ State baru untuk Phone
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Daftar ke Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone, // ✅ Simpan juga di metadata (opsional tapi berguna)
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // 2. Jika sukses, buat data di tabel profiles
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          phone: phone, // ✅ Wajib masuk sini agar tersimpan di tabel profiles
          role: "user",
          created_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error("Gagal update profile:", profileError);
        }
      }

      // 3. Redirect ke Login
      router.push("/auth/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">Buat Akun Baru</h1>
          <p className="text-slate-500 text-sm mt-2">
            Bergabunglah bersama kami
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-xl mb-6">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Input Nama */}
          <div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama Lengkap"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-blue-600 transition"
            />
          </div>

          {/* Input Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Alamat Email"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-blue-600 transition"
            />
          </div>

          {/* ✅ Input Phone Baru */}
          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="No. WhatsApp / Telepon"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-blue-600 transition"
            />
          </div>

          {/* Input Password */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (Min. 6 karakter)"
              required
              minLength={6}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-blue-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all mt-6 shadow-lg shadow-blue-900/20"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link
            href="/auth/login"
            className="text-blue-400 font-bold hover:underline"
          >
            Masuk disini
          </Link>
        </p>
      </div>
    </div>
  );
}
