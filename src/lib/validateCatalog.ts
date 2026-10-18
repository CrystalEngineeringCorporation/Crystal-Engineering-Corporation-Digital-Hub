import { isCategoryId } from '../config/categories';
import type { AppDefinition, AppStatus, OpenMode } from '../config/types';

const STATUSES: AppStatus[] = ['available', 'beta', 'maintenance', 'coming-soon'];
const OPEN_MODES: OpenMode[] = ['new-tab', 'same-tab', 'embedded'];

type Result = { ok: true; apps: AppDefinition[] } | { ok: false; error: string };

/** Validates an imported catalog JSON and keeps only known fields. */
export function validateCatalog(data: unknown): Result {
  if (!Array.isArray(data)) return { ok: false, error: 'expected an array of applications' };
  const ids = new Set<string>();
  const apps: AppDefinition[] = [];

  for (const [i, raw] of data.entries()) {
    const item = raw as Record<string, unknown>;
    const where = `entry ${i + 1}`;
    if (typeof item?.id !== 'string' || !item.id) return { ok: false, error: `${where} has no id` };
    if (ids.has(item.id)) return { ok: false, error: `duplicate id "${item.id}"` };
    if (typeof item.name !== 'string' || !item.name) return { ok: false, error: `${where} has no name` };
    if (typeof item.category !== 'string' || !isCategoryId(item.category))
      return { ok: false, error: `${where} has an unknown category` };
    ids.add(item.id);
    apps.push({
      id: item.id,
      name: item.name,
      nameTh: typeof item.nameTh === 'string' ? item.nameTh : undefined,
      description: typeof item.description === 'string' ? item.description : '',
      descriptionTh: typeof item.descriptionTh === 'string' ? item.descriptionTh : undefined,
      category: item.category,
      icon: typeof item.icon === 'string' ? item.icon : 'app-window',
      url: typeof item.url === 'string' ? item.url : '',
      status: STATUSES.includes(item.status as AppStatus) ? (item.status as AppStatus) : 'available',
      openMode: OPEN_MODES.includes(item.openMode as OpenMode) ? (item.openMode as OpenMode) : 'new-tab',
      featured: item.featured === true,
      defaultFavorite: item.defaultFavorite === true,
    });
  }
  return { ok: true, apps };
}
