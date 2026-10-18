import { createElement } from 'react';
import { getIcon } from '../config/icons';

interface Props {
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'navy' | 'gold' | 'muted';
}

export function AppIcon({ icon, size = 'md', tone = 'navy' }: Props) {
  const px = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;
  return (
    <span className={`app-icon app-icon--${size} app-icon--${tone}`} aria-hidden="true">
      {createElement(getIcon(icon), { size: px, strokeWidth: 1.75 })}
    </span>
  );
}
