import React, { useState } from 'react';
import { Product } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Link, useRouter } from '../../router/Router';
import { openWhatsAppChat } from '../../services/whatsappService';
import { 
  X, 
  MessageCircle, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight,
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  Check
} from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { language, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { pathname } = useRouter();
  
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const isWish = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : [{ id: 'def', url: '', altText: product.name, isPrimary: true, sortOrder: 0 }];
  const currentImg = images[selectedImgIdx] || images[0];

  const handleAddToCart = () => {
    if (isSold) return;
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWhatsApp = () => {
    openWhatsAppChat({
      product,
      sourcePage: `quickview_${pathname}`,
      lang: language,
    });
  };

  const isSold = product.status === 'sold' || product.stockQuantity === 0;


  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="uppercase tracking-wider text-slate-700">{product.brand}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono text-[11px]">{product.sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gallery Col */}
          <div className="space-y-3">
            <div className="aspect-[4/3] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/90 flex items-center justify-center shadow-xs">
              {currentImg.url ? (
                <img
                  src={currentImg.url}
                  alt={currentImg.altText || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-400 text-xs font-mono">{product.name}</div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                      selectedImgIdx === idx 
                        ? 'border-[#DC2626] ring-2 ring-red-100 scale-102' 
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Test Guarantee Note */}
            <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">{t('hero.testedBadge')}</span>
                <span className="text-slate-600 leading-relaxed">{product.specifications.warrantyPeriod || t('about.step1Desc')}</span>
              </div>
            </div>
          </div>

          {/* Details Col */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {language === 'ar' && product.nameAr ? product.nameAr : product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-slate-900 font-mono tabular-nums tracking-tight">
                  {formatPrice(product.priceDzd)}
                </span>
                {product.originalPriceDzd && product.originalPriceDzd > product.priceDzd && (
                  <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                    {formatPrice(product.originalPriceDzd)}
                  </span>
                )}
              </div>

              {/* Status & Condition */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="text-slate-400 font-medium">{t('product.condition')}:</span>
                  <span className="font-bold text-slate-800">{t(`conditions.${product.condition}`)}</span>
                </div>
                <span className="text-slate-200">|</span>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="text-slate-400 font-medium">{t('product.status')}:</span>
                  <span className={`font-bold ${isSold ? 'text-red-600' : 'text-emerald-600'}`}>
                    {t(`statuses.${product.status}`)}
                  </span>
                </div>
              </div>

              {/* Specs Breakdown */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-xs">
                {product.specifications.cpu && (
                  <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                    <span className="text-slate-500 font-medium">Processeur:</span>
                    <span className="font-bold text-slate-900 text-end truncate max-w-[180px]">{product.specifications.cpu}</span>
                  </div>
                )}
                {product.specifications.ram && (
                  <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                    <span className="text-slate-500 font-medium">RAM:</span>
                    <span className="font-bold text-slate-900">{product.specifications.ram}</span>
                  </div>
                )}
                {product.specifications.storage && (
                  <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                    <span className="text-slate-500 font-medium">Stockage:</span>
                    <span className="font-bold text-slate-900">{product.specifications.storage}</span>
                  </div>
                )}
                {product.specifications.gpu && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Graphique:</span>
                    <span className="font-bold text-slate-900 text-end truncate max-w-[180px]">{product.specifications.gpu}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold font-mono text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isSold}
                  className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    isSold
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-red-600/25'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Ajouté !</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isSold ? 'Épuisé' : 'Ajouter au Panier'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                    isWish ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-400 hover:text-red-500 border-slate-200'
                  }`}
                  title={isWish ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart className={`w-4 h-4 ${isWish ? 'fill-red-600' : ''}`} />
                </button>
              </div>

              {/* View Full Sheet & WhatsApp */}
              <div className="flex items-center gap-2.5">
                <Link
                  to={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <span>Fiche détaillée</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>

                <button
                  onClick={handleWhatsApp}
                  disabled={isSold}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

