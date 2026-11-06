import { 
  Product, 
  CategoryInfo, 
  InventoryMovement, 
  StoreSettings, 
  WhatsAppInquiry,
  ProductCategory,
  AvailabilityStatus
} from '../types';

import { storageAdapter } from './storageAdapter';

const STORAGE_KEY_PRODUCTS = 'youppi_products_v1';
const STORAGE_KEY_SETTINGS = 'youppi_settings_v1';
const STORAGE_KEY_MOVEMENTS = 'youppi_movements_v1';
const STORAGE_KEY_INQUIRIES = 'youppi_inquiries_v1';

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    id: 'laptops',
    slug: 'laptops',
    nameFr: 'PC Portables',
    nameAr: 'الحواسيب المحمولة',
    nameEn: 'Laptops',
    descriptionFr: 'Large sélection de laptops bureautiques, étudiants et polyvalents.',
    descriptionAr: 'تشكيلة واسعة من اللابتوبات المكتبية وللدراسة والأعمال.',
    descriptionEn: 'Wide selection of general, office and versatile laptops.',
    iconName: 'Laptop',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'business-laptops',
    slug: 'business-laptops',
    nameFr: 'Laptops Professionnels',
    nameAr: 'لابتوبات الأعمال الاحترافية',
    nameEn: 'Business Laptops',
    descriptionFr: 'ThinkPad, Latitude, EliteBook robustes conçus pour durer.',
    descriptionAr: 'حواسيب قوية وموثوقة مثل ThinkPad و Latitude و EliteBook.',
    descriptionEn: 'Rugged enterprise-grade ThinkPads, Latitudes, and EliteBooks.',
    iconName: 'Briefcase',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'gaming-laptops',
    slug: 'gaming-laptops',
    nameFr: 'Laptops Gaming',
    nameAr: 'لابتوبات الألعاب والمونتاج',
    nameEn: 'Gaming Laptops',
    descriptionFr: 'Puissance graphique embarquée pour les jeux récents et le rendu 3D.',
    descriptionAr: 'أجهزة محمولة بكروت شاشة قوية للألعاب وصناعة المحتوى.',
    descriptionEn: 'Dedicated GPU laptops built for esports and heavy content creation.',
    iconName: 'Gamepad2',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'desktop-pc',
    slug: 'desktop-pc',
    nameFr: 'PC Bureautique & Workstations',
    nameAr: 'حواسيب مكتبية ومحطات عمل',
    nameEn: 'Desktop Computers',
    descriptionFr: 'Unités centrales silencieuses et fiables pour les bureaux et ateliers.',
    descriptionAr: 'وحدات معالجة مركزية موثوقة وهادئة للمكاتب والمتاجر.',
    descriptionEn: 'Reliable and quiet tower PCs for office work and engineering.',
    iconName: 'MonitorDot',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'gaming-pc',
    slug: 'gaming-pc',
    nameFr: 'Tours & PC Gamer',
    nameAr: 'حواسيب ألعاب مجمعة (PC Gamer)',
    nameEn: 'Custom Gaming PCs',
    descriptionFr: 'Configurations gaming sur mesure testées sur benchmarks rigoureux.',
    descriptionAr: 'تجميعات ألعاب قوية ومجربة على أعلى برامج قياس الأداء.',
    descriptionEn: 'Custom battle stations stress-tested with modern AAA titles.',
    iconName: 'Cpu',
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 'gpus',
    slug: 'gpus',
    nameFr: 'Cartes Graphiques',
    nameAr: 'كروت الشاشة (GPU)',
    nameEn: 'Graphics Cards',
    descriptionFr: 'NVIDIA GeForce RTX et AMD Radeon pour gaming et intelligence artificielle.',
    descriptionAr: 'كروت شاشة نفيديا وراديون للألعاب والذكاء الاصطناعي.',
    descriptionEn: 'NVIDIA GeForce RTX and AMD Radeon graphics processors.',
    iconName: 'Layers',
    sortOrder: 6,
    isActive: true,
  },
  {
    id: 'ram-ssd',
    slug: 'ram-ssd',
    nameFr: 'RAM & SSD',
    nameAr: 'الذواكر ووحدات التخزين',
    nameEn: 'RAM & SSD Storage',
    descriptionFr: 'M.2 NVMe PCIe 4.0 ultra-rapides et barrettes DDR4/DDR5 certifiées.',
    descriptionAr: 'أقراص تخزين سريعة NVMe ورامات DDR4/DDR5 عالية السرعة.',
    descriptionEn: 'Ultra-fast NVMe M.2 SSDs and high-frequency RAM kits.',
    iconName: 'HardDrive',
    sortOrder: 7,
    isActive: true,
  },
  {
    id: 'monitors',
    slug: 'monitors',
    nameFr: 'Écrans & Moniteurs',
    nameAr: 'الشاشات الاحترافية',
    nameEn: 'Monitors',
    descriptionFr: 'Écrans haute fidélité pour le graphisme, l’e-sport et la bureautique.',
    descriptionAr: 'شاشات بدقة وألوان عالية للمصممين ومحبي الألعاب.',
    descriptionEn: 'High-refresh rate gaming screens and color-accurate IPS panels.',
    iconName: 'Tv',
    sortOrder: 8,
    isActive: true,
  },
  {
    id: 'peripherals',
    slug: 'peripherals',
    nameFr: 'Périphériques & Claviers',
    nameAr: 'لوحات المفاتيح والفأرات',
    nameEn: 'Keyboards & Mice',
    descriptionFr: 'Claviers mécaniques, souris sans fil gaming et casques audio.',
    descriptionAr: 'لوحات مفاتيح ميكانيكية وفأرات ألعاب دقيقة.',
    descriptionEn: 'Mechanical keyboards, lightweight gaming mice and headsets.',
    iconName: 'Keyboard',
    sortOrder: 9,
    isActive: true,
  },
  {
    id: 'accessories',
    slug: 'accessories',
    nameFr: 'Accessoires & Chargeurs',
    nameAr: 'الشواحن والملحقات',
    nameEn: 'Accessories & Chargers',
    descriptionFr: 'Chargeurs Type-C originaux, stations d’accueil et sacoches.',
    descriptionAr: 'شواحن أصلية Type-C وحقائب لابتوب وموزعات منافذ.',
    descriptionEn: 'Original OEM chargers, USB-C docks, and laptop sleeves.',
    iconName: 'PlugZap',
    sortOrder: 10,
    isActive: true,
  },
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'YOUPPI INFO',
  phone: '0555 12 34 56',
  whatsappNumber: '213555123456', // Valid normalized international number for Algeria
  defaultLanguage: 'fr',
  currency: 'DZD',
  address: 'Rue Didouche Mourad, Alger Centre, Algérie',
  addressAr: 'شارع ديدوش مراد، الجزائر الوسطى، الجزائر',
  openingHours: 'Samedi – Jeudi : 09h30 à 18h30 (Fermé le Vendredi)',
  openingHoursAr: 'السبت – الخميس: من 09:30 صباحاً إلى 18:30 مساءً (الجمعة عطلة)',
  announcementText: 'Bienvenue sur YOUPPI INFO !',
  announcementTextAr: 'مرحباً بكم في يوبي إنفو !',
  isAnnouncementEnabled: false,
  lowStockThresholdDefault: 2,
  enableInquiryTracking: true,
  socialFacebook: '',
  socialInstagram: '',
  socialTiktok: '',
};

