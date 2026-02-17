import { Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function PurchaseHistory() {
  const history = [
    {
      id: "INV-8821",
      name: "Netflix Premium",
      date: "20 Feb 2026",
      expiry: "20 Mar 2026",
      status: "Active",
      price: "Rp 35.000",
    },
    {
      id: "INV-7712",
      name: "Spotify Family",
      date: "10 Jan 2026",
      expiry: "10 Feb 2026",
      status: "Expired",
      price: "Rp 25.000",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Clock className="text-blue-500" size={22} /> Riwayat & Masa Aktif
      </h2>
      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="group bg-slate-950 border border-slate-800 p-5 rounded-xl hover:border-blue-500/50 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-white">{item.name}</h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.status === "Active"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 italic">
                  {item.id} • Dibeli pada {item.date}
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs text-slate-500 mb-1">Berakhir Pada:</p>
                <p
                  className={`text-sm font-bold ${item.status === "Active" ? "text-orange-400" : "text-slate-600"}`}
                >
                  {item.expiry}
                </p>
              </div>
              <button className="bg-slate-800 group-hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                Detail Akun
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
