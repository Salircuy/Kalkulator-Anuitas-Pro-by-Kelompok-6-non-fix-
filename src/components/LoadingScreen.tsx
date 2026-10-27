import React, { useState, useEffect } from 'react';
import { Calculator, Users, Sparkles, ChevronRight } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
  durationSeconds?: number;
}

const MEMBERS = [
  { name: 'Andini', no: '02', role: 'Anggota Kelompok' },
  { name: 'Azmi', no: '06', role: 'Anggota Kelompok' },
  { name: 'Danaldi', no: '08', role: 'Anggota Kelompok' },
  { name: 'Irsal', no: '11', role: 'Anggota Kelompok' },
  { name: 'Nazriel', no: '15', role: 'Anggota Kelompok' },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  durationSeconds = 5,
}) => {
  const [progress, setProgress] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(durationSeconds);

  useEffect(() => {
    const totalMs = durationSeconds * 1000;
    const intervalMs = 50;
    const step = 100 / (totalMs / intervalMs);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    // Second countdown interval
    const countdownTimer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto complete after duration
    const timeout = setTimeout(() => {
      onComplete();
    }, totalMs);

    return () => {
      clearInterval(timer);
      clearInterval(countdownTimer);
      clearTimeout(timeout);
    };
  }, [durationSeconds, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070D1E]/95 backdrop-blur-2xl text-slate-100 overflow-hidden select-none">
      {/* Dynamic blurred ambient light rings in Ford Blue, Red Bull Red & Yellow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#0055B8]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[460px] h-[460px] bg-[#E11D48]/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-[380px] h-[380px] bg-[#FACC15]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative top racing strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#002244] via-[#0055B8] via-[#E11D48] to-[#FACC15]" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-8 flex flex-col items-center text-center">
        {/* App Logo Emblem with Red Bull & Ford styling */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#003875] via-[#002244] to-[#081021] border border-blue-400/40 flex items-center justify-center shadow-2xl shadow-blue-900/80 mb-5 relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#E11D48]/30 via-transparent to-[#FACC15]/30 rounded-2xl animate-spin-slow opacity-80" />
          <Calculator className="w-8 h-8 text-white relative z-10 drop-shadow-[0_2px_8px_rgba(250,204,21,0.5)]" />
        </div>

        {/* Title & Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#FACC15] bg-yellow-500/10 border border-yellow-500/30 px-3 py-0.5 rounded-full">
            Kalkulator Anuitas Pro
          </span>
          <span className="text-slate-500 text-xs">·</span>
          <span className="text-[11px] font-semibold text-slate-300">
            Simulasi Finansial & Amortisasi
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Menyiapkan Sistem Perhitungan
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
          Aplikasi perhitungan anuitas pinjaman, visualisasi grafik, dan tabel angsuran bulanan lengkap
        </p>

        {/* Members Showcase Grid */}
        <div className="w-full mt-7 p-5 rounded-2xl bg-[#0B1528]/80 border border-slate-700/80 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Users className="w-4 h-4 text-[#FACC15]" />
              <span>Daftar Anggota Kelompok</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 font-mono">
              Kelompok 6 · Kelas XI-1
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {MEMBERS.map((m) => (
              <div
                key={m.no}
                className="p-3 rounded-xl bg-[#070D1E]/80 border border-slate-700/70 hover:border-blue-400/60 transition-all flex flex-col items-center justify-center text-center group"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#003B7A] to-[#001D40] border border-blue-400/50 flex items-center justify-center text-[11px] font-bold font-mono text-[#FACC15] mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  {m.no}
                </div>
                <div className="text-xs font-bold text-white group-hover:text-[#FACC15] transition-colors truncate w-full">
                  {m.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  ({m.no})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar & Countdown Indicator */}
        <div className="w-full mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#FACC15] animate-spin-slow" />
              Memuat data amortisasi...
            </span>
            <span className="font-bold text-white tabular-nums">
              {Math.min(100, Math.round(progress))}% · {secondsRemaining > 0 ? `${secondsRemaining}s` : 'Siap!'}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden border border-slate-700/80 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0055B8] via-[#E11D48] to-[#FACC15] transition-all duration-75 ease-out shadow-[0_0_12px_rgba(0,85,184,0.6)]"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>

        {/* Skip Button & Footer Credit */}
        <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 font-medium">
            by kelompok 6 Kelas XI-1 SMAN 1 Tasikmalaya
          </div>

          <button
            type="button"
            onClick={onComplete}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/70 rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <span>Masuk Sekarang</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#FACC15]" />
          </button>
        </div>
      </div>
    </div>
  );
};
