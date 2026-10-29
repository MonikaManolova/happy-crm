import { CATEGORIES, CATEGORY_ICONS, DISHES, SUBCATEGORIES } from '../../data/menu';
import type { Dish } from '../../data/types';
import { icon } from '../../lib/assets';
import type { CartLine } from '../../lib/cart';
import { dishQty } from '../../lib/cart';
import { Button } from '../ds/Button';
import { Chip } from '../ds/Chip';
import { Select } from '../ds/Dropdown';
import { Input } from '../ds/Input';
import { DishCard } from './DishCard';

const TAGS = ['Ново', 'Люто', 'Веган', '+2'];

export interface MenuColumnProps {
  query: string;
  onQuery: (q: string) => void;
  category: string;
  onCategory: (c: string) => void;
  subcategory: string;
  onSubcategory: (s: string) => void;
  cart: CartLine[];
  picks: Record<number, string>;
  onPick: (dishId: number, option: string) => void;
  onAdd: (dish: Dish) => void;
  onDetails: (dish: Dish) => void;
  onRemoveOne: (dishId: number) => void;
  showRibbons?: boolean;
  /** Box the filters and dishes in one card, filters as its header (Figma 997:19213). */
  contained?: boolean;
}

export function MenuColumn(props: MenuColumnProps) {
  const { query, category, subcategory, cart, picks, showRibbons = true, contained = false } = props;
  const sectionBg = contained ? 'var(--grey-50)' : '#F5F5F5';
  const q = query.trim().toLowerCase();
  const dishes = DISHES.filter((d) => !q || d.title.toLowerCase().includes(q));

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: contained ? 0 : 20,
        flexGrow: 1,
        alignSelf: 'stretch',
        minWidth: 0,
        minHeight: 0,
        ...(contained
          ? {
              marginBottom: 16,
              borderRadius: 12,
              border: '1px solid var(--grey-200)',
              background: sectionBg,
              boxShadow: '0 2px 6px 0 rgba(0,0,0,0.04)',
              overflow: 'hidden',
            }
          : null),
      }}
    >
      <div
        style={{
          // Contained: keep the filters' shadow above the sticky category header.
          ...(contained ? { position: 'relative' as const, zIndex: 51 } : null),
          flexShrink: 0,
          alignSelf: 'stretch',
          borderRadius: contained ? '12px 12px 0 0' : 12,
          background: '#FFFFFF',
          boxShadow: contained ? '0 2px 3px 0 rgba(0,0,0,0.04)' : 'inset 0 0 0 1px #E5E5E5,0 2px 6px 0 rgba(0,0,0,0.04)',
          borderBottom: contained ? '1px solid var(--grey-200)' : undefined,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: 12,
          alignItems: 'center',
        }}
      >
        <div style={{ height: 36, flexShrink: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          <Input
            size="large"
            icon={icon('LucideSearch-a3')}
            placeholder="Търси по име и/или съставка"
            aria-label="Търси в менюто"
            value={query}
            onChange={(e) => props.onQuery(e.target.value)}
            style={{ flexGrow: 1, minWidth: 0, width: 'auto' }}
          />
          <div
            style={{
              width: 225,
              height: 36,
              borderRadius: 8,
              background: '#FFFFFF',
              boxShadow: 'inset 0 0 0 0.5px #E5E5E5,0 0 0 0.5px #E5E5E5,0 0.5px 2px 0 rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'row',
              gap: 4,
              padding: '6px 8px 6px 4px',
              alignItems: 'center',
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', gap: 4, padding: '0 2px', alignItems: 'center', flexGrow: 1 }}>
              {TAGS.map((t) => (
                <div key={t} style={{ height: 24, borderRadius: 6, background: '#E6F3E8', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                  <span style={{ fontWeight: 500, fontSize: 12, lineHeight: '16px', color: '#006612' }}>{t}</span>
                </div>
              ))}
            </div>
            <img src={icon('LucideChevronDown-s')} alt="" style={{ width: 14, height: 14, flexShrink: 0 }} />
          </div>
          <Select size="large" placeholder="Съставки" style={{ width: 140, flexShrink: 0 }} />
        </div>
        <div style={{ flexShrink: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
          {CATEGORIES.map((label) => {
            const selected = label === category;
            const icons = CATEGORY_ICONS[label];
            return selected ? (
              <Button key={label} type="solid" size="medium" icon={icons?.[1]} aria-pressed="true">
                {label}
              </Button>
            ) : (
              <Chip key={label} size="medium" icon={icons?.[0]} onClick={() => props.onCategory(label)}>
                {label}
              </Chip>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, padding: '0 8px', flexGrow: 1, alignSelf: 'stretch', minHeight: 0 }}>
        <div style={{ position: 'relative', flexGrow: 1, alignSelf: 'stretch', minHeight: 0, overflowY: 'auto', overflowX: 'visible', paddingRight: 4, paddingBottom: 16 }}>
          <div
            style={{
              position: 'sticky',
              top: -2,
              zIndex: 50,
              padding: '10px 4px var(--space-3) 4px',
              marginTop: -2,
              boxShadow: `0 -4px 0 ${sectionBg}`,
              background: contained ? 'linear-gradient(180deg, #FAFAFA 45%, rgba(250, 250, 250, .9) 100%)' : 'linear-gradient(180deg, #F5F5F5 45%, rgba(245, 245, 245, .9) 100%)',
              display: 'flex',
              flexDirection: 'row',
              gap: 16,
              alignItems: 'flex-start',
            }}
          >
            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 18, lineHeight: '28px', color: '#171717', flexShrink: 0, whiteSpace: 'nowrap' }}>{category}</h2>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
              <div style={{ width: 28, height: 28, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, cursor: 'pointer' }}>
                <img src={icon('LucideSettings2-p')} alt="" style={{ width: 18, height: 18 }} />
              </div>
              {SUBCATEGORIES.map((label) => (
                <Chip key={label} size="small" active={label === subcategory} onClick={() => props.onSubcategory(label)}>
                  {label}
                </Chip>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 12, alignContent: 'start', alignItems: 'stretch', padding: '4px 4px 8px 4px' }}>
            {dishes.map((d, i) => (
              <DishCard
                key={d.id}
                dish={d}
                isNew={showRibbons && i >= 1 && i <= 3}
                qty={dishQty(cart, d.id)}
                pick={picks[d.id]}
                onPick={(o) => props.onPick(d.id, o)}
                onAdd={() => props.onAdd(d)}
                onDetails={() => props.onDetails(d)}
                onRemoveOne={() => props.onRemoveOne(d.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
