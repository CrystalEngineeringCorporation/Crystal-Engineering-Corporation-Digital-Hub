import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { useI18n } from '../i18n/useI18n';

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div className="page">
      <EmptyState
        icon={Compass}
        title={t.titles.pageNotFound}
        description={t.notFound.text}
        action={
          <Link to="/" className="btn btn--primary">
            {t.common.backToDashboard}
          </Link>
        }
      />
    </div>
  );
}
