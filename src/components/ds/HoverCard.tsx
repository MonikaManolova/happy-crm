import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/* Shows `content` while the pointer (or keyboard focus) is on the trigger:
   below it, right-aligned with it, `gap` apart. The card is portalled to
   <body> so it sits above everything, side panels and modals included. */

export function HoverCard({ content, children, gap = 4 }: { content: ReactNode; children: ReactNode; gap?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const id = useId();
  const show = () => ref.current && setRect(ref.current.getBoundingClientRect());
  const hide = () => setRect(null);

  // Close if the page scrolls or resizes underneath an open card.
  useLayoutEffect(() => {
    if (!rect) return undefined;
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return () => {
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
    };
  }, [rect]);

  return (
    <span
      ref={ref}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      aria-describedby={rect ? id : undefined}
      style={{ display: 'inline-flex' }}
    >
      {children}
      {rect
        ? createPortal(
            <div
              id={id}
              role="tooltip"
              style={{ position: 'fixed', top: rect.bottom + gap, left: rect.right, transform: 'translateX(-100%)', zIndex: 10000, pointerEvents: 'none' }}
            >
              {content}
            </div>,
            document.body,
          )
        : null}
    </span>
  );
}
