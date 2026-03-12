import type { RegressionResult } from '../types/statistics';

export function linearRegression(xs: number[], ys: number[]): RegressionResult {
  const n = xs.length;
  if (n < 2) {
    return {
      slope: 0,
      intercept: ys[0] ?? 0,
      rSquared: 0,
      standardError: 0,
      predicted: ys.slice(),
      residuals: new Array(n).fill(0),
      equation: `y = ${ys[0]?.toFixed(2) ?? '0'}`,
    };
  }

  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((acc, x, i) => acc + x * ys[i], 0);
  const sumX2 = xs.reduce((acc, x) => acc + x * x, 0);

  const denom = n * sumX2 - sumX * sumX;
  const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
  const intercept = (sumY - slope * sumX) / n;

  const predicted = xs.map((x) => slope * x + intercept);
  const residuals = ys.map((y, i) => y - predicted[i]);

  const meanY = sumY / n;
  const ssTot = ys.reduce((acc, y) => acc + (y - meanY) ** 2, 0);
  const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
  const rSquared = ssTot !== 0 ? 1 - ssRes / ssTot : 0;

  const standardError = n > 2 ? Math.sqrt(ssRes / (n - 2)) : 0;

  const slopeStr = slope >= 0
    ? `${slope.toFixed(4)}x`
    : `${slope.toFixed(4)}x`;
  const interceptStr = intercept >= 0
    ? `+ ${intercept.toFixed(2)}`
    : `- ${Math.abs(intercept).toFixed(2)}`;

  return {
    slope,
    intercept,
    rSquared,
    standardError,
    predicted,
    residuals,
    equation: `y = ${slopeStr} ${interceptStr}`,
  };
}

export function movingAverage(values: number[], window: number): (number | null)[] {
  return values.map((_, i) => {
    if (i < window - 1) return null;
    const slice = values.slice(i - window + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / window;
  });
}
