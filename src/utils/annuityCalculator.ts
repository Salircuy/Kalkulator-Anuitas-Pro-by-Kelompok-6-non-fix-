/**
 * Annuity and Loan Amortization Calculation Engine
 * High-precision financial formulas for Indonesian and standard banking applications.
 */

export interface LoanInput {
  principal: number; // Pokok Pinjaman (e.g., 250000000)
  annualRate: number; // Suku Bunga Tahunan dalam % (e.g., 8.5)
  tenorYears: number; // Durasi dalam tahun
  tenorMonths: number; // Durasi tambahan dalam bulan (opsional)
  extraMonthlyPayment?: number; // Pembayaran pokok ekstra per bulan
  calculationMethod?: 'annuity' | 'effective' | 'flat';
}

export interface MonthlyScheduleItem {
  month: number;
  year: number;
  monthInYear: number;
  startingBalance: number;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
  extraPayment: number;
  remainingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
  cumulativeTotal: number;
}

export interface YearlySummaryItem {
  year: number;
  totalPaid: number;
  principalPaid: number;
  interestPaid: number;
  endBalance: number;
  monthCount: number;
}

export interface CalculationResult {
  monthlyInstallment: number;
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  interestPercentage: number;
  totalMonths: number;
  effectivePayoffMonths: number;
  interestSaved: number;
  timeSavedMonths: number;
  schedule: MonthlyScheduleItem[];
  yearlySummary: YearlySummaryItem[];
}

/**
 * Standard Annuity formula:
 * A = P * [ i * (1 + i)^n ] / [ (1 + i)^n - 1 ]
 * where:
 * P = Principal
 * i = monthly interest rate (annualRate / 12 / 100)
 * n = total months
 */
