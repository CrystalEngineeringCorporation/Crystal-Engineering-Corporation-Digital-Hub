/** Category identifiers. Add a new one here and in `categories.ts`. */
export type CategoryId = 'engineering' | 'business' | 'ai';

/**
 * Lifecycle status set by the administrator.
 * Note: an app with no URL is always shown as "Not configured",
 * regardless of this value.
 */
export type AppStatus = 'available' | 'beta' | 'maintenance' | 'coming-soon';

/**
 * How the portal opens the application.
 * - `new-tab`: opens in a new browser tab (recommended for external apps)
 * - `same-tab`: replaces the portal in the current tab
 * - `embedded`: opens inside the portal workspace (iframe). Only use this when
 *   the destination explicitly allows being framed (no X-Frame-Options DENY /
 *   CSP frame-ancestors restriction).
 */
export type OpenMode = 'new-tab' | 'same-tab' | 'embedded';

export interface AppDefinition {
  /** Stable unique id (kebab-case). Used for favorites, recents and routes. */
  id: string;
  name: string;
  /** Thai display name. Optional — falls back to `name`. */
  nameTh?: string;
  description: string;
  /** Thai description. Optional — falls back to `description`. */
  descriptionTh?: string;
  category: CategoryId;
  /** Key from `ICONS` in `icons.ts`. */
  icon: string;
  /** Absolute http(s) URL or same-origin path starting with "/". Empty = not configured. */
  url: string;
  status: AppStatus;
  openMode: OpenMode;
  /** Shown in the dashboard "Quick Access" strip. */
  featured?: boolean;
  /** Pre-selected as a favorite for users who have not customised favorites yet. */
  defaultFavorite?: boolean;
}

export interface CategoryDefinition {
  id: CategoryId;
  name: string;
  nameTh: string;
  shortName: string;
  shortNameTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
}
