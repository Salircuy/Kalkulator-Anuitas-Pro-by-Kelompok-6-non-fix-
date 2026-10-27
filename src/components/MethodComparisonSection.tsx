import React from 'react';
import {
  Scale,
  CheckCircle2,
  TrendingDown,
  Info,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { calculateAnnuity, formatIDR, LoanInput } from '../utils/annuityCalculator';

interface MethodComparisonSectionProps {
  currentInput: LoanInput;
  onSelectMethod: (method: 'annuity' | 'effective' | 'flat') => void;
}

export const MethodComparisonSection: React.FC<MethodComparisonSectionProps> = ({
  currentInput,
  onSelectMethod,
}) => {
  const currentMethod = currentInput.calculationMethod || 'annuity';

  // Calculate results for all 3 methods with same principal, rate & tenor
  const annuityResult = calculateAnnuity({ ...currentInput, calculationMethod: 'annuity' });
  const effectiveResult = calculateAnnuity({ ...currentInput, calculationMethod: 'effective' });
  const flatResult = calculateAnnuity({ ...currentInput, calculationMethod: 'flat' });

  const methods = [
    {
      id: 'annuity' as const,
      name: 'Anuitas (Standar KPR)',
      tagline: 'Cicilan Bulanan Tetap & Stabil',
      installmentText: formatIDR(annuityResult.monthlyInstallment),
      installmentSubtext: 'Tetap dari bulan ke-1 hingga lunas',
      totalInterest: annuityResult.totalInterest,
      totalPayment: annuityResult.totalPayment,
      description:
        'Sistem cicilan tetap per bulan di mana pada awal periode porsi bunga lebih besar, lalu berangsur mengecil seiring membesarnya porsi pokok.',
      pros: 'Anggaran bulanan dapat diprediksi dengan pasti',
      badgeColor: 'bg-blue-950/60 text-blue-300 border-blue-500/50',
      activeBorder: 'border-blue-400 bg-[#0F224A]',
    },
    {
      id: 'effective' as const,
      name: 'Bunga Efektif (Menurun)',
      tagline: 'Cicilan Terbesar di Bulan Awal',
      installmentText: `${formatIDR(effectiveResult.schedule[0]?.monthlyPayment || 0)} → ${formatIDR(
        effectiveResult.schedule[effectiveResult.schedule.length - 1]?.monthlyPayment || 0
      )}`,
      installmentSubtext: 'Menurun bertahap tiap bulan',
      totalInterest: effectiveResult.totalInterest,
      totalPayment: effectiveResult.totalPayment,
      description:
        'Porsi angsuran pokok tetap setiap bulan, sementara bunga dihitung dari sisa saldo pokok pinjaman yang kian berkurang.',
      pros: 'Total beban bunga sedikit lebih rendah jika tenor panjang',
      badgeColor: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50',
      activeBorder: 'border-emerald-400 bg-[#0A261D]',
    },
    {
      id: 'flat' as const,
      name: 'Bunga Flat (Konvensional)',
      tagline: 'Bunga Dihitung dari Pokok Awal',
      installmentText: formatIDR(flatResult.monthlyInstallment),
      installmentSubtext: 'Sama setiap bulan',
      totalInterest: flatResult.totalInterest,
      totalPayment: flatResult.totalPayment,
      description:
        'Bunga dihitung langsung dari pokok pinjaman awal dikalikan jangka waktu. Sering dipakai pada leasing motor atau pinjaman cepat tanpa agunan.',
      pros: 'Perhitungan sangat sederhana dan cepat',
      badgeColor: 'bg-amber-950/60 text-amber-300 border-amber-500/50',
      activeBorder: 'border-amber-400 bg-[#2B1B0A]',
    },
  ];

  return (
    <section id="komparasi" className="bg-[#0B1528] rounded-xl border border-slate-700/80 shadow-2xl shadow-blue-950/40 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-[#0C1A36] via-[#10244D] to-[#0D1C3D] border-b border-slate-700/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-6 rounded-sm bg-gradient-to-b from-[#FACC15] via-[#E11D48] to-[#0055B8]" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Perbandingan Sistem Perhitungan Bunga
            </h3>
            <p className="text-xs text-slate-400">
              Evaluasi komparatif antara metode Anuitas, Efektif, dan Flat pada nominal yang sama
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {methods.map((m) => {
            const isSelected = currentMethod === m.id;

            return (
              <div
                key={m.id}
                className={`rounded-xl p-5 border transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? `${m.activeBorder} shadow-lg ring-1 ring-blue-400/40`
                    : 'bg-[#0E1A33]/70 border-slate-700/70 hover:border-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${m.badgeColor}`}
                    >
                      {m.name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#FACC15] flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3 h-3 text-[#FACC15]" />
                        AKTIF
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2.5">{m.tagline}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{m.description}</p>

                  <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Estimasi Angsuran
                      </span>
                      <span className="text-base font-bold font-mono text-white tabular-nums">
                        {m.installmentText}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{m.installmentSubtext}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Total Bunga</span>
                        <span className="font-bold text-rose-400 tabular-nums">
                          {formatIDR(m.totalInterest)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Total Bayar</span>
                        <span className="font-bold text-slate-200 tabular-nums">
                          {formatIDR(m.totalPayment)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => onSelectMethod(m.id)}
                    className={`w-full py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#0055B8] text-white shadow-sm'
                        : 'bg-[#070D1E] hover:bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isSelected ? 'Sedang Dipakai' : `Gunakan Metode ${m.id === 'annuity' ? 'Anuitas' : m.id === 'effective' ? 'Efektif' : 'Flat'}`}
                    {!isSelected && <ArrowRight className="w-3 h-3 text-slate-400" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
