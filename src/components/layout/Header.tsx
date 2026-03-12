import { useTheme } from '../../hooks/useTheme';

export function Header() {
  const { dark, toggle } = useTheme();

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Woolworths Group (ASX:WOW)
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Financial Ratio Analysis &amp; Proforma Model
          </p>
        </div>
        <button
          onClick={toggle}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
        >
          {dark ? 'Light' : 'Dark'}
        </button>
      </div>
    </header>
  );
}
