import { useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { icon as iconUrl } from '../../lib/assets';
import { Tooltip } from './Tooltip';
import { useInlineSvg } from './useInlineSvg';

/* Happy design system — Button (components/actions/Button.jsx).
   `icon` takes an asset URL or a bare icon name from public/assets/icons. */

export type ButtonType = 'solid' | 'outline';
export type ControlSize = 'small' | 'medium' | 'large';
type State = 'default' | 'hover' | 'focused' | 'disabled';

const SIZES: Record<ControlSize, { height: number; padding: string }> = {
  small: { height: 28, padding: 'var(--space-1) var(--space-2)' },
  medium: { height: 32, padding: 'var(--space-1-5) var(--space-2)' },
  large: { height: 36, padding: 'var(--space-2) var(--space-2-5)' },
};

function visual(type: ButtonType, state: State): CSSProperties {
  if (type === 'solid') {
    const base = { background: 'var(--primary-600)', color: 'var(--white)', boxShadow: 'var(--shadow-control)' };
    if (state === 'hover') return { ...base, background: 'var(--primary-500)' };
    if (state === 'focused') return { ...base, boxShadow: 'var(--shadow-control), var(--focused-primary-200)' };
    if (state === 'disabled') return { ...base, opacity: 0.5 };
    return base;
  }
  const base = { background: 'var(--white)', color: 'var(--grey-900)', boxShadow: 'var(--hairline), var(--shadow-control)' };
  if (state === 'hover') return { ...base, background: 'var(--grey-50)', boxShadow: 'var(--hairline-strong), var(--shadow-control)' };
  if (state === 'focused') return { ...base, boxShadow: 'var(--hairline-focus), var(--shadow-control), var(--focused-primary-50)' };
  if (state === 'disabled') return { ...base, background: 'var(--grey-50)', color: 'var(--grey-400)' };
  return base;
}

export const resolveIcon = (i?: string) => (i && !/[/.]/.test(i) ? iconUrl(i) : i);

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: ButtonType;
  size?: ControlSize;
  disabled?: boolean;
  iconOnly?: boolean;
  icon?: string;
  trailingIcon?: string;
  tooltip?: string;
  /** Tooltip above the button, right-aligned (default), or to its right. */
  tooltipPlacement?: 'top-end' | 'right';
  children?: ReactNode;
}

export function Button({
  type = 'solid',
  size = 'medium',
  disabled = false,
  iconOnly = false,
  icon,
  trailingIcon,
  children,
  style,
  tooltip,
  tooltipPlacement = 'top-end',
  ...rest
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const resolved: State = disabled ? 'disabled' : focus ? 'focused' : hover ? 'hover' : 'default';
  const s = SIZES[size];
  const iconColor = type !== 'solid' && resolved === 'default' ? 'var(--grey-500)' : undefined;
  const iconSvg = useInlineSvg(resolveIcon(icon));
  const trailingSvg = useInlineSvg(resolveIcon(trailingIcon));
  const iconBox: CSSProperties = { flexShrink: 0, width: 18, height: 18, display: 'inline-flex', color: iconColor };

  const btn = (
    <button
      type="button"
      disabled={disabled}
      aria-label={iconOnly ? tooltip : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        appearance: 'none',
        border: 'none',
        font: 'inherit',
        height: s.height,
        width: iconOnly ? s.height : undefined,
        padding: s.padding,
        borderRadius: 'var(--rounded-lg)',
        display: 'inline-flex',
        flexDirection: 'row',
        gap: 'var(--space-1)',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 'var(--leading-5)',
        whiteSpace: 'nowrap',
        ...visual(type, resolved),
        ...style,
      }}
      {...rest}
    >
      {icon ? <span aria-hidden="true" style={iconBox} dangerouslySetInnerHTML={{ __html: iconSvg }} /> : null}
      {!iconOnly && children != null ? (
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-0-5)' }}>{children}</span>
      ) : null}
      {!iconOnly && trailingIcon ? (
        <span aria-hidden="true" style={iconBox} dangerouslySetInnerHTML={{ __html: trailingSvg }} />
      ) : null}
    </button>
  );
  if (!tooltip) return btn;
  const rect = hover && !disabled && wrapRef.current ? wrapRef.current.getBoundingClientRect() : null;
  return (
    <span ref={wrapRef} style={{ position: 'relative', display: 'inline-flex' }}>
      {btn}
      {rect ? <Tooltip rect={rect} text={tooltip} align="end" side={tooltipPlacement === 'right' ? 'right' : 'top'} /> : null}
    </span>
  );
}
