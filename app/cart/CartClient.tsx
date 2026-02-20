"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import {
  updateCartQuantity,
  removeCartItem,
  clearCart,
} from "@/app/actions/cart"; // ✅ IMPORT clearCart
import { processCheckout } from "@/app/actions/checkout";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Deklarasi Window Snap untuk TypeScript
declare global {
  interface Window {
    snap: any;
  }
}

export default function CartClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  // ✅ LOAD SCRIPT MIDTRANS SAAT HALAMAN DIBUKA
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    // Masukkan Client Key Sandbox kamu di sini (atau ambil dari env)
    const clientKey =
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-XXXXX";

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ✅ KALKULASI HARGA + BIAYA LAYANAN 10%
  const subTotal = items.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0,
  );
  const adminFee = Math.round(subTotal * 0.1); // 10% Biaya Layanan
  const total = subTotal + adminFee;

  const handleUpdate = async (
    id: string,
    currentQty: number,
    change: number,
  ) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    setLoadingId(id);
    try {
      await updateCartQuantity(id, newQty);
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item,
        ),
      );
    } catch (error: any) {
      alert("Gagal update kuantitas: " + error.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemove = async (id: string) => {
    setLoadingId(id);
    try {
      await removeCartItem(id);
      setItems(items.filter((item) => item.id !== id));
    } catch (error: any) {
      alert("Gagal hapus item: " + error.message);
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ PROSES CHECKOUT & MUNCULKAN POPUP MIDTRANS
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // 1. Dapatkan Snap Token dari Backend kita
      const token = await processCheckout();

      // 2. Panggil Popup Snap Midtrans
      window.snap.pay(token, {
        onSuccess: async function (result: any) {
          try {
            // 👇 Hapus semua isi keranjang setelah sukses bayar!
            await clearCart();
            alert("Pembayaran Berhasil! Pesanan kamu sedang diproses.");
            router.push("/user/dashboard"); // Arahkan ke dashboard user
          } catch (err) {
            console.error("Gagal mengosongkan keranjang", err);
          }
        },
        onPending: function (result: any) {
          alert(
            "Menunggu pembayaran. Silakan selesaikan instruksi pembayaran.",
          );
          router.push("/user/dashboard");
        },
        onError: function (result: any) {
          alert("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: function () {
          alert("Kamu menutup popup sebelum menyelesaikan pembayaran.");
        },
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Jika keranjang kosong
  if (items.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-16 text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Keranjang Masih Kosong
        </h2>
        <p className="text-slate-400 mb-8 max-w-md">
          Yuk, cari aplikasi premium yang kamu butuhkan dan nikmati akses tanpa
          batas sekarang juga!
        </p>
        <Link
          href="/katalog"
          className="bg-white text-slate-950 font-black text-sm tracking-wide py-4 px-8 rounded-full hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_30px_-10px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
        >
          LIHAT KATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* KIRI: Daftar Item Keranjang */}
      <div className="flex-1 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:border-slate-700"
          >
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md mb-2 inline-block">
                {item.products.category}
              </span>
              <h3 className="text-lg font-bold text-white leading-tight mb-1">
                {item.products.name}
              </h3>
              <p className="text-sm text-slate-400 mb-2">
                Durasi: {item.products.duration}
              </p>
              <p className="text-lg font-black text-emerald-400">
                Rp {item.products.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-800 sm:border-0">
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                <button
                  onClick={() => handleUpdate(item.id, item.quantity, -1)}
                  disabled={loadingId === item.id || item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-50 transition"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-bold text-white text-sm">
                  {loadingId === item.id ? (
                    <Loader2
                      size={14}
                      className="animate-spin mx-auto text-slate-500"
                    />
                  ) : (
                    item.quantity
                  )}
                </span>
                <button
                  onClick={() => handleUpdate(item.id, item.quantity, 1)}
                  disabled={loadingId === item.id}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-50 transition"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() => handleRemove(item.id)}
                disabled={loadingId === item.id}
                className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors disabled:opacity-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* KANAN: Ringkasan Pembayaran */}
      <div className="w-full lg:w-96">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sticky top-24 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6">
            Ringkasan Belanja
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-slate-400">
              <span>
                Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} Item)
              </span>
              <span className="text-white font-medium">
                Rp {subTotal.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Biaya Layanan (10%)</span>
              <span className="text-orange-400 font-medium">
                + Rp {adminFee.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">Total Tagihan</span>
              <span className="text-2xl font-black text-emerald-400">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-black text-sm tracking-wide py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            {isCheckingOut ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                BAYAR SEKARANG{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <ShoppingBag size={14} />
            Pembayaran Aman oleh Midtrans
          </div>
        </div>
      </div>
    </div>
  );
}