export function calculateAnnuity(input: LoanInput): CalculationResult {
  const principal = Math.max(0, input.principal);
  const annualRate = Math.max(0, input.annualRate);
  const totalMonths = Math.max(1, input.tenorYears * 12 + (input.tenorMonths || 0));
  const extraPayment = Math.max(0, input.extraMonthlyPayment || 0);
  const method = input.calculationMethod || 'annuity';

  const monthlyRate = annualRate / 12 / 100;

  // Base regular monthly installment without extra payments
  let baseMonthlyInstallment = 0;
  if (method === 'flat') {
    // Flat: Total Bunga = P * (annualRate/100) * (totalMonths / 12)
    // Cicilan Pokok = P / totalMonths
    // Cicilan Bunga = (P * (annualRate/100) * (totalMonths / 12)) / totalMonths
    const monthlyPrincipal = principal / totalMonths;
    const monthlyInterest = (principal * (annualRate / 100) * (totalMonths / 12)) / totalMonths;
    baseMonthlyInstallment = monthlyPrincipal + monthlyInterest;
  } else if (method === 'effective') {
    // Effective / Slump / Menurun: Pokok per bulan tetap = P / n, bunga menurun tiap bulan
    // Base monthly installment for display is month 1
    const monthlyPrincipal = principal / totalMonths;
    const firstMonthInterest = principal * monthlyRate;
    baseMonthlyInstallment = monthlyPrincipal + firstMonthInterest;
  } else {
    // Standard Annuity (Fixed installment)
    if (monthlyRate === 0) {
      baseMonthlyInstallment = principal / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      baseMonthlyInstallment = (principal * (monthlyRate * factor)) / (factor - 1);
    }
  }

  // Calculate standard total interest without extra payments (for baseline comparison)
  let standardTotalInterest = 0;
  if (method === 'flat') {
    standardTotalInterest = principal * (annualRate / 100) * (totalMonths / 12);
  } else if (method === 'effective') {
    let bal = principal;
    const fixedPrincipal = principal / totalMonths;
    for (let m = 1; m <= totalMonths; m++) {
      standardTotalInterest += bal * monthlyRate;
      bal -= fixedPrincipal;
    }
  } else {
    standardTotalInterest = baseMonthlyInstallment * totalMonths - principal;
  }

  // Generate monthly amortization schedule
  const schedule: MonthlyScheduleItem[] = [];
  let currentBalance = principal;
  let cumPrincipal = 0;
  let cumInterest = 0;
  let cumTotal = 0;
  let effectivePayoffMonths = totalMonths;

  const maxSimMonths = totalMonths + 120; // safety bound

  for (let m = 1; m <= maxSimMonths && currentBalance > 0.01; m++) {
    const year = Math.ceil(m / 12);
    const monthInYear = ((m - 1) % 12) + 1;
    const startingBal = currentBalance;

    let interestPart = 0;
    let principalPart = 0;
    let paymentThisMonth = 0;

    if (method === 'flat') {
      interestPart = (principal * (annualRate / 100) * (totalMonths / 12)) / totalMonths;
      principalPart = principal / totalMonths;
      paymentThisMonth = principalPart + interestPart;
    } else if (method === 'effective') {
      interestPart = startingBal * monthlyRate;
      principalPart = Math.min(startingBal, principal / totalMonths);
      paymentThisMonth = principalPart + interestPart;
    } else {
      // Annuity
      interestPart = startingBal * monthlyRate;
      principalPart = baseMonthlyInstallment - interestPart;
    }

    // Apply extra principal payment if configured
    let actualExtra = 0;
    if (extraPayment > 0) {
      actualExtra = Math.min(extraPayment, Math.max(0, startingBal - principalPart));
    }

    // If remaining balance is less than scheduled principal
    if (principalPart + actualExtra >= startingBal) {
      principalPart = startingBal;
      actualExtra = 0;
      paymentThisMonth = principalPart + interestPart;
      currentBalance = 0;
      effectivePayoffMonths = m;
    } else {
      currentBalance = startingBal - principalPart - actualExtra;
      paymentThisMonth = principalPart + interestPart + actualExtra;
    }

    cumPrincipal += principalPart + actualExtra;
    cumInterest += interestPart;
    cumTotal += paymentThisMonth;

    schedule.push({
      month: m,
      year,
      monthInYear,
      startingBalance: Math.round(startingBal),
      monthlyPayment: Math.round(paymentThisMonth),
      principalPayment: Math.round(principalPart),
      interestPayment: Math.round(interestPart),
      extraPayment: Math.round(actualExtra),
      remainingBalance: Math.max(0, Math.round(currentBalance)),
      cumulativePrincipal: Math.round(cumPrincipal),
      cumulativeInterest: Math.round(cumInterest),
      cumulativeTotal: Math.round(cumTotal),
    });

    if (currentBalance <= 0.01) {
      effectivePayoffMonths = m;
      break;
    }
  }

  // Yearly Summary aggregation
  const yearlyMap = new Map<number, YearlySummaryItem>();
  for (const item of schedule) {
    if (!yearlyMap.has(item.year)) {
      yearlyMap.set(item.year, {
        year: item.year,
        totalPaid: 0,
        principalPaid: 0,
        interestPaid: 0,
        endBalance: item.remainingBalance,
        monthCount: 0,
      });
    }
    const currentYear = yearlyMap.get(item.year)!;
    currentYear.totalPaid += item.monthlyPayment;
    currentYear.principalPaid += item.principalPayment + item.extraPayment;
    currentYear.interestPaid += item.interestPayment;
    currentYear.endBalance = item.remainingBalance;
    currentYear.monthCount += 1;
  }

  const yearlySummary = Array.from(yearlyMap.values());

  const totalPayment = cumTotal;
  const totalInterest = cumInterest;
  const interestPercentage = principal > 0 ? (totalInterest / principal) * 100 : 0;
  const interestSaved = Math.max(0, Math.round(standardTotalInterest - totalInterest));
  const timeSavedMonths = Math.max(0, totalMonths - effectivePayoffMonths);

  return {
    monthlyInstallment: Math.round(baseMonthlyInstallment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    totalPrincipal: Math.round(principal),
    interestPercentage: Number(interestPercentage.toFixed(2)),
    totalMonths,
    effectivePayoffMonths,
    interestSaved,
    timeSavedMonths,
    schedule,
    yearlySummary,
  };
}

/**
 * Format currency into IDR Indonesian Rupiah representation: Rp 500.000.000
 */
export function formatIDR(value: number): string {
  if (isNaN(value)) return 'Rp 0';
  return 'Rp ' + Math.round(value).toLocaleString('id-ID');
}

/**
 * Format compact IDR, e.g. Rp 500 Jt, Rp 1,2 M
 */
export function formatCompactIDR(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 0 })} Rb`;
  }
  return `Rp ${Math.round(value)}`;
}

/**
 * Format number into Indonesian localized format
 */
export function formatNumber(value: number, decimals: number = 0): string {
  if (isNaN(value)) return '0';
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Generate CSV download content from amortization schedule
 */
export function generateScheduleCSV(
  schedule: MonthlyScheduleItem[],
  principal: number,
  annualRate: number,
  tenorYears: number
): string {
  const headers = [
    'Bulan',
    'Tahun',
    'Bulan ke-',
    'Saldo Awal (Rp)',
    'Total Angsuran (Rp)',
    'Angsuran Pokok (Rp)',
    'Angsuran Bunga (Rp)',
    'Sisa Pokok (Rp)',
    'Kumulatif Pokok (Rp)',
    'Kumulatif Bunga (Rp)',
    'Kumulatif Total (Rp)',
  ];

  const metaRows = [
    `# TABEL ANGSURAN ANUITAS PINJAMAN`,
    `# Pokok Pinjaman: ${formatIDR(principal)}`,
    `# Suku Bunga: ${annualRate}% per tahun`,
    `# Durasi Tenor: ${tenorYears} Tahun (${schedule.length} Bulan)`,
    `# Dibuat pada: ${new Date().toLocaleDateString('id-ID')}`,
    '',
    headers.join(';'),
  ];

  const dataRows = schedule.map((row) =>
    [
      row.month,
      row.year,
      row.monthInYear,
      row.startingBalance,
      row.monthlyPayment,
      row.principalPayment + row.extraPayment,
      row.interestPayment,
      row.remainingBalance,
      row.cumulativePrincipal,
      row.cumulativeInterest,
      row.cumulativeTotal,
    ].join(';')
  );

  return metaRows.concat(dataRows).join('\n');
}

/**
 * Download CSV helper
 */
export function downloadCSV(content: string, filename: string) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
