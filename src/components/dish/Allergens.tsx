import type { CSSProperties } from 'react';
import { icon } from '../../lib/assets';

/* Grey allergen glyphs, drawn as CSS masks so they take a single tint. */

const mask = (name: string, s: CSSProperties): CSSProperties => ({
  position: 'absolute',
  background: 'var(--grey-400)',
  WebkitMask: `url(${icon(name)}) no-repeat center/contain`,
  mask: `url(${icon(name)}) no-repeat center/contain`,
  ...s,
});

const box: CSSProperties = { position: 'relative', width: 20, height: 20, flexShrink: 0 };

export function Allergens() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', flexShrink: 0 }}>
      <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#525252', whiteSpace: 'nowrap' }}>Алергени:</span>
      <div style={box}>
        <div style={mask('allergen-1', { left: 4.167, top: 1.667, width: 11.667, height: 16.667 })} />
      </div>
      <div style={box}>
        <div style={mask('allergen-2', { left: 2.5, top: 1.667, width: 15, height: 16.666 })} />
      </div>
      <div style={box}>
        <div style={mask('allergen-3', { left: 2.5, top: 7.083, width: 15, height: 11.667 })} />
        <div style={mask('allergen-3b', { left: 4.583, top: 1.25, width: 10.822, height: 5.046 })} />
      </div>
    </div>
  );
}
