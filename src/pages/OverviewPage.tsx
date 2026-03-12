import { useFinancialData } from '../hooks/useFinancialData';
import { useRatios } from '../hooks/useRatios';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { TrendChart } from '../components/charts/TrendChart';
import { formatPercent, formatMultiple, formatCurrency } from '../lib/formatting';

interface KPICardProps {
  label: string;
  value: string;
  change: number;
  invertColor?: boolean;
}

function KPICard({ label, value, change, invertColor }: KPICardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <div className="mt-1 flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </span>
        <Badge value={change} invertColor={invertColor} />
      </div>
    </div>
  );
}

export function OverviewPage() {
  const { state } = useFinancialData();
  const derived = useRatios(state.years);
  const latest = derived[derived.length - 1];
  const prev = derived[derived.length - 2];

  const revenueData = derived.map((d) => ({
    year: d.year,
    Sales: d.derivedIS.sales,
    'Net Income': d.derivedIS.netIncome,
  }));

  const marginData = derived.map((d) => ({
    year: d.year,
    'EBITDA%': state.years.find((y) => y.year === d.year)!.incomeStatement.ebitdaPercent,
    'Net Margin%': state.years.find((y) => y.year === d.year)!.incomeStatement.netIncomePercent,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Overview - FY{latest.year}
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <KPICard
          label="Revenue"
          value={formatCurrency(latest.derivedIS.sales)}
          change={((latest.derivedIS.sales - prev.derivedIS.sales) / Math.abs(prev.derivedIS.sales)) * 100}
        />
        <KPICard
          label="ROA"
          value={formatPercent(latest.ratios.roa)}
          change={latest.ratios.roa - prev.ratios.roa}
        />
        <KPICard
          label="ROE"
          value={formatPercent(latest.ratios.roe)}
          change={latest.ratios.roe - prev.ratios.roe}
        />
        <KPICard
          label="Current Ratio"
          value={formatMultiple(latest.ratios.currentRatio)}
          change={latest.ratios.currentRatio - prev.ratios.currentRatio}
        />
        <KPICard
          label="Debt / Capital"
          value={formatPercent(latest.ratios.debtToCapital)}
          change={latest.ratios.debtToCapital - prev.ratios.debtToCapital}
          invertColor
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Revenue & Net Income (RMB M)">
          <TrendChart
            data={revenueData}
            series={[
              { key: 'Sales', label: 'Revenue', color: '#2563eb' },
              { key: 'Net Income', label: 'Net Income', color: '#059669' },
            ]}
            yFormat={(v) => `¥${v.toLocaleString()}`}
          />
        </Card>

        <Card title="Margin Trends">
          <TrendChart
            data={marginData}
            series={[
              { key: 'EBITDA%', label: 'EBITDA Margin', color: '#2563eb' },
              { key: 'Net Margin%', label: 'Net Margin', color: '#d97706' },
            ]}
            yFormat={(v) => `${v.toFixed(1)}%`}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Key Profitability">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">ROIC</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatPercent(latest.ratios.roic)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">EBITDA Margin</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatPercent(state.years[state.years.length - 1].incomeStatement.ebitdaPercent)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Gross Margin</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatPercent(100 - state.years[state.years.length - 1].incomeStatement.cogsPercent)}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Working Capital">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Days Receivable</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {latest.ratios.daysReceivable.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Days Inventory</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {latest.ratios.daysInventory.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Days Payable</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {latest.ratios.daysPayable.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-slate-600">
              <span className="text-gray-600 dark:text-gray-400">Cash Conversion Cycle</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {latest.ratios.cashConversionCycle.toFixed(1)} days
              </span>
            </div>
          </div>
        </Card>

        <Card title="Leverage & Solvency">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Debt / Capital</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatPercent(latest.ratios.debtToCapital)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Net Debt / EBITDA</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatMultiple(latest.ratios.netDebtToEbitda)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Interest Cover</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {isFinite(latest.ratios.interestCover)
                  ? formatMultiple(latest.ratios.interestCover)
                  : 'N/M'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
