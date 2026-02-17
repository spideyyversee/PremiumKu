import { Star, Check } from "lucide-react";

interface ProductProps {
  name: string;
  price: string;
  originalPrice?: string;
  duration: string;
  category: string;
  isPopular?: boolean;
}

export default function ProductCard({
  name,
  price,
  originalPrice,
  duration,
  category,
  isPopular,
}: ProductProps) {
  return (
    <div
      className={`relative bg-slate-800 rounded-2xl p-6 border ${isPopular ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-slate-700"} hover:transform hover:-translate-y-1 transition duration-300`}
    >
      {isPopular && (
        <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
          BEST SELLER
        </span>
      )}
      <div className="text-xs font-semibold text-blue-400 mb-2 uppercase">
        {category}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <div className="flex items-baseline space-x-2 mb-4">
        <span className="text-2xl font-bold text-white">Rp {price}</span>
        {originalPrice && (
          <span className="text-sm text-slate-500 line-through">
            Rp {originalPrice}
          </span>
        )}
      </div>
      <div className="text-sm text-slate-300 mb-6 flex items-center">
        <Check size={16} className="text-green-400 mr-2" />
        Durasi: {duration}
      </div>
      <button className="w-full bg-slate-700 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors">
        Tambah ke Keranjang
      </button>
    </div>
  );
}