export const INITIAL_PRODUCTS: Product[] = [];

class StoreService {
  private products: Product[] = [];
  private settings: StoreSettings = INITIAL_SETTINGS;
  private movements: InventoryMovement[] = [];
  private inquiries: WhatsAppInquiry[] = [];
  private subscribers: Array<() => void> = [];
  private isHydrated: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    // 0. Clean legacy nexbyte keys from localStorage if present
    try {
      localStorage.removeItem('nexbyte_products_v1');
      localStorage.removeItem('nexbyte_movements_v1');
      localStorage.removeItem('nexbyte_inquiries_v1');
      localStorage.removeItem('nexbyte_settings_v1');
    } catch {
      // ignore
    }

    // 1. Fast synchronous hydration from localStorage
    const savedProducts = storageAdapter.safeGetLocalStorage(STORAGE_KEY_PRODUCTS);
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        this.products = Array.isArray(parsed) ? parsed.filter(p => !p.isDemo) : [];
      } catch {
        this.products = [];
      }
    } else {
      this.products = [];
    }

    // Load settings
    const savedSettings = storageAdapter.safeGetLocalStorage(STORAGE_KEY_SETTINGS);
    if (savedSettings) {
      try {
        this.settings = { ...INITIAL_SETTINGS, ...JSON.parse(savedSettings) };
      } catch {
        this.settings = { ...INITIAL_SETTINGS };
      }
    } else {
      this.settings = { ...INITIAL_SETTINGS };
    }

    // Load movements
    const savedMovements = storageAdapter.safeGetLocalStorage(STORAGE_KEY_MOVEMENTS);
    if (savedMovements) {
      try {
        this.movements = JSON.parse(savedMovements);
      } catch {
        this.movements = [];
      }
    } else {
      this.movements = [];
    }

    // Load inquiries
    const savedInquiries = storageAdapter.safeGetLocalStorage(STORAGE_KEY_INQUIRIES);
    if (savedInquiries) {
      try {
        this.inquiries = JSON.parse(savedInquiries);
      } catch {
        this.inquiries = [];
      }
    } else {
      this.inquiries = [];
    }

    // 2. Asynchronous IndexedDB hydration (loads full-fidelity products and images without quota limit)
    this.hydrateFromIndexedDb();
  }

  private async hydrateFromIndexedDb() {
    try {
      const idbProducts = await storageAdapter.getIdbItem<Product[]>(STORAGE_KEY_PRODUCTS);
      if (idbProducts && Array.isArray(idbProducts)) {
        this.products = idbProducts.filter(p => !p.isDemo);
        this.isHydrated = true;
        this.notifySubscribers();
      }

      // Also hydrate settings and movements if available
      const idbSettings = await storageAdapter.getIdbItem<StoreSettings>(STORAGE_KEY_SETTINGS);
      if (idbSettings) {
        this.settings = { ...INITIAL_SETTINGS, ...idbSettings };
      }

      const idbMovements = await storageAdapter.getIdbItem<InventoryMovement[]>(STORAGE_KEY_MOVEMENTS);
      if (idbMovements && Array.isArray(idbMovements)) {
        this.movements = idbMovements;
      }
    } catch (err) {
      console.warn('Background IndexedDB sync completed with warning:', err);
    }
  }

  public subscribe(fn: () => void): () => void {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== fn);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error('Subscriber callback error:', e);
      }
    });
  }

  private saveProducts() {
    // 1. Asynchronously persist full products & high-res images in IndexedDB (GB capacity)
    storageAdapter.setIdbItem(STORAGE_KEY_PRODUCTS, this.products);

    // 2. Synchronously persist in localStorage with automatic quota protection & pruning
    storageAdapter.safeSetLocalStorage(STORAGE_KEY_PRODUCTS, JSON.stringify(this.products));

    // 3. Notify any reactive components
    this.notifySubscribers();
  }

  private saveSettings() {
    storageAdapter.setIdbItem(STORAGE_KEY_SETTINGS, this.settings);
    storageAdapter.safeSetLocalStorage(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
    this.notifySubscribers();
  }

  private saveMovements() {
    const trimmed = this.movements.slice(0, 150);
    storageAdapter.setIdbItem(STORAGE_KEY_MOVEMENTS, trimmed);
    storageAdapter.safeSetLocalStorage(STORAGE_KEY_MOVEMENTS, JSON.stringify(trimmed));
    this.notifySubscribers();
  }

  private saveInquiries() {
    const trimmed = this.inquiries.slice(0, 150);
    storageAdapter.setIdbItem(STORAGE_KEY_INQUIRIES, trimmed);
    storageAdapter.safeSetLocalStorage(STORAGE_KEY_INQUIRIES, JSON.stringify(trimmed));
    this.notifySubscribers();
  }

  // Sanitize product for public consumption (remove private cost and internal notes)
  private sanitizeForPublic(p: Product): Product {
    const { purchaseCostDzd, internalNotes, ...publicProduct } = p;
    return publicProduct as Product;
  }

  // PRODUCTS
  public getProducts(options?: {
    category?: string;
    brand?: string;
    condition?: string;
    status?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    onlyAvailable?: boolean;
    isFeatured?: boolean;
    isOffer?: boolean;
    sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'featured';
    isAdmin?: boolean;
  }): Product[] {
    let list = [...this.products];

    if (options?.category && options.category !== 'all') {
      list = list.filter(p => p.category === options.category);
    }

    if (options?.brand && options.brand !== 'all') {
      list = list.filter(p => p.brand.toLowerCase() === options.brand!.toLowerCase());
    }

    if (options?.condition && options.condition !== 'all') {
      list = list.filter(p => p.condition === options.condition);
    }

    if (options?.status && options.status !== 'all') {
      list = list.filter(p => p.status === options.status);
    }

    if (options?.onlyAvailable) {
      list = list.filter(p => p.status === 'available' && p.stockQuantity > 0);
    }

    if (options?.isFeatured) {
      list = list.filter(p => p.isFeatured);
    }

    if (options?.isOffer) {
      list = list.filter(p => p.isOffer);
    }

    if (typeof options?.minPrice === 'number' && options.minPrice > 0) {
      list = list.filter(p => p.priceDzd >= options.minPrice!);
    }

    if (typeof options?.maxPrice === 'number' && options.maxPrice > 0) {
      list = list.filter(p => p.priceDzd <= options.maxPrice!);
    }

    if (options?.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(p => {
        const titleMatch = p.name.toLowerCase().includes(q) || (p.nameAr && p.nameAr.includes(q));
        const skuMatch = p.sku.toLowerCase().includes(q);
        const brandMatch = p.brand.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const cpuMatch = p.specifications.cpu?.toLowerCase().includes(q);
        const gpuMatch = p.specifications.gpu?.toLowerCase().includes(q);
        return titleMatch || skuMatch || brandMatch || descMatch || cpuMatch || gpuMatch;
      });
    }

    // Sort
    const sort = options?.sortBy || 'newest';
    if (sort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'price_asc') {
      list.sort((a, b) => a.priceDzd - b.priceDzd);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.priceDzd - a.priceDzd);
    } else if (sort === 'featured') {
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    if (!options?.isAdmin) {
      return list.map(p => this.sanitizeForPublic(p));
    }

    return list;
  }

  public getProductBySlug(slug: string, isAdmin = false): Product | null {
    const p = this.products.find(item => item.slug === slug);
    if (!p) return null;
    return isAdmin ? p : this.sanitizeForPublic(p);
  }

  public getProductById(id: string, isAdmin = false): Product | null {
    const p = this.products.find(item => item.id === id);
    if (!p) return null;
    return isAdmin ? p : this.sanitizeForPublic(p);
  }

  public createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const id = 'prod-' + Date.now();
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id,
      publishedAt: data.publishedAt || now,
      createdAt: now,
      updatedAt: now,
    };

    this.products.unshift(newProduct);
    this.saveProducts();

    // Record initial inventory movement if quantity > 0
    if (newProduct.stockQuantity > 0) {
      this.recordMovement({
        productId: newProduct.id,
        productName: newProduct.name,
        productSku: newProduct.sku,
        movementType: 'stock_in',
        quantityDelta: newProduct.stockQuantity,
        resultingQuantity: newProduct.stockQuantity,
        reason: 'Création initiale du produit',
        createdBy: 'Admin YOUPPI',
      });
    }

    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const oldProduct = this.products[idx];
    const updated: Product = {
      ...oldProduct,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // If stock quantity changed directly through update
    if (typeof updates.stockQuantity === 'number' && updates.stockQuantity !== oldProduct.stockQuantity) {
      const delta = updates.stockQuantity - oldProduct.stockQuantity;
      this.recordMovement({
        productId: updated.id,
        productName: updated.name,
        productSku: updated.sku,
        movementType: delta > 0 ? 'stock_in' : 'adjustment',
        quantityDelta: delta,
        resultingQuantity: updated.stockQuantity,
        reason: 'Mise à jour directe de la fiche produit',
        createdBy: 'Admin YOUPPI',
      });
    }

    // Automatically change status if stock hits 0
    if (updated.stockQuantity === 0 && updated.status === 'available') {
      updated.status = 'sold';
    } else if (updated.stockQuantity > 0 && updated.status === 'sold') {
      updated.status = 'available';
    }

    this.products[idx] = updated;
    this.saveProducts();
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return false;

    const p = this.products[idx];
    this.products.splice(idx, 1);
    this.saveProducts();

    this.recordMovement({
      productId: id,
      productName: p.name,
      productSku: p.sku,
      movementType: 'stock_out',
      quantityDelta: -p.stockQuantity,
      resultingQuantity: 0,
      reason: 'Suppression définitive du produit du catalogue',
      createdBy: 'Admin YOUPPI',
    });

    return true;
  }

  public duplicateProduct(id: string): Product | null {
    const original = this.products.find(p => p.id === id);
    if (!original) return null;

    const newSku = `${original.sku}-COPY-${Math.floor(Math.random() * 900 + 100)}`;
    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;

    const { id: _, createdAt, updatedAt, ...rest } = original;
    return this.createProduct({
      ...rest,
      name: `${original.name} (Copie)`,
      sku: newSku,
      slug: newSlug,
      stockQuantity: 1,
      status: 'available',
    });
  }

  // INVENTORY ADJUSTMENT
  public adjustStock(
    productId: string,
    delta: number,
    reason: string,
    type: 'stock_in' | 'stock_out' | 'sale' | 'reservation' | 'adjustment' | 'return' = 'adjustment',
    reference?: string
  ): Product | null {
    const product = this.products.find(p => p.id === productId);
    if (!product) return null;

    const newQty = Math.max(0, product.stockQuantity + delta);
    let newStatus: AvailabilityStatus = product.status;

    if (newQty === 0) {
      newStatus = 'sold';
    } else if (type === 'reservation') {
      newStatus = 'reserved';
    } else if (product.status === 'sold' && newQty > 0) {
      newStatus = 'available';
    }

    product.stockQuantity = newQty;
    product.status = newStatus;
    product.updatedAt = new Date().toISOString();
    this.saveProducts();

    this.recordMovement({
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      movementType: type,
      quantityDelta: delta,
      resultingQuantity: newQty,
      reason,
      reference,
      createdBy: 'Admin YOUPPI',
    });

    return product;
  }

  private recordMovement(entry: Omit<InventoryMovement, 'id' | 'createdAt'>) {
    const movement: InventoryMovement = {
      ...entry,
      id: 'mov-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };
    this.movements.unshift(movement);
    if (this.movements.length > 500) {
      this.movements = this.movements.slice(0, 500);
    }
    this.saveMovements();
  }

  public getInventoryMovements(): InventoryMovement[] {
    return [...this.movements];
  }

  // INQUIRIES
  public recordInquiry(params: {
    productId: string;
    productName: string;
    productSku: string;
    priceDzd: number;
    sourcePage: string;
    language: 'fr' | 'ar' | 'en';
  }) {
    if (!this.settings.enableInquiryTracking) return;

    const item: WhatsAppInquiry = {
      id: 'inq-' + Date.now(),
      ...params,
      createdAt: new Date().toISOString(),
    };
    this.inquiries.unshift(item);
    if (this.inquiries.length > 500) {
      this.inquiries = this.inquiries.slice(0, 500);
    }
    this.saveInquiries();
  }

  public getInquiries(): WhatsAppInquiry[] {
    return [...this.inquiries];
  }

  // CATEGORIES
  public getCategories(): CategoryInfo[] {
    return [...CATEGORIES_DATA].filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public getCategoryBySlug(slug: string): CategoryInfo | undefined {
    return CATEGORIES_DATA.find(c => c.slug === slug);
  }

  // SETTINGS
  public getSettings(): StoreSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
    return { ...this.settings };
  }

  // DASHBOARD METRICS
  public getDashboardMetrics() {
    const total = this.products.length;
    const available = this.products.filter(p => p.status === 'available' && p.stockQuantity > 0).length;
    const reserved = this.products.filter(p => p.status === 'reserved').length;
    const sold = this.products.filter(p => p.status === 'sold' || p.stockQuantity === 0).length;
    const lowStock = this.products.filter(p => p.status === 'available' && p.stockQuantity <= p.lowStockThreshold).length;

    const totalInventoryValue = this.products
      .filter(p => p.status === 'available')
      .reduce((acc, p) => acc + p.priceDzd * p.stockQuantity, 0);

    const totalCostValue = this.products
      .filter(p => p.status === 'available')
      .reduce((acc, p) => acc + (p.purchaseCostDzd || 0) * p.stockQuantity, 0);

    return {
      totalProducts: total,
      availableProducts: available,
      reservedProducts: reserved,
      soldProducts: sold,
      lowStockProducts: lowStock,
      totalInventoryValueDzd: totalInventoryValue,
      totalCostValueDzd: totalCostValue,
      totalInquiriesCount: this.inquiries.length,
    };
  }

  // BACKUP & EXPORT
  public exportDatabaseJson(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        store: 'YOUPPI INFO',
        version: '1.0',
        settings: this.settings,
        products: this.products,
        movements: this.movements,
        inquiries: this.inquiries,
      },
      null,
      2
    );
  }

  public importDatabaseJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.products)) {
        this.products = data.products;
        this.saveProducts();
      }
      if (data.settings && typeof data.settings === 'object') {
        this.settings = { ...INITIAL_SETTINGS, ...data.settings };
        this.saveSettings();
      }
      if (Array.isArray(data.movements)) {
        this.movements = data.movements;
        this.saveMovements();
      }
      if (Array.isArray(data.inquiries)) {
        this.inquiries = data.inquiries;
        this.saveInquiries();
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  public resetToSeedData() {
    this.products = [];
    this.movements = [];
    this.inquiries = [];
    this.saveProducts();
    this.saveMovements();
    this.saveInquiries();
  }
}

export const storeService = new StoreService();
