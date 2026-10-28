import type { CSSProperties, ReactNode } from 'react';
import type { ActiveOrder } from '../../data/app';
import { icon as iconUrl } from '../../lib/assets';
import { Icon } from '../ds/Icon';
import { Tag } from '../ds/Tag';

const meta: CSSProperties = { fontWeight: 400, fontSize: 14, lineHeight: '20px', color: 'var(--grey-600)', whiteSpace: 'nowrap' };

/** `ownColors` keeps the icon file's own colours (logos); other icons are tinted green. */
function Item({ icon, ownColors, children }: { icon: string; ownColors?: boolean; children: ReactNode }) {
  return (
    <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-1)' }}>
      {ownColors ? (
        <img src={iconUrl(icon)} alt="" width={18} height={18} style={{ flexShrink: 0 }} />
      ) : (
        <Icon icon={icon} size={18} color="var(--primary-500)" />
      )}
      <span style={meta}>{children}</span>
    </span>
  );
}

/** Summary of an active order, shown when hovering its "Детайли" link (Figma: Info, 484:13670). */
export function OrderInfoCard({ order }: { order: ActiveOrder }) {
  return (
    <div
      style={{
        width: 340,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2-5)',
        padding: 10,
        borderRadius: 'var(--rounded-xl)',
        border: '1px solid var(--grey-200)',
        background: 'var(--white)',
        boxShadow: 'var(--shadow-popover)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-1-5)' }}>
        <span style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: 'var(--grey-900)', whiteSpace: 'nowrap' }}>Поръчка {order.id}</span>
        <span style={meta}>{order.placedAt}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 8px', padding: 'var(--space-0-5)' }}>
        <Tag color="primary" icon="LucideCookingPot">
          {order.status}
        </Tag>
        <Item icon="HappySymbol-r" ownColors>
          {order.restaurant}
        </Item>
        <Item icon="LucideMapPinned-s">{order.delivery}</Item>
        <Item icon="LucideClock4-gd">
          Очаквана доставка: <span style={{ fontWeight: 500 }}>{order.eta}</span>
        </Item>
      </div>
    </div>
  );
}
