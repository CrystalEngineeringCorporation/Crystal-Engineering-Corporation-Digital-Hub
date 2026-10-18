import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  /** Short source label, so users can tell live, local and unconnected figures apart. */
  tag: string;
  tone?: 'live' | 'idle';
}

export function StatCard({ icon: Icon, label, value, hint, tag, tone = 'idle' }: Props) {
  return (
    <article className="stat">
      <div className="stat__top">
        <span className="stat__icon" aria-hidden="true">
          <Icon size={19} strokeWidth={1.7} />
        </span>
        <span className={`stat__tag stat__tag--${tone}`}>{tag}</span>
      </div>
      <p className="stat__value">{value}</p>
      <p className="stat__label">{label}</p>
      <p className="stat__hint">{hint}</p>
    </article>
  );
}
