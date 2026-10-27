import React, { useState } from 'react';
import {
  Coins,
  Percent,
  Calendar,
  Layers,
  Sparkles,
  TrendingDown,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { LoanInput, formatIDR } from '../utils/annuityCalculator';

interface LoanInputSectionProps {
  input: LoanInput;
  onChange: (newInput: LoanInput) => void;
}

const PRESET_LOANS = [
  {
    title: 'KPR Rumah',
    subtitle: 'Kredit Pemilikan Rumah',
    principal: 500_000_000,
    annualRate: 7.5,
    tenorYears: 15,
    tenorMonths: 0,
    badgeColor: 'border-blue-500/50 bg-blue-950/40 text-blue-300',
  },
  {
    title: 'Kredit Mobil Baru',
    subtitle: 'Pembiayaan Kendaraan',
    principal: 250_000_000,
    annualRate: 6.25,
    tenorYears: 5,
    tenorMonths: 0,
    badgeColor: 'border-yellow-500/50 bg-yellow-950/40 text-yellow-300',
  },
  {
    title: 'Modal Usaha UMKM',
    subtitle: 'Kredit Usaha / Investasi',
    principal: 100_000_000,
    annualRate: 8.5,
    tenorYears: 3,
    tenorMonths: 0,
    badgeColor: 'border-red-500/50 bg-red-950/40 text-red-300',
  },
  {
    title: 'Pinjaman Multiguna',
    subtitle: 'KTA / Dana Cepat',
    principal: 30_000_000,
    annualRate: 11.0,
    tenorYears: 2,
    tenorMonths: 0,
    badgeColor: 'border-slate-500/50 bg-slate-800/40 text-slate-300',
  },
];

const QUICK_AMOUNTS = [
  { label: '25 Jt', value: 25_000_000 },
  { label: '50 Jt', value: 50_000_000 },
  { label: '100 Jt', value: 100_000_000 },
  { label: '250 Jt', value: 250_000_000 },
  { label: '500 Jt', value: 500_000_000 },
  { label: '1 M', value: 1_000_000_000 },
  { label: '2 M', value: 2_000_000_000 },
];

const QUICK_TENORS = [
  { label: '1 Th', years: 1 },
  { label: '2 Th', years: 2 },
  { label: '3 Th', years: 3 },
  { label: '5 Th', years: 5 },
  { label: '10 Th', years: 10 },
  { label: '15 Th', years: 15 },
  { label: '20 Th', years: 20 },
  { label: '25 Th', years: 25 },
];

export const LoanInputSection: React.FC<LoanInputSectionProps> = ({ input, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Raw input string for principal to allow easy typing
  const [rawPrincipalText, setRawPrincipalText] = useState(input.principal.toString());

  const handlePrincipalChange = (val: number) => {
    const clamped = Math.max(1_000_000, Math.min(10_000_000_000, val));
    setRawPrincipalText(clamped.toString());
    onChange({ ...input, principal: clamped });
  };

  const handleRateChange = (val: number) => {
    const clamped = Math.max(0.1, Math.min(35, Number(val.toFixed(2))));
    onChange({ ...input, annualRate: clamped });
  };

  const handleTenorYearsChange = (years: number) => {
    const clamped = Math.max(1, Math.min(30, years));
    onChange({ ...input, tenorYears: clamped, tenorMonths: 0 });
  };

  const handleExtraPaymentChange = (val: number) => {
    onChange({ ...input, extraMonthlyPayment: Math.max(0, val) });
  };

  const handleMethodChange = (method: 'annuity' | 'effective' | 'flat') => {
    onChange({ ...input, calculationMethod: method });
  };

  const applyPreset = (preset: typeof PRESET_LOANS[0]) => {
    setRawPrincipalText(preset.principal.toString());
    onChange({
      ...input,
      principal: preset.principal,
      annualRate: preset.annualRate,
      tenorYears: preset.tenorYears,
      tenorMonths: preset.tenorMonths,
      extraMonthlyPayment: 0,
    });
  };

  const totalCalculatedMonths = input.tenorYears * 12 + (input.tenorMonths || 0);

  return (
    <section id="kalkulator" className="bg-[#0B1528] rounded-xl border border-slate-700/80 shadow-2xl shadow-blue-950/40 overflow-hidden">
      {/* Header Accent Bar with Ford Blue and Red Bull Red/Gold ornamental touches */}
      <div className="relative px-6 py-5 bg-gradient-to-r from-[#0C1A36] via-[#10244D] to-[#0D1C3D] border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-7 rounded-sm bg-gradient-to-b from-[#FACC15] via-[#E11D48] to-[#0055B8]" />
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Parameter Pinjaman & Bunga
            </h2>
            <p className="text-xs text-slate-400">
              Sesuaikan nilai pokok, suku bunga anuitas, dan jangka waktu pinjaman secara interaktif
            </p>
          </div>
        </div>

        {/* Method Selector Tabs */}
        <div className="inline-flex items-center p-1 bg-[#070D1E] rounded-lg border border-slate-700/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleMethodChange('annuity')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              (input.calculationMethod || 'annuity') === 'annuity'
                ? 'bg-gradient-to-r from-[#003B7A] to-[#0055B8] text-white shadow-sm border border-blue-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Anuitas (Cicilan Tetap)
          </button>
          <button
            type="button"
            onClick={() => handleMethodChange('effective')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              input.calculationMethod === 'effective'
                ? 'bg-gradient-to-r from-[#003B7A] to-[#0055B8] text-white shadow-sm border border-blue-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Efektif (Menurun)
          </button>
          <button
            type="button"
            onClick={() => handleMethodChange('flat')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              input.calculationMethod === 'flat'
                ? 'bg-gradient-to-r from-[#003B7A] to-[#0055B8] text-white shadow-sm border border-blue-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bunga Flat
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Preset Cards for Quick Starting */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
              Preset Simulasi Cepat
            </label>
            <span className="text-[11px] text-slate-400">Pilih skenario siap pakai</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PRESET_LOANS.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-left p-3 rounded-lg bg-[#0E1B33]/80 hover:bg-[#132444] border border-slate-700/60 hover:border-slate-500/80 transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#FACC15] transition-colors truncate">
                  {preset.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{preset.subtitle}</div>
                <div className="text-[11px] font-mono text-slate-300 mt-1.5 tabular-nums font-semibold flex items-center justify-between">
                  <span>{formatIDR(preset.principal)}</span>
                  <span className="text-[#FACC15]">{preset.annualRate}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Input Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* 1. Pokok Pinjaman (Principal) */}
          <div className="bg-[#0E1A33]/70 p-4 rounded-xl border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#FACC15]" />
                Pokok Pinjaman
              </label>
              <span className="text-xs font-mono font-bold text-slate-200">IDR (Rupiah)</span>
            </div>

            {/* Input Display Box */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                Rp
              </div>
              <input
                type="text"
                value={Number(rawPrincipalText).toLocaleString('id-ID')}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  const num = Number(raw) || 0;
                  setRawPrincipalText(num.toString());
                  onChange({ ...input, principal: num });
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-[#070D1E] border border-slate-600/80 rounded-lg text-white font-mono font-bold text-lg tracking-tight focus:outline-none focus:border-[#0055B8] focus:ring-1 focus:ring-[#0055B8] tabular-nums"
                placeholder="0"
              />
            </div>

            {/* Range Slider for Principal */}
            <div className="space-y-1.5 pt-1">
              <input
                type="range"
                min="5000000"
                max="3000000000"
                step="5000000"
                value={input.principal}
                onChange={(e) => handlePrincipalChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>5 Jt</span>
                <span>1 M</span>
                <span>3 M</span>
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt.label}
                  type="button"
                  onClick={() => handlePrincipalChange(amt.value)}
                  className={`px-2 py-1 text-[11px] font-mono font-medium rounded border transition-all cursor-pointer ${
                    input.principal === amt.value
                      ? 'bg-[#003B7A] border-[#0055B8] text-white font-bold'
                      : 'bg-[#0A1224] border-slate-700/80 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {amt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Suku Bunga Tahunan (% / Tahun) */}
          <div className="bg-[#0E1A33]/70 p-4 rounded-xl border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Percent className="w-4 h-4 text-[#E11D48]" />
                Suku Bunga Anuitas
              </label>
              <span className="text-xs font-mono font-bold text-[#E11D48] bg-[#E11D48]/10 px-2 py-0.5 rounded border border-[#E11D48]/30">
                {(input.annualRate / 12).toFixed(3)}% / bln
              </span>
            </div>

            {/* Direct Input & Stepper */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="35"
                  value={input.annualRate}
                  onChange={(e) => handleRateChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-[#070D1E] border border-slate-600/80 rounded-lg text-white font-mono font-bold text-lg tracking-tight focus:outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] tabular-nums"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  % p.a.
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => handleRateChange(input.annualRate + 0.25)}
                  className="px-2.5 py-1 text-xs font-bold bg-[#070D1E] hover:bg-slate-800 text-slate-200 border border-slate-700 rounded cursor-pointer"
                  title="Tambah 0.25%"
                >
                  +0.25
                </button>
                <button
                  type="button"
                  onClick={() => handleRateChange(input.annualRate - 0.25)}
                  className="px-2.5 py-1 text-xs font-bold bg-[#070D1E] hover:bg-slate-800 text-slate-200 border border-slate-700 rounded cursor-pointer"
                  title="Kurang 0.25%"
                >
                  -0.25
                </button>
              </div>
            </div>

            {/* Range Slider for Rate */}
            <div className="space-y-1.5 pt-1">
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.1"
                value={input.annualRate}
                onChange={(e) => handleRateChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>0.5%</span>
                <span>10%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Quick Rate Shortcuts */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[5.0, 6.75, 7.5, 8.5, 10.0, 12.5].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => handleRateChange(rate)}
                  className={`px-2 py-1 text-[11px] font-mono font-medium rounded border transition-all cursor-pointer ${
                    input.annualRate === rate
                      ? 'bg-[#E11D48]/30 border-[#E11D48] text-white font-bold'
                      : 'bg-[#0A1224] border-slate-700/80 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          {/* 3. Durasi / Tenor Pinjaman */}
          <div className="bg-[#0E1A33]/70 p-4 rounded-xl border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#38BDF8]" />
                Durasi Pinjaman (Tenor)
              </label>
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-600/30">
                {totalCalculatedMonths} Bulan
              </span>
            </div>

            {/* Single clean Tenor (Tahun) Input */}
            <div className="relative">
              <input
                type="number"
                min="1"
                max="30"
                value={input.tenorYears}
                onChange={(e) => handleTenorYearsChange(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 bg-[#070D1E] border border-slate-600/80 rounded-lg text-white font-mono font-bold text-lg tracking-tight focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 tabular-nums"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                Tahun
              </span>
            </div>

            {/* Range Slider for Tenor Years */}
            <div className="space-y-1.5 pt-1">
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={input.tenorYears}
                onChange={(e) => handleTenorYearsChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>1 Th</span>
                <span>15 Th</span>
                <span>30 Th</span>
              </div>
            </div>

            {/* Quick Tenor Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_TENORS.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => handleTenorYearsChange(t.years)}
                  className={`px-2 py-1 text-[11px] font-mono font-medium rounded border transition-all cursor-pointer ${
                    input.tenorYears === t.years
                      ? 'bg-sky-900/60 border-sky-400 text-white font-bold'
                      : 'bg-[#0A1224] border-slate-700/80 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Simulation Collapsible: Pelunasan Dipercepat & Extra Payment */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-[#FACC15]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#FACC15]" />
            )}
            <span>Simulasi Pelunasan Dipercepat / Angsuran Tambahan Bulanan (Opsional)</span>
            <span className="text-[11px] font-normal text-slate-400 ml-1">
              (Hitung penghematan bunga anuitas)
            </span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-[#081021] rounded-xl border border-slate-700/70 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/30 text-[#FACC15] shrink-0 mt-0.5">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white">
                    Pembayaran Pokok Tambahan Per Bulan (Extra Monthly Principal)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Membayar lebih dari cicilan pokok setiap bulan akan langsung memotong sisa pokok pinjaman,
                    mengurangi bunga akumulatif secara drastis, dan melunasi kredit lebih awal.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Nominal Tambahan per Bulan
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={Number(input.extraMonthlyPayment || 0).toLocaleString('id-ID')}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        handleExtraPaymentChange(Number(raw) || 0);
                      }}
                      className="w-full pl-9 pr-3 py-2 bg-[#060B18] border border-slate-700 rounded-lg text-white font-mono font-bold text-sm focus:outline-none focus:border-yellow-400"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-end gap-2 pb-0.5">
                  {[500_000, 1_000_000, 2_000_000, 5_000_000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleExtraPaymentChange(amt)}
                      className={`px-2.5 py-2 text-xs font-mono rounded border transition-colors cursor-pointer ${
                        input.extraMonthlyPayment === amt
                          ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 font-bold'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      +{amt >= 1_000_000 ? `${amt / 1_000_000} Jt` : `${amt / 1000} Rb`}
                    </button>
                  ))}
                  {input.extraMonthlyPayment && input.extraMonthlyPayment > 0 ? (
                    <button
                      type="button"
                      onClick={() => handleExtraPaymentChange(0)}
                      className="px-2.5 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 border border-rose-900/50 rounded bg-rose-950/20 cursor-pointer"
                    >
                      Reset
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
