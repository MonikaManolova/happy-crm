import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { icon as iconUrl } from '../../lib/assets';
import type { ControlSize } from './Button';
import { Field, fieldVisual, textControl } from './Field';

/* Happy design system — Dropdown, ListItem and Select
   (components/overlays/Dropdown.jsx, ListItem.jsx, forms/Select.jsx). */

export type DropdownItem = string | { label: string; icon?: string };
const norm = (it: DropdownItem) => (typeof it === 'string' ? { label: it } : it);

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: 32,
        padding: 'var(--space-1-5) var(--space-2)',
        borderRadius: 'var(--rounded-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        gap: 'var(--space-1-5)',
        alignItems: 'center',
        alignSelf: 'stretch',
        ...fieldVisual(focus ? 'focused' : hover ? 'hover' : 'default'),
      }}
    >
      <img src={iconUrl('LucideSearch-a3')} alt="" width={16} height={16} style={{ flexShrink: 0 }} />
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{ ...textControl, color: 'var(--grey-900)' }}
      />
    </div>
  );
}

export function ListItem({ label, icon, onClick }: { label: string; icon?: string; onClick?: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      role="option"
      aria-selected={false}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: 32,
        borderRadius: 'var(--rounded-lg)',
        background: hover ? 'var(--grey-100)' : 'var(--white)',
        padding: '6px 8px',
        display: 'flex',
        flexDirection: 'row',
        gap: 'var(--space-2)',
        alignItems: 'center',
        alignSelf: 'stretch',
        cursor: 'pointer',
      }}
    >
      {icon ? <img src={icon} alt="" width={18} height={18} style={{ flexShrink: 0 }} /> : null}
      <span
        style={{
          flexGrow: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-normal)',
          lineHeight: 'var(--leading-5)',
          color: 'var(--grey-900)',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export interface DropdownProps {
  items: DropdownItem[];
  search?: boolean;
  searchPlaceholder?: string;
  onSelect?: (label: string, index: number) => void;
  width?: number | string;
  style?: CSSProperties;
}

export function Dropdown({ items, search = true, searchPlaceholder = 'Търси по име', onSelect, width = 280, style }: DropdownProps) {
  const [query, setQuery] = useState('');
  const q = query.toLowerCase();
  return (
    <div
      role="listbox"
      style={{
        width,
        minWidth: width,
        flexShrink: 0,
        borderRadius: 'var(--rounded-xl)',
        background: 'var(--white)',
        boxShadow: 'var(--hairline), var(--shadow-popover)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        overflow: 'hidden',
        ...style,
      }}
    >
      {search ? (
        <div style={{ padding: 'var(--space-2) var(--space-2) 0 var(--space-2)', display: 'flex', flexDirection: 'column', alignSelf: 'stretch' }}>
          <SearchInput value={query} placeholder={searchPlaceholder} onChange={setQuery} />
        </div>
      ) : null}
      <div style={{ padding: 'var(--space-2)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'stretch' }}>
        {items
          .map((raw, i) => ({ ...norm(raw), i }))
          .filter((it) => !q || it.label.toLowerCase().includes(q))
          .map((it) => (
            <ListItem key={it.label + it.i} label={it.label} icon={it.icon} onClick={() => onSelect?.(it.label, it.i)} />
          ))}
      </div>
    </div>
  );
}

const SELECT_SIZES: Record<ControlSize, { height: number; padding: string }> = {
  small: { height: 28, padding: 'var(--space-1) var(--space-1-5)' },
  medium: { height: 32, padding: 'var(--space-1-5) var(--space-2)' },
  large: { height: 36, padding: 'var(--space-2)' },
};

export interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  size?: ControlSize;
  disabled?: boolean;
  options?: string[];
  search?: boolean;
  searchPlaceholder?: string;
  onSelect?: (label: string, index: number) => void;
  /** Local extension: 'top' opens the menu above the trigger. */
  menuPlacement?: 'top' | 'bottom';
  onOpenChange?: (open: boolean) => void;
  style?: CSSProperties;
}

export function Select({
  label,
  placeholder = 'Select',
  value,
  size = 'medium',
  disabled = false,
  options,
  search = true,
  searchPlaceholder,
  onSelect,
  menuPlacement = 'bottom',
  onOpenChange,
  style,
}: SelectProps) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) onOpenChangeRef.current?.(open);
    mounted.current = true;
  }, [open]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hasMenu = !!options && options.length > 0;
  const resolved = disabled ? 'disabled' : open ? 'focused' : hover ? 'hover' : 'default';
  const s = SELECT_SIZES[size];
  const filled = value != null && value !== '';

  useEffect(() => {
    if (!open) return undefined;
    const away = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <Field label={label} style={{ alignSelf: 'stretch', ...style }}>
      <div ref={wrapRef} style={{ position: 'relative', alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
        <div
          role="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          tabIndex={disabled ? -1 : 0}
          onClick={disabled ? undefined : () => hasMenu && setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (!disabled && hasMenu && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              setOpen((o) => !o);
            }
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            height: s.height,
            padding: s.padding,
            borderRadius: 'var(--rounded-lg)',
            display: 'flex',
            flexDirection: 'row',
            gap: 'var(--space-1)',
            alignItems: 'center',
            alignSelf: 'stretch',
            cursor: disabled ? 'default' : 'pointer',
            outline: 'none',
            ...fieldVisual(resolved),
          }}
        >
          <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', alignItems: 'center', padding: '0 var(--space-0-5)' }}>
            <span
              style={{
                flexGrow: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-normal)',
                lineHeight: 'var(--leading-5)',
                color: disabled || !filled ? 'var(--grey-400)' : 'var(--grey-900)',
              }}
            >
              {filled ? value : placeholder}
            </span>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              flexShrink: 0,
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 120ms ease',
              color: resolved === 'hover' ? 'var(--grey-900)' : 'var(--grey-600)',
            }}
          >
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </div>
        {hasMenu && open ? (
          <Dropdown
            items={options}
            search={search}
            searchPlaceholder={searchPlaceholder}
            width="100%"
            style={
              menuPlacement === 'top'
                ? { position: 'absolute', bottom: 'calc(100% + var(--space-1))', left: 0, zIndex: 20 }
                : { position: 'absolute', top: 'calc(100% + var(--space-1))', left: 0, zIndex: 20 }
            }
            onSelect={(l, i) => {
              setOpen(false);
              onSelect?.(l, i);
            }}
          />
        ) : null}
      </div>
    </Field>
  );
}
