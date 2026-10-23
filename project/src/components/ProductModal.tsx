import { useState, useEffect } from 'react';
import { X, Plus, Minus, Star, Leaf, MapPin, Truck, Shield, Check, ImageIcon, ShoppingCart, Package } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductsContext';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export function ProductModal({ product, onClose, onProductClick }: ProductModalProps) {
  const { addToCart, items, updateQuantity } = useCart();
  const { products } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const maxQty = Math.max(1, product.stock_quantity);
  const inCartQty = items.find((item) => item.id === product.id)?.quantity ?? 0;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
  }, [product.id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-forest-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
        <div
          className="pointer-events-auto relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-md hover:bg-white hover:text-forest-700 transition-all"
            aria-label="Close product details"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid md:grid-cols-2">
            {/* Image side */}
            <div className="relative aspect-square md:aspect-auto md:min-h-[420px] overflow-hidden bg-forest-50">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-forest-200" />
              </div>
              <img
                src={product.image_url}
                alt={product.name}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="relative h-full w-full object-cover"
              />
              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.is_organic && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-forest-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                    <Leaf className="h-3.5 w-3.5" />
                    Organic
                  </span>
                )}
                {!product.in_stock && (
                  <span className="inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-white">
                    Out of Stock
                  </span>
                )}
                {product.in_stock && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-forest-700 shadow-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald2-500" />
                    In Stock
                  </span>
                )}
              </div>
              {/* Rating badge */}
              <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-gold-600 shadow-md">
                <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                {product.rating.toFixed(1)}
              </div>
            </div>

            {/* Details side */}
            <div className="flex flex-col p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-forest-500">
                {product.category === 'vegetable' ? 'Vegetable' : 'Fruit'}
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-forest-900 leading-tight">
                {product.name}
              </h2>

              {/* Farmer info */}
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 text-forest-400 shrink-0" />
                <span>{product.farmer_name} • {product.farmer_location}</span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-forest-700">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-base font-normal text-gray-400">/{product.unit}</span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Stock info */}
              {product.in_stock && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-forest-600">
                  <Package className="h-3.5 w-3.5" />
                  {product.stock_quantity} {product.unit}(s) available
                </p>
              )}

              {/* Freshness info */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <InfoBadge icon={<Truck className="h-4 w-4" />} label="Harvested" value="24-48 hrs ago" />
                <InfoBadge icon={<Shield className="h-4 w-4" />} label="Quality" value="Farm verified" />
              </div>

              {/* Quantity selector */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-forest-200 bg-forest-50/50 overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-10 w-10 items-center justify-center text-forest-700 hover:bg-forest-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-base font-bold text-forest-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                      className="flex h-10 w-10 items-center justify-center text-forest-700 hover:bg-forest-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Total: <span className="font-bold text-forest-700">₹{(product.price * quantity).toFixed(2)}</span>
                  </span>
                </div>
              </div>

              {/* Add to cart button */}
              <div className="mt-6 flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-white shadow-lg transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                    added
                      ? 'bg-emerald2-600 hover:bg-emerald2-700'
                      : 'bg-forest-600 hover:bg-forest-700 shadow-forest-600/25'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="h-5 w-5" />
                      Added {quantity} to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                {inCartQty > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald2-50 border border-emerald2-200 px-2 py-2 text-sm font-bold text-emerald2-700">
                    <button
                      onClick={() => updateQuantity(product.id, inCartQty - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-emerald2-700 hover:bg-emerald2-100 transition-colors"
                      aria-label="Remove one from cart"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    +{inCartQty}
                    <button
                      onClick={() => addToCart(product)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-emerald2-700 hover:bg-emerald2-100 transition-colors"
                      aria-label="Add one to cart"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="border-t border-forest-100 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-forest-900 mb-4">You may also like</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {related.map((rp) => (
                  <button
                    key={rp.id}
                    onClick={() => onProductClick(rp)}
                    className="group relative overflow-hidden rounded-xl border border-forest-100 bg-white text-left transition-all hover:shadow-lg hover:border-forest-200"
>
                    <div className="relative aspect-square overflow-hidden bg-forest-50">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-forest-200" />
                      </div>
                      <img
                        src={rp.image_url}
                        alt={rp.name}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        className="relative h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs sm:text-sm font-semibold text-forest-900 leading-tight truncate">{rp.name}</p>
                      <p className="mt-1 text-xs font-bold text-forest-600">₹{rp.price.toFixed(2)}/{rp.unit}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function InfoBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-forest-50 border border-forest-100 px-3 py-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-100 text-forest-600 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[0.65rem] uppercase tracking-wide text-gray-400">{label}</p>
        <p className="text-xs font-semibold text-forest-800 truncate">{value}</p>
      </div>
    </div>
  );
}
