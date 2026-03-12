import { useMemo } from 'react';
import type { FiscalYear, FinancialRatios, DerivedIncomeStatement, DerivedBalanceSheet } from '../types/financial';
import { deriveIncomeStatement, deriveBalanceSheet, calculateRatios } from '../lib/ratios';

interface YearlyDerived {
  year: number;
  derivedIS: DerivedIncomeStatement;
  derivedBS: DerivedBalanceSheet;
  ratios: FinancialRatios;
}

export function useRatios(years: FiscalYear[]): YearlyDerived[] {
  return useMemo(() => {
    return years.map((fy) => {
      const derivedIS = deriveIncomeStatement(fy.incomeStatement);
      const derivedBS = deriveBalanceSheet(fy.balanceSheet);
      const ratios = calculateRatios(derivedIS, derivedBS);
      return { year: fy.year, derivedIS, derivedBS, ratios };
    });
  }, [years]);
}
