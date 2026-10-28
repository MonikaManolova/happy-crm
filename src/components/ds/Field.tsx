import type { CSSProperties, ReactNode } from 'react';

/* Shared by Input, Textarea and Select (components/forms/Input.jsx). */

export type FieldState = 'default' | 'hover' | 'focused' | 'disabled' | 'error';

/* Borders are a 0.5px inset + 0.5px outset pair — a hairline finer than 1px. */
export const hair = (c: string) => `inset 0 0 0 0.5px ${c}, 0 0 0 0.5px ${c}`;

export function fieldVisual(state: FieldState): CSSProperties {
  if (state === 'hover') return { background: 'var(--white)', boxShadow: `${hair('var(--grey-300)')}, var(--shadow-control)` };
  if (state === 'focused')
    return { background: 'var(--white)', boxShadow: `${hair('var(--primary-400)')}, var(--shadow-control), var(--focused-primary-50)` };
  if (state === 'disabled') return { background: 'var(--grey-50)', boxShadow: `${hair('var(--grey-200)')}, var(--shadow-control)` };
  if (state === 'error') return { background: 'var(--white)', boxShadow: `${hair('var(--danger-400)')}, var(--shadow-control)` };
  return { background: 'var(--white)', boxShadow: `${hair('var(--grey-200)')}, var(--shadow-control)` };
}

const caption: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-xs)',
  fontWeight: 'var(--font-normal)',
  lineHeight: 'var(--leading-4)',
};

export function Field({ label, error, children, style }: { label?: string; error?: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', alignItems: 'flex-start', ...style }}>
      {label ? <span style={{ ...caption, color: 'var(--grey-600)' }}>{label}</span> : null}
      {children}
      {error ? <span style={{ ...caption, color: 'var(--danger-400)' }}>{error}</span> : null}
    </div>
  );
}

export const textControl: CSSProperties = {
  flexGrow: 1,
  minWidth: 0,
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-normal)',
  lineHeight: 'var(--leading-5)',
};
