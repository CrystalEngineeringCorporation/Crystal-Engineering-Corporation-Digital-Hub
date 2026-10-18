import { ArrowUpRight, Settings2, Star } from 'lucide-react';
import { getCategory } from '../config/categories';
import type { AppDefinition } from '../config/types';
import { useI18n } from '../i18n/useI18n';
import { getAvailability } from '../lib/launcher';
import { useHub } from '../state/useHub';
import { AppIcon } from './AppIcon';
import { StatusBadge } from './StatusBadge';

interface Props {
  app: AppDefinition;
  variant?: 'full' | 'compact';
  meta?: string;
}

export function AppCard({ app, variant = 'full', meta }: Props) {
  const { launch, isFavorite, toggleFavorite } = useHub();
  const { t, appName, appDescription, categoryShortName } = useI18n();
  const name = appName(app);
  const availability = getAvailability(app);
  const launchable = availability === 'ready' || availability === 'beta' || availability === 'maintenance';
  const favorite = isFavorite(app.id);
  const actionLabel = launchable ? t.card.open : availability === 'coming-soon' ? t.card.viewStatus : t.card.configure;

  const favButton = (
    <button
      type="button"
      className={`icon-btn fav-btn${favorite ? ' is-active' : ''}`}
      aria-pressed={favorite}
      aria-label={favorite ? t.card.removeFav(name) : t.card.addFav(name)}
      title={favorite ? t.card.removeFavShort : t.card.addFavShort}
      onClick={() => toggleFavorite(app.id)}
    >
      <Star size={18} strokeWidth={1.8} fill={favorite ? 'currentColor' : 'none'} />
    </button>
  );

  if (variant === 'compact') {
    return (
      <div className="app-tile">
        <button type="button" className="app-tile__main" onClick={() => launch(app)} aria-label={`${actionLabel}: ${name}`}>
          <AppIcon icon={app.icon} />
          <span className="app-tile__text">
            <span className="app-tile__name">{name}</span>
            <span className="app-tile__meta">{meta ?? (availability === 'ready' ? t.card.openShort : t.availability[availability])}</span>
          </span>
          <ArrowUpRight size={16} className="app-tile__arrow" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <article className="app-card">
      <header className="app-card__head">
        <AppIcon icon={app.icon} size="lg" />
        {favButton}
      </header>
      <h3 className="app-card__title">{name}</h3>
      <p className="app-card__desc">{appDescription(app)}</p>
      <div className="app-card__meta">
        <span className="chip">{categoryShortName(getCategory(app.category))}</span>
        <StatusBadge availability={availability} />
      </div>
      <button
        type="button"
        className={`btn ${launchable ? 'btn--primary' : 'btn--ghost'} app-card__action`}
        onClick={() => launch(app)}
        aria-label={`${actionLabel}: ${name}`}
      >
        {launchable ? <ArrowUpRight size={16} aria-hidden="true" /> : <Settings2 size={16} aria-hidden="true" />}
        {actionLabel}
      </button>
    </article>
  );
}
