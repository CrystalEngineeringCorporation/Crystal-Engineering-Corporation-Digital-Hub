import { Languages } from 'lucide-react';
import { LANGUAGES } from '../i18n/strings';
import { useI18n } from '../i18n/useI18n';

/** Segmented TH / EN switch. `full` shows the language names (used on the Settings page). */
export function LanguageSwitch({ full = false }: { full?: boolean }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div className={`lang-switch${full ? ' lang-switch--full' : ''}`} role="group" aria-label={t.common.language}>
      {!full && <Languages size={16} className="lang-switch__icon" aria-hidden="true" />}
      {LANGUAGES.map((l) => (
        <button
          key={l.id}
          type="button"
          lang={l.id}
          className={`lang-switch__btn${lang === l.id ? ' is-active' : ''}`}
          aria-pressed={lang === l.id}
          title={l.label}
          onClick={() => setLang(l.id)}
        >
          {full ? l.label : l.short}
        </button>
      ))}
    </div>
  );
}
