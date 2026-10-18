import { SearchX, Star, X } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import { CATEGORIES } from '../config/categories';
import type { CategoryId } from '../config/types';
import { useI18n } from '../i18n/useI18n';
import { searchApps } from '../lib/search';
import { useHub } from '../state/useHub';
import { AppCard } from './AppCard';
import { EmptyState } from './EmptyState';

export type CategoryFilter = CategoryId | 'all';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  category: CategoryFilter;
  onCategoryChange: (c: CategoryFilter) => void;
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (v: boolean) => void;
  limit?: number;
  footer?: ReactNode;
}

export function DirectoryView({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  favoritesOnly,
  onFavoritesOnlyChange,
  limit,
  footer,
}: Props) {
  const { apps, isFavorite } = useHub();
  const { t, categoryShortName } = useI18n();

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: apps.length };
    for (const a of apps) map[a.category] = (map[a.category] ?? 0) + 1;
    return map;
  }, [apps]);

  const filtered = useMemo(() => {
    let list = searchApps(apps, query);
    if (category !== 'all') list = list.filter((a) => a.category === category);
    if (favoritesOnly) list = list.filter((a) => isFavorite(a.id));
    return list;
  }, [apps, query, category, favoritesOnly, isFavorite]);

  const visible = limit ? filtered.slice(0, limit) : filtered;
  const hasFilters = query.trim() !== '' || category !== 'all' || favoritesOnly;

  return (
    <div className="directory">
      <div className="toolbar">
        <div className="field-search">
          <input
            type="search"
            className="input"
            placeholder={t.directory.filterPlaceholder}
            aria-label={t.directory.filterLabel}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
        <div className="filters" role="group" aria-label={t.directory.categoryFilter}>
          <button
            type="button"
            className={`filter-chip${category === 'all' ? ' is-active' : ''}`}
            aria-pressed={category === 'all'}
            onClick={() => onCategoryChange('all')}
          >
            {t.directory.all} <span className="filter-chip__count">{counts.all}</span>
          </button>
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.id}
              className={`filter-chip${category === c.id ? ' is-active' : ''}`}
              aria-pressed={category === c.id}
              onClick={() => onCategoryChange(c.id)}
            >
              {categoryShortName(c)} <span className="filter-chip__count">{counts[c.id] ?? 0}</span>
            </button>
          ))}
          <button
            type="button"
            className={`filter-chip filter-chip--fav${favoritesOnly ? ' is-active' : ''}`}
            aria-pressed={favoritesOnly}
            onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
          >
            <Star size={14} fill={favoritesOnly ? 'currentColor' : 'none'} aria-hidden="true" /> {t.directory.favorites}
          </button>
        </div>
      </div>

      <p className="result-line" aria-live="polite">
        {t.directory.showing(visible.length, filtered.length)}
        {hasFilters && (
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              onQueryChange('');
              onCategoryChange('all');
              onFavoritesOnlyChange(false);
            }}
          >
            <X size={13} aria-hidden="true" /> {t.directory.clearFilters}
          </button>
        )}
      </p>

      {visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={t.directory.noneTitle}
          description={
            favoritesOnly && !query.trim()
              ? t.directory.noneFav
              : t.directory.noneSearch
          }
        />
      ) : (
        <div className="card-grid">
          {visible.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
      {footer}
    </div>
  );
}
