import { useState } from 'react';
import { CartProvider } from '@/context/CartContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { LoginPage } from '@/components/LoginPage';
import { SignUpPage } from '@/components/SignUpPage';
import { FarmBanner } from '@/components/FarmBanner';
import { AboutSection } from '@/components/AboutSection';
import { QuoteStrip } from '@/components/QuoteStrip';
import { ProductModal } from '@/components/ProductModal';
import { Leaf } from 'lucide-react';
import type { Product } from '@/types';

type Page = 'home' | 'login' | 'signup';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [page, setPage] = useState<Page>('login');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const navigate = (next: Page) => {
    setPage(next);
    window.scrollTo({ top: 0 });
  };

  const handleLogout = async () => {
    await logout();
    navigate('login');
  };

  const scrollToProducts = (cat?: string) => {
    if (cat) setCategory(cat);
    setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory-50">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl forest-gradient shadow-lg animate-pulse">
            <Leaf className="h-8 w-8 text-ivory-100" />
          </div>
          <p className="text-sm font-medium text-forest-700" style={{ fontFamily: '"Playfair Display", serif' }}>
            Loading Kisan Direct…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (page === 'signup') {
      return <SignUpPage onNavigate={navigate} />;
    }
    return <LoginPage onNavigate={navigate} />;
  }

  return (
    <ProductsProvider>
      <CartProvider>
        <div id="top" className="min-h-screen bg-ivory-50">
        <Header
          onCartClick={() => setCartOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
        <main>
          <Hero onShopNow={() => scrollToProducts()} />
          <FarmBanner />
          <ProductGrid
            searchQuery={searchQuery}
            category={category}
            onCategoryChange={setCategory}
            onProductClick={openProduct}
          />
          <AboutSection />
          <QuoteStrip />
        </main>
        <Footer onShopCategory={scrollToProducts} onNavigate={navigate} onAboutClick={scrollToAbout} onLogout={handleLogout} />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={closeProduct}
            onProductClick={openProduct}
          />
        )}
      </div>
      </CartProvider>
    </ProductsProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
