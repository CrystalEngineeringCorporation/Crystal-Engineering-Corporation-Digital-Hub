import {
  AppWindow,
  BarChart3,
  Bot,
  Briefcase,
  Building2,
  Calculator,
  CalendarRange,
  ClipboardCheck,
  Cpu,
  Database,
  DraftingCompass,
  FileText,
  FolderKanban,
  Globe,
  HardHat,
  Map,
  MessagesSquare,
  Rotate3d,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/**
 * Icon registry used by applications and categories.
 * Reference icons by key in `apps.ts` (e.g. icon: 'calculator').
 */
export const ICONS: Record<string, LucideIcon> = {
  'app-window': AppWindow,
  'bar-chart': BarChart3,
  bot: Bot,
  briefcase: Briefcase,
  building: Building2,
  calculator: Calculator,
  'calendar-range': CalendarRange,
  'clipboard-check': ClipboardCheck,
  cpu: Cpu,
  database: Database,
  'drafting-compass': DraftingCompass,
  'file-text': FileText,
  'folder-kanban': FolderKanban,
  globe: Globe,
  'hard-hat': HardHat,
  map: Map,
  messages: MessagesSquare,
  'rotate-3d': Rotate3d,
  ruler: Ruler,
  'shield-check': ShieldCheck,
  'shopping-cart': ShoppingCart,
  sparkles: Sparkles,
  truck: Truck,
  users: Users,
  wallet: Wallet,
  wrench: Wrench,
};

export const ICON_KEYS = Object.keys(ICONS).sort();

export function getIcon(key: string): LucideIcon {
  return ICONS[key] ?? AppWindow;
}
