import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  // 👇 PERBAIKAN 1: Tambahkan 'await'
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("is_popular", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <section className="py-24 text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
          PREMIUM <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 italic">
            TANPA LIMIT.
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-slate-400 text-lg mb-10 leading-relaxed">
          Satu tempat untuk semua kebutuhan streaming dan produktivitas kamu.
          Harga pelajar, kualitas sultan.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5">
            MULAI BERLANGGANAN
          </button>
        </div>
      </section>

      <section id="products" className="py-20 max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Katalog Resmi
            </h2>
            <p className="text-slate-500 text-sm italic">
              Produk tersedia langsung dari database.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 👇 PERBAIKAN 2: Tambahkan ': any' pada parameter product */}
          {products?.map((product: any) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price.toLocaleString("id-ID")}
              originalPrice={
                product.original_price
                  ? product.original_price.toLocaleString("id-ID")
                  : undefined
              }
              category={product.category}
              isPopular={product.is_popular}
              duration={product.duration}
            />
          ))}

          {(!products || products.length === 0) && (
            <div className="col-span-4 text-center text-slate-500 py-10">
              Belum ada produk. Jalankan Seeder dulu.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
