import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { storeService } from '../../services/storeService';
import { AdminLayout } from './AdminLayout';
import { ArrowRight, Layers, Tag, ExternalLink } from 'lucide-react';
import { Link } from '../../router/Router';

export const AdminCategoriesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const categories = storeService.getCategories();

  return (
    <AdminLayout activeTab="categories">
      <div className="space-y-6">
        
        {/* Page Header */}
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#0075FF] mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Catalogue
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('admin.categories')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organisation des rayons de la boutique (PC Portables, PC Gamer, Composants, Écrans...)
          </p>
        </div>

        {/* Summary Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 border border-blue-200/80 rounded-xl text-xs font-semibold text-blue-800">
          <Tag className="w-3.5 h-3.5 text-[#0075FF]" />
          <span>{categories.length} catégories actives dans la boutique</span>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((c, idx) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300/60 transition-all group flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-200/60 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-sm font-black text-[#0075FF]">{idx + 1}</span>
                </div>
                <div className="space-y-1 text-xs flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm group-hover:text-[#0075FF] transition-colors">{c.nameFr}</span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-lg">/{c.slug}</span>
                  </div>
                  <div className="text-slate-500 font-medium" dir="rtl">{c.nameAr}</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed truncate">
                    {c.descriptionFr}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-end gap-2.5">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Actif
                </span>
                <Link
                  to={`/categories/${c.slug}`}
                  target="_blank"
                  className="text-[11px] text-[#0075FF] hover:text-[#0060DF] flex items-center gap-1 font-bold transition-colors group/link"
                >
                  <span>Voir le rayon</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
