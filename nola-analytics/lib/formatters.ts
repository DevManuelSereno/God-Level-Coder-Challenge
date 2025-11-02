/**
 * Format a number value for display
 * @param value - The value to format
 * @param decimals - Number of decimal places (default: auto-detect)
 * @returns Formatted string
 */
export function formatNumber(value: number | string, decimals?: number): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  if (typeof numericValue !== 'number' || isNaN(numericValue)) {
    return String(value);
  }

  // Auto-detect decimals if not provided
  const decimalPlaces = decimals ?? (Number.isInteger(numericValue) ? 0 : 2);

  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}

/**
 * Format currency values
 */
export function formatCurrency(value: number | string): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  if (typeof numericValue !== 'number' || isNaN(numericValue)) {
    return 'R$ 0,00';
  }

  return numericValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Convert seconds to minutes if value is large enough
 */
export function convertDeliveryTime(seconds: number): number {
  return seconds > 100 ? seconds / 60 : seconds;
}

/**
 * Format delivery time from seconds to minutes
 */
export function formatDeliveryTime(seconds: number | string): string {
  const numericValue = typeof seconds === 'string' ? parseFloat(seconds) : seconds;

  if (typeof numericValue !== 'number' || isNaN(numericValue)) {
    return '0';
  }

  const minutes = convertDeliveryTime(numericValue);
  return formatNumber(minutes, 2);
}
