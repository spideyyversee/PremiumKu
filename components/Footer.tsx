export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
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
          <ul className="text-slate-400 text-sm space-y-2">
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
          <ul className="text-slate-400 text-sm space-y-2">
            <li>Hubungi WhatsApp</li>
            <li>Syarat & Ketentuan</li>
            <li>Kebijakan Privasi</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
        © 2026 PremiumKu - Dikelola Secara Profesional.
      </div>
    </footer>
  );
}
