import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Link, useRouter } from '../../router/Router';
import { 
  ShoppingBag, 
  Heart, 
  Eye, 
  Laptop, 
  ArrowUpRight, 
  Star,
  Check,
  Zap,
  Flame
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { language, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isSold = product.status === 'sold' || product.stockQuantity === 0;
  const isReserved = product.status === 'reserved';
  const primaryImg = product.images.find(img => img.isPrimary) || product.images[0];
  const isWish = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSold) return;

    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  // Build clean unboxed specs string
  const specsList: string[] = [];
  if (product.specifications?.cpu) {
    const match = product.specifications.cpu.match(/(i\d-\w+|Ryzen\s\d\s\w+|Core\s\w+|M\d\s\w+)/i);
    specsList.push(match ? match[0] : product.specifications.cpu.split('(')[0].trim());
  }
  if (product.specifications?.ram) {
    const match = product.specifications.ram.match(/\d+\s*Go/i);
    specsList.push(match ? match[0] : product.specifications.ram.split(' ')[0]);
  }
  if (product.specifications?.storage) {
    const match = product.specifications.storage.match(/\d+\s*(Go|To)/i);
    specsList.push(match ? match[0] : product.specifications.storage.split(' ')[0]);
  }
  if (product.specifications?.gpu && product.category?.includes('gaming')) {
    const match = product.specifications.gpu.match(/(RTX\s*\d+|GTX\s*\d+|Radeon\s*\w+)/i);
    specsList.push(match ? match[0] : 'GPU Dédié');
  }

  // Calculate discount percent if genuine original price exists
  const hasDiscount = product.originalPriceDzd && product.originalPriceDzd > product.priceDzd;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPriceDzd! - product.priceDzd) / product.originalPriceDzd!) * 100)
    : 0;

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative bg-white border border-slate-200/80 hover:border-cyan-400/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col h-full"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-100/70 overflow-hidden flex items-center justify-center">
        {primaryImg && !imgError ? (
          <img
            src={primaryImg.url}
            alt={primaryImg.altText || product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108 ${
              isSold ? 'grayscale opacity-60' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-4 text-slate-400">
            <Laptop className="w-10 h-10 mb-2 stroke-[1.5] text-slate-300" />
            <span className="text-xs text-slate-500 font-medium">{product.brand}</span>
          </div>
        )}

        {/* Status Overlays */}
        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1.5 z-10">
          {isSold ? (
            <span className="bg-red-600 text-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md shadow-sm">
              {t('statuses.sold')}
            </span>
          ) : isReserved ? (
            <span className="bg-amber-500 text-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md shadow-sm">
              {t('statuses.reserved')}
            </span>
          ) : (
            <div className="flex flex-col gap-1 items-start">
              {product.isFeatured && (
                <span className="bg-gradient-to-r from-[#0075FF] to-cyan-500 text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md shadow-sm flex items-center gap-1 border border-cyan-300/30">
                  <Flame className="w-3 h-3 fill-white text-white" />
                  Top Vente
                </span>
              )}
              {hasDiscount && (
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-2.5 py-0.5 text-[10px] font-extrabold rounded-md shadow-sm">
                  -{discountPercent}%
                </span>
              )}
              <span className="bg-white/90 backdrop-blur-md text-slate-700 border border-slate-200/70 px-2 py-0.5 text-[10px] font-semibold rounded-md shadow-2xs">
                {t(`conditions.${product.condition}`)}
              </span>
            </div>
          )}
        </div>

        {/* Top Right Actions: Wishlist Heart */}
        <button
          onClick={handleWishlistClick}
          aria-label={isWish ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className={`absolute top-3 right-3 rtl:right-auto rtl:left-3 z-10 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-sm cursor-pointer ${
            isWish 
              ? 'bg-blue-50 text-[#0075FF] border border-blue-200 scale-105' 
              : 'bg-white/90 text-slate-500 hover:text-[#0075FF] hover:bg-white border border-slate-200/80 hover:scale-105'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isWish ? 'fill-[#0075FF] text-[#0075FF]' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/95 hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 hover:border-transparent p-2.5 rounded-xl backdrop-blur-md shadow-md hover:scale-105 cursor-pointer z-10"
            aria-label="Aperçu rapide"
            title="Aperçu rapide"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-slate-700 font-bold">{product.brand}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-mono text-[10px] text-slate-400">{product.sku}</span>
            </div>

            <span className="text-[10px] text-slate-400 font-medium capitalize">
              {product.category?.replace(/-/g, ' ')}
            </span>
          </div>

          {/* Title */}
          <Link to={`/products/${product.slug}`} className="block group/title">
            <h3 className="text-sm font-bold text-slate-900 group-hover/title:text-[#0075FF] transition-colors line-clamp-2 leading-snug">
              {language === 'ar' && product.nameAr ? product.nameAr : product.name}
            </h3>
          </Link>

          {/* Technical Specs Tags */}
          {specsList.length > 0 && (
            <div className="pt-0.5 text-xs text-slate-600 flex items-center flex-wrap gap-1.5 leading-tight">
              {specsList.map((spec, idx) => (
                <span key={idx} className="bg-slate-100/90 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-medium border border-slate-200/50">
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">{t('product.price')}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg font-black text-[#0075FF] font-mono tabular-nums tracking-tight">
                  {formatPrice(product.priceDzd)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                    {formatPrice(product.originalPriceDzd!)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock indicator badge */}
            {product.stockQuantity > 0 && product.stockQuantity <= (product.lowStockThreshold || 2) && !isSold && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                Plus que {product.stockQuantity}
              </span>
            )}
          </div>

          {/* Dual Action: Details + Direct Add to Cart */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/products/${product.slug}`}
              className="px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors text-center flex items-center justify-center gap-1 group/btn"
            >
              <span>Détails</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-slate-700 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={isSold}
              className={`px-3 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                isSold
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : justAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0060DF] hover:to-[#004DB3] text-white shadow-blue-500/25 hover:shadow-cyan-400/30'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Ajouté !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isSold ? 'Épuisé' : 'Panier'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

