import React from 'react';
import { WebsiteSettings, Category, Service } from '../types.js';
import { ShieldCheck, ArrowUpRight, Facebook, Instagram, Youtube, Twitter, Heart } from 'lucide-react';

interface FooterProps {
  settings: WebsiteSettings;
  categories: Category[];
  services: Service[];
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export default function Footer({
  settings,
  categories,
  services,
  currentTab,
  setCurrentTab,
  onOpenPrivacy,
  onOpenTerms
}: FooterProps) {
  const { profile, social } = settings;

  const handleNavClick = (val: string) => {
    setCurrentTab(val);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    const phone = profile.whatsapp.replace(/[^0-9+]/g, '');
    const msg = encodeURIComponent(`Hello Augustin Garden! I am reading your footer links and want to start a discussion.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Intro Column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center space-x-3" id="footer-logo-container">
              <img 
                id="footer-logo-img"
                src="/logo.jpg" 
                alt="Augustin Garden Logo" 
                className="h-10 w-10 rounded-full object-cover border border-amber-500/20 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <span className="font-serif text-2xl font-semibold tracking-wide text-white">
                Augustin <span className="font-light text-amber-500 italic">Garden</span>
              </span>
            </div>
            <p className="text-stone-400 text-xs font-light leading-relaxed">
              Rwanda’s premier designer of luxury botanical layouts, hand-painted ceramic vases, and elite residential landscapes in Kibagabaga, Kigali.
            </p>
            <div className="flex space-x-3 pt-2">
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer" className="rounded-full bg-stone-900 border border-stone-800 p-2 hover:bg-stone-800 hover:text-amber-500 text-stone-400 transition-colors">
                  <Instagram size={14} />
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noreferrer" className="rounded-full bg-stone-900 border border-stone-800 p-2 hover:bg-stone-800 hover:text-amber-500 text-stone-400 transition-colors">
                  <Facebook size={14} />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noreferrer" className="rounded-full bg-stone-900 border border-stone-800 p-2 hover:bg-stone-800 hover:text-amber-500 text-stone-400 transition-colors">
                  <Youtube size={14} />
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noreferrer" className="rounded-full bg-stone-900 border border-stone-800 p-2 hover:bg-stone-800 hover:text-amber-500 text-stone-400 transition-colors">
                  <Twitter size={14} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white border-l-2 border-amber-500 pl-2">
              Site Navigation
            </h4>
            <ul className="space-y-2 text-xs font-light text-stone-400">
              <li>
                <button onClick={() => handleNavClick('home')} className="hover:text-amber-500 transition-colors">Home Page</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('flowers')} className="hover:text-amber-500 transition-colors">Flower Catalog</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('vases')} className="hover:text-amber-500 transition-colors">Vases Selection</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-amber-500 transition-colors">Bespoke Services</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('about')} className="hover:text-amber-500 transition-colors">Our History</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('contact')} className="hover:text-amber-500 transition-colors">Find Studio</button>
              </li>
            </ul>
          </div>

          {/* Flora Categories Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white border-l-2 border-amber-500 pl-2">
              Our Varieties
            </h4>
            <ul className="space-y-2 text-xs font-light text-stone-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button 
                    onClick={() => {
                      setCurrentTab('flowers');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }} 
                    className="hover:text-amber-500 transition-colors"
                  >
                    Premium {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Support Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white border-l-2 border-amber-500 pl-2">
              Augustin Studio
            </h4>
            <p className="text-stone-400 text-xs font-light leading-relaxed">
              {profile.address}
            </p>
            <div className="space-y-1 text-xs font-light text-stone-400 pt-1">
              <p>Phone: <span className="text-white font-medium">{profile.phone}</span></p>
              <p>Email: <span className="text-white font-medium">{profile.email}</span></p>
            </div>
            <button
              onClick={handleWhatsApp}
              className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400 group"
            >
              <span>Instant WhatsApp Chat</span>
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>

        {/* Lower copyright bar */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between text-stone-500 text-xs font-light gap-4">
          <p>© {new Date().getFullYear()} Augustin Garden Ltd. All Rights Reserved. Kibagabaga, Kigali, Rwanda.</p>
          <div className="flex space-x-4">
            <button onClick={onOpenPrivacy} className="hover:text-stone-300 transition-colors">Privacy Policy</button>
            <span>|</span>
            <button onClick={onOpenTerms} className="hover:text-stone-300 transition-colors">Terms & Conditions</button>
            <span>|</span>
            <button onClick={() => handleNavClick('admin')} className="flex items-center space-x-1 hover:text-stone-300 transition-colors">
              <ShieldCheck size={12} />
              <span>Admin Access</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
