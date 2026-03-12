import type {
  IncomeStatementData,
  BalanceSheetData,
  DerivedIncomeStatement,
  DerivedBalanceSheet,
  FinancialRatios,
} from '../types/financial';

const DEFAULT_TAX_RATE = 0.25; // PRC corporate income tax rate

export function deriveIncomeStatement(
  is: IncomeStatementData,
  taxRate = DEFAULT_TAX_RATE
): DerivedIncomeStatement {
  const sales = is.sales;
  const cogs = sales * (is.cogsPercent / 100);
  const grossProfit = sales - cogs;
  const sga = sales * (is.sgaPercent / 100);
  const ebitda = sales * (is.ebitdaPercent / 100);
  const ebit = sales * (is.ebitPercent / 100);
  const depreciation = ebitda - ebit;
  const netIncome = sales * (is.netIncomePercent / 100);
  const ebt = netIncome / (1 - taxRate);
  const interestExpense = Math.max(ebit - ebt, 0);

  return {
    sales,
    cogs,
    grossProfit,
    sga,
    ebitda,
    depreciation,
    ebit,
    interestExpense,
    netIncome,
  };
}

export function deriveBalanceSheet(bs: BalanceSheetData): DerivedBalanceSheet {
  const ta = bs.totalAssets;
  const cash = ta * (bs.cashPercent / 100);
  const receivables = ta * (bs.receivablesPercent / 100);
  const inventory = ta * (bs.inventoryPercent / 100);
  const netPPE = ta * (bs.netPPEPercent / 100);
  const otherAssets = ta * (bs.otherAssetsPercent / 100);
  const payables = ta * (bs.payablesPercent / 100);
  const debt = ta * (bs.debtPercent / 100);
  const otherLiabilities = ta * (bs.otherLiabilitiesPercent / 100);
  const equity = ta * (bs.equityPercent / 100);
  const totalCurrentAssets = cash + receivables + inventory;
  const totalLiabilities = payables + debt + otherLiabilities;
  const investedCapital = equity + debt - cash;

  return {
    totalAssets: ta,
    cash,
    receivables,
    inventory,
    netPPE,
    otherAssets,
    totalCurrentAssets,
    payables,
    debt,
    otherLiabilities,
    totalLiabilities,
    equity,
    investedCapital,
  };
}

export function calculateRatios(
  is: DerivedIncomeStatement,
  bs: DerivedBalanceSheet,
  taxRate = DEFAULT_TAX_RATE
): FinancialRatios {
  const currentLiabilities = bs.payables + bs.otherLiabilities;

  return {
    roa: (is.netIncome / bs.totalAssets) * 100,
    roe: bs.equity !== 0 ? (is.netIncome / bs.equity) * 100 : 0,
    roic:
      bs.investedCapital !== 0
        ? ((is.ebit * (1 - taxRate)) / bs.investedCapital) * 100
        : 0,

    totalAssetTurnover: bs.totalAssets !== 0 ? is.sales / bs.totalAssets : 0,
    fixedAssetTurnover: bs.netPPE !== 0 ? is.sales / bs.netPPE : 0,
    inventoryTurnover: bs.inventory !== 0 ? is.cogs / bs.inventory : 0,

    currentRatio:
      currentLiabilities !== 0
        ? bs.totalCurrentAssets / currentLiabilities
        : 0,
    quickRatio:
      currentLiabilities !== 0
        ? (bs.totalCurrentAssets - bs.inventory) / currentLiabilities
        : 0,

    debtToCapital:
      bs.debt + bs.equity !== 0
        ? (bs.debt / (bs.debt + bs.equity)) * 100
        : 0,
    netDebtToEbitda:
      is.ebitda !== 0 ? (bs.debt - bs.cash) / is.ebitda : 0,
    interestCover:
      is.interestExpense > 0 ? is.ebit / is.interestExpense : NaN,

    daysReceivable: is.sales !== 0 ? (bs.receivables / is.sales) * 365 : 0,
    daysInventory: is.cogs !== 0 ? (bs.inventory / is.cogs) * 365 : 0,
    daysPayable: is.cogs !== 0 ? (bs.payables / is.cogs) * 365 : 0,
    cashConversionCycle:
      is.sales !== 0 && is.cogs !== 0
        ? (bs.receivables / is.sales) * 365 +
          (bs.inventory / is.cogs) * 365 -
          (bs.payables / is.cogs) * 365
        : 0,
  };
}
