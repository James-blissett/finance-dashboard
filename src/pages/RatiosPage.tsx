import { useFinancialData } from '../hooks/useFinancialData';
import { useRatios } from '../hooks/useRatios';
import { Card } from '../components/common/Card';
import { RatioTable } from '../components/tables/RatioTable';
import { TrendChart } from '../components/charts/TrendChart';
import { formatPercent, formatMultiple, formatDays } from '../lib/formatting';

export function RatiosPage() {
  const { state } = useFinancialData();
  const derived = useRatios(state.years);
  const years = derived.map((d) => d.year);

  const profitabilityData = derived.map((d) => ({
    year: d.year,
    ROA: d.ratios.roa,
    ROE: d.ratios.roe,
    ROIC: d.ratios.roic,
  }));

  const turnoverData = derived.map((d) => ({
    year: d.year,
    'Total Asset': d.ratios.totalAssetTurnover,
    'Fixed Asset': d.ratios.fixedAssetTurnover,
    'Inventory': d.ratios.inventoryTurnover,
  }));

  const liquidityData = derived.map((d) => ({
    year: d.year,
    'Current Ratio': d.ratios.currentRatio,
    'Quick Ratio': d.ratios.quickRatio,
  }));

  const leverageData = derived.map((d) => ({
    year: d.year,
    'Debt/Capital': d.ratios.debtToCapital,
    'Net Debt/EBITDA': d.ratios.netDebtToEbitda,
  }));

  const cashflowData = derived.map((d) => ({
    year: d.year,
    'Days Receivable': d.ratios.daysReceivable,
    'Days Inventory': d.ratios.daysInventory,
    'Days Payable': d.ratios.daysPayable,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Financial Ratios
      </h2>

      <Card title="Profitability">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RatioTable
            title=""
            years={years}
            rows={[
              { label: 'ROA', values: derived.map((d) => d.ratios.roa), format: (v) => formatPercent(v) },
              { label: 'ROE', values: derived.map((d) => d.ratios.roe), format: (v) => formatPercent(v) },
              { label: 'ROIC', values: derived.map((d) => d.ratios.roic), format: (v) => formatPercent(v) },
            ]}
          />
          <TrendChart
            data={profitabilityData}
            series={[
              { key: 'ROA', label: 'ROA', color: '#2563eb' },
              { key: 'ROE', label: 'ROE', color: '#059669' },
              { key: 'ROIC', label: 'ROIC', color: '#d97706' },
            ]}
            yFormat={(v) => `${v.toFixed(0)}%`}
          />
        </div>
      </Card>

      <Card title="Asset Turnover">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RatioTable
            title=""
            years={years}
            rows={[
              { label: 'Total Asset Turnover', values: derived.map((d) => d.ratios.totalAssetTurnover), format: (v) => formatMultiple(v) },
              { label: 'Fixed Asset Turnover', values: derived.map((d) => d.ratios.fixedAssetTurnover), format: (v) => formatMultiple(v) },
              { label: 'Inventory Turnover', values: derived.map((d) => d.ratios.inventoryTurnover), format: (v) => formatMultiple(v) },
            ]}
          />
          <TrendChart
            data={turnoverData}
            series={[
              { key: 'Total Asset', label: 'Total Asset', color: '#2563eb' },
              { key: 'Fixed Asset', label: 'Fixed Asset', color: '#059669' },
              { key: 'Inventory', label: 'Inventory', color: '#d97706' },
            ]}
            yFormat={(v) => `${v.toFixed(1)}x`}
          />
        </div>
      </Card>

      <Card title="Liquidity / Solvency">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RatioTable
            title=""
            years={years}
            rows={[
              { label: 'Current Ratio', values: derived.map((d) => d.ratios.currentRatio), format: (v) => formatMultiple(v) },
              { label: 'Quick Ratio', values: derived.map((d) => d.ratios.quickRatio), format: (v) => formatMultiple(v) },
            ]}
          />
          <TrendChart
            data={liquidityData}
            series={[
              { key: 'Current Ratio', label: 'Current Ratio', color: '#2563eb' },
              { key: 'Quick Ratio', label: 'Quick Ratio', color: '#dc2626' },
            ]}
            yFormat={(v) => `${v.toFixed(1)}x`}
          />
        </div>
      </Card>

      <Card title="Leverage">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RatioTable
            title=""
            years={years}
            rows={[
              { label: 'Debt / Capital', values: derived.map((d) => d.ratios.debtToCapital), format: (v) => formatPercent(v) },
              { label: 'Net Debt / EBITDA', values: derived.map((d) => d.ratios.netDebtToEbitda), format: (v) => formatMultiple(v) },
              { label: 'Interest Cover', values: derived.map((d) => d.ratios.interestCover), format: (v) => isFinite(v) ? formatMultiple(v) : 'N/M' },
            ]}
          />
          <TrendChart
            data={leverageData}
            series={[
              { key: 'Debt/Capital', label: 'Debt/Capital %', color: '#2563eb' },
              { key: 'Net Debt/EBITDA', label: 'Net Debt/EBITDA', color: '#dc2626' },
            ]}
          />
        </div>
      </Card>

      <Card title="Cashflow / Working Capital">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RatioTable
            title=""
            years={years}
            rows={[
              { label: 'Days Receivable', values: derived.map((d) => d.ratios.daysReceivable), format: (v) => formatDays(v) },
              { label: 'Days Inventory', values: derived.map((d) => d.ratios.daysInventory), format: (v) => formatDays(v) },
              { label: 'Days Payable', values: derived.map((d) => d.ratios.daysPayable), format: (v) => formatDays(v) },
              { label: 'Cash Conversion Cycle', values: derived.map((d) => d.ratios.cashConversionCycle), format: (v) => formatDays(v) },
            ]}
          />
          <TrendChart
            data={cashflowData}
            series={[
              { key: 'Days Receivable', label: 'DSO', color: '#2563eb' },
              { key: 'Days Inventory', label: 'DIO', color: '#059669' },
              { key: 'Days Payable', label: 'DPO', color: '#d97706' },
            ]}
            yFormat={(v) => `${v.toFixed(0)}d`}
          />
        </div>
      </Card>
    </div>
  );
}
