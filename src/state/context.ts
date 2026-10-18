import { createContext } from 'react';
import type { AppDefinition } from '../config/types';
import type { LaunchPlan } from '../lib/launcher';

export interface RecentEntry {
  id: string;
  at: number;
}

export interface LaunchNotice {
  app: AppDefinition;
  plan: LaunchPlan;
}

export interface HubContextValue {
  apps: AppDefinition[];
  getApp: (id: string) => AppDefinition | undefined;
  catalogIsCustomised: boolean;
  saveApp: (app: AppDefinition, originalId?: string) => void;
  deleteApp: (id: string) => void;
  moveApp: (id: string, direction: -1 | 1) => void;
  replaceCatalog: (apps: AppDefinition[]) => void;
  resetCatalog: () => void;

  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  resetFavorites: () => void;

  recents: RecentEntry[];
  clearRecents: () => void;

  launch: (app: AppDefinition, opts?: { force?: boolean }) => void;
  notice: LaunchNotice | null;
  dismissNotice: () => void;

  toast: string | null;
  showToast: (message: string) => void;
}

export const HubContext = createContext<HubContextValue | null>(null);
