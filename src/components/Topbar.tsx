import { Bell, ChevronDown, ChevronRight, CircleUser, Info, Menu, Settings, Star } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { RouteMeta } from '../config/navigation';
import { useI18n } from '../i18n/useI18n';
import { useDismiss } from '../lib/useDismiss';
import { GlobalSearch } from './GlobalSearch';
import { LanguageSwitch } from './LanguageSwitch';

interface Props {
  meta: RouteMeta;
  onOpenMobileNav: () => void;
}

type OpenMenu = 'notifications' | 'profile' | null;

export function Topbar({ meta, onOpenMobileNav }: Props) {
  const { t } = useI18n();
  const [menu, setMenu] = useState<OpenMenu>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setMenu(null), []);
  useDismiss(actionsRef, menu !== null, close);
  const toggle = (m: Exclude<OpenMenu, null>) => setMenu((cur) => (cur === m ? null : m));

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn topbar__menu"
        onClick={onOpenMobileNav}
        aria-label={t.nav.openNav}
        aria-controls="app-sidebar"
      >
        <Menu size={21} />
      </button>

      <div className="topbar__title">
        <nav aria-label={t.crumbs.breadcrumb}>
          <ol className="crumbs">
            {meta.crumbs.map((c, i) => (
              <li key={`${c.label}-${i}`}>
                {i > 0 && <ChevronRight size={13} aria-hidden="true" />}
                {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="topbar__heading">{meta.title}</h1>
      </div>

      <GlobalSearch />

      <div className="topbar__actions" ref={actionsRef}>
        <LanguageSwitch />

        <Link to="/favorites" className="icon-btn hide-sm" aria-label={t.nav.favorites} title={t.nav.favorites}>
          <Star size={19} strokeWidth={1.8} />
        </Link>

        <div className="menu-anchor">
          <button
            type="button"
            className={`icon-btn${menu === 'notifications' ? ' is-pressed' : ''}`}
            aria-label={t.topbar.notifications}
            title={t.topbar.notifications}
            aria-haspopup="true"
            aria-expanded={menu === 'notifications'}
            onClick={() => toggle('notifications')}
          >
            <Bell size={19} strokeWidth={1.8} />
          </button>
          {menu === 'notifications' && (
            <div className="popover popover--right menu-panel" role="dialog" aria-label={t.topbar.notifications}>
              <p className="menu-panel__title">{t.topbar.notifications}</p>
              <div className="menu-panel__empty">
                <Bell size={20} strokeWidth={1.6} aria-hidden="true" />
                <p>{t.topbar.caughtUp}</p>
                <span>{t.topbar.notifNote}</span>
              </div>
            </div>
          )}
        </div>

        <Link to="/settings" className="icon-btn hide-sm" aria-label={t.nav.settings} title={t.nav.settings}>
          <Settings size={19} strokeWidth={1.8} />
        </Link>

        <div className="menu-anchor">
          <button
            type="button"
            className={`profile-btn${menu === 'profile' ? ' is-pressed' : ''}`}
            aria-haspopup="menu"
            aria-expanded={menu === 'profile'}
            aria-label={t.topbar.userMenu}
            onClick={() => toggle('profile')}
          >
            <span className="avatar" aria-hidden="true">
              <CircleUser size={20} strokeWidth={1.6} />
            </span>
            <span className="profile-btn__text hide-md">
              <span className="profile-btn__name">{t.topbar.guest}</span>
              <span className="profile-btn__role">{t.topbar.localSession}</span>
            </span>
            <ChevronDown size={15} className="hide-md" aria-hidden="true" />
          </button>
          {menu === 'profile' && (
            <div className="popover popover--right menu-panel" role="menu" aria-label={t.topbar.userMenu}>
              <div className="menu-panel__profile">
                <span className="avatar avatar--lg" aria-hidden="true">
                  <CircleUser size={24} strokeWidth={1.6} />
                </span>
                <div>
                  <p className="menu-panel__name">{t.topbar.guest}</p>
                  <p className="menu-panel__sub">{t.topbar.notSignedIn}</p>
                </div>
              </div>
              <Link role="menuitem" to="/favorites" className="menu-item" onClick={close}>
                <Star size={16} /> {t.topbar.myFavorites}
              </Link>
              <Link role="menuitem" to="/settings" className="menu-item" onClick={close}>
                <Settings size={16} /> {t.nav.settings}
              </Link>
              <p className="menu-panel__note">
                <Info size={14} aria-hidden="true" />
                {t.topbar.ssoNote}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
