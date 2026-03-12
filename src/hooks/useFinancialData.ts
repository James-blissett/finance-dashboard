import { useContext } from 'react';
import { FinancialDataContext } from '../context/FinancialDataContext';

export function useFinancialData() {
  return useContext(FinancialDataContext);
}
