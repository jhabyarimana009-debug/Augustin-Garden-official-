import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { DatabaseSchema, Product, Category, Service, HomepageSlide, WebsiteSettings } from './src/types.js';

const app = express();
const PORT = 3000;

// Set up JSON middleware with high limits for base64 image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure database and uploads directory exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Generate high quality initial database if not exists
const initialSettings: WebsiteSettings = {
  profile: {
    ownerName: "Augustin Ndayisaba",
    ownerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
    businessName: "Augustin Garden Ltd",
    phone: "(+250) 789 736 800",
    whatsapp: "+250789736800",
    email: "info@augustingarden.com",
    address: "Kibagabaga, KG 375 St, Kigali, Rwanda",
    location: "Kigali, Rwanda"
  },
  social: {
    facebook: "https://facebook.com/augustingarden",
    instagram: "https://instagram.com/augustingarden",
    tiktok: "https://tiktok.com/@augustingarden",
    youtube: "https://youtube.com/c/augustingarden",
    twitter: "https://twitter.com/augustingarden"
  },
  about: {
    story: "Founded in the heart of Kigali, Augustin Garden is Rwanda's premier luxury floral designer and landscaping artist. We curate high-end floral arrangements, premium ceramic and hand-painted vases, and construct breathtaking residential and commercial gardens. Our design philosophy pairs European clean lines with the vibrant, lush botanicals of East Africa.",
    mission: "To elevate everyday spaces across Rwanda through the luxurious elegance of custom floral designs, premium artisanal vases, and masterfully crafted garden landscapes.",
    vision: "To be recognized as East Africa's hallmark of luxury botanical design, known for unparalleled craftsmanship, premium quality, and exquisite aesthetic perfection.",
    values: ["Aesthetic Elegance", "Artisanal Craftsmanship", "Client Trust", "Exacting Quality", "Eco-Friendly Gardening"],
    experience: "With over 12 years of landscape and floral setup experience, we have styled top presidential estates, corporate workspaces, and elite weddings in Kigali.",
    promise: "We promise that every bloom selected is at peak beauty, every vase is inspected for absolute perfection, and our customer support is always directly available with local Kigali delivery."
  },
  contact: {
    address: "Kibagabaga, KG 375 St, Kigali, Rwanda (Near Kibagabaga Hospital)",
    phone: "(+250) 789 736 800",
    whatsapp: "+250789736800",
    email: "orders@augustingarden.com",
    businessHours: "Monday - Saturday: 7:30 AM - 7:30 PM | Sunday: 9:00 AM - 5:00 PM",
    googleMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15950.117183049588!2d30.111816!3d-1.936671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca6fa54cf24e7%3A0xe54ef5bb9c1a3fc!2sKibagabaga%2C%20Kigali!5e0!3m2!1sen!2srw!4v1700000000000!5m2!1sen!2srw"
  },
  privacyPolicy: "At Augustin Garden, we respect your privacy. As a showcase platform, we do not store customer checkout details or payment credentials. When you contact us via WhatsApp or Phone, your shared communication is used solely to facilitate your floral or landscaping order. We never sell or distribute your contact details to third parties.",
  termsConditions: "All floral orders are subject to fresh seasonal availability. Garden installations require an on-site design consultation in Kigali or across Rwanda. Since our flower and vase transactions are handled directly through direct contact, delivery terms and payments are mutually agreed upon during WhatsApp or phone negotiations."
};

const defaultCategories: Category[] = [
  { id: "orchid", name: "Orchid", description: "Elite exotic orchids known for their architectural silhouettes and long-lasting beauty." },
  { id: "amaroza", name: "Amaroza", description: "Premium luxury long-stemmed roses in exquisite velvet shades." },
  { id: "margarita", name: "Margarita", description: "Cheerful, elegant daisies and premium margaritas for clean, airy styling." },
  { id: "sipure", name: "Sipure", description: "Striking sculptural cypress-like floral foliage and structuring branches." },
  { id: "golden-palm", name: "Golden Palm", description: "Lush tropical palm selections that breathe life into premium interior setups." },
  { id: "bujeniya", name: "Bujeniya", description: "Highly prized garden greenery with rich textured leaves." },
  { id: "fujeri", name: "Fujeri", description: "Lush, delicate forest ferns perfect for high-end hanging decor." },
  { id: "anteri-yumu", name: "Anteri Yumu", description: "Glossy, heart-shaped Anthuriums representing modern minimalist luxury." },
  { id: "vases", name: "Flower Vases", description: "Hand-painted premium ceramic, terracotta, and crystal flower vases." }
];

