export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatMultiple(value: number, decimals = 1): string {
  if (!isFinite(value)) return 'N/M';
  return `${value.toFixed(decimals)}x`;
}

export function formatCurrency(value: number, decimals = 0): string {
  return `¥${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatNumber(value: number, decimals = 1): string {
  if (!isFinite(value)) return 'N/M';
  return value.toFixed(decimals);
}

export function formatDays(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}`;
}

export function trendClass(value: number, invertColor = false): string {
  if (value > 0) return invertColor ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400';
  if (value < 0) return invertColor ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400';
  return 'text-gray-500 dark:text-gray-400';
}

export function trendArrow(value: number): string {
  if (value > 0) return '\u25B2';
  if (value < 0) return '\u25BC';
  return '\u25C6';
}
