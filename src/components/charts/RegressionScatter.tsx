import {
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';
import type { RegressionResult } from '../../types/statistics';

interface RegressionScatterProps {
  points: { x: number; y: number; label?: string }[];
  regression: RegressionResult;
  xLabel: string;
  yLabel: string;
  height?: number;
}

export function RegressionScatter({
  points,
  regression,
  xLabel,
  yLabel,
  height = 300,
}: RegressionScatterProps) {
  const xs = points.map((p) => p.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const padding = (maxX - minX) * 0.1 || 1;

  const lineData = [
    { x: minX - padding, y: regression.slope * (minX - padding) + regression.intercept },
    { x: maxX + padding, y: regression.slope * (maxX + padding) + regression.intercept },
  ];

  const allData = points.map((p) => ({
    x: p.x,
    y: p.y,
    regression: regression.slope * p.x + regression.intercept,
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis
            type="number"
            dataKey="x"
            name={xLabel}
            tick={{ fontSize: 11 }}
            stroke="#6B7280"
            label={{ value: xLabel, position: 'insideBottom', offset: -10, style: { fontSize: 11, fill: '#6B7280' } }}
            domain={[minX - padding, maxX + padding]}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yLabel}
            tick={{ fontSize: 11 }}
            stroke="#6B7280"
            label={{ value: yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6B7280' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, #fff)',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px',
            }}
            formatter={(value) => Number(value).toFixed(2)}
          />
          <Scatter data={allData} fill="#2563eb" />
          <Line
            data={lineData}
            type="linear"
            dataKey="y"
            stroke="#dc2626"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            legendType="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
        <span>
          <strong>Equation:</strong> {regression.equation}
        </span>
        <span>
          <strong>R-squared:</strong> {regression.rSquared.toFixed(4)}
        </span>
        <span>
          <strong>Std Error:</strong> {regression.standardError.toFixed(4)}
        </span>
      </div>
    </div>
  );
}
