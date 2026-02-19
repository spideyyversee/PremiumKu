"use client";

import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  category: string;
  isPopular?: boolean;
  duration: string;
  isLoggedIn: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  category,
  isPopular,
  duration,
  isLoggedIn,
}: ProductCardProps) {
  // Fungsi sementara untuk Add to Cart
  const handleAddToCart = () => {
    alert(`Menambahkan ${name} ke keranjang... (Fitur segera hadir)`);
  };

  return (
    <div className="relative flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 group">
      
      {/* Badge Popular (Kiri Atas) */}
      {isPopular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-bl-xl rounded-tr-xl uppercase tracking-widest shadow-lg shadow-blue-500/30">
          Best Seller
        </div>
      )}

      {/* Kategori & Durasi */}
      <div className="flex items-center justify-between mb-4 text-xs mt-2">
        <span className="font-medium px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
          {category}
        </span>
        <span className="text-slate-400 font-medium flex items-center gap-1">
          ⏱ {duration}
        </span>
      </div>

      {/* Nama Produk */}
      <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
        {name}
      </h3>

      {/* Spacer agar tinggi card seragam dan tombol selalu di bawah */}
      <div className="flex-grow"></div>

      {/* Harga Area */}
      <div className="mt-4 mb-6 flex flex-col">
        {originalPrice ? (
          <span className="text-xs font-medium text-slate-500 line-through decoration-red-500/50 mb-1">
            Rp {originalPrice}
          </span>
        ) : (
          <span className="h-4"></span>
        )}
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold text-blue-400">Rp</span>
          <span className="text-3xl font-black text-white">{price}</span>
        </div>
      </div>

      {/* Tombol Aksi */}
      {isLoggedIn ? (
        <button
          onClick={handleAddToCart}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
        >
          Beli Sekarang
        </button>
      ) : (
        <Link
          href="/auth/login"
          className="w-full block text-center py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all border border-slate-700 hover:border-slate-600 active:scale-95"
        >
          Login untuk Beli
        </Link>
      )}
    </div>
  );
}