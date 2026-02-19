"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Search, ShoppingBag, Loader2, Tag, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string;
  duration: string;
  is_popular: boolean;
}

export default function KatalogPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [categories, setCategories] = useState<string[]>(["Semua"]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setProducts(data);
        const uniqueCategories = Array.from(
          new Set(data.map((item) => item.category).filter(Boolean)),
        );
        setCategories(["Semua", ...uniqueCategories]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "Semua" || product.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30 pb-24">
      {/* Header Banner - Modern UI */}
      <div className="relative pt-24 pb-16 px-4 overflow-hidden border-b border-slate-800/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Katalog{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              PremiumKu
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-light">
            Temukan berbagai layanan premium terbaik kami. Kualitas terjamin
            dengan harga yang bersahabat untuk semua kebutuhan digitalmu.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Search & Filter Section */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari produk premium..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500">
            <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
            <p className="animate-pulse">Memuat katalog...</p>
          </div>
        ) : (
          /* Product Grid */
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-slate-900/30 border border-slate-800 border-dashed rounded-3xl">
                <ShoppingBag
                  className="mx-auto text-slate-600 mb-6"
                  size={56}
                />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Produk tidak ditemukan
                </h3>
                <p className="text-slate-500">
                  Coba gunakan kata kunci atau kategori lain.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="relative flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 group"
                  >
                    {product.is_popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-bl-xl rounded-tr-xl uppercase tracking-widest shadow-lg shadow-blue-500/30">
                        Populer
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4 text-xs mt-2">
                      <span className="font-medium px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                        {product.category}
                      </span>
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        ⏱ {product.duration || "30 Hari"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-sm text-slate-400 mb-6 line-clamp-2 flex-grow">
                      {product.description || "Tidak ada deskripsi."}
                    </p>

                    <div className="mt-auto">
                      <div className="mb-4 flex flex-col">
                        {product.original_price ? (
                          <span className="text-xs font-medium text-slate-500 line-through decoration-red-500/50 mb-1">
                            {formatRupiah(product.original_price)}
                          </span>
                        ) : (
                          <span className="h-4"></span>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-white">
                            {formatRupiah(product.price)}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/katalog/${product.id}`}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-800 hover:bg-blue-600 text-white font-bold text-sm transition-all border border-slate-700 hover:border-transparent group-hover:shadow-lg active:scale-95"
                      >
                        Lihat Detail <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
