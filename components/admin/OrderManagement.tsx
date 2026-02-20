"use client";

import { useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Loader2,
  KeyRound,
} from "lucide-react";
import { approveOrder, rejectOrder } from "@/app/admin/actions";

export default function OrderManagement({ orders }: { orders: any[] }) {
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter Data
  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status === filter;
  });

  const handleOpenModal = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleApprove = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const credentials = formData.get("credentials") as string;

    try {
      await approveOrder(selectedOrder.id, credentials);
      setIsModalOpen(false);
    } catch (error: any) {
      alert("Gagal menyetujui pesanan: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    if (confirm("Yakin ingin membatalkan/menolak pesanan ini?")) {
      try {
        await rejectOrder(id);
      } catch (error: any) {
        alert("Gagal menolak pesanan: " + error.message);
      }
    }
  };

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 md:p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 w-full md:w-auto overflow-x-auto custom-scrollbar">
            {["all", "pending", "success", "failed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${
                  filter === tab
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {tab === "all" ? "Semua" : tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari Order ID..."
              className="bg-slate-950/50 border border-slate-800 text-sm rounded-2xl pl-11 pr-4 py-3 text-white outline-none focus:border-blue-500 w-full transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-8 py-5">Order ID & Waktu</th>
                <th className="px-8 py-5">Pelanggan</th>
                <th className="px-8 py-5">Produk</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-slate-500 italic"
                  >
                    Tidak ada pesanan.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr
                    key={o.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <p className="font-bold text-white mb-1">{o.order_id}</p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(o.created_at).toLocaleString("id-ID")}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-white">
                        {o.profiles?.full_name || "Guest"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {o.profiles?.phone || "No HP tidak ada"}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-blue-400">
                        {o.products?.name || "Produk Dihapus"}
                      </p>
                      <p className="text-xs font-mono text-emerald-400 mt-1">
                        Rp {o.amount.toLocaleString("id-ID")}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                          o.status === "success"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : o.status === "pending"
                              ? "bg-orange-500/10 text-orange-400"
                              : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {o.status === "success" ? (
                          <CheckCircle size={12} />
                        ) : o.status === "pending" ? (
                          <Clock size={12} />
                        ) : (
                          <XCircle size={12} />
                        )}
                        {o.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {o.status === "pending" ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(o)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/25"
                          >
                            Proses
                          </button>
                          <button
                            onClick={() => handleReject(o.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-all border border-slate-700 hover:border-red-500/50"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : o.status === "success" ? (
                        <div className="text-center text-[10px] text-slate-500">
                          Selesai
                        </div>
                      ) : (
                        <div className="text-center text-[10px] text-slate-500">
                          Dibatalkan
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PERSETUJUAN & PENGIRIMAN AKUN */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <KeyRound className="text-blue-500" /> Proses Pesanan
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApprove} className="p-6 space-y-4">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 mb-6">
                <p className="text-xs text-slate-400 mb-1">Produk Dipesan:</p>
                <p className="font-bold text-white">
                  {selectedOrder.products?.name}
                </p>
                <p className="text-xs text-slate-400 mt-3 mb-1">Pelanggan:</p>
                <p className="font-bold text-white">
                  {selectedOrder.profiles?.full_name} (
                  {selectedOrder.profiles?.phone})
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Detail Akun (Email & Password)
                </label>
                <textarea
                  required
                  name="credentials"
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="Contoh:&#10;Email: netflix_user1@gmail.com&#10;Password: Premium123!&#10;Profil: 2"
                ></textarea>
                <p className="text-[10px] text-slate-500">
                  Data ini akan dikirimkan ke dashboard pelanggan.
                </p>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Setujui & Kirim Akun"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
