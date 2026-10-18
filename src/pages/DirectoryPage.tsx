import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DirectoryView, type CategoryFilter } from '../components/DirectoryView';
import { getCategory, isCategoryId } from '../config/categories';
import { useI18n } from '../i18n/useI18n';
import { NotFoundPage } from './NotFoundPage';

/** Full directory. Category lives in the path (/apps/:category); search and favorites in the query string. */
export function DirectoryPage() {
  const { category: param } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, categoryDescription } = useI18n();

  if (param !== undefined && !isCategoryId(param)) return <NotFoundPage />;
  const category: CategoryFilter = param ?? 'all';
  const query = params.get('q') ?? '';
  const favoritesOnly = params.get('fav') === '1';

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <div className="page">
      <p className="page-intro">
        {category === 'all'
          ? t.directory.introAll
          : categoryDescription(getCategory(category))}
      </p>
      <DirectoryView
        query={query}
        onQueryChange={(q) => update('q', q)}
        category={category}
        onCategoryChange={(c) => navigate({ pathname: c === 'all' ? '/apps' : `/apps/${c}`, search: params.toString() })}
        favoritesOnly={favoritesOnly}
        onFavoritesOnlyChange={(v) => update('fav', v ? '1' : '')}
      />
    </div>
  );
}
