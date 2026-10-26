import { useState } from 'react';
import type { Dish } from '../../data/types';
import { icon } from '../../lib/assets';
import { cardPrice, eur } from '../../lib/pricing';
import { Select } from '../ds/Dropdown';
import { TextButton } from '../ds/TextButton';
import { useCustomCursor } from './CustomCursor';
import { NewRibbon } from './NewRibbon';

const FOOD_TAGS = ['FoodTagCategoryProtein', 'FoodTagCategorySpicy', 'FoodTagCategoryVegan'];

export interface DishCardProps {
  dish: Dish;
  isNew: boolean;
  qty: number;
  /** Option currently chosen in the card's select. */
  pick?: string;
  onPick: (option: string) => void;
  onAdd: () => void;
  onDetails: () => void;
  onRemoveOne: () => void;
}

export function DishCard({ dish, isNew, qty, pick, onPick, onAdd, onDetails, onRemoveOne }: DishCardProps) {
  const cursor = useCustomCursor();
  const [badgeHover, setBadgeHover] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const inCart = qty > 0;

  return (
    <div
      className="dish-card"
      role="button"
      tabIndex={0}
      aria-label={`Добави ${dish.title}`}
      onClick={onAdd}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onAdd();
        }
      }}
      onMouseEnter={cursor.enter}
      onMouseMove={cursor.move}
      onMouseLeave={cursor.leave}
      style={{
        position: 'relative',
        height: '100%',
        minWidth: 0,
        zIndex: selectOpen ? 10 : 0,
        borderRadius: 12,
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        padding: 8,
        alignItems: 'flex-start',
        outline: 'none',
        boxShadow: inCart ? 'inset 0 0 0 1px #33A556, 0 0 0 2px #CCE6D1, 0 2px 6px 0 rgba(0,0,0,0.04)' : '0 2px 6px 0 rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ position: 'relative', height: 130, flexShrink: 0, alignSelf: 'stretch', borderRadius: 10, background: '#F5F5F5', display: 'flex', padding: '8px 0', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 10, display: 'flex', padding: '8px 0', alignItems: 'center' }}>
          <img className="dish-img" src={dish.img} alt="" style={{ flexGrow: 1, alignSelf: 'stretch', objectFit: 'contain', minWidth: 0, transition: 'transform 180ms ease-out' }} />
        </div>
        <div style={{ position: 'absolute', left: 4, top: 102, display: 'flex', flexDirection: 'row', gap: 2 }}>
          {FOOD_TAGS.map((t) => (
            <div key={t} style={{ width: 24, height: 24, borderRadius: 6, background: '#FFFFFF', boxShadow: '0 2px 4px 0 rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src={icon(t)} alt="" style={{ width: 20, height: 20 }} />
            </div>
          ))}
        </div>
        {inCart ? (
          <button
            type="button"
            className="qty-badge"
            aria-label={`Премахни едно (${qty} в поръчката)`}
            onClick={(e) => {
              e.stopPropagation();
              if (qty <= 1) {
                setBadgeHover(false);
                cursor.release();
              }
              onRemoveOne();
            }}
            onMouseEnter={() => {
              cursor.suppress();
              setBadgeHover(true);
            }}
            onMouseLeave={() => {
              cursor.release();
              setBadgeHover(false);
            }}
            style={{ appearance: 'none', border: 'none', padding: 0, position: 'absolute', right: 4, top: 4, width: 24, height: 24, borderRadius: 'var(--rounded-md, 6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            {badgeHover ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
              </svg>
            ) : (
              <span style={{ fontWeight: 600, fontSize: 14, lineHeight: '20px', color: '#FFFFFF' }}>{qty}</span>
            )}
          </button>
        ) : null}
        {isNew ? <NewRibbon /> : null}
      </div>

      <div style={{ position: 'relative', flexGrow: 1, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 4, padding: 6, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ maxHeight: 40, flexShrink: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'flex-start', overflow: 'hidden' }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: 16,
              lineHeight: '20px',
              color: '#171717',
              flexGrow: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {dish.title}
          </span>
          {dish.groups ? (
            <div title="Конфигурируемо" style={{ width: 20, height: 20, borderRadius: 'var(--rounded-full)', background: 'var(--info-500)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
              <img src={icon('LucideSettings2-w')} alt="" style={{ width: 14, height: 14 }} />
            </div>
          ) : null}
        </div>
        {dish.options ? (
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onMouseEnter={cursor.suppress}
            onMouseLeave={cursor.release}
            style={{ position: 'relative', alignSelf: 'stretch', flexShrink: 0, cursor: 'pointer' }}
          >
            <Select
              size="medium"
              value={pick ?? dish.options[0]}
              placeholder="Избери"
              options={dish.options}
              searchPlaceholder="Търси по име"
              onSelect={onPick}
              onOpenChange={setSelectOpen}
            />
          </div>
        ) : null}
        <div style={{ height: 24, flexShrink: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <div onMouseEnter={cursor.suppress} onMouseLeave={cursor.release} style={{ display: 'flex', alignItems: 'center' }}>
            <TextButton
              onClick={(e) => {
                e.stopPropagation();
                onDetails();
              }}
            >
              Детайли
            </TextButton>
          </div>
          <div style={{ flexGrow: 1 }} />
          <span style={{ fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#737373', whiteSpace: 'nowrap' }}>{dish.grams}</span>
          {dish.noPrice ? null : (
            <span style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#018017', whiteSpace: 'nowrap', textAlign: 'right' }}>{eur(cardPrice(dish, pick))}</span>
          )}
        </div>
      </div>
    </div>
  );
}
