import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from '../router/Router';
import { storeService } from '../services/storeService';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product } from '../types';
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react';

interface CategoryPageProps {
  slug: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug }) => {
  const { language, t } = useLanguage();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const category = storeService.getCategoryBySlug(slug);
  const products = storeService.getProducts({ category: slug });

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Catégorie introuvable</h2>
        <Link to="/products" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0075FF] to-[#0060DF] text-white text-xs font-semibold rounded-lg shadow-sm">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('catalog.clearFilters')}</span>
        </Link>
      </div>
    );
  }

  const categoryName = language === 'ar' ? category.nameAr : language === 'en' ? category.nameEn : category.nameFr;
  const categoryDesc = language === 'ar' ? category.descriptionAr : language === 'en' ? category.descriptionEn : category.descriptionFr;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Hero Banner */}
      <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-cyan-50/70 border border-blue-100/90 relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs text-[#0075FF] font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Rayon Matériel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {categoryName}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {categoryDesc}
          </p>
          <div className="pt-2 text-xs text-slate-500 font-mono">
            {products.length} référence(s) actuellement en stock
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
          <p className="text-sm text-slate-500">Aucun produit n’est actuellement en rayon dans cette catégorie.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#0075FF] hover:underline"
          >
            <span>{t('categories.viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
