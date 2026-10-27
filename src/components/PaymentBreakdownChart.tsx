import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  PieChart,
  Percent,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CalculationResult, formatIDR, formatCompactIDR } from '../utils/annuityCalculator';

interface PaymentBreakdownChartProps {
  result: CalculationResult;
  calculationMethod: string;
}

export const PaymentBreakdownChart: React.FC<PaymentBreakdownChartProps> = ({
  result,
  calculationMethod,
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<'principal' | 'interest' | null>(null);

  const total = result.totalPayment || 1;
  const principalShare = (result.totalPrincipal / total) * 100;
  const interestShare = (result.totalInterest / total) * 100;

  // Donut SVG parameters
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const principalDash = (principalShare / 100) * circumference;
  const interestDash = (interestShare / 100) * circumference;

  return (
    <div className="bg-[#0B1528] rounded-xl border border-slate-700/80 shadow-2xl shadow-blue-950/40 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#0C1A36] via-[#10244D] to-[#0D1C3D] border-b border-slate-700/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-6 rounded-sm bg-gradient-to-b from-[#0055B8] via-[#E11D48] to-[#FACC15]" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Visualisasi Total Pembayaran
            </h3>
            <p className="text-xs text-slate-400">
              Rasio komposisi pokok pinjaman terhadap beban akumulasi bunga
            </p>
          </div>
        </div>

        {/* Small badge */}
        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-[#070D1E] border border-slate-700 text-slate-300">
          Metode: {calculationMethod === 'flat' ? 'Flat' : calculationMethod === 'effective' ? 'Efektif' : 'Anuitas'}
        </span>
      </div>

      <div className="p-6">
        {/* Main Hero Card: Monthly Installment Highlight */}
        <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-[#002244] via-[#003875] to-[#0A1A3A] border border-blue-500/40 relative overflow-hidden shadow-lg shadow-blue-950/60">
          {/* Subtle racing stripe decor in background */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#E11D48]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FACC15] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  Angsuran Bulanan (Cicilan Tetap)
                </span>
                <span className="text-[10px] bg-[#070D1E]/80 text-slate-300 border border-slate-600/60 px-2 py-0.5 rounded font-mono">
                  Per Bulan
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight tabular-nums mt-1.5">
                {formatIDR(result.monthlyInstallment)}
              </div>
              <p className="text-xs text-slate-300/80 mt-1">
                Estimasi cicilan berkala bulanan selama {result.totalMonths} bulan (
                {(result.totalMonths / 12).toFixed(1)} tahun)
              </p>
            </div>

            {/* Quick summary strip */}
            <div className="flex items-center gap-3 sm:gap-6 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-blue-400/20 md:pl-6">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Pengembalian</span>
                <span className="text-lg font-bold text-white font-mono tabular-nums">
                  {formatIDR(result.totalPayment)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Total Bunga</span>
                <span className="text-lg font-bold text-[#E11D48] font-mono tabular-nums">
                  {formatIDR(result.totalInterest)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Donut Chart & Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Donut SVG (Left Column) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-[#081021] rounded-xl border border-slate-700/60 relative">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 180 180">
                {/* Background Track (Silver-dark) */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="20"
                  fill="transparent"
                />

                {/* Pokok Pinjaman Segment (Ford Racing Sapphire & Silver sheen) */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="url(#fordBlueGrad)"
                  strokeWidth={hoveredSegment === 'principal' ? '24' : '20'}
                  strokeDasharray={`${principalDash} ${circumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSegment('principal')}
                  onMouseLeave={() => setHoveredSegment(null)}
                />

                {/* Total Bunga Segment (Red Bull Racing Crimson) */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="url(#racingRedGrad)"
                  strokeWidth={hoveredSegment === 'interest' ? '24' : '20'}
                  strokeDasharray={`${interestDash} ${circumference}`}
                  strokeDashoffset={-principalDash}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSegment('interest')}
                  onMouseLeave={() => setHoveredSegment(null)}
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="fordBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0055B8" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                  <linearGradient id="racingRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DC2626" />
                    <stop offset="100%" stopColor="#F43F5E" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {hoveredSegment === 'principal'
                    ? 'Porsi Pokok'
                    : hoveredSegment === 'interest'
                    ? 'Porsi Bunga'
                    : 'Total Biaya'}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-white font-mono tabular-nums">
                  {hoveredSegment === 'principal'
                    ? `${principalShare.toFixed(1)}%`
                    : hoveredSegment === 'interest'
                    ? `${interestShare.toFixed(1)}%`
                    : formatCompactIDR(result.totalPayment)}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                  {hoveredSegment === 'principal'
                    ? formatCompactIDR(result.totalPrincipal)
                    : hoveredSegment === 'interest'
                    ? formatCompactIDR(result.totalInterest)
                    : `${result.totalMonths} Bulan Tenor`}
                </span>
              </div>
            </div>

            {/* Interactive Legend Below */}
            <div className="flex items-center justify-center gap-6 mt-3 text-xs">
              <button
                type="button"
                onMouseEnter={() => setHoveredSegment('principal')}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`flex items-center gap-2 transition-opacity ${
                  hoveredSegment === 'interest' ? 'opacity-40' : 'opacity-100'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-r from-[#0055B8] to-[#38BDF8] border border-blue-300/40" />
                <span className="font-semibold text-slate-200">
                  Pokok ({principalShare.toFixed(1)}%)
                </span>
              </button>

              <button
                type="button"
                onMouseEnter={() => setHoveredSegment('interest')}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`flex items-center gap-2 transition-opacity ${
                  hoveredSegment === 'principal' ? 'opacity-40' : 'opacity-100'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-r from-[#DC2626] to-[#F43F5E] border border-red-300/40" />
                <span className="font-semibold text-slate-200">
                  Bunga ({interestShare.toFixed(1)}%)
                </span>
              </button>
            </div>
          </div>

          {/* Metric Details Grid (Right Column) */}
          <div className="md:col-span-7 space-y-3">
            {/* 1. Pokok Card */}
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                hoveredSegment === 'principal'
                  ? 'bg-[#10244D] border-blue-400/80 shadow-md shadow-blue-950/50'
                  : 'bg-[#0E1B33]/80 border-slate-700/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#0055B8] ring-2 ring-blue-400/30" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Total Pokok Pinjaman (Principal)
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-sky-400 tabular-nums">
                  {principalShare.toFixed(1)}%
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-white tabular-nums">
                  {formatIDR(result.totalPrincipal)}
                </span>
                <span className="text-xs text-slate-400">Dana bersih yang diterima</span>
              </div>
            </div>

            {/* 2. Bunga Card */}
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                hoveredSegment === 'interest'
                  ? 'bg-[#2A111E] border-red-400/80 shadow-md shadow-red-950/50'
                  : 'bg-[#0E1B33]/80 border-slate-700/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#E11D48] ring-2 ring-red-400/30" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Total Beban Bunga Anuitas
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#E11D48] tabular-nums">
                  {interestShare.toFixed(1)}%
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-[#F43F5E] tabular-nums">
                  {formatIDR(result.totalInterest)}
                </span>
                <span className="text-xs text-slate-400">
                  +{result.interestPercentage}% dari modal pinjaman
                </span>
              </div>
            </div>

            {/* 3. Rasio Finansial & Durasi Pelunasan */}
            <div className="p-3.5 rounded-xl bg-[#081021] border border-slate-700/60 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">
                  Rasio Beban Bunga : Pokok
                </span>
                <span className="text-sm font-bold font-mono text-[#FACC15] tabular-nums mt-0.5 block">
                  {(result.totalInterest / (result.totalPrincipal || 1)).toFixed(2)}x Nilai Pinjaman
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">
                  Lama Waktu Hingga Lunas
                </span>
                <span className="text-sm font-bold font-mono text-white tabular-nums mt-0.5 block">
                  {result.effectivePayoffMonths} Bulan (
                  {(result.effectivePayoffMonths / 12).toFixed(1)} Thn)
                </span>
              </div>
            </div>

            {/* 4. Extra Payment Savings Badge (if extra payment active) */}
            {result.interestSaved > 0 && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Penghematan Extra Payment:</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-300 block">
                    Hemat {formatIDR(result.interestSaved)}
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    Lunas {result.timeSavedMonths} bulan lebih cepat!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
