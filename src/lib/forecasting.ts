import type { RegressionResult } from '../types/statistics';
import type { ForecastPoint } from '../types/statistics';

export function forecast(
  regression: RegressionResult,
  futureXs: number[],
  confidence = 1.96
): ForecastPoint[] {
  return futureXs.map((x) => {
    const value = regression.slope * x + regression.intercept;
    return {
      year: x,
      value,
      lowerBound: value - confidence * regression.standardError,
      upperBound: value + confidence * regression.standardError,
    };
  });
}

export function generateForecastYears(
  lastYear: number,
  count: number
): number[] {
  return Array.from({ length: count }, (_, i) => lastYear + 1 + i);
}
