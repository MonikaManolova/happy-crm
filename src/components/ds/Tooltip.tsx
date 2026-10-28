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

/** Dark tooltip above or below `rect`, either centred on it or right-aligned to it. */
export function Tooltip({
  rect,
  text,
  align,
  side = 'top',
}: {
  rect: DOMRect;
  text: string;
  align: 'center' | 'end';
  side?: 'top' | 'bottom';
}) {
  const x = align === 'center' ? { left: rect.left + rect.width / 2, tx: '-50%' } : { left: rect.right, tx: '-100%' };
  const pos: CSSProperties =
    side === 'top'
      ? { top: rect.top - 6, left: x.left, transform: `translate(${x.tx}, -100%)` }
      : { top: rect.bottom + 6, left: x.left, transform: `translate(${x.tx}, 0)` };
  return createPortal(
    <span role="tooltip" style={{ ...tipStyle, ...pos }}>
      {text}
    </span>,
    document.body,
  );
}
