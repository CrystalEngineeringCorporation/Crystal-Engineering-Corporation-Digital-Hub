import { CheckCircle2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useMatch } from 'react-router-dom';
import { getRouteMeta } from '../config/navigation';
import { useI18n } from '../i18n/useI18n';
import { readJSON, STORAGE_KEYS, writeJSON } from '../lib/storage';
import { useHub } from '../state/useHub';
import { LaunchDialog } from './LaunchDialog';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  const { pathname } = useLocation();
  const { getApp, toast } = useHub();
  const i18n = useI18n();
  const workspace = useMatch('/workspace/:id');
  const workspaceApp = workspace ? getApp(workspace.params.id ?? '') : undefined;
  const meta = getRouteMeta(pathname, i18n, workspaceApp ? i18n.appName(workspaceApp) : undefined);

  const [collapsed, setCollapsed] = useState(() => readJSON<boolean>(STORAGE_KEYS.sidebarCollapsed, false));
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => {
      writeJSON(STORAGE_KEYS.sidebarCollapsed, !c);
      return !c;
    });
  }, []);

  useEffect(() => {
    document.title = `${meta.title} · Crystal Engineering Corporation`;
  }, [meta.title]);

  // Reset scroll on navigation. (The mobile drawer closes from its own link handlers.)
  useEffect(() => {
    document.querySelector('.main')?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className={`shell${collapsed ? ' shell--collapsed' : ''}`}>
      <a href="#main-content" className="skip-link">
        {i18n.t.common.skip}
      </a>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapsed={toggleCollapsed}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="shell__body">
        <Topbar meta={meta} onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="main" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <LaunchDialog />
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="toast">
            <CheckCircle2 size={17} aria-hidden="true" />
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
