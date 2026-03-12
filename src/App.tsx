import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { FinancialDataProvider } from './context/FinancialDataContext';
import { Header } from './components/layout/Header';
import { TabNav } from './components/layout/TabNav';
import { Footer } from './components/layout/Footer';
import { OverviewPage } from './pages/OverviewPage';
import { ProformaPage } from './pages/ProformaPage';
import { RatiosPage } from './pages/RatiosPage';
import { RegressionPage } from './pages/RegressionPage';
import { ForecastPage } from './pages/ForecastPage';
import type { TabId } from './types/financial';

function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-gray-100">
      <Header />
      <TabNav active={activeTab} onChange={setActiveTab} />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {activeTab === 'overview' && <OverviewPage />}
          {activeTab === 'proforma' && <ProformaPage />}
          {activeTab === 'ratios' && <RatiosPage />}
          {activeTab === 'regression' && <RegressionPage />}
          {activeTab === 'forecast' && <ForecastPage />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FinancialDataProvider>
        <Dashboard />
      </FinancialDataProvider>
    </ThemeProvider>
  );
}
