import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Leaf, X, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigate: (page: 'home' | 'login' | 'signup') => void;
  onLogout: () => void;
}

export function Header({ onCartClick, searchQuery, onSearchChange, onNavigate, onLogout }: HeaderProps) {
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ivory-50/95 backdrop-blur-md shadow-md py-2 border-b border-forest-100'
          : 'bg-ivory-50 py-3'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2 shrink-0 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl forest-gradient shadow-md transition-transform group-hover:scale-105">
              <Leaf className="h-6 w-6 text-ivory-100" />
            </div>
            <div className="hidden sm:block">
              <span className="block text-lg font-bold leading-tight text-forest-800" style={{ fontFamily: '"Playfair Display", serif' }}>Kisan Direct</span>
              <span className="block text-xs text-gold-600 leading-tight font-medium">Farm to your table</span>
            </div>
          </a>

          {/* Desktop search */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-forest-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search for vegetables, fruits..."
                className="w-full rounded-full border border-forest-200 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-forest-800 transition-all focus:border-forest-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-forest-600 hover:bg-forest-100 md:hidden"
              aria-label="Search"
            >
              {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            {/* Auth buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full bg-forest-50 border border-forest-100 px-3 py-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-600 text-xs font-bold text-ivory-100">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-forest-800 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-forest-700 transition-colors hover:bg-forest-50"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="rounded-full bg-forest-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-forest-700 hover:shadow-md active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            )}

            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 rounded-full bg-forest-600 px-4 py-2.5 text-sm font-semibold text-ivory-100 shadow-sm transition-all hover:bg-forest-700 hover:shadow-md active:scale-95"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-400 px-1 text-xs font-bold text-forest-900 shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {mobileSearchOpen && (
          <div className="mt-3 md:hidden animate-fadeIn">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-forest-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onBlur={() => setMobileSearchOpen(false)}
                placeholder="Search for vegetables, fruits..."
                className="w-full rounded-full border border-forest-200 bg-white py-2.5 pl-10 pr-4 text-sm text-forest-800 transition-all focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
