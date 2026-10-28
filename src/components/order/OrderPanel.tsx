import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { DEFAULT_INVOICES, DEFAULT_PROMO_PERCENT, DELIVERY_FEE, MIN_ORDER, ORDER_ID, VOUCHER_AMOUNT } from '../../data/app';
import { asset, icon } from '../../lib/assets';
import { productsTotal, type CartLine } from '../../lib/cart';
import { orderTotals, promoPercent } from '../../lib/pricing';
import { Button } from '../ds/Button';
import { Dropdown } from '../ds/Dropdown';
import { WarningMessage } from '../ds/Message';
import { CartRow } from './CartRow';
import { Collapse } from './Collapse';
import { InvoiceModal, type Invoice } from './InvoiceModal';
import { LinkOrderPanel } from './LinkOrderPanel';
import { EMPTY_DETAILS, OrderDetails, type OrderDetailsValue } from './OrderDetails';
import { Totals } from './Totals';

const MORE_ITEMS = [
  { label: 'Прегледай оригинала', icon: icon('LucideEye-g6') },
  { label: 'Позвъни', icon: icon('LucidePhone-g6') },
];

export interface OrderPanelProps {
  cart: CartLine[];
  notes: Record<string, string>;
  onNote: (key: string, note: string | null) => void;
  onBump: (key: string, delta: number) => void;
  onEdit: (line: CartLine) => void;
  onSubmit: () => void;
}

