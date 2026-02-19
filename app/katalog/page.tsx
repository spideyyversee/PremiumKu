"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Search, ShoppingBag, Loader2, Tag } from "lucide-react";
import Link from "next/link";

// Sesuaikan tipe data ini dengan kolom yang ada di tabel 'products' database kamu
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export default function KatalogPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk fitur pencarian dan filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [categories, setCategories] = useState<string[]>(["Semua"]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProducts() {
    try {
      // Ambil data dari tabel 'products'
      // Ubah nama tabel jika di database kamu namanya berbeda (misal: 'produk')
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setProducts(data);

        // Ekstrak kategori unik dari data produk untuk menu filter
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

  // Logika untuk menyaring produk berdasarkan pencarian dan kategori
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "Semua" || product.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Format harga ke Rupiah
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header Banner */}
      <div className="bg-blue-600 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
            Katalog Premiumku
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto">
            Temukan berbagai layanan dan produk premium terbaik kami. Kualitas
            terjamin dengan harga yang bersahabat.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6">
        {/* Search & Filter Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari produk premium..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p>Memuat produk...</p>
          </div>
        ) : (
          /* Product Grid */
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
                <ShoppingBag
                  className="mx-auto text-slate-600 mb-4"
                  size={48}
                />
                <h3 className="text-xl font-bold text-white mb-2">
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
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-blue-500 transition-colors duration-300 flex flex-col"
                  >
                    {/* Image Placeholder - Gunakan tag img biasa agar tidak error domain Next.js */}
                    <div className="aspect-video bg-slate-800 relative overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <ShoppingBag size={40} />
                        </div>
                      )}
                      {product.category && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
                          <Tag size={12} /> {product.category}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-grow">
                        {product.description || "Tidak ada deskripsi."}
                      </p>

                      <div className="mt-auto">
                        <div className="text-xl font-black text-blue-400 mb-4">
                          {formatRupiah(product.price)}
                        </div>
                        <Link
                          href={`/katalog/${product.id}`}
                          className="block w-full text-center bg-slate-800 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors"
                        >
                          Lihat Detail
                        </Link>
                      </div>
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
