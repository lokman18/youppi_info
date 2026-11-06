import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useRouter } from '../../router/Router';
import { openWhatsAppChat } from '../../services/whatsappService';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const { language, t } = useLanguage();
  const { pathname } = useRouter();

  // Don't show in admin dashboard
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40">
      <button
        onClick={() => openWhatsAppChat({ sourcePage: `floating_${pathname}`, lang: language })}
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1da851] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-[#25D366]/25 hover:shadow-xl hover:shadow-[#25D366]/35 transition-all transform hover:-translate-y-0.5"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
        <span className="hidden sm:inline-block text-xs font-semibold whitespace-nowrap">
          {t('nav.whatsappDirect')}
        </span>
      </button>
    </div>
  );
};
