import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRouter, Link } from '../router/Router';
import { storeService } from '../services/storeService';
import { openWhatsAppChat } from '../services/whatsappService';
import { ProductCard } from '../components/common/ProductCard';
import { Product } from '../types';
import { 
  ShoppingBag, 
  Heart, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ArrowLeft, 
  Share2, 
  Check, 
  Cpu, 
  Laptop, 
  Star, 
  Plus, 
  Minus, 
  Flame, 
  Zap, 
  ZoomIn,
  PackageCheck
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { language, t, formatPrice } = useLanguage();
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { navigate } = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Noir Sidéral');
  const [selectedSpec, setSelectedSpec] = useState('Standard (Inclus)');
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [justAdded, setJustAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'warranty'>('specs');

  const imgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const found = storeService.getProductBySlug(slug, false);
    setProduct(found);
    setActiveImageIdx(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Produit introuvable</h2>
        <p className="text-sm text-slate-500">Le produit demandé n’est plus disponible ou l’adresse est incorrecte.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0075FF] to-[#0060DF] text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-blue-500/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>Retour au catalogue</span>
        </Link>
      </div>
    );
  }

  const isSold = product.status === 'sold' || product.stockQuantity === 0;
  const isReserved = product.status === 'reserved';
  const isWish = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : [{ id: '1', url: '', altText: product.name, isPrimary: true, sortOrder: 0 }];
  const currentImg = images[activeImageIdx] || images[0];

  const relatedProducts = storeService
    .getProducts({ category: product.category })
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    if (isSold) return;
    addToCart(product, quantity, selectedColor, selectedSpec);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isSold) return;
    addToCart(product, quantity, selectedColor, selectedSpec);
    navigate('/checkout');
  };

  const handleWhatsApp = () => {
    openWhatsAppChat({
      product,
      sourcePage: `pdp_${product.slug}`,
      lang: language,
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasDiscount = product.originalPriceDzd && product.originalPriceDzd > product.priceDzd;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPriceDzd! - product.priceDzd) / product.originalPriceDzd!) * 100)
    : 0;

  const reviews: Array<{ author: string; city: string; rating: number; date: string; comment: string; verified: boolean }> = [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900 transition-colors">{t('nav.home')}</Link>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <Link to="/products" className="hover:text-slate-900 transition-colors">{t('nav.products')}</Link>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <Link to={`/categories/${product.category}`} className="hover:text-slate-900 transition-colors uppercase font-mono">
          {product.category}
        </Link>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Image Gallery with Interactive Zoom */}
        <div className="lg:col-span-7 space-y-4">
          <div 
            ref={imgContainerRef}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            className="relative aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl overflow-hidden border border-slate-200/90 flex items-center justify-center group shadow-sm cursor-crosshair select-none"
          >
            {currentImg.url ? (
              <img
                src={currentImg.url}
                alt={currentImg.altText || product.name}
                referrerPolicy="no-referrer"
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transform: 'scale(1.9)',
                      }
                    : { transform: 'scale(1)' }
                }
                className={`w-full h-full object-cover transition-transform duration-150 ease-out ${
                  isSold ? 'grayscale opacity-75' : ''
                }`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                <Laptop className="w-16 h-16 stroke-[1.2] mb-2" />
                <span className="text-xs font-mono">{product.name}</span>
              </div>
            )}

            {/* Zoom hint badge */}
            <div className="absolute bottom-4 right-4 bg-slate-900/70 backdrop-blur-md text-white px-2.5 py-1 text-[11px] rounded-lg pointer-events-none flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Survoler pour zoomer</span>
            </div>

            {/* Condition & Discount Badges */}
            <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex flex-col gap-2 pointer-events-none">
              <span className="bg-white/95 backdrop-blur-md text-slate-800 border border-slate-200 px-3 py-1 text-xs font-bold rounded-xl shadow-xs">
                {t(`conditions.${product.condition}`)}
              </span>
              {hasDiscount && (
                <span className="bg-gradient-to-r from-[#0075FF] to-cyan-500 text-white px-3 py-1 text-xs font-extrabold rounded-xl tabular-nums shadow-md">
                  -{discountPercent}% PROMO
                </span>
              )}
            </div>

            {/* Status Warning Overlay if Sold */}
            {isSold && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6 text-center pointer-events-none">
                <div className="bg-white border border-red-200 p-5 rounded-2xl max-w-sm shadow-2xl">
                  <span className="text-base font-extrabold text-red-600 block mb-1">
                    {t('statuses.sold')}
                  </span>
                  <p className="text-xs text-slate-600">{t('product.soldNotice')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                    activeImageIdx === idx 
                      ? 'border-[#0075FF] ring-2 ring-cyan-400/30 scale-105' 
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees Strip */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 shadow-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0075FF] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Garantie 30 Jours</span>
                <span className="text-slate-500">Test complet et échange sous garantie</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Livraison 58 Wilayas</span>
                <span className="text-slate-500">Expédition rapide à domicile ou bureau</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PackageCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Vérifié au Banc</span>
                <span className="text-slate-500">Pâte thermique neuve & stress-test</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-24">
            
            {/* Top row: Brand, SKU, Rating & Wishlist */}
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wider font-extrabold text-slate-800">{product.brand}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-mono text-slate-400">{product.sku}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isWish
                      ? 'bg-blue-50 text-[#0075FF] border-blue-200 shadow-sm'
                      : 'bg-slate-50 text-slate-400 hover:text-[#0075FF] border-slate-200'
                  }`}
                  title={isWish ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart className={`w-4 h-4 ${isWish ? 'fill-[#0075FF] text-[#0075FF]' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Partager"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Product Title & Reviews Count */}
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {language === 'ar' && product.nameAr ? product.nameAr : product.name}
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  {language === 'ar' ? 'الضمان: 30 يوماً فحص واختبار' : 'Garantie atelier : 30 jours'}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{language === 'ar' ? 'فحص أصلي 100%' : '100% Testé & Révisé'}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/20 to-cyan-50/20 border border-blue-100/80 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#0075FF] tabular-nums tracking-tight font-mono">
                  {formatPrice(product.priceDzd)}
                </span>
                {hasDiscount && (
                  <span className="text-sm sm:text-base text-slate-400 line-through tabular-nums font-mono">
                    {formatPrice(product.originalPriceDzd!)}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 block">
                Prix TTC en Dinars Algériens (DZD) · Facture officielle fournie
              </span>
            </div>

            {/* Selectors: Color Variant */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Couleur du châssis</span>
                <span className="text-slate-500 font-normal">{selectedColor}</span>
              </label>
              <div className="flex gap-2">
                {['Noir Sidéral', 'Gris Anthracite', 'Argent Lunaire'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      selectedColor === color
                        ? 'border-[#0075FF] bg-blue-50/50 text-[#0075FF] font-bold ring-1 ring-[#0075FF]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Selectors: Configuration / Spec Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Option d'extension</span>
                <span className="text-slate-500 font-normal">{selectedSpec}</span>
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Standard (Inclus)', price: '+0 DA' },
                  { label: 'Upgrade 1TB SSD', price: '+6,500 DA' },
                  { label: 'Upgrade 32GB RAM', price: '+8,000 DA' },
                  { label: 'Pack Sacoche + Souris', price: '+3,500 DA' },
                ].map(opt => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSelectedSpec(opt.label)}
                    className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                      selectedSpec === opt.label
                        ? 'border-[#0075FF] bg-blue-50/40 text-slate-900 font-bold ring-1 ring-[#0075FF]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <span className="block font-semibold text-[11px] truncate">{opt.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{opt.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Stock Badge */}
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 block">Quantité</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold font-mono text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-end">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Disponibilité</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md inline-block ${
                  isSold 
                    ? 'bg-red-50 text-red-600' 
                    : product.stockQuantity <= 2 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {isSold ? 'Épuisé' : `En stock (${product.stockQuantity} disponibles)`}
                </span>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isSold}
                className={`w-full py-4 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
                  isSold
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : justAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0066E0] hover:to-[#004EC2] text-white shadow-blue-500/25 hover:shadow-cyan-500/35 transform hover:-translate-y-0.5'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ajouté au panier !</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isSold ? 'Produit Épuisé' : 'Ajouter au Panier'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isSold}
                className="w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer shadow-md"
              >
                Commander immédiatement
              </button>

              <button
                onClick={handleWhatsApp}
                disabled={isSold}
                className="w-full py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Poser une question sur WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs: Specs, Reviews, Warranty */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex border-b border-slate-100 gap-6">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'specs'
                ? 'text-[#0075FF] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0075FF]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Fiche Technique Complète
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'reviews'
                ? 'text-[#0075FF] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0075FF]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Avis Clients (24)
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'warranty'
                ? 'text-[#0075FF] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0075FF]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Garantie & Expédition
          </button>
        </div>

        {activeTab === 'specs' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-xs">
              {product.specifications.cpu && (
                <div className="flex items-start justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">{t('product.processor')}</span>
                  <span className="text-slate-900 font-semibold font-mono text-end max-w-xs">{product.specifications.cpu}</span>
                </div>
              )}
              {product.specifications.ram && (
                <div className="flex items-start justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">{t('product.ram')}</span>
                  <span className="text-slate-900 font-semibold font-mono text-end max-w-xs">{product.specifications.ram}</span>
                </div>
              )}
              {product.specifications.storage && (
                <div className="flex items-start justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">{t('product.storage')}</span>
                  <span className="text-slate-900 font-semibold font-mono text-end max-w-xs">{product.specifications.storage}</span>
                </div>
              )}
              {product.specifications.gpu && (
                <div className="flex items-start justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">{t('product.graphics')}</span>
                  <span className="text-slate-900 font-semibold font-mono text-end max-w-xs">{product.specifications.gpu}</span>
                </div>
              )}
              {product.specifications.screen && (
                <div className="flex items-start justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">{t('product.display')}</span>
                  <span className="text-slate-900 font-medium text-end max-w-xs">{product.specifications.screen}</span>
                </div>
              )}
              {product.specifications.batteryHealth && (
                <div className="flex items-start justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">{t('product.batteryHealth')}</span>
                  <span className="text-emerald-600 font-bold text-end">{product.specifications.batteryHealth}</span>
                </div>
              )}
              {product.specifications.keyboardLayout && (
                <div className="flex items-start justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">{t('product.keyboardLayout')}</span>
                  <span className="text-slate-900 font-medium text-end">{product.specifications.keyboardLayout}</span>
                </div>
              )}
              {product.specifications.cosmeticCondition && (
                <div className="flex items-start justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">{t('product.cosmeticGrade')}</span>
                  <span className="text-slate-900 font-bold uppercase text-end">{product.specifications.cosmeticCondition}</span>
                </div>
              )}
              {product.specifications.chargerIncluded !== undefined && (
                <div className="flex items-start justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">{t('product.charger')}</span>
                  <span className="text-emerald-600 font-semibold text-end">
                    {product.specifications.chargerIncluded ? 'Oui (Original testé)' : 'Non inclus'}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Description détaillée</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                {language === 'ar' && product.descriptionAr ? product.descriptionAr : product.description}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="p-12 text-center bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              {language === 'ar' ? 'لا توجد تقييمات لهذا المنتج حتى الآن' : 'Aucun avis pour ce produit pour le moment'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {language === 'ar'
                ? 'كن أول من يقتني هذا العتاد ويشارك تجربته مع مجتمع يوبي إنفو.'
                : 'Soyez le premier client à acquérir cette machine et à partager votre retour technique.'}
            </p>
          </div>
        )}

        {activeTab === 'warranty' && (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-w-3xl">
            <h3 className="font-bold text-sm text-slate-900">Charte de Garantie YOUPPI INFO</h3>
            <p>
              Chaque produit vendu par YOUPPI INFO fait l'objet d'une batterie de tests intensifs avant d'être mis en vente : test de stress CPU/GPU (Cinebench, FurMark), contrôle d'intégrité de la mémoire RAM (MemTest86), test de santé des disques SSD (SMART), et mesure du cycle de décharge de la batterie.
            </p>
            <p>
              En cas de défaillance matérielle constatée durant la période de garantie de 30 jours, nous procédons à la réparation en atelier ou au remplacement immédiat par un modèle équivalent.
            </p>
          </div>
        )}
      </section>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Produits similaires recommandés</h2>
              <p className="text-xs text-slate-500">Sélectionnés selon la même catégorie hardware</p>
            </div>
            <Link
              to={`/categories/${product.category}`}
              className="text-xs font-semibold text-[#0075FF] hover:underline"
            >
              Voir toute la catégorie →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
