import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { CUSTOMER, DEFAULT_PAYMENT, MICRO_ACCOUNT, MICRO_BALANCE, PAYMENT_METHODS } from '../../data/app';
import { icon } from '../../lib/assets';
import { eur } from '../../lib/pricing';
import { Button } from '../ds/Button';
import { Chip } from '../ds/Chip';
import { DatePicker, formatDate } from '../ds/DatePicker';
import { IconButton } from '../ds/IconButton';
import { Input } from '../ds/Input';
import { Textarea } from '../ds/Textarea';
import { TimeInput, formatTime, timeError } from '../ds/TimeInput';
import { Collapse } from './Collapse';
import { ClockIcon, HeadsetIcon, NotepadIcon, PencilIcon, PlusIcon, UserPlusIcon, WalletIcon } from './icons';

export type SectionKey = 'client' | 'operator' | 'recipient' | 'time' | 'pay';

export const HANDOFFS = ['До вратата', 'До вход', 'Остави на портиер'] as const;
export interface Recipient {
  firstName: string;
  lastName: string;
  phone: string;
  handoff: (typeof HANDOFFS)[number];
}
const EMPTY_RECIPIENT: Recipient = { firstName: '', lastName: '', phone: '', handoff: 'До вратата' };
export interface DeliveryTime {
  day: 'Днес' | 'Утре' | 'Друга дата';
  date: string;
  slot: string;
}
export interface OrderDetailsValue {
  clientNote: string;
  operatorNote: string;
  recipient: Recipient | null;
  time: DeliveryTime | null;
  payMethod: string;
  /** How the part a микросметка doesn't cover is paid. */
  payRest: string;
}

export const EMPTY_DETAILS: OrderDetailsValue = { clientNote: '', operatorNote: '', recipient: null, time: null, payMethod: DEFAULT_PAYMENT, payRest: DEFAULT_PAYMENT };

const timeLabel = (t: DeliveryTime) => [t.day === 'Друга дата' && t.date ? t.date : t.day, `${t.slot} ч.`].join(', ');

/** Earliest `HH:MM` for a same-day delivery: now plus the delivery estimate. */
function earliestToday(t: DeliveryTime): string | undefined {
  const now = new Date();
  if (t.day !== 'Днес' && !(t.day === 'Друга дата' && t.date === formatDate(now))) return undefined;
  const eta = parseInt(CUSTOMER.deliveryEta, 10) || 0;
  return formatTime(Math.min(now.getHours() * 60 + now.getMinutes() + eta, 23 * 60 + 59));
}

/* ---------- Accordion row ---------- */

function Section({
  id,
  open,
  onOpen,
  sectionRef,
  icon: iconEl,
  title,
  value,
  trailing,
  children,
  bodyOverflow = 'hidden',
}: {
  id: SectionKey;
  open: boolean;
  onOpen: () => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  icon: ReactNode;
  title: string;
  value?: string;
  /** Replaces the default plus / pencil icon of the collapsed row. */
  trailing?: ReactNode;
  children: ReactNode;
  bodyOverflow?: 'hidden' | 'visible';
}) {
  const head = (
    <>
      <span style={{ display: 'flex', color: 'var(--primary-500)' }}>{iconEl}</span>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
        <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#171717', flexShrink: 0 }}>{title}</span>
        {!open && value ? (
          <span style={{ fontWeight: 400, fontSize: 14, lineHeight: '20px', color: 'var(--grey-600)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
            - {value}
          </span>
        ) : null}
      </div>
    </>
  );
  return (
    <div ref={sectionRef} data-section={id} style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch', borderBottom: '1px solid var(--grey-200)' }}>
      {open ? (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8, padding: 'var(--space-2-5) var(--space-3)', alignItems: 'center', background: 'var(--white)', color: 'var(--grey-500)' }}>
          {head}
        </div>
      ) : (
        <div
          className="acc-head"
          role="button"
          tabIndex={0}
          aria-expanded={false}
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onOpen();
            }
          }}
        >
          {head}
          {trailing ?? (value ? <PencilIcon size={16} /> : <PlusIcon size={16} />)}
        </div>
      )}
      <Collapse open={open} overflow={bodyOverflow} style={{ background: 'var(--white)' }}>
        {children}
      </Collapse>
    </div>
  );
}

