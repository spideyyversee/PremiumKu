import { createClient } from "@/utils/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SalesReport from "@/components/admin/SalesReport";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Activity,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

export default async function AdminDashboardPage() {
  // 👇 PERBAIKAN: Tambahkan 'await' di sini
  const supabase = await createClient();

  // 1. Fetch Real Stats
  const [{ count: productCount }, { count: userCount }, { data: products }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "user"),
      supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

  // Simulasi Revenue
  const totalRevenue = "Rp 0";

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm">
            Data real-time dari database Supabase.
          </p>
        </header>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total User"
            value={userCount || 0}
            icon={Users}
            color="text-purple-400"
          />
          <StatCard
            label="Total Produk"
            value={productCount || 0}
            icon={ShoppingBag}
            color="text-blue-400"
          />
          <StatCard
            label="Revenue"
            value={totalRevenue}
            icon={DollarSign}
            color="text-emerald-400"
          />
          <StatCard
            label="Status Sistem"
            value="Online"
            icon={Activity}
            color="text-orange-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* TABLE PRODUCT MANAGEMENT */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">📦 Data Produk</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Plus size={14} /> Tambah
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Nama Produk</th>
                      <th className="px-6 py-4">Harga</th>
                      <th className="px-6 py-4">Stok</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {/* 👇 Tambahkan type : any agar tidak error */}
                    {products?.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-800/30">
                        <td className="px-6 py-4 font-bold text-white">
                          {p.name} <br />
                          <span className="text-[10px] text-slate-500 font-normal">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          Rp {p.price.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-bold ${
                              p.stock_status === "in_stock"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {p.stock_status === "in_stock" ? "READY" : "HABIS"}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-2">
                          <button className="p-2 hover:bg-blue-500/10 text-blue-400 rounded">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 hover:bg-red-500/10 text-red-400 rounded">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <SalesReport />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
            {label}
          </p>
          <h3 className="text-2xl font-black text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl bg-slate-800 ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