const defaultSlides: HomepageSlide[] = [
  {
    id: "slide1",
    title: "Luxury Flowers & Curated Vases",
    subtitle: "Augustin Garden – Breathtaking floral artistry delivered directly across Kigali and Rwanda.",
    image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?q=80&w=1600",
    link: "/flowers",
    order: 1
  },
  {
    id: "slide2",
    title: "Artisanal Hand-Painted Vases",
    subtitle: "Inimitable ceramic statements designed to elevate your living spaces and luxury office interiors.",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1600",
    link: "/vases",
    order: 2
  },
  {
    id: "slide3",
    title: "Elite Landscape & Garden Design",
    subtitle: "Transforming residential villas and corporate terraces into natural paradise setups.",
    image: "https://images.unsplash.com/photo-1558904541-efa8c1a68fc6?q=80&w=1600",
    link: "/services",
    order: 3
  }
];

const defaultServices: Service[] = [
  {
    id: "srv1",
    name: "Luxury Garden Design & Landscaping",
    description: "Full-scale custom botanical blueprints and execution. We design elegant path steps, manicured sods, ornamental hedges, and rock garden terraces suited for premium residential estates in Kigali.",
    images: [
      "https://images.unsplash.com/photo-1558904541-efa8c1a68fc6?q=80&w=1000",
      "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?q=80&w=1000"
    ],
    isFeatured: true
  },
  {
    id: "srv2",
    name: "Indoor & Commercial Green Styling",
    description: "Office decoration and residential indoor plant curated placements. We select perfect light-adapted species like Golden Palm and Fujeri paired with bespoke hand-painted ceramic vases to optimize air quality and premium corporate aura.",
    images: [
      "https://images.unsplash.com/photo-1513559688682-a939e72ef002?q=80&w=1000",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000"
    ],
    isFeatured: true
  },
  {
    id: "srv3",
    name: "Elite Wedding & Event Floral Setups",
    description: "Grand backdrops, floral archways, table runners, and boutique bride bouquets. We translate high-concept themes into unforgettable biological structures using Rwanda's freshest premium roses and callas.",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000"
    ],
    isFeatured: true
  },
  {
    id: "srv4",
    name: "Premium Vase Restoration & Painting",
    description: "Bespoke custom painting of terracotta, marble, and clay vases. Hand-crafted patterns made to coordinate beautifully with your interior color schemes, metallic finishes, and textures.",
    images: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=1000"
    ],
    isFeatured: false
  },
  {
    id: "srv5",
    name: "Nationwide Luxury Delivery",
    description: "Delivering fully assembled arrangements and delicate potted installations securely in temperature-controlled vehicles directly to your doorstep in Kibagabaga, Kigali, or any province in Rwanda.",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000"
    ],
    isFeatured: false
  }
];

