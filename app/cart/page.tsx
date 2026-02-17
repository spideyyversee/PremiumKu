"use client";

import Navbar from "@/components/Navbar";
import { Trash2, Ticket, Lock } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          Selesaikan Pesanan{" "}
          <span className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-400 font-normal">
            2 Item
          </span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* List Item */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex gap-4"
              >
                <div className="w-20 h-20 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-blue-500 italic">
                  APP
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-white">
                      Netflix Premium (3 Bulan)
                    </h3>
                    <button className="text-slate-500 hover:text-red-400">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-slate-500">
                    Paket Middle - Diskon 10% Terpasang
                  </p>
                  <div className="mt-4 font-bold text-white">Rp 95.000</div>
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan & Promo */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="font-bold mb-4 text-white">Gunakan Promo</h3>
              <div className="relative mb-4">
                <Ticket
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Kode Promo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 transition"
                />
              </div>
              <div className="text-[10px] text-blue-400 font-bold bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                PROMO AKTIF: Diskon First Buyer 10% Berhasil Diterapkan!
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="font-bold mb-4 text-white">
                Ringkasan Pembayaran
              </h3>
              <div className="space-y-3 text-sm border-b border-slate-800 pb-4 mb-4">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>Rp 190.000</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Diskon First Buyer (10%)</span>
                  <span>- Rp 19.000</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Biaya Layanan</span>
                  <span>Rp 2.500</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-white">Total Bayar</span>
                <span className="text-2xl font-extrabold text-blue-500">
                  Rp 173.500
                </span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition">
                <Lock size={18} /> Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
