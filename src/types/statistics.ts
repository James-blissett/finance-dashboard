export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  standardError: number;
  predicted: number[];
  residuals: number[];
  equation: string;
}

export interface CorrelationMatrix {
  labels: string[];
  values: number[][];
}

export interface ForecastPoint {
  year: number;
  value: number;
  lowerBound: number;
  upperBound: number;
}
