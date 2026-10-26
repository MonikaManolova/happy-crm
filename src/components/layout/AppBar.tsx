import { icon } from '../../lib/assets';

export function AppBar() {
  return (
    <header
      style={{
        position: 'relative',
        height: 64,
        flexShrink: 0,
        alignSelf: 'stretch',
        background: '#FFFFFF',
        border: '1px solid #E5E5E5',
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        padding: '10px 24px 10px 20px',
        alignItems: 'center',
        zIndex: 2,
      }}
    >
      <button type="button" aria-label="Меню" style={plainButton}>
        <img src={icon('Bars3-a3')} alt="" style={{ width: 24, height: 24 }} />
      </button>
      <div style={{ position: 'relative', width: 99.344, height: 20, overflow: 'hidden', flexShrink: 0 }}>
        <span style={{ position: 'absolute', left: 8, top: 0, fontWeight: 700, fontSize: 18, lineHeight: '20px', color: '#000000', whiteSpace: 'nowrap' }}>
          Admin
        </span>
      </div>
      <div style={{ position: 'relative', height: 44, display: 'flex', flexDirection: 'row', gap: 8, justifyContent: 'flex-end', alignItems: 'center', flexGrow: 1 }}>
        <button
          type="button"
          aria-label="Известия (4)"
          className="hover-grey"
          style={{ ...plainButton, position: 'relative', width: 44, height: 44, borderRadius: 8, justifyContent: 'center' }}
        >
          <img src={icon('Bell-a3')} alt="" style={{ width: 24, height: 24 }} />
          <span style={{ position: 'absolute', left: 24, top: 4, fontWeight: 500, fontSize: 12, lineHeight: '12px', color: '#D97706' }}>4</span>
        </button>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 100,
            background: '#171717',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontWeight: 500, fontSize: 16, lineHeight: '28px', color: '#FFFFFF' }}>NS</span>
        </div>
      </div>
    </header>
  );
}

const plainButton = {
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  cursor: 'pointer',
} as const;
