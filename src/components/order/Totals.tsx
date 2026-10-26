import { useState, type CSSProperties } from 'react';
import { icon } from '../../lib/assets';
import { eur, type Totals as TotalsValue } from '../../lib/pricing';
import { Button } from '../ds/Button';
import { Input } from '../ds/Input';
import { TagIcon, TicketIcon, XIcon } from './icons';

const muted: CSSProperties = { fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#525252' };
const value: CSSProperties = { fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#171717' };

function RemoveChip({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="hover-grey-200"
      onClick={onClick}
      style={{ appearance: 'none', border: 'none', font: 'inherit', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, padding: '2px 6px', borderRadius: 6, background: 'var(--grey-100)', cursor: 'pointer' }}
    >
      <XIcon size={16} style={{ color: '#DC2626' }} />
      <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#525252' }}>Премахни</span>
    </button>
  );
}

export interface TotalsProps {
  totals: TotalsValue;
  voucherApplied: boolean;
  onVoucher: (on: boolean) => void;
  promo: string | null;
  onPromo: (code: string | null) => void;
}

export function Totals({ totals, voucherApplied, onVoucher, promo, onPromo }: TotalsProps) {
  const [promoOpen, setPromoOpen] = useState(false);
  const [code, setCode] = useState('');
  const savePromo = () => {
    const c = code.trim().toUpperCase();
    if (!c) return;
    onPromo(c);
    setPromoOpen(false);
    setCode('');
  };
  const closePromo = () => {
    setPromoOpen(false);
    setCode('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 16px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 'var(--space-1-5)', paddingBottom: 'var(--space-0-5)' }}>
        {!voucherApplied ? (
          <Button type="outline" size="small" icon={icon('LucideTicket')} onClick={() => onVoucher(true)}>
            Ваучер за 10€
          </Button>
        ) : null}
        {!promoOpen && !promo ? (
          <Button type="outline" size="small" icon={icon('LucideTag')} onClick={() => setPromoOpen(true)}>
            Добави промокод
          </Button>
        ) : null}
      </div>
      {promoOpen ? (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-1-5)', paddingBottom: 6 }}>
          <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex' }}>
            <Input
              size="small"
              autoFocus
              aria-label="Промокод"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') savePromo();
                if (e.key === 'Escape') closePromo();
              }}
              placeholder="Въведи промокод"
            />
          </div>
          <Button type="solid" size="small" disabled={!code.trim()} onClick={savePromo}>
            Добави
          </Button>
          <Button type="outline" size="small" onClick={closePromo}>
            Отказ
          </Button>
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <span style={{ ...muted, flexGrow: 1 }}>Цена на продуктите</span>
        <span style={value}>{eur(totals.products)}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <span style={{ ...muted, flexGrow: 1 }}>Цена за доставка</span>
        <span style={value}>{eur(totals.fee)}</span>
      </div>
      {voucherApplied ? (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TicketIcon size={16} style={{ color: 'var(--primary-600)' }} />
          <span style={muted}>Приложен ваучер: 10€</span>
          <RemoveChip label="Премахни ваучера" onClick={() => onVoucher(false)} />
          <span style={{ flexGrow: 1 }} />
          <span style={value}>- {eur(totals.voucher)}</span>
        </div>
      ) : null}
      {promo ? (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TagIcon size={16} style={{ color: 'var(--primary-600)' }} />
          <span style={muted}>Промокод: {promo}</span>
          <RemoveChip label="Премахни промокода" onClick={() => onPromo(null)} />
          <span style={{ flexGrow: 1 }} />
          <span style={value}>- {eur(totals.promoDiscount)}</span>
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 4 }}>
        <span style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#171717', flexGrow: 1 }}>Общо</span>
        <span style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#171717' }}>{eur(totals.total)}</span>
      </div>
    </div>
  );
}
