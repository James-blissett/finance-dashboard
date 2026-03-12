import type { TabId } from '../../types/financial';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'proforma', label: 'Proforma' },
  { id: 'ratios', label: 'Ratios' },
  { id: 'regression', label: 'Regression' },
  { id: 'forecast', label: 'Forecast' },
];

interface TabNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-gray-200 bg-gray-50 px-6 dark:border-slate-700 dark:bg-slate-800/50">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors ${
            active === tab.id
              ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
