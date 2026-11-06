import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from '../router/Router';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-white border border-blue-200 flex items-center justify-center mx-auto text-[#0075FF] shadow-xs">
        <span className="text-2xl font-black font-mono">404</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Page introuvable</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        La page que vous recherchez a été déplacée ou n'existe plus dans le catalogue YOUPPI INFO.
      </p>
      <div className="pt-2 flex justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0066E0] hover:to-[#004EC2] text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-500/25 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Retour à l’accueil</span>
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs"
        >
          <span>Voir le catalogue</span>
        </Link>
      </div>
    </div>
  );
};
