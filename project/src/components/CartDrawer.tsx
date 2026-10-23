import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, Check, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductsContext';
import { supabase } from '@/lib/supabase';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, itemCount } = useCart();
  const { user } = useAuth();
  const { reload } = useProducts();
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    setCheckoutError(null);
    setPlacing(true);
    try {
      const payload = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }));
      const { error } = await supabase.rpc('place_order', {
        p_items: payload,
        p_delivery_fee: deliveryFee,
      });
      if (error) {
        setCheckoutError(error.message);
        return;
      }
      setCheckoutDone(true);
      clearCart();
      reload();
      setTimeout(() => {
        setCheckoutDone(false);
        onClose();
      }, 2800);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-forest-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-ivory-50 shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-forest-100 p-5 bg-white">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl forest-gradient">
              <ShoppingCart className="h-5 w-5 text-ivory-100" />
            </div>
            <h2 className="text-xl font-bold text-forest-900" style={{ fontFamily: '"Playfair Display", serif' }}>Your Cart</h2>
            {itemCount > 0 && (
              <span className="rounded-full bg-forest-100 px-2.5 py-0.5 text-xs font-semibold text-forest-700">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-forest-50 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {checkoutDone ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald2-100">
              <Check className="h-10 w-10 text-emerald2-600" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-forest-900" style={{ fontFamily: '"Playfair Display", serif' }}>Order Placed!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Thank you for supporting local farmers. Your fresh produce is on the way!
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest-50 border border-forest-100">
              <ShoppingCart className="h-10 w-10 text-forest-200" />
            </div>
            <p className="mt-5 text-lg font-medium text-forest-800" style={{ fontFamily: '"Playfair Display", serif' }}>Your cart is empty</p>
            <p className="mt-1 text-sm text-gray-500">Add some fresh produce to get started.</p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full forest-gradient px-6 py-2.5 text-sm font-semibold text-ivory-100 shadow-md transition-all hover:shadow-lg active:scale-95"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-forest-100 bg-white p-3 shadow-sm"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-forest-50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-forest-200" />
                    </div>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      className="relative h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-forest-900 leading-tight">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.farmer_name}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 rounded-lg border border-forest-200 bg-forest-50/50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-forest-700 hover:bg-forest-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-forest-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-forest-700 hover:bg-forest-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-forest-700">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-forest-100 p-5 space-y-3 bg-white">
              <div className="space-y-1.5">
                <Row label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
                <Row
                  label="Delivery Fee"
                  value={deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  highlight={deliveryFee === 0}
                />
                {deliveryFee > 0 && (
                  <p className="text-xs text-forest-600">
                    Add ₹{(500 - subtotal).toFixed(2)} more for free delivery!
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-forest-200 pt-3">
                <span className="text-base font-bold text-forest-900">Total</span>
                <span className="text-xl font-bold text-forest-700">₹{total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={placing || !user}
                className="w-full rounded-xl forest-gradient py-3.5 text-base font-semibold text-ivory-100 shadow-lg shadow-forest-600/25 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {placing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Placing order…
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>
              {!user && (
                <p className="text-center text-xs text-gray-500">Please sign in to place an order.</p>
              )}
              {checkoutError && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-800">{checkoutError}</p>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-emerald2-600' : 'text-forest-900'}`}>{value}</span>
    </div>
  );
}
