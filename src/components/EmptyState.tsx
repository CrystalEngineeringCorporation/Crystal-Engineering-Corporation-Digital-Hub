import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({ icon: Icon, title, description, action, compact }: Props) {
  return (
    <div className={`empty${compact ? ' empty--compact' : ''}`}>
      <span className="empty__icon" aria-hidden="true">
        <Icon size={22} strokeWidth={1.6} />
      </span>
      <p className="empty__title">{title}</p>
      {description && <p className="empty__text">{description}</p>}
      {action && <div className="empty__action">{action}</div>}
    </div>
  );
}
