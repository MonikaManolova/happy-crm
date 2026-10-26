import { useState, type CSSProperties } from 'react';

/* Happy design system — Radio (components/forms/Radio.jsx). */

const SHADOW = '0px 0.5px 2px 0px rgba(0,0,0,0.05)';

export function Radio({ checked, onChange, name }: { checked: boolean; onChange?: () => void; name?: string }) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const c = hover ? 'var(--primary-700)' : 'var(--primary-500)';
  const off = hover ? 'var(--grey-400)' : 'var(--grey-300)';
  const box: CSSProperties = {
    width: 16,
    height: 16,
    borderRadius: 100,
    flexShrink: 0,
    background: 'var(--white)',
    boxShadow: `inset 0 0 0 ${checked ? 5 : 1}px ${checked ? c : off}, ${SHADOW}${focus ? ', var(--focused-primary-50)' : ''}`,
    transition: 'background-color 150ms, box-shadow 150ms, color 150ms',
  };
  return (
    <label
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => e.stopPropagation()}
      style={{ display: 'inline-flex', alignItems: 'flex-start', cursor: 'pointer', userSelect: 'none' }}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={() => onChange?.()}
        onFocus={(e) => setFocus(e.target.matches(':focus-visible'))}
        onBlur={() => setFocus(false)}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1, margin: 0, pointerEvents: 'none' }}
      />
      <span style={{ height: 20, display: 'flex', alignItems: 'center' }}>
        <span style={box} />
      </span>
    </label>
  );
}
