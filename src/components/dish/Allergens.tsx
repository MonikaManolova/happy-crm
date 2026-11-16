import { useRef, useState, type CSSProperties } from 'react';
import { asset } from '../../lib/assets';
import { Tooltip } from '../ds/Tooltip';

/* The 14 EU allergens, numbered as on dostavka.happy.bg (public/assets/allergens/{id}.svg + {id}_colored.svg). */
export const ALLERGEN_NAMES: Record<number, string> = {
  1: 'Зърнени култури, съдържащи глутен: пшеница, ръж, ечемик, овес, спелта, камут, както и продукти от тях',
  2: 'Ракообразни и продукти от тях',
  3: 'Яйца и продукти от тях',
  4: 'Риба и рибни продукти',
  5: 'Фъстъци и продукти от тях',
  6: 'Соя и соеви продукти',
  7: 'Мляко и млечни продукти (включително лактоза)',
  8: 'Ядки и продукти от тях',
  9: 'Целина и продукти от нея',
  10: 'Синап и продукти от него',
  11: 'Сусамово семе и продукти от него',
  12: 'Серен диоксид и сулфити',
  13: 'Лупина и продукти от нея',
  14: 'Мекотели и продукти от тях',
};

const SAMPLE_ALLERGENS = [1, 3, 7];

const img: CSSProperties = { display: 'block', width: 20, height: 20, backfaceVisibility: 'hidden' };

/* Grey glyph; on hover/focus the coloured version is revealed by a growing circular clip. */
function AllergenIcon({ id }: { id: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const name = ALLERGEN_NAMES[id];
  const rect = open && ref.current ? ref.current.getBoundingClientRect() : null;
  return (
    <span
      ref={ref}
      role="img"
      aria-label={name}
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      style={{ position: 'relative', display: 'inline-block', flexShrink: 0, cursor: 'pointer', outline: 'none' }}
    >
      <img src={asset(`allergens/${id}.svg`)} alt="" style={img} />
      <img
        src={asset(`allergens/${id}_colored.svg`)}
        alt=""
        style={{
          ...img,
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          clipPath: open ? 'circle(80% at 50% 50%)' : 'circle(0px at 50% 50%)',
          transition: 'clip-path 0.4s cubic-bezier(0.4, 0, 0.2, 1) 30ms',
        }}
      />
      {rect ? <Tooltip rect={rect} text={name} align="center" wrap /> : null}
    </span>
  );
}

export function Allergens({ ids = SAMPLE_ALLERGENS }: { ids?: number[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', flexShrink: 0 }}>
      <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#525252', whiteSpace: 'nowrap' }}>Алергени:</span>
      {ids.map((id) => (
        <AllergenIcon key={id} id={id} />
      ))}
    </div>
  );
}
