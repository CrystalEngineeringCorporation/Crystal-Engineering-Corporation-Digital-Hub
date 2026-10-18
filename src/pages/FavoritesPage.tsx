import { LayoutGrid, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppCard } from '../components/AppCard';
import { EmptyState } from '../components/EmptyState';
import { useI18n } from '../i18n/useI18n';
import { useHub } from '../state/useHub';

export function FavoritesPage() {
  const { favoriteIds, getApp } = useHub();
  const { t } = useI18n();
  const favorites = favoriteIds.map(getApp).filter((a) => a !== undefined);

  return (
    <div className="page">
      <p className="page-intro">{t.favorites.intro}</p>
      {favorites.length === 0 ? (
        <EmptyState
          icon={Star}
          title={t.dashboard.noFavTitle}
          description={t.favorites.emptyText}
          action={
            <Link to="/apps" className="btn btn--primary">
              <LayoutGrid size={16} aria-hidden="true" /> {t.common.browseApps}
            </Link>
          }
        />
      ) : (
        <div className="card-grid">
          {favorites.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
