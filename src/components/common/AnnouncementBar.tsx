import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { storeService } from '../../services/storeService';
import { X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);
  const settings = storeService.getSettings();

  if (!settings.isAnnouncementEnabled || dismissed) return null;

  const text = language === 'ar' ? settings.announcementTextAr : settings.announcementText;
  if (!text) return null;

  return (
    <div className="relative z-40 bg-gradient-to-r from-sky-50 via-blue-50 to-cyan-50 border-b border-blue-200/70 py-2 px-4 text-xs font-medium text-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center truncate">
          <span className="inline-block text-[#0075FF] font-bold me-2 tracking-wide uppercase text-[11px] px-2 py-0.5 rounded bg-blue-100/80 border border-blue-200">
            {language === 'ar' ? 'إعلان هام' : 'INFO'}
          </span>
          <span className="text-slate-700 font-medium">{text}</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-700 p-1 transition-colors shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
