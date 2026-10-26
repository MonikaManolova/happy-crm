import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { findDish } from '../../data/menu';
import { icon } from '../../lib/assets';
import { lineTotal, type CartLine } from '../../lib/cart';
import { eur, stripPrice } from '../../lib/pricing';
import { Button } from '../ds/Button';
import { IconButton } from '../ds/IconButton';
import { Input } from '../ds/Input';
import { TextButton } from '../ds/TextButton';
import { Collapse } from './Collapse';
import { CheckIcon, NotepadIcon, XIcon } from './icons';

const label: CSSProperties = { fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#171717', flexShrink: 0 };
const detail: CSSProperties = { fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#737373', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };

/** Lower-cases a Cyrillic option so it reads naturally after the title. */
const lc = (o: string) => (/^[А-Яа-я]/.test(o) ? o.charAt(0).toLowerCase() + o.slice(1) : o);

export interface CartRowProps {
  line: CartLine;
  last: boolean;
  note: string;
  onNote: (note: string | null) => void;
  onBump: (delta: number) => void;
  onEdit: () => void;
}

export function CartRow({ line, last, note, onNote, onBump, onEdit }: CartRowProps) {
  const dish = findDish(line.dishId);
  // null = not editing; otherwise the draft text.
  const [draft, setDraft] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editing = draft !== null;

  useEffect(() => {
    if (editing) {
      const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 30);
      return () => clearTimeout(t);
    }
  }, [editing]);

  if (!dish) return null;
  const title = dish.title;
  const opts = line.picked.map(stripPrice).filter((o) => o && !title.toLowerCase().includes(o.toLowerCase()));
  const configText = opts.length ? ' - ' + opts.map(lc).join(', ') : '';
  const save = () => {
    const t = (draft ?? '').trim();
    if (!t) return;
    onNote(t);
    setDraft(null);
  };

  return (
    <div style={{ padding: '6px 0', borderBottom: last ? 'none' : '1px solid var(--grey-200)', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#171717', flexGrow: 1 }}>
          {title}
          <span style={{ color: 'var(--grey-600)', fontWeight: 400 }}>{configText}</span>
        </span>
        <span style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#018017', whiteSpace: 'nowrap' }}>{eur(lineTotal(line))}</span>
      </div>
      {line.removed.length ? (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: -2, minWidth: 0 }}>
          <XIcon size={16} strokeWidth={2.4} style={{ color: '#C2410C' }} />
          <span style={label}>Без:</span>
          <span style={detail} title={line.removed.map(stripPrice).join(', ')}>
            {line.removed.map(stripPrice).join(', ')}
          </span>
        </div>
      ) : null}
      {line.addons.length ? (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: -2, minWidth: 0 }}>
          <CheckIcon size={16} strokeWidth={2.4} style={{ color: '#018017' }} />
          <span style={label}>Добавки:</span>
          <span style={detail} title={line.addons.map(stripPrice).join(', ')}>
            {line.addons.map(stripPrice).join(', ')}
          </span>
        </div>
      ) : null}

      <Collapse open={!!note && !editing} duration={200} fade style={{ marginTop: -6 }}>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 4px' }}>
          <div style={{ height: 6, flexShrink: 0 }} />
          <button
            type="button"
            className="hover-grey-100"
            onClick={() => setDraft(note)}
            style={{
              appearance: 'none',
              border: 'none',
              background: 'transparent',
              font: 'inherit',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'row',
              gap: 6,
              alignItems: 'center',
              alignSelf: 'flex-start',
              maxWidth: 'calc(100% + 8px)',
              margin: '-2px -4px 0 -4px',
              padding: '2px 4px',
              minWidth: 0,
              borderRadius: 'var(--rounded-md, 6px)',
              cursor: 'pointer',
            }}
          >
            <NotepadIcon size={16} style={{ color: '#018017' }} />
            <span style={label}>Бележка:</span>
            <span style={detail} title={note}>
              {note}
            </span>
          </button>
        </div>
      </Collapse>

      <Collapse open={editing} duration={200} fade style={{ marginTop: -6 }} innerStyle={{ padding: '0 2px 2px 2px', margin: '0 -2px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 6, flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-1-5)' }}>
            <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex' }}>
              <Input
                ref={inputRef}
                size="small"
                aria-label="Бележка към артикула"
                value={draft ?? ''}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') save();
                  if (e.key === 'Escape') setDraft(null);
                }}
                placeholder="Напиши бележка"
              />
            </div>
            <Button type="solid" size="small" disabled={!(draft ?? '').trim()} onClick={save}>
              {note ? 'Запази' : 'Добави'}
            </Button>
            {note ? (
              <Button
                type="outline"
                size="small"
                onClick={() => {
                  onNote(null);
                  setDraft(null);
                }}
              >
                Премахни
              </Button>
            ) : (
              <Button type="outline" size="small" onClick={() => setDraft(null)}>
                Отказ
              </Button>
            )}
          </div>
        </div>
      </Collapse>

      <div style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center' }}>
        <TextButton icon={icon('LucidePencil')} onClick={onEdit}>
          Редактирай
        </TextButton>
        {!note && !editing ? (
          <TextButton icon={icon('LucideNotepadText')} onClick={() => setDraft('')}>
            Бележка
          </TextButton>
        ) : null}
        <div style={{ flexGrow: 1 }} />
        <div style={{ display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center', padding: 2, borderRadius: 'var(--rounded-lg, 8px)', background: 'var(--grey-100)' }}>
          <IconButton
            size="small"
            icon={icon(line.qty <= 1 ? 'LucideTrash' : 'LucideMinus')}
            tooltip={line.qty <= 1 ? 'Премахни' : 'Намали'}
            onClick={() => onBump(-1)}
          />
          <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#171717', minWidth: 14, textAlign: 'center' }}>{line.qty}</span>
          <IconButton size="small" icon={icon('LucidePlus')} tooltip="Увеличи" onClick={() => onBump(1)} />
        </div>
      </div>
    </div>
  );
}
