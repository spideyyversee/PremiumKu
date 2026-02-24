import { createClient } from "@/utils/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SalesReport from "@/components/admin/SalesReport";
import { FileText, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select(
      `
      *,
      profiles:user_id ( full_name )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal menarik data:", error.message);
  }

  const recentTransactions = transactions?.slice(0, 5) || [];

  return (
    <div className="flex h-screen bg-slate-950 font-sans selection:bg-emerald-500/30 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Laporan <span className="text-emerald-500">Keuangan</span>
          </h1>
          <p className="text-slate-400 mt-2 font-light">
            Analitik pendapatan dan riwayat transaksi lengkap dari database.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100 fill-mode-both">
          <div className="lg:col-span-2 h-[450px]">
            <SalesReport transactions={transactions || []} />
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl h-[450px] flex flex-col">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <FileText className="text-emerald-500" size={22} /> Transaksi
              Terbaru
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center mt-10">
                  Belum ada transaksi.
                </p>
              ) : (
                recentTransactions.map((trx: any) => (
                  <div
                    key={trx.id}
                    className="flex justify-between items-center p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${
                          trx.status === "success"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : trx.status === "pending"
                              ? "bg-orange-500/10 text-orange-400"
                              : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {trx.status === "success" ? (
                          <ArrowUpRight size={18} />
                        ) : trx.status === "pending" ? (
                          <Clock size={18} />
                        ) : (
                          <ArrowDownRight size={18} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {trx.order_id}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {trx.profiles?.full_name || "Guest"} •{" "}
                          {new Date(trx.created_at).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-black ${trx.status === "success" ? "text-emerald-400" : "text-slate-300"}`}
                      >
                        {trx.status === "success" ? "+" : ""} Rp{" "}
                        {trx.amount.toLocaleString("id-ID")}
                      </p>
                      <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">
                        {trx.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-4 py-3 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors uppercase tracking-widest">
              Lihat Semua
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