const defaultProducts: Product[] = [
  {
    id: "p1",
    name: "The Kigali Royal Orchid Arrangement",
    category: "orchid",
    price: 85000,
    shortDescription: "A magnificent cascade of pure snow-white orchids potted in a handcrafted high-gloss gold metallic ceramic vase.",
    fullDescription: "The Kigali Royal Orchid is the zenith of botanical sophistication. Hand-selected for their pristine, structural blooms, these dual-spiked white Phalaenopsis orchids are anchored in organic moss within our signature hand-painted gold-rimmed ceramic pot. Perfect for premium office receptions, high-end console tables, or as an esteemed gift representing respect and grace. Naturally durable, requiring minimal water, and will remain in full, breathtaking bloom for up to 8-10 weeks.",
    mainImage: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1453904300235-df5c7039c564?q=80&w=1000",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000"
    ],
    isFeatured: true,
    isHotDeal: true,
    isRecommended: true,
    dateUploaded: new Date().toISOString(),
    status: "active"
  },
  {
    id: "p2",
    name: "Crimson Empress Luxury Rose Box",
    category: "amaroza",
    price: 65000,
    shortDescription: "36 deep crimson long-stemmed roses curated inside a premium textured black velvet cylindrical display.",
    fullDescription: "Our Crimson Empress roses are cultivated at optimal Rwandan high-altitude estates, allowing for colossal blooms and unparalleled color intensity. Each stem is meticulously stripped of thorns, hydrated in premium floral elixir, and packed tight into our branded, heavy-stock velvet cylindrical box. Designed to look breathtaking from every angle, this arrangement requires no transfer to a vase and maintains its perfect dome shape for up to 12 days with minor hydration.",
    mainImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=1000",
      "https://images.unsplash.com/photo-1552694403-99b38007ae82?q=80&w=1000"
    ],
    isFeatured: true,
    isHotDeal: false,
    isRecommended: true,
    dateUploaded: new Date().toISOString(),
    status: "active"
  },
  {
    id: "p3",
    name: "Gilded Obsidian Terracotta Vase",
    category: "vases",
    price: 120000,
    shortDescription: "Master-painted 45cm heavy terracotta vase finished in matte black with 24k gold abstract leafing.",
    fullDescription: "A singular piece of sculptural art. Hand-thrown by local Rwandan artisans, this heavy clay vase is kiln-fired and treated in our Kibagabaga studio. It features a modern textured charcoal-matte black background embellished with hand-applied gold leafing that mirrors organic leaf veins. Designed for both dry architectural branches or fresh premium arrangements. Water-sealed interior ensures zero moisture leakage onto expensive wood consoles.",
    mainImage: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=1000",
      "https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=1000"
    ],
    isFeatured: true,
    isHotDeal: true,
    isRecommended: false,
    dateUploaded: new Date().toISOString(),
    status: "active"
  },
  {
    id: "p4",
    name: "Infinia White Anthurium Pot",
    category: "anteri-yumu",
    price: 45000,
    shortDescription: "Glossy white Anthurium plant styled within a white minimalist cylindrical stoneware pot.",
    fullDescription: "Anteri Yumu represents pure structural simplicity. Also known as the Painter's Palette, these glossy white, heart-shaped spathes hold a striking contrasting yellow spadix. Curated in our premium geometric white ceramic pot with sub-surface drainage, this live plant serves as an exceptionally clean air-purifying accent for desks, bathroom counters, and modern floating shelves.",
    mainImage: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=1000"
    ],
    isFeatured: false,
    isHotDeal: false,
    isRecommended: true,
    dateUploaded: new Date().toISOString(),
    status: "active"
  },
  {
    id: "p5",
    name: "Sunburst Meadow Daisy Meadow",
    category: "margarita",
    price: 32000,
    shortDescription: "A vibrant arrangement of white margaritas, chamomile, and light green eucalyptus styled in a rustic glass jar.",
    fullDescription: "Bring the crisp freshness of mountain meadows into your home. This bouquet combines Rwanda-grown chamomile daisies with long-stemmed white margaritas and soft, dusty-green baby blue eucalyptus. Styled directly inside a thick, ribbed glass jar with a genuine leather handle accent, it provides an exquisite organic centerpiece for dining tables and breakfast bars.",
    mainImage: "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=1000"
    ],
    isFeatured: false,
    isHotDeal: true,
    isRecommended: false,
    dateUploaded: new Date().toISOString(),
    status: "active"
  },
  {
    id: "p6",
    name: "Premium Golden Palm Stand",
    category: "golden-palm",
    price: 95000,
    shortDescription: "6-foot tall multi-stem Golden Cane Palm potted in an insulated charcoal fiberglass architectural planter.",
    fullDescription: "The absolute standard for luxury interior plant styling. These majestic, healthy Golden Palms are acclimated to low-light conditions inside our nursery, ensuring rapid transition without browning. Potted in lightweight yet incredibly robust charcoal fiberglass planters that won't crack or discolor, and finished with sleek natural volcanic black stones to retain soil moisture.",
    mainImage: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1513559688682-a939e72ef002?q=80&w=1000"
    ],
    isFeatured: true,
    isHotDeal: false,
    isRecommended: false,
    dateUploaded: new Date().toISOString(),
    status: "active"
  }
];

// Helper to read database
function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const defaultData: DatabaseSchema = {
        products: defaultProducts,
        categories: defaultCategories,
        services: defaultServices,
        homepageSlides: defaultSlides,
        settings: initialSettings
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading database file", error);
    return {
      products: defaultProducts,
      categories: defaultCategories,
      services: defaultServices,
      homepageSlides: defaultSlides,
      settings: initialSettings
    };
  }
}

