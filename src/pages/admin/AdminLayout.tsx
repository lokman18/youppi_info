import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useRouter, Link } from '../../router/Router';
import { authService } from '../../services/authService';
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  Layers, 
  MessageCircle, 
  Settings, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'products' | 'inventory' | 'categories' | 'inquiries' | 'settings';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const { language, t } = useLanguage();
  const { navigate, pathname } = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const isClerk = currentUser?.role === 'inventory_clerk';

  const navItems = isClerk
    ? [
        { id: 'inventory', label: t('clerk.title'), icon: Boxes, path: '/stock' },
        { id: 'products', label: language === 'ar' ? 'إضافة وحذف العتاد' : 'Gestion des Matériels', icon: Package, path: '/admin/products' },
        { id: 'inventory_history', label: language === 'ar' ? 'سجل حركات المخزون' : 'Mouvements de Stock', icon: Boxes, path: '/admin/inventory' },
      ]
    : [
        { id: 'dashboard', label: t('admin.dashboard'), icon: LayoutDashboard, path: '/admin' },
        { id: 'products', label: t('admin.products'), icon: Package, path: '/admin/products' },
        { id: 'inventory', label: t('admin.inventory'), icon: Boxes, path: '/admin/inventory' },
        { id: 'stock_clerk', label: language === 'ar' ? 'واجهة أمين المخزن' : 'Guichet Stockiste (Entrée/Sortie)', icon: Boxes, path: '/stock' },
        { id: 'categories', label: t('admin.categories'), icon: Layers, path: '/admin/categories' },
        { id: 'inquiries', label: t('admin.inquiries'), icon: MessageCircle, path: '/admin/inquiries' },
        { id: 'settings', label: t('admin.settings'), icon: Settings, path: '/admin/settings' },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/20 to-slate-100 flex flex-col md:flex-row text-slate-800">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0A1128] border-b border-cyan-500/20 sticky top-0 z-40 shadow-lg shadow-cyan-900/20">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#0A1128] border border-blue-500/30 overflow-hidden flex items-center justify-center shadow-md shadow-blue-500/30">
            <img src="/logo-emblem-transparent.png" alt="YOUPPI" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-sm font-black tracking-tight text-white block leading-none">YOUPPI INFO</span>
            <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider">Admin Portal</span>
          </div>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-cyan-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 z-40 w-64 bg-[#0A1128] border-r rtl:border-r-0 rtl:border-l border-cyan-500/15 flex flex-col justify-between transition-transform duration-300 shadow-2xl shadow-cyan-900/30
        md:static md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'}
      `}>
        
        {/* Sidebar Header */}
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-cyan-500/10">
            {/* Brand */}
            <div className="flex items-center justify-between mb-5">
              <Link to="/admin" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-xl bg-[#0A1128] border border-blue-500/30 overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-400/50 transition-all">
                  <img src="/logo-emblem-transparent.png" alt="YOUPPI INFO" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-sm font-black tracking-tight text-white block leading-none">YOUPPI INFO</span>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">Admin Portal</span>
                </div>
              </Link>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Indicator */}
            <div className="px-3 py-2 bg-white/5 border border-cyan-500/15 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400/50 animate-pulse" />
              <span className="truncate font-mono">Stockage Local · Supabase Ready</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest px-3 pt-3 pb-2">
              Navigation
            </p>
            {navItems.map((item) => {
              const active = activeTab === item.id;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-xs group relative ${
                    active
                      ? 'bg-gradient-to-r from-[#0075FF] to-[#0060DF] text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    active ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate font-semibold">{item.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-cyan-500/10 space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0075FF] to-cyan-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-cyan-500/30 shrink-0">
                {(currentUser?.displayName || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {currentUser?.displayName || 'Admin'}
                </p>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  {currentUser?.role === 'super_admin' ? 'Super Admin' : currentUser?.role === 'inventory_clerk' ? 'Stock Clerk' : 'Manager'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              {!isClerk && (
                <Link
                  to="/stock"
                  className="w-full py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-xl text-[11px] font-semibold flex items-center justify-between transition-all"
                >
                  <span>{language === 'ar' ? 'لوحة أمين المخزن' : 'Terminal Entrepôt'}</span>
                  <span className="font-mono text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-lg font-bold">IN/OUT</span>
                </Link>
              )}

              <div className="flex items-center justify-between gap-2">
                <Link
                  to="/"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 text-[11px] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Voir la boutique</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-[11px] transition-colors font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('admin.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
