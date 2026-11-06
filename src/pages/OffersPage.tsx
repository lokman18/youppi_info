import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { storeService } from '../services/storeService';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product } from '../types';
import { Sparkles, Tag } from 'lucide-react';

export const OffersPage: React.FC = () => {
  const { t } = useLanguage();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const offerProducts = storeService.getProducts({ isOffer: true });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Offers Banner */}
      <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-50/80 via-slate-50 to-cyan-50/80 border border-blue-200/70 relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#0075FF] font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Tarifs Préférentiels & Déstockage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('offers.title')}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t('offers.subtitle')}
          </p>
          <div className="pt-2 text-xs text-slate-500">
            Remises authentiques calculées par rapport à nos prix standards antérieurs.
          </div>
        </div>
      </div>

      {/* Grid */}
      {offerProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {offerProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
          <Tag className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm text-slate-600">{t('offers.noOffers')}</p>
        </div>
      )}

      {/* Quick View */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
