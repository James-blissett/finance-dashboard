import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface BarSeries {
  key: string;
  label: string;
  color: string;
}

interface RatioBarChartProps {
  data: Record<string, number | string>[];
  series: BarSeries[];
  xKey?: string;
  height?: number;
  yFormat?: (v: number) => string;
}

export function RatioBarChart({
  data,
  series,
  xKey = 'year',
  height = 250,
  yFormat,
}: RatioBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="#6B7280" />
        <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" tickFormatter={yFormat} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--tooltip-bg, #fff)',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '12px',
          }}
          formatter={(value: number) =>
            yFormat ? yFormat(value) : value.toFixed(2)
          }
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[2, 2, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
