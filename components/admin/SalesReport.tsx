"use client";

import { BarChart3 } from "lucide-react";
import { useMemo, useState } from "react";

export default function SalesReport({
  transactions = [],
}: {
  transactions?: any[];
}) {
  const [timeframe, setTimeframe] = useState("Harian");

  const { chartData, maxVal } = useMemo(() => {
    const successTxs = transactions.filter((t: any) => t.status === "success");

    if (successTxs.length === 0) {
      const emptyData = Array(7)
        .fill(0)
        .map((_, i) => ({
          label: "-",
          total: 0,
        }));
      return { chartData: emptyData, maxVal: 100 };
    }

    const sortedTxs = [...successTxs].reverse();

    const grouped: { [key: string]: number } = {};

    sortedTxs.forEach((t) => {
      const date = new Date(t.created_at);
      let label = "";

      if (timeframe === "Harian") {
        label = date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        });
      } else {
        label = date.toLocaleDateString("id-ID", {
          month: "short",
          year: "numeric",
        });
      }

      if (!grouped[label]) grouped[label] = 0;
      grouped[label] += Number(t.amount);
    });

    let data = Object.keys(grouped).map((label) => ({
      label,
      total: grouped[label],
    }));

    data = data.slice(-7);

    const maximum = Math.max(...data.map((d) => d.total));

    return { chartData: data, maxVal: maximum > 0 ? maximum : 100 };
  }, [transactions, timeframe]);

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl h-full flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={22} /> Penjualan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Statistik pendapatan ({timeframe})
          </p>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-xs font-medium rounded-xl px-4 py-2 text-slate-300 outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="Harian">Harian</option>
          <option value="Bulanan">Bulanan</option>
        </select>
      </div>

      <div className="flex-1 h-64 flex items-end justify-between gap-2 group mt-auto pt-10">
        {chartData.map((data, i) => {
          const heightPercent =
            data.total === 0 ? 8 : Math.max((data.total / maxVal) * 100, 8);

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-3 h-full justify-end"
            >
              <div
                className={`w-full max-w-[40px] rounded-t-xl transition-all duration-700 relative group/bar cursor-pointer ${
                  data.total > 0
                    ? "bg-gradient-to-t from-emerald-600/20 to-emerald-500/50 hover:from-emerald-600 hover:to-emerald-400"
                    : "bg-slate-800/50"
                }`}
                style={{ height: `${heightPercent}%` }}
              >
                {data.total > 0 && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-slate-800 px-3 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-lg whitespace-nowrap z-20">
                    Rp {data.total.toLocaleString("id-ID")}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest whitespace-nowrap text-center">
                {data.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
