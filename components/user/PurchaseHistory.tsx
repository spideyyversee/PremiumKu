import { ExternalLink, CheckCircle2 } from "lucide-react";

export default function PurchaseHistory() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Langganan Aktif</h2>

      <div className="grid gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between gap-6 hover:border-blue-500/30 transition-all"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500 font-bold italic text-xs">
                APP
              </div>
              <div>
                <h4 className="font-bold text-white">Netflix Premium UHD 4K</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 italic">
                    INV-2026-00{i}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={10} /> AKTIF
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:text-right gap-8">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  Masa Aktif Hingga
                </p>
                <p className="text-sm font-bold text-orange-400">
                  15 Maret 2026
                </p>
              </div>
              <button className="bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition">
                Akses Akun
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
