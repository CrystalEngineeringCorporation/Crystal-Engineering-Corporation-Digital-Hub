import { ArrowUpRight, Clock, LayoutGrid, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppIcon } from '../components/AppIcon';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { getCategory } from '../config/categories';
import { useI18n } from '../i18n/useI18n';
import { getAvailability } from '../lib/launcher';
import { timeAgo } from '../lib/time';
import { useHub } from '../state/useHub';

export function RecentPage() {
  const { recents, getApp, launch, clearRecents } = useHub();
  const { t, locale, appName, categoryShortName } = useI18n();
  const rows = recents.flatMap((r) => {
    const app = getApp(r.id);
    return app ? [{ app, at: r.at }] : [];
  });

  return (
    <div className="page">
      <div className="section-head">
        <p className="page-intro">{t.recent.intro}</p>
        {rows.length > 0 && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={clearRecents}>
            <Trash2 size={15} aria-hidden="true" /> {t.recent.clear}
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Clock}
          title={t.recent.emptyTitle}
          description={t.recent.emptyText}
          action={
            <Link to="/apps" className="btn btn--primary">
              <LayoutGrid size={16} aria-hidden="true" /> {t.common.browseApps}
            </Link>
          }
        />
      ) : (
        <ul className="list-panel">
          {rows.map(({ app, at }) => (
            <li key={app.id} className="list-row">
              <AppIcon icon={app.icon} />
              <div className="list-row__text">
                <p className="list-row__name">{appName(app)}</p>
                <p className="list-row__sub">
                  {categoryShortName(getCategory(app.category))} · {t.recent.opened}{' '}
                  <time dateTime={new Date(at).toISOString()}>{timeAgo(at, locale)}</time>
                </p>
              </div>
              <span className="hide-sm">
                <StatusBadge availability={getAvailability(app)} />
              </span>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => launch(app)}>
                <ArrowUpRight size={15} aria-hidden="true" /> {t.recent.open}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
