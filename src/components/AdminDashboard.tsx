import React, { useState, useEffect } from 'react';
import { Product, Category, Service, HomepageSlide, WebsiteSettings, AdminProfile } from '../types.js';
import { 
  BarChart3, Plus, Edit2, Trash2, Settings, Users, Layers, Sparkles, Flame, 
  Image as ImageIcon, PlusCircle, Check, AlertCircle, Save, LogOut, Lock, User as UserIcon, HelpCircle, X
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  services: Service[];
  slides: HomepageSlide[];
  settings: WebsiteSettings;
  onLogout: () => void;
  onRefreshData: () => void;
}

export default function AdminDashboard({
  products,
  categories,
  services,
  slides,
  settings,
  onLogout,
  onRefreshData
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'categories' | 'services' | 'slides' | 'settings' | 'profile'>('stats');
  
  // Notification states
  const [noti, setNoti] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Loading states
  const [saving, setSaving] = useState(false);

  // Products state (For Upload and Edit)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    category: '',
    price: '',
    shortDescription: '',
    fullDescription: '',
    mainImage: '',
    galleryImages: [] as string[],
    isFeatured: false,
    isHotDeal: false,
    isRecommended: false,
    status: 'active' as 'active' | 'inactive'
  });
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Categories state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ name: '', description: '' });

  // Services state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [srvForm, setSrvForm] = useState({ name: '', description: '', images: [] as string[], isFeatured: false });
  const [newSrvImgUrl, setNewSrvImgUrl] = useState('');

  // Slides state
  const [editingSlide, setEditingSlide] = useState<HomepageSlide | null>(null);
  const [slideForm, setSlideForm] = useState({ title: '', subtitle: '', image: '', link: '', order: 1 });

  // Settings State
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>(settings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const triggerNoti = (type: 'success' | 'error', text: string) => {
    setNoti({ type, text });
    setTimeout(() => setNoti(null), 4000);
  };

  // Base64 helper for image uploads
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'product-main' | 'product-gallery' | 'service' | 'slide' | 'profile-photo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        // Post to upload API
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64String, name: file.name })
        });
        
        const data = await response.json();
        if (data.url) {
          if (target === 'product-main') {
            setProdForm(prev => ({ ...prev, mainImage: data.url }));
          } else if (target === 'product-gallery') {
            setProdForm(prev => ({ ...prev, galleryImages: [...prev.galleryImages, data.url] }));
          } else if (target === 'service') {
            setSrvForm(prev => ({ ...prev, images: [...prev.images, data.url] }));
          } else if (target === 'slide') {
            setSlideForm(prev => ({ ...prev, image: data.url }));
          } else if (target === 'profile-photo') {
            setSettingsForm(prev => ({
              ...prev,
              profile: { ...prev.profile, ownerPhoto: data.url }
            }));
          }
          triggerNoti('success', 'Image uploaded successfully!');
        } else {
          triggerNoti('error', data.error || 'Upload failed');
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      triggerNoti('error', err.message || 'Error processing image');
    }
  };

  // --- PRODUCT CRUD ---
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prodForm)
      });
      if (res.ok) {
        triggerNoti('success', editingProduct ? 'Product edited successfully!' : 'Product uploaded successfully!');
        setEditingProduct(null);
        setProdForm({
          name: '', category: '', price: '', shortDescription: '', fullDescription: '',
          mainImage: '', galleryImages: [], isFeatured: false, isHotDeal: false, isRecommended: false, status: 'active'
        });
        onRefreshData();
      } else {
        triggerNoti('error', 'Failed to save product');
      }
    } catch (err) {
      triggerNoti('error', 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdForm({
      name: p.name,
      category: p.category,
      price: p.price ? String(p.price) : '',
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      mainImage: p.mainImage,
      galleryImages: p.galleryImages || [],
      isFeatured: p.isFeatured,
      isHotDeal: p.isHotDeal,
      isRecommended: p.isRecommended,
      status: p.status
    });
    setActiveTab('products');
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this premium arrangement?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerNoti('success', 'Product deleted.');
        onRefreshData();
      }
    } catch (err) {
      triggerNoti('error', 'Failed to delete');
    }
  };

  // --- CATEGORY CRUD ---
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm)
      });
      if (res.ok) {
        triggerNoti('success', 'Category successfully saved!');
        setEditingCategory(null);
        setCatForm({ name: '', description: '' });
        onRefreshData();
      }
    } catch (err) {
      triggerNoti('error', 'Error saving category');
    }
  };

  const startEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCatForm({ name: c.name, description: c.description || '' });
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Products assigned to it will remain but their categorization tag might look empty.")) return;
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      triggerNoti('success', 'Category deleted');
      onRefreshData();
    } catch (err) {
      triggerNoti('error', 'Error');
    }
  };

  // --- SERVICES CRUD ---
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
    const method = editingService ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(srvForm)
      });
      if (res.ok) {
        triggerNoti('success', 'Service updated!');
        setEditingService(null);
        setSrvForm({ name: '', description: '', images: [], isFeatured: false });
        onRefreshData();
      }
    } catch (err) {
      triggerNoti('error', 'Error');
    }
  };

  // --- SLIDES CRUD ---
  const handleSlideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingSlide ? `/api/slides/${editingSlide.id}` : '/api/slides';
    const method = editingSlide ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideForm)
      });
      if (res.ok) {
        triggerNoti('success', 'Slide saved!');
        setEditingSlide(null);
        setSlideForm({ title: '', subtitle: '', image: '', link: '', order: 1 });
        onRefreshData();
      }
    } catch (err) {
      triggerNoti('error', 'Error');
    }
  };

  const startEditSlide = (s: HomepageSlide) => {
    setEditingSlide(s);
    setSlideForm({
      title: s.title,
      subtitle: s.subtitle,
      image: s.image,
      link: s.link || '',
      order: s.order
    });
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerNoti('success', 'Slide deleted.');
        if (editingSlide?.id === id) {
          setEditingSlide(null);
          setSlideForm({ title: '', subtitle: '', image: '', link: '', order: 1 });
        }
        onRefreshData();
      } else {
        triggerNoti('error', 'Failed to delete slide.');
      }
    } catch (err) {
      triggerNoti('error', 'Network error.');
    }
  };

  // --- SAVE GENERAL SETTINGS ---
  const handleSaveSettings = async (section: 'profile' | 'social' | 'about' | 'contact' | 'policy') => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        triggerNoti('success', `${section.toUpperCase()} settings saved successfully!`);
        onRefreshData();
      } else {
        triggerNoti('error', 'Failed to save');
      }
    } catch (err) {
      triggerNoti('error', 'Network failure');
    } finally {
      setSaving(false);
    }
  };

  // Statistics Computations
  const totalProducts = products.length;
  const flowersCount = products.filter(p => p.category !== 'vases').length;
  const vasesCount = products.filter(p => p.category === 'vases').length;
  const featuredCount = products.filter(p => p.isFeatured).length;
  const hotDealsCount = products.filter(p => p.isHotDeal).length;
  const inactiveCount = products.filter(p => p.status === 'inactive').length;

  return (
    <div className="min-h-screen bg-stone-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Administrative Workspace</span>
            <h1 className="font-serif text-3xl font-light text-stone-900 mt-1">
              Augustin Garden <span className="italic font-light text-amber-600">Control Panel</span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 rounded-xl border border-stone-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-600 transition-colors"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Banner Notification */}
        {noti && (
          <div className={`mb-6 flex items-center space-x-3 p-4 rounded-xl border ${
            noti.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {noti.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{noti.text}</span>
          </div>
        )}

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Column */}
          <div className="lg:col-span-3 space-y-2 bg-white border border-stone-200 p-4 rounded-3xl shadow-sm">
            <h3 className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">Dashboard Modules</h3>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeTab === 'stats' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <BarChart3 size={16} />
              <span>Statistics & Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeTab === 'products' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <ImageIcon size={16} />
              <span>Products Curation</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeTab === 'categories' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Layers size={16} />
              <span>Manage Categories</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeTab === 'services' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <PlusCircle size={16} />
              <span>Manage Services</span>
            </button>
            <button
              onClick={() => setActiveTab('slides')}
              className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeTab === 'slides' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Sparkles size={16} />
              <span>Homepage Slides</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeTab === 'settings' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Settings size={16} />
              <span>Website Configuration</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeTab === 'profile' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <UserIcon size={16} />
              <span>Studio Profile</span>
            </button>
          </div>

          {/* Core Content Column */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* TAB: STATISTICS */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                
                {/* Stats Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Inventory</p>
                    <p className="font-serif text-3xl font-light text-stone-900">{totalProducts}</p>
                    <p className="text-[9px] font-semibold text-stone-500">Active product showcase</p>
                  </div>
                  <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Flowers Count</p>
                    <p className="font-serif text-3xl font-light text-stone-900">{flowersCount}</p>
                    <p className="text-[9px] font-semibold text-emerald-600">Fresh organic blooms</p>
                  </div>
                  <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Artisan Vases</p>
                    <p className="font-serif text-3xl font-light text-stone-900">{vasesCount}</p>
                    <p className="text-[9px] font-semibold text-amber-600">Hand-painted ceramics</p>
                  </div>
                  <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Hot Promos</p>
                    <p className="font-serif text-3xl font-light text-stone-900">{hotDealsCount}</p>
                    <p className="text-[9px] font-semibold text-red-600">Visible on deals slider</p>
                  </div>
                </div>

                {/* Info block */}
                <div className="bg-stone-900 text-stone-300 p-6 rounded-3xl border border-stone-800 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-500">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Showcase Analytics Statement</span>
                  </div>
                  <h3 className="font-serif text-xl font-light text-white">Direct-to-WhatsApp Conversions</h3>
                  <p className="text-stone-400 text-xs font-light leading-relaxed">
                    Augustin Garden runs on a simplified, direct-contact ecommerce funnel. Visitors browse products, read detailed specifications, review designer profiles, then tap to initiate orders immediately. This increases organic customer trust and lets you offer seasonal pricing variations in real-time.
                  </p>
                </div>

                {/* Recent uploads */}
                <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
                  <h3 className="font-serif text-lg font-semibold text-stone-950 mb-4">Recent Studio Uploads</h3>
                  <div className="divide-y divide-stone-100">
                    {products.slice(0, 4).map((p) => (
                      <div key={p.id} className="flex items-center justify-between py-3">
                        <div className="flex items-center space-x-3">
                          <img src={p.mainImage} alt="" className="h-10 w-10 rounded-lg object-cover" />
                          <div>
                            <h4 className="text-xs font-bold text-stone-900">{p.name}</h4>
                            <p className="text-[10px] text-stone-500">{p.category} • Uploaded {new Date(p.dateUploaded).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => startEditProduct(p)} className="rounded p-1.5 hover:bg-stone-100 text-stone-600"><Edit2 size={12} /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="rounded p-1.5 hover:bg-red-50 text-red-600"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: PRODUCTS CURATION */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                
                {/* Form to Create/Edit Product */}
                <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-serif text-xl font-semibold text-stone-900 border-b border-stone-100 pb-3">
                    {editingProduct ? `Edit arrangement: "${editingProduct.name}"` : 'Upload New Floral Masterpiece'}
                  </h3>

                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Arrangement Title</label>
                        <input
                          type="text"
                          required
                          value={prodForm.name}
                          onChange={(e) => setProdForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Lavender Dew Ceramic Pot"
                          className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Botanical Category</label>
                        <select
                          required
                          value={prodForm.category}
                          onChange={(e) => setProdForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full rounded-xl border border-stone-200 p-3 text-xs bg-white focus:border-amber-500 focus:outline-none"
                        >
                          <option value="">Select Category...</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Price (RWF - Optional)</label>
                        <input
                          type="number"
                          value={prodForm.price}
                          onChange={(e) => setProdForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="e.g. 85000"
                          className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Primary Image (Upload or URL)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={prodForm.mainImage}
                            onChange={(e) => setProdForm(prev => ({ ...prev, mainImage: e.target.value }))}
                            placeholder="Image URL or upload a file"
                            className="flex-1 rounded-xl border border-stone-200 p-3 text-xs focus:border-amber-500 focus:outline-none"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            id="product-file-uploader"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'product-main')}
                          />
                          <label
                            htmlFor="product-file-uploader"
                            className="cursor-pointer bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl px-4 py-3 text-xs font-semibold uppercase text-stone-700 select-none flex items-center justify-center shrink-0"
                          >
                            Browse...
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Gallery Images */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Additional Gallery Images (Max 2)</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newGalleryUrl}
                          onChange={(e) => setNewGalleryUrl(e.target.value)}
                          placeholder="Enter additional Unsplash URL or upload files"
                          className="flex-1 rounded-xl border border-stone-200 p-3 text-xs focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newGalleryUrl) {
                              setProdForm(prev => ({ ...prev, galleryImages: [...prev.galleryImages, newGalleryUrl] }));
                              setNewGalleryUrl('');
                            }
                          }}
                          className="bg-stone-900 text-white rounded-xl px-4 py-3 text-xs font-semibold"
                        >
                          Add URL
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          id="product-gallery-uploader"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'product-gallery')}
                        />
                        <label
                          htmlFor="product-gallery-uploader"
                          className="cursor-pointer bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl px-4 py-3 text-xs font-semibold uppercase text-stone-700 flex items-center justify-center shrink-0"
                        >
                          Upload...
                        </label>
                      </div>

                      {/* Display current gallery list */}
                      <div className="flex gap-2">
                        {prodForm.galleryImages.map((img, index) => (
                          <div key={index} className="relative h-14 w-14 rounded-lg overflow-hidden border border-stone-200">
                            <img src={img} alt="" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setProdForm(prev => ({ ...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== index) }))}
                              className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-full"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Short Visual Hook (Under 100 characters)</label>
                      <input
                        type="text"
                        required
                        value={prodForm.shortDescription}
                        onChange={(e) => setProdForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                        placeholder="e.g. Premium White Roses styled in a hand-painted clay pot."
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Full Creative Story (Product Details)</label>
                      <textarea
                        required
                        rows={4}
                        value={prodForm.fullDescription}
                        onChange={(e) => setProdForm(prev => ({ ...prev, fullDescription: e.target.value }))}
                        placeholder="Explain the design philosophy, vase details, bloom durations, and care guidelines..."
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Flags */}
                    <div className="flex flex-wrap gap-4 py-2">
                      <label className="flex items-center space-x-2 text-xs font-semibold text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prodForm.isFeatured}
                          onChange={(e) => setProdForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span>⭐ Featured Showcase</span>
                      </label>

                      <label className="flex items-center space-x-2 text-xs font-semibold text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prodForm.isHotDeal}
                          onChange={(e) => setProdForm(prev => ({ ...prev, isHotDeal: e.target.checked }))}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span>🔥 Live Hot Deal</span>
                      </label>

                      <label className="flex items-center space-x-2 text-xs font-semibold text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prodForm.isRecommended}
                          onChange={(e) => setProdForm(prev => ({ ...prev, isRecommended: e.target.checked }))}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span>👑 Recommended Staff Choice</span>
                      </label>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex space-x-2 pt-2 border-t border-stone-100">
                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
                      >
                        {saving ? 'Publishing...' : editingProduct ? 'Save Changes' : 'Publish Showcase'}
                      </button>

                      {editingProduct && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(null);
                            setProdForm({
                              name: '', category: '', price: '', shortDescription: '', fullDescription: '',
                              mainImage: '', galleryImages: [], isFeatured: false, isHotDeal: false, isRecommended: false, status: 'active'
                            });
                          }}
                          className="rounded-xl border border-stone-200 text-stone-600 px-6 py-3 text-xs font-bold uppercase"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Products List */}
                <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
                  <h3 className="font-serif text-lg font-semibold text-stone-900 mb-4">Complete Catalog Directory</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase">
                          <th className="pb-3 pl-2">Product</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Valuation</th>
                          <th className="pb-3">Features</th>
                          <th className="pb-3 pr-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-stone-50/50">
                            <td className="py-3 pl-2">
                              <div className="flex items-center space-x-3">
                                <img src={p.mainImage} alt="" className="h-10 w-10 rounded-lg object-cover" />
                                <span className="font-semibold text-stone-800">{p.name}</span>
                              </div>
                            </td>
                            <td className="py-3 font-medium text-stone-500 uppercase">{p.category}</td>
                            <td className="py-3 font-medium text-stone-950">
                              {p.price ? `RWF ${p.price.toLocaleString()}` : 'Bespoke Inquire'}
                            </td>
                            <td className="py-3">
                              <div className="flex gap-1.5 flex-wrap">
                                {p.isFeatured && <span className="bg-amber-50 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">F</span>}
                                {p.isHotDeal && <span className="bg-red-50 text-red-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">H</span>}
                                {p.isRecommended && <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">R</span>}
                              </div>
                            </td>
                            <td className="py-3 pr-2 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button onClick={() => startEditProduct(p)} className="rounded p-1.5 hover:bg-stone-100 text-stone-600" title="Edit"><Edit2 size={12} /></button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="rounded p-1.5 hover:bg-red-50 text-red-600" title="Delete"><Trash2 size={12} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: MANAGE CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                
                {/* Add Category */}
                <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-stone-900 border-b border-stone-100 pb-3">
                    {editingCategory ? 'Modify Botanical Class' : 'Establish New Category'}
                  </h3>

                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Category Label</label>
                        <input
                          type="text"
                          required
                          value={catForm.name}
                          onChange={(e) => setCatForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Margarita"
                          className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Visual Hook Description</label>
                        <input
                          type="text"
                          value={catForm.description}
                          onChange={(e) => setCatForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="e.g. Crisp white and yellow daisies styled for table setups."
                          className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button type="submit" className="rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2.5 text-xs font-bold uppercase text-white">
                        {editingCategory ? 'Update Class' : 'Create Category'}
                      </button>
                      {editingCategory && (
                        <button
                          type="button"
                          onClick={() => { setEditingCategory(null); setCatForm({ name: '', description: '' }); }}
                          className="rounded-xl border border-stone-200 px-5 py-2.5 text-xs font-semibold text-stone-600"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Category List */}
                <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
                  <h3 className="font-serif text-lg font-semibold text-stone-900 mb-4">Current Category Registry</h3>
                  <div className="divide-y divide-stone-100">
                    {categories.map((c) => (
                      <div key={c.id} className="flex items-center justify-between py-3">
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">{c.name}</h4>
                          <p className="text-[10px] text-stone-500">{c.description || 'No description provided.'}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button onClick={() => startEditCategory(c)} className="p-1.5 hover:bg-stone-100 rounded text-stone-600"><Edit2 size={12} /></button>
                          <button onClick={() => handleDeleteCategory(c.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: MANAGE SERVICES */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-stone-900 border-b border-stone-100 pb-3">
                    {editingService ? `Edit service: "${editingService.name}"` : 'Introduce Premium Service'}
                  </h3>

                  <form onSubmit={handleServiceSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Service Title</label>
                        <input
                          type="text"
                          required
                          value={srvForm.name}
                          onChange={(e) => setSrvForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Garden Design"
                          className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Visual Primary Image (URL or Upload)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={srvForm.images[0] || ''}
                            onChange={(e) => setSrvForm(prev => {
                              const list = [...prev.images];
                              list[0] = e.target.value;
                              return { ...prev, images: list };
                            })}
                            placeholder="Unsplash URL"
                            className="flex-1 rounded-xl border border-stone-200 p-3 text-xs focus:border-amber-500 focus:outline-none"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            id="service-file-uploader"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'service')}
                          />
                          <label
                            htmlFor="service-file-uploader"
                            className="cursor-pointer bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl px-4 py-3 text-xs font-semibold text-stone-700 uppercase flex items-center justify-center shrink-0"
                          >
                            Browse...
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Creative Description</label>
                      <textarea
                        required
                        rows={3}
                        value={srvForm.description}
                        onChange={(e) => setSrvForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Detail the execution timeline, location audits, and custom vessel design coordination..."
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <label className="flex items-center space-x-2 text-xs font-semibold text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={srvForm.isFeatured}
                        onChange={(e) => setSrvForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Mark as Featured Premium Division</span>
                    </label>

                    <button type="submit" className="rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2.5 text-xs font-bold uppercase text-white">
                      Publish Service
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: HOMEPAGE SLIDES */}
            {activeTab === 'slides' && (
              <div className="space-y-6">
                <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-stone-900 border-b border-stone-100 pb-3">
                    {editingSlide ? 'Modify Homepage Slide' : 'Homepage Slider Configurations'}
                  </h3>

                  <form onSubmit={handleSlideSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Slide Title</label>
                        <input
                          type="text"
                          required
                          value={slideForm.title}
                          onChange={(e) => setSlideForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Luxury Flowers & Curated Vases"
                          className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Background Image (URL or Upload)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={slideForm.image}
                            onChange={(e) => setSlideForm(prev => ({ ...prev, image: e.target.value }))}
                            placeholder="Unsplash URL"
                            className="flex-1 rounded-xl border border-stone-200 p-3 text-xs focus:border-amber-500 focus:outline-none"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            id="slide-file-uploader"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'slide')}
                          />
                          <label
                            htmlFor="slide-file-uploader"
                            className="cursor-pointer bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl px-4 py-3 text-xs font-semibold text-stone-700 uppercase flex items-center justify-center shrink-0"
                          >
                            Browse...
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Sub-headline Description</label>
                        <input
                          type="text"
                          required
                          value={slideForm.subtitle}
                          onChange={(e) => setSlideForm(prev => ({ ...prev, subtitle: e.target.value }))}
                          placeholder="Delivered directly across Kigali and Rwanda"
                          className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Sort Order</label>
                        <input
                          type="number"
                          required
                          value={slideForm.order}
                          onChange={(e) => setSlideForm(prev => ({ ...prev, order: Number(e.target.value) }))}
                          className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button type="submit" className="rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2.5 text-xs font-bold uppercase text-white">
                        {editingSlide ? 'Update Slide' : 'Publish Slide'}
                      </button>
                      {editingSlide && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSlide(null);
                            setSlideForm({ title: '', subtitle: '', image: '', link: '', order: 1 });
                          }}
                          className="rounded-xl border border-stone-200 px-5 py-2.5 text-xs font-semibold text-stone-600"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
                  <h3 className="font-serif text-lg font-semibold text-stone-900 mb-4 font-luxury">Current Slides</h3>
                  <div className="space-y-4">
                    {slides.map(s => (
                      <div key={s.id} className="flex gap-4 p-4 rounded-2xl border border-stone-100 bg-stone-50 items-center justify-between">
                        <div className="flex gap-4 items-center min-w-0">
                          <img src={s.image} alt="" className="h-16 w-24 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-stone-950 truncate">{s.title}</h4>
                            <p className="text-[10px] text-stone-500 line-clamp-1">{s.subtitle}</p>
                            <span className="inline-block mt-2 text-[9px] font-bold bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full">Order: {s.order}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={() => startEditSlide(s)}
                            className="p-1.5 hover:bg-stone-200 rounded text-stone-600 transition-colors"
                            title="Edit Slide"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteSlide(s.id)}
                            className="p-1.5 hover:bg-red-100 rounded text-red-600 transition-colors"
                            title="Delete Slide"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: WEBSITE CONFIGURATION */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                
                {/* Contact configurations */}
                <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-stone-900 border-b border-stone-100 pb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Primary Phone Contact</label>
                      <input
                        type="text"
                        value={settingsForm.contact.phone}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          contact: { ...prev.contact, phone: e.target.value }
                        }))}
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">WhatsApp Order Contact</label>
                      <input
                        type="text"
                        value={settingsForm.contact.whatsapp}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          contact: { ...prev.contact, whatsapp: e.target.value }
                        }))}
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Business Storefront Location</label>
                    <input
                      type="text"
                      value={settingsForm.contact.address}
                      onChange={(e) => setSettingsForm(prev => ({
                        ...prev,
                        contact: { ...prev.contact, address: e.target.value }
                      }))}
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Email Orders Box</label>
                      <input
                        type="email"
                        value={settingsForm.contact.email}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          contact: { ...prev.contact, email: e.target.value }
                        }))}
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Operating Work Hours</label>
                      <input
                        type="text"
                        value={settingsForm.contact.businessHours}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          contact: { ...prev.contact, businessHours: e.target.value }
                        }))}
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Google Maps Embedded Source URL (Iframe src)</label>
                    <input
                      type="text"
                      value={settingsForm.contact.googleMapEmbed}
                      onChange={(e) => setSettingsForm(prev => ({
                        ...prev,
                        contact: { ...prev.contact, googleMapEmbed: e.target.value }
                      }))}
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                    />
                  </div>

                  <button
                    onClick={() => handleSaveSettings('contact')}
                    className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 text-xs font-bold uppercase"
                  >
                    Save Contact Details
                  </button>
                </div>

                {/* About configurations */}
                <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-stone-900 border-b border-stone-100 pb-3">Creative Vision & Story</h3>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Our Full Story</label>
                    <textarea
                      rows={4}
                      value={settingsForm.about.story}
                      onChange={(e) => setSettingsForm(prev => ({
                        ...prev,
                        about: { ...prev.about, story: e.target.value }
                      }))}
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Mission Statement</label>
                    <input
                      type="text"
                      value={settingsForm.about.mission}
                      onChange={(e) => setSettingsForm(prev => ({
                        ...prev,
                        about: { ...prev.about, mission: e.target.value }
                      }))}
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Vision Statement</label>
                    <input
                      type="text"
                      value={settingsForm.about.vision}
                      onChange={(e) => setSettingsForm(prev => ({
                        ...prev,
                        about: { ...prev.about, vision: e.target.value }
                      }))}
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">The Guarantee Promise</label>
                    <textarea
                      rows={3}
                      value={settingsForm.about.promise}
                      onChange={(e) => setSettingsForm(prev => ({
                        ...prev,
                        about: { ...prev.about, promise: e.target.value }
                      }))}
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                    />
                  </div>

                  <button
                    onClick={() => handleSaveSettings('about')}
                    className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 text-xs font-bold uppercase"
                  >
                    Save About Sections
                  </button>
                </div>

                {/* Social media links */}
                <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-stone-900 border-b border-stone-100 pb-3">Social Feeds</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={settingsForm.social.instagram}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          social: { ...prev.social, instagram: e.target.value }
                        }))}
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Facebook URL</label>
                      <input
                        type="text"
                        value={settingsForm.social.facebook}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          social: { ...prev.social, facebook: e.target.value }
                        }))}
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">TikTok URL</label>
                      <input
                        type="text"
                        value={settingsForm.social.tiktok}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          social: { ...prev.social, tiktok: e.target.value }
                        }))}
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">YouTube URL</label>
                      <input
                        type="text"
                        value={settingsForm.social.youtube}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          social: { ...prev.social, youtube: e.target.value }
                        }))}
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveSettings('social')}
                    className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 text-xs font-bold uppercase"
                  >
                    Save Social Handles
                  </button>
                </div>

                {/* Privacy and Terms */}
                <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-stone-900 border-b border-stone-100 pb-3">Legal Copy</h3>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Privacy Policy Agreement</label>
                    <textarea
                      rows={3}
                      value={settingsForm.privacyPolicy}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, privacyPolicy: e.target.value }))}
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Terms & Conditions Copy</label>
                    <textarea
                      rows={3}
                      value={settingsForm.termsConditions}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, termsConditions: e.target.value }))}
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs font-sans"
                    />
                  </div>

                  <button
                    onClick={() => handleSaveSettings('policy')}
                    className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 text-xs font-bold uppercase"
                  >
                    Save Policies
                  </button>
                </div>

              </div>
            )}

            {/* TAB: PROFILE CONFIGURATION */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-stone-900 border-b border-stone-100 pb-3">Designer / Studio Identity</h3>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <img src={settingsForm.profile.ownerPhoto} alt="" className="h-24 w-24 rounded-full border-4 border-amber-600 object-cover shadow" />
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Update Owner Photo (Upload File)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'profile-photo')}
                        className="text-xs text-stone-500 border border-stone-200 rounded-lg p-2 bg-stone-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Owner Name</label>
                      <input
                        type="text"
                        value={settingsForm.profile.ownerName}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          profile: { ...prev.profile, ownerName: e.target.value }
                        }))}
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Company Registered Name</label>
                      <input
                        type="text"
                        value={settingsForm.profile.businessName}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          profile: { ...prev.profile, businessName: e.target.value }
                        }))}
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Email</label>
                      <input
                        type="email"
                        value={settingsForm.profile.email}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          profile: { ...prev.profile, email: e.target.value }
                        }))}
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">Phone Call</label>
                      <input
                        type="text"
                        value={settingsForm.profile.phone}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          profile: { ...prev.profile, phone: e.target.value }
                        }))}
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-600 mb-1">WhatsApp Phone (International No)</label>
                      <input
                        type="text"
                        value={settingsForm.profile.whatsapp}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          profile: { ...prev.profile, whatsapp: e.target.value }
                        }))}
                        className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveSettings('profile')}
                    className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 text-xs font-bold uppercase"
                  >
                    Save Studio Profile
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
