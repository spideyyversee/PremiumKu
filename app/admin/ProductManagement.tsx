import { Plus, Edit, Trash2, Search } from "lucide-react";

export default function ProductManagement() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-white">Kelola Aplikasi (CRUD)</h2>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari..."
              className="bg-slate-950 border border-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 text-white outline-none focus:border-blue-500 w-full"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition">
            <Plus size={18} /> Tambah
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-6 py-4">Nama Aplikasi</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4">Stok</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">
                  Youtube Premium 1 Bln
                </td>
                <td className="px-6 py-4">Entertainment</td>
                <td className="px-6 py-4">Rp 15.000</td>
                <td className="px-6 py-4 text-green-400 font-bold">In Stock</td>
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
