import { CornerDownLeft, Search, X } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategory } from '../config/categories';
import { useI18n } from '../i18n/useI18n';
import { searchApps } from '../lib/search';
import { useDismiss } from '../lib/useDismiss';
import { useHub } from '../state/useHub';
import { AppIcon } from './AppIcon';

export function GlobalSearch() {
  const { apps, launch } = useHub();
  const { t, appName, appDescription, categoryShortName } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = useMemo(() => (query.trim() ? searchApps(apps, query).slice(0, 7) : []), [apps, query]);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(wrapRef, open, close);

  // Ctrl/Cmd+K or "/" focuses search.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.closest('input, textarea, select, [contenteditable="true"]');
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const showAll = () => {
    navigate(`/apps?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = results[active];
      if (hit) {
        launch(hit);
        setQuery('');
        setOpen(false);
        inputRef.current?.blur();
      } else if (query.trim()) {
        showAll();
      }
    }
  };

  return (
    <div className="search" ref={wrapRef}>
      <Search size={17} className="search__icon" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        className="search__input"
        placeholder={t.search.placeholder}
        aria-label={t.search.label}
        role="combobox"
        aria-expanded={open && query.trim().length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {query ? (
        <button type="button" className="search__clear" aria-label={t.search.clear} onClick={() => setQuery('')}>
          <X size={15} />
        </button>
      ) : (
        <kbd className="search__kbd" aria-hidden="true">
          Ctrl K
        </kbd>
      )}

      {open && query.trim() && (
        <div className="popover search__results" id={listId} role="listbox" aria-label={t.search.results}>
          {results.length === 0 ? (
            <p className="popover__empty">{t.search.noMatch(query.trim())}</p>
          ) : (
            results.map((app, i) => (
              <button
                type="button"
                role="option"
                aria-selected={i === active}
                key={app.id}
                className={`search__result${i === active ? ' is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  launch(app);
                  setQuery('');
                  setOpen(false);
                }}
              >
                <AppIcon icon={app.icon} size="sm" />
                <span className="search__result-text">
                  <span className="search__result-name">{appName(app)}</span>
                  <span className="search__result-desc">{categoryShortName(getCategory(app.category))} · {appDescription(app)}</span>
                </span>
                {i === active && <CornerDownLeft size={14} className="search__enter" aria-hidden="true" />}
              </button>
            ))
          )}
          <button type="button" className="popover__footer-link" onClick={showAll}>
            {t.search.viewAll}
          </button>
        </div>
      )}
    </div>
  );
}
