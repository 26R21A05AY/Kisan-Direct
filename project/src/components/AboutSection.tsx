import { ImageIcon } from 'lucide-react';

const farmerImg = 'https://images.pexels.com/photos/32277759/pexels-photo-32277759.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop';
const handsImg = 'https://images.pexels.com/photos/38025875/pexels-photo-38025875.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop';
const basketImg = 'https://images.pexels.com/photos/17034795/pexels-photo-17034795.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop';

export function AboutSection() {
  return (
    <section id="about" className="bg-gradient-to-b from-ivory-100/50 to-ivory-50 py-16 sm:py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-100 border border-forest-200 px-3 py-1 text-sm font-medium text-forest-700">
            About Kisan Direct
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-forest-900 sm:text-4xl" style={{ fontFamily: '"Playfair Display", serif' }}>
            Connecting Farmers Directly to You
          </h2>
          <div className="mx-auto mt-4 h-px w-16 gold-gradient" />
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Kisan Direct cuts out the middlemen, bringing fresh produce straight from Indian farms to your family. Every purchase puts more earnings back into the hands that grow your food.
          </p>
        </div>

        {/* Image collage */}
        <div className="mt-12 grid gap-4 sm:gap-6 lg:grid-cols-3 lg:grid-rows-2">
          {/* Large farmer portrait */}
          <div className="group relative overflow-hidden rounded-3xl lg:row-span-2 bg-forest-100 min-h-[280px] sm:min-h-[320px] shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-10 w-10 text-forest-200" />
            </div>
            <img
              src={farmerImg}
              alt="Elderly Indian farmer smiling proudly while holding fresh crops in his field"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="relative h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-lg font-bold text-white" style={{ fontFamily: '"Playfair Display", serif' }}>Our Farmers</p>
              <p className="text-sm text-gold-200">The heart of everything we do</p>
            </div>
          </div>

          {/* Hands planting */}
          <div className="group relative overflow-hidden rounded-3xl bg-forest-100 min-h-[200px] sm:min-h-[220px] shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-forest-200" />
            </div>
            <img
              src={handsImg}
              alt="Close-up of a farmer's hands planting seeds in rich soil"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="relative h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
            <p className="absolute bottom-0 left-0 right-0 p-4 text-sm font-semibold text-white text-shadow-md">
              Every seed carries a dream. Every harvest brings hope.
            </p>
          </div>

          {/* Farmer with basket */}
          <div className="group relative overflow-hidden rounded-3xl bg-forest-100 min-h-[200px] sm:min-h-[220px] shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-forest-200" />
            </div>
            <img
              src={basketImg}
              alt="Farmer carrying a basket of freshly harvested produce through a green paddy field"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="relative h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
            <p className="absolute bottom-0 left-0 right-0 p-4 text-sm font-semibold text-white text-shadow-md">
              When farmers prosper, communities flourish.
            </p>
          </div>
        </div>

        {/* Mission cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <MissionCard
            number="50+"
            title="Partnered Farmers"
            description="Direct relationships with farmers across Maharashtra, Tamil Nadu, Karnataka, and more."
          />
          <MissionCard
            number="0"
            title="Middlemen Involved"
            description="From farm to your table — no wholesalers, no commissions, no markups."
          />
          <MissionCard
            number="100%"
            title="Fresh & Honest"
            description="Harvested at peak ripeness and delivered within 24-48 hours to your door."
          />
        </div>
      </div>
    </section>
  );
}

function MissionCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-forest-200">
      <p className="text-3xl font-bold forest-gradient bg-clip-text text-transparent" style={{ fontFamily: '"Playfair Display", serif' }}>{number}</p>
      <p className="mt-2 text-sm font-bold text-forest-900">{title}</p>
      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
