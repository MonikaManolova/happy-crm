import { useRef, useState, type ButtonHTMLAttributes, type CSSProperties } from 'react';
import type { ControlSize } from './Button';
import { resolveIcon } from './Button';
import { Tooltip } from './Tooltip';
import { useInlineSvg } from './useInlineSvg';

/* Happy design system — IconButton (components/actions/IconButton.jsx). */

const SIZES: Record<ControlSize, number> = { small: 28, medium: 32, large: 36 };
const PADDING: Record<ControlSize, string> = { small: '4px 8px', medium: '6px 8px', large: '8px 10px' };

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  icon: string;
  size?: ControlSize;
  disabled?: boolean;
  tooltip?: string;
}

export function IconButton({ icon, size = 'medium', disabled = false, tooltip, style, ...rest }: IconButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const resolved = disabled ? 'disabled' : focus ? 'focused' : hover ? 'hover' : 'default';
  const dim = SIZES[size];
  const iconSvg = useInlineSvg(resolveIcon(icon));
  let visual: CSSProperties = { background: 'transparent', boxShadow: 'none', opacity: 1 };
  if (resolved === 'hover') visual = { background: 'var(--grey-100)', boxShadow: 'none', opacity: 1 };
  if (resolved === 'focused') {
    visual = { background: 'var(--white)', boxShadow: 'var(--hairline-focus), var(--focused-primary-50)', opacity: 1 };
  }
  if (resolved === 'disabled') visual = { background: 'transparent', boxShadow: 'none', opacity: 0.5 };

  const btn = (
    <button
      type="button"
      aria-label={tooltip}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        appearance: 'none',
        border: 'none',
        width: dim,
        height: dim,
        padding: PADDING[size],
        borderRadius: 'var(--rounded-lg)',
        display: 'inline-flex',
        gap: 'var(--space-1)',
        justifyContent: 'center',
        alignItems: 'center',
        color: resolved === 'hover' ? 'var(--grey-900)' : resolved === 'default' ? 'var(--grey-500)' : 'var(--grey-600)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...visual,
        ...style,
      }}
      {...rest}
    >
      <span
        aria-hidden="true"
        style={{ flexShrink: 0, width: 18, height: 18, display: 'inline-flex' }}
        dangerouslySetInnerHTML={{ __html: iconSvg }}
      />
    </button>
  );
  if (!tooltip) return btn;
  const rect = hover && !disabled && wrapRef.current ? wrapRef.current.getBoundingClientRect() : null;
  return (
    <span ref={wrapRef} style={{ position: 'relative', display: 'inline-flex' }}>
      {btn}
      {rect ? <Tooltip rect={rect} text={tooltip} align="center" /> : null}
    </span>
  );
}
