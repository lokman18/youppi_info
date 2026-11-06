import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  t: (keyPath: string, vars?: Record<string, string | number>) => string;
  formatPrice: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nexbyte_lang');
    if (saved === 'fr' || saved === 'ar' || saved === 'en') {
      return saved;
    }
    return 'fr'; // default French as specified
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('nexbyte_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (keyPath: string, vars?: Record<string, string | number>): string => {
    const parts = keyPath.split('.');
    let current: any = translations[language];

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to French if not found
        let fallback: any = translations.fr;
        for (const fbPart of parts) {
          if (fallback && typeof fallback === 'object' && fbPart in fallback) {
            fallback = fallback[fbPart];
          } else {
            return keyPath;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string') {
      return keyPath;
    }

    let text = current;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
      });
    }

    return text;
  };

  const formatPrice = (amount: number): string => {
    if (typeof amount !== 'number' || isNaN(amount)) return '0 DA';
    
    // Format with thin space as thousands separator
    const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    if (language === 'ar') {
      return `${formatted} دج`;
    } else if (language === 'en') {
      return `${formatted} DZD`;
    }
    return `${formatted} DA`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
