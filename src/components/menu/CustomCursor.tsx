import { createContext, useContext, useMemo, useRef, type MouseEvent, type ReactNode } from 'react';

/* Over a dish card the native cursor is hidden and a 46px green "+" follows
   the mouse. Interactive bits inside the card (select, "Детайли", the quantity
   badge) suppress it so the normal cursor shows there. */

interface CursorApi {
  enter: (e: MouseEvent) => void;
  move: (e: MouseEvent) => void;
  leave: () => void;
  suppress: () => void;
  release: () => void;
}

const CursorContext = createContext<CursorApi | null>(null);

export function useCustomCursor() {
  const api = useContext(CursorContext);
  if (!api) throw new Error('useCustomCursor must be used inside <CustomCursorProvider>');
  return api;
}

export function CustomCursorProvider({ children }: { children: ReactNode }) {
  const posRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const blocked = useRef(false);

  const api = useMemo<CursorApi>(() => {
    const show = (on: boolean) => {
      const dot = dotRef.current;
      if (!dot) return;
      dot.style.opacity = on ? '1' : '0';
      dot.style.transform = on ? 'scale(1)' : 'scale(0.6)';
    };
    const paint = (e: MouseEvent) => {
      if (blocked.current) return show(false);
      show(true);
      if (posRef.current) posRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    };
    return {
      enter: (e) => {
        blocked.current = false;
        paint(e);
      },
      move: paint,
      leave: () => {
        blocked.current = false;
        show(false);
      },
      suppress: () => {
        blocked.current = true;
        show(false);
      },
      release: () => {
        blocked.current = false;
      },
    };
  }, []);

  return (
    <CursorContext.Provider value={api}>
      {children}
      <div ref={posRef} aria-hidden="true" style={{ position: 'fixed', left: 0, top: 0, width: 0, height: 0, pointerEvents: 'none', zIndex: 9999 }}>
        <div
          ref={dotRef}
          style={{
            position: 'absolute',
            left: -23,
            top: -23,
            width: 46,
            height: 46,
            borderRadius: 9999,
            border: '1px solid var(--white, #FFFFFF)',
            background: 'var(--primary-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 0px 0px 3px rgba(51, 165, 86, 0.4)',
            opacity: 0,
            transform: 'scale(0.6)',
            transition: 'opacity 140ms ease, transform 180ms cubic-bezier(0.34,1.4,0.64,1)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </div>
      </div>
    </CursorContext.Provider>
  );
}
