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

import heroWorkstationImg from '../assets/images/hero_laptop_workstation_1792262364586.jpg';
import thinkpadImg from '../assets/images/product_thinkpad_laptop_1792262364339.jpg';
import gamingPcImg from '../assets/images/product_gaming_pc_rig_1792262364893.jpg';
import gpuComponentImg from '../assets/images/product_gpu_component_1792262365283.jpg';

const STORAGE_KEY_PRODUCTS = 'nexbyte_products_v1';
const STORAGE_KEY_SETTINGS = 'nexbyte_settings_v1';
const STORAGE_KEY_MOVEMENTS = 'nexbyte_movements_v1';
const STORAGE_KEY_INQUIRIES = 'nexbyte_inquiries_v1';

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
  announcementText: 'Nouveaux arrivages disponibles : Laptops ThinkPad testés & Cartes graphiques RTX en stock !',
  announcementTextAr: 'وصول دفعة جديدة من لابتوبات ThinkPad المفحوصة وكروت شاشة RTX !',
  isAnnouncementEnabled: true,
  lowStockThresholdDefault: 2,
  enableInquiryTracking: true,
  socialFacebook: 'https://facebook.com/nexbytedz',
  socialInstagram: 'https://instagram.com/nexbytedz',
  socialTiktok: 'https://tiktok.com/@nexbytedz',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-thinkpad-t14',
    sku: 'NB-LPT-001',
    slug: 'lenovo-thinkpad-t14-gen-2-i7-16gb',
    name: 'Lenovo ThinkPad T14 Gen 2 (Core i7 / 16GB / 512GB)',
    nameAr: 'لينوفو ثينك باد T14 الجيل الثاني (Core i7 / 16GB / 512GB)',
    brand: 'Lenovo',
    category: 'business-laptops',
    condition: 'refurbished',
    priceDzd: 78000,
    originalPriceDzd: 85000,
    purchaseCostDzd: 58000,
    stockQuantity: 4,
    lowStockThreshold: 2,
    status: 'available',
    description: 'Ultraportable professionnel de référence. Châssis en polymère renforcé de fibres de verre, clavier anti-éclaboussures légendaire et sécurité matérielle ThinkShield.',
    descriptionAr: 'حاسوب أعمال فائق التحمل من الفئة الأولى. هيكل مدعم بألياف الكربون، لوحة مفاتيح أسطورية مريحة للكتابة، ومعالج قوي للأداء اليومي.',
    specifications: {
      cpu: 'Intel Core i7-1165G7 (4 Cores, 8 Threads, jusqu’à 4.70 GHz)',
      ram: '16 Go DDR4 3200MHz (extensible à 48 Go)',
      storage: '512 Go SSD M.2 PCIe NVMe',
      gpu: 'Intel Iris Xe Graphics G7',
      screen: '14.0" Full HD (1920x1080) IPS Antireflet 300 nits',
      batteryHealth: '94% d’autonomie résiduelle (environ 6-7h en usage bureautique)',
      keyboardLayout: 'AZERTY Français d’origine rétroéclairé',
      chargerIncluded: true,
      cosmeticCondition: 'grade-a',
      knownDefects: 'Légères micro-rayures superficielles sous le châssis inférieur, écran et repose-poignets impeccables.',
      warrantyPeriod: 'Garantie test matériel 30 jours',
    },
    images: [
      {
        id: 'img-tp-1',
        url: thinkpadImg,
        altText: 'Lenovo ThinkPad T14 Gen 2 vue ouverte',
        isPrimary: true,
        sortOrder: 1,
      },
      {
        id: 'img-tp-2',
        url: heroWorkstationImg,
        altText: 'Lenovo ThinkPad T14 poste de travail',
        isPrimary: false,
        sortOrder: 2,
      },
    ],
    isFeatured: true,
    isOffer: true,
    internalNotes: 'Lot provenant d’un parc d’entreprise en Suisse. Pâte thermique neuve Thermal Grizzly Kryonaut appliquée.',
    isDemo: true,
    publishedAt: '2026-10-10T10:00:00Z',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-15T12:00:00Z',
  },
  {
    id: 'prod-dell-latitude-7420',
    sku: 'NB-LPT-002',
    slug: 'dell-latitude-7420-carbon-i5-16gb',
    name: 'Dell Latitude 7420 Carbon Fiber (Core i5 / 16GB / 256GB)',
    nameAr: 'ديل لاتيتيود 7420 فايبر كربون (Core i5 / 16GB / 256GB)',
    brand: 'Dell',
    category: 'business-laptops',
    condition: 'used',
    priceDzd: 62000,
    originalPriceDzd: 68000,
    purchaseCostDzd: 47000,
    stockQuantity: 3,
    lowStockThreshold: 1,
    status: 'available',
    description: 'Châssis compact haut de gamme en fibre de carbone tressée. Écran ultra-lumineux et connectique complète avec 2 ports Thunderbolt 4.',
    descriptionAr: 'لابتوب نحيف وخفيف الوزن بهيكل كربون فايبر فاخر. مزود بمنافذ ثاندربولت 4 الحديثة وبطارية ممتازة.',
    specifications: {
      cpu: 'Intel Core i5-1145G7 vPro (4 Cores, 8 Threads, jusqu’à 4.40 GHz)',
      ram: '16 Go LPDDR4x 4267MHz soudée',
      storage: '256 Go SSD M.2 NVMe Classe 35 (mise à niveau 512 Go possible sur demande)',
      gpu: 'Intel Iris Xe Graphics',
      screen: '14.0" FHD (1920x1080) WVA ConfortView Plus 400 nits',
      batteryHealth: '88% de santé (autonomie testée : ~5h en streaming/web)',
      keyboardLayout: 'QWERTY US avec rétroéclairage',
      chargerIncluded: true,
      cosmeticCondition: 'grade-a',
      knownDefects: 'Aucun défaut mécanique ou pixel mort. Châssis très propre.',
      warrantyPeriod: 'Garantie test matériel 30 jours',
    },
    images: [
      {
        id: 'img-dell-1',
        url: thinkpadImg,
        altText: 'Dell Latitude 7420',
        isPrimary: true,
        sortOrder: 1,
      },
    ],
    isFeatured: true,
    isOffer: false,
    internalNotes: 'Matériel propre vérifié sous MemTest86 sans erreur.',
    isDemo: true,
    publishedAt: '2026-10-12T14:30:00Z',
    createdAt: '2026-10-12T14:30:00Z',
    updatedAt: '2026-10-12T14:30:00Z',
  },
  {
    id: 'prod-gaming-pc-vortex',
    sku: 'NB-DSK-001',
    slug: 'pc-gamer-vortex-horizon-i5-13400f-rtx4070',
    name: 'Tour Gaming "Vortex Horizon" (i5-13400F / RTX 4070 12GB / 32GB DDR5 / 1TB SSD)',
    nameAr: 'كمبيوتر ألعاب "فورتكس هورايزن" (i5-13400F / RTX 4070 / 32GB DDR5)',
    brand: 'YOUPPI Custom',
    category: 'gaming-pc',
    condition: 'new',
    priceDzd: 215000,
    originalPriceDzd: 235000,
    purchaseCostDzd: 182000,
    stockQuantity: 2,
    lowStockThreshold: 1,
    status: 'available',
    description: 'Configuration sur mesure pensée pour le jeu 1440p ultra à plus de 120 FPS et les calculs 3D/IA. Refroidissement liquide Watercooling 240mm et flux d’air optimisé.',
    descriptionAr: 'تجميعة ألعاب احترافية صممت لتشغيل أحدث الألعاب بدقة 2K 1440p بمعدل إطارات يتجاوز 120 FPS وبرامج المونتاج والرندر.',
    specifications: {
      cpu: 'Intel Core i5-13400F (10 Cores, 16 Threads, Max 4.60 GHz)',
      gpu: 'NVIDIA GeForce RTX 4070 12 Go GDDR6X (DLSS 3 & Ray Tracing)',
      motherboard: 'MSI B760M Gaming Plus WiFi DDR5',
      ram: '32 Go (2x16Go) Corsair Vengeance DDR5 6000MHz CL36',
      storage: '1 To Kingston KC3000 PCIe 4.0 NVMe (7000 Mo/s en lecture)',
      psu: 'DeepCool PM750D 750W 80 PLUS Gold Certifié',
      cooling: 'AIO Liquid Cooler 240mm ARGB avec pompe céramique',
      caseModel: 'Boîtier Moyen Tour verre trempé avec 4 ventilateurs PWM 120mm',
      warrantyPeriod: 'Garantie atelier 12 mois pièces et main d’œuvre',
    },
    images: [
      {
        id: 'img-vortex-1',
        url: gamingPcImg,
        altText: 'Tour PC Gamer Vortex Horizon avec éclairage interne cyan',
        isPrimary: true,
        sortOrder: 1,
      },
      {
        id: 'img-vortex-2',
        url: gpuComponentImg,
        altText: 'Carte graphique RTX installée dans le PC Gamer',
        isPrimary: false,
        sortOrder: 2,
      },
    ],
    isFeatured: true,
    isOffer: true,
    internalNotes: 'Assemblage minutieux avec câble-management propre. Windows 11 Pro préinstallé sans bloatware.',
    isDemo: true,
    publishedAt: '2026-10-14T09:15:00Z',
    createdAt: '2026-10-14T09:15:00Z',
    updatedAt: '2026-10-16T11:00:00Z',
  },
  {
    id: 'prod-gpu-rtx-4070-ti',
    sku: 'NB-GPU-001',
    slug: 'gigabyte-aorus-geforce-rtx-4070-ti-master-12g',
    name: 'Gigabyte AORUS GeForce RTX 4070 Ti Master 12G',
    nameAr: 'كرت شاشة جيجابايت أوروس RTX 4070 Ti ماستر 12GB',
    brand: 'Gigabyte',
    category: 'gpus',
    condition: 'used',
    priceDzd: 128000,
    originalPriceDzd: 139000,
    purchaseCostDzd: 104000,
    stockQuantity: 1,
    lowStockThreshold: 1,
    status: 'available',
    description: 'Le fleuron de Gigabyte. Système de refroidissement Max-Covered à 3 ventilateurs Bionic Shark, écran LCD Edge View intégré et double BIOS silencieux/performance.',
    descriptionAr: 'واحدة من أقوى نسخ كروت RTX 4070 Ti. تبريد ضخم ثلاثي المراوح وشاشة LCD جانبية لعرض درجات الحرارة.',
    specifications: {
      manufacturer: 'Gigabyte AORUS',
      exactModel: 'GV-N407TAORUS M-12GD',
      gpu: 'NVIDIA AD104 (7680 cœurs CUDA, 12 Go GDDR6X 192-bit)',
      compatibility: 'Slot PCIe 4.0 x16, Boîtier acceptant 342 mm de longueur, Alim recommandée 750W (câble 16 broches inclus)',
      physicalCondition: 'Grade A+ (aucun défaut visuel, jamais minée, températures FurMark max 62°C)',
      includedAccessories: 'Boîte d’origine, support anti-affaissement AORUS, adaptateur 2x8-pin vers 16-pin',
      warrantyPeriod: 'Garantie test 30 jours',
    },
    images: [
      {
        id: 'img-gpu-1',
        url: gpuComponentImg,
        altText: 'Carte graphique AORUS GeForce RTX 4070 Ti Master',
        isPrimary: true,
        sortOrder: 1,
      },
    ],
    isFeatured: true,
    isOffer: false,
    internalNotes: 'Client ayant fait un upgrade vers une RTX 4090. Testée 2 heures sous FurMark et 3DMark TimeSpy.',
    isDemo: true,
    publishedAt: '2026-10-13T16:00:00Z',
    createdAt: '2026-10-13T16:00:00Z',
    updatedAt: '2026-10-13T16:00:00Z',
  },
  {
    id: 'prod-asus-rog-zephyrus',
    sku: 'NB-LPT-003',
    slug: 'asus-rog-zephyrus-g14-ryzen7-rtx3060',
    name: 'ASUS ROG Zephyrus G14 (Ryzen 7 / RTX 3060 / 16GB / 1TB SSD)',
    nameAr: 'أسوس روج زيفيروس G14 (رايزن 7 / RTX 3060 / 16GB)',
    brand: 'ASUS',
    category: 'gaming-laptops',
    condition: 'used',
    priceDzd: 145000,
    originalPriceDzd: 158000,
    purchaseCostDzd: 118000,
    stockQuantity: 1,
    lowStockThreshold: 1,
    status: 'available',
    description: 'Le champion de l’autonomie et de la puissance compacte. 14 pouces seulement, moins de 1.7 kg, capable de faire tourner vos jeux en haute qualité partout où vous allez.',
    descriptionAr: 'أقوى حاسوب ألعاب مدمج وخفيف الوزن بوزن 1.7 كغ فقط. بطارية تدوم طويلاً وأداء ممتاز للألعاب والمونتاج.',
    specifications: {
      cpu: 'AMD Ryzen 7 5800HS (8 Cores, 16 Threads, 3.0 à 4.4 GHz)',
      ram: '16 Go DDR4 3200MHz Dual-Channel',
      storage: '1 To SSD M.2 NVMe',
      gpu: 'NVIDIA GeForce RTX 3060 6 Go GDDR6 (avec ROG Boost)',
      screen: '14.0" WQHD (2560x1440) 120Hz IPS 100% DCI-P3 Pantone Validated',
      batteryHealth: '89% d’état de santé (autonomie ~6h en profil éco silencieux)',
      keyboardLayout: 'QWERTY US rétroéclairé',
      chargerIncluded: true,
      cosmeticCondition: 'grade-a',
      knownDefects: 'Traces mineures de manipulation sur les coins extérieurs, touchpad et écran 100% sans défaut.',
      warrantyPeriod: 'Garantie test 30 jours',
    },
    images: [
      {
        id: 'img-rog-1',
        url: heroWorkstationImg,
        altText: 'ASUS ROG Zephyrus G14 écran allumé',
        isPrimary: true,
        sortOrder: 1,
      },
    ],
    isFeatured: true,
    isOffer: true,
    internalNotes: 'Nettoyage des doubles ventilateurs et changement des thermal pads.',
    isDemo: true,
    publishedAt: '2026-10-08T11:00:00Z',
    createdAt: '2026-10-08T11:00:00Z',
    updatedAt: '2026-10-15T15:20:00Z',
  },
  {
    id: 'prod-hp-elitebook-840',
    sku: 'NB-LPT-004',
    slug: 'hp-elitebook-840-g7-i5-16gb-512gb',
    name: 'HP EliteBook 840 G7 Aluminium (Core i5 / 16GB / 512GB SSD)',
    nameAr: 'إتش بي إليت بوك 840 G7 ألمنيوم (Core i5 / 16GB / 512GB)',
    brand: 'HP',
    category: 'business-laptops',
    condition: 'refurbished',
    priceDzd: 54000,
    originalPriceDzd: 59000,
    purchaseCostDzd: 41000,
    stockQuantity: 5,
    lowStockThreshold: 2,
    status: 'available',
    description: 'Châssis monocoque en aluminium brossé ultra-élégant. Son Bang & Olufsen puissant, caméra de confidentialité et autonomie impressionnante.',
    descriptionAr: 'لابتوب ألمنيوم أنيق جداً ونحيف. صوت نقي بنظام بانغ آند أولوفسن ومواصفات ممتازة للمكاتب والمحاسبة وتصفح الويب.',
    specifications: {
      cpu: 'Intel Core i5-10310U (4 Cores, 8 Threads, jusqu’à 4.40 GHz)',
      ram: '16 Go DDR4 2666MHz (2 slots disponibles)',
      storage: '512 Go SSD M.2 PCIe NVMe',
      gpu: 'Intel UHD Graphics 620',
      screen: '14.0" FHD (1920x1080) IPS Antireflet 400 nits faible consommation',
      batteryHealth: '91% d’autonomie',
      keyboardLayout: 'AZERTY Français d’origine',
      chargerIncluded: true,
      cosmeticCondition: 'grade-a',
      knownDefects: 'Très bel état d’ensemble, matériel reconditionné d’usine.',
      warrantyPeriod: 'Garantie test matériel 30 jours',
    },
    images: [
      {
        id: 'img-hp-1',
        url: thinkpadImg,
        altText: 'HP EliteBook 840 G7',
        isPrimary: true,
        sortOrder: 1,
      },
    ],
    isFeatured: false,
    isOffer: false,
    internalNotes: 'Arrivage de 5 pièces uniformes. Parfait pour étudiants et gestion commerciale.',
    isDemo: true,
    publishedAt: '2026-10-14T08:00:00Z',
    createdAt: '2026-10-14T08:00:00Z',
    updatedAt: '2026-10-14T08:00:00Z',
  },
  {
    id: 'prod-ssd-samsung-980pro',
    sku: 'NB-SSD-001',
    slug: 'samsung-980-pro-nvme-1tb',
    name: 'Samsung 980 PRO NVMe M.2 SSD 1To (PCIe 4.0)',
    nameAr: 'قرص تخزين سامسونج 980 برو 1 تيرابايت M.2 NVMe',
    brand: 'Samsung',
    category: 'ram-ssd',
    condition: 'new',
    priceDzd: 18500,
    originalPriceDzd: 21000,
    purchaseCostDzd: 15200,
    stockQuantity: 8,
    lowStockThreshold: 2,
    status: 'available',
    description: 'Le SSD haute performance par excellence. Vitesse de lecture jusqu’à 7000 Mo/s, idéal pour réduire les temps de chargement sur PC gamer et PS5.',
    descriptionAr: 'أقوى أقراص التخزين بسرعة قراءة تصل إلى 7000 ميغابايت بالثانية، مثالي للكمبيوتر وبلايستيشن 5.',
    specifications: {
      manufacturer: 'Samsung Electronics',
      exactModel: 'MZ-V8P1T0BW',
      storage: '1 To (1000 Go) 3D V-NAND TLC',
      compatibility: 'PCIe Gen 4.0 x4, rétrocompatible PCIe 3.0, Format M.2 2280',
      warrantyPeriod: 'Garantie constructeur 5 ans',
    },
    images: [
      {
        id: 'img-ssd-1',
        url: gpuComponentImg,
        altText: 'Samsung 980 PRO NVMe M.2 1TB',
        isPrimary: true,
        sortOrder: 1,
      },
    ],
    isFeatured: false,
    isOffer: true,
    internalNotes: 'Produit neuf scellé dans sa boîte officielle avec hologramme d’authenticité.',
    isDemo: true,
    publishedAt: '2026-10-11T13:00:00Z',
    createdAt: '2026-10-11T13:00:00Z',
    updatedAt: '2026-10-11T13:00:00Z',
  },
  {
    id: 'prod-periph-logitech-gpro',
    sku: 'NB-ACC-001',
    slug: 'logitech-g-pro-x-superlight-black',
    name: 'Logitech G PRO X Superlight Wireless (Noir)',
    nameAr: 'فأرة لوجيتك جي برو إكس سوبرلايت اللاسلكية (أسود)',
    brand: 'Logitech',
    category: 'peripherals',
    condition: 'refurbished',
    priceDzd: 16000,
    originalPriceDzd: 19000,
    purchaseCostDzd: 11500,
    stockQuantity: 2,
    lowStockThreshold: 1,
    status: 'available',
    description: 'La souris reine de la compétition e-sport mondiale. Moins de 63 grammes, capteur HERO 25K sans lissage et patins PTFE haute glisse.',
    descriptionAr: 'الفأرة الاحترافية لبطولات الألعاب العالمية بوزن خفيف جداً أقل من 63 غرام وحساسية استثنائية.',
    specifications: {
      manufacturer: 'Logitech G',
      exactModel: 'G PRO X Superlight Wireless Gaming Mouse',
      physicalCondition: 'Reconditionné état neuf, patins PTFE neufs posés',
      batteryHealth: 'Batterie interne Li-Po 70 heures d’autonomie',
      includedAccessories: 'Câble de charge, récepteur USB LIGHTSPEED, adaptateur d’extension',
      warrantyPeriod: 'Garantie test 30 jours',
    },
    images: [
      {
        id: 'img-mouse-1',
        url: heroWorkstationImg,
        altText: 'Logitech G PRO X Superlight sur tapis de souris',
        isPrimary: true,
        sortOrder: 1,
      },
    ],
    isFeatured: false,
    isOffer: false,
    internalNotes: 'Vérification de tous les clics et de la molette sous logiciel de test de switch.',
    isDemo: true,
    publishedAt: '2026-10-09T10:00:00Z',
    createdAt: '2026-10-09T10:00:00Z',
    updatedAt: '2026-10-09T10:00:00Z',
  },
];

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
    // 1. Fast synchronous hydration from localStorage
    const savedProducts = storageAdapter.safeGetLocalStorage(STORAGE_KEY_PRODUCTS);
    if (savedProducts) {
      try {
        this.products = JSON.parse(savedProducts);
      } catch {
        this.products = [...INITIAL_PRODUCTS];
      }
    } else {
      this.products = [...INITIAL_PRODUCTS];
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
      this.movements = [
        {
          id: 'mov-1',
          productId: 'prod-thinkpad-t14',
          productName: 'Lenovo ThinkPad T14 Gen 2',
          productSku: 'NB-LPT-001',
          movementType: 'stock_in',
          quantityDelta: 4,
          resultingQuantity: 4,
          reason: 'Réception arrivage lot Suisse',
          reference: 'BL-2026-10-01',
          createdBy: 'Admin YOUPPI',
          createdAt: '2026-10-10T10:30:00Z',
        },
        {
          id: 'mov-2',
          productId: 'prod-gaming-pc-vortex',
          productName: 'Tour Gaming "Vortex Horizon"',
          productSku: 'NB-DSK-001',
          movementType: 'stock_in',
          quantityDelta: 2,
          resultingQuantity: 2,
          reason: 'Assemblage atelier et fin des benchmarks',
          reference: 'PROD-004',
          createdBy: 'Technicien YOUPPI',
          createdAt: '2026-10-14T10:00:00Z',
        },
      ];
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
      if (idbProducts && Array.isArray(idbProducts) && idbProducts.length > 0) {
        // If IndexedDB has more data or our local cache had stripped images, adopt IndexedDB data
        this.products = idbProducts;
        this.isHydrated = true;
        this.notifySubscribers();
      } else if (this.products.length > 0) {
        // Seed IndexedDB with initial products for future durability
        await storageAdapter.setIdbItem(STORAGE_KEY_PRODUCTS, this.products);
        this.isHydrated = true;
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
    this.products = [...INITIAL_PRODUCTS];
    this.saveProducts();
  }
}

export const storeService = new StoreService();
