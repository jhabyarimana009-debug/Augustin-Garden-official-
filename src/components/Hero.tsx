import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Phone, ArrowUpRight } from 'lucide-react';
import { HomepageSlide, WebsiteSettings } from '../types.js';

interface HeroProps {
  slides: HomepageSlide[];
  settings: WebsiteSettings;
  onBrowseFlowers: () => void;
  onContactClick: () => void;
}

export default function Hero({ slides, settings, onBrowseFlowers, onContactClick }: HeroProps) {
  const [current, setCurrent] = useState(0);

  const fallbackSlides: HomepageSlide[] = [
    {
      id: "fs1",
      title: "Luxury Flowers & Curated Vases",
      subtitle: "Augustin Garden – Breathtaking floral artistry delivered directly across Kigali and Rwanda.",
      image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?q=80&w=1600",
      link: "/flowers",
      order: 1
    }
  ];

  const activeSlides = slides.length > 0 ? slides : fallbackSlides;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  };

  const handleWhatsApp = () => {
    const phone = settings.profile.whatsapp.replace(/[^0-9+]/g, '');
    const msg = encodeURIComponent(`Hello Augustin Garden, I am visiting your website and would like to talk about custom floral setups or arrangements.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-stone-900">
      {/* Slider Images */}
      <div className="absolute inset-0 h-full w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full"
          >
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-900/50 to-transparent z-10" />
            <img
              src={activeSlides[current].image}
              alt={activeSlides[current].title}
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-6"
              >
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-500 bg-amber-900/40 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30">
                  Luxury Botanical Designer
                </span>
                
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-wide leading-tight">
                  {activeSlides[current].title.split(" & ").map((part, i) => (
                    <span key={i} className="block">
                      {part}
                      {i === 0 && activeSlides[current].title.includes(" & ") && <span className="text-amber-500 italic font-normal"> & </span>}
                    </span>
                  ))}
                </h1>

                <p className="font-light text-stone-200 text-sm sm:text-base md:text-lg tracking-wide leading-relaxed">
                  {activeSlides[current].subtitle}
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={onBrowseFlowers}
                    className="flex items-center space-x-2 rounded-full bg-amber-600 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-amber-900/20 transition-all hover:bg-amber-500 hover:-translate-y-0.5"
                  >
                    <span>Browse Flowers</span>
                    <ArrowUpRight size={14} />
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center space-x-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-stone-950 hover:-translate-y-0.5"
                  >
                    <span>WhatsApp Us</span>
                  </button>

                  <a
                    href={`tel:${settings.profile.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center space-x-2 rounded-full border border-stone-800 bg-stone-950 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-300 transition-all hover:bg-stone-900 hover:-translate-y-0.5"
                  >
                    <Phone size={14} className="text-amber-500" />
                    <span>Call Shop</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide Navigation Buttons */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-white/10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-white/10"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 space-x-2">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  current === idx ? 'w-6 bg-amber-500' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
