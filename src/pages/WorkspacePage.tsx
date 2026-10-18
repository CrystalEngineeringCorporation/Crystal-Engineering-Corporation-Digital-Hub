import { AlertTriangle, ArrowLeft, ExternalLink, RotateCw } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppIcon } from '../components/AppIcon';
import { EmptyState } from '../components/EmptyState';
import { useI18n } from '../i18n/useI18n';
import { isSameOrigin, normalizeUrl, openInNewTab } from '../lib/launcher';
import { useHub } from '../state/useHub';

/**
 * In-portal workspace for applications configured with openMode "embedded".
 * Browsers do not expose whether a cross-origin page refused framing
 * (X-Frame-Options / CSP frame-ancestors), so an "Open in new tab" fallback
 * is always visible for cross-origin apps.
 */
export function WorkspacePage() {
  const { id = '' } = useParams();
  const { getApp } = useHub();
  const { t, appName } = useI18n();
  const app = getApp(id);
  const url = app ? normalizeUrl(app.url) : null;
  const [reloadKey, setReloadKey] = useState(0);
  const [loaded, setLoaded] = useState(false);

  if (!app || !url) {
    return (
      <div className="page">
        <EmptyState
          icon={AlertTriangle}
          title={app ? t.workspace.noUrl : t.workspace.notFound}
          description={t.workspace.emptyText}
          action={
            <Link to="/" className="btn btn--primary">
              <ArrowLeft size={16} aria-hidden="true" /> {t.common.backToDashboard}
            </Link>
          }
        />
      </div>
    );
  }

  const crossOrigin = !isSameOrigin(url);
  const name = appName(app);

  return (
    <div className="workspace">
      <div className="workspace__bar">
        <Link to="/" className="btn btn--ghost btn--sm">
          <ArrowLeft size={15} aria-hidden="true" /> {t.workspace.dashboard}
        </Link>
        <div className="workspace__app">
          <AppIcon icon={app.icon} size="sm" />
          <span className="workspace__name">{name}</span>
        </div>
        <div className="workspace__actions">
          <button
            type="button"
            className="icon-btn"
            aria-label={t.workspace.reload}
            title={t.workspace.reload}
            onClick={() => {
              setLoaded(false);
              setReloadKey((k) => k + 1);
            }}
          >
            <RotateCw size={17} />
          </button>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => openInNewTab(url)}>
            <ExternalLink size={15} aria-hidden="true" /> <span className="hide-sm">{t.workspace.openNewTab}</span>
          </button>
        </div>
      </div>
      {crossOrigin && (
        <p className="workspace__note">
          <AlertTriangle size={14} aria-hidden="true" />
          {t.workspace.frameNote}
        </p>
      )}
      <div className="workspace__frame">
        {!loaded && <div className="workspace__loading">{t.workspace.loading(name)}</div>}
        <iframe
          key={reloadKey}
          src={url}
          title={name}
          onLoad={() => setLoaded(true)}
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
