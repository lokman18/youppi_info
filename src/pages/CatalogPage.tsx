import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useRouter } from '../router/Router';
import { storeService } from '../services/storeService';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product } from '../types';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  LayoutGrid, 
  List, 
  RotateCcw
} from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const { language, t, formatPrice } = useLanguage();
  const { search: currentSearchQuery } = useRouter();

  // Parse initial query params from URL
  const queryParams = useMemo(() => {
    return new URLSearchParams(currentSearchQuery);
  }, [currentSearchQuery]);

  const [search, setSearch] = useState(queryParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(queryParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(queryParams.get('brand') || 'all');
  const [selectedCondition, setSelectedCondition] = useState<string>(queryParams.get('condition') || 'all');
  const [selectedStatus, setSelectedStatus] = useState<string>(queryParams.get('status') || 'all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(queryParams.get('available') === 'true');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'featured'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Price range slider state
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    setVisibleCount(6);
  }, [search, selectedCategory, selectedBrand, selectedCondition, onlyAvailable, sortBy, minPrice, maxPrice]);

  // Sync state with URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedBrand !== 'all') params.set('brand', selectedBrand);
    if (selectedCondition !== 'all') params.set('condition', selectedCondition);
    if (onlyAvailable) params.set('available', 'true');
    if (sortBy !== 'newest') params.set('sort', sortBy);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const newUrl = `/products${queryString}`;
    window.history.replaceState({}, '', newUrl);
  }, [search, selectedCategory, selectedBrand, selectedCondition, onlyAvailable, sortBy]);

  // Store reactivity
  const [storeVersion, setStoreVersion] = useState(0);
  useEffect(() => {
    return storeService.subscribe(() => {
      setStoreVersion(v => v + 1);
    });
  }, []);

  const categories = storeService.getCategories();

  // Extract unique brands from inventory
  const allProducts = useMemo(() => storeService.getProducts(), [storeVersion]);
  const brands = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach(p => set.add(p.brand));
    return Array.from(set).sort();
  }, [allProducts]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return storeService.getProducts({
      category: selectedCategory,
      brand: selectedBrand,
      condition: selectedCondition,
      status: selectedStatus,
      search,
      onlyAvailable,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice < 300000 ? maxPrice : undefined,
      sortBy,
    });
  }, [selectedCategory, selectedBrand, selectedCondition, selectedStatus, search, onlyAvailable, minPrice, maxPrice, sortBy, storeVersion]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedCondition('all');
    setSelectedStatus('all');
    setOnlyAvailable(false);
    setMinPrice(0);
    setMaxPrice(300000);
    setSortBy('newest');
  };

  const hasActiveFilters = 
    search.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    selectedCondition !== 'all' ||
    onlyAvailable ||
    minPrice > 0 ||
    maxPrice < 300000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t('catalog.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('catalog.resultsCount', { count: filteredProducts.length })}
          </p>
        </div>

        {/* View Mode & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#0075FF]" />
            <span>{t('catalog.filters')}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#0075FF]" />
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">{t('catalog.sortBy')}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#0075FF] shadow-2xs"
            >
              <option value="newest">{t('catalog.sortNewest')}</option>
              <option value="price_asc">{t('catalog.sortPriceAsc')}</option>
              <option value="price_desc">{t('catalog.sortPriceDesc')}</option>
              <option value="featured">{t('catalog.sortFeatured')}</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-400 hover:text-slate-700'}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-400 hover:text-slate-700'}`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block md:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6 shadow-xs">
            
            {/* Header / Clear */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0075FF]" />
                {t('catalog.filters')}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#0075FF] hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('catalog.clearFilters')}</span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {t('catalog.search')}
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ThinkPad, RTX, i7..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#0075FF] rounded-lg ps-8 pe-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                {t('catalog.filterCategory')}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0075FF]"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === 'ar' ? c.nameAr : language === 'en' ? c.nameEn : c.nameFr}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                {t('catalog.filterBrand')}
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0075FF]"
              >
                <option value="all">Toutes les marques</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                {t('catalog.filterCondition')}
              </label>
              <div className="space-y-1 text-xs text-slate-600">
                {['all', 'refurbished', 'used', 'new'].map((cond) => (
                  <label key={cond} className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                    <input
                      type="radio"
                      name="condition"
                      checked={selectedCondition === cond}
                      onChange={() => setSelectedCondition(cond)}
                      className="text-[#0075FF] focus:ring-0 bg-slate-100 border-slate-300"
                    />
                    <span>
                      {cond === 'all' ? 'Tous les états' : t(`conditions.${cond}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Checkbox */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded text-[#0075FF] focus:ring-0 bg-slate-100 border-slate-300"
                />
                <span>{t('catalog.onlyAvailable')}</span>
              </label>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700">
                  {t('catalog.filterPriceRange')}
                </label>
                <span className="text-slate-600 font-mono text-[11px] tabular-nums">
                  ≤ {formatPrice(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="300000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0075FF] bg-slate-200 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </aside>

        {/* Product Catalog Display Area */}
        <main className="md:col-span-3 space-y-6">
          
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 me-1">{t('catalog.activeFilters')}:</span>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 hover:text-slate-900 shadow-2xs"
                >
                  <span>« {search} »</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 hover:text-slate-900 shadow-2xs"
                >
                  <span>{selectedCategory}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedBrand !== 'all' && (
                <button
                  onClick={() => setSelectedBrand('all')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 hover:text-slate-900 shadow-2xs"
                >
                  <span>{selectedBrand}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedCondition !== 'all' && (
                <button
                  onClick={() => setSelectedCondition('all')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 hover:text-slate-900 shadow-2xs"
                >
                  <span>{t(`conditions.${selectedCondition}`)}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {onlyAvailable && (
                <button
                  onClick={() => setOnlyAvailable(false)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 hover:text-slate-900 shadow-2xs"
                >
                  <span>{t('catalog.onlyAvailable')}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#0075FF] hover:underline ms-2 font-semibold"
              >
                {t('catalog.clearFilters')}
              </button>
            </div>
          )}

          {/* Product Grid / Empty State */}
          {filteredProducts.length > 0 ? (
            <div className="space-y-8">
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>

              {/* Load More Pagination */}
              {visibleCount < filteredProducts.length && (
                <div className="pt-6 text-center space-y-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Affichage de <strong className="text-slate-900 font-mono">{Math.min(visibleCount, filteredProducts.length)}</strong> sur <strong className="text-slate-900 font-mono">{filteredProducts.length}</strong> produits
                  </p>

                  <div className="max-w-xs mx-auto h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0075FF] to-cyan-400 rounded-full transition-all duration-300"
                      style={{ width: `${(Math.min(visibleCount, filteredProducts.length) / filteredProducts.length) * 100}%` }}
                    />
                  </div>

                  <button
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="px-6 py-3 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer hover:border-[#0075FF]"
                  >
                    Charger plus de produits
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
              <Search className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">{t('catalog.noResults')}</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {t('catalog.noResultsSub')}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-gradient-to-r from-[#0075FF] to-[#0060DF] text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                {t('catalog.clearFilters')}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Sheet Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full sm:max-w-md bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">{t('catalog.filters')}</span>
              <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t('catalog.filterCategory')}</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {language === 'ar' ? c.nameAr : language === 'en' ? c.nameEn : c.nameFr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t('catalog.filterBrand')}</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
                >
                  <option value="all">Toutes les marques</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="rounded text-[#0075FF]"
                  />
                  <span>{t('catalog.onlyAvailable')}</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200"
              >
                {t('catalog.clearFilters')}
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#0075FF] to-[#0060DF] text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Voir les résultats
              </button>
            </div>
          </div>
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
