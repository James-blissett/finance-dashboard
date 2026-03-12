import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TrendSeries {
  key: string;
  label: string;
  color: string;
}

interface TrendChartProps {
  data: Record<string, number | string>[];
  series: TrendSeries[];
  xKey?: string;
  height?: number;
  yFormat?: (v: number) => string;
}

export function TrendChart({
  data,
  series,
  xKey = 'year',
  height = 250,
  yFormat,
}: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
          tickFormatter={yFormat}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--tooltip-bg, #fff)',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '12px',
          }}
          formatter={(value) =>
            yFormat ? yFormat(Number(value)) : Number(value).toFixed(2)
          }
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
