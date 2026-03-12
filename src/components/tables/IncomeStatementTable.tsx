import { useFinancialData } from '../../hooks/useFinancialData';
import { useRatios } from '../../hooks/useRatios';
import { EditableCell } from './EditableCell';
import { formatCurrency } from '../../lib/formatting';
import type { IncomeStatementData } from '../../types/financial';

const IS_ROWS: {
  label: string;
  field: keyof IncomeStatementData;
  isAbsolute?: boolean;
  indent?: boolean;
}[] = [
  { label: 'Sales', field: 'sales', isAbsolute: true },
  { label: 'COGS (% of Sales)', field: 'cogsPercent', indent: true },
  { label: 'SG&A (% of Sales)', field: 'sgaPercent', indent: true },
  { label: 'EBITDA (% of Sales)', field: 'ebitdaPercent' },
  { label: 'EBIT (% of Sales)', field: 'ebitPercent' },
  { label: 'Net Income (% of Sales)', field: 'netIncomePercent' },
];

export function IncomeStatementTable() {
  const { state, dispatch } = useFinancialData();
  const derived = useRatios(state.years);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-slate-600">
            <th className="py-2 text-left font-semibold text-gray-700 dark:text-gray-300 min-w-[180px]">
              Income Statement
            </th>
            {state.years.map((fy) => (
              <th
                key={fy.year}
                className="px-3 py-2 text-right font-semibold text-gray-700 dark:text-gray-300 min-w-[100px]"
              >
                {fy.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {IS_ROWS.map((row) => (
            <tr
              key={row.field}
              className="border-b border-gray-100 dark:border-slate-700"
            >
              <td
                className={`py-1.5 text-gray-600 dark:text-gray-400 ${row.indent ? 'pl-4' : 'font-medium'}`}
              >
                {row.label}
              </td>
              {state.years.map((fy) => (
                <td key={fy.year} className="px-3 py-1.5 text-right">
                  <EditableCell
                    value={fy.incomeStatement[row.field]}
                    onChange={(v) =>
                      dispatch({
                        type: 'UPDATE_IS_FIELD',
                        year: fy.year,
                        field: row.field,
                        value: v,
                      })
                    }
                    format={(v) =>
                      row.isAbsolute
                        ? v.toLocaleString()
                        : `${v.toFixed(1)}%`
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t-2 border-gray-300 dark:border-slate-500">
            <td className="py-1.5 font-medium text-gray-600 dark:text-gray-400">
              Gross Profit
            </td>
            {derived.map((d) => (
              <td
                key={d.year}
                className="px-3 py-1.5 text-right text-sm text-gray-500 dark:text-gray-400"
              >
                {formatCurrency(d.derivedIS.grossProfit)}
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-100 dark:border-slate-700">
            <td className="py-1.5 font-medium text-gray-600 dark:text-gray-400">
              EBITDA
            </td>
            {derived.map((d) => (
              <td
                key={d.year}
                className="px-3 py-1.5 text-right text-sm text-gray-500 dark:text-gray-400"
              >
                {formatCurrency(d.derivedIS.ebitda)}
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-100 dark:border-slate-700">
            <td className="py-1.5 font-medium text-gray-600 dark:text-gray-400">
              Net Income
            </td>
            {derived.map((d) => (
              <td
                key={d.year}
                className={`px-3 py-1.5 text-right text-sm ${d.derivedIS.netIncome < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
              >
                {formatCurrency(d.derivedIS.netIncome)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
