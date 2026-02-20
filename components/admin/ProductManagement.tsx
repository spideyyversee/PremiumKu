"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Search, X, Loader2, Star } from "lucide-react";
import { addProduct, updateProduct, deleteProduct } from "@/app/admin/actions";

export default function ProductManagement({ products }: { products: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenAdd = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await addProduct(formData);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      alert("Gagal menyimpan data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      await deleteProduct(id);
    }
  };

  const editData = products.find((p) => p.id === editingId);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 md:p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-white">Kelola Aplikasi</h2>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari aplikasi..."
                className="bg-slate-950/50 border border-slate-800 text-sm rounded-2xl pl-11 pr-4 py-3 text-white outline-none focus:border-blue-500 w-full transition-all"
              />
            </div>
            <button
              onClick={handleOpenAdd}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95 shrink-0"
            >
              <Plus size={18} /> Tambah
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-8 py-5">Aplikasi & Durasi</th>
                <th className="px-8 py-5">Harga</th>
                <th className="px-8 py-5 text-center">Stok</th>
                <th className="px-8 py-5 text-center">Terjual</th>
                <th className="px-8 py-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-slate-500 italic"
                  >
                    Belum ada produk.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {p.is_popular && (
                          <Star
                            size={14}
                            className="text-yellow-500 fill-yellow-500"
                          />
                        )}
                        <span className="font-bold text-white">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-blue-400 font-medium">
                          {p.duration}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-emerald-400">
                        Rp {p.price.toLocaleString("id-ID")}
                      </div>
                      {p.original_price && (
                        <div className="text-[10px] text-slate-500 line-through">
                          Rp {p.original_price.toLocaleString("id-ID")}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                          p.stock_status === "in_stock"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {p.stock_status === "in_stock" ? "READY" : "HABIS"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center font-mono font-bold text-slate-400">
                      {p.sold_count || 0}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2.5 bg-slate-800 hover:bg-blue-500 hover:text-white text-blue-400 rounded-xl transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2.5 bg-slate-800 hover:bg-red-500 hover:text-white text-red-400 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 custom-scrollbar">
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md flex justify-between items-center p-6 border-b border-slate-800 z-10">
              <h3 className="text-xl font-black text-white">
                {editingId ? "Edit Aplikasi" : "Tambah Aplikasi Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition bg-slate-800 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Nama Aplikasi
                  </label>
                  <input
                    required
                    name="name"
                    defaultValue={editData?.name}
                    type="text"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                    placeholder="Cth: Netflix Premium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Kategori
                  </label>
                  <select
                    required
                    name="category"
                    defaultValue={editData?.category || "Streaming"}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="Streaming">
                      Streaming
                    </option>
                    <option value="Music">Music</option>
                    <option value="Design">Design</option>
                    <option value="AI & Productivity">
                      AI & Productivity
                    </option>
                    <option value="Bundling">Bundling</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Deskripsi Produk
                </label>
                <textarea
                  name="description"
                  defaultValue={editData?.description}
                  rows={3}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="Jelaskan fitur, garansi, dll..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Harga Asli (Coret)
                  </label>
                  <input
                    name="original_price"
                    defaultValue={editData?.original_price}
                    type="number"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-slate-500 outline-none transition-all"
                    placeholder="Cth: 50000 (Opsional)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Harga Jual (Final)
                  </label>
                  <input
                    required
                    name="price"
                    defaultValue={editData?.price}
                    type="number"
                    className="w-full bg-slate-950/50 border border-blue-500/50 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all bg-blue-500/5"
                    placeholder="Cth: 25000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Durasi
                  </label>
                  <select
                    required
                    name="duration"
                    defaultValue={editData?.duration || "1 Bulan"}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                  >
                    <option value="1 Bulan">1 Bulan (Basic)</option>
                    <option value="3 Bulan">3 Bulan (Middle)</option>
                    <option value="6 Bulan">6 Bulan</option>
                    <option value="1 Tahun">1 Tahun (Premium)</option>
                    <option value="Lifetime">Lifetime</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Status Stok
                  </label>
                  <select
                    required
                    name="stock_status"
                    defaultValue={editData?.stock_status || "in_stock"}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                  >
                    <option value="in_stock">Tersedia</option>
                    <option value="out_of_stock">Habis</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Label Populer?
                  </label>
                  <select
                    required
                    name="is_popular"
                    defaultValue={editData?.is_popular ? "true" : "false"}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                  >
                    <option value="false">Tidak Biasa</option>
                    <option value="true">⭐ Ya, Populer</option>
                  </select>
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/25"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Simpan Produk"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
