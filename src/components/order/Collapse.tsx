import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/** Animates height open/closed with the grid-template-rows 0fr → 1fr trick. */
export function Collapse({
  open,
  children,
  duration = 240,
  fade = false,
  overflow = 'hidden',
  style,
  innerStyle,
}: {
  open: boolean;
  children: ReactNode;
  duration?: number;
  fade?: boolean;
  overflow?: CSSProperties['overflow'];
  style?: CSSProperties;
  /** Style for the clipped inner box. Its padding stays visible when collapsed. */
  innerStyle?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Keep collapsed content out of the tab order. React 18 has no `inert` prop.
  useEffect(() => {
    ref.current?.toggleAttribute('inert', !open);
  }, [open]);
  return (
    <div
      ref={ref}
      aria-hidden={!open}
      style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        opacity: fade ? (open ? 1 : 0) : undefined,
        transition: `grid-template-rows ${duration}ms ease-out${fade ? `, opacity ${duration}ms ease-out` : ''}`,
        ...style,
      }}
    >
      <div style={{ minHeight: 0, overflow, ...innerStyle }}>{children}</div>
    </div>
  );
}
