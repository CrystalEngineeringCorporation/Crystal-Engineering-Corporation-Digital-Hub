import { useI18n } from '../i18n/useI18n';
import type { Availability } from '../lib/launcher';

export function StatusBadge({ availability }: { availability: Availability }) {
  const { t } = useI18n();
  return (
    <span className={`badge badge--${availability}`}>
      <span className="badge__dot" aria-hidden="true" />
      {t.availability[availability]}
    </span>
  );
}