export function OrderPanel({ cart, notes, onNote, onBump, onEdit, onSubmit }: OrderPanelProps) {
  const [minOn, setMinOn] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const [details, setDetails] = useState<OrderDetailsValue>(EMPTY_DETAILS);
  const [voucher, setVoucher] = useState(false);
  const [promo, setPromo] = useState<string | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(DEFAULT_INVOICES);
  const [invoiceSel, setInvoiceSel] = useState<number | null>(DEFAULT_INVOICES[0].id);
  const [invoice, setInvoice] = useState<string | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkedOrder, setLinkedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!moreOpen) return undefined;
    const away = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [moreOpen]);

  const hasItems = cart.length > 0;

  // The header actions are hidden while the cart is empty, so close the menu with them.
  useEffect(() => {
    if (!hasItems) setMoreOpen(false);
  }, [hasItems]);

  const products = productsTotal(cart);
  const totals = orderTotals(products, DELIVERY_FEE, voucher ? VOUCHER_AMOUNT : 0, promoPercent(promo, DEFAULT_PROMO_PERCENT));
  const belowMin = minOn && cart.length > 0 && products < MIN_ORDER;

  const saveInvoice = () => {
    const it = invoices.find((x) => x.id === invoiceSel);
    setInvoice(it ? it.label.split(',')[0] : null);
    setInvoiceOpen(false);
  };

  return (
    <aside
      aria-label="Поръчка"
      style={{
        position: 'relative',
        width: 'clamp(510px, 30%, 560px)',
        flexShrink: 0,
        alignSelf: 'stretch',
        overflow: 'hidden',
        marginBottom: 16,
        borderRadius: 12,
        background: '#FFFFFF',
        boxShadow: '0 2px 6px 0 rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        border: '1px solid var(--grey-200)',
      }}
    >
      <div style={{ height: 56, flexShrink: 0, display: 'flex', flexDirection: 'row', gap: 10, padding: '14px 16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'flex-start', flex: '1 1 auto', minWidth: 0 }}>
          <h2 style={{ margin: 0, fontWeight: 600, fontSize: 18, lineHeight: '28px', color: '#171717', whiteSpace: 'nowrap' }}>Нова поръчка</h2>
          <span style={{ fontWeight: 400, fontSize: 18, lineHeight: '28px', color: '#525252', whiteSpace: 'nowrap' }}>{ORDER_ID}</span>
        </div>
        {hasItems ? (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
            <button
              type="button"
              role="switch"
              aria-checked={minOn}
              onClick={() => setMinOn((v) => !v)}
              style={{ appearance: 'none', border: 'none', background: 'transparent', padding: 0, font: 'inherit', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', userSelect: 'none' }}
            >
              <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: 'var(--grey-600)', whiteSpace: 'nowrap' }}>Мин. Сума</span>
              <span
                style={{
                  position: 'relative',
                  width: 36,
                  height: 20,
                  borderRadius: 'var(--rounded-full)',
                  background: minOn ? 'var(--primary-500)' : 'var(--grey-300)',
                  transition: 'background-color 140ms ease-out',
                  flexShrink: 0,
                }}
              >
                <span style={{ position: 'absolute', top: 4, left: minOn ? 20 : 4, width: 12, height: 12, borderRadius: 'var(--rounded-full)', background: 'var(--white)', transition: 'left 140ms ease-out' }} />
              </span>
            </button>
            <div style={{ width: 1, height: 16, background: 'var(--grey-400)' }} />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-1)' }}>
              <Button type="outline" size="medium" iconOnly icon="LucidePackagePlus" tooltip="Свържи към поръчка" aria-pressed={!!linkedOrder} onClick={() => setLinkOpen(true)} />
              <div ref={moreRef} style={{ position: 'relative', display: 'flex' }}>
                <Button type="outline" size="medium" iconOnly icon="LucideEllipsis" tooltip="Още действия" aria-expanded={moreOpen} onClick={() => setMoreOpen((v) => !v)} />
                {moreOpen ? (
                  <div style={{ position: 'absolute', top: 'calc(100% + var(--space-1))', right: 0, zIndex: 30 }}>
                    <Dropdown items={MORE_ITEMS} search={false} width={220} onSelect={() => setMoreOpen(false)} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Collapse open={belowMin} duration={200} fade style={{ flexShrink: 0 }}>
        <div style={{ padding: '2px 16px 8px 16px' }}>
          <WarningMessage title={`Минимална сума от ${MIN_ORDER} €. Добавете още артикули.`} />
        </div>
      </Collapse>

      {cart.length === 0 ? (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
          <img src={asset('empty-cart-box.png')} alt="" style={{ width: 100, height: 'auto', flexShrink: 0 }} />
          <div style={{ maxWidth: 357, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#171717', whiteSpace: 'nowrap' }}>Количката е празна</span>
            <span style={{ fontWeight: 400, fontSize: 12, lineHeight: '16px', color: '#525252', textWrap: 'pretty' } as CSSProperties}>
              Започнете да добавяте от менюто, за да съставите поръчка
            </span>
          </div>
        </div>
      ) : (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto' }}>
          <div style={{ flexShrink: 0, padding: '0 16px 8px 16px' }}>
            {cart.map((line, i) => (
              <CartRow
                key={line.key}
                line={line}
                last={i === cart.length - 1}
                note={notes[line.key] ?? ''}
                onNote={(n) => onNote(line.key, n)}
                onBump={(d) => onBump(line.key, d)}
                onEdit={() => onEdit(line)}
              />
            ))}
          </div>

          <div style={{ flexShrink: 0, marginTop: 'auto', borderTop: '1px solid #E5E5E5', display: 'flex', flexDirection: 'column' }}>
            <OrderDetails
              value={details}
              onChange={setDetails}
              invoice={invoice}
              onOpenInvoice={() => setInvoiceOpen(true)}
              onRemoveInvoice={() => setInvoice(null)}
            />
            <Totals totals={totals} voucherApplied={voucher} onVoucher={setVoucher} promo={promo} onPromo={setPromo} />
            <div style={{ padding: '0 16px 16px 16px' }}>
              <Button type="solid" size="large" icon="LucideCheck" disabled={belowMin} onClick={onSubmit} style={{ width: '100%' }}>
                Изпрати поръчката
              </Button>
            </div>
          </div>
        </div>
      )}

      {linkOpen ? <LinkOrderPanel onLink={setLinkedOrder} onClose={() => setLinkOpen(false)} /> : null}

      {invoiceOpen ? (
        <InvoiceModal
          invoices={invoices}
          selected={invoiceSel}
          onSelect={setInvoiceSel}
          onDelete={(id) => {
            setInvoices((list) => list.filter((x) => x.id !== id));
            if (invoiceSel === id) setInvoiceSel(null);
          }}
          onSave={saveInvoice}
          onClose={() => setInvoiceOpen(false)}
        />
      ) : null}
    </aside>
  );
}
