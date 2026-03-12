import { trendClass, trendArrow } from '../../lib/formatting';

interface BadgeProps {
  value: number;
  suffix?: string;
  invertColor?: boolean;
}

export function Badge({ value, suffix = '%', invertColor = false }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trendClass(value, invertColor)}`}>
      {trendArrow(value)} {Math.abs(value).toFixed(1)}{suffix}
    </span>
  );
}
