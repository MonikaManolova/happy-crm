import { useEffect, type ReactNode } from 'react';
import { IconButton } from './IconButton';

/* Happy design system — Modal (components/overlays/Modal.jsx), rendered on a
   dimmed backdrop. Esc and a backdrop click both call `onClose`. */

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
  footer?: ReactNode;
  children?: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5000,
        background: 'rgba(23, 23, 23, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
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
            <IconButton icon="LucideX-a3" onClick={onClose} tooltip="Затвори" style={{ flexShrink: 0 }} />
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
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
