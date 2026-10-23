import { Search } from 'lucide-react';

interface CategoryBarProps {
  active: string;
  onChange: (category: string) => void;
  counts: Record<string, number>;
}

const categories = [
  { key: 'all', label: 'All Products' },
  { key: 'vegetable', label: 'Vegetables' },
  { key: 'fruit', label: 'Fruits' },
  { key: 'organic', label: 'Organic' },
];

export function CategoryBar({ active, onChange, counts }: CategoryBarProps) {
  return (
    <div className="sticky top-16 z-30 bg-ivory-50/90 backdrop-blur-md border-b border-forest-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onChange(cat.key)}
              className={`shrink-0 rounded-full px-4 sm:px-5 py-2 text-sm font-medium transition-all duration-300 ${
                active === cat.key
                  ? 'forest-gradient text-ivory-100 shadow-md shadow-forest-600/20'
                  : 'bg-white border border-forest-100 text-forest-700 hover:border-forest-300 hover:bg-forest-50'
              }`}
            >
              {cat.label}
              {counts[cat.key] !== undefined && (
                <span
                  className={`ml-1.5 text-xs ${
                    active === cat.key ? 'text-ivory-200' : 'text-forest-300'
                  }`}
                >
                  ({counts[cat.key]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NoResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-50 border border-forest-100">
        <Search className="h-8 w-8 text-forest-300" />
      </div>
      <p className="mt-4 text-lg font-medium text-forest-800" style={{ fontFamily: '"Playfair Display", serif' }}>No products found</p>
      <p className="mt-1 text-sm text-gray-500">
        We couldn't find anything matching "{query}". Try a different search.
      </p>
    </div>
  );
}
