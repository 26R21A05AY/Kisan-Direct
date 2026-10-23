import { Leaf, Truck, Shield, Heart, ImageIcon } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
}

const heroImg = 'https://images.pexels.com/photos/2382904/pexels-photo-2382904.jpeg?auto=compress&cs=tinysrgb&w=940&h=700&fit=crop';

export function Hero({ onShopNow }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-50 via-ivory-50 to-emerald2-50">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232d6243' fill-rule='evenodd'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30C13.431 60 0 46.569 0 30 0 13.431 13.431 0 30 0z'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      {/* Decorative gold glow */}
      <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-gold-200/20 blur-3xl" />
      <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-emerald2-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="text-center lg:text-left animate-slideUp">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-100 border border-forest-200 px-3 py-1 text-sm font-medium text-forest-700">
              <Leaf className="h-4 w-4" />
              100% Fresh from local farms
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-forest-900 sm:text-5xl sm:leading-tight lg:text-6xl" style={{ fontFamily: '"Playfair Display", serif' }}>
              Farm-fresh produce{' '}
              <span className="bg-gradient-to-r from-forest-600 to-emerald2-600 bg-clip-text text-transparent">
                delivered to your door
              </span>
            </h1>
            <p className="mt-5 text-base text-gray-600 sm:text-lg lg:text-xl leading-relaxed">
              Buy vegetables and fruits directly from Indian farmers. No middlemen, no chemicals — just honest, fresh, and affordable produce.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <button
                onClick={onShopNow}
                className="w-full rounded-full forest-gradient px-8 py-3.5 text-base font-semibold text-ivory-100 shadow-lg shadow-forest-600/25 transition-all hover:shadow-xl hover:shadow-forest-600/30 hover:-translate-y-0.5 active:scale-95 sm:w-auto"
              >
                Shop Fresh Now
              </button>
              <span className="text-sm text-gold-700 font-medium">Free delivery on orders above ₹500</span>
            </div>

            <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 sm:gap-4">
              <Feature icon={<Truck className="h-5 w-5" />} label="Fast Delivery" sublabel="24-48 hrs" />
              <Feature icon={<Shield className="h-5 w-5" />} label="Quality Assured" sublabel="Farm verified" />
              <Feature icon={<Heart className="h-5 w-5" />} label="Support Farmers" sublabel="Fair trade" />
            </div>
          </div>

          {/* Hero image */}
          <div className="relative hidden lg:block animate-slideInRight">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-forest-200 to-emerald2-100 blur-2xl opacity-60" />
            <div className="relative rounded-[2rem] shadow-2xl w-full aspect-[4/3] overflow-hidden bg-forest-50 border-4 border-white">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-forest-200" />
              </div>
              <img
                src={heroImg}
                alt="Indian women harvesting crops in lush green fields"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="relative h-full w-full object-cover"
                loading="eager"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-sm p-4 shadow-xl border border-forest-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl forest-gradient">
                <Leaf className="h-6 w-6 text-ivory-100" />
              </div>
              <div>
                <p className="text-sm font-bold text-forest-900">50+ Farmers</p>
                <p className="text-xs text-gold-600">Directly partnered with us</p>
              </div>
            </div>
            {/* Gold rating badge */}
            <div className="absolute -top-3 -right-3 flex h-16 w-16 items-center justify-center rounded-full gold-gradient shadow-lg">
              <div className="text-center">
                <p className="text-xs font-bold text-forest-900 leading-none">4.8</p>
                <p className="text-[0.6rem] text-forest-800 leading-none mt-0.5">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, label, sublabel }: { icon: React.ReactNode; label: string; sublabel: string }) {
  return (
    <div className="text-center lg:text-left">
      <div className="mb-1 flex items-center gap-2 justify-center lg:justify-start text-forest-600">
        {icon}
      </div>
      <p className="text-xs sm:text-sm font-semibold text-forest-900 leading-tight">{label}</p>
      <p className="text-[0.65rem] sm:text-xs text-gray-500">{sublabel}</p>
    </div>
  );
}
