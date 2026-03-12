interface RatioRow {
  label: string;
  values: number[];
  format: (v: number) => string;
}

interface RatioTableProps {
  title: string;
  years: number[];
  rows: RatioRow[];
}

export function RatioTable({ title, years, rows }: RatioTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-slate-600">
            <th className="py-2 text-left font-semibold text-gray-700 dark:text-gray-300 min-w-[180px]">
              {title}
            </th>
            {years.map((y) => (
              <th
                key={y}
                className="px-3 py-2 text-right font-semibold text-gray-700 dark:text-gray-300 min-w-[90px]"
              >
                {y}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-b border-gray-100 dark:border-slate-700"
            >
              <td className="py-1.5 text-gray-600 dark:text-gray-400">
                {row.label}
              </td>
              {row.values.map((val, i) => (
                <td
                  key={years[i]}
                  className={`px-3 py-1.5 text-right tabular-nums ${
                    val < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {row.format(val)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
