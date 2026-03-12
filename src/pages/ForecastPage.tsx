import { useMemo } from 'react';
import { useFinancialData } from '../hooks/useFinancialData';
import { useRatios } from '../hooks/useRatios';
import { Card } from '../components/common/Card';
import { ForecastChart } from '../components/charts/ForecastChart';
import { RatioTable } from '../components/tables/RatioTable';
import { linearRegression } from '../lib/regression';
import { forecast, generateForecastYears } from '../lib/forecasting';
import { deriveIncomeStatement, deriveBalanceSheet, calculateRatios } from '../lib/ratios';
import { formatPercent, formatMultiple, formatDays } from '../lib/formatting';
import type { ForecastPoint } from '../types/statistics';

interface ForecastMetric {
  label: string;
  historical: { year: number; value: number }[];
  forecast: ForecastPoint[];
  yFormat?: (v: number) => string;
}

export function ForecastPage() {
  const { state, dispatch } = useFinancialData();
  const derived = useRatios(state.years);
  const years = state.years.map((y) => y.year);
  const futureYears = generateForecastYears(
    years[years.length - 1],
    state.forecastYearCount
  );
  const allProjectedYears = [...years, ...futureYears];

  const metrics = useMemo(() => {
    const buildForecast = (
      label: string,
      values: number[],
      yFmt?: (v: number) => string
    ): ForecastMetric => {
      const reg = linearRegression(years, values);
      const fc = forecast(reg, futureYears);
      return {
        label,
        historical: years.map((y, i) => ({ year: y, value: values[i] })),
        forecast: fc,
        yFormat: yFmt,
      };
    };

    return [
      buildForecast(
        'Sales',
        derived.map((d) => d.derivedIS.sales),
        (v) => `$${(v / 1000).toFixed(0)}B`
      ),
      buildForecast(
        'COGS %',
        state.years.map((y) => y.incomeStatement.cogsPercent),
        (v) => `${v.toFixed(1)}%`
      ),
      buildForecast(
        'SG&A %',
        state.years.map((y) => y.incomeStatement.sgaPercent),
        (v) => `${v.toFixed(1)}%`
      ),
      buildForecast(
        'EBITDA %',
        state.years.map((y) => y.incomeStatement.ebitdaPercent),
        (v) => `${v.toFixed(1)}%`
      ),
      buildForecast(
        'Net Income %',
        state.years.map((y) => y.incomeStatement.netIncomePercent),
        (v) => `${v.toFixed(1)}%`
      ),
      buildForecast(
        'Debt / Capital',
        derived.map((d) => d.ratios.debtToCapital),
        (v) => `${v.toFixed(1)}%`
      ),
    ];
  }, [state.years, derived, years, futureYears]);

  const projectedRatios = useMemo(() => {
    const salesReg = linearRegression(years, derived.map((d) => d.derivedIS.sales));
    const cogsReg = linearRegression(years, state.years.map((y) => y.incomeStatement.cogsPercent));
    const sgaReg = linearRegression(years, state.years.map((y) => y.incomeStatement.sgaPercent));
    const ebitdaReg = linearRegression(years, state.years.map((y) => y.incomeStatement.ebitdaPercent));
    const ebitReg = linearRegression(years, state.years.map((y) => y.incomeStatement.ebitPercent));
    const niReg = linearRegression(years, state.years.map((y) => y.incomeStatement.netIncomePercent));
    const taReg = linearRegression(years, state.years.map((y) => y.balanceSheet.totalAssets));
    const cashReg = linearRegression(years, state.years.map((y) => y.balanceSheet.cashPercent));
    const recReg = linearRegression(years, state.years.map((y) => y.balanceSheet.receivablesPercent));
    const invReg = linearRegression(years, state.years.map((y) => y.balanceSheet.inventoryPercent));
    const ppeReg = linearRegression(years, state.years.map((y) => y.balanceSheet.netPPEPercent));
    const otherAReg = linearRegression(years, state.years.map((y) => y.balanceSheet.otherAssetsPercent));
    const payReg = linearRegression(years, state.years.map((y) => y.balanceSheet.payablesPercent));
    const debtReg = linearRegression(years, state.years.map((y) => y.balanceSheet.debtPercent));
    const otherLReg = linearRegression(years, state.years.map((y) => y.balanceSheet.otherLiabilitiesPercent));
    const eqReg = linearRegression(years, state.years.map((y) => y.balanceSheet.equityPercent));

    return futureYears.map((yr) => {
      const is = {
        sales: salesReg.slope * yr + salesReg.intercept,
        cogsPercent: cogsReg.slope * yr + cogsReg.intercept,
        sgaPercent: sgaReg.slope * yr + sgaReg.intercept,
        ebitdaPercent: ebitdaReg.slope * yr + ebitdaReg.intercept,
        ebitPercent: ebitReg.slope * yr + ebitReg.intercept,
        netIncomePercent: niReg.slope * yr + niReg.intercept,
      };
      const bs = {
        totalAssets: taReg.slope * yr + taReg.intercept,
        cashPercent: cashReg.slope * yr + cashReg.intercept,
        receivablesPercent: recReg.slope * yr + recReg.intercept,
        inventoryPercent: invReg.slope * yr + invReg.intercept,
        netPPEPercent: ppeReg.slope * yr + ppeReg.intercept,
        otherAssetsPercent: otherAReg.slope * yr + otherAReg.intercept,
        payablesPercent: payReg.slope * yr + payReg.intercept,
        debtPercent: debtReg.slope * yr + debtReg.intercept,
        otherLiabilitiesPercent: otherLReg.slope * yr + otherLReg.intercept,
        equityPercent: eqReg.slope * yr + eqReg.intercept,
      };
      const dIS = deriveIncomeStatement(is);
      const dBS = deriveBalanceSheet(bs);
      const ratios = calculateRatios(dIS, dBS);
      return { year: yr, ratios };
    });
  }, [state.years, derived, years, futureYears]);

  const historicalRatios = derived.map((d) => ({ year: d.year, ratios: d.ratios }));
  const allRatios = [...historicalRatios, ...projectedRatios];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Forecast & Projections
        </h2>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span>Forecast years:</span>
          <select
            value={state.forecastYearCount}
            onChange={(e) =>
              dispatch({
                type: 'SET_FORECAST_YEARS',
                count: parseInt(e.target.value),
              })
            }
            className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
        Projections are based on linear regression of historical data (2014-2018).
        Confidence bands represent 95% intervals. With only 5 data points, forecasts are indicative only.
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {metrics.map((m) => (
          <Card key={m.label} title={m.label}>
            <ForecastChart
              historical={m.historical}
              forecast={m.forecast}
              label={m.label}
              yFormat={m.yFormat}
            />
          </Card>
        ))}
      </div>

      <Card title="Projected Ratios">
        <RatioTable
          title=""
          years={allProjectedYears}
          rows={[
            { label: 'ROA', values: allRatios.map((r) => r.ratios.roa), format: (v) => formatPercent(v) },
            { label: 'ROE', values: allRatios.map((r) => r.ratios.roe), format: (v) => formatPercent(v) },
            { label: 'ROIC', values: allRatios.map((r) => r.ratios.roic), format: (v) => formatPercent(v) },
            { label: 'Total Asset Turnover', values: allRatios.map((r) => r.ratios.totalAssetTurnover), format: (v) => formatMultiple(v) },
            { label: 'Current Ratio', values: allRatios.map((r) => r.ratios.currentRatio), format: (v) => formatMultiple(v) },
            { label: 'Debt / Capital', values: allRatios.map((r) => r.ratios.debtToCapital), format: (v) => formatPercent(v) },
            { label: 'Days Inventory', values: allRatios.map((r) => r.ratios.daysInventory), format: (v) => formatDays(v) },
            { label: 'Cash Conversion', values: allRatios.map((r) => r.ratios.cashConversionCycle), format: (v) => formatDays(v) },
          ]}
        />
      </Card>
    </div>
  );
}
