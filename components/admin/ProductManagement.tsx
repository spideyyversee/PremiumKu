import { Plus, Edit, Trash2, Search, ExternalLink } from "lucide-react";

export default function ProductManagement() {
  const products = [
    {
      id: 1,
      name: "Netflix Premium",
      cat: "Streaming",
      price: "Rp 35.000",
      stock: 120,
    },
    {
      id: 2,
      name: "Youtube Premium",
      cat: "Video",
      price: "Rp 12.000",
      stock: 45,
    },
    {
      id: 3,
      name: "Spotify Family",
      cat: "Music",
      price: "Rp 25.000",
      stock: 12,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          📦 Kelola Aplikasi
        </h2>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari aplikasi..."
              className="bg-slate-950 border border-slate-800 text-sm rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-blue-500 w-full md:w-64"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition">
            <Plus size={18} /> Tambah
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-6 py-4">Nama Produk</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4">Stok Lisensi</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {products.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4 font-bold text-white">{p.name}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-800 px-2 py-1 rounded-md text-[10px]">
                    {p.cat}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono">{p.price}</td>
                <td className="px-6 py-4">
                  <span
                    className={`font-bold ${p.stock < 20 ? "text-red-400" : "text-emerald-400"}`}
                  >
                    {p.stock} Tersedia
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
