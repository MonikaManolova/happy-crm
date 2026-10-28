import type { ReactNode } from 'react';
import { Radio } from '../ds/Radio';

export interface Choice<K extends string | number> {
  id: K;
  label: string;
}

/**
 * Single-choice list used in modals ("Издай фактура", "Адрес за доставка"):
 * a radio and label per row, row actions on the right, hairlines between rows.
 */
export function ChoiceList<K extends string | number>({
  name,
  label,
  items,
  selected,
  onSelect,
  actions,
}: {
  /** Radio group name. */
  name: string;
  /** Accessible name of the group. */
  label: string;
  items: Choice<K>[];
  selected: K | null;
  onSelect: (id: K) => void;
  /** Icon buttons shown at the end of each row. */
  actions?: (item: Choice<K>) => ReactNode;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      // The Modal body spaces children 16px apart; the list sits 10px above what follows.
      style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch', marginBottom: 'calc(var(--space-2-5) - var(--space-4))' }}
    >
      {items.map((it, i) => (
        <div
          key={it.id}
          className="hover-row"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 'var(--space-1-5)',
            padding: 'var(--space-1-5) 0',
            borderBottom: i < items.length - 1 ? '1px solid var(--grey-200)' : 'none',
            transition: 'background-color 150ms ease-out',
          }}
        >
          <div
            onClick={() => onSelect(it.id)}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-1-5)', flexGrow: 1, minWidth: 0, cursor: 'pointer' }}
          >
            <Radio checked={it.id === selected} name={name} onChange={() => onSelect(it.id)} />
            <span
              title={it.label}
              style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: 'var(--grey-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}
            >
              {it.label}
            </span>
          </div>
          {actions ? <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-0-5)', flexShrink: 0 }}>{actions(it)}</div> : null}
        </div>
      ))}
    </div>
  );
}
