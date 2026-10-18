import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_CATALOG } from '../config/apps';
import { useI18n } from '../i18n/useI18n';
import type { AppDefinition } from '../config/types';
import { openInNewTab, resolveLaunch } from '../lib/launcher';
import { readJSON, removeKey, STORAGE_KEYS, writeJSON } from '../lib/storage';
import { HubContext, type HubContextValue, type LaunchNotice, type RecentEntry } from './context';

const MAX_RECENTS = 12;

export function HubProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { t, appName } = useI18n();

  // Catalog: defaults from apps.ts, optionally replaced by a local-demo edit.
  const [customCatalog, setCustomCatalog] = useState<AppDefinition[] | null>(() =>
    readJSON<AppDefinition[] | null>(STORAGE_KEYS.catalog, null),
  );
  const apps = customCatalog ?? APP_CATALOG;

  // Favorites: null = user never customised -> use `defaultFavorite` flags.
  const [storedFavorites, setStoredFavorites] = useState<string[] | null>(() =>
    readJSON<string[] | null>(STORAGE_KEYS.favorites, null),
  );
  const [recentsRaw, setRecents] = useState<RecentEntry[]>(() => readJSON<RecentEntry[]>(STORAGE_KEYS.recents, []));
  const [notice, setNotice] = useState<LaunchNotice | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const appIds = useMemo(() => new Set(apps.map((a) => a.id)), [apps]);
  const favoriteIds = useMemo(
    () => (storedFavorites ?? apps.filter((a) => a.defaultFavorite).map((a) => a.id)).filter((id) => appIds.has(id)),
    [storedFavorites, apps, appIds],
  );
  const recents = useMemo(() => recentsRaw.filter((r) => appIds.has(r.id)), [recentsRaw, appIds]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const persistCatalog = useCallback((next: AppDefinition[]) => {
    setCustomCatalog(next);
    writeJSON(STORAGE_KEYS.catalog, next);
  }, []);

  const saveApp = useCallback(
    (app: AppDefinition, originalId?: string) => {
      const key = originalId ?? app.id;
      const exists = apps.some((a) => a.id === key);
      persistCatalog(exists ? apps.map((a) => (a.id === key ? app : a)) : [...apps, app]);
    },
    [apps, persistCatalog],
  );

  const deleteApp = useCallback((id: string) => persistCatalog(apps.filter((a) => a.id !== id)), [apps, persistCatalog]);

  const moveApp = useCallback(
    (id: string, direction: -1 | 1) => {
      const index = apps.findIndex((a) => a.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= apps.length) return;
      const next = [...apps];
      [next[index], next[target]] = [next[target], next[index]];
      persistCatalog(next);
    },
    [apps, persistCatalog],
  );

  const resetCatalog = useCallback(() => {
    setCustomCatalog(null);
    removeKey(STORAGE_KEYS.catalog);
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      const next = favoriteIds.includes(id) ? favoriteIds.filter((f) => f !== id) : [...favoriteIds, id];
      setStoredFavorites(next);
      writeJSON(STORAGE_KEYS.favorites, next);
    },
    [favoriteIds],
  );

  const resetFavorites = useCallback(() => {
    setStoredFavorites(null);
    removeKey(STORAGE_KEYS.favorites);
  }, []);

  const recordRecent = useCallback((id: string) => {
    setRecents((prev) => {
      const next = [{ id, at: Date.now() }, ...prev.filter((r) => r.id !== id)].slice(0, MAX_RECENTS);
      writeJSON(STORAGE_KEYS.recents, next);
      return next;
    });
  }, []);

  const clearRecents = useCallback(() => {
    setRecents([]);
    removeKey(STORAGE_KEYS.recents);
  }, []);

  const launch = useCallback(
    (app: AppDefinition, opts?: { force?: boolean }) => {
      const plan = resolveLaunch(app, opts);
      switch (plan.kind) {
        case 'new-tab':
          if (openInNewTab(plan.url)) {
            recordRecent(app.id);
            setNotice(null);
            setToast(t.launch.openingNewTab(appName(app)));
          } else {
            setNotice({ app, plan: { kind: 'popup-blocked', url: plan.url } });
          }
          return;
        case 'same-tab':
          recordRecent(app.id);
          window.location.assign(plan.url);
          return;
        case 'embedded':
          recordRecent(app.id);
          setNotice(null);
          navigate(`/workspace/${encodeURIComponent(app.id)}`);
          return;
        default:
          setNotice({ app, plan });
      }
    },
    [navigate, recordRecent, t, appName],
  );

  const value: HubContextValue = {
    apps,
    getApp: (id) => apps.find((a) => a.id === id),
    catalogIsCustomised: customCatalog !== null,
    saveApp,
    deleteApp,
    moveApp,
    replaceCatalog: persistCatalog,
    resetCatalog,
    favoriteIds,
    isFavorite: (id) => favoriteIds.includes(id),
    toggleFavorite,
    resetFavorites,
    recents,
    clearRecents,
    launch,
    notice,
    dismissNotice: () => setNotice(null),
    toast,
    showToast: setToast,
  };

  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
}
