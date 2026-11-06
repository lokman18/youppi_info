import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useRouter, Link } from '../../router/Router';
import { storeService } from '../../services/storeService';
import { authService } from '../../services/authService';
import { Product } from '../../types';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Package, 
  Search, 
  Plus, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  LogOut, 
  Shield, 
  History, 
  Edit2, 
  Trash2,
  Boxes,
  TrendingUp,
  TrendingDown,
  X,
  Sparkles
} from 'lucide-react';

export const StockClerkDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { navigate } = useRouter();
  const currentUser = authService.getCurrentUser();

  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'available' | 'low_stock' | 'sold'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Delete Material Modal State
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Quick Action Modal State (Entrée or Sortie)
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'in' | 'out'>('in');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  const confirmDelete = () => {
    if (!deleteTarget) return;
    storeService.deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
    setRefreshKey(k => k + 1);
    showToast(
      language === 'ar'
        ? 'تم حذف هذا العتاد نهائياً من المخزن والكتالوج.'
        : 'Le matériel a été définitivement retiré du stock et du catalogue.'
    );
  };

  const allProducts = useMemo(() => {
    return storeService.getProducts({ isAdmin: false });
  }, [refreshKey]);

  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.nameAr && p.nameAr.includes(q)) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }

    if (filterMode === 'available') {
      list = list.filter(p => p.stockQuantity > 0 && p.status === 'available');
    } else if (filterMode === 'low_stock') {
      list = list.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold);
    } else if (filterMode === 'sold') {
      list = list.filter(p => p.stockQuantity === 0 || p.status === 'sold');
    }

    return list;
  }, [allProducts, search, filterMode]);

  const movements = useMemo(() => {
    return storeService.getInventoryMovements().slice(0, 8);
  }, [refreshKey]);

  // Total summary metrics
  const totalItemsCount = allProducts.reduce((acc, p) => acc + p.stockQuantity, 0);
  const availableReferencesCount = allProducts.filter(p => p.stockQuantity > 0).length;
  const lowStockCount = allProducts.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold).length;
  const outOfStockCount = allProducts.filter(p => p.stockQuantity === 0).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenActionModal = (type: 'in' | 'out', preselectedId?: string) => {
    setActionType(type);
    setSelectedProductId(preselectedId || (filteredProducts[0]?.id ?? ''));
    setQuantity(1);
    setReason(
      type === 'in' 
        ? (language === 'ar' ? 'استلام شحنة جديدة بالمخزن' : 'Réception nouvel arrivage matériel')
        : (language === 'ar' ? 'تسليم طلبية / بيع مباشر للزبون' : 'Vente magasin / Sortie client')
    );
    setReference('');
    setModalOpen(true);
  };

  const handleQuickDelta = (product: Product, delta: number) => {
    const isOut = delta < 0;
    const absQty = Math.abs(delta);

    if (isOut && product.stockQuantity < absQty) {
      alert(language === 'ar' ? 'الكمية المتوفرة بالمخزن غير كافية لإجراء الخروج.' : 'Quantité en stock insuffisante pour effectuer cette sortie.');
      return;
    }

    const type = isOut ? 'stock_out' : 'stock_in';
    const reasonText = isOut
      ? (language === 'ar' ? 'إخراج سريع (-1) / بيع' : 'Sortie rapide (-1) / Vente')
      : (language === 'ar' ? 'إدخال سريع (+1) / استلام' : 'Entrée rapide (+1) / Arrivage');

    storeService.adjustStock(
      product.id,
      delta,
      reasonText,
      type,
      'ACTION_RAPIDE'
    );

    setRefreshKey(k => k + 1);
    showToast(
      isOut 
        ? t('clerk.successOut', { qty: absQty }) 
        : t('clerk.successIn', { qty: absQty })
    );
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || quantity <= 0) return;

    const targetProduct = allProducts.find(p => p.id === selectedProductId);
    if (!targetProduct) return;

    const delta = actionType === 'in' ? quantity : -quantity;

    if (actionType === 'out' && targetProduct.stockQuantity < quantity) {
      alert(language === 'ar' ? 'الكمية المتوفرة في المخزن أقل من المطلوب إخراجه.' : 'Quantité demandée supérieure au stock disponible.');
      return;
    }

    const movementType = actionType === 'in' ? 'stock_in' : 'sale';

    storeService.adjustStock(
      targetProduct.id,
      delta,
      reason || (actionType === 'in' ? 'Entrée stock' : 'Sortie stock'),
      movementType,
      reference || undefined
    );

    setModalOpen(false);
    setRefreshKey(k => k + 1);
    showToast(
      actionType === 'in'
        ? t('clerk.successIn', { qty: quantity })
        : t('clerk.successOut', { qty: quantity })
    );
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const statCards = [
    {
      label: language === 'ar' ? 'إجمالي القطع بالمخزن' : 'Total Pièces en Stock',
      value: totalItemsCount,
      sub: `${availableReferencesCount} références distinctes`,
      color: 'from-blue-500 to-cyan-500',
      bg: 'from-blue-500/10 to-cyan-500/5',
      border: 'border-blue-500/20',
      icon: Boxes,
      unit: 'unités',
    },
    {
      label: language === 'ar' ? 'أجهزة متوفرة للبيع' : 'Produits Disponibles',
      value: availableReferencesCount,
      sub: language === 'ar' ? 'جاهزة للتسليم الفوري' : 'Prêts pour expédition',
      color: 'from-emerald-500 to-teal-500',
      bg: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-500/20',
      icon: TrendingUp,
    },
    {
      label: language === 'ar' ? 'تنبيهات انخفاض المخزون' : 'Alertes Stock Faible',
      value: lowStockCount,
      sub: language === 'ar' ? 'تحت حد إعادة الطلب' : 'Sous le seuil d\'alerte',
      color: lowStockCount > 0 ? 'from-amber-500 to-orange-500' : 'from-slate-400 to-slate-500',
      bg: 'from-amber-500/10 to-orange-500/5',
      border: 'border-amber-500/20',
      icon: AlertTriangle,
    },
    {
      label: language === 'ar' ? 'سلع نفدت من المخزن' : 'Rupture / Vendus',
      value: outOfStockCount,
      sub: language === 'ar' ? 'بحاجة لتجديد التوريد' : 'Nécessite réassort',
      color: 'from-red-500 to-rose-500',
      bg: 'from-red-500/10 to-rose-500/5',
      border: 'border-red-500/20',
      icon: TrendingDown,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/20 to-slate-100 text-slate-900 flex flex-col">
      
      {/* Top Warehouse Header */}
      <header className="bg-[#0A1128] border-b border-cyan-500/15 sticky top-0 z-40 shadow-xl shadow-cyan-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand & Role Monogram */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A1128] border border-blue-500/30 overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
              <img src="/logo-emblem-transparent.png" alt="YI" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-white">YOUPPI INFO</span>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                  {t('clerk.badge')}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block leading-tight font-medium">
                {currentUser?.displayName || (language === 'ar' ? 'أمين المخزن' : 'Agent Entrepôt')}
              </span>
            </div>
          </div>

          {/* Quick Actions in Navbar */}
          <div className="flex items-center gap-2">
            {/* Add New Matériel button */}
            <Link
              to="/admin/products/new"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0060DF] hover:to-[#004DB3] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/30 transition-all whitespace-nowrap hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'ar' ? 'إضافة عتاد جديد' : 'Ajouter un Matériel'}</span>
              <span className="sm:hidden">+</span>
            </Link>

            <button
              onClick={() => handleOpenActionModal('in')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all whitespace-nowrap hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">{t('clerk.quickIn')}</span>
              <span className="sm:hidden">Entrée</span>
            </button>

            <button
              onClick={() => handleOpenActionModal('out')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all whitespace-nowrap hover:scale-105"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">{t('clerk.quickOut')}</span>
              <span className="sm:hidden">Sortie</span>
            </button>

            {/* Link to Full Catalog */}
            <Link
              to="/admin/products"
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              title={language === 'ar' ? 'عرض وإدارة جميع المنتجات' : 'Voir tous les produits'}
            >
              <Package className="w-4 h-4" />
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-white/10 transition-colors"
              title={t('admin.logout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Operational Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        
        {/* Page Title */}
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-600 mb-1 flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5" />
            Terminal Entrepôt
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('clerk.title')}
          </h1>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-4 bg-blue-50/80 border border-blue-200/70 rounded-2xl flex items-start gap-3 text-xs text-slate-700 shadow-sm">
          <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <Shield className="w-3.5 h-3.5 text-[#0075FF]" />
          </div>
          <div className="leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">
              {language === 'ar' ? 'واجهة تشغيلية آمنة ومخصصة للمخزن' : 'Terminal Opérationnel Entrepôt Sécurisé'}
            </span>
            <p className="text-slate-600">
              {t('clerk.restrictedNotice')}
            </p>
          </div>
        </div>

        {/* Inventory Metric Counters Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-gradient-to-br ${card.bg} border ${card.border} shadow-sm hover:shadow-md transition-all space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider leading-tight">
                    {card.label}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
                <div className={`text-3xl font-black tabular-nums bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                  {card.value}
                  {card.unit && <span className="text-sm font-normal ml-1 text-slate-400">{card.unit}</span>}
                </div>
                <span className="text-[11px] text-slate-500 block">{card.sub}</span>
              </div>
            );
          })}
        </div>

        {/* Search & Mode Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('clerk.searchPlaceholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-9 pe-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Quick Segmented Filter */}
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 p-1 rounded-xl text-xs w-full md:w-auto overflow-x-auto">
            {[
              { key: 'all', label: `${language === 'ar' ? 'الكل' : 'Tous'} (${allProducts.length})`, activeColor: 'bg-gradient-to-r from-[#0075FF] to-[#0060DF]' },
              { key: 'available', label: language === 'ar' ? 'المتوفر' : 'En Stock', activeColor: 'bg-emerald-600' },
              { key: 'low_stock', label: `${language === 'ar' ? 'مخزون منخفض' : 'Stock Faible'} (${lowStockCount})`, activeColor: 'bg-amber-600' },
              { key: 'sold', label: language === 'ar' ? 'نفذت / بيعت' : 'Épuisés', activeColor: 'bg-red-600' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterMode(f.key as any)}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                  filterMode === f.key ? `${f.activeColor} text-white shadow-sm` : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Operations Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-50/80 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-mono text-[11px]">
                <tr>
                  <th className="px-5 py-3.5 text-start font-bold">SKU / Réf</th>
                  <th className="px-5 py-3.5 text-start font-bold">Désignation du Matériel</th>
                  <th className="px-5 py-3.5 text-start font-bold">État</th>
                  <th className="px-5 py-3.5 text-start font-bold">Quantité Actuelle</th>
                  <th className="px-5 py-3.5 text-start font-bold">Statut</th>
                  <th className="px-5 py-3.5 text-end font-bold">Action Rapide d'Entrepôt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const primaryImg = p.images.find(i => i.isPrimary) || p.images[0];
                    const isLow = p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;
                    const isOut = p.stockQuantity === 0;

                    return (
                      <tr key={p.id} className="hover:bg-blue-50/20 transition-colors group">
                        
                        {/* SKU */}
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                          {p.sku}
                        </td>

                        {/* Product Title & Brand */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                              {primaryImg?.url ? (
                                <img src={primaryImg.url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold">NB</div>
                              )}
                            </div>
                            <div className="truncate max-w-sm">
                              <span className="font-semibold text-slate-900 truncate block group-hover:text-[#0075FF] transition-colors">
                                {language === 'ar' && p.nameAr ? p.nameAr : p.name}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {p.brand} · {p.specifications.cpu || p.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Condition */}
                        <td className="px-5 py-3.5 text-slate-500">
                          {t(`conditions.${p.condition}`)}
                        </td>

                        {/* Current Stock Quantity */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-black font-mono tabular-nums px-2.5 py-1 rounded-lg ${
                              isOut 
                                ? 'bg-red-50 text-red-700 border border-red-100' 
                                : isLow 
                                ? 'bg-amber-50 text-amber-800 border border-amber-100' 
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                            }`}>
                              {p.stockQuantity}
                            </span>
                            <span className="text-[11px] text-slate-400">pcs</span>
                          </div>
                        </td>

                        {/* Stock Status Badge */}
                        <td className="px-5 py-3.5">
                          <span className={`text-[11px] font-semibold ${
                            p.status === 'available' ? 'text-emerald-600' : p.status === 'reserved' ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {t(`statuses.${p.status}`)}
                          </span>
                        </td>

                        {/* Fast Warehouse Actions */}
                        <td className="px-5 py-3.5 text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* One-Click +1 IN */}
                            <button
                              onClick={() => handleQuickDelta(p, 1)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 hover:scale-105"
                              title="Ajouter 1 pièce en stock"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>1</span>
                            </button>

                            {/* One-Click -1 OUT */}
                            <button
                              onClick={() => handleQuickDelta(p, -1)}
                              disabled={p.stockQuantity <= 0}
                              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
                              title="Retirer 1 pièce du stock"
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>1</span>
                            </button>

                            {/* Detailed Custom In/Out Action */}
                            <button
                              onClick={() => handleOpenActionModal('in', p.id)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
                              title={language === 'ar' ? 'حركة مخصصة' : 'Mouvement'}
                            >
                              {language === 'ar' ? 'حركة' : 'Mouv.'}
                            </button>

                            {/* Edit Matériel */}
                            <Link
                              to={`/admin/products/${p.id}/edit`}
                              className="p-1.5 text-slate-400 hover:text-[#0075FF] rounded-lg hover:bg-blue-50 transition-colors"
                              title={language === 'ar' ? 'تعديل هذا العتاد' : 'Modifier ce matériel'}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Link>

                            {/* Remove / Delete Matériel */}
                            <button
                              onClick={() => setDeleteTarget(p)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title={language === 'ar' ? 'حذف هذا العتاد نهائياً من المخزن' : 'Supprimer ce matériel du stock'}
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
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                          <Package className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">
                          {language === 'ar' ? 'لا توجد سلع تطابق معايير البحث الحالية.' : 'Aucun article trouvé.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Operations Log Audit */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                <History className="w-3.5 h-3.5 text-[#0075FF]" />
              </div>
              <span>{t('clerk.recentOps')}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {movements.length} dernières actions
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            {movements.length > 0 ? movements.map((m) => (
              <div
                key={m.id}
                className="px-5 py-3.5 flex items-center justify-between gap-4 text-xs hover:bg-blue-50/10 transition-colors"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    m.quantityDelta >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {m.quantityDelta >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-slate-900 truncate block">{m.productName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {m.productSku} · {m.reason} {m.reference && `(${m.reference})`}
                    </span>
                  </div>
                </div>

                <div className="text-end shrink-0">
                  <span className={`text-sm font-bold font-mono block tabular-nums ${
                    m.quantityDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {m.quantityDelta >= 0 ? `+${m.quantityDelta}` : m.quantityDelta} pcs
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Stock après : {m.resultingQuantity} · {new Date(m.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )) : (
              <div className="px-6 py-8 text-center text-xs text-slate-400">
                Aucun mouvement enregistré.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quick In / Out Dedicated Action Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            
            {/* Modal Title */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
                  actionType === 'in' ? 'bg-emerald-600 shadow-emerald-500/30' : 'bg-rose-600 shadow-rose-500/30'
                }`}>
                  {actionType === 'in' ? <Plus className="w-5 h-5 stroke-[2.5]" /> : <Minus className="w-5 h-5 stroke-[2.5]" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {actionType === 'in' ? t('clerk.actionTitleIn') : t('clerk.actionTitleOut')}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {actionType === 'in' ? 'Augmentation du stock disponible' : 'Diminution du stock disponible'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="space-y-4 text-xs">
              
              {/* Product Select */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  {t('clerk.selectProduct')} *
                </label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.sku}] {p.name} (Stock actuel : {p.stockQuantity} pcs)
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Stepper */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  {t('clerk.quantity')} *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-mono font-bold text-center text-base focus:outline-none focus:border-[#0075FF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Reason Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  {language === 'ar' ? 'سبب العملية / الملاحظة' : 'Motif de l\'opération'} *
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t('clerk.reasonPlaceholder')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Document Reference */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  {language === 'ar' ? 'رقم الوصل أو الفاتورة (اختياري)' : 'Référence document (Optionnel)'}
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder={t('clerk.refPlaceholder')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Warning if stock out to 0 */}
              {actionType === 'out' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{t('clerk.emptyStockWarning')}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105 ${
                    actionType === 'in'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/25'
                  }`}
                >
                  {actionType === 'in' ? t('clerk.confirmIn') : t('clerk.confirmOut')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Stockkeeper */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'ar' ? 'تأكيد حذف العتاد من المخزن' : 'Confirmer le retrait du matériel'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {language === 'ar'
                    ? `هل أنت متأكد من رغبتك في حذف الجهاز « ${deleteTarget.name} » (${deleteTarget.sku}) نهائياً من قاعدة بيانات المخزن؟`
                    : `Êtes-vous sûr de vouloir supprimer définitivement le matériel « ${deleteTarget.name} » (${deleteTarget.sku}) de l'inventaire ?`}
                </p>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                {t('admin.cancel')}
              </button>
              <button
                type="button"
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
  );
};