function Actions({ filled, canSave = true, onCancel, onRemove, onSave }: { filled: boolean; canSave?: boolean; onCancel: () => void; onRemove: () => void; onSave: () => void }) {
  return (
    <div style={{ padding: '0 var(--space-3) var(--space-2-5) var(--space-3)', display: 'flex', flexDirection: 'row', gap: 'var(--space-1-5)', justifyContent: 'flex-end' }}>
      {filled ? (
        <Button type="outline" size="medium" icon={icon('LucideTrash')} onClick={onRemove}>
          Премахни
        </Button>
      ) : (
        <Button type="outline" size="medium" onClick={onCancel}>
          Отказ
        </Button>
      )}
      <Button type="solid" size="medium" icon={icon('LucideCheck')} disabled={!canSave} onClick={onSave}>
        Запази
      </Button>
    </div>
  );
}

const pad = { padding: '2px var(--space-3) var(--space-2-5) var(--space-3)' };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' };
const payRow: CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-2)', minHeight: 28, padding: '0 var(--space-1)' };
const payLabelText: CSSProperties = { fontWeight: 'var(--font-medium)' as CSSProperties['fontWeight'], fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-5)', color: 'var(--grey-900)', whiteSpace: 'nowrap' };
const payAmount: CSSProperties = { ...payLabelText, fontWeight: 'var(--font-semibold)' as CSSProperties['fontWeight'], flexGrow: 1, flexShrink: 0, textAlign: 'right' };
const divider: CSSProperties = { height: 1, background: 'var(--grey-200)' };
const groupLabel: CSSProperties = { fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-4)', color: 'var(--grey-600)' };

/* ---------- Order details ---------- */

export interface OrderDetailsProps {
  value: OrderDetailsValue;
  onChange: (v: OrderDetailsValue) => void;
  invoice: string | null;
  onOpenInvoice: () => void;
  onRemoveInvoice: () => void;
  /** Order total, split between the микросметка and another method. */
  total: number;
}

/**
 * Recipient, notes, delivery time and payment rows. Only one row is open at a
 * time; it closes through its own buttons or a click anywhere outside it,
 * which discards the draft.
 */
