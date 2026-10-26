import { stripPrice } from '../../lib/pricing';

export interface OptionPanelProps {
  title: string;
  /** Square thumbnail before the title (extra panels only). */
  thumb?: string;
  items: string[];
  /** Radio-style: at most one item can be on. */
  single?: boolean;
  open: boolean;
  onToggleOpen: () => void;
  isOn: (item: string) => boolean;
  onToggleItem: (item: string) => void;
}

/** Expandable list of checkable items: "Премахни съставки", "Добавки", "Добави вкус"… */
export function OptionPanel({ title, thumb, items, single, open, onToggleOpen, isOn, onToggleItem }: OptionPanelProps) {
  const chosen = items.filter(isOn).map((l) => stripPrice(l).toLowerCase());
  const summary = !open && chosen.length ? ' - ' + chosen.join(', ') : '';
  return (
    <div style={{ flexShrink: 0, alignSelf: 'stretch', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--grey-200)' }}>
      <button
        type="button"
        className="hover-panel-head"
        aria-expanded={open}
        onClick={onToggleOpen}
        style={{
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          font: 'inherit',
          textAlign: 'left',
          height: 46,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: thumb ? 10 : 8,
          padding: thumb ? '4px 12px 4px 4px' : '10px 12px',
          alignItems: 'center',
          cursor: 'pointer',
          color: '#737373',
          transition: 'background 140ms ease-out, color 140ms ease-out',
        }}
      >
        {thumb ? (
          <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 7, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={thumb} alt="" width={144} height={144} style={{ width: 34, height: 34, objectFit: 'contain' }} />
          </div>
        ) : null}
        <span style={{ flexGrow: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500, fontSize: 16, lineHeight: '24px', color: '#171717' }}>
          {title}
          <span style={{ fontWeight: 400, color: '#737373' }}>{summary}</span>
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <path d="M5 12h14" />
          <path d="M12 5v14" style={{ transformOrigin: 'center', transform: open ? 'scaleY(0)' : 'scaleY(1)', transition: 'transform 160ms ease-out' }} />
        </svg>
      </button>
      <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0, transition: 'grid-template-rows 180ms ease-out, opacity 160ms ease-out', overflow: 'hidden' }}>
        <div style={{ minHeight: 0, overflow: 'hidden' }}>
          <div role={single ? 'radiogroup' : 'group'} aria-label={title} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 12px 12px 12px' }}>
            {items.map((label) => {
              const on = isOn(label);
              return (
                <div
                  key={label}
                  role={single ? 'radio' : 'checkbox'}
                  aria-checked={on}
                  tabIndex={open ? 0 : -1}
                  className="hover-option"
                  onClick={() => onToggleItem(label)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onToggleItem(label);
                    }
                  }}
                  style={{
                    height: 44,
                    flexShrink: 0,
                    borderRadius: 8,
                    background: '#F5F5F5',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                    padding: 'var(--space-2) var(--space-2) var(--space-2) var(--space-2-5)',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background 140ms ease-out',
                  }}
                >
                  <span style={{ flexGrow: 1, fontWeight: 500, fontSize: 16, lineHeight: '24px', color: '#171717' }}>{label}</span>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                      borderRadius: single ? 999 : 6,
                      background: !single && on ? '#006612' : '#FFFFFF',
                      boxShadow: single ? (on ? 'inset 0 0 0 6px #006612' : 'inset 0 0 0 1px #E5E5E5') : on ? 'none' : 'inset 0 0 0 1px #E5E5E5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 140ms ease-out, box-shadow 140ms ease-out',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: !single && on ? 1 : 0, transition: 'opacity 140ms ease-out' }}>
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
