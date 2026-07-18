import React from 'react';
import { WebsiteSettings } from '../types.js';
import { Award, Compass, Star, Heart, Sparkles, MapPin } from 'lucide-react';

interface AboutUsProps {
  settings: WebsiteSettings;
}

export default function AboutUs({ settings }: AboutUsProps) {
  const { about } = settings;

  const cards = [
    {
      icon: <Award size={24} className="text-amber-600" />,
      title: "Exquisite Artistry",
      desc: "Our design setups combine premium fresh botanicals with hand-painted ceramic vessels, crafting unique aesthetic masterpieces."
    },
    {
      icon: <Compass size={24} className="text-amber-600" />,
      title: "Landscaping Vision",
      desc: "With 12+ years of design experience in Kigali, we reconstruct natural environments into structural residential sanctuaries."
    },
    {
      icon: <Star size={24} className="text-amber-600" />,
      title: "Client Trust",
      desc: "We operate on bespoke personal relationships, delivering fully realized designs exactly suited to luxury office briefs."
    }
  ];

  return (
    <section className="bg-stone-50 py-16 border-b border-stone-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
              The Legacy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-stone-900 leading-snug">
              Bespoke Botanical Craft <br />
              <span className="italic font-light text-amber-600">In Kibagabaga, Kigali</span>
            </h2>
            <p className="text-stone-600 text-sm font-light leading-relaxed whitespace-pre-line">
              {about.story}
            </p>
            <p className="text-stone-500 text-xs italic leading-relaxed bg-white border border-stone-200/50 p-4 rounded-xl">
              "We believe floral curation is not merely assembly; it is architectural storytelling. Every rose variety is calibrated for stem strength, and each ceramic vessel is painted by hand."
            </p>
          </div>

          <div className="relative h-96 lg:h-[450px] overflow-hidden rounded-3xl border-4 border-white shadow-xl bg-stone-100">
            <img 
              src="https://images.unsplash.com/photo-1513559688682-a939e72ef002?q=80&w=1000" 
              alt="Augustin Garden Studio" 
              className="h-full w-full object-cover" 
            />
            {/* Small overlay tag */}
            <div className="absolute bottom-6 left-6 bg-stone-950/90 text-white backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 space-y-1">
              <p className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Business Location</p>
              <div className="flex items-center space-x-1">
                <MapPin size={12} className="text-amber-500" />
                <span className="text-xs font-semibold">KG 375 St, Kibagabaga</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-3xl border border-stone-200/50 bg-stone-100 p-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Our Mission</span>
            <h3 className="font-serif text-2xl font-light text-stone-900">Elevating Everyday Spaces</h3>
            <p className="text-stone-600 text-sm font-light leading-relaxed">
              {about.mission}
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200/50 bg-stone-100 p-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Our Vision</span>
            <h3 className="font-serif text-2xl font-light text-stone-900">Hallmark of East African Luxury</h3>
            <p className="text-stone-600 text-sm font-light leading-relaxed">
              {about.vision}
            </p>
          </div>
        </div>

        {/* Three core pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {cards.map((card, i) => (
            <div key={i} className="bg-white border border-stone-200/40 p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-amber-50 rounded-xl w-fit">
                {card.icon}
              </div>
              <h4 className="font-serif text-lg font-medium text-stone-900">{card.title}</h4>
              <p className="text-stone-500 text-xs font-light leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Quality Promise & Values */}
        <div className="rounded-3xl border border-stone-200/60 bg-white p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center space-x-2 text-amber-600">
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Quality Guarantee</span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-light text-stone-950">Augustin’s Guarantee of Perfection</h3>
              <p className="text-stone-500 text-sm font-light leading-relaxed">
                {about.promise}
              </p>
            </div>

            <div className="lg:col-span-5 bg-stone-50 rounded-2xl p-6 border border-stone-200/50">
              <h4 className="font-bold text-xs uppercase tracking-widest text-stone-700 mb-4">Our Core Design Principles</h4>
              <ul className="space-y-3">
                {about.values.map((val, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-stone-700 text-sm font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                    <span>{val}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
