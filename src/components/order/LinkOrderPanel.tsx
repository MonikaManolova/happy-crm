import { useState } from 'react';
import { ACTIVE_ORDERS } from '../../data/app';
import { asset, icon } from '../../lib/assets';
import { Button } from '../ds/Button';
import { HoverCard } from '../ds/HoverCard';
import { fieldVisual, hair } from '../ds/Field';
import { IconButton } from '../ds/IconButton';
import { Input } from '../ds/Input';
import { Radio } from '../ds/Radio';
import { SidePanel } from '../ds/SidePanel';
import { TextButton } from '../ds/TextButton';
import { OrderInfoCard } from './OrderInfoCard';

const muted = { fontWeight: 400, fontSize: 14, lineHeight: '20px', color: 'var(--grey-600)' } as const;

/** "Свържи към поръчка": link the new order to one of the customer's active orders. */
export function LinkOrderPanel({
  linked,
  onLink,
  onClose,
}: {
  /** The currently linked order, pre-selected when the panel opens. */
  linked: string | null;
  onLink: (orderId: string) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(linked);
  const [query, setQuery] = useState('');
  const n = ACTIVE_ORDERS.length;

  return (
    <SidePanel
      title="Свържи към поръчка"
      onClose={onClose}
      footer={(close) => (
        <Button
          type="solid"
          size="large"
          icon="LucideCheck"
          disabled={!selected}
          onClick={() => {
            if (!selected) return;
            onLink(selected);
            close();
          }}
        >
          Свържи
        </Button>
      )}
    >
      {n ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <span style={muted}>
            {n} {n === 1 ? 'активна поръчка' : 'активни поръчки'} на потребител
          </span>
          <div role="radiogroup" aria-label="Активни поръчки" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {ACTIVE_ORDERS.map((o) => (
              <div
                key={o.id}
                className="order-option"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: '8px 8px 8px 10px',
                  borderRadius: 10,
                  // Selected: the same ring as a focused Input.
                  boxShadow: selected === o.id ? fieldVisual('focused').boxShadow : hair('var(--grey-300)'),
                }}
              >
                <div
                  onClick={() => setSelected(o.id)}
                  style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-1-5)', cursor: 'pointer' }}
                >
                  <span style={{ display: 'flex', paddingRight: 'var(--space-1)' }}>
                    <Radio checked={selected === o.id} name="link-order" onChange={() => setSelected(o.id)} />
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: 'var(--grey-900)', whiteSpace: 'nowrap' }}>{o.id}</span>
                  <span style={{ ...muted, whiteSpace: 'nowrap' }}>{o.placedAt}</span>
                </div>
                <HoverCard content={<OrderInfoCard order={o} />}>
                  <TextButton style={{ textDecoration: 'underline' }}>Детайли</TextButton>
                </HoverCard>
                <IconButton size="small" icon={icon('LucideExternalLink')} tooltip="Към поръчката" tooltipPlacement="top-end" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2-5)' }}>
        <Input
          size="large"
          icon={icon('LucideSearch-a3')}
          placeholder="Търси поръчки по тел. номер"
          aria-label="Търси поръчки по телефонен номер"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div
          style={{
            height: 300,
            borderRadius: 'var(--rounded-xl)',
            background: 'var(--grey-50)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 40px',
            textAlign: 'center',
          }}
        >
          <img src={asset('empty-cart-box.png')} alt="" style={{ width: 100, height: 'auto', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-0-5)', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: 'var(--grey-900)' }}>Списъка е празен</span>
            <span style={muted}>Намерените резултати ще бъдат показани тук</span>
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
