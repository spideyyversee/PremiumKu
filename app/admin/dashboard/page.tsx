import { createClient } from "@/utils/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SalesReport from "@/components/admin/SalesReport";
import ProductManagement from "@/components/admin/ProductManagement";
import { DollarSign, ShoppingBag, Users, Activity } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: productCount },
    { count: userCount },
    { data: products },
    { data: transactions },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "user"),
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const totalRevenue =
    transactions
      ?.filter((t) => t.status === "success")
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const displayRevenue = totalRevenue.toLocaleString("id-ID");

  const successfulOrders =
    transactions?.filter((t) => t.status === "success").length || 0;

  return (
    <div className="flex h-screen bg-slate-950 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Dashboard <span className="text-blue-500">Overview</span>
          </h1>
          <p className="text-slate-400 mt-2 font-light">
            Pantau performa bisnis dan kelola sistem secara real-time.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
          <StatCard
            label="Total Pengguna"
            value={userCount || 0}
            icon={Users}
            color="text-purple-400"
            bg="bg-purple-500/10"
          />
          <StatCard
            label="Total Produk"
            value={productCount || 0}
            icon={ShoppingBag}
            color="text-blue-400"
            bg="bg-blue-500/10"
          />
          <StatCard
            label="Pendapatan (All-Time)"
            value={`Rp ${displayRevenue}`}
            icon={DollarSign}
            color="text-emerald-400"
            bg="bg-emerald-500/10"
          />
          <StatCard
            label="Pesanan Sukses"
            value={successfulOrders}
            icon={Activity}
            color="text-orange-400"
            bg="bg-orange-500/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-200 fill-mode-both">
          <div className="lg:col-span-2">
            <ProductManagement products={products || []} />
          </div>
          <div className="lg:col-span-1">
            <SalesReport transactions={transactions || []} />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-xl group hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-2">
            {label}
          </p>
          <h3 className="text-3xl font-black text-white">{value}</h3>
        </div>
        <div className={`p-3.5 rounded-2xl ${bg} ${color} shadow-inner`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
      </div>
      <Icon
        size={120}
        className={`absolute -bottom-6 -right-6 opacity-5 ${color} group-hover:scale-110 transition-transform duration-500`}
      />
    </div>
  );
}
