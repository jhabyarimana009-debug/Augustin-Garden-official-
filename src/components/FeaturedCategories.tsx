import React from 'react';
import { Category } from '../types.js';
import { Check, Flame, Star, Award, Compass } from 'lucide-react';

interface FeaturedCategoriesProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export default function FeaturedCategories({ categories, selectedCategory, onSelectCategory }: FeaturedCategoriesProps) {
  
  // Icon picker for categories
  const getCategoryEmoji = (id: string) => {
    switch(id) {
      case 'orchid': return '🌸';
      case 'amaroza': return '🌹';
      case 'margarita': return '🌼';
      case 'sipure': return '🌿';
      case 'golden-palm': return '🌴';
      case 'fujeri': return '🌱';
      case 'vases': return '🏺';
      default: return '🌺';
    }
  };

  return (
    <section className="bg-stone-50 py-12 border-b border-stone-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center space-y-3 mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Selected Flora Varieties
          </span>
          <h2 className="font-serif text-3xl font-light tracking-wide text-stone-900">
            Browse Our <span className="font-light italic text-amber-600">Exclusive Categories</span>
          </h2>
          <p className="max-w-xl text-stone-500 text-sm font-light">
            We cultivate, handpick, and custom design various botanical masterpieces tailored for elite Kigali spaces.
          </p>
        </div>

        {/* Dynamic Category Pill Container */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex items-center space-x-2 rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
              selectedCategory === null
                ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-900/10'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900'
            }`}
          >
            <span>🌌 All Collections</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center space-x-2 rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                  isSelected
                    ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-900/10'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900'
                }`}
              >
                <span>{getCategoryEmoji(cat.id)}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
