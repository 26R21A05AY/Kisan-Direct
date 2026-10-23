import { Leaf, Mail, Phone, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface FooterProps {
  onShopCategory: (category: string) => void;
  onNavigate: (page: 'home' | 'login' | 'signup') => void;
  onAboutClick: () => void;
  onLogout: () => void;
}

export function Footer({ onShopCategory, onNavigate, onAboutClick, onLogout }: FooterProps) {
  const { user } = useAuth();
  return (
    <footer className="bg-forest-950 text-gray-400 mt-16">
      {/* Gold accent line at top */}
      <div className="h-1 gold-gradient" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl forest-gradient">
                <Leaf className="h-5 w-5 text-ivory-100" />
              </div>
              <span className="text-lg font-bold text-white" style={{ fontFamily: '"Playfair Display", serif' }}>Kisan Direct</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Connecting Indian farmers directly with consumers. Fresh, affordable, and ethically sourced produce.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><button onClick={() => onShopCategory('vegetable')} className="hover:text-emerald2-300 transition-colors">Vegetables</button></li>
              <li><button onClick={() => onShopCategory('fruit')} className="hover:text-emerald2-300 transition-colors">Fruits</button></li>
              <li><button onClick={() => onShopCategory('organic')} className="hover:text-emerald2-300 transition-colors">Organic</button></li>
              <li><button onClick={() => onShopCategory('all')} className="hover:text-emerald2-300 transition-colors">All Products</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><button onClick={onAboutClick} className="hover:text-emerald2-300 transition-colors">About Us</button></li>
              <li><a href="#top" className="hover:text-emerald2-300 transition-colors">Our Farmers</a></li>
              <li><a href="#top" className="hover:text-emerald2-300 transition-colors">Sell on Kisan Direct</a></li>
              <li><a href="#top" className="hover:text-emerald2-300 transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Account + Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">Account</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {user ? (
                <>
                  <li className="text-gray-300">Signed in as {user.name}</li>
                  <li><button onClick={onLogout} className="inline-flex items-center gap-1.5 hover:text-red-400 transition-colors"><LogOut className="h-3.5 w-3.5" /> Logout</button></li>
                </>
              ) : (
                <>
                  <li><button onClick={() => onNavigate('login')} className="hover:text-emerald2-300 transition-colors">Login</button></li>
                  <li><button onClick={() => onNavigate('signup')} className="hover:text-emerald2-300 transition-colors">Create Account</button></li>
                </>
              )}
            </ul>
            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gold-400">Get in Touch</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald2-400" />
                hello@kisandirect.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald2-400" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald2-400" />
                Bengaluru, Karnataka
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-forest-800 pt-6 sm:flex-row">
          <p className="text-xs">© 2026 Kisan Direct. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            <a href="#top" className="hover:text-emerald2-300 transition-colors">Privacy Policy</a>
            <a href="#top" className="hover:text-emerald2-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
