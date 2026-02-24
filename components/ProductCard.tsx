"use client";

import { useState } from "react";
import { ShoppingCart, Star, Loader2, Check } from "lucide-react";
import { addToCart } from "@/app/actions/cart";
import { useRouter } from "next/navigation";

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  category,
  isPopular,
  duration,
  isLoggedIn,
}: any) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk mulai belanja!");
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      await addToCart(id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error: any) {
      alert("Gagal menambahkan ke keranjang: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)] transition-all duration-300 group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
          {category}
        </span>
        {isPopular && (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg border border-yellow-500/20">
            <Star size={12} className="fill-yellow-500" /> Populer
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
        {name}
      </h3>
      <p className="text-sm text-slate-400 mb-6 flex-1">Durasi: {duration}</p>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <div className="flex items-end justify-between gap-2 mb-4">
          <div>
            {originalPrice && (
              <p className="text-xs text-slate-500 line-through mb-0.5">
                Rp {originalPrice}
              </p>
            )}
            <p className="text-xl font-black text-emerald-400">Rp {price}</p>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={loading || added}
          className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all ${
            added
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25 active:scale-95"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : added ? (
            <>
              <Check size={18} /> Berhasil!
            </>
          ) : (
            <>
              <ShoppingCart size={18} /> + Keranjang
            </>
          )}
        </button>
      </div>
    </div>
  );
}
