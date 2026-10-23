import { Star, Plus, Minus, MapPin, Leaf, ImageIcon } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { addToCart, items, updateQuantity } = useCart();
  const inCartQty = items.find((item) => item.id === product.id)?.quantity ?? 0;

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-forest-100 premium-card transition-all duration-300 hover:premium-card-hover hover:border-forest-300 hover:-translate-y-1 cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-forest-50">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-forest-200" />
        </div>
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="relative h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {product.is_organic && (
            <span className="inline-flex items-center gap-1 rounded-full bg-forest-600 px-2.5 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-sm">
              <Leaf className="h-3 w-3" />
              Organic
            </span>
          )}
          {!product.in_stock && (
            <span className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-1 text-xs font-semibold text-white shadow-md">
              Out of Stock
            </span>
          )}
        </div>
        {/* Rating */}
        <div className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-gold-600 shadow-md">
          <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
          {product.rating.toFixed(1)}
        </div>

        {/* Quick view hint on hover (desktop) */}
        <div className="absolute inset-x-0 bottom-0 bg-forest-900/70 backdrop-blur-sm py-2 text-center translate-y-full transition-transform duration-300 group-hover:translate-y-0 hidden sm:block">
          <span className="text-xs font-medium text-ivory-100">Click to view details</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="font-semibold text-forest-900 leading-snug text-sm sm:text-base">{product.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 overflow-hidden">
          <MapPin className="h-3 w-3 text-forest-400 shrink-0" />
          <span className="truncate">{product.farmer_name} • {product.farmer_location}</span>
        </p>
        <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 hidden sm:block">{product.description}</p>

        <div className="mt-auto pt-3 sm:pt-4">
          <div className="flex items-end justify-between gap-1">
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-forest-700 whitespace-nowrap">
                ₹{product.price.toFixed(2)}
                <span className="text-xs sm:text-sm font-normal text-gray-400">/{product.unit}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                            disabled={!product.in_stock || product.stock_quantity <= 0}
                className="inline-flex items-center gap-0.5 rounded-xl bg-forest-600 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-forest-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-forest-600"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Add
              </button>
              {inCartQty > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald2-50 border border-emerald2-200 px-1.5 py-1 text-xs font-bold text-emerald2-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.id, inCartQty - 1);
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded-md text-emerald2-700 hover:bg-emerald2-100 transition-colors"
                    aria-label="Remove one from cart"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  +{inCartQty}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded-md text-emerald2-700 hover:bg-emerald2-100 transition-colors"
                    aria-label="Add one to cart"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
