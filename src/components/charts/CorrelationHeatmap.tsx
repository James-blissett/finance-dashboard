import type { CorrelationMatrix } from '../../types/statistics';

interface CorrelationHeatmapProps {
  matrix: CorrelationMatrix;
}

function getColor(r: number): string {
  if (r >= 0.7) return 'bg-emerald-600 text-white';
  if (r >= 0.3) return 'bg-emerald-300 text-emerald-900 dark:bg-emerald-700 dark:text-emerald-100';
  if (r >= -0.3) return 'bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-gray-200';
  if (r >= -0.7) return 'bg-red-300 text-red-900 dark:bg-red-700 dark:text-red-100';
  return 'bg-red-600 text-white';
}

export function CorrelationHeatmap({ matrix }: CorrelationHeatmapProps) {
  const { labels, values } = matrix;

  return (
    <div className="overflow-x-auto">
      <table className="text-xs">
        <thead>
          <tr>
            <th className="p-1" />
            {labels.map((l) => (
              <th
                key={l}
                className="p-1 text-center font-medium text-gray-600 dark:text-gray-400 max-w-[80px] truncate"
                title={l}
              >
                {l.length > 10 ? l.slice(0, 10) + '...' : l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((rowLabel, i) => (
            <tr key={rowLabel}>
              <td
                className="p-1 text-right font-medium text-gray-600 dark:text-gray-400 max-w-[100px] truncate"
                title={rowLabel}
              >
                {rowLabel.length > 12 ? rowLabel.slice(0, 12) + '...' : rowLabel}
              </td>
              {values[i].map((val, j) => (
                <td
                  key={labels[j]}
                  className={`p-1 text-center min-w-[50px] ${getColor(val)}`}
                  title={`${rowLabel} vs ${labels[j]}: ${val.toFixed(3)}`}
                >
                  {val.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
