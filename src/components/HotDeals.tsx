import React from 'react';
import { Product, WebsiteSettings } from '../types.js';
import { Flame, ArrowRight, Sparkles, MessageSquare, Phone } from 'lucide-react';
import { motion } from 'motion/react';

interface HotDealsProps {
  products: Product[];
  settings: WebsiteSettings;
  onSelectProduct: (p: Product) => void;
}

export default function HotDeals({ products, settings, onSelectProduct }: HotDealsProps) {
  const hotDeals = products.filter(p => p.isHotDeal && p.status === 'active');

  if (hotDeals.length === 0) return null;

  const handleWhatsApp = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = settings.profile.whatsapp.replace(/[^0-9+]/g, '');
    const priceStr = product.price ? ` (Price: RWF ${product.price.toLocaleString()})` : '';
    const msg = encodeURIComponent(`Hello Augustin Garden! I am interested in your Hot Deal: "${product.name}"${priceStr}. Is it currently available for delivery in Kigali?`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <section className="bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50/20 py-16 border-b border-stone-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-600">
              <Flame size={18} className="animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest">Limited Hot Arrangements</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-stone-900">
              Augustin’s <span className="italic font-light text-amber-600">Featured Hot Deals</span>
            </h2>
            <p className="max-w-xl text-stone-500 text-sm font-light">
              Exquisite premium blooms and hand-painted vases at special promotional valuations. Handcrafted daily.
            </p>
          </div>
        </div>

        {/* Horizontal Scroll / Flex Grid for Hot Deals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotDeals.map((product) => (
            <motion.div
              whileHover={{ y: -6 }}
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-stone-200/60 p-4 transition-all duration-300 shadow-sm hover:shadow-xl hover:border-amber-200/80"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden rounded-xl bg-stone-100">
                <span className="absolute left-3 top-3 z-10 flex items-center space-x-1 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  <Sparkles size={10} />
                  <span>HOT DEAL</span>
                </span>
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Card Details */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                    {product.category}
                  </span>
                  {product.price && (
                    <span className="text-sm font-semibold tracking-wide text-stone-900">
                      RWF {product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-light text-stone-950 group-hover:text-amber-700 transition-colors">
                  {product.name}
                </h3>

                <p className="line-clamp-2 text-stone-500 text-xs font-light leading-relaxed">
                  {product.shortDescription}
                </p>

                {/* WhatsApp & Details CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-4">
                  <span className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-700 group-hover:underline">
                    <span>View Showcase</span>
                    <ArrowRight size={12} />
                  </span>

                  <button
                    onClick={(e) => handleWhatsApp(product, e)}
                    className="flex items-center space-x-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-[11px] font-semibold text-white tracking-wide uppercase transition-all"
                  >
                    <MessageSquare size={12} />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
