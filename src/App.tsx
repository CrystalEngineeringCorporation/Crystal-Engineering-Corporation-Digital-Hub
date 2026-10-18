import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { I18nProvider } from './i18n/I18nProvider';
import { AppManagementPage } from './pages/AppManagementPage';
import { DashboardPage } from './pages/DashboardPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RecentPage } from './pages/RecentPage';
import { SettingsPage } from './pages/SettingsPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { HubProvider } from './state/HubContext';

export default function App() {
  return (
    <I18nProvider>
      <HubProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="apps" element={<DirectoryPage />} />
            <Route path="apps/:category" element={<DirectoryPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="recent" element={<RecentPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="settings/applications" element={<AppManagementPage />} />
            <Route path="workspace/:id" element={<WorkspacePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HubProvider>
    </I18nProvider>
  );
}
