import {
  createContext,
  useReducer,
  type ReactNode,
} from 'react';
import type {
  FiscalYear,
  IncomeStatementData,
  BalanceSheetData,
} from '../types/financial';
import { DEFAULT_DATA } from '../data/woolworths';

type ISField = keyof IncomeStatementData;
type BSField = keyof BalanceSheetData;

type FinancialAction =
  | { type: 'UPDATE_IS_FIELD'; year: number; field: ISField; value: number }
  | { type: 'UPDATE_BS_FIELD'; year: number; field: BSField; value: number }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'SET_FORECAST_YEARS'; count: number };

interface FinancialState {
  years: FiscalYear[];
  forecastYearCount: number;
}

interface FinancialContextValue {
  state: FinancialState;
  dispatch: React.Dispatch<FinancialAction>;
}

const initialState: FinancialState = {
  years: DEFAULT_DATA,
  forecastYearCount: 3,
};

function reducer(state: FinancialState, action: FinancialAction): FinancialState {
  switch (action.type) {
    case 'UPDATE_IS_FIELD':
      return {
        ...state,
        years: state.years.map((fy) =>
          fy.year === action.year
            ? {
                ...fy,
                incomeStatement: {
                  ...fy.incomeStatement,
                  [action.field]: action.value,
                },
              }
            : fy
        ),
      };
    case 'UPDATE_BS_FIELD':
      return {
        ...state,
        years: state.years.map((fy) =>
          fy.year === action.year
            ? {
                ...fy,
                balanceSheet: {
                  ...fy.balanceSheet,
                  [action.field]: action.value,
                },
              }
            : fy
        ),
      };
    case 'RESET_TO_DEFAULTS':
      return initialState;
    case 'SET_FORECAST_YEARS':
      return { ...state, forecastYearCount: action.count };
    default:
      return state;
  }
}

export const FinancialDataContext = createContext<FinancialContextValue>({
  state: initialState,
  dispatch: () => {},
});

export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <FinancialDataContext.Provider value={{ state, dispatch }}>
      {children}
    </FinancialDataContext.Provider>
  );
}
