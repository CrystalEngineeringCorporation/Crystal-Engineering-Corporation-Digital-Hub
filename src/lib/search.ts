import { getCategory } from '../config/categories';
import type { AppDefinition } from '../config/types';

/**
 * Case-insensitive search over English and Thai names, descriptions and
 * category names, so either language finds the app. Name matches rank first.
 */
export function searchApps(apps: AppDefinition[], query: string): AppDefinition[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return apps;

  return apps
    .map((app) => {
      const category = getCategory(app.category);
      const names = `${app.name} ${app.nameTh ?? ''}`.toLowerCase();
      const haystack = [names, app.description, app.descriptionTh ?? '', category.name, category.nameTh]
        .join(' ')
        .toLowerCase();
      if (!terms.every((t) => haystack.includes(t))) return null;
      const score = terms.reduce((s, t) => s + (names.startsWith(t) ? 3 : names.includes(t) ? 2 : 0), 0);
      return { app, score };
    })
    .filter((r): r is { app: AppDefinition; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.app);
}
