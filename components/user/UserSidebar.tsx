import { History, Settings, LogOut, LayoutDashboard } from "lucide-react";

export default function UserSidebar({ activeTab, setActiveTab }: any) {
  const menus = [
    { id: "history", label: "Riwayat & Lisensi", icon: History },
    { id: "settings", label: "Edit Profil", icon: Settings },
  ];

  return (
    <div className="w-full md:w-72 bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit sticky top-24">
      <div className="flex items-center gap-4 mb-8 p-2">
        <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">
          JD
        </div>
        <div>
          <h4 className="font-bold text-white">John Doe</h4>
          <p className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold inline-block">
            PREMIUM MEMBER
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        {menus.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveTab(m.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-semibold text-sm ${
              activeTab === m.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <m.icon size={18} /> {m.label}
          </button>
        ))}
        <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-semibold text-sm mt-4">
          <LogOut size={18} /> Keluar
        </button>
      </nav>
    </div>
  );
}
