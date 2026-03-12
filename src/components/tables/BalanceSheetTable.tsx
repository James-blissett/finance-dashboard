import { useFinancialData } from '../../hooks/useFinancialData';
import { useRatios } from '../../hooks/useRatios';
import { EditableCell } from './EditableCell';
import { formatCurrency } from '../../lib/formatting';
import type { BalanceSheetData } from '../../types/financial';

interface BSRow {
  label: string;
  field: keyof BalanceSheetData;
  isAbsolute?: boolean;
  indent?: boolean;
  section?: 'assets' | 'liabilities';
}

const BS_ROWS: BSRow[] = [
  { label: 'Total Assets', field: 'totalAssets', isAbsolute: true },
  { label: 'Cash (% of Assets)', field: 'cashPercent', indent: true, section: 'assets' },
  { label: 'Receivables (% of Assets)', field: 'receivablesPercent', indent: true, section: 'assets' },
  { label: 'Inventory (% of Assets)', field: 'inventoryPercent', indent: true, section: 'assets' },
  { label: 'Net PP&E (% of Assets)', field: 'netPPEPercent', indent: true, section: 'assets' },
  { label: 'Other Assets (% of Assets)', field: 'otherAssetsPercent', indent: true, section: 'assets' },
  { label: 'Payables (% of Assets)', field: 'payablesPercent', indent: true, section: 'liabilities' },
  { label: 'Debt (% of Assets)', field: 'debtPercent', indent: true, section: 'liabilities' },
  { label: 'Other Liabilities (% of Assets)', field: 'otherLiabilitiesPercent', indent: true, section: 'liabilities' },
  { label: 'Equity (% of Assets)', field: 'equityPercent' },
];

export function BalanceSheetTable() {
  const { state, dispatch } = useFinancialData();
  const derived = useRatios(state.years);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-slate-600">
            <th className="py-2 text-left font-semibold text-gray-700 dark:text-gray-300 min-w-[220px]">
              Balance Sheet
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
          {BS_ROWS.map((row) => (
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
                    value={fy.balanceSheet[row.field]}
                    onChange={(v) =>
                      dispatch({
                        type: 'UPDATE_BS_FIELD',
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
              Total Equity
            </td>
            {derived.map((d) => (
              <td
                key={d.year}
                className="px-3 py-1.5 text-right text-sm text-gray-500 dark:text-gray-400"
              >
                {formatCurrency(d.derivedBS.equity)}
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-100 dark:border-slate-700">
            <td className="py-1.5 font-medium text-gray-600 dark:text-gray-400">
              Invested Capital
            </td>
            {derived.map((d) => (
              <td
                key={d.year}
                className="px-3 py-1.5 text-right text-sm text-gray-500 dark:text-gray-400"
              >
                {formatCurrency(d.derivedBS.investedCapital)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
