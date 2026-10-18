import type { AppDefinition } from '../config/types';

/**
 * Pure launch-resolution logic, independent of UI components.
 * `resolveLaunch` decides WHAT should happen; `useLauncher` (HubContext)
 * performs it.
 */
export type LaunchPlan =
  | { kind: 'not-configured' }
  | { kind: 'invalid-url'; url: string }
  | { kind: 'coming-soon'; url: string }
  | { kind: 'maintenance'; url: string }
  | { kind: 'new-tab'; url: string }
  | { kind: 'same-tab'; url: string }
  | { kind: 'embedded'; url: string }
  /** Produced at launch time when the browser blocked window.open. */
  | { kind: 'popup-blocked'; url: string };

export type Availability = 'ready' | 'beta' | 'maintenance' | 'coming-soon' | 'not-configured' | 'invalid-url';


/**
 * Returns a normalised URL string when the value is a safe launch target:
 * an absolute http(s) URL, or a same-origin path beginning with "/".
 * Any other scheme (javascript:, data:, file: …) is rejected.
 */
export function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function getAvailability(app: AppDefinition): Availability {
  if (!app.url.trim()) return 'not-configured';
  if (!normalizeUrl(app.url)) return 'invalid-url';
  if (app.status === 'coming-soon') return 'coming-soon';
  if (app.status === 'maintenance') return 'maintenance';
  if (app.status === 'beta') return 'beta';
  return 'ready';
}

export function isLaunchable(app: AppDefinition): boolean {
  const a = getAvailability(app);
  return a === 'ready' || a === 'beta';
}

export function resolveLaunch(app: AppDefinition, opts: { force?: boolean } = {}): LaunchPlan {
  if (!app.url.trim()) return { kind: 'not-configured' };
  const url = normalizeUrl(app.url);
  if (!url) return { kind: 'invalid-url', url: app.url };
  if (app.status === 'coming-soon') return { kind: 'coming-soon', url };
  if (app.status === 'maintenance' && !opts.force) return { kind: 'maintenance', url };
  return { kind: app.openMode, url };
}

/** Same-origin pages can be embedded freely; others depend on the remote server headers. */
export function isSameOrigin(url: string): boolean {
  try {
    return new URL(url, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Opens the URL in a new tab. Returns false when a popup blocker prevented it.
 * ("noopener" is not passed as a feature because it makes window.open always
 * return null; the opener reference is cleared manually instead.)
 */
export function openInNewTab(url: string): boolean {
  const win = window.open(url, '_blank');
  if (!win) return false;
  win.opener = null;
  return true;
}
