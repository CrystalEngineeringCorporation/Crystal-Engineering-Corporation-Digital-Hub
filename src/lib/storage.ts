/**
 * Small, failure-tolerant wrapper around localStorage.
 * Only non-sensitive user preferences are stored here (favorites, recents,
 * UI preferences, local-demo catalog edits). Never store credentials.
 */
const PREFIX = 'cec-hub:';

export const STORAGE_KEYS = {
  favorites: 'favorites',
  recents: 'recents',
  catalog: 'catalog-overrides',
  sidebarCollapsed: 'sidebar-collapsed',
  language: 'language',
} as const;

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode / quota) — preferences stay in memory */
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}
