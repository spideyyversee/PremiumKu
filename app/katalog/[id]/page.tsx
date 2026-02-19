"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ShoppingCart,
  Zap,
} from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    checkUserAndFetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function checkUserAndFetchProduct() {
    try {
      // Cek Session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);

      // Ambil detail produk
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push(
        "/auth/login?message=Silakan login untuk menambah ke keranjang.",
      );
      return;
    }

    setAddingToCart(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // Logic Insert ke Cart Items
      const { error } = await supabase.from("cart_items").insert([
        {
          user_id: session.user.id,
          product_id: product.id,
          quantity: 1,
        },
      ]);

      if (error) throw error;

      alert("Berhasil ditambahkan ke keranjang!");
      // Nanti bisa diarahkan langsung ke halaman keranjang
      // router.push("/cart");
    } catch (error: any) {
      alert("Gagal menambahkan ke keranjang: " + error.message);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">Produk Tidak Ditemukan</h1>
        <Link href="/katalog" className="text-blue-400 hover:underline">
          &larr; Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white pb-24">
      {/* Navbar Minimalis Khusus Detail */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-6">
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800"
        >
          <ArrowLeft size={16} /> Kembali ke Katalog
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Kolom Kiri: Gambar (Opsional) & Info Detail */}
          <div className="lg:col-span-7">
            {/* Tag/Badge */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                {product.category}
              </span>
              {product.is_popular && (
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  🔥 Best Seller
                </span>
              )}
            </div>

            {/* Judul & Deskripsi */}
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
              {product.name}
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* List Keuntungan (Hardcoded untuk UI manis) */}
            <div className="space-y-4 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Yang kamu dapatkan:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300 text-sm md:text-base">
                  <CheckCircle2
                    className="text-emerald-400 shrink-0 mt-0.5"
                    size={20}
                  />
                  Akses langsung dan legal 100%
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm md:text-base">
                  <CheckCircle2
                    className="text-emerald-400 shrink-0 mt-0.5"
                    size={20}
                  />
                  Garansi penuh selama masa aktif ({product.duration})
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm md:text-base">
                  <CheckCircle2
                    className="text-emerald-400 shrink-0 mt-0.5"
                    size={20}
                  />
                  Dukungan pelanggan responsif
                </li>
              </ul>
            </div>
          </div>

          {/* Kolom Kanan: Kotak Checkout / Add to Cart */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="mb-6">
                <p className="text-slate-400 text-sm font-medium mb-1">
                  Total Harga
                </p>
                {product.original_price && (
                  <span className="text-sm font-medium text-slate-500 line-through decoration-red-500/50 block mb-1">
                    {formatRupiah(product.original_price)}
                  </span>
                )}
                <div className="text-4xl md:text-5xl font-black text-white">
                  {formatRupiah(product.price)}
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-y border-slate-800 mb-8 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-blue-400" /> Transaksi
                  Aman
                </span>
                <span className="flex items-center gap-2">
                  <Zap size={18} className="text-amber-400" /> Auto-Delivery
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <ShoppingCart size={22} />{" "}
                    {isLoggedIn ? "Tambah ke Keranjang" : "Login untuk Beli"}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500 mt-4">
                Pembayaran diproses aman oleh Midtrans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
