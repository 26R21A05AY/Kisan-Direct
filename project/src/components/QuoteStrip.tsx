import { ImageIcon } from 'lucide-react';

const bgUrl = 'https://images.pexels.com/photos/12621194/pexels-photo-12621194.jpeg?auto=compress&cs=tinysrgb&w=1600&h=600&fit=crop';

export function QuoteStrip() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-forest-950">
        <div className="flex h-full w-full items-center justify-center">
          <ImageIcon className="h-10 w-10 text-forest-800" />
        </div>
        <img
          src={bgUrl}
          alt="Lush green fields glowing under a golden sunrise"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-forest-950/85 via-forest-900/75 to-forest-950/85" />

      {/* Gold accent lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-32 gold-gradient" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-32 gold-gradient" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center">
        <blockquote className="text-2xl font-bold leading-snug text-white sm:text-3xl sm:leading-snug lg:text-4xl text-shadow-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
          "Empowering farmers today. Growing a better tomorrow."
        </blockquote>
        <div className="mx-auto mt-6 h-px w-16 gold-gradient" />
        <p className="mt-4 text-sm text-gold-200 sm:text-base font-medium tracking-wide">
          Kisan Direct — CIE College Project
        </p>
      </div>
    </section>
  );
}
