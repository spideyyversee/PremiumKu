import { createClient } from "@/utils/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductManagement from "@/components/admin/ProductManagement";
import { PackageSearch } from "lucide-react";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex h-screen bg-slate-950 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
              <PackageSearch size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Kelola <span className="text-blue-500">Aplikasi</span>
              </h1>
              <p className="text-slate-400 mt-1 font-light">
                Tambah, ubah, atau hapus produk aplikasi premium kamu di sini.
              </p>
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100 fill-mode-both">
          <ProductManagement products={products || []} />
        </div>
      </main>
    </div>
  );
}
