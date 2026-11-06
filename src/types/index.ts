export type Language = 'fr' | 'ar' | 'en';

export type ProductCondition = 'used' | 'refurbished' | 'new';
export type AvailabilityStatus = 'available' | 'reserved' | 'sold';

export type ProductCategory = 
  | 'laptops'
  | 'business-laptops'
  | 'gaming-laptops'
  | 'desktop-pc'
  | 'gaming-pc'
  | 'gpus'
  | 'cpu-motherboard'
  | 'ram-ssd'
  | 'monitors'
  | 'peripherals'
  | 'accessories';

export interface LaptopSpecifications {
  cpu?: string;
  ram?: string;
  storage?: string;
  gpu?: string;
  screen?: string;
  batteryHealth?: string;
  keyboardLayout?: string;
  chargerIncluded?: boolean;
  cosmeticCondition?: 'grade-a' | 'grade-b' | 'grade-c';
  knownDefects?: string;
  warrantyPeriod?: string;
}

export interface DesktopSpecifications {
  cpu?: string;
  gpu?: string;
  motherboard?: string;
  ram?: string;
  storage?: string;
  psu?: string;
  cooling?: string;
  caseModel?: string;
  peripheralsIncluded?: string;
}

export interface ComponentSpecifications {
  manufacturer?: string;
  exactModel?: string;
  compatibility?: string;
  physicalCondition?: string;
  includedAccessories?: string;
  warrantyPeriod?: string;
}

export type ProductSpecifications = LaptopSpecifications & DesktopSpecifications & ComponentSpecifications;

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  nameAr?: string;
  brand: string;
  category: ProductCategory;
  condition: ProductCondition;
  priceDzd: number;
  originalPriceDzd?: number;
  purchaseCostDzd?: number; // Private field - hidden from public API/views
  stockQuantity: number;
  lowStockThreshold: number;
  status: AvailabilityStatus;
  description: string;
  descriptionAr?: string;
  specifications: ProductSpecifications;
  images: ProductImage[];
  isFeatured: boolean;
  isOffer: boolean;
  internalNotes?: string; // Private field
  isDemo?: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInfo {
  id: ProductCategory;
  slug: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
  sortOrder: number;
  isActive: boolean;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  movementType: 'stock_in' | 'stock_out' | 'sale' | 'reservation' | 'adjustment' | 'return';
  quantityDelta: number;
  resultingQuantity: number;
  reason: string;
  reference?: string;
  createdBy: string;
  createdAt: string;
}

export interface WhatsAppInquiry {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  priceDzd: number;
  sourcePage: string;
  language: Language;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  whatsappNumber: string; // international normalized format e.g. 213555123456
  defaultLanguage: Language;
  currency: string;
  address: string;
  addressAr: string;
  openingHours: string;
  openingHoursAr: string;
  announcementText: string;
  announcementTextAr: string;
  isAnnouncementEnabled: boolean;
  lowStockThresholdDefault: number;
  enableInquiryTracking: boolean;
  socialFacebook?: string;
  socialInstagram?: string;
  socialTiktok?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  role: 'super_admin' | 'inventory_manager' | 'inventory_clerk';
  lastLogin?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  wilaya?: string;
  address?: string;
  avatar?: string;
  role: 'customer' | 'admin';
}

export interface CartItem {
  id: string; // unique cart item id (e.g. prodId + variant)
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSpec?: string;
  addedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productSku: string;
  image: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSpec?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    wilaya: string;
    commune: string;
    address: string;
    deliveryType: 'home' | 'desk';
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'cod' | 'baridimob' | 'card';
  paymentStatus: 'pending' | 'simulated_success';
  orderStatus: 'confirmed' | 'processing' | 'shipped' | 'delivered';
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

