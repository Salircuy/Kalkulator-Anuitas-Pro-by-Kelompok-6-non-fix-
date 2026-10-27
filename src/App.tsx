import React, { useState, useMemo } from 'react';
import {
  LoanInput,
  calculateAnnuity,
  formatIDR
} from './utils/annuityCalculator';
import { Navbar } from './components/Navbar';
import { LoanInputSection } from './components/LoanInputSection';
import { PaymentBreakdownChart } from './components/PaymentBreakdownChart';
import { AmortizationChart } from './components/AmortizationChart';
import { AmortizationTable } from './components/AmortizationTable';
import { MethodComparisonSection } from './components/MethodComparisonSection';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import {
  TrendingUp,
  Percent,
  Calendar,
  Wallet,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Sparkles
} from 'lucide-react';

const INITIAL_LOAN_INPUT: LoanInput = {
  principal: 250_000_000, // 250 Juta Rupiah
  annualRate: 8.0, // 8.0% per tahun
  tenorYears: 5, // 5 Tahun (60 Bulan)
  tenorMonths: 0,
  extraMonthlyPayment: 0,
  calculationMethod: 'annuity',
};

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loanInput, setLoanInput] = useState<LoanInput>(INITIAL_LOAN_INPUT);

  // Compute annuity & amortization schedule in real time
  const calculationResult = useMemo(() => {
    return calculateAnnuity(loanInput);
  }, [loanInput]);

  const handleReset = () => {
    setLoanInput(INITIAL_LOAN_INPUT);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectMethod = (method: 'annuity' | 'effective' | 'flat') => {
    setLoanInput((prev) => ({ ...prev, calculationMethod: method }));
  };

  return (
    <div className="min-h-screen bg-[#080D1A] text-slate-100 flex flex-col font-sans selection:bg-[#E11D48] selection:text-white">
      {/* 5-second Loading Screen with Team Names & Class credit */}
      {isLoading && (
        <LoadingScreen
          durationSeconds={5}
          onComplete={() => setIsLoading(false)}
        />
      )}

      {/* Top Bar with Contract: Brand - Nav Links - Action */}
      <Navbar onReset={handleReset} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner Section */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#071329] via-[#0C2147] to-[#0A1A3A] border border-slate-700/80 p-6 sm:p-8 shadow-2xl shadow-blue-950/60 overflow-hidden">
          {/* Ornamental racing glow lines */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#E11D48]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0055B8] via-[#E11D48] to-[#FACC15]" />

          <div className="relative z-10 max-w-3xl">
            {/* Clean unboxed metadata separator */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-3">
              <span className="text-[#FACC15] uppercase tracking-wider font-mono">
                SIMULASI ANUITAS PROFESIONAL
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Perbankan & Kredit</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Amortisasi Real-Time</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance">
              Kalkulator Perhitungan Anuitas Pinjaman
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Hitung cicilan bulanan anuitas tetap, analisis porsi angsuran pokok versus bunga,
              dan telusuri grafik visualisasi total pembayaran dengan tabel amortisasi lengkap hingga lunas.
            </p>

            {/* Quick KPI summary pills inside hero */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#070D1E]/80 border border-slate-700/80">
                <span className="text-[11px] text-slate-400 block font-medium">Pokok Pinjaman</span>
                <span className="text-base font-bold font-mono text-white tabular-nums">
                  {formatIDR(loanInput.principal)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#070D1E]/80 border border-slate-700/80">
                <span className="text-[11px] text-slate-400 block font-medium">Bunga Tahunan</span>
                <span className="text-base font-bold font-mono text-[#E11D48] tabular-nums">
                  {loanInput.annualRate}% p.a.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#070D1E]/80 border border-slate-700/80">
                <span className="text-[11px] text-slate-400 block font-medium">Durasi Pinjaman</span>
                <span className="text-base font-bold font-mono text-sky-400 tabular-nums">
                  {calculationResult.totalMonths} Bulan ({loanInput.tenorYears} Thn)
                </span>
              </div>

              <div className="p-3 rounded-lg bg-gradient-to-br from-[#003B7A]/80 to-[#002244]/80 border border-blue-400/40">
                <span className="text-[11px] text-[#FACC15] block font-bold">Angsuran / Bulan</span>
                <span className="text-base font-extrabold font-mono text-white tabular-nums">
                  {formatIDR(calculationResult.monthlyInstallment)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Interactive Loan Inputs & Sliders */}
        <LoanInputSection input={loanInput} onChange={setLoanInput} />

        {/* Section 2: Visualizations Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left Column: Donut & Payment Composition */}
          <div className="xl:col-span-5 w-full">
            <PaymentBreakdownChart
              result={calculationResult}
              calculationMethod={loanInput.calculationMethod || 'annuity'}
            />
          </div>

          {/* Right Column: Amortization Curve & Stacked Composition Trajectory */}
          <div className="xl:col-span-7 w-full">
            <AmortizationChart
              schedule={calculationResult.schedule}
              totalPrincipal={calculationResult.totalPrincipal}
            />
          </div>
        </div>

        {/* Section 3: Full Amortization Schedule Table */}
        <AmortizationTable
          schedule={calculationResult.schedule}
          yearlySummary={calculationResult.yearlySummary}
          principal={calculationResult.totalPrincipal}
          annualRate={loanInput.annualRate}
          tenorYears={loanInput.tenorYears}
        />

        {/* Section 4: Interest Method Comparison (Annuity vs Effective vs Flat) */}
        <MethodComparisonSection
          currentInput={loanInput}
          onSelectMethod={handleSelectMethod}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
