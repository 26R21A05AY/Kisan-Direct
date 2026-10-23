import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

interface ProductsContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchProducts()
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .catch((err: unknown) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Failed to load products');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [reloadKey]);

  return (
    <ProductsContext.Provider
      value={{ products, loading, error, reload: () => setReloadKey((k) => k + 1) }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
