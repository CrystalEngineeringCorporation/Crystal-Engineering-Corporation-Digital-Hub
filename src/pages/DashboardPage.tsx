import { Activity, ArrowRight, ClipboardList, Clock, FolderKanban, LayoutGrid, Star, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppCard } from '../components/AppCard';
import { DirectoryView, type CategoryFilter } from '../components/DirectoryView';
import { EmptyState } from '../components/EmptyState';
import { StatCard } from '../components/StatCard';
import { useI18n } from '../i18n/useI18n';
import { isLaunchable } from '../lib/launcher';
import { timeAgo } from '../lib/time';
import { useHub } from '../state/useHub';

export function DashboardPage() {
  const { apps, favoriteIds, recents, getApp } = useHub();
  const { t, locale } = useI18n();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const favorites = favoriteIds.map(getApp).filter((a) => a !== undefined);
  const featured = apps.filter((a) => a.featured);
  const configured = apps.filter(isLaunchable).length;
  const recentApps = recents.slice(0, 5).flatMap((r) => {
    const app = getApp(r.id);
    return app ? [{ app, at: r.at }] : [];
  });

  return (
    <div className="page">
      <section className="hero" aria-labelledby="welcome-title">
        <svg className="hero__rings" viewBox="0 0 400 400" aria-hidden="true">
          <circle cx="200" cy="200" r="190" />
          <circle cx="200" cy="200" r="180" />
          <circle cx="200" cy="200" r="170" />
        </svg>
        <div className="hero__content">
          <p className="hero__eyebrow">{t.brand.tagline}</p>
          <h2 id="welcome-title" className="hero__title">
            {t.dashboard.welcome}
          </h2>
          <p className="hero__text">
            {t.dashboard.intro}
          </p>
          <div className="hero__actions">
            <Link to="/apps" className="btn btn--gold">
              <LayoutGrid size={16} aria-hidden="true" /> {t.common.browseApps}
            </Link>
            <Link to="/favorites" className="btn btn--on-dark">
              <Star size={16} aria-hidden="true" /> {t.topbar.myFavorites}
            </Link>
          </div>
        </div>
        <img className="hero__logo" src="/brand/logo-gold-on-navy.jpg" alt="" />
      </section>

      <section className="stats" aria-label={t.dashboard.overview}>
        <StatCard
          icon={FolderKanban}
          label={t.dashboard.totalProjects}
          value="—"
          hint={t.dashboard.totalProjectsHint}
          tag={t.dashboard.tagNotConnected}
        />
        <StatCard
          icon={LayoutGrid}
          label={t.dashboard.activeApps}
          value={String(configured)}
          hint={t.dashboard.activeAppsHint(configured, apps.length)}
          tag={t.dashboard.tagRegistry}
          tone="live"
        />
        <StatCard
          icon={Activity}
          label={t.dashboard.recentActivities}
          value={String(recents.length)}
          hint={t.dashboard.recentActivitiesHint}
          tag={t.dashboard.tagDevice}
          tone="live"
        />
        <StatCard
          icon={ClipboardList}
          label={t.dashboard.pendingActions}
          value="—"
          hint={t.dashboard.pendingActionsHint}
          tag={t.dashboard.tagNotConnected}
        />
      </section>

      <div className="split">
        <section className="panel" aria-labelledby="fav-title">
          <div className="panel__head">
            <h2 id="fav-title" className="panel__title">
              <Star size={18} aria-hidden="true" /> {t.dashboard.favoriteApps}
            </h2>
            <Link to="/favorites" className="link">
              {t.common.manage} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          {favorites.length === 0 ? (
            <EmptyState
              compact
              icon={Star}
              title={t.dashboard.noFavTitle}
              description={t.dashboard.noFavText}
            />
          ) : (
            <div className="tile-grid">
              {favorites.map((app) => (
                <AppCard key={app.id} app={app} variant="compact" />
              ))}
            </div>
          )}
        </section>

        <section className="panel" aria-labelledby="recent-title">
          <div className="panel__head">
            <h2 id="recent-title" className="panel__title">
              <Clock size={18} aria-hidden="true" /> {t.nav.recent}
            </h2>
            {recentApps.length > 0 && (
              <Link to="/recent" className="link">
                {t.common.viewAll} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            )}
          </div>
          {recentApps.length === 0 ? (
            <EmptyState
              compact
              icon={Clock}
              title={t.dashboard.nothingLaunched}
              description={t.dashboard.nothingLaunchedText}
            />
          ) : (
            <div className="tile-list">
              {recentApps.map(({ app, at }) => (
                <AppCard key={app.id} app={app} variant="compact" meta={timeAgo(at, locale)} />
              ))}
            </div>
          )}
        </section>
      </div>

      {featured.length > 0 && (
        <section className="quick" aria-labelledby="quick-title">
          <h2 id="quick-title" className="section-title">
            <Zap size={17} aria-hidden="true" /> {t.dashboard.quickAccess}
          </h2>
          <div className="quick__row">
            {featured.map((app) => (
              <AppCard key={app.id} app={app} variant="compact" />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="dir-title">
        <div className="section-head">
          <div>
            <h2 id="dir-title" className="section-title">
              <LayoutGrid size={17} aria-hidden="true" /> {t.dashboard.directory}
            </h2>
            <p className="section-sub">{t.dashboard.directorySub}</p>
          </div>
          <Link to="/apps" className="link">
            {t.dashboard.openDirectory} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <DirectoryView
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          favoritesOnly={favoritesOnly}
          onFavoritesOnlyChange={setFavoritesOnly}
        />
      </section>
    </div>
  );
}
