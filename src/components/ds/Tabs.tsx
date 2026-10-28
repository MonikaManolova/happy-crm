import { useState, type CSSProperties } from 'react';
import { Icon } from './Icon';

/* Happy design system — HorizontalTabs (components/navigation/HorizontalTabs.jsx). */

export type TabItem = string | { label: string; icon?: string; count?: number };
const norm = (it: TabItem) => (typeof it === 'string' ? { label: it } : it);

function TabButton({ item, active, fill, onClick }: { item: TabItem; active: boolean; fill: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const { label, icon, count } = norm(item);
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
        flex: fill ? '1 0 0' : undefined,
        minWidth: fill ? 0 : undefined,
        flexShrink: 0,
        transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease',
      }}
    >
      {icon ? <Icon icon={icon} size={18} /> : null}
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: '0 var(--space-0-5)' }}>
        {label}
        {count != null ? <span style={{ opacity: 0.7 }}>{count}</span> : null}
      </span>
    </button>
  );
}

export function HorizontalTabs({
  items,
  value,
  onChange,
  fill = false,
  label,
  style,
}: {
  items: TabItem[];
  value: number;
  onChange: (index: number) => void;
  /** Stretch to the full width with equal-width tabs. */
  fill?: boolean;
  /** Accessible name of the tab list. */
  label?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      style={{
        borderRadius: 'var(--rounded-lg)',
        background: 'var(--grey-50)',
        boxShadow: 'var(--hairline), var(--shadow-control)',
        display: fill ? 'flex' : 'inline-flex',
        flexDirection: 'row',
        gap: 'var(--space-0-5)',
        alignItems: 'center',
        maxWidth: '100%',
        overflowX: 'auto',
        flexShrink: 0,
        alignSelf: fill ? 'stretch' : 'flex-start',
        ...style,
      }}
    >
      {items.map((it, i) => (
        <TabButton key={norm(it).label} item={it} active={value === i} fill={fill} onClick={() => onChange(i)} />
      ))}
    </div>
  );
}
