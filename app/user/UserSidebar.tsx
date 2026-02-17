import { History, Settings, LogOut, User } from "lucide-react";

export default function UserSidebar({ activeTab, setActiveTab }: any) {
  const menus = [
    { id: "history", label: "Riwayat Pembelian", icon: History },
    { id: "settings", label: "Pengaturan Akun", icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 rounded-2xl p-6 border border-slate-800 h-fit">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800">
        <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
          JD
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">John Doe</h3>
          <p className="text-xs text-slate-500">Member Premium</p>
        </div>
      </div>
      <nav className="space-y-2">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setActiveTab(menu.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === menu.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <menu.icon size={18} />
            <span className="text-sm font-medium">{menu.label}</span>
          </button>
        ))}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all mt-4">
          <LogOut size={18} />
          <span className="text-sm font-medium">Keluar</span>
        </button>
      </nav>
    </aside>
  );
}
