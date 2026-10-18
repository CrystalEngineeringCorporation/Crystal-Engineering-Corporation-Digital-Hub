/** URL of a file in `public/`, respecting the deploy base path (e.g. GitHub Pages sub-path). */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

/** Router basename derived from the deploy base path ("/" locally, "/<repo>" on GitHub Pages). */
export const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
