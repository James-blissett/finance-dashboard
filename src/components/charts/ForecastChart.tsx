import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ForecastPoint } from '../../types/statistics';

interface ForecastChartProps {
  historical: { year: number; value: number }[];
  forecast: ForecastPoint[];
  label: string;
  height?: number;
  yFormat?: (v: number) => string;
}

export function ForecastChart({
  historical,
  forecast,
  label,
  height = 280,
  yFormat,
}: ForecastChartProps) {
  const data = [
    ...historical.map((h) => ({
      year: h.year,
      actual: h.value,
      forecast: null as number | null,
      upper: null as number | null,
      lower: null as number | null,
    })),
    // Bridge point
    {
      year: historical[historical.length - 1].year,
      actual: historical[historical.length - 1].value,
      forecast: historical[historical.length - 1].value,
      upper: historical[historical.length - 1].value,
      lower: historical[historical.length - 1].value,
    },
    ...forecast.map((f) => ({
      year: f.year,
      actual: null as number | null,
      forecast: f.value,
      upper: f.upperBound,
      lower: f.lowerBound,
    })),
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#6B7280" />
        <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" tickFormatter={yFormat} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--tooltip-bg, #fff)',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '12px',
          }}
          formatter={(value: number | null) =>
            value !== null ? (yFormat ? yFormat(value) : value.toFixed(2)) : 'N/A'
          }
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Area
          type="monotone"
          dataKey="upper"
          stroke="none"
          fill="#3b82f6"
          fillOpacity={0.1}
          name="95% CI Upper"
          connectNulls={false}
        />
        <Area
          type="monotone"
          dataKey="lower"
          stroke="none"
          fill="#ffffff"
          fillOpacity={1}
          name="95% CI Lower"
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="actual"
          name={`${label} (Actual)`}
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 4 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="forecast"
          name={`${label} (Forecast)`}
          stroke="#d97706"
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={{ r: 4 }}
          connectNulls={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
