import { DollarSign, ShoppingBag, Users, Activity } from "lucide-react";

export default function StatCards() {
  const stats = [
    {
      label: "Pendapatan (Bulan Ini)",
      value: "Rp 12.500.000",
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Pesanan Sukses",
      value: "432",
      icon: ShoppingBag,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Total Pelanggan",
      value: "1,205",
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Konversi",
      value: "12.5%",
      icon: Activity,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-slate-800 p-6 rounded-2xl"
        >
          <div
            className={`${stat.bg} ${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}
          >
            <stat.icon size={20} />
          </div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
            {stat.label}
          </p>
          <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
}
