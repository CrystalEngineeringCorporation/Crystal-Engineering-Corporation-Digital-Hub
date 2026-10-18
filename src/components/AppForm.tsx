import { X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CATEGORIES } from '../config/categories';
import { ICON_KEYS } from '../config/icons';
import type { AppDefinition, AppStatus, CategoryId, OpenMode } from '../config/types';
import { useI18n } from '../i18n/useI18n';
import { normalizeUrl } from '../lib/launcher';
import { AppIcon } from './AppIcon';

interface Props {
  initial: AppDefinition | null;
  existingIds: string[];
  onSave: (app: AppDefinition, originalId?: string) => void;
  onCancel: () => void;
}

const EMPTY: AppDefinition = {
  id: '',
  name: '',
  description: '',
  category: 'engineering',
  icon: 'app-window',
  url: '',
  status: 'available',
  openMode: 'new-tab',
  featured: false,
  defaultFavorite: false,
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function AppForm({ initial, existingIds, onSave, onCancel }: Props) {
  const { t, appName, categoryName } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState<AppDefinition>(initial ?? EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const set = <K extends keyof AppDefinition>(key: K, value: AppDefinition[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const id = initial ? initial.id : slugify(form.id || form.name);
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = t.form.errNameRequired;
    if (!id) next.name = next.name ?? t.form.errNameChars;
    if (!initial && existingIds.includes(id)) next.name = t.form.errDuplicate(id);
    if (form.url.trim() && !normalizeUrl(form.url)) next.url = t.form.errUrl;
    if (/[?&](password|pass|pwd|token|apikey|api_key|secret|key)=/i.test(form.url))
      next.url = t.form.errSecret;
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave(
      {
        ...form,
        id,
        name: form.name.trim(),
        nameTh: form.nameTh?.trim() || undefined,
        description: form.description.trim(),
        descriptionTh: form.descriptionTh?.trim() || undefined,
        url: form.url.trim(),
      },
      initial?.id,
    );
  };

  return (
    <dialog ref={ref} className="dialog dialog--form" onClose={onCancel} aria-labelledby="app-form-title">
      <form className="dialog__inner" onSubmit={submit} noValidate>
        <button type="button" className="icon-btn dialog__close" onClick={onCancel} aria-label={t.common.close}>
          <X size={18} />
        </button>
        <div className="dialog__head">
          <AppIcon icon={form.icon} size="lg" />
          <div>
            <p className="dialog__eyebrow">{initial ? t.form.editing(initial.id) : t.form.newApp}</p>
            <h2 id="app-form-title" className="dialog__title">
              {initial ? appName(initial) : t.form.addTitle}
            </h2>
          </div>
        </div>

        <div className="form-grid">
          <label className="field field--full">
            <span className="field__label">{t.form.name}</span>
            <input
              className="input"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              aria-invalid={!!errors.name}
              autoFocus
            />
            {errors.name && <span className="field__error">{errors.name}</span>}
          </label>

          <label className="field field--full">
            <span className="field__label">{t.form.description}</span>
            <textarea className="input" rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </label>

          <label className="field">
            <span className="field__label">{t.form.nameTh}</span>
            <input className="input" lang="th" value={form.nameTh ?? ''} onChange={(e) => set('nameTh', e.target.value)} />
            <span className="field__hint">{t.form.thaiHint}</span>
          </label>

          <label className="field">
            <span className="field__label">{t.form.descriptionTh}</span>
            <textarea
              className="input"
              lang="th"
              rows={2}
              value={form.descriptionTh ?? ''}
              onChange={(e) => set('descriptionTh', e.target.value)}
            />
          </label>

          <label className="field field--full">
            <span className="field__label">{t.form.url}</span>
            <input
              className="input mono"
              placeholder={t.form.urlPlaceholder}
              value={form.url}
              onChange={(e) => set('url', e.target.value)}
              aria-invalid={!!errors.url}
              inputMode="url"
            />
            {errors.url ? (
              <span className="field__error">{errors.url}</span>
            ) : (
              <span className="field__hint">{t.form.urlHint}</span>
            )}
          </label>

          <label className="field">
            <span className="field__label">{t.form.category}</span>
            <select className="input" value={form.category} onChange={(e) => set('category', e.target.value as CategoryId)}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {categoryName(c)}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">{t.form.icon}</span>
            <select className="input" value={form.icon} onChange={(e) => set('icon', e.target.value)}>
              {ICON_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">{t.form.status}</span>
            <select className="input" value={form.status} onChange={(e) => set('status', e.target.value as AppStatus)}>
              <option value="available">{t.availability.ready}</option>
              <option value="beta">{t.availability.beta}</option>
              <option value="maintenance">{t.availability.maintenance}</option>
              <option value="coming-soon">{t.availability['coming-soon']}</option>
            </select>
          </label>

          <label className="field">
            <span className="field__label">{t.form.openMode}</span>
            <select className="input" value={form.openMode} onChange={(e) => set('openMode', e.target.value as OpenMode)}>
              <option value="new-tab">{t.form.openNewTab}</option>
              <option value="same-tab">{t.form.openSameTab}</option>
              <option value="embedded">{t.form.openEmbedded}</option>
            </select>
          </label>

          <label className="check">
            <input type="checkbox" checked={!!form.featured} onChange={(e) => set('featured', e.target.checked)} />
            {t.form.featured}
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={!!form.defaultFavorite}
              onChange={(e) => set('defaultFavorite', e.target.checked)}
            />
            {t.form.defaultFavorite}
          </label>
        </div>

        <div className="dialog__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            {t.common.cancel}
          </button>
          <button type="submit" className="btn btn--primary">
            {t.form.save}
          </button>
        </div>
      </form>
    </dialog>
  );
}
