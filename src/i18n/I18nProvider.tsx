import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readJSON, STORAGE_KEYS, writeJSON } from '../lib/storage';
import { I18nContext, type I18nValue } from './context';
import { DICTIONARIES, type Lang } from './strings';

/** Saved choice first; otherwise Thai unless the browser is set to English. */
function initialLang(): Lang {
  const stored = readJSON<Lang | null>(STORAGE_KEYS.language, null);
  if (stored === 'en' || stored === 'th') return stored;
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'th';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    writeJSON(STORAGE_KEYS.language, next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18nValue>(() => {
    const th = lang === 'th';
    return {
      lang,
      setLang,
      t: DICTIONARIES[lang],
      locale: th ? 'th-TH' : 'en-US',
      appName: (app) => (th && app.nameTh?.trim()) || app.name,
      appDescription: (app) => (th && app.descriptionTh?.trim()) || app.description,
      categoryName: (c) => (th ? c.nameTh : c.name),
      categoryShortName: (c) => (th ? c.shortNameTh : c.shortName),
      categoryDescription: (c) => (th ? c.descriptionTh : c.description),
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
