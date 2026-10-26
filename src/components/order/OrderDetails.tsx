import { useEffect, useRef, useState, type ReactNode } from 'react';
import { DELIVERY_DATES, DELIVERY_SLOTS, DEFAULT_PAYMENT, PAYMENT_METHODS } from '../../data/app';
import { icon } from '../../lib/assets';
import { Button } from '../ds/Button';
import { Chip } from '../ds/Chip';
import { Select } from '../ds/Dropdown';
import { IconButton } from '../ds/IconButton';
import { Input } from '../ds/Input';
import { Textarea } from '../ds/Textarea';
import { Collapse } from './Collapse';
import { ClockIcon, HeadsetIcon, NotepadIcon, PencilIcon, PlusIcon, UserPlusIcon, WalletIcon } from './icons';

export type SectionKey = 'client' | 'operator' | 'recipient' | 'time' | 'pay';

export interface Recipient {
  name: string;
  phone: string;
}
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
}

export const EMPTY_DETAILS: OrderDetailsValue = { clientNote: '', operatorNote: '', recipient: null, time: null, payMethod: DEFAULT_PAYMENT };

const timeLabel = (t: DeliveryTime) => [t.day === 'Друга дата' && t.date ? t.date : t.day, t.slot].join(', ');

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

/* ---------- Order details ---------- */

export interface OrderDetailsProps {
  value: OrderDetailsValue;
  onChange: (v: OrderDetailsValue) => void;
  invoice: string | null;
  onOpenInvoice: () => void;
  onRemoveInvoice: () => void;
}

/**
 * Recipient, notes, delivery time and payment rows. Only one row is open at a
 * time; it closes through its own buttons or a click anywhere outside it,
 * which discards the draft.
 */
export function OrderDetails({ value, onChange, invoice, onOpenInvoice, onRemoveInvoice }: OrderDetailsProps) {
  const [openKey, setOpenKey] = useState<SectionKey | null>(null);
  const refs = useRef<Partial<Record<SectionKey, HTMLDivElement | null>>>({});

  // Drafts, reset from the saved value whenever a row opens.
  const [noteDraft, setNoteDraft] = useState('');
  const [rcptDraft, setRcptDraft] = useState<Recipient>({ name: '', phone: '' });
  const [timeDraft, setTimeDraft] = useState<DeliveryTime>({ day: 'Днес', date: '', slot: DELIVERY_SLOTS[0] });
  const [payDraft, setPayDraft] = useState(DEFAULT_PAYMENT);
  // Lets the time row's select menus overflow once the expand animation ends.
  const [timeSettled, setTimeSettled] = useState(false);

  useEffect(() => {
    if (!openKey) return undefined;
    const away = (e: MouseEvent) => {
      const el = refs.current[openKey];
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
    if (key === 'recipient') setRcptDraft(value.recipient ?? { name: '', phone: '' });
    if (key === 'time') setTimeDraft(value.time ?? { day: 'Днес', date: '', slot: DELIVERY_SLOTS[0] });
    if (key === 'pay') setPayDraft(value.payMethod);
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

  const rcpt = value.recipient;
  const rcptValue = rcpt ? [rcpt.name.trim(), rcpt.phone.trim() ? 'тел: ' + rcpt.phone.trim() : ''].filter(Boolean).join(', ') : '';

  return (
    <>
      {noteSection('client', 'Забележка от клиент', <NotepadIcon />)}
      {noteSection('operator', 'Забележка от оператор', <HeadsetIcon />)}

      <Section {...common('recipient')} icon={<UserPlusIcon />} title="Друг получател" value={rcptValue}>
        <div style={{ ...pad, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'var(--space-2)' }}>
          <Input size="medium" placeholder="Въведи име" aria-label="Име на получателя" value={rcptDraft.name} onChange={(e) => setRcptDraft({ ...rcptDraft, name: e.target.value })} />
          <Input size="medium" type="tel" placeholder="Въведи телефон" aria-label="Телефон на получателя" value={rcptDraft.phone} onChange={(e) => setRcptDraft({ ...rcptDraft, phone: e.target.value })} />
        </div>
        <Actions
          filled={!!rcpt}
          canSave={!!(rcptDraft.name.trim() && rcptDraft.phone.trim())}
          onCancel={close}
          onRemove={() => save({ recipient: null })}
          onSave={() => save({ recipient: { name: rcptDraft.name.trim(), phone: rcptDraft.phone.trim() } })}
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
            <Select
              size="medium"
              value={timeDraft.date}
              placeholder="Избери дата"
              options={DELIVERY_DATES}
              search={false}
              menuPlacement="top"
              onSelect={(date) => setTimeDraft({ ...timeDraft, date })}
            />
          </div>
        ) : null}
        <div style={{ padding: '0 var(--space-3) var(--space-2-5) var(--space-3)' }}>
          <Select
            size="medium"
            value={timeDraft.slot}
            placeholder="Избери час"
            options={DELIVERY_SLOTS}
            search={false}
            menuPlacement="top"
            onSelect={(slot) => setTimeDraft({ ...timeDraft, slot })}
          />
        </div>
        <Actions
          filled={!!value.time}
          canSave={timeDraft.day !== 'Друга дата' || !!timeDraft.date}
          onCancel={close}
          onRemove={() => save({ time: null })}
          onSave={() => save({ time: timeDraft })}
        />
      </Section>

      <Section
        {...common('pay')}
        icon={<WalletIcon />}
        title="Начин на плащане"
        value={value.payMethod}
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
            <Chip key={m} size="medium" active={payDraft === m} onClick={() => setPayDraft(m)}>
              {m}
            </Chip>
          ))}
        </div>
        <Actions filled onCancel={close} onRemove={() => save({ payMethod: DEFAULT_PAYMENT })} onSave={() => save({ payMethod: payDraft })} />
      </Section>
    </>
  );
}
