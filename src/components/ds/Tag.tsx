import type { CSSProperties, ReactNode } from 'react';
import { Icon } from './Icon';

/* Happy design system — Tag (components/data-display/Tag.jsx), medium size.
   `icon` is an icon name or URL, drawn in the tag's text colour. */

const COLORS = {
  grey: { background: 'var(--tag-wash-grey)', border: 'var(--grey-200)', color: 'var(--grey-600)' },
  primary: { background: 'var(--tag-wash-primary)', border: 'var(--primary-100)', color: 'var(--primary-500)' },
  red: { background: 'var(--tag-wash-red)', border: 'var(--danger-100)', color: 'var(--danger-500)' },
  yellow: { background: 'var(--tag-wash-yellow)', border: 'var(--warning-200)', color: 'var(--warning-700)' },
  blue: { background: 'var(--tag-wash-blue)', border: 'var(--info-100)', color: 'var(--info-600)' },
  purple: { background: 'var(--tag-wash-purple)', border: 'var(--purple-200)', color: 'var(--purple-600)' },
};

export function Tag({
  color = 'grey',
  icon,
  children,
  style,
}: {
  color?: keyof typeof COLORS;
  icon?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const c = COLORS[color];
  return (
    <span
      style={{
        height: 24,
        borderRadius: 'var(--rounded-md)',
        background: c.background,
        boxShadow: `inset 0 0 0 1px ${c.border}`,
        color: c.color,
        display: 'inline-flex',
        flexDirection: 'row',
        gap: 'var(--space-0-5)',
        padding: '2px 4px',
        alignItems: 'center',
        ...style,
      }}
    >
      {icon ? <Icon icon={icon} size={18} /> : null}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 var(--space-0-5)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-medium)',
          lineHeight: 'var(--leading-5)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {children}
      </span>
    </span>
  );
}