// Helper to write database
function writeDB(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing database file", error);
  }
}

// REST API Routes
app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json(db.products);
});

app.post('/api/products', (req, res) => {
  const db = readDB();
  const newProduct: Product = {
    id: 'p_' + Math.random().toString(36).substr(2, 9),
    name: req.body.name || 'Unnamed Product',
    category: req.body.category || 'unassigned',
    price: req.body.price ? Number(req.body.price) : undefined,
    shortDescription: req.body.shortDescription || '',
    fullDescription: req.body.fullDescription || '',
    mainImage: req.body.mainImage || 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?q=80&w=1000',
    galleryImages: Array.isArray(req.body.galleryImages) ? req.body.galleryImages : [],
    isFeatured: !!req.body.isFeatured,
    isHotDeal: !!req.body.isHotDeal,
    isRecommended: !!req.body.isRecommended,
    dateUploaded: new Date().toISOString(),
    status: req.body.status || 'active'
  };
  db.products.unshift(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const db = readDB();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  db.products[index] = {
    ...db.products[index],
    name: req.body.name ?? db.products[index].name,
    category: req.body.category ?? db.products[index].category,
    price: req.body.price !== undefined ? (req.body.price ? Number(req.body.price) : undefined) : db.products[index].price,
    shortDescription: req.body.shortDescription ?? db.products[index].shortDescription,
    fullDescription: req.body.fullDescription ?? db.products[index].fullDescription,
    mainImage: req.body.mainImage ?? db.products[index].mainImage,
    galleryImages: Array.isArray(req.body.galleryImages) ? req.body.galleryImages : db.products[index].galleryImages,
    isFeatured: req.body.isFeatured !== undefined ? !!req.body.isFeatured : db.products[index].isFeatured,
    isHotDeal: req.body.isHotDeal !== undefined ? !!req.body.isHotDeal : db.products[index].isHotDeal,
    isRecommended: req.body.isRecommended !== undefined ? !!req.body.isRecommended : db.products[index].isRecommended,
    status: req.body.status ?? db.products[index].status
  };
  writeDB(db);
  res.json(db.products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const db = readDB();
  const filtered = db.products.filter(p => p.id !== req.params.id);
  if (filtered.length === db.products.length) {
    return res.status(404).json({ error: "Product not found" });
  }
  db.products = filtered;
  writeDB(db);
  res.json({ success: true, message: "Product deleted" });
});

// Category Routes
app.get('/api/categories', (req, res) => {
  const db = readDB();
  res.json(db.categories);
});

app.post('/api/categories', (req, res) => {
  const db = readDB();
  const baseId = req.body.name ? req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'cat_' + Math.random().toString(36).substr(2, 9);
  let id = baseId;
  let counter = 1;
  while (db.categories.some(c => c.id === id)) {
    id = `${baseId}-${counter++}`;
  }
  const newCat: Category = {
    id,
    name: req.body.name || 'New Category',
    description: req.body.description || ''
  };
  db.categories.push(newCat);
  writeDB(db);
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', (req, res) => {
  const db = readDB();
  const index = db.categories.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Category not found" });
  }
  db.categories[index] = {
    ...db.categories[index],
    name: req.body.name ?? db.categories[index].name,
    description: req.body.description ?? db.categories[index].description
  };
  writeDB(db);
  res.json(db.categories[index]);
});

app.delete('/api/categories/:id', (req, res) => {
  const db = readDB();
  db.categories = db.categories.filter(c => c.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: "Category deleted" });
});

// Services Routes
app.get('/api/services', (req, res) => {
  const db = readDB();
  res.json(db.services);
});

app.post('/api/services', (req, res) => {
  const db = readDB();
  const newService: Service = {
    id: 'srv_' + Math.random().toString(36).substr(2, 9),
    name: req.body.name || 'New Service',
    description: req.body.description || '',
    images: Array.isArray(req.body.images) ? req.body.images : [],
    isFeatured: !!req.body.isFeatured
  };
  db.services.push(newService);
  writeDB(db);
  res.status(201).json(newService);
});

