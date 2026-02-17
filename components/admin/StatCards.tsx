import { DollarSign, ShoppingBag, Users, Activity } from "lucide-react";

export default function StatCards() {
  const stats = [
    {
      label: "Total Pendapatan",
      value: "Rp 45.200.000",
      change: "+12%",
      icon: DollarSign,
      color: "text-emerald-400",
    },
    {
      label: "Transaksi Sukses",
      value: "1,240",
      change: "+5%",
      icon: ShoppingBag,
      color: "text-blue-400",
    },
    {
      label: "Pelanggan Aktif",
      value: "850",
      change: "+18%",
      icon: Users,
      color: "text-purple-400",
    },
    {
      label: "Konversi",
      value: "12.4%",
      change: "+2%",
      icon: Activity,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/50 transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-black text-white">{stat.value}</h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full mt-2 inline-block">
                {stat.change} vs bulan lalu
              </span>
            </div>
            <div className={`p-3 rounded-2xl bg-slate-800 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
