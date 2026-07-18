import React from 'react';
import { Service, WebsiteSettings } from '../types.js';
import { Check, Sparkles, MessageSquare, Phone } from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesSectionProps {
  services: Service[];
  settings: WebsiteSettings;
}

export default function ServicesSection({ services, settings }: ServicesSectionProps) {
  
  const handleWhatsApp = (service: Service) => {
    const phone = settings.profile.whatsapp.replace(/[^0-9+]/g, '');
    const msg = encodeURIComponent(`Hello Augustin Garden! I am reading about your premium service: "${service.name}" on your website. I would like to book a landscaping or decoration consultation in Kigali.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${settings.profile.phone.replace(/[^0-9+]/g, '')}`, '_self');
  };

  return (
    <section className="bg-stone-50 py-16 border-b border-stone-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Professional Botanical Services
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-stone-900">
            Luxury Landscape & <span className="italic text-amber-600">Floral Customization</span>
          </h2>
          <p className="max-w-xl text-stone-500 text-sm font-light leading-relaxed">
            From manicured residential setups to corporate botanical styling, our Kibagabaga-based artisans execute flawless aesthetics.
          </p>
        </div>

        {/* Services List Grid */}
        <div className="space-y-16">
          {services.map((service, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={service.id}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Images Collage */}
                <div className="w-full lg:w-1/2 space-y-4">
                  <div className="relative h-96 overflow-hidden rounded-3xl border border-stone-200/40 bg-stone-100 shadow-md">
                    <img 
                      src={service.images[0] || 'https://images.unsplash.com/photo-1558904541-efa8c1a68fc6?q=80&w=1000'} 
                      alt={service.name} 
                      className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-700" 
                    />
                    {service.isFeatured && (
                      <span className="absolute left-4 top-4 z-10 flex items-center space-x-1 rounded-full bg-stone-900 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-sm bg-stone-900/90 border border-white/10">
                        <Sparkles size={10} className="text-amber-500 animate-spin" />
                        <span>PREMIUM SERVICE</span>
                      </span>
                    )}
                  </div>

                  {/* Optional secondary gallery image */}
                  {service.images.length > 1 && (
                    <div className="grid grid-cols-2 gap-4">
                      {service.images.slice(1, 3).map((img, i) => (
                        <div key={i} className="h-44 overflow-hidden rounded-2xl border border-stone-200/40 shadow-sm">
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Box */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/40">
                    Artisanal Division
                  </span>

                  <h3 className="font-serif text-3xl font-light text-stone-950 leading-snug">
                    {service.name}
                  </h3>

                  <p className="text-stone-500 text-sm font-light leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-stone-700">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                        <Check size={12} />
                      </div>
                      <span>Kibagabaga Art Studio</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                        <Check size={12} />
                      </div>
                      <span>Custom Architectural Vases</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                        <Check size={12} />
                      </div>
                      <span>100% Quality Fresh Bloom Guaranteed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                        <Check size={12} />
                      </div>
                      <span>Landscape Blueprints Supplied</span>
                    </div>
                  </div>

                  {/* Booking CTAs */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-stone-200/60">
                    <button
                      onClick={() => handleWhatsApp(service)}
                      className="flex items-center space-x-2 rounded-full bg-emerald-600 hover:bg-emerald-500 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white transition-all shadow-md shadow-emerald-600/10"
                    >
                      <MessageSquare size={14} />
                      <span>Inquire on WhatsApp</span>
                    </button>

                    <button
                      onClick={handleCall}
                      className="flex items-center space-x-2 rounded-full border border-stone-300 bg-white hover:bg-stone-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-stone-700 transition-all"
                    >
                      <Phone size={14} className="text-amber-600" />
                      <span>Call Designer</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
