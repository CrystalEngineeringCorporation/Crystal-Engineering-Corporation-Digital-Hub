import { ArrowDown, ArrowUp, Download, Info, Pencil, Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppForm } from '../components/AppForm';
import { AppIcon } from '../components/AppIcon';
import { StatusBadge } from '../components/StatusBadge';
import { getCategory } from '../config/categories';
import type { AppDefinition } from '../config/types';
import { useI18n } from '../i18n/useI18n';
import { getAvailability } from '../lib/launcher';
import { validateCatalog } from '../lib/validateCatalog';
import { useHub } from '../state/useHub';

export function AppManagementPage() {
  const { apps, saveApp, deleteApp, moveApp, replaceCatalog, resetCatalog, catalogIsCustomised, showToast } = useHub();
  const { t, appName, categoryShortName } = useI18n();
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState<AppDefinition | 'new' | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Deep link: /settings/applications?edit=<id> opens the editor, then the param is cleared.
  const editParam = params.get('edit');
  const [handledParam, setHandledParam] = useState<string | null>(null);
  if (editParam && editParam !== handledParam) {
    setHandledParam(editParam);
    const app = apps.find((a) => a.id === editParam);
    if (app) setEditing(app);
  }
  useEffect(() => {
    if (editParam) setParams({}, { replace: true });
  }, [editParam, setParams]);

  const exportCatalog = () => {
    const blob = new Blob([JSON.stringify(apps, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'crystal-hub-apps.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importCatalog = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const result = validateCatalog(JSON.parse(await file.text()));
      if (!result.ok) {
        showToast(t.manage.importFailed(result.error));
        return;
      }
      replaceCatalog(result.apps);
      showToast(t.manage.imported(result.apps.length));
    } catch {
      showToast(t.manage.importNotJson);
    }
  };

  return (
    <div className="page">
      <div className="callout">
        <Info size={18} aria-hidden="true" />
        <div>
          <p className="callout__title">{t.manage.calloutTitle}</p>
          <p>{t.manage.calloutText}</p>
        </div>
      </div>

      <div className="section-head">
        <p className="page-intro">
          {t.manage.summary(apps.length, catalogIsCustomised)}
        </p>
        <div className="btn-row">
          <button type="button" className="btn btn--ghost btn--sm" onClick={exportCatalog}>
            <Download size={15} aria-hidden="true" /> {t.manage.exportJson}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => fileRef.current?.click()}>
            <Upload size={15} aria-hidden="true" /> {t.manage.importJson}
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importCatalog} />
          {catalogIsCustomised && (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                if (window.confirm(t.manage.confirmRestore)) {
                  resetCatalog();
                  showToast(t.settings.catalogRestored);
                }
              }}
            >
              <RotateCcw size={15} aria-hidden="true" /> {t.manage.restoreDefaults}
            </button>
          )}
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setEditing('new')}>
            <Plus size={15} aria-hidden="true" /> {t.manage.addApp}
          </button>
        </div>
      </div>

      <ul className="list-panel">
        {apps.map((app, i) => (
          <li key={app.id} className="list-row list-row--manage">
            <AppIcon icon={app.icon} />
            <div className="list-row__text">
              <p className="list-row__name">{appName(app)}</p>
              <p className="list-row__sub">
                {categoryShortName(getCategory(app.category))} · {t.manage.openMode[app.openMode]} ·{' '}
                <span className="mono">{app.url || t.manage.noUrl}</span>
              </p>
            </div>
            <span className="hide-sm">
              <StatusBadge availability={getAvailability(app)} />
            </span>
            <div className="list-row__actions">
              <button
                type="button"
                className="icon-btn"
                aria-label={t.manage.moveUp(appName(app))}
                disabled={i === 0}
                onClick={() => moveApp(app.id, -1)}
              >
                <ArrowUp size={16} />
              </button>
              <button
                type="button"
                className="icon-btn"
                aria-label={t.manage.moveDown(appName(app))}
                disabled={i === apps.length - 1}
                onClick={() => moveApp(app.id, 1)}
              >
                <ArrowDown size={16} />
              </button>
              <button type="button" className="icon-btn" aria-label={t.manage.edit(appName(app))} onClick={() => setEditing(app)}>
                <Pencil size={16} />
              </button>
              <button
                type="button"
                className="icon-btn icon-btn--danger"
                aria-label={t.manage.remove(appName(app))}
                onClick={() => {
                  if (window.confirm(t.manage.confirmRemove(appName(app)))) {
                    deleteApp(app.id);
                    showToast(t.manage.removed(appName(app)));
                  }
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <AppForm
          initial={editing === 'new' ? null : editing}
          existingIds={apps.map((a) => a.id)}
          onCancel={() => setEditing(null)}
          onSave={(app, originalId) => {
            saveApp(app, originalId);
            setEditing(null);
            showToast(t.manage.saved(appName(app)));
          }}
        />
      )}
    </div>
  );
}
