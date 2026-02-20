"use client";

import {
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  KeyRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function PurchaseHistory() {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreds, setSelectedCreds] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // Ambil transaksi milik user login beserta detail produknya
      const { data, error } = await supabase
        .from("transactions")
        .select("*, products(name, duration)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (data) setTransactions(data);
      setLoading(false);
    }
    fetchTransactions();
  }, []);

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
        <p className="text-slate-400">Memuat riwayat transaksimu...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <Clock className="text-blue-500" size={26} /> Riwayat & Masa Aktif
      </h2>

      {transactions.length === 0 ? (
        <div className="text-center py-16 border border-slate-800 border-dashed rounded-2xl bg-slate-900/30">
          <p className="text-slate-500">
            Belum ada riwayat pembelian. Yuk, belanja!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((item) => (
            <div
              key={item.id}
              className="group bg-slate-950/50 border border-slate-800 p-5 md:p-6 rounded-2xl hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-lg text-white">
                      {item.products?.name || "Produk Premium"}
                    </h4>
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        item.status === "success"
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : item.status === "pending"
                            ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                            : "bg-red-500/10 border border-red-500/20 text-red-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">
                    Order ID:{" "}
                    <span className="text-slate-500">{item.order_id}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Dibeli pada {formatDate(item.created_at)}
                  </p>
                </div>

                <div className="text-left md:text-right flex-shrink-0">
                  <p className="text-xl font-black text-white mb-1">
                    {formatRupiah(item.amount)}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Durasi: {item.products?.duration || "-"}
                  </p>
                </div>

                {/* Tombol Detail Akun (Hanya muncul jika Success) */}
                {item.status === "success" && (
                  <button
                    onClick={() =>
                      setSelectedCreds(
                        selectedCreds === item.id ? null : item.id,
                      )
                    }
                    className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-blue-600 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg active:scale-95 whitespace-nowrap"
                  >
                    <KeyRound size={16} /> Detail Akun
                  </button>
                )}
              </div>

              {/* Tampilan Detail Akses (Dropdown) */}
              {selectedCreds === item.id && item.account_credentials && (
                <div className="mt-6 pt-5 border-t border-slate-800 animate-in fade-in slide-in-from-top-2">
                  <p className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-500" />{" "}
                    Kredensial Akses Premium:
                  </p>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-sm text-blue-300 break-all select-all">
                    {item.account_credentials}
                  </div>
                  <p className="text-xs text-slate-500 mt-3 flex items-start gap-1">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" /> Jangan
                    bagikan informasi akun ini kepada siapapun untuk menghindari
                    pemblokiran garansi.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