app.put('/api/services/:id', (req, res) => {
  const db = readDB();
  const index = db.services.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(444).json({ error: "Service not found" });
  }
  db.services[index] = {
    ...db.services[index],
    name: req.body.name ?? db.services[index].name,
    description: req.body.description ?? db.services[index].description,
    images: Array.isArray(req.body.images) ? req.body.images : db.services[index].images,
    isFeatured: req.body.isFeatured !== undefined ? !!req.body.isFeatured : db.services[index].isFeatured
  };
  writeDB(db);
  res.json(db.services[index]);
});

app.delete('/api/services/:id', (req, res) => {
  const db = readDB();
  db.services = db.services.filter(s => s.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// Homepage Slide Routes
app.get('/api/slides', (req, res) => {
  const db = readDB();
  res.json(db.homepageSlides);
});

app.post('/api/slides', (req, res) => {
  const db = readDB();
  const newSlide: HomepageSlide = {
    id: 'slide_' + Math.random().toString(36).substr(2, 9),
    title: req.body.title || '',
    subtitle: req.body.subtitle || '',
    image: req.body.image || '',
    link: req.body.link || '',
    order: Number(req.body.order || db.homepageSlides.length + 1)
  };
  db.homepageSlides.push(newSlide);
  db.homepageSlides.sort((a, b) => a.order - b.order);
  writeDB(db);
  res.status(201).json(newSlide);
});

app.put('/api/slides/:id', (req, res) => {
  const db = readDB();
  const index = db.homepageSlides.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Slide not found" });
  }
  db.homepageSlides[index] = {
    ...db.homepageSlides[index],
    title: req.body.title ?? db.homepageSlides[index].title,
    subtitle: req.body.subtitle ?? db.homepageSlides[index].subtitle,
    image: req.body.image ?? db.homepageSlides[index].image,
    link: req.body.link ?? db.homepageSlides[index].link,
    order: req.body.order !== undefined ? Number(req.body.order) : db.homepageSlides[index].order
  };
  db.homepageSlides.sort((a, b) => a.order - b.order);
  writeDB(db);
  res.json(db.homepageSlides[index]);
});

app.delete('/api/slides/:id', (req, res) => {
  const db = readDB();
  db.homepageSlides = db.homepageSlides.filter(s => s.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// Settings / Profile / Socials CRUD
app.get('/api/settings', (req, res) => {
  const db = readDB();
  res.json(db.settings);
});

app.post('/api/settings', (req, res) => {
  const db = readDB();
  db.settings = {
    ...db.settings,
    profile: req.body.profile ? { ...db.settings.profile, ...req.body.profile } : db.settings.profile,
    social: req.body.social ? { ...db.settings.social, ...req.body.social } : db.settings.social,
    about: req.body.about ? { ...db.settings.about, ...req.body.about } : db.settings.about,
    contact: req.body.contact ? { ...db.settings.contact, ...req.body.contact } : db.settings.contact,
    privacyPolicy: req.body.privacyPolicy ?? db.settings.privacyPolicy,
    termsConditions: req.body.termsConditions ?? db.settings.termsConditions
  };
  writeDB(db);
  res.json(db.settings);
});

// Admin Authentication Route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Standard simple admin logins - easily configured
  if (email === 'admin@augustingarden.com' && password === 'admin123') {
    res.json({
      success: true,
      token: "augustin-garden-admin-token-2026",
      profile: {
        name: "Augustin Ndayisaba",
        email: "info@augustingarden.com"
      }
    });
  } else {
    res.status(401).json({ success: false, error: "Invalid admin credentials. Use admin@augustingarden.com / admin123" });
  }
});

// Base64 file upload route (stores locally in public/uploads and returns full link path)
app.post('/api/upload', (req, res) => {
  try {
    const { file, name } = req.body;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Strip header from base64 string
    const base64Data = file.replace(/^data:image\/\w+;base64,/, "");
    const ext = name ? path.extname(name) : '.jpg';
    const filename = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, base64Data, 'base64');
    
    // Return relative path
    res.json({ url: `/uploads/${filename}` });
  } catch (error: any) {
    console.error("Upload error", error);
    res.status(500).json({ error: error.message || "Failed to upload image" });
  }
});

// Serve static uploads
app.use('/uploads', express.Router().get('/:filename', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
}));

// Vite Setup for Dev vs Prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Augustin Garden server is running on http://localhost:${PORT}`);
  });
}

startServer();
