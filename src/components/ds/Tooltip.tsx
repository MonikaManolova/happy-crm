import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';

const tipStyle: CSSProperties = {
  position: 'fixed',
  zIndex: 10000,
  padding: '4px 8px',
  borderRadius: 'var(--rounded-md)',
  background: 'var(--grey-900)',
  color: 'var(--white)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-xs)',
  lineHeight: '16px',
  fontWeight: 'var(--font-medium)' as CSSProperties['fontWeight'],
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  boxShadow: 'var(--shadow-popover)',
};

/** Dark tooltip above `rect`, either centred on it or right-aligned to it. */
export function Tooltip({ rect, text, align }: { rect: DOMRect; text: string; align: 'center' | 'end' }) {
  const pos: CSSProperties =
    align === 'center'
      ? { top: rect.top - 6, left: rect.left + rect.width / 2, transform: 'translate(-50%, -100%)' }
      : { top: rect.top - 6, left: rect.right, transform: 'translate(-100%, -100%)' };
  return createPortal(
    <span role="tooltip" style={{ ...tipStyle, ...pos }}>
      {text}
    </span>,
    document.body,
  );
}
