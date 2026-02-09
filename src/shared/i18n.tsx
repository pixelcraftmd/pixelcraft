import React, { createContext, useContext, useMemo, useState } from 'react';

export type Lang = 'ru' | 'ro' | 'en';

type TranslationValue = string | Partial<Record<Lang, string>>;

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (value: TranslationValue) => string;
};

const LANG_KEY = 'portalpixel_lang';

const I18nContext = createContext<I18nContextValue | null>(null);

const normalizeLang = (value: string | null): Lang => {
  if (value === 'en' || value === 'ro' || value === 'ru') return value;
  return 'ru';
};

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'ru';
    return normalizeLang(window.localStorage.getItem(LANG_KEY));
  });

  const setLang = (next: Lang) => {
    setLangState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANG_KEY, next);
      document.documentElement.lang = next;
    }
  };

  const t = useMemo(
    () => (value: TranslationValue) => {
      if (typeof value === 'string') return value;
      return value[lang] || value.ru || value.en || '';
    },
    [lang]
  );

  const contextValue = useMemo<I18nContextValue>(
    () => ({ lang, setLang, t }),
    [lang, t]
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
