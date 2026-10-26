import { useState, type CSSProperties } from 'react';

/* Happy design system — HorizontalTabs (components/navigation/HorizontalTabs.jsx). */

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        appearance: 'none',
        border: active ? '1px solid var(--grey-200)' : '1px solid transparent',
        font: 'inherit',
        height: 32,
        padding: '6px 8px',
        borderRadius: 'var(--rounded-lg)',
        background: active ? 'var(--white)' : 'transparent',
        boxShadow: active ? 'var(--shadow-control)' : 'none',
        color: active || hover ? 'var(--grey-900)' : 'var(--grey-600)',
        display: 'inline-flex',
        gap: 'var(--space-1)',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 'var(--leading-5)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-0-5)' }}>{label}</span>
    </button>
  );
}

export function HorizontalTabs({
  items,
  value,
  onChange,
  style,
}: {
  items: string[];
  value: number;
  onChange: (index: number) => void;
  style?: CSSProperties;
}) {
  return (
    <div
      role="tablist"
      style={{
        borderRadius: 'var(--rounded-lg)',
        background: 'var(--grey-50)',
        boxShadow: 'var(--hairline), var(--shadow-control)',
        display: 'inline-flex',
        flexDirection: 'row',
        gap: 'var(--space-0-5)',
        alignItems: 'center',
        maxWidth: '100%',
        overflowX: 'auto',
        flexShrink: 0,
        alignSelf: 'flex-start',
        ...style,
      }}
    >
      {items.map((label, i) => (
        <TabButton key={label} label={label} active={value === i} onClick={() => onChange(i)} />
      ))}
    </div>
  );
}
