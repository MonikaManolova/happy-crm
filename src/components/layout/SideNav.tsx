import { NAV_ITEMS } from '../../data/app';

export function SideNav({ active, onChange }: { active: number; onChange: (index: number) => void }) {
  return (
    <nav
      aria-label="Основна навигация"
      style={{
        position: 'relative',
        width: 64,
        flexShrink: 0,
        alignSelf: 'stretch',
        background: '#FFFFFF',
        border: '1px solid #E5E5E5',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 0',
        alignItems: 'center',
      }}
    >
      {NAV_ITEMS.map((n, i) => (
        <div key={n.label} style={{ width: 64, height: 60, display: 'flex', flexDirection: 'column', padding: 10, flexShrink: 0 }}>
          <button
            type="button"
            title={n.label}
            aria-label={n.label}
            aria-current={i === active ? 'page' : undefined}
            onClick={() => onChange(i)}
            style={{
              appearance: 'none',
              border: 'none',
              height: 40,
              alignSelf: 'stretch',
              borderRadius: 8,
              display: 'flex',
              padding: '8px 10px',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              background: i === active ? '#E6F3E8' : 'transparent',
            }}
          >
            <img src={n.icon} alt="" style={{ width: 24, height: 24 }} />
          </button>
        </div>
      ))}
    </nav>
  );
}
