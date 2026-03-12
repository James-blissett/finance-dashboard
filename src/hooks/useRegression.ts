import { useMemo } from 'react';
import { linearRegression } from '../lib/regression';
import type { RegressionResult } from '../types/statistics';

export function useRegression(
  xs: number[],
  ys: number[]
): RegressionResult {
  return useMemo(() => linearRegression(xs, ys), [xs, ys]);
}
