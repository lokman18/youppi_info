import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useRouter, Link } from '../../router/Router';
import { storeService } from '../../services/storeService';
import { AdminLayout } from './AdminLayout';
import { Product, AvailabilityStatus } from '../../types';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Copy, 
  ExternalLink, 
  AlertTriangle,
  CheckCircle2,
  Package,
  Sparkles,
  Filter
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { language, t, formatPrice } = useLanguage();
  const { navigate } = useRouter();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  // Reload products trigger
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    return storeService.subscribe(() => {
      setRefreshKey(k => k + 1);
    });
  }, []);

  const products = useMemo(() => {
    return storeService.getProducts({
      category: filterCategory,
      status: filterStatus,
      search,
      isAdmin: true, // Show private purchase costs
    });
  }, [filterCategory, filterStatus, search, refreshKey]);

  const categories = storeService.getCategories();

  const handleStatusChange = (product: Product, newStatus: AvailabilityStatus) => {
    storeService.updateProduct(product.id, { status: newStatus });
    setRefreshKey(k => k + 1);
    showToast(`Statut mis à jour : ${newStatus}`);
  };

  const handleDuplicate = (id: string) => {
    const copy = storeService.duplicateProduct(id);
    if (copy) {
      setRefreshKey(k => k + 1);
      showToast('Produit dupliqué avec succès');
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    storeService.deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
    setRefreshKey(k => k + 1);
    showToast(t('admin.productDeleted'));
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <AdminLayout activeTab="products">
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#0075FF] mb-1 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              Catalogue Produits
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('admin.products')}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Gestion de l'inventaire matériel, fiches techniques et tarification DZD
            </p>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0060DF] hover:to-[#004DB3] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-cyan-400/30 transition-all shrink-0 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>{t('admin.addProduct')}</span>
          </Link>
        </div>

        {/* Feedback Toast */}
        {toastMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{toastMsg}</span>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par titre, SKU, marque..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-9 pe-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:border-[#0075FF] transition-all appearance-none cursor-pointer"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameFr}</option>
                ))}
              </select>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0075FF] transition-all appearance-none cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="available">Disponible</option>
              <option value="reserved">Réservé</option>
              <option value="sold">Vendu</option>
            </select>
          </div>
        </div>

        {/* Products Data Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-50/80 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-mono text-[11px]">
                <tr>
                  <th className="px-5 py-3.5 text-start font-bold">Produit & Réf</th>
                  <th className="px-5 py-3.5 text-start font-bold">État</th>
                  <th className="px-5 py-3.5 text-start font-bold">Prix Vente</th>
                  <th className="px-5 py-3.5 text-start font-bold">Coût Achat</th>
                  <th className="px-5 py-3.5 text-start font-bold">Stock</th>
                  <th className="px-5 py-3.5 text-start font-bold">Statut</th>
                  <th className="px-5 py-3.5 text-end font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.length > 0 ? (
                  products.map((p) => {
                    const primaryImg = p.images.find(i => i.isPrimary) || p.images[0];
                    return (
                      <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                        {/* Product & SKU */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-xs">
                              {primaryImg?.url ? (
                                <img src={primaryImg.url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold">NB</div>
                              )}
                            </div>
                            <div className="truncate max-w-xs">
                              <span className="font-semibold text-slate-900 truncate block group-hover:text-[#0075FF] transition-colors">{p.name}</span>
                              <span className="text-[11px] font-mono text-slate-400">{p.sku} · {p.brand}</span>
                            </div>
                          </div>
                        </td>

                        {/* Condition */}
                        <td className="px-5 py-3.5">
                          <span className="text-slate-600 font-medium">
                            {t(`conditions.${p.condition}`)}
                          </span>
                        </td>

                        {/* Selling Price */}
                        <td className="px-5 py-3.5 font-bold text-slate-900 font-mono tabular-nums">
                          {formatPrice(p.priceDzd)}
                        </td>

                        {/* Cost Price (Private admin only) */}
                        <td className="px-5 py-3.5 font-mono text-slate-400 tabular-nums">
                          {p.purchaseCostDzd ? formatPrice(p.purchaseCostDzd) : '—'}
                        </td>

                        {/* Stock */}
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg font-mono font-bold text-xs ${
                            p.stockQuantity <= 0 
                              ? 'bg-red-50 text-red-700 border border-red-100'
                              : p.stockQuantity <= p.lowStockThreshold 
                              ? 'bg-amber-50 text-amber-800 border border-amber-100' 
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                          }`}>
                            {p.stockQuantity} pcs
                          </span>
                        </td>

                        {/* Status Select */}
                        <td className="px-5 py-3.5">
                          <select
                            value={p.status}
                            onChange={(e) => handleStatusChange(p, e.target.value as any)}
                            className={`text-[11px] font-semibold rounded-lg px-2.5 py-1.5 border focus:outline-none cursor-pointer transition-all ${
                              p.status === 'available'
                                ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                : p.status === 'reserved'
                                ? 'text-amber-800 bg-amber-50 border-amber-200 hover:bg-amber-100'
                                : 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100'
                            }`}
                          >
                            <option value="available">{t('statuses.available')}</option>
                            <option value="reserved">{t('statuses.reserved')}</option>
                            <option value="sold">{t('statuses.sold')}</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-end">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/products/${p.slug}`}
                              target="_blank"
                              className="p-1.5 text-slate-400 hover:text-[#0075FF] rounded-lg hover:bg-blue-50 transition-all"
                              title="Voir en ligne"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => handleDuplicate(p.id)}
                              className="p-1.5 text-slate-400 hover:text-cyan-600 rounded-lg hover:bg-cyan-50 transition-all"
                              title={t('admin.duplicate')}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              to={`/admin/products/${p.id}/edit`}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all"
                              title={t('admin.editProduct')}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => setDeleteTarget(p)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                              title={t('admin.delete')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                          <Package className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500 font-medium">Aucun produit trouvé selon les critères actuels.</p>
                        <Link
                          to="/admin/products/new"
                          className="inline-flex items-center gap-1.5 text-xs text-[#0075FF] hover:underline font-semibold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Ajouter un premier produit
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t('admin.deleteConfirm')}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Le produit <span className="font-semibold text-slate-900">« {deleteTarget.name} »</span> ({deleteTarget.sku}) sera retiré définitivement du catalogue et de l'inventaire public.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-red-500/25 transition-all"
                >
                  {t('admin.delete')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
