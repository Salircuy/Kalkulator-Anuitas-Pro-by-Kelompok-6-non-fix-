import React, { useState, useId } from 'react';
import {
  TrendingDown,
  BarChart3,
  SlidersHorizontal,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { MonthlyScheduleItem, formatIDR, formatCompactIDR } from '../utils/annuityCalculator';

interface AmortizationChartProps {
  schedule: MonthlyScheduleItem[];
  totalPrincipal: number;
}

export const AmortizationChart: React.FC<AmortizationChartProps> = ({
  schedule,
  totalPrincipal,
}) => {
  const [viewMode, setViewMode] = useState<'balance' | 'composition'>('balance');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | '60' | '120'>('all');

  const gradientId = useId();

  if (!schedule || schedule.length === 0) return null;

  // Filter schedule based on time filter
  const filteredSchedule =
    timeFilter === '60'
      ? schedule.slice(0, 60)
      : timeFilter === '120'
      ? schedule.slice(0, 120)
      : schedule;

  const dataCount = filteredSchedule.length;
  const maxBalance = totalPrincipal > 0 ? totalPrincipal : 1;

  // For composition chart, max monthly payment
  const maxMonthlyPayment = Math.max(
    ...filteredSchedule.map((s) => s.monthlyPayment),
    1
  );

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 240;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Coordinates mapping
  const getX = (index: number) => {
    if (dataCount <= 1) return paddingLeft;
    return paddingLeft + (index / (dataCount - 1)) * chartWidth;
  };

  const getYBalance = (val: number) => {
    return paddingTop + chartHeight - (val / maxBalance) * chartHeight;
  };

  // Build SVG path for remaining balance curve
  const balancePoints = filteredSchedule.map((item, idx) => ({
    x: getX(idx),
    y: getYBalance(item.remainingBalance),
  }));

  let balancePathD = '';
  if (balancePoints.length > 0) {
    balancePathD = `M ${balancePoints[0].x} ${balancePoints[0].y}`;
    for (let i = 1; i < balancePoints.length; i++) {
      balancePathD += ` L ${balancePoints[i].x} ${balancePoints[i].y}`;
    }
  }

  const balanceAreaD =
    balancePoints.length > 0
      ? `${balancePathD} L ${balancePoints[balancePoints.length - 1].x} ${
          paddingTop + chartHeight
        } L ${balancePoints[0].x} ${paddingTop + chartHeight} Z`
      : '';

  // Currently active or hovered item
  const activeItem =
    hoverIndex !== null && hoverIndex >= 0 && hoverIndex < filteredSchedule.length
      ? filteredSchedule[hoverIndex]
      : filteredSchedule[Math.floor(filteredSchedule.length / 2)] || filteredSchedule[0];

  return (
    <section id="visualisasi" className="bg-[#0B1528] rounded-xl border border-slate-700/80 shadow-2xl shadow-blue-950/40 overflow-hidden">
      {/* Header with Title and Mode Switcher */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#0C1A36] via-[#10244D] to-[#0D1C3D] border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-6 rounded-sm bg-gradient-to-b from-[#38BDF8] via-[#0055B8] to-[#E11D48]" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Grafik Perkembangan Angsuran & Saldo
            </h3>
            <p className="text-xs text-slate-400">
              Visualisasi tren amortisasi anuitas per bulan hingga lunas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex p-1 bg-[#070D1E] rounded-lg border border-slate-700/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('balance')}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'balance'
                  ? 'bg-gradient-to-r from-[#003B7A] to-[#0055B8] text-white shadow-sm border border-blue-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              Sisa Saldo
            </button>
            <button
              type="button"
              onClick={() => setViewMode('composition')}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'composition'
                  ? 'bg-gradient-to-r from-[#003B7A] to-[#0055B8] text-white shadow-sm border border-blue-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Porsi Pokok & Bunga
            </button>
          </div>

          {/* Time Span Filter if long tenor */}
          {schedule.length > 60 && (
            <div className="hidden sm:inline-flex p-1 bg-[#070D1E] rounded-lg border border-slate-700/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTimeFilter('all')}
                className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                  timeFilter === 'all'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Semua ({schedule.length} bln)
              </button>
              <button
                type="button"
                onClick={() => setTimeFilter('60')}
                className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                  timeFilter === '60'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                5 Thn Pertama
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Real-time Hover Detail Bar */}
        <div className="mb-4 p-3.5 rounded-xl bg-[#081021] border border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Bulan Ke-</span>
            <span className="text-base font-bold font-mono text-white tabular-nums">
              Bulan {activeItem.month}{' '}
              <span className="text-xs font-normal text-slate-400">
                (Tahun {activeItem.year})
              </span>
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Sisa Pokok Pinjaman</span>
            <span className="text-base font-bold font-mono text-sky-400 tabular-nums">
              {formatIDR(activeItem.remainingBalance)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#0055B8]" />
              Porsi Pokok Bulan Ini
            </span>
            <span className="text-base font-bold font-mono text-[#FACC15] tabular-nums">
              {formatIDR(activeItem.principalPayment + activeItem.extraPayment)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
              Porsi Bunga Bulan Ini
            </span>
            <span className="text-base font-bold font-mono text-[#F43F5E] tabular-nums">
              {formatIDR(activeItem.interestPayment)}
            </span>
          </div>
        </div>

        {/* Responsive Interactive SVG Canvas */}
        <div className="relative w-full aspect-[21/9] min-h-[220px] max-h-[340px]">
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              {/* Ford Racing Blue Gradient with subtle silver shimmer */}
              <linearGradient id={`${gradientId}-area`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0055B8" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#002244" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0B1528" stopOpacity="0.0" />
              </linearGradient>

              {/* Ornamental Stroke Gradient */}
              <linearGradient id={`${gradientId}-stroke`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const y = paddingTop + chartHeight * (1 - pct);
              const val =
                viewMode === 'balance'
                  ? maxBalance * pct
                  : maxMonthlyPayment * pct;

              return (
                <g key={pct}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="#1E293B"
                    strokeWidth="1"
                    strokeDasharray={pct === 0 ? 'none' : '3 3'}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-slate-400"
                  >
                    {formatCompactIDR(val)}
                  </text>
                </g>
              );
            })}

            {/* X-axis Month Intervals */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const idx = Math.min(
                Math.round((dataCount - 1) * pct),
                dataCount - 1
              );
              const item = filteredSchedule[idx];
              if (!item) return null;
              const x = getX(idx);

              return (
                <g key={pct}>
                  <line
                    x1={x}
                    y1={paddingTop + chartHeight}
                    x2={x}
                    y2={paddingTop + chartHeight + 5}
                    stroke="#475569"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={paddingTop + chartHeight + 18}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-slate-400"
                  >
                    Bln {item.month}
                  </text>
                </g>
              );
            })}

            {/* View Mode 1: Remaining Balance Curve */}
            {viewMode === 'balance' && (
              <>
                <path d={balanceAreaD} fill={`url(#${gradientId}-area)`} />
                <path
                  d={balancePathD}
                  fill="none"
                  stroke={`url(#${gradientId}-stroke)`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Hover indicator dot & vertical guide */}
                {hoverIndex !== null && hoverIndex >= 0 && hoverIndex < dataCount && (
                  <g>
                    <line
                      x1={getX(hoverIndex)}
                      y1={paddingTop}
                      x2={getX(hoverIndex)}
                      y2={paddingTop + chartHeight}
                      stroke="#FACC15"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={getX(hoverIndex)}
                      cy={getYBalance(filteredSchedule[hoverIndex].remainingBalance)}
                      r="6"
                      fill="#FACC15"
                      stroke="#070D1E"
                      strokeWidth="2.5"
                    />
                  </g>
                )}
              </>
            )}

            {/* View Mode 2: Principal vs Interest Stacked Columns */}
            {viewMode === 'composition' && (
              <g>
                {filteredSchedule.map((item, idx) => {
                  const x = getX(idx);
                  const barWidth = Math.max(
                    1.5,
                    (chartWidth / dataCount) * 0.75
                  );
                  const totalPaid = item.monthlyPayment || 1;
                  const principalH =
                    ((item.principalPayment + item.extraPayment) / maxMonthlyPayment) *
                    chartHeight;
                  const interestH = (item.interestPayment / maxMonthlyPayment) * chartHeight;

                  const baseY = paddingTop + chartHeight;
                  const pY = baseY - principalH;
                  const iY = pY - interestH;

                  return (
                    <g key={item.month}>
                      {/* Principal bar (Blue Ford) */}
                      <rect
                        x={x - barWidth / 2}
                        y={pY}
                        width={barWidth}
                        height={principalH}
                        fill="#0055B8"
                        rx="1"
                      />
                      {/* Interest bar (Red Bull Crimson) */}
                      <rect
                        x={x - barWidth / 2}
                        y={iY}
                        width={barWidth}
                        height={interestH}
                        fill="#E11D48"
                        rx="1"
                      />
                    </g>
                  );
                })}

                {/* Vertical hover line in composition mode */}
                {hoverIndex !== null && hoverIndex >= 0 && hoverIndex < dataCount && (
                  <line
                    x1={getX(hoverIndex)}
                    y1={paddingTop}
                    x2={getX(hoverIndex)}
                    y2={paddingTop + chartHeight}
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}
              </g>
            )}

            {/* Invisible overlay rects for hover tracking */}
            {filteredSchedule.map((item, idx) => {
              const xStart =
                idx === 0
                  ? paddingLeft
                  : (getX(idx - 1) + getX(idx)) / 2;
              const xEnd =
                idx === dataCount - 1
                  ? svgWidth - paddingRight
                  : (getX(idx) + getX(idx + 1)) / 2;

              return (
                <rect
                  key={idx}
                  x={xStart}
                  y={paddingTop}
                  width={Math.max(1, xEnd - xStart)}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoverIndex(idx)}
                />
              );
            })}
          </svg>
        </div>

        {/* Educational Micro-Guide for the User */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0055B8]" />
              Porsi Pokok (Makin lama makin membesar)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#E11D48]" />
              Porsi Bunga (Makin lama makin mengecil)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Arahkan kursor ke grafik untuk menelusuri data bulan tertentu
          </span>
        </div>
      </div>
    </section>
  );
};
