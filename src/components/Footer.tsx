import React from 'react';
import { ShieldCheck, Info, Calculator, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#060B17] border-t border-slate-800 text-slate-400 text-xs py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Formula breakdown card */}
        <div className="p-4 rounded-xl bg-[#0B1528] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950 border border-blue-800/50 text-blue-400">
              <Calculator className="w-4 h-4 text-[#FACC15]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">
                Formula Standar Anuitas Perbankan
              </h4>
              <p className="text-[11px] text-slate-400">
                A = P × [ i(1 + i)ⁿ / ((1 + i)ⁿ - 1) ]
              </p>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            P = Pokok Pinjaman · i = Bunga Bulanan · n = Jumlah Bulan
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-[11px]">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Kalkulator simulasi perhitungan anuitas. Hasil perhitungan aktual dapat bervariasi bergantung pada kebijakan biaya provisi, administrasi, dan asuransi masing-masing lembaga perbankan.
            </span>
          </div>

          <div className="text-slate-400 whitespace-nowrap shrink-0">
            © {new Date().getFullYear()} Kalkulator Anuitas Pro · by kelompok 6 Kelas XI-1 SMAN 1 Tasikmalaya
          </div>
        </div>
      </div>
    </footer>
  );
};
