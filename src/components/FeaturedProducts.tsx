import React, { useState, useMemo } from 'react';
import { Product, Category, WebsiteSettings } from '../types.js';
import { Search, SlidersHorizontal, Sparkles, AlertCircle, Share2, Phone, MessageSquare, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FeaturedProductsProps {
  products: Product[];
  categories: Category[];
  settings: WebsiteSettings;
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  onSelectProduct: (p: Product) => void;
}

export default function FeaturedProducts({
  products,
  categories,
  settings,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
}: FeaturedProductsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'featured' | 'recommended' | 'newest'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(200000);

  const activeProducts = useMemo(() => {
    return products.filter(p => p.status === 'active');
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) => {
      // Search text match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        product.name.toLowerCase().includes(query) ||
        product.shortDescription.toLowerCase().includes(query) ||
        product.fullDescription.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      // Category match
      const matchesCategory = selectedCategory === null || product.category === selectedCategory;

      // Price match (optional cap)
      const matchesPrice = !product.price || product.price <= priceRange;

      // Attribute match
      let matchesAttribute = true;
      if (filterMode === 'featured') matchesAttribute = product.isFeatured;
      else if (filterMode === 'recommended') matchesAttribute = product.isRecommended;

      return matchesSearch && matchesCategory && matchesPrice && matchesAttribute;
    }).sort((a, b) => {
      if (filterMode === 'newest') {
        return new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime();
      }
      return 0; // Default ordering
    });
  }, [activeProducts, searchQuery, selectedCategory, priceRange, filterMode]);

  const handleWhatsApp = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = settings.profile.whatsapp.replace(/[^0-9+]/g, '');
    const priceStr = product.price ? ` (Price: RWF ${product.price.toLocaleString()})` : '';
    const msg = encodeURIComponent(`Hello Augustin Garden! I saw your product "${product.name}"${priceStr} on your website and would like to order it.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleShare = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = window.location.origin + '?product=' + product.id;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard! Share it with friends and family.');
    }
  };

  return (
    <section className="bg-stone-50 py-16" id="products-catalog">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search premium roses, orchids, ceramic vases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-stone-200 bg-white pl-10 pr-4 py-3 text-sm text-stone-800 placeholder-stone-400 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-all ${
                filterMode === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-200/60 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterMode('featured')}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-all ${
                filterMode === 'featured'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-200/60 text-stone-600 hover:bg-stone-200'
              }`}
            >
              ⭐ Featured
            </button>
            <button
              onClick={() => setFilterMode('recommended')}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-all ${
                filterMode === 'recommended'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-200/60 text-stone-600 hover:bg-stone-200'
              }`}
            >
              👑 Staff Choice
            </button>
            <button
              onClick={() => setFilterMode('newest')}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-all ${
                filterMode === 'newest'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-200/60 text-stone-600 hover:bg-stone-200'
              }`}
            >
              🆕 Newest
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-1.5 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
                showFilters 
                  ? 'border-amber-600 text-amber-600 bg-amber-50' 
                  : 'border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Refine</span>
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-inner"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Max Valuation: RWF {priceRange.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="250000"
                    step="5000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-semibold mt-1">
                    <span>RWF 10,000</span>
                    <span>RWF 250,000+</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Quick Filter By Collection
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => onSelectCategory(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        selectedCategory === null 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      All Varieties
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          selectedCategory === cat.id 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-2xl border border-stone-200/50">
            <AlertCircle size={40} className="text-stone-300 mb-4" />
            <h3 className="font-serif text-2xl font-light text-stone-800">No Premium Varieties Found</h3>
            <p className="text-stone-500 font-light text-sm max-w-sm mt-1">
              Adjust your search keywords, clear the price sliders, or choose a different botanical variety category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory(null);
                setPriceRange(200000);
                setFilterMode('all');
              }}
              className="mt-5 rounded-full bg-stone-900 px-6 py-2.5 text-xs font-semibold uppercase text-white hover:bg-stone-800"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                whileHover={{ y: -4 }}
                onClick={() => onSelectProduct(product)}
                className="group relative flex flex-col cursor-pointer overflow-hidden rounded-2xl bg-white border border-stone-200/50 p-3 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-stone-300"
              >
                {/* Image Container */}
                <div className="relative h-72 w-full overflow-hidden rounded-xl bg-stone-100">
                  {product.isFeatured && (
                    <span className="absolute left-3 top-3 z-10 flex items-center space-x-1 rounded-full bg-amber-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                      <Sparkles size={8} />
                      <span>FEATURED</span>
                    </span>
                  )}
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Share button overlay */}
                  <button
                    onClick={(e) => handleShare(product, e)}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-stone-700 backdrop-blur-sm transition-all hover:bg-white hover:text-amber-600"
                    title="Copy Link"
                  >
                    <Share2 size={14} />
                  </button>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col pt-4 pb-2 px-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                    {product.price && (
                      <span className="text-xs font-semibold tracking-wide text-stone-900 bg-stone-100 px-2 py-0.5 rounded-full">
                        RWF {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-light text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="line-clamp-2 text-stone-500 text-xs font-light leading-relaxed mt-1 flex-1">
                    {product.shortDescription}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100/80 mt-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-900 group-hover:text-amber-700 transition-colors">
                      Discover Details
                    </span>

                    <button
                      onClick={(e) => handleWhatsApp(product, e)}
                      className="flex items-center space-x-1 rounded-full bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider transition-all"
                    >
                      <MessageSquare size={10} />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Back to Top */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-2 rounded-full border border-stone-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-600 transition-all hover:bg-stone-50 hover:text-stone-950"
          >
            <ArrowUp size={14} />
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </section>
  );
}