export function OrderDetails({ value, onChange, invoice, onOpenInvoice, onRemoveInvoice, total }: OrderDetailsProps) {
  const [openKey, setOpenKey] = useState<SectionKey | null>(null);
  const refs = useRef<Partial<Record<SectionKey, HTMLDivElement | null>>>({});

  // Drafts, reset from the saved value whenever a row opens.
  const [noteDraft, setNoteDraft] = useState('');
  const [rcptDraft, setRcptDraft] = useState<Recipient>(EMPTY_RECIPIENT);
  const [timeDraft, setTimeDraft] = useState<DeliveryTime>({ day: 'Днес', date: '', slot: '' });
  const [payDraft, setPayDraft] = useState({ method: DEFAULT_PAYMENT, rest: DEFAULT_PAYMENT });
  // Lets the time row's select menus overflow once the expand animation ends.
  const [timeSettled, setTimeSettled] = useState(false);

  useEffect(() => {
    if (!openKey) return undefined;
    const away = (e: MouseEvent) => {
      const el = refs.current[openKey];
      // Portalled popovers (e.g. the date picker) sit outside the section but belong to it.
      if ((e.target as Element).closest?.('[data-popover]')) return;
      // Another row's header switches on click instead. Collapsing this row on mousedown
      // would scroll the rows above it mid-click, so the mouseup would miss the header.
      if ((e.target as Element).closest?.('[data-section]')) return;
      if (el && !el.contains(e.target as Node)) setOpenKey(null);
    };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, [openKey]);

  useEffect(() => {
    if (openKey !== 'time') {
      setTimeSettled(false);
      return undefined;
    }
    const t = setTimeout(() => setTimeSettled(true), 280);
    return () => clearTimeout(t);
  }, [openKey]);

  const open = (key: SectionKey) => {
    if (key === 'client') setNoteDraft(value.clientNote);
    if (key === 'operator') setNoteDraft(value.operatorNote);
    if (key === 'recipient') setRcptDraft(value.recipient ?? EMPTY_RECIPIENT);
    if (key === 'time') setTimeDraft(value.time ?? { day: 'Днес', date: '', slot: '' });
    // The remaining amount starts as "В брой" unless a микросметка split was already saved.
    if (key === 'pay') setPayDraft({ method: value.payMethod, rest: value.payMethod === MICRO_ACCOUNT ? (value.payRest ?? DEFAULT_PAYMENT) : DEFAULT_PAYMENT });
    setOpenKey(key);
  };
  const close = () => setOpenKey(null);
  const save = (patch: Partial<OrderDetailsValue>) => {
    onChange({ ...value, ...patch });
    close();
  };
  const common = (key: SectionKey) => ({
    id: key,
    open: openKey === key,
    onOpen: () => open(key),
    sectionRef: (el: HTMLDivElement | null) => {
      refs.current[key] = el;
    },
  });

  const noteSection = (key: 'client' | 'operator', title: string, iconEl: ReactNode) => {
    const field = key === 'client' ? 'clientNote' : 'operatorNote';
    const saved = value[field].trim();
    return (
      <Section {...common(key)} icon={iconEl} title={title} value={saved}>
        <div style={pad}>
          <Textarea size="medium" placeholder="Въведи забележка" aria-label={title} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
        </div>
        <Actions filled={!!saved} onCancel={close} onRemove={() => save({ [field]: '' })} onSave={() => save({ [field]: noteDraft.trim() })} />
      </Section>
    );
  };

  // Микросметка covers what it can; the rest is paid another way.
  const fromMicro = Math.min(MICRO_BALANCE, total);
  const rest = Math.round((total - fromMicro) * 100) / 100;
  const payLabel = (method: string, restMethod: string) => {
    if (method !== MICRO_ACCOUNT) return method;
    // Compact amounts for the one-line summary: "Микросметка: 15€, В брой: 10,50€".
    const amt = (n: number) => (Number.isInteger(n) ? `${n}€` : `${n.toFixed(2).replace('.', ',')}€`);
    const micro = `${method}: ${amt(fromMicro)}`;
    return rest > 0 ? `${micro}, ${restMethod}: ${amt(rest)}` : micro;
  };

  const rcpt = value.recipient;
  const rcptValue = rcpt ? [`${rcpt.firstName} ${rcpt.lastName}`.trim(), 'тел: ' + rcpt.phone, rcpt.handoff].join(', ') : '';

  return (
    <>
      {noteSection('client', 'Забележка от клиент', <NotepadIcon />)}
      {noteSection('operator', 'Забележка от оператор', <HeadsetIcon />)}

      <Section {...common('recipient')} icon={<UserPlusIcon />} title="Лице за доставка" value={rcptValue}>
        <div style={{ ...pad, display: 'flex', flexDirection: 'column', gap: 'var(--space-2-5)' }}>
          <div style={group}>
            <span style={groupLabel}>Лични данни</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 'var(--space-2)' }}>
              <Input size="medium" placeholder="Име" aria-label="Име на лицето за доставка" value={rcptDraft.firstName} onChange={(e) => setRcptDraft({ ...rcptDraft, firstName: e.target.value })} />
              <Input size="medium" placeholder="Фамилия" aria-label="Фамилия на лицето за доставка" value={rcptDraft.lastName} onChange={(e) => setRcptDraft({ ...rcptDraft, lastName: e.target.value })} />
              <Input size="medium" type="tel" placeholder="Телефон" aria-label="Телефон на лицето за доставка" value={rcptDraft.phone} onChange={(e) => setRcptDraft({ ...rcptDraft, phone: e.target.value })} />
            </div>
          </div>
          <div style={group}>
            <span style={groupLabel}>Начин на получаване</span>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 'var(--space-1-5)' }}>
              {HANDOFFS.map((h) => (
                <Chip key={h} size="medium" active={rcptDraft.handoff === h} onClick={() => setRcptDraft({ ...rcptDraft, handoff: h })}>
                  {h}
                </Chip>
              ))}
            </div>
          </div>
        </div>
        <Actions
          filled={!!rcpt}
          canSave={!!(rcptDraft.firstName.trim() && rcptDraft.phone.trim())}
          onCancel={close}
          onRemove={() => save({ recipient: null })}
          onSave={() =>
            save({
              recipient: { ...rcptDraft, firstName: rcptDraft.firstName.trim(), lastName: rcptDraft.lastName.trim(), phone: rcptDraft.phone.trim() },
            })
          }
        />
      </Section>

      <Section
        {...common('time')}
        icon={<ClockIcon />}
        title="Фиксирано време за доставка"
        value={value.time ? timeLabel(value.time) : ''}
        bodyOverflow={openKey === 'time' && timeSettled ? 'visible' : 'hidden'}
      >
        <div style={{ padding: '2px var(--space-3) var(--space-2) var(--space-3)', display: 'flex', flexDirection: 'row', gap: 'var(--space-1-5)', flexWrap: 'wrap' }}>
          {(['Днес', 'Утре'] as const).map((d) => (
            <Chip key={d} size="medium" active={timeDraft.day === d} onClick={() => setTimeDraft({ ...timeDraft, day: d })}>
              {d}
            </Chip>
          ))}
          <Chip
            size="medium"
            active={timeDraft.day === 'Друга дата'}
            icon={icon(timeDraft.day === 'Друга дата' ? 'LucideCalendarDays-gd' : 'LucideCalendarDays-s')}
            onClick={() => setTimeDraft({ ...timeDraft, day: 'Друга дата' })}
          >
            Друга дата
          </Chip>
        </div>
        {timeDraft.day === 'Друга дата' ? (
          <div style={{ padding: '0 var(--space-3) var(--space-2) var(--space-3)' }}>
            <DatePicker
              size="medium"
              value={timeDraft.date}
              placeholder="Избери дата"
              menuPlacement="top"
              onSelect={(date) => setTimeDraft({ ...timeDraft, date })}
            />
          </div>
        ) : null}
        <div style={{ padding: '0 var(--space-3) var(--space-2-5) var(--space-3)' }}>
          <TimeInput
            value={timeDraft.slot}
            min={earliestToday(timeDraft)}
            onChange={(slot) => setTimeDraft({ ...timeDraft, slot })}
          />
        </div>
        <Actions
          filled={!!value.time}
          canSave={(timeDraft.day !== 'Друга дата' || !!timeDraft.date) && !!timeDraft.slot && !timeError(timeDraft.slot, earliestToday(timeDraft))}
          onCancel={close}
          onRemove={() => save({ time: null })}
          onSave={() => save({ time: timeDraft })}
        />
      </Section>

      <Section
        {...common('pay')}
        icon={<WalletIcon />}
        title="Начин на плащане"
        value={payLabel(value.payMethod, value.payRest)}
        trailing={
          <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} style={{ display: 'flex', flexShrink: 0, margin: '-4px 0', cursor: 'default' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 'var(--rounded-lg)',
                background: 'var(--grey-100)',
                boxShadow: 'inset 0 0 0 1px var(--grey-200), var(--shadow-control)',
                overflow: 'hidden',
              }}
            >
              <Button type="outline" size="small" onClick={onOpenInvoice}>
                {invoice ? 'Фактура: ' + invoice : 'Издай фактура'}
              </Button>
              {invoice ? <IconButton size="small" icon={icon('LucideX-g5')} tooltip="Премахни" onClick={onRemoveInvoice} /> : null}
            </div>
          </div>
        }
      >
        <div style={{ ...pad, display: 'flex', flexDirection: 'row', gap: 'var(--space-1-5)', flexWrap: 'wrap' }}>
          {PAYMENT_METHODS.map((m) => (
            <Chip key={m} size="medium" active={payDraft.method === m} onClick={() => setPayDraft({ method: m, rest: m === MICRO_ACCOUNT && payDraft.method !== m ? DEFAULT_PAYMENT : payDraft.rest })}>
              {m === MICRO_ACCOUNT ? `${m}: ${eur(MICRO_BALANCE)}` : m}
            </Chip>
          ))}
        </div>
        {payDraft.method === MICRO_ACCOUNT ? (
          <div style={{ padding: '0 var(--space-3) var(--space-2-5) var(--space-3)' }}>
            <div style={{ border: '1px solid var(--grey-200)', borderRadius: 'var(--rounded-lg)', padding: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={payRow}>
                <span style={payLabelText}>Заплащане с микросметка:</span>
                <span style={payAmount}>{eur(fromMicro)}</span>
              </div>
              {rest > 0 ? (
                <>
                  <div style={divider} />
                  <div style={payRow}>
                    {/* The only row with controls; its label wraps so the amount still fits a narrow panel. */}
                    <span style={{ ...payLabelText, whiteSpace: 'normal', minWidth: 0 }}>Заплащане на остатък:</span>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 'var(--space-1-5)', flexShrink: 0 }}>
                      {PAYMENT_METHODS.filter((m) => m !== MICRO_ACCOUNT).map((m) => (
                        <Chip key={m} size="small" active={payDraft.rest === m} onClick={() => setPayDraft({ ...payDraft, rest: m })}>
                          {m}
                        </Chip>
                      ))}
                    </div>
                    <span style={payAmount}>{eur(rest)}</span>
                  </div>
                </>
              ) : null}
              <div style={divider} />
              <div style={payRow}>
                <span style={payLabelText}>Оставащо в микросметка:</span>
                <span style={payAmount}>{eur(MICRO_BALANCE - fromMicro)}</span>
              </div>
            </div>
          </div>
        ) : null}
        {/* A payment method is always set, so there is nothing to remove: only "Отказ". */}
        <Actions
          filled={false}
          onCancel={close}
          onRemove={() => save({ payMethod: DEFAULT_PAYMENT, payRest: DEFAULT_PAYMENT })}
          onSave={() => save({ payMethod: payDraft.method, payRest: payDraft.rest })}
        />
      </Section>
    </>
  );
}
