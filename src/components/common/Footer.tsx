import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Link } from '../../router/Router';
import { storeService } from '../../services/storeService';
import { openWhatsAppChat } from '../../services/whatsappService';
import { MessageCircle, Phone, MapPin, Clock, ShieldCheck, Truck, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const settings = storeService.getSettings();

  const address = language === 'ar' ? settings.addressAr : settings.address;
  const hours = language === 'ar' ? settings.openingHoursAr : settings.openingHours;

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      {/* Top Value Strip */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#00E5FF] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm mb-1">{t('trust.inspectedTitle')}</p>
                <p className="text-slate-400 leading-relaxed">{t('trust.inspectedDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#00E5FF] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm mb-1">{t('hero.wilayaNotice')}</p>
                <p className="text-slate-400 leading-relaxed">{t('contact.wilayas')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <p className="font-bold text-white text-sm mb-1">{t('trust.whatsappTitle')}</p>
                <p className="text-slate-400 leading-relaxed">{t('trust.whatsappDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Contact */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0A1128] border border-blue-500/30 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo-emblem-transparent.png" 
                  alt="YOUPPI INFO" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                YOUPPI<span className="text-[#0075FF] ms-1">INFO</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footer.aboutSummary')}
            </p>
            <div className="pt-2">
              <button
                onClick={() => openWhatsAppChat({ sourcePage: 'footer', lang: language })}
                className="inline-flex items-center gap-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-750 border border-slate-700/80 px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{settings.phone} (WhatsApp)</span>
              </button>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>{t('nav.offers')}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-white transition-colors">
                  Mentions Légales & Garantie
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {t('footer.categories')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/categories/laptops" className="hover:text-white transition-colors">
                  {t('categories.laptops')}
                </Link>
              </li>
              <li>
                <Link to="/categories/business-laptops" className="hover:text-white transition-colors">
                  ThinkPad & Laptops Pro
                </Link>
              </li>
              <li>
                <Link to="/categories/gaming-pc" className="hover:text-white transition-colors">
                  {t('categories.gamingPc')}
                </Link>
              </li>
              <li>
                <Link to="/categories/gpus" className="hover:text-white transition-colors">
                  {t('categories.components')}
                </Link>
              </li>
              <li>
                <Link to="/categories/monitors" className="hover:text-white transition-colors">
                  Écrans & Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Info & Address */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {t('footer.contactInfo')}
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">{address}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">{hours}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span className="text-slate-300 font-mono">{settings.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} YOUPPI INFO. {t('footer.allRightsReserved')}</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition-colors">Garantie & Audit</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Support Client</Link>
            <Link 
              to="/admin/login" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portail Admin & Stock</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
