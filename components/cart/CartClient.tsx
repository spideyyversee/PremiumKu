"use client";

import { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { updateCartQuantity, removeCartItem } from "@/app/actions/cart";

export default function CartClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Hitung Total Harga
  const subTotal = items.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0,
  );
  const adminFee = items.length > 0 ? 2500 : 0; // Contoh biaya admin tetap
  const total = subTotal + adminFee;

  const handleQuantityChange = async (
    cartId: string,
    currentQty: number,
    change: number,
  ) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    setLoadingId(cartId);
    try {
      // Update UI langsung agar terasa cepat (Optimistic Update)
      setItems(
        items.map((item) =>
          item.id === cartId ? { ...item, quantity: newQty } : item,
        ),
      );
      // Update ke database
      await updateCartQuantity(cartId, newQty);
    } catch (error) {
      alert("Gagal mengupdate jumlah barang.");
      // Rollback jika error
      setItems(initialItems);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (cartId: string) => {
    setLoadingId(cartId);
    try {
      setItems(items.filter((item) => item.id !== cartId));
      await removeCartItem(cartId);
    } catch (error) {
      alert("Gagal menghapus barang.");
      setItems(initialItems);
    } finally {
      setLoadingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Keranjangmu masih kosong
        </h2>
        <p className="text-slate-400 mb-8">
          Yuk, cari aplikasi premium favoritmu dan nikmati layanannya!
        </p>
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-blue-500/25"
        >
          Mulai Belanja
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* DAFTAR BARANG */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 md:p-6 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden group"
          >
            {/* Loading Overlay per Item */}
            {loadingId === item.id && (
              <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg">
                  {item.products.category}
                </span>
                {item.products.stock_status === "out_of_stock" && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 px-2 py-1 rounded-lg">
                    Stok Habis
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {item.products.name}
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                Durasi: {item.products.duration}
              </p>
              <div className="text-xl font-black text-emerald-400">
                Rp {item.products.price.toLocaleString("id-ID")}
              </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto gap-6">
              {/* Kontrol Kuantitas */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1">
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity, -1)
                  }
                  disabled={item.quantity <= 1 || loadingId === item.id}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-bold text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity, 1)
                  }
                  disabled={loadingId === item.id}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Tombol Hapus */}
              <button
                onClick={() => handleDelete(item.id)}
                className="p-3 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
                title="Hapus Barang"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RINGKASAN BELANJA */}
      <div className="lg:col-span-1">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sticky top-24">
          <h3 className="text-lg font-bold text-white mb-6">
            Ringkasan Belanja
          </h3>

          <div className="space-y-4 mb-6 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Total Harga ({items.length} barang)</span>
              <span className="text-white font-medium">
                Rp {subTotal.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Biaya Layanan</span>
              <span className="text-white font-medium">
                Rp {adminFee.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">Total Tagihan</span>
              <span className="text-2xl font-black text-emerald-400">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95">
            <CreditCard size={20} /> Lanjut ke Pembayaran
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Transaksi aman dan terenkripsi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
