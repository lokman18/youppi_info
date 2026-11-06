import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { storeService } from '../../services/storeService';
import { AdminLayout } from './AdminLayout';
import { Product } from '../../types';
import { 
  Plus, 
  Minus, 
  CheckCircle2, 
  BookmarkCheck, 
  Search,
  Boxes,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  X
} from 'lucide-react';

export const AdminInventoryPage: React.FC = () => {
  const { language, t, formatPrice } = useLanguage();
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [search, setSearch] = useState('');
  
  // Stock adjustment modal state
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjDelta, setAdjDelta] = useState<number>(1);
  const [adjType, setAdjType] = useState<'stock_in' | 'stock_out' | 'sale' | 'reservation' | 'adjustment'>('stock_in');
  const [adjReason, setAdjReason] = useState('Réception nouvelle pièce');
  const [adjRef, setAdjRef] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const products = storeService.getProducts({ search, isAdmin: true });
  const movements = storeService.getInventoryMovements();

  const handleOpenAdjust = (p: Product, type: 'stock_in' | 'stock_out' | 'sale' | 'reservation' | 'adjustment') => {
    setAdjustingProduct(p);
    setAdjType(type);
    setAdjDelta(type === 'stock_out' || type === 'sale' ? -1 : 1);
    setAdjReason(
      type === 'stock_in' ? 'Arrivage atelier' :
      type === 'sale' ? 'Vente magasin / WhatsApp confirmée' :
      type === 'reservation' ? 'Réservé pour client (acompte ou envoi)' :
      'Ajustement d\'inventaire manuel'
    );
    setAdjRef('');
  };

  const handleConfirmAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;

    storeService.adjustStock(
      adjustingProduct.id,
      adjDelta,
      adjReason,
      adjType,
      adjRef
    );

    setAdjustingProduct(null);
    setRefreshKey(k => k + 1);
    setToastMsg(t('admin.stockAdjusted'));
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <AdminLayout activeTab="inventory">
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#0075FF] mb-1 flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5" />
              Gestion du Stock
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('admin.inventory')}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Suivi en temps réel des unités physiques, mouvements et réservations clients
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs shadow-sm shrink-0">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'current' 
                  ? 'bg-gradient-to-r from-[#0075FF] to-[#0060DF] text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Stock Actuel
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'history' 
                  ? 'bg-gradient-to-r from-[#0075FF] to-[#0060DF] text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Historique ({movements.length})
            </button>
          </div>
        </div>

        {toastMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{toastMsg}</span>
          </div>
        )}

        {activeTab === 'current' ? (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filtrer l'inventaire par SKU, nom..."
                className="w-full bg-white border border-slate-200 rounded-xl ps-9 pe-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
              />
            </div>

            {/* Inventory Table */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-50/80 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-mono text-[11px]">
                    <tr>
                      <th className="px-5 py-3.5 text-start font-bold">SKU</th>
                      <th className="px-5 py-3.5 text-start font-bold">Produit</th>
                      <th className="px-5 py-3.5 text-start font-bold">État</th>
                      <th className="px-5 py-3.5 text-start font-bold">Prix Vente</th>
                      <th className="px-5 py-3.5 text-start font-bold">Quantité</th>
                      <th className="px-5 py-3.5 text-start font-bold">Statut</th>
                      <th className="px-5 py-3.5 text-end font-bold">Ajustements</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                          {p.sku}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-slate-900 max-w-xs truncate group-hover:text-[#0075FF] transition-colors">
                          {p.name}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">
                          {t(`conditions.${p.condition}`)}
                        </td>
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-900 tabular-nums">
                          {formatPrice(p.priceDzd)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                            p.stockQuantity === 0 
                              ? 'bg-red-50 text-red-700 border border-red-100' 
                              : p.stockQuantity <= p.lowStockThreshold 
                              ? 'bg-amber-50 text-amber-800 border border-amber-100' 
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                          }`}>
                            {p.stockQuantity} unité(s)
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[11px] font-semibold ${
                            p.status === 'available' ? 'text-emerald-600' : p.status === 'reserved' ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {t(`statuses.${p.status}`)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenAdjust(p, 'stock_in')}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all hover:scale-105"
                              title="Entrée de stock (+1)"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Entrée</span>
                            </button>

                            <button
                              onClick={() => handleOpenAdjust(p, 'reservation')}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all hover:scale-105"
                              title="Réserver pour un client"
                            >
                              <BookmarkCheck className="w-3 h-3" />
                              <span>Réserver</span>
                            </button>

                            <button
                              onClick={() => handleOpenAdjust(p, 'sale')}
                              disabled={p.stockQuantity <= 0}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-lg text-[11px] font-bold flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105"
                              title="Enregistrer une vente (-1)"
                            >
                              <Minus className="w-3 h-3" />
                              <span>Vente</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Mouvements History Table */
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                <History className="w-3.5 h-3.5 text-[#0075FF]" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Historique des mouvements de stock</h3>
              <span className="text-xs text-slate-400 font-mono ml-auto">{movements.length} enregistrements</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-50/80 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-mono text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5 text-start font-bold">Date & Heure</th>
                    <th className="px-5 py-3.5 text-start font-bold">Produit</th>
                    <th className="px-5 py-3.5 text-start font-bold">SKU</th>
                    <th className="px-5 py-3.5 text-start font-bold">Type</th>
                    <th className="px-5 py-3.5 text-start font-bold">Variation</th>
                    <th className="px-5 py-3.5 text-start font-bold">Stock résultant</th>
                    <th className="px-5 py-3.5 text-start font-bold">Motif / Référence</th>
                    <th className="px-5 py-3.5 text-end font-bold">Auteur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {movements.map((m) => (
                    <tr key={m.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(m.createdAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900 max-w-xs truncate">
                        {m.productName}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-500">
                        {m.productSku}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          m.movementType === 'stock_in' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                            : m.movementType === 'sale'
                            ? 'bg-blue-50 text-blue-800 border border-blue-100'
                            : m.movementType === 'reservation'
                            ? 'bg-amber-50 text-amber-800 border border-amber-100'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {m.quantityDelta >= 0 
                            ? <ArrowUpRight className="w-3 h-3" /> 
                            : <ArrowDownLeft className="w-3 h-3" />
                          }
                          {m.movementType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold tabular-nums">
                        <span className={m.quantityDelta >= 0 ? 'text-emerald-700' : 'text-red-700'}>
                          {m.quantityDelta >= 0 ? `+${m.quantityDelta}` : m.quantityDelta}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-800 tabular-nums font-semibold">
                        {m.resultingQuantity} pcs
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">
                        {m.reason} {m.reference && <span className="text-slate-400 font-mono">({m.reference})</span>}
                      </td>
                      <td className="px-5 py-3.5 text-end text-slate-400 font-mono text-[11px]">
                        {m.createdBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stock Adjustment Modal */}
        {adjustingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Mouvement de stock
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {adjustingProduct.name} · SKU: {adjustingProduct.sku} · Stock actuel : <span className="font-bold text-slate-700">{adjustingProduct.stockQuantity} pcs</span>
                  </p>
                </div>
                <button onClick={() => setAdjustingProduct(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmAdjust} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Type d'opération</label>
                  <select
                    value={adjType}
                    onChange={(e) => setAdjType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="stock_in">Entrée de stock (Arrivage / Réception)</option>
                    <option value="stock_out">Sortie de stock (Retour / Retrait)</option>
                    <option value="sale">Vente client</option>
                    <option value="reservation">Réservation client</option>
                    <option value="adjustment">Inventaire physique / Régularisation</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Variation de quantité (+ ou -)</label>
                  <input
                    type="number"
                    required
                    value={adjDelta}
                    onChange={(e) => setAdjDelta(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Motif du mouvement *</label>
                  <input
                    type="text"
                    required
                    value={adjReason}
                    onChange={(e) => setAdjReason(e.target.value)}
                    placeholder="Ex: Vente comptoir, arrivage conteneur..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Référence (Optionnelle)</label>
                  <input
                    type="text"
                    value={adjRef}
                    onChange={(e) => setAdjRef(e.target.value)}
                    placeholder="Ex: Facture #1042, BL-2026-X"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAdjustingProduct(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    {t('admin.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0060DF] hover:to-[#004DB3] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all"
                  >
                    Valider le mouvement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
