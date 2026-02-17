import AdminSidebar from "@/components/admin/AdminSidebar";
import StatCards from "@/components/admin/StatCards";
import ProductManagement from "@/components/admin/ProductManagement";
import SalesReport from "@/components/admin/SalesReport";

export default function AdminDashboardPage() {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm">
            Update data real-time penjualan Anda hari ini.
          </p>
        </header>

        <StatCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductManagement />
          </div>
          <div className="lg:col-span-1">
            <SalesReport />
          </div>
        </div>
      </main>
    </div>
  );
}
