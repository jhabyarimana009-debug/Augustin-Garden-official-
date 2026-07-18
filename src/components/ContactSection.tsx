import React from 'react';
import { WebsiteSettings } from '../types.js';
import { Phone, Mail, Clock, MapPin, MessageSquare, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

interface ContactSectionProps {
  settings: WebsiteSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const { contact, social } = settings;

  const handleWhatsApp = () => {
    const phone = settings.profile.whatsapp.replace(/[^0-9+]/g, '');
    const msg = encodeURIComponent(`Hello Augustin Garden! I am visiting your website contact page and would like to reach out about a luxury flower order.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${settings.profile.phone.replace(/[^0-9+]/g, '')}`, '_self');
  };

  return (
    <section className="bg-stone-50 py-16 border-b border-stone-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Get in Touch
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-stone-900">
            Visit Our <span className="italic text-amber-600">Kibagabaga Art Studio</span>
          </h2>
          <p className="max-w-xl text-stone-500 text-sm font-light">
            We are nestled in the premium hills of Kigali. Browse arrangements, inspect hand-painted pots, and schedule residential landscape audits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6 bg-white border border-stone-200/50 p-8 rounded-3xl shadow-sm">
              <h3 className="font-serif text-2xl font-light text-stone-950">Direct Studio Contacts</h3>
              <p className="text-stone-500 text-xs font-light">
                No automatic checkout online; our florists customize each bloom directly to maintain perfection. Reach out via WhatsApp, Call, or Email.
              </p>

              <div className="space-y-5 pt-4 text-sm font-light text-stone-700">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 rounded-full bg-amber-50 p-2 text-amber-700 border border-amber-100">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[11px] uppercase tracking-wider text-stone-400">Address</h4>
                    <p className="mt-1 leading-relaxed">{contact.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="mt-1 rounded-full bg-amber-50 p-2 text-amber-700 border border-amber-100">
                    <Phone size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[11px] uppercase tracking-wider text-stone-400">Phone & WhatsApp</h4>
                    <p className="mt-1 leading-relaxed font-semibold text-stone-900">{contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="mt-1 rounded-full bg-amber-50 p-2 text-amber-700 border border-amber-100">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[11px] uppercase tracking-wider text-stone-400">Email Address</h4>
                    <p className="mt-1 leading-relaxed">{contact.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="mt-1 rounded-full bg-amber-50 p-2 text-amber-700 border border-amber-100">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[11px] uppercase tracking-wider text-stone-400">Working Hours</h4>
                    <p className="mt-1 leading-relaxed text-xs">{contact.businessHours}</p>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-stone-100">
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center space-x-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white uppercase tracking-wider transition-all"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleCall}
                  className="flex items-center justify-center space-x-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 py-3 text-xs font-bold text-white uppercase tracking-wider transition-all"
                >
                  <Phone size={14} className="text-amber-500" />
                  <span>Call Now</span>
                </button>
              </div>
            </div>

            {/* Social Links Box */}
            <div className="bg-white border border-stone-200/50 p-6 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <h4 className="font-serif text-sm font-semibold text-stone-900">Follow Our Creations</h4>
                <p className="text-[10px] text-stone-400">Watch our arrangements bloom on social feeds</p>
              </div>
              <div className="flex space-x-2">
                {social.instagram && (
                  <a href={social.instagram} target="_blank" rel="noreferrer" className="rounded-lg bg-stone-50 border border-stone-200 p-2.5 text-stone-600 hover:text-amber-600 hover:bg-amber-50">
                    <Instagram size={16} />
                  </a>
                )}
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noreferrer" className="rounded-lg bg-stone-50 border border-stone-200 p-2.5 text-stone-600 hover:text-amber-600 hover:bg-amber-50">
                    <Facebook size={16} />
                  </a>
                )}
                {social.youtube && (
                  <a href={social.youtube} target="_blank" rel="noreferrer" className="rounded-lg bg-stone-50 border border-stone-200 p-2.5 text-stone-600 hover:text-amber-600 hover:bg-amber-50">
                    <Youtube size={16} />
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} target="_blank" rel="noreferrer" className="rounded-lg bg-stone-50 border border-stone-200 p-2.5 text-stone-600 hover:text-amber-600 hover:bg-amber-50">
                    <Twitter size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Google Map Columns */}
          <div className="lg:col-span-7 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm min-h-[400px]">
            <iframe
              title="Augustin Garden Kigali Map Location"
              src={contact.googleMapEmbed}
              className="w-full h-full min-h-[380px] rounded-2xl border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
