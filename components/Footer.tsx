"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const whatsappNumber = "6281234567890";
  const waMessage = encodeURIComponent(
    "Halo Admin PremiumKu, saya butuh bantuan.",
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${waMessage}`;

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <footer className="bg-slate-900 border-t border-slate-800 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">PremiumKu.</h2>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              Penyedia layanan aplikasi premium legal nomor #1 di Indonesia.
              Transaksi cepat, aman, dan bergaransi penuh.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">
              Produk
            </h3>
            <ul className="text-slate-400 text-sm space-y-3">
              <li>Netflix Premium</li>
              <li>Spotify Individual</li>
              <li>Youtube Premium</li>
              <li>Canva Pro</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">
              Bantuan
            </h3>
            <ul className="text-slate-400 text-sm space-y-3">
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition cursor-pointer flex items-center"
                >
                  Hubungi WhatsApp
                </a>
              </li>
              <li>
                <button
                  onClick={() => setShowTerms(true)}
                  className="hover:text-blue-400 transition cursor-pointer text-left w-full"
                >
                  Syarat & Ketentuan
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="hover:text-blue-400 transition cursor-pointer text-left w-full"
                >
                  Kebijakan Privasi
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          © 2026 PremiumKu - Dikelola Secara Profesional.
        </div>
      </footer>

      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">
                Syarat & Ketentuan
              </h2>
              <button
                onClick={() => setShowTerms(false)}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-slate-300 space-y-4">
              <p>
                <strong>1. Umum</strong>
                <br />
                Dengan membeli produk di PremiumKu, Anda menyetujui seluruh
                syarat dan ketentuan yang berlaku.
              </p>
              <p>
                <strong>2. Pembayaran</strong>
                <br />
                Transaksi yang telah diproses dan berhasil tidak dapat
                dikembalikan (No Refund) kecuali ada kesalahan dari pihak kami.
              </p>
              <p>
                <strong>3. Garansi</strong>
                <br />
                Garansi berlaku penuh selama masa aktif paket. Klaim garansi
                wajib menunjukkan bukti transaksi yang sah kepada admin kami.
              </p>
              <p>
                <strong>4. Pelanggaran</strong>
                <br />
                Untuk produk *sharing*, dilarang keras mengubah password atau
                membagikan profil Anda kepada pihak lain. Pelanggaran akan
                berakibat hangusnya garansi.
              </p>
            </div>
            <div className="p-5 border-t border-slate-800 text-right">
              <button
                onClick={() => setShowTerms(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">
                Kebijakan Privasi
              </h2>
              <button
                onClick={() => setShowPrivacy(false)}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-slate-300 space-y-4">
              <p>
                Di PremiumKu, privasi Anda adalah prioritas kami. Kebijakan
                Privasi ini menjelaskan bagaimana kami mengumpulkan dan
                melindungi data Anda.
              </p>
              <p>
                <strong>1. Pengumpulan Data</strong>
                <br />
                Kami hanya mengumpulkan informasi yang diperlukan untuk
                kelancaran transaksi, seperti alamat email, nama, dan detail
                pesanan.
              </p>
              <p>
                <strong>2. Keamanan Data</strong>
                <br />
                Informasi akun dan pembayaran Anda dienkripsi dengan standar
                keamanan tinggi. Kami tidak pernah membagikan atau menjual data
                pribadi Anda ke pihak ketiga manapun.
              </p>
              <p>
                <strong>3. Penggunaan Cookies</strong>
                <br />
                Website kami mungkin menggunakan cookies esensial untuk menjaga
                agar Anda tetap login (sesi pengguna).
              </p>
            </div>
            <div className="p-5 border-t border-slate-800 text-right">
              <button
                onClick={() => setShowPrivacy(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
