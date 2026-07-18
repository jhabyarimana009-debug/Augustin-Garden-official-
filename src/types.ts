export interface Product {
  id: string;
  name: string;
  category: string;
  price?: number;
  shortDescription: string;
  fullDescription: string;
  mainImage: string;
  galleryImages: string[];
  isFeatured: boolean;
  isHotDeal: boolean;
  isRecommended: boolean;
  dateUploaded: string;
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  images: string[];
  isFeatured: boolean;
}

export interface HomepageSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  order: number;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
}

export interface AboutData {
  story: string;
  mission: string;
  vision: string;
  values: string[];
  experience: string;
  promise: string;
}

export interface ContactData {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  businessHours: string;
  googleMapEmbed: string;
}

export interface AdminProfile {
  ownerName: string;
  ownerPhoto: string;
  businessName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  location: string;
}

export interface WebsiteSettings {
  profile: AdminProfile;
  social: SocialLinks;
  about: AboutData;
  contact: ContactData;
  privacyPolicy: string;
  termsConditions: string;
}

export interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  services: Service[];
  homepageSlides: HomepageSlide[];
  settings: WebsiteSettings;
}
