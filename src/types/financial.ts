export interface IncomeStatementData {
  sales: number;
  cogsPercent: number;
  sgaPercent: number;
  ebitdaPercent: number;
  ebitPercent: number;
  netIncomePercent: number;
}

export interface BalanceSheetData {
  totalAssets: number;
  cashPercent: number;
  receivablesPercent: number;
  inventoryPercent: number;
  netPPEPercent: number;
  otherAssetsPercent: number;
  payablesPercent: number;
  debtPercent: number;
  otherLiabilitiesPercent: number;
  equityPercent: number;
}

export interface FiscalYear {
  year: number;
  incomeStatement: IncomeStatementData;
  balanceSheet: BalanceSheetData;
}

export interface DerivedIncomeStatement {
  sales: number;
  cogs: number;
  grossProfit: number;
  sga: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  interestExpense: number;
  netIncome: number;
}

export interface DerivedBalanceSheet {
  totalAssets: number;
  cash: number;
  receivables: number;
  inventory: number;
  netPPE: number;
  otherAssets: number;
  totalCurrentAssets: number;
  payables: number;
  debt: number;
  otherLiabilities: number;
  totalLiabilities: number;
  equity: number;
  investedCapital: number;
}

export interface FinancialRatios {
  roa: number;
  roe: number;
  roic: number;
  totalAssetTurnover: number;
  fixedAssetTurnover: number;
  inventoryTurnover: number;
  currentRatio: number;
  quickRatio: number;
  debtToCapital: number;
  netDebtToEbitda: number;
  interestCover: number;
  daysReceivable: number;
  daysInventory: number;
  daysPayable: number;
  cashConversionCycle: number;
}

export type TabId = 'overview' | 'proforma' | 'ratios' | 'regression' | 'forecast';
