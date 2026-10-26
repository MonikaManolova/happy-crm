import { useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import type { ControlSize } from './Button';

/* Happy design system — Chip (components/actions/Chip.jsx). `icon` is an
   asset URL rendered as an <img>. */

const SIZES: Record<ControlSize, { height: number; padding: string }> = {
  small: { height: 28, padding: '4px 8px' },
  medium: { height: 32, padding: '6px 8px' },
  large: { height: 36, padding: '8px 10px' },
};

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  size?: ControlSize;
  active?: boolean;
  icon?: string;
  children?: ReactNode;
}

export function Chip({ size = 'medium', active = false, icon, children, style, ...rest }: ChipProps) {
  const [hover, setHover] = useState(false);
  const s = SIZES[size];
  let visual: CSSProperties = { background: 'var(--grey-100)', boxShadow: 'none', color: 'var(--grey-900)' };
  if (hover) visual = { background: 'var(--grey-200)', boxShadow: 'none', color: 'var(--grey-900)' };
  if (active) {
    visual = {
      background: 'var(--success-50)',
      boxShadow: 'var(--hairline-focus), var(--shadow-control)',
      color: 'var(--primary-600)',
    };
  }
  return (
    <button
      type="button"
      aria-pressed={active}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        appearance: 'none',
        border: 'none',
        font: 'inherit',
        height: s.height,
        padding: s.padding,
        borderRadius: 'var(--rounded-lg)',
        display: 'inline-flex',
        gap: 'var(--space-1)',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 'var(--leading-5)',
        whiteSpace: 'nowrap',
        ...visual,
        ...style,
      }}
      {...rest}
    >
      {icon ? <img src={icon} alt="" width={18} height={18} style={{ flexShrink: 0 }} /> : null}
      {children != null ? (
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-0-5)' }}>{children}</span>
      ) : null}
    </button>
  );
}
