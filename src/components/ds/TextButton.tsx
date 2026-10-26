import { useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { resolveIcon } from './Button';
import { useInlineSvg } from './useInlineSvg';

/* Happy design system — TextButton (components/actions/TextButton.jsx). */

function visual(state: 'default' | 'hover' | 'disabled'): CSSProperties {
  if (state === 'hover') return { color: 'var(--grey-900)', textDecoration: 'underline' };
  if (state === 'disabled') return { color: 'var(--grey-400)', textDecoration: 'none' };
  return { color: 'var(--grey-600)', textDecoration: 'none' };
}

export interface TextButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  icon?: string;
  disabled?: boolean;
  children?: ReactNode;
}

export function TextButton({ icon, disabled = false, children, style, ...rest }: TextButtonProps) {
  const [hover, setHover] = useState(false);
  const iconSvg = useInlineSvg(resolveIcon(icon));
  const resolved = disabled ? 'disabled' : hover ? 'hover' : 'default';
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        padding: 0,
        height: 20,
        display: 'inline-flex',
        flexDirection: 'row',
        gap: 'var(--space-1)',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 'var(--leading-5)',
        whiteSpace: 'nowrap',
        ...visual(resolved),
        ...style,
      }}
      {...rest}
    >
      {icon ? (
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            width: 18,
            height: 18,
            display: 'inline-flex',
            color: disabled ? 'currentColor' : 'var(--primary-500)',
          }}
          dangerouslySetInnerHTML={{ __html: iconSvg }}
        />
      ) : null}
      {children != null ? (
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-0-5)', textDecoration: 'inherit' }}>
          {children}
        </span>
      ) : null}
    </button>
  );
}
