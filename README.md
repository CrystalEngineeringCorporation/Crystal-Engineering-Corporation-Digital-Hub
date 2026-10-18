# Crystal Engineering Corporation — Company Digital Hub

A single portal where employees can find, organize and launch every company web application.
It is built with React 19, TypeScript and Vite, with plain CSS for styling. It has two runtime dependencies: `react-router-dom` and `lucide-react` (icons).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
npm run lint
```

The build is a static single-page app. When you deploy it, configure the web server to send unknown paths to `index.html`, so that deep links such as `/apps/engineering` load the app.

## Deploy (GitHub Pages)

Each push to `main` builds and publishes the site using `.github/workflows/deploy-pages.yml`.
The site address is `https://<owner>.github.io/<repo-name>/`.

One-time setup, done in the repository on GitHub:
1. GitHub Free only offers Pages for **public** repositories. Paid plans also allow private ones.
2. Go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. In the **Actions** tab, re-run the workflow, or push any commit.

How the workflow handles the sub-path:
- It builds with `BASE_PATH=/<repo-name>/`. Asset URLs and the router basename use this value through `src/lib/asset.ts`.
- It copies `index.html` to `404.html`, so deep links still load the app. GitHub Pages returns HTTP 404 for those URLs, but the page works.
- To host somewhere at the domain root instead, leave `BASE_PATH` unset.

## Logos

| File | Use |
|---|---|
| `public/brand/logo-gold-on-navy.jpg` | Gold logo, used on navy backgrounds (sidebar, dashboard welcome banner) |
| `public/brand/logo-navy-on-white.jpg` | Navy logo, for white or light backgrounds |

To swap a logo, replace the file and keep the same name. The sidebar navy (`--navy: #122f41` in `src/index.css`) was sampled from the gold logo's background, so the logo blends into the sidebar. If the background colour of a new logo changes, update that token as well.

## Languages (Thai / English)

The hub is available in **Thai and English**. Users switch language with the **TH | EN** buttons in the top bar or under **Settings → Language**. The choice is saved in the browser. If a user has not chosen yet, the hub shows Thai, unless the browser's language is English.

| What | Where |
|---|---|
| UI text (menus, buttons, messages) | `src/i18n/strings.ts`. The `en` object defines every key, and `th` must have the same keys, which TypeScript checks. |
| Application names and descriptions | `nameTh` / `descriptionTh` on each entry in `src/config/apps.ts`. Both are optional; if one is empty, the English text is shown. |
| Category names | `nameTh` / `shortNameTh` / `descriptionTh` in `src/config/categories.ts` |
| Thai font | Noto Sans Thai, loaded in `index.html`. Thai-specific spacing is set under `html[lang='th']` in `src/index.css`. |

Search matches both languages: typing `การเงิน` or `finance` finds the same app.

## Register a new application

All applications are defined in **`src/config/apps.ts`**. The order of the array is the order shown in the portal.

```ts
{
  id: 'quality-control',            // unique, kebab-case
  name: 'Quality Control',
  nameTh: 'ควบคุมคุณภาพ',           // optional Thai name
  description: 'Record QA/QC checks and non-conformance reports.',
  descriptionTh: 'บันทึกการตรวจสอบคุณภาพและรายงานงานที่ไม่เป็นไปตามข้อกำหนด', // optional
  category: 'engineering',          // 'engineering' | 'business' | 'ai'  (see categories.ts)
  icon: 'shield-check',             // key from src/config/icons.ts
  url: 'https://qc.yourcompany.com',// '' = not configured yet
  status: 'available',              // 'available' | 'beta' | 'maintenance' | 'coming-soon'
  openMode: 'new-tab',              // 'new-tab' | 'same-tab' | 'embedded'
  featured: false,                  // show in dashboard Quick Access
  defaultFavorite: false,           // pre-starred for new users
}
```

- **Categories** are defined in `src/config/categories.ts`. To add one, also add its id to `CategoryId` in `src/config/types.ts`.
- **Icons**: to add one, import it from `lucide-react` in `src/config/icons.ts` and give it a key.

### Configure an application's URL

