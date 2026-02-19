import ProductCard from "@/components/ProductCard";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
// Tambahkan import icons dari lucide-react untuk mempercantik UI
import {
  ShieldCheck,
  Zap,
  Tags,
  Gift,
  Package,
  Smartphone,
} from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();

  // 1. Cek status login untuk diteruskan ke ProductCard (agar non-login tidak bisa checkout)
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  // 2. Ambil 4 produk untuk etalase (Katalog Resmi / Best Seller)
  // Diurutkan berdasarkan is_popular agar yang best seller tampil duluan
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("is_popular", { ascending: false })
    .limit(4);

  const features = [
    {
      icon: <ShieldCheck size={28} className="text-blue-400" />,
      title: "Transaksi Aman",
      description:
        "Pembayaran terjamin aman 100% didukung payment gateway resmi Midtrans.",
    },
    {
      icon: <Zap size={28} className="text-amber-400" />,
      title: "Aktivasi Cepat",
      description:
        "Akses akun premium dikirim otomatis ke dashboard sesaat setelah pembayaran lunas.",
    },
    {
      icon: <Tags size={28} className="text-emerald-400" />,
      title: "Harga Kompetitif",
      description:
        "Lebih terjangkau dari harga normal dengan berbagai pilihan paket sesuai kantong.",
    },
    {
      icon: <Gift size={28} className="text-pink-400" />,
      title: "Promo Menarik",
      description:
        "Nikmati diskon khusus pembeli pertama hingga potongan ekstra untuk pelanggan setia.",
    },
    {
      icon: <Package size={28} className="text-purple-400" />,
      title: "Paket Bundling",
      description:
        "Lebih hemat dengan paket bundling berbagai aplikasi premium sekaligus.",
    },
    {
      icon: <Smartphone size={28} className="text-indigo-400" />,
      title: "Transparan & Praktis",
      description:
        "Tampilan user-friendly, harga tanpa biaya tersembunyi, dan status pesanan jelas.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-blue-500/30">
      {/* HERO SECTION - Modern Clean UI */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 overflow-hidden text-center">
        {/* Background Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-[1.1] max-w-5xl z-10">
          PREMIUM <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 italic pr-2">
            TANPA LIMIT.
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-slate-400 text-lg md:text-xl mb-10 leading-relaxed font-light z-10">
          Satu tempat untuk semua kebutuhan streaming dan produktivitas kamu.
          Harga pelajar, kualitas sultan.
        </p>

        {/* Tombol Redirect ke Login */}
        <div className="flex flex-wrap justify-center gap-4 relative z-10">
          <Link
            href="/auth/login"
            className="group relative inline-flex items-center justify-center bg-white text-slate-950 px-8 py-4 rounded-full font-black text-sm tracking-wide hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-[0_0_40px_-15px_rgba(255,255,255,0.3)] hover:shadow-blue-500/25 hover:-translate-y-0.5"
          >
            MULAI BERLANGGANAN
          </Link>
        </div>
      </section>

      {/* MENGAPA MEMILIH KAMI SECTION */}
      <section
        id="features"
        className="py-24 bg-slate-900/50 border-y border-slate-800/50 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Mengapa Memilih <span className="text-blue-400">PremiumKu?</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light">
              Kami berfokus pada penyediaan layanan yang profesional dengan
              sistem otomatisasi yang memastikan setiap transaksi diproses
              dengan cepat, legal, dan akurat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 hover:bg-slate-900 transition-colors duration-300 group"
              >
                <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION - 4 Item Terlaris */}
      <section
        id="products"
        className="py-24 max-w-7xl mx-auto px-4 w-full relative z-10"
      >
        {/* PERBAIKAN DI SINI: Mengubah items-end menjadi items-start md:items-end */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 border-b border-slate-800/50 pb-6">
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20">
                Best Seller
              </span>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Katalog Resmi
              </h2>
            </div>
            <p className="text-slate-400 text-sm font-light">
              Produk tersedia langsung dari stok katalog.
            </p>
          </div>

          <Link
            href="/katalog"
            className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 group mt-4 md:mt-0"
          >
            Lihat Semua Katalog
            <span className="group-hover:translate-x-1 transition-transform">
              &rarr;
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price.toLocaleString("id-ID")}
              originalPrice={
                product.original_price
                  ? product.original_price.toLocaleString("id-ID")
                  : undefined
              }
              category={product.category}
              isPopular={true}
              duration={product.duration}
              isLoggedIn={isLoggedIn}
            />
          ))}

          {(!products || products.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed text-slate-500">
              <span className="text-4xl mb-3">📦</span>
              <p>Belum ada produk. Jalankan Seeder dulu.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
