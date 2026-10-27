import React, { useState, useMemo } from 'react';
import {
  Table,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileSpreadsheet,
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import {
  MonthlyScheduleItem,
  YearlySummaryItem,
  formatIDR,
  generateScheduleCSV,
  downloadCSV
} from '../utils/annuityCalculator';

interface AmortizationTableProps {
  schedule: MonthlyScheduleItem[];
  yearlySummary: YearlySummaryItem[];
  principal: number;
  annualRate: number;
  tenorYears: number;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  schedule,
  yearlySummary,
  principal,
  annualRate,
  tenorYears,
}) => {
  const [viewType, setViewType] = useState<'monthly' | 'yearly'>('monthly');
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(24);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter schedule based on search query
  const filteredMonthly = useMemo(() => {
    let list = schedule;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (row) =>
          row.month.toString() === q ||
          `bulan ${row.month}`.includes(q) ||
          `tahun ${row.year}`.includes(q) ||
          `th ${row.year}`.includes(q)
      );
    }

    if (sortDirection === 'desc') {
      return [...list].reverse();
    }

    return list;
  }, [schedule, searchQuery, sortDirection]);

  // Pagination calculations
  const totalPages =
    rowsPerPage === -1
      ? 1
      : Math.ceil(filteredMonthly.length / (rowsPerPage || 24)) || 1;

  const paginatedSchedule = useMemo(() => {
    if (rowsPerPage === -1) return filteredMonthly;
    const start = (currentPage - 1) * rowsPerPage;
    return filteredMonthly.slice(start, start + rowsPerPage);
  }, [filteredMonthly, currentPage, rowsPerPage]);

  const handleExportCSV = () => {
    const csvContent = generateScheduleCSV(schedule, principal, annualRate, tenorYears);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadCSV(csvContent, `jadwal-angsuran-anuitas-${principal}-${dateStr}.csv`);
  };

  return (
    <section id="tabel-angsuran" className="bg-[#0B1528] rounded-xl border border-slate-700/80 shadow-2xl shadow-blue-950/40 overflow-hidden">
      {/* Header bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#0C1A36] via-[#10244D] to-[#0D1C3D] border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-6 rounded-sm bg-gradient-to-b from-[#E11D48] via-[#FACC15] to-[#0055B8]" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Tabel Angsuran Bulanan Lengkap
            </h3>
            <p className="text-xs text-slate-400">
              Jadwal amortisasi periodik, alokasi pokok, bunga, dan sisa saldo pinjaman
            </p>
          </div>
        </div>

        {/* Action Controls: View Type & CSV Export */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle */}
          <div className="inline-flex p-1 bg-[#070D1E] rounded-lg border border-slate-700/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setViewType('monthly');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                viewType === 'monthly'
                  ? 'bg-gradient-to-r from-[#003B7A] to-[#0055B8] text-white shadow-sm border border-blue-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Per Bulan ({schedule.length})
            </button>
            <button
              type="button"
              onClick={() => setViewType('yearly')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                viewType === 'yearly'
                  ? 'bg-gradient-to-r from-[#003B7A] to-[#0055B8] text-white shadow-sm border border-blue-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Ringkasan Tahunan ({yearlySummary.length})
            </button>
          </div>

          {/* Download CSV button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-100 bg-[#002B59] hover:bg-[#003875] border border-blue-400/40 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
            title="Unduh jadwal lengkap format CSV/Excel"
          >
            <Download className="w-3.5 h-3.5 text-[#FACC15]" />
            Unduh CSV
          </button>
        </div>
      </div>

      {/* Filter / Search Sub-Bar (for Monthly view) */}
      {viewType === 'monthly' && (
        <div className="px-6 py-3 bg-[#081021] border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari bulan (misal: 12) atau tahun..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 bg-[#060B18] border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Toggle */}
            <button
              type="button"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#060B18] border border-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
            >
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <span>Urutan: {sortDirection === 'asc' ? 'Bulan 1 → Akhir' : 'Bulan Akhir → 1'}</span>
            </button>

            {/* Rows per page */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Tampilkan:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#060B18] border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value={12}>12 Bulan (1 Thn)</option>
                <option value={24}>24 Bulan (2 Thn)</option>
                <option value={60}>60 Bulan (5 Thn)</option>
                <option value={-1}>Tampilkan Semua</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="overflow-x-auto">
        {viewType === 'monthly' ? (
          <table className="w-full text-left text-xs text-slate-300 print-table">
            <thead className="bg-[#070E20] text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-700/80">
              <tr>
                <th className="py-3 px-4 font-mono">Bulan</th>
                <th className="py-3 px-4">Tahun</th>
                <th className="py-3 px-4 text-right">Saldo Awal</th>
                <th className="py-3 px-4 text-right text-white">Angsuran Bulanan</th>
                <th className="py-3 px-4 text-right text-[#FACC15]">Porsi Pokok</th>
                <th className="py-3 px-4 text-right text-[#F43F5E]">Porsi Bunga</th>
                <th className="py-3 px-4 text-right">Akumulasi Bunga</th>
                <th className="py-3 px-4 text-right text-sky-400">Sisa Pokok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {paginatedSchedule.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500 font-sans">
                    Tidak ada data angsuran yang sesuai dengan pencarian "{searchQuery}"
                  </td>
                </tr>
              ) : (
                paginatedSchedule.map((row) => (
                  <tr
                    key={row.month}
                    className="hover:bg-[#002244]/40 transition-colors group cursor-default"
                  >
                    {/* Bulan */}
                    <td className="py-2.5 px-4 font-bold text-white whitespace-nowrap">
                      Ke-{row.month}
                    </td>

                    {/* Tahun */}
                    <td className="py-2.5 px-4 text-slate-400 font-sans whitespace-nowrap">
                      Thn {row.year} <span className="text-[10px] text-slate-400 font-mono">({row.monthInYear}/12)</span>
                    </td>

                    {/* Saldo Awal */}
                    <td className="py-2.5 px-4 text-right text-slate-400 tabular-nums whitespace-nowrap">
                      {formatIDR(row.startingBalance)}
                    </td>

                    {/* Angsuran Bulanan Total */}
                    <td className="py-2.5 px-4 text-right font-bold text-white tabular-nums whitespace-nowrap bg-blue-950/20">
                      {formatIDR(row.monthlyPayment)}
                      {row.extraPayment > 0 && (
                        <span className="block text-[10px] text-yellow-400 font-normal">
                          (+{formatIDR(row.extraPayment)} ekstra)
                        </span>
                      )}
                    </td>

                    {/* Porsi Pokok */}
                    <td className="py-2.5 px-4 text-right font-semibold text-slate-200 tabular-nums whitespace-nowrap">
                      {formatIDR(row.principalPayment + row.extraPayment)}
                    </td>

                    {/* Porsi Bunga */}
                    <td className="py-2.5 px-4 text-right text-rose-400 tabular-nums whitespace-nowrap">
                      {formatIDR(row.interestPayment)}
                    </td>

                    {/* Akumulasi Bunga */}
                    <td className="py-2.5 px-4 text-right text-slate-400 tabular-nums whitespace-nowrap">
                      {formatIDR(row.cumulativeInterest)}
                    </td>

                    {/* Sisa Pokok Pinjaman */}
                    <td className="py-2.5 px-4 text-right font-bold text-sky-400 tabular-nums whitespace-nowrap bg-[#060D1E]/40">
                      {formatIDR(row.remainingBalance)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          /* Yearly Summary Table */
          <table className="w-full text-left text-xs text-slate-300 print-table">
            <thead className="bg-[#070E20] text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-700/80">
              <tr>
                <th className="py-3 px-4">Tahun Ke-</th>
                <th className="py-3 px-4 text-center">Durasi Bulan</th>
                <th className="py-3 px-4 text-right text-white">Total Angsuran (1 Thn)</th>
                <th className="py-3 px-4 text-right text-[#FACC15]">Total Pokok Terbayar</th>
                <th className="py-3 px-4 text-right text-[#F43F5E]">Total Bunga Terbayar</th>
                <th className="py-3 px-4 text-right text-sky-400">Sisa Saldo Akhir Tahun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {yearlySummary.map((item) => (
                <tr
                  key={item.year}
                  className="hover:bg-[#002244]/40 transition-colors cursor-default"
                >
                  <td className="py-3 px-4 font-bold text-white font-sans">
                    Tahun Ke-{item.year}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400">
                    {item.monthCount} Bulan
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white tabular-nums bg-blue-950/20">
                    {formatIDR(item.totalPaid)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-200 tabular-nums">
                    {formatIDR(item.principalPaid)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-rose-400 tabular-nums">
                    {formatIDR(item.interestPaid)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-sky-400 tabular-nums bg-[#060D1E]/40">
                    {formatIDR(item.endBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer (when monthly view and not displaying all) */}
      {viewType === 'monthly' && rowsPerPage !== -1 && totalPages > 1 && (
        <div className="px-6 py-3.5 bg-[#081021] border-t border-slate-700/70 flex items-center justify-between text-xs text-slate-400">
          <div>
            Menampilkan{' '}
            <span className="font-mono font-bold text-white">
              {(currentPage - 1) * rowsPerPage + 1}
            </span>{' '}
            -{' '}
            <span className="font-mono font-bold text-white">
              {Math.min(currentPage * rowsPerPage, filteredMonthly.length)}
            </span>{' '}
            dari{' '}
            <span className="font-mono font-bold text-white">
              {filteredMonthly.length}
            </span>{' '}
            bulan
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-slate-700 bg-[#060B18] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-mono text-slate-300 font-bold bg-[#0B1528] rounded border border-slate-700/80">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded border border-slate-700 bg-[#060B18] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
