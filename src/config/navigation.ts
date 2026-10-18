import { Clock, LayoutDashboard, LayoutGrid, Settings, Star, type LucideIcon } from 'lucide-react';
import type { I18nValue } from '../i18n/context';
import { CATEGORIES } from './categories';
import { getIcon } from './icons';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export function getNavSections({ t, categoryName }: I18nValue): NavSection[] {
  return [
    {
      items: [
        { to: '/', label: t.nav.dashboard, icon: LayoutDashboard, end: true },
        { to: '/apps', label: t.nav.myApps, icon: LayoutGrid, end: true },
      ],
    },
    {
      title: t.nav.categories,
      items: CATEGORIES.map((c) => ({ to: `/apps/${c.id}`, label: categoryName(c), icon: getIcon(c.icon) })),
    },
    {
      title: t.nav.personal,
      items: [
        { to: '/favorites', label: t.nav.favorites, icon: Star },
        { to: '/recent', label: t.nav.recent, icon: Clock },
      ],
    },
  ];
}

export function getSettingsNav({ t }: I18nValue): NavItem {
  return { to: '/settings', label: t.nav.settings, icon: Settings };
}

export interface Crumb {
  label: string;
  to?: string;
}

export interface RouteMeta {
  title: string;
  crumbs: Crumb[];
}

export function getRouteMeta(pathname: string, i18n: I18nValue, appName?: string): RouteMeta {
  const { t } = i18n;
  const home: Crumb = { label: t.crumbs.home, to: '/' };
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return { title: t.nav.dashboard, crumbs: [{ label: t.crumbs.home }] };

  switch (parts[0]) {
    case 'apps': {
      const category = CATEGORIES.find((c) => c.id === parts[1]);
      if (category) {
        return {
          title: i18n.categoryName(category),
          crumbs: [home, { label: t.crumbs.applications, to: '/apps' }, { label: i18n.categoryShortName(category) }],
        };
      }
      return { title: t.nav.myApps, crumbs: [home, { label: t.crumbs.applications }] };
    }
    case 'favorites':
      return { title: t.nav.favorites, crumbs: [home, { label: t.nav.favorites }] };
    case 'recent':
      return { title: t.nav.recent, crumbs: [home, { label: t.nav.recent }] };
    case 'settings':
      if (parts[1] === 'applications') {
        return {
          title: t.titles.appManagement,
          crumbs: [home, { label: t.nav.settings, to: '/settings' }, { label: t.crumbs.applications }],
        };
      }
      return { title: t.nav.settings, crumbs: [home, { label: t.nav.settings }] };
    case 'workspace':
      return {
        title: appName ?? t.crumbs.workspace,
        crumbs: [home, { label: t.crumbs.workspace }, { label: appName ?? t.crumbs.application }],
      };
    default:
      return { title: t.titles.pageNotFound, crumbs: [home, { label: t.crumbs.notFound }] };
  }
}
