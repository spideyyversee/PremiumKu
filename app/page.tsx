import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Zap, ShieldCheck, CreditCard, Headphones } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      {/* Hero Section */}
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
          <button className="bg-slate-900 text-white border border-slate-800 px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all">
            CARA PEMBAYARAN
          </button>
        </div>
      </section>

      {/* Product Grid */}
      <section id="products" className="py-20 max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Paling Populer
            </h2>
            <p className="text-slate-500 text-sm italic">
              Produk pilihan pelanggan setia kami.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            name="Netflix Premium"
            price="35.000"
            category="Streaming"
            isPopular={true}
            duration="30 Hari"
          />
          <ProductCard
            name="Spotify Individual"
            price="15.000"
            category="Music"
            isPopular={false}
            duration="30 Hari"
          />
          <ProductCard
            name="Youtube Premium"
            price="12.000"
            category="Video"
            isPopular={false}
            duration="30 Hari"
          />
          <ProductCard
            name="Canva Pro"
            price="10.000"
            category="Design"
            isPopular={false}
            duration="30 Hari"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
