import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useRouter, Link } from '../../router/Router';
import { storeService } from '../../services/storeService';
import { AdminLayout } from './AdminLayout';
import { 
  Package, 
  Plus, 
  ArrowRight,
  Boxes,
  MessageCircle,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Sparkles,
  CircleDollarSign
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { language, t, formatPrice } = useLanguage();
  const { navigate } = useRouter();

  const metrics = storeService.getDashboardMetrics();
  const recentProducts = storeService.getProducts({ isAdmin: true }).slice(0, 5);
  const recentInquiries = storeService.getInquiries().slice(0, 5);

  const statCards = [
    {
      label: t('admin.totalProducts'),
      value: metrics.totalProducts,
      sub: 'Références au catalogue',
      color: 'from-blue-500 to-cyan-500',
      bg: 'from-blue-500/10 to-cyan-500/5',
      border: 'border-blue-500/20',
      icon: Package,
      iconColor: 'text-blue-500',
    },
    {
      label: t('admin.availableCount'),
      value: metrics.availableProducts,
      sub: 'En rayon immédiatement',
      color: 'from-emerald-500 to-teal-500',
      bg: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-500/20',
      icon: TrendingUp,
      iconColor: 'text-emerald-500',
    },
    {
      label: t('admin.lowStockAlerts'),
      value: metrics.lowStockProducts,
      sub: 'Sous le seuil d\'alerte',
      color: 'from-amber-500 to-orange-500',
      bg: 'from-amber-500/10 to-orange-500/5',
      border: 'border-amber-500/20',
      icon: AlertTriangle,
      iconColor: metrics.lowStockProducts > 0 ? 'text-amber-500' : 'text-slate-400',
    },
    {
      label: t('admin.totalInquiries'),
      value: metrics.totalInquiriesCount,
      sub: 'Clics acheteurs enregistrés',
      color: 'from-violet-500 to-purple-500',
      bg: 'from-violet-500/10 to-purple-500/5',
      border: 'border-violet-500/20',
      icon: MessageCircle,
      iconColor: 'text-violet-500',
    },
  ];

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#0075FF] mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Tableau de Bord
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('admin.dashboard')}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Vue synthétique du stock, alertes d'approvisionnement et flux WhatsApp
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0060DF] hover:to-[#004DB3] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-cyan-400/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>{t('admin.addProduct')}</span>
            </Link>
          </div>
        </div>

        {/* Key Metrics Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-gradient-to-br ${card.bg} border ${card.border} backdrop-blur-sm shadow-sm hover:shadow-md transition-all space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">{card.label}</span>
                  <div className={`w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center shadow-xs`}>
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                </div>
                <div className={`text-3xl font-black tabular-nums bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                  {card.value}
                </div>
                <span className="text-[11px] text-slate-500 block">{card.sub}</span>
              </div>
            );
          })}
        </div>

        {/* Financial & Inventory Value Strip */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0A1128] via-[#0D1B3E] to-[#0A1128] border border-cyan-500/25 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/20 flex items-center justify-center">
                  <CircleDollarSign className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  {t('admin.totalInventoryValue')}
                </span>
              </div>
              <span className="text-3xl sm:text-4xl font-black text-white tabular-nums block">
                {formatPrice(metrics.totalInventoryValueDzd)}
              </span>
              <span className="text-xs text-slate-400 block">
                Valeur marchande cumulée des produits disponibles à la vente
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/admin/inventory"
                className="px-4 py-2.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/25 rounded-xl text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-2 transition-all"
              >
                <Boxes className="w-4 h-4" />
                <span>Gérer les stocks</span>
              </Link>
              <Link
                to="/admin/inventory"
                className="p-2.5 bg-gradient-to-r from-[#0075FF] to-cyan-500 hover:from-cyan-500 hover:to-[#0075FF] text-white rounded-xl transition-all shadow-md shadow-cyan-500/25 hover:scale-105"
              >
                <BarChart3 className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Two-Column Breakdown: Recent Products & Recent Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Col 1: Recently Added / Managed Products */}
          <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Package className="w-3.5 h-3.5 text-[#0075FF]" />
                </div>
                <span>Derniers produits en stock</span>
              </h3>
              <Link to="/admin/products" className="text-xs text-[#0075FF] hover:text-[#0060DF] flex items-center gap-1 font-bold transition-colors group">
                <span>Voir tout</span>
                <ArrowRight className="w-3 h-3 rtl:rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="divide-y divide-slate-50">
              {recentProducts.map((p) => (
                <div
                  key={p.id}
                  className="px-5 py-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/50 transition-colors"
                >
                  <div className="truncate flex-1">
                    <span className="font-semibold text-slate-900 truncate block">{p.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{p.sku} · {p.brand}</span>
                  </div>
                  <div className="text-end shrink-0">
                    <span className="font-bold text-slate-900 block tabular-nums">{formatPrice(p.priceDzd)}</span>
                    <span className={`text-[10px] font-semibold ${
                      p.status === 'available' ? 'text-emerald-600' : p.status === 'reserved' ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {t(`statuses.${p.status}`)} ({p.stockQuantity} pcs)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: Recent WhatsApp Inquiries */}
          <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                </div>
                <span>Demandes WhatsApp récentes</span>
              </h3>
              <Link to="/admin/inquiries" className="text-xs text-[#0075FF] hover:text-[#0060DF] flex items-center gap-1 font-bold transition-colors group">
                <span>Journal</span>
                <ArrowRight className="w-3 h-3 rtl:rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {recentInquiries.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="px-5 py-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="truncate flex-1">
                      <span className="font-semibold text-slate-900 truncate block">{inq.productName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{inq.productSku} · Page: {inq.sourcePage}</span>
                    </div>
                    <div className="text-end shrink-0">
                      <span className="font-semibold text-[#0075FF] block tabular-nums">{formatPrice(inq.priceDzd)}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                  <MessageCircle className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500">
                  Aucune demande WhatsApp enregistrée pour l'instant. Les clics visiteurs apparaîtront ici.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
