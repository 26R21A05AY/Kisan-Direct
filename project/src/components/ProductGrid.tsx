import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { CategoryBar, NoResults } from './CategoryBar';
import { useProducts } from '@/context/ProductsContext';
import { AlertCircle, RefreshCw, Loader2, Sprout } from 'lucide-react';

interface ProductGridProps {
  searchQuery: string;
  category: string;
  onCategoryChange: (category: string) => void;
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ searchQuery, category, onCategoryChange, onProductClick }: ProductGridProps) {
  const { products, loading, error, reload } = useProducts();

  if (loading) {
    return (
      <section id="products" className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-50 border border-forest-100">
            <Loader2 className="h-8 w-8 text-forest-500 animate-spin" />
          </div>
          <p className="mt-4 text-lg font-medium text-forest-800" style={{ fontFamily: '"Playfair Display", serif' }}>
            Loading fresh produce…
          </p>
          <p className="mt-1 text-sm text-gray-500">Fetching the latest harvest from our farms.</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border border-red-100">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <p className="mt-4 text-lg font-medium text-forest-800" style={{ fontFamily: '"Playfair Display", serif' }}>
            Couldn't load products
          </p>
          <p className="mt-1 max-w-md text-sm text-gray-500">{error}</p>
          <button
            onClick={reload}
            className="mt-6 inline-flex items-center gap-2 rounded-full forest-gradient px-6 py-2.5 text-sm font-semibold text-ivory-100 shadow-md transition-all hover:shadow-lg active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="products" className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-50 border border-forest-100">
            <Sprout className="h-8 w-8 text-forest-300" />
          </div>
          <p className="mt-4 text-lg font-medium text-forest-800" style={{ fontFamily: '"Playfair Display", serif' }}>
            No products yet
          </p>
          <p className="mt-1 text-sm text-gray-500">Our farmers are preparing their next harvest. Check back soon!</p>
        </div>
      </section>
    );
  }

  const filtered = products.filter((p: Product) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.farmer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.farmer_location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      category === 'all' ||
      (category === 'organic' ? p.is_organic : p.category === category);
    return matchesSearch && matchesCategory;
  });

  const counts = {
    all: products.length,
    vegetable: products.filter((p) => p.category === 'vegetable').length,
    fruit: products.filter((p) => p.category === 'fruit').length,
    organic: products.filter((p) => p.is_organic).length,
  };

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <CategoryBar active={category} onChange={onCategoryChange} counts={counts} />

      {filtered.length === 0 ? (
        <NoResults query={searchQuery} />
      ) : (
        <>
          <div className="mt-6 mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-forest-700">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