Set `url` to an absolute `https://…` address or a same-origin path such as `/projects/`. A path is resolved from the domain root, not from the GitHub Pages sub-path, so use full `https://` URLs on GitHub Pages. Only `http(s)` URLs and paths are accepted. Any other value (for example `javascript:`) is treated as an **Invalid URL** and is never opened. Do not put passwords, tokens or API keys in URLs.

**Connected so far:** Crystal SiteView 360, BOQ & Estimation and Html-Opener, all hosted under `https://crystalengineeringcorporation.github.io/`. The other 11 entries still have an empty `url` and show **Not configured**. Fill in each `url` as the real applications become available.

### In-browser Application Management (local demo)

Go to **Settings → Manage applications** (`/settings/applications`). There you can add, edit, reorder and remove applications, and import or export the catalog as JSON. Edits are saved in **this browser's localStorage only**:

- Edits are not shared with other users.
- They are not a security control: anyone using that browser can change them.
- To publish changes, click **Export JSON**, copy the entries into `apps.ts`, then rebuild and redeploy.
- **Restore defaults** discards the local edits.

## How launching works

The launch logic lives in `src/lib/launcher.ts`, separate from the UI. `resolveLaunch(app)` decides what should happen, and `HubProvider.launch` carries it out:

| Situation | Result |
|---|---|
| `url` empty | Dialog: *Application not configured yet* → link to Configure Application |
| `url` not http(s) or a `/path` | Dialog: *Invalid application address* (nothing is opened) |
| `status: 'coming-soon'` | Dialog: *Coming soon* |
| `status: 'maintenance'` | Warning dialog with *Open anyway* |
| `openMode: 'new-tab'` | Opens a new tab with the opener cleared. If a popup blocker stops it, a dialog offers a direct link instead |
| `openMode: 'same-tab'` | Navigates the current tab to the app |
| `openMode: 'embedded'` | Opens `/workspace/:id`: the app in an iframe, with **Dashboard** (back) and **Open in new tab** buttons |

**Iframe fallback:** many sites forbid embedding (`X-Frame-Options` or CSP `frame-ancestors`). A page cannot reliably detect this for a cross-origin iframe. So for a cross-origin app, the workspace always shows a notice and the **Open in new tab** button. Use `embedded` only for apps that you know allow framing by the portal's domain. Use `new-tab` for everything else.

A launch that succeeds is added to **Recently Used**. This covers new-tab, same-tab and embedded opens.

## What works now vs. what needs a backend

**Working now, entirely in the browser:**
- Dashboard, application directory and category pages
- Global search: Ctrl+K or `/`, with arrow-key navigation and Enter to launch
- Directory filters: text, category and favorites. Their state is kept in the URL.
- Favorites and Recently Used, saved in localStorage
- Application launching, including all the states in the table above
- Embedded workspace
- Local catalog management, plus JSON import and export
- Collapsible sidebar on desktop and a slide-out drawer on mobile and tablet
- Thai and English interface, with the language choice saved in the browser

**These need a backend or external system:**
- **Sign-in / SSO and user profiles.** The profile menu shows a "Guest User" placeholder.
- **Role-based admin access** to Application Management.
- **Shared catalog management.** Today every change goes through `apps.ts`, or is a per-browser local edit.
- **Notifications.** The panel shows an empty state.
- **Overview figures.** *Total Projects* and *Pending Actions* show "—" and are labelled **Not connected**. *Active Applications* is calculated from the registry. *Recent Activities* counts launches made from this browser only.
- **Syncing favorites and recents across devices.**
- **The remaining 11 applications.** Only Crystal SiteView 360, BOQ & Estimation and Html-Opener are linked so far.

## Project structure

```
src/
  config/      apps.ts (registry), categories.ts, icons.ts, navigation.ts, types.ts
  i18n/        strings.ts (TH/EN text), I18nProvider.tsx, useI18n.ts, context.ts
  lib/         launcher.ts, search.ts, storage.ts, validateCatalog.ts, time.ts, useDismiss.ts
  state/       HubContext.tsx (provider), context.ts, useHub.ts
  components/  AppShell, Sidebar, Topbar, GlobalSearch, AppCard, DirectoryView, LaunchDialog, AppForm, …
  pages/       Dashboard, Directory, Favorites, Recent, Settings, AppManagement, Workspace, NotFound
  index.css    design tokens + all styles
```
