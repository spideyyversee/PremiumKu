import { BarChart3 } from "lucide-react";

export default function SalesReport() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-white">Laporan Penjualan</h2>
          <p className="text-xs text-slate-500 italic">
            Data per hari hingga per tahun
          </p>
        </div>
        <select className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white outline-none">
          <option>Harian (7 Hari Terakhir)</option>
          <option>Bulanan (12 Bulan)</option>
          <option>Tahunan</option>
        </select>
      </div>

      <div className="h-64 flex items-end justify-between gap-3 group">
        {[60, 45, 90, 75, 55, 100, 85].map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3">
            <div
              className="w-full bg-blue-600/20 hover:bg-blue-600 rounded-t-lg transition-all relative group/bar"
              style={{ height: `${val}%` }}
            >
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-slate-800 px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                {val}jt
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold">
              Day {i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
