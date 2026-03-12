import { useState, useMemo } from 'react';
import { useFinancialData } from '../hooks/useFinancialData';
import { useRatios } from '../hooks/useRatios';
import { Card } from '../components/common/Card';
import { Select } from '../components/common/Select';
import { RegressionScatter } from '../components/charts/RegressionScatter';
import { CorrelationHeatmap } from '../components/charts/CorrelationHeatmap';
import { linearRegression } from '../lib/regression';
import { buildCorrelationMatrix } from '../lib/correlation';

type VariableKey = string;

interface VariableDef {
  key: VariableKey;
  label: string;
  extract: (yearIndex: number) => number;
}

export function RegressionPage() {
  const { state } = useFinancialData();
  const derived = useRatios(state.years);

  const variables: VariableDef[] = useMemo(
    () => [
      { key: 'year', label: 'Year', extract: (i) => state.years[i].year },
      { key: 'sales', label: 'Sales', extract: (i) => derived[i].derivedIS.sales },
      { key: 'cogsPercent', label: 'COGS %', extract: (i) => state.years[i].incomeStatement.cogsPercent },
      { key: 'sgaPercent', label: 'SG&A %', extract: (i) => state.years[i].incomeStatement.sgaPercent },
      { key: 'ebitdaPercent', label: 'EBITDA %', extract: (i) => state.years[i].incomeStatement.ebitdaPercent },
      { key: 'ebitPercent', label: 'EBIT %', extract: (i) => state.years[i].incomeStatement.ebitPercent },
      { key: 'netIncomePercent', label: 'Net Income %', extract: (i) => state.years[i].incomeStatement.netIncomePercent },
      { key: 'roa', label: 'ROA', extract: (i) => derived[i].ratios.roa },
      { key: 'roe', label: 'ROE', extract: (i) => derived[i].ratios.roe },
      { key: 'roic', label: 'ROIC', extract: (i) => derived[i].ratios.roic },
      { key: 'totalAssetTurnover', label: 'Total Asset Turnover', extract: (i) => derived[i].ratios.totalAssetTurnover },
      { key: 'inventoryTurnover', label: 'Inventory Turnover', extract: (i) => derived[i].ratios.inventoryTurnover },
      { key: 'debtToCapital', label: 'Debt/Capital', extract: (i) => derived[i].ratios.debtToCapital },
      { key: 'currentRatio', label: 'Current Ratio', extract: (i) => derived[i].ratios.currentRatio },
      { key: 'daysReceivable', label: 'Days Receivable', extract: (i) => derived[i].ratios.daysReceivable },
      { key: 'daysInventory', label: 'Days Inventory', extract: (i) => derived[i].ratios.daysInventory },
      { key: 'daysPayable', label: 'Days Payable', extract: (i) => derived[i].ratios.daysPayable },
    ],
    [state.years, derived]
  );

  const [xKey, setXKey] = useState<string>('year');
  const [yKey, setYKey] = useState<string>('sales');

  const xVar = variables.find((v) => v.key === xKey)!;
  const yVar = variables.find((v) => v.key === yKey)!;

  const indices = Array.from({ length: state.years.length }, (_, i) => i);
  const xs = indices.map((i) => xVar.extract(i));
  const ys = indices.map((i) => yVar.extract(i));
  const regression = useMemo(() => linearRegression(xs, ys), [xs, ys]);
  const points = indices.map((i) => ({
    x: xs[i],
    y: ys[i],
    label: String(state.years[i].year),
  }));

  const correlationSeries = useMemo(
    () =>
      variables
        .filter((v) => v.key !== 'year')
        .map((v) => ({
          label: v.label,
          values: indices.map((i) => v.extract(i)),
        })),
    [variables, indices]
  );

  const corrMatrix = useMemo(
    () => buildCorrelationMatrix(correlationSeries),
    [correlationSeries]
  );

  const presetPairs: { label: string; x: string; y: string }[] = [
    { label: 'Sales vs Year (Growth Trend)', x: 'year', y: 'sales' },
    { label: 'COGS% vs Year (Cost Efficiency)', x: 'year', y: 'cogsPercent' },
    { label: 'SG&A% vs Year (Operating Leverage)', x: 'year', y: 'sgaPercent' },
    { label: 'ROE vs Debt/Capital (Leverage Effect)', x: 'debtToCapital', y: 'roe' },
    { label: 'Net Income% vs EBITDA% (Flow-through)', x: 'ebitdaPercent', y: 'netIncomePercent' },
    { label: 'Days Payable vs Days Inventory', x: 'daysInventory', y: 'daysPayable' },
    { label: 'Inventory Turnover vs Year', x: 'year', y: 'inventoryTurnover' },
    { label: 'Debt/Capital vs Year (Deleveraging)', x: 'year', y: 'debtToCapital' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Regression Analysis
      </h2>

      <Card title="Variable Selection">
        <div className="flex flex-wrap items-end gap-4">
          <Select
            label="X-Axis"
            value={xKey}
            options={variables.map((v) => ({ value: v.key, label: v.label }))}
            onChange={setXKey}
          />
          <Select
            label="Y-Axis"
            value={yKey}
            options={variables.map((v) => ({ value: v.key, label: v.label }))}
            onChange={setYKey}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {presetPairs.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setXKey(p.x);
                setYKey(p.y);
              }}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                xKey === p.x && yKey === p.y
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-slate-600 dark:text-gray-400 dark:hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </Card>

      <Card title={`${yVar.label} vs ${xVar.label}`}>
        <RegressionScatter
          points={points}
          regression={regression}
          xLabel={xVar.label}
          yLabel={yVar.label}
        />
        <div className="mt-2 rounded bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          Note: Regression based on 5 data points (2014-2018). Results should be interpreted with caution due to small sample size.
        </div>
      </Card>

      <Card title="Correlation Matrix">
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          Pearson correlation coefficients between all financial metrics. Green = strong positive, Red = strong negative.
        </p>
        <CorrelationHeatmap matrix={corrMatrix} />
      </Card>
    </div>
  );
}
