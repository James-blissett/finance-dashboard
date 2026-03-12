import { useFinancialData } from '../hooks/useFinancialData';
import { Card } from '../components/common/Card';
import { IncomeStatementTable } from '../components/tables/IncomeStatementTable';
import { BalanceSheetTable } from '../components/tables/BalanceSheetTable';

export function ProformaPage() {
  const { dispatch } = useFinancialData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Proforma Model
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click any cell to edit. Derived values and ratios update automatically.
          </p>
        </div>
        <button
          onClick={() => dispatch({ type: 'RESET_TO_DEFAULTS' })}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
        >
          Reset to Defaults
        </button>
      </div>

      <Card title="Income Statement">
        <IncomeStatementTable />
      </Card>

      <Card title="Balance Sheet">
        <BalanceSheetTable />
      </Card>
    </div>
  );
}
