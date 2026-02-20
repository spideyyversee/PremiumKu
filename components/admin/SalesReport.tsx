"use client";

import { BarChart3 } from "lucide-react";
import { useMemo } from "react";

// Menerima prop transactions asli
export default function SalesReport({ transactions = [] }: { transactions?: any[] }) {
  // LOGIKA MENGHITUNG PENJUALAN 7 HARI TERAKHIR
  const { chartData, maxVal } = useMemo(() => {
    const data = [];
    let maximum = 0;

    // Ambil tanggal hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Loop mundur 7 hari
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() - i);

      // Filter transaksi pada targetDate yang statusnya 'success'
      const dailySales = transactions.filter((t: any) => {
        if (t.status !== "success") return false;
        const txDate = new Date(t.created_at);
        return (
          txDate.getDate() === targetDate.getDate() &&
          txDate.getMonth() === targetDate.getMonth() &&
          txDate.getFullYear() === targetDate.getFullYear()
        );
      });

      // Jumlahkan 'amount' (Rp)
      const dailyTotal = dailySales.reduce(
        (sum, t) => sum + Number(t.amount),
        0,
      );
      if (dailyTotal > maximum) maximum = dailyTotal;

      data.push({
        label: targetDate.toLocaleDateString("id-ID", { weekday: "short" }), // Cth: "Sen", "Sel"
        total: dailyTotal,
        displayVal:
          dailyTotal >= 1000000
            ? `${(dailyTotal / 1000000).toFixed(1)}jt`
            : `${dailyTotal / 1000}k`,
      });
    }

    return { chartData: data, maxVal: maximum > 0 ? maximum : 100 }; // Hindari devide by zero
  }, [transactions]);

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl h-full flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={22} /> Penjualan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Statistik 7 hari terakhir (Hanya transaksi berhasil)
          </p>
        </div>
        <select className="bg-slate-950 border border-slate-800 text-xs font-medium rounded-xl px-4 py-2 text-slate-300 outline-none focus:border-blue-500">
          <option>Harian</option>
          <option>Bulanan</option>
        </select>
      </div>

      <div className="flex-1 h-64 flex items-end justify-between gap-2 group mt-auto pt-10">
        {chartData.map((data, i) => {
          // Hitung tinggi bar dalam persentase (min 5% agar bar terlihat meskipun 0)
          const heightPercent =
            data.total === 0 ? 5 : Math.max((data.total / maxVal) * 100, 5);

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-3">
              <div
                className={`w-full max-w-[40px] rounded-t-xl transition-all duration-700 relative group/bar cursor-pointer ${
                  data.total > 0
                    ? "bg-gradient-to-t from-emerald-600/20 to-emerald-500/50 hover:from-emerald-600 hover:to-emerald-400"
                    : "bg-slate-800/50"
                }`}
                style={{ height: `${heightPercent}%` }}
              >
                {/* Tooltip Hover */}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-slate-800 px-3 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-lg whitespace-nowrap z-20">
                  Rp {data.total.toLocaleString("id-ID")}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {data.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
