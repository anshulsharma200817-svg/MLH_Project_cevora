'use client';

import bn from '@/data/locales/bn.json';
import en from '@/data/locales/en.json';
import hi from '@/data/locales/hi.json';
import mr from '@/data/locales/mr.json';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type LanguageCode = 'en' | 'hi' | 'mr' | 'bn';

type LanguageOption = {
  code: LanguageCode;
  label: string;
};

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (text: string, vars?: Record<string, string | number>) => string;
  options: LanguageOption[];
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LANGUAGE_KEY = 'karana.i18n.language';

const options: LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'mr', label: 'Marathi' },
  { code: 'bn', label: 'Bengali' },
];

const dictionaries: Record<LanguageCode, Record<string, string>> = {
  en,
  hi,
  mr,
  bn,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(LANGUAGE_KEY) as LanguageCode | null;
    if (stored && options.some((opt) => opt.code === stored)) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_KEY, code);
    }
  }, []);

  const t = useCallback(
    (text: string, vars?: Record<string, string | number>) => {
      const template = language === 'en' ? text : dictionaries[language]?.[text] ?? text;
      if (!vars) return template;
      return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
    },
    [language]
  );

  const value = useMemo(() => ({ language, setLanguage, t, options }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useI18n must be used within LanguageProvider');
  }
  return context;
}
