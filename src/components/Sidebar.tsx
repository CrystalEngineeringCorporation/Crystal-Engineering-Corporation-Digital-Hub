import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { getNavSections, getSettingsNav, type NavItem } from '../config/navigation';
import { useI18n } from '../i18n/useI18n';
import { useHub } from '../state/useHub';

interface Props {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onToggleCollapsed, onCloseMobile }: Props) {
  const { favoriteIds, recents } = useHub();
  const i18n = useI18n();
  const { t } = i18n;
  const counts: Record<string, number> = { '/favorites': favoriteIds.length, '/recent': recents.length };

  const renderItem = (item: NavItem) => (
    <li key={item.to}>
      <NavLink
        to={item.to}
        end={item.end}
        className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
        title={collapsed ? item.label : undefined}
        onClick={onCloseMobile}
      >
        <item.icon size={19} strokeWidth={1.7} aria-hidden="true" />
        <span className="nav-link__label">{item.label}</span>
        {counts[item.to] ? <span className="nav-link__count">{counts[item.to]}</span> : null}
      </NavLink>
    </li>
  );

  return (
    <>
      <div className={`scrim${mobileOpen ? ' is-visible' : ''}`} onClick={onCloseMobile} aria-hidden="true" />
      <aside
        className={`sidebar${collapsed ? ' is-collapsed' : ''}${mobileOpen ? ' is-open' : ''}`}
        aria-label={t.nav.main}
        id="app-sidebar"
      >
        <div className="sidebar__brand">
          <img src="/brand/logo-gold-on-navy.jpg" alt="Crystal Engineering Corporation" className="sidebar__logo" />
          <span className="sidebar__brand-sub">{t.brand.hub}</span>
          <button type="button" className="icon-btn sidebar__close" onClick={onCloseMobile} aria-label={t.nav.closeNav}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {getNavSections(i18n).map((section, i) => (
            <div className="nav-section" key={i}>
              {section.title && <p className="nav-section__title">{section.title}</p>}
              <ul>{section.items.map(renderItem)}</ul>
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <ul>{renderItem(getSettingsNav(i18n))}</ul>
          <button
            type="button"
            className="nav-link sidebar__collapse"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
            title={collapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
          >
            {collapsed ? <PanelLeftOpen size={19} strokeWidth={1.7} /> : <PanelLeftClose size={19} strokeWidth={1.7} />}
            <span className="nav-link__label">{t.nav.collapse}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
