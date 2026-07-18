import React, { useState } from 'react';
import { Product, WebsiteSettings } from '../types.js';
import { X, Phone, MessageSquare, MapPin, Share2, Facebook, Instagram, Calendar, Copy, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductModalProps {
  product: Product | null;
  allProducts: Product[];
  settings: WebsiteSettings;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export default function ProductModal({ product, allProducts, settings, onClose, onSelectProduct }: ProductModalProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  if (!product) return null;

  // Combine main image and gallery images
  const images = [product.mainImage, ...(product.galleryImages || [])].filter(Boolean);

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id && p.status === 'active')
    .slice(0, 3);

  const handleWhatsApp = () => {
    const phone = settings.profile.whatsapp.replace(/[^0-9+]/g, '');
    const priceStr = product.price ? ` (Price: RWF ${product.price.toLocaleString()})` : '';
    const msg = encodeURIComponent(`Hello ${settings.profile.ownerName}! I am viewing your beautiful product "${product.name}"${priceStr} on your website. Is this arrangement currently available for delivery?`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${settings.profile.phone.replace(/[^0-9+]/g, '')}`, '_self');
  };

  const handleShare = (platform: 'fb' | 'wa' | 'copy') => {
    const shareUrl = `${window.location.origin}?product=${product.id}`;
    if (platform === 'wa') {
      const msg = encodeURIComponent(`Check out this breathtaking luxury floral design: "${product.name}" from Augustin Garden Kigali! ${shareUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
    } else if (platform === 'fb') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard! Share it with your friends.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4">
        {/* Modal card wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-stone-200"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-40 rounded-full bg-white/90 border border-stone-200/60 p-2 text-stone-700 hover:text-stone-950 shadow-md transition-colors"
          >
            <X size={18} />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
            
            {/* Gallery Section - Left Side */}
            <div className="lg:col-span-6 bg-stone-50 p-6 flex flex-col justify-between border-r border-stone-100">
              
              {/* Main Image Slider */}
              <div className="relative h-[40vh] sm:h-[45vh] lg:h-[50vh] w-full overflow-hidden rounded-2xl bg-white border border-stone-200/50">
                <img
                  src={images[activeImgIdx]}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-all duration-500"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImgIdx(prev => (prev - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-stone-700 hover:bg-white shadow"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setActiveImgIdx(prev => (prev + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-stone-700 hover:bg-white shadow"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2.5 mt-4 justify-center overflow-x-auto py-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIdx(idx)}
                      className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 bg-white transition-all ${
                        activeImgIdx === idx ? 'border-amber-600 scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover object-center" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Metadata & Info - Right Side */}
            <div className="lg:col-span-6 p-8 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Category & Status */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/30">
                    {product.category}
                  </span>
                  {product.price && (
                    <span className="font-serif text-xl font-medium tracking-wide text-stone-900 bg-stone-50 border border-stone-200/50 px-3.5 py-1 rounded-full">
                      RWF {product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-light text-stone-950 leading-snug">
                  {product.name}
                </h2>

                <p className="text-stone-500 font-light text-sm leading-relaxed whitespace-pre-line border-b border-stone-100 pb-5">
                  {product.fullDescription}
                </p>

                {/* Owner Profile Container */}
                <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200/40 space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={settings.profile.ownerPhoto}
                      alt={settings.profile.ownerName}
                      className="h-12 w-12 rounded-full object-cover object-center border-2 border-amber-600"
                    />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                        Floral Designer
                      </h4>
                      <p className="font-serif text-base font-semibold text-stone-800">
                        {settings.profile.ownerName}
                      </p>
                    </div>
                  </div>
                  <p className="text-stone-500 text-xs font-light italic leading-relaxed">
                    "Every layout we build incorporates peak seasonal blooms and artisanal vessels. Get in touch directly to configure delivery or customization in Kibagabaga."
                  </p>
                </div>

                {/* Location & Details */}
                <div className="space-y-2 pt-2 text-xs text-stone-600 font-light">
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} className="text-amber-600 shrink-0" />
                    <span>{settings.profile.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} className="text-amber-600 shrink-0" />
                    <span>Uploaded on {new Date(product.dateUploaded).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="space-y-4 pt-4 border-t border-stone-100">
                {/* Contact CTAs */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-600/10 transition-all"
                  >
                    <MessageSquare size={16} />
                    <span>WhatsApp Order</span>
                  </button>

                  <button
                    onClick={handleCall}
                    className="flex items-center justify-center space-x-2 rounded-xl bg-stone-900 hover:bg-stone-800 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-stone-900/10 transition-all"
                  >
                    <Phone size={16} className="text-amber-500" />
                    <span>Call Studio</span>
                  </button>
                </div>

                {/* Share Options */}
                <div className="flex items-center space-x-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Share:</span>
                  <button
                    onClick={() => handleShare('wa')}
                    className="flex items-center space-x-1.5 rounded-full border border-stone-200 hover:border-stone-400 px-3 py-1.5 text-xs font-medium text-stone-600"
                  >
                    <MessageSquare size={12} className="text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShare('fb')}
                    className="flex items-center space-x-1.5 rounded-full border border-stone-200 hover:border-stone-400 px-3 py-1.5 text-xs font-medium text-stone-600"
                  >
                    <Facebook size={12} className="text-blue-600" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center space-x-1.5 rounded-full border border-stone-200 hover:border-stone-400 px-3 py-1.5 text-xs font-medium text-stone-600"
                  >
                    <Copy size={12} />
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Related / Recommended products footer */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-stone-100 bg-stone-50 p-8">
              <h3 className="font-serif text-lg font-light text-stone-900 mb-4">
                Similar <span className="italic text-amber-600">Botanical Configurations</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectProduct(rel);
                      setActiveImgIdx(0);
                    }}
                    className="flex items-center space-x-3 bg-white border border-stone-200/50 p-2 rounded-xl cursor-pointer hover:border-amber-300 transition-all"
                  >
                    <img src={rel.mainImage} alt={rel.name} className="h-14 w-14 rounded-lg object-cover" />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">{rel.name}</h4>
                      <p className="text-[10px] text-stone-500">{rel.category}</p>
                      {rel.price && (
                        <p className="text-xs font-medium text-stone-800 mt-0.5">RWF {rel.price.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
