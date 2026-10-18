import { createContext } from 'react';
import type { AppDefinition, CategoryDefinition } from '../config/types';
import type { Dict, Lang } from './strings';

export interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
  /** BCP-47 locale for Intl APIs. */
  locale: string;
  /** Localised application name / description (falls back to English). */
  appName: (app: AppDefinition) => string;
  appDescription: (app: AppDefinition) => string;
  categoryName: (category: CategoryDefinition) => string;
  categoryShortName: (category: CategoryDefinition) => string;
  categoryDescription: (category: CategoryDefinition) => string;
}

export const I18nContext = createContext<I18nValue | null>(null);
