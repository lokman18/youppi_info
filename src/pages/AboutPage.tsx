import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from '../router/Router';
import { openWhatsAppChat } from '../services/whatsappService';
import { 
  ShieldCheck, 
  Cpu, 
  Flame, 
  BatteryCharging, 
  Camera, 
  MessageCircle, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Intro Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-200 rounded-md text-xs font-semibold text-[#0075FF] shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Matériel Informatique Certifié en Algérie</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('about.title')}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {t('about.subtitle')}
        </p>
      </div>

      {/* Mission Section */}
      <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-[#0075FF]" />
          <span>{t('about.missionTitle')}</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {t('about.missionText')}
        </p>
      </div>

      {/* Benchmarks & Inspection Protocol */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            {t('about.benchmarksTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Un protocole standardisé en 4 étapes pour chaque machine qui entre dans notre stock
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0075FF] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('about.step1Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('about.step1Desc')}</p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0075FF] flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('about.step2Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('about.step2Desc')}</p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0075FF] flex items-center justify-center">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('about.step3Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('about.step3Desc')}</p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0075FF] flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('about.step4Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('about.step4Desc')}</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-50/80 via-slate-50 to-cyan-50/80 border border-blue-200/80 text-center space-y-4 shadow-xs">
        <h3 className="text-xl font-bold text-slate-900">Besoin d’un conseil pour votre prochain ordinateur ?</h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Nos techniciens vous accompagnent selon vos besoins réels (bureautique, programmation, CAO/DAO ou gaming).
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <button
            onClick={() => openWhatsAppChat({ sourcePage: 'about_cta', lang: language })}
            className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-xl shadow-md shadow-[#25D366]/25 flex items-center gap-2 cursor-pointer transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('contact.openWhatsApp')}</span>
          </button>
          <Link
            to="/products"
            className="px-6 py-3 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0066E0] hover:to-[#004EC2] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all"
          >
            <span>{t('hero.ctaPrimary')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};
