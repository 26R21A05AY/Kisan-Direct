import { ImageIcon } from 'lucide-react';

export function FarmBanner() {
  const bgUrl = 'https://images.pexels.com/photos/11070641/pexels-photo-11070641.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop';

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-forest-950">
        <div className="flex h-full w-full items-center justify-center">
          <ImageIcon className="h-12 w-12 text-forest-800" />
        </div>
        <img
          src={bgUrl}
          alt="Indian women harvesting crops in a green paddy field under the sun"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Layered overlays for premium depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950/85 via-forest-900/60 to-forest-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />

      {/* Gold accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-24 gold-gradient rounded-b-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/20 backdrop-blur-sm border border-gold-400/40 px-4 py-1.5 text-sm font-medium text-gold-200">
            Our Promise
          </span>
          <h2 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl sm:leading-tight lg:text-5xl text-shadow-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
            From Our Farms to Your Family.
          </h2>
          <div className="mt-4 h-px w-20 gold-gradient" />
          <p className="mt-5 text-base text-ivory-100/80 sm:text-lg lg:text-xl leading-relaxed">
            Behind every meal is a farmer's hard work, hope, and sacrifice. We honor that journey by bringing their harvest directly to your doorstep.
          </p>
        </div>
      </div>
    </section>
  );
}
