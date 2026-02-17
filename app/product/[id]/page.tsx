"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle2, ShieldCheck, Zap, Star } from "lucide-react";

export default function ProductDetail() {
  const [selectedPlan, setSelectedPlan] = useState("middle");

  const plans = [
    {
      id: "basic",
      duration: "1 Bulan",
      price: 35000,
      discount: "5%",
      target: "Pengguna Baru",
    },
    {
      id: "middle",
      duration: "3 Bulan",
      price: 95000,
      discount: "10%",
      target: "Pengguna Aktif",
      popular: true,
    },
    {
      id: "premium",
      duration: "1 Tahun",
      price: 350000,
      discount: "15%",
      target: "Power User",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Kiri: Info Produk */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
              Streaming Service
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              Netflix Premium 4K + HDR
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Nikmati kualitas streaming terbaik tanpa iklan. Akun legal, bisa
              digunakan di Smart TV, Smartphone, dan Laptop. Support hingga 4
              device secara bersamaan.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {[
                "Kualitas Ultra HD (4K)",
                "Nonton Tanpa Iklan",
                "Download Film",
                "Garansi Full Durasi",
                "Akun Legal & Aman",
                "Fast Response Support",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="text-blue-500" size={20} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kanan: Card Pilihan Paket */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sticky top-24 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-white">
              Pilih Paket Berlangganan
            </h3>
            <div className="space-y-4 mb-8">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex justify-between items-center ${
                    selectedPlan === plan.id
                      ? "border-blue-500 bg-blue-500/5"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        {plan.duration}
                      </span>
                      {plan.popular && (
                        <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded-full text-white">
                          REKOMENDASI
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{plan.target}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500 line-through">
                      Rp {(plan.price * 1.2).toLocaleString()}
                    </div>
                    <div className="font-bold text-blue-400 text-lg">
                      Rp {plan.price.toLocaleString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-blue-500/25 flex justify-center items-center gap-2">
              Beli Sekarang — Rp{" "}
              {plans.find((p) => p.id === selectedPlan)?.price.toLocaleString()}
            </button>

            <div className="mt-6 flex justify-center gap-6">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck size={14} /> Terenkripsi Midtrans
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Zap size={14} /> Aktivasi Instan
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
