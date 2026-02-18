"use client"; // Pastikan ini ada di baris paling atas
import { useState } from "react";
import { TrendingUp } from "lucide-react"; // Jangan lupa import icon

export default function SalesReport() {
  // 1. Buat state untuk menyimpan filter
  const [period, setPeriod] = useState("Bulanan");
  const data = [40, 70, 55, 90, 65, 100, 80, 95, 75, 85, 60, 110];

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl h-full">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" /> Grafik Laporan
          </h3>
          <p className="text-xs text-slate-500 mt-1 italic">
            Penjualan {period.toLowerCase()} (YTD){" "}
            {/* Teks berubah sesuai filter */}
          </p>
        </div>

        {/* 2. Bind value ke state & handle onChange */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-[10px] font-bold rounded-lg px-3 py-2 text-slate-400 outline-none uppercase tracking-widest cursor-pointer hover:border-blue-500 transition"
        >
          <option value="Harian">Harian</option>
          <option value="Bulanan">Bulanan</option>
          <option value="Tahunan">Tahunan</option>
        </select>
      </div>

      <div className="h-48 flex items-end justify-between gap-2">
        {data.map((val, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-2 group"
          >
            <div
              className="w-full bg-blue-600/20 group-hover:bg-blue-500 rounded-t-lg transition-all relative"
              style={{ height: `${val}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {val}jt
              </div>
            </div>
            <span className="text-[9px] font-bold text-slate-600 uppercase">
              {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
