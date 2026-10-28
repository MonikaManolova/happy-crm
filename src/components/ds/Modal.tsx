import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from './IconButton';

/* Happy design system — Modal (components/overlays/Modal.jsx), rendered on a
   dimmed backdrop. It fades and rises in on mount. The X, Esc and a backdrop
   click play the exit animation and then call `onClose`, so the parent
   unmounts it afterwards; a footer render function gets the same `close`. */

/** Dim layer behind overlays (Modal, SidePanel). */
export const BACKDROP = 'rgba(23, 23, 23, 0.5)';

const ANIM_MS = 200;

export function Modal({
  title,
  subtitle,
  onClose,
  footer,
  children,
  width = 480,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  footer?: ReactNode | ((close: () => void) => ReactNode);
  children?: ReactNode;
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        opacity: shown ? 1 : 0,
        transition: `opacity ${ANIM_MS}ms ease-out`,
        pointerEvents: shown ? 'auto' : 'none',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
          transition: `transform ${ANIM_MS}ms ease-out, opacity ${ANIM_MS}ms ease-out`,
          borderRadius: 'var(--rounded-xl)',
          background: 'var(--white)',
          boxShadow: 'inset 0 0 0 1px #DDE4EE',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ padding: '16px 14px 16px 20px', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', alignSelf: 'stretch' }}>
          <div style={{ height: 32, display: 'flex', flexDirection: 'row', gap: 'var(--space-1-5)', alignItems: 'flex-start', alignSelf: 'stretch' }}>
            <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', alignItems: 'center', padding: '2px 0' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)',
                  lineHeight: 'var(--leading-7)',
                  color: 'var(--grey-900)',
                }}
              >
                {title}
              </span>
            </div>
            <IconButton icon="LucideX-a3" onClick={close} tooltip="Затвори" style={{ flexShrink: 0 }} />
          </div>
          {subtitle ? (
            <div style={{ padding: '2px 10px 2px 0', display: 'flex', alignItems: 'center', alignSelf: 'stretch' }}>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-normal)',
                  lineHeight: 'var(--leading-5)',
                  color: 'var(--grey-700)',
                }}
              >
                {subtitle}
              </span>
            </div>
          ) : null}
        </div>
        {children ? (
          <div
            style={{
              padding: '0 var(--space-5) var(--space-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              alignItems: 'flex-start',
              alignSelf: 'stretch',
            }}
          >
            {children}
          </div>
        ) : null}
        {footer ? (
          <div
            style={{
              borderTop: '1px solid #DDE4EE',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'row',
              gap: 'var(--space-2)',
              justifyContent: 'flex-end',
              alignItems: 'center',
              alignSelf: 'stretch',
            }}
          >
            {typeof footer === 'function' ? footer(close) : footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
