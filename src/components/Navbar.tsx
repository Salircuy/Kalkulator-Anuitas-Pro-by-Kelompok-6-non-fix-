import React from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onPrint?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070D1E]/95 backdrop-blur-md border-b border-slate-700/60 transition-all">
      {/* Decorative top racing strip with Ford Blue, Red Bull Yellow & Red accents */}
      <div className="h-1 w-full bg-gradient-to-r from-[#002244] via-[#0055B8] via-[#E11D48] to-[#FACC15]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark with racing emblem */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#003875] to-[#001D40] border border-slate-600/80 flex items-center justify-center shadow-lg shadow-blue-950/60 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E11D48]/20 to-[#FACC15]/20 opacity-70 group-hover:opacity-100 transition-opacity" />
            <Calculator className="w-5 h-5 text-slate-100 relative z-10" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            ANUITAS<span className="text-[#FACC15] font-black">PRO</span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-300 border border-slate-600/80 bg-slate-800/80 px-2 py-0.5 rounded">
              FINANCE
            </span>
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#kalkulator"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline decoration-[#E11D48] decoration-2 underline-offset-4"
          >
            Kalkulator
          </a>
          <a
            href="#visualisasi"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline decoration-[#0055B8] decoration-2 underline-offset-4"
          >
            Grafik Pembayaran
          </a>
          <a
            href="#tabel-angsuran"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline decoration-[#FACC15] decoration-2 underline-offset-4"
          >
            Tabel Angsuran
          </a>
          <a
            href="#komparasi"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline decoration-slate-400 decoration-2 underline-offset-4"
          >
            Perbandingan Bunga
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onReset}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#003B7A] via-[#0055B8] to-[#0066CC] hover:from-[#004A99] hover:to-[#0077EE] border border-blue-400/40 rounded-md transition-all shadow-md shadow-blue-950/80 whitespace-nowrap shrink-0 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Hitung Ulang
          </button>
        </div>
      </div>
    </header>
  );
};
