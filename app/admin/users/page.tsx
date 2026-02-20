import { createClient } from "@/utils/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Users, Phone, Calendar, ShieldCheck } from "lucide-react"; // Ubah Mail jadi Phone

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Fetch profiles table dimana role = 'user'
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "user")
    .order("created_at", { ascending: false });

  return (
    <div className="flex h-screen bg-slate-950 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Data <span className="text-purple-500">Pelanggan</span>
          </h1>
          <p className="text-slate-400 mt-2 font-light">
            Daftar pengguna yang terdaftar di platform PremiumKu.
          </p>
        </header>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100 fill-mode-both">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-800">
                <tr>
                  <th className="px-8 py-5">Pengguna</th>
                  <th className="px-8 py-5">Kontak (WhatsApp)</th>
                  <th className="px-8 py-5">Terdaftar Pada</th>
                  <th className="px-8 py-5 text-center">Status Akun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {!users || users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-8 py-10 text-center text-slate-500 italic"
                    >
                      Belum ada pelanggan terdaftar.
                    </td>
                  </tr>
                ) : (
                  users.map((u: any) => (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-8 py-5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full flex items-center justify-center font-black text-white shadow-inner">
                          {u.full_name?.[0] ||
                            u.id.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white">
                            {u.full_name || "Tanpa Nama"}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            ID: {u.id.substring(0, 8)}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-400">
                          {/* ✅ Diganti menjadi Phone & u.phone */}
                          <Phone size={14} className="text-emerald-400" />
                          <span className="font-mono">
                            {u.phone || "Tidak ada nomor"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar size={14} />
                          <span>
                            {new Date(u.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck size={12} /> Aktif
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
