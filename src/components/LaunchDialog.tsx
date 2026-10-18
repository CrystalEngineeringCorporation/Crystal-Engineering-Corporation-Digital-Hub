import { AlertTriangle, Clock, ExternalLink, Link2Off, Settings2, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';
import { useHub } from '../state/useHub';
import { AppIcon } from './AppIcon';

/** Explains why an application could not be launched and offers the next step. */
export function LaunchDialog() {
  const { notice, dismissNotice, launch } = useHub();
  const { t, appName } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (notice && !dialog.open) dialog.showModal();
    if (!notice && dialog.open) dialog.close();
  }, [notice]);

  const plan = notice?.plan;
  const app = notice?.app;

  let icon = <Settings2 size={18} />;
  let title = '';
  let body = '';
  const name = app ? appName(app) : '';
  if (plan && app) {
    switch (plan.kind) {
      case 'not-configured':
        title = t.launch.notConfiguredTitle;
        body = t.launch.notConfiguredBody(name);
        break;
      case 'invalid-url':
        icon = <Link2Off size={18} />;
        title = t.launch.invalidTitle;
        body = t.launch.invalidBody(name);
        break;
      case 'coming-soon':
        icon = <Clock size={18} />;
        title = t.launch.comingSoonTitle;
        body = t.launch.comingSoonBody(name);
        break;
      case 'maintenance':
        icon = <AlertTriangle size={18} />;
        title = t.launch.maintenanceTitle;
        body = t.launch.maintenanceBody(name);
        break;
      case 'popup-blocked':
        icon = <ExternalLink size={18} />;
        title = t.launch.blockedTitle;
        body = t.launch.blockedBody(name);
        break;
    }
  }

  return (
    <dialog
      ref={ref}
      className="dialog"
      onClose={dismissNotice}
      onClick={(e) => e.target === ref.current && dismissNotice()}
      aria-labelledby="launch-dialog-title"
    >
      {app && plan && (
        <div className="dialog__inner">
          <button type="button" className="icon-btn dialog__close" onClick={dismissNotice} aria-label={t.common.close}>
            <X size={18} />
          </button>
          <div className="dialog__head">
            <AppIcon icon={app.icon} size="lg" />
            <div>
              <p className="dialog__eyebrow">
                {icon}
                {name}
              </p>
              <h2 id="launch-dialog-title" className="dialog__title">
                {title}
              </h2>
            </div>
          </div>
          <p className="dialog__body">{body}</p>
          {plan.kind === 'invalid-url' && <code className="dialog__code">{plan.url}</code>}
          <div className="dialog__actions">
            <button type="button" className="btn btn--ghost" onClick={dismissNotice}>
              {t.common.close}
            </button>
            {plan.kind === 'popup-blocked' ? (
              <a href={plan.url} target="_blank" rel="noopener noreferrer" className="btn btn--primary" onClick={dismissNotice}>
                <ExternalLink size={16} aria-hidden="true" /> {t.launch.openApp(name)}
              </a>
            ) : plan.kind === 'maintenance' ? (
              <button type="button" className="btn btn--primary" onClick={() => launch(app, { force: true })}>
                {t.launch.openAnyway}
              </button>
            ) : (
              <Link
                to={`/settings/applications?edit=${encodeURIComponent(app.id)}`}
                className="btn btn--primary"
                onClick={dismissNotice}
              >
                <Settings2 size={16} aria-hidden="true" /> {t.launch.configureApp}
              </Link>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
