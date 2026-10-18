import { ArrowRight, Clock, Database, Languages, LayoutGrid, RotateCcw, ShieldAlert, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { useI18n } from '../i18n/useI18n';
import { useHub } from '../state/useHub';

export function SettingsPage() {
  const { apps, favoriteIds, recents, catalogIsCustomised, resetFavorites, clearRecents, resetCatalog, showToast } = useHub();
  const { t } = useI18n();

  return (
    <div className="page page--narrow">
      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">
            <Languages size={18} aria-hidden="true" /> {t.settings.languageTitle}
          </h2>
        </div>
        <p className="panel__text">{t.settings.languageText}</p>
        <LanguageSwitch full />
      </section>

      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">
            <LayoutGrid size={18} aria-hidden="true" /> {t.titles.appManagement}
          </h2>
        </div>
        <p className="panel__text">{t.settings.appMgmtText(apps.length)}</p>
        <Link to="/settings/applications" className="btn btn--primary">
          {t.settings.manageApps} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">
            <Database size={18} aria-hidden="true" /> {t.settings.dataTitle}
          </h2>
        </div>
        <p className="panel__text">{t.settings.dataText}</p>
        <ul className="settings-list">
          <li>
            <Star size={17} aria-hidden="true" />
            <div>
              <p className="settings-list__name">{t.nav.favorites}</p>
              <p className="settings-list__sub">{t.settings.favCount(favoriteIds.length)}</p>
            </div>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                resetFavorites();
                showToast(t.settings.favReset);
              }}
            >
              <RotateCcw size={15} aria-hidden="true" /> {t.settings.resetDefaults}
            </button>
          </li>
          <li>
            <Clock size={17} aria-hidden="true" />
            <div>
              <p className="settings-list__name">{t.nav.recent}</p>
              <p className="settings-list__sub">{t.settings.entries(recents.length)}</p>
            </div>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              disabled={recents.length === 0}
              onClick={() => {
                clearRecents();
                showToast(t.settings.recentCleared);
              }}
            >
              <RotateCcw size={15} aria-hidden="true" /> {t.settings.clear}
            </button>
          </li>
          <li>
            <LayoutGrid size={17} aria-hidden="true" />
            <div>
              <p className="settings-list__name">{t.settings.catalogEdits}</p>
              <p className="settings-list__sub">
                {catalogIsCustomised ? t.settings.catalogCustom : t.settings.catalogDefault}
              </p>
            </div>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              disabled={!catalogIsCustomised}
              onClick={() => {
                resetCatalog();
                showToast(t.settings.catalogRestored);
              }}
            >
              <RotateCcw size={15} aria-hidden="true" /> {t.settings.restore}
            </button>
          </li>
        </ul>
      </section>

      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">
            <ShieldAlert size={18} aria-hidden="true" /> {t.settings.securityTitle}
          </h2>
        </div>
        <p className="panel__text">{t.settings.securityText}</p>
      </section>

      <p className="about">
        Crystal Engineering Corporation · {t.settings.about} · <em>{t.brand.tagline}</em>
      </p>
    </div>
  );
}
