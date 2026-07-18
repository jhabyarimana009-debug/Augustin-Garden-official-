import React, { useState } from 'react';
import { Menu, X, Phone, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WebsiteSettings } from '../types.js';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  settings: WebsiteSettings;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, settings, isAdminLoggedIn, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Home', value: 'home' },
    { label: 'Flowers', value: 'flowers' },
    { label: 'Flower Vases', value: 'vases' },
    { label: 'Services', value: 'services' },
    { label: 'About Us', value: 'about' },
    { label: 'Contact', value: 'contact' },
  ];

  const handleNavClick = (val: string) => {
    setCurrentTab(val);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppChat = () => {
    const formattedPhone = settings.profile.whatsapp.replace(/[^0-9+]/g, '');
    const message = encodeURIComponent(`Hello Augustin Garden! I am browsing your beautiful premium catalog and would like to ask some questions.`);
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-200/50 bg-stone-50/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex cursor-pointer items-center space-x-3"
            id="nav-logo-container"
          >
            <img 
              id="navbar-logo-img"
              src="/logo.jpg" 
              alt="Augustin Garden Logo" 
              className="h-10 w-10 rounded-full object-cover border border-amber-500/20 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="font-serif text-2xl font-semibold tracking-wide text-stone-900">
              Augustin <span className="font-light text-amber-600 italic">Garden</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`relative py-2 text-sm font-medium tracking-wide transition-colors duration-200 ${
                  currentTab === item.value 
                    ? 'text-amber-600 font-semibold' 
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                {item.label}
                {currentTab === item.value && (
                  <motion.div 
                    layoutId="navbar-indicator" 
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-amber-600" 
                  />
                )}
              </button>
            ))}

            {isAdminLoggedIn ? (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center space-x-1 py-1 px-3 rounded-full text-xs font-semibold ${
                  currentTab === 'admin' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-stone-200/50 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <ShieldCheck size={14} />
                <span>Admin</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('admin')}
                className="text-stone-400 hover:text-stone-700 transition-colors"
                title="Admin Portal"
              >
                <ShieldCheck size={18} />
              </button>
            )}
          </div>

          {/* Call / WhatsApp Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleWhatsAppChat}
              className="flex items-center space-x-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:bg-emerald-500 hover:shadow-emerald-200 hover:-translate-y-0.5"
            >
              <span>WhatsApp Chat</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            {isAdminLoggedIn && (
              <button
                onClick={() => handleNavClick('admin')}
                className="p-1.5 rounded-full bg-amber-100 text-amber-800"
              >
                <ShieldCheck size={18} />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-stone-200/60 bg-stone-50"
          >
            <div className="space-y-1 px-4 py-4 pb-6">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleNavClick(item.value)}
                  className={`block w-full rounded-lg px-4 py-3 text-left text-base font-medium transition-colors ${
                    currentTab === item.value
                      ? 'bg-amber-50 text-amber-700 font-semibold'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => handleNavClick('admin')}
                className={`block w-full rounded-lg px-4 py-3 text-left text-base font-medium transition-colors ${
                  currentTab === 'admin'
                    ? 'bg-amber-100 text-amber-800 font-semibold'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                Admin Panel {isAdminLoggedIn ? '(Logged In)' : ''}
              </button>

              <div className="mt-4 pt-4 border-t border-stone-200 flex flex-col space-y-2">
                <button
                  onClick={handleWhatsAppChat}
                  className="flex w-full items-center justify-center space-x-2 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                >
                  <span>WhatsApp Chat</span>
                </button>
                <a
                  href={`tel:${settings.profile.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex w-full items-center justify-center space-x-2 rounded-full bg-stone-900 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stone-800"
                >
                  <Phone size={16} />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
