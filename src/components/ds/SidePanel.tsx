import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { icon } from '../../lib/assets';
import { IconButton } from './IconButton';
import { BACKDROP } from './Modal';

/* Right-hand side panel on the same dimmed backdrop as Modal. It slides in from
   the right on mount; closing (X, Esc or a backdrop click) slides it back out
   and then calls `onClose`, so the parent unmounts it after the animation. */

const ANIM_MS = 240;

/** Close function handed to the panel's footer, so footer actions can animate out too. */
export type CloseFn = () => void;

export function SidePanel({
  title,
  onClose,
  footer,
  children,
  width = 500,
}: {
  title: string;
  onClose: () => void;
  footer?: (close: CloseFn) => ReactNode;
  children: ReactNode;
  width?: number;
}) {
  const [shown, setShown] = useState(false);
  const closing = useRef(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    setShown(false);
    setTimeout(onClose, ANIM_MS);
  };
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, []);

  // Portalled to <body> so no ancestor's stacking context (e.g. the app bar) can cover it.
  return createPortal(
    <div
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5000,
        background: BACKDROP,
        display: 'flex',
        justifyContent: 'flex-end',
        opacity: shown ? 1 : 0,
        transition: `opacity ${ANIM_MS}ms ease-out`,
        pointerEvents: shown ? 'auto' : 'none',
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="side-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: '100%',
          height: '100%',
          background: 'var(--white)',
          boxShadow: '0px 2px 6px 0px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          transform: shown ? 'translateX(0)' : 'translateX(100%)',
          transition: `transform ${ANIM_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        <div style={{ height: 62, flexShrink: 0, display: 'flex', flexDirection: 'row', gap: 'var(--space-2)', alignItems: 'center', padding: '16px 16px 16px 20px' }}>
          <h2
            style={{
              margin: 0,
              flex: '1 0 0',
              minWidth: 0,
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              lineHeight: 'var(--leading-7)',
              color: 'var(--grey-900)',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </h2>
          <IconButton size="small" icon={icon('LucideX-a3')} tooltip="Затвори" tooltipPlacement="bottom-end" onClick={close} />
        </div>
        <div style={{ flex: '1 0 0', minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: '0 20px 20px' }}>
          {children}
        </div>
        {footer ? (
          <div
            style={{
              flexShrink: 0,
              borderTop: '1px solid #DDE4EE',
              boxShadow: '0px -2px 7px rgba(0,0,0,0.04)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-1-5)',
              justifyContent: 'flex-end',
              padding: 12, // + the 1px top border = the design's 13px
            }}
          >
            {footer(close)}
          </div>
        ) : null}
      </aside>
    </div>,
    document.body,
  );
}
