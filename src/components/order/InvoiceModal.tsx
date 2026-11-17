import { useState, type CSSProperties } from 'react';
import { icon } from '../../lib/assets';
import { ChoiceList } from '../common/ChoiceList';
import { Button } from '../ds/Button';
import { IconButton } from '../ds/IconButton';
import { Input } from '../ds/Input';
import { Modal } from '../ds/Modal';

export interface Company {
  name: string;
  eik: string;
  vat: string;
  address: string;
  mol: string;
}

export interface Invoice {
  id: number;
  label: string;
  company?: Company;
}

export interface InvoiceModalProps {
  invoices: Invoice[];
  selected: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  /** Adds a company from the "Нова фирма" step; the parent appends and selects it. */
  onAdd: (company: Company) => void;
  /** Saves an edited company from the "Редактирай фирма" step. */
  onUpdate: (id: number, company: Company) => void;
  onSave: () => void;
  onClose: () => void;
}

const EMPTY_COMPANY: Company = { name: '', eik: '', vat: '', address: '', mol: '' };
const row: CSSProperties = { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'var(--space-3-5)', alignSelf: 'stretch' };

/** "Издай фактура" (Figma 1205:17659): pick a company, or add or edit one in a second step. */
export function InvoiceModal({ invoices, selected, onSelect, onDelete, onAdd, onUpdate, onSave, onClose }: InvoiceModalProps) {
  const [draft, setDraft] = useState<Company | null>(null);
  /** The company being edited, or null while adding a new one. */
  const [editId, setEditId] = useState<number | null>(null);
  const openForm = (id: number | null, company: Company) => {
    setEditId(id);
    setDraft(company);
  };

  if (draft) {
    const field = (key: keyof Company, label: string, placeholder: string) => (
      <Input size="large" label={label} placeholder={placeholder} value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
    );
    const canSave = !!(draft.name.trim() && draft.eik.trim());
    return (
      <Modal
        title={editId == null ? 'Нова фирма' : 'Редактирай фирма'}
        onBack={() => setDraft(null)}
        onClose={onClose}
        width={550}
        footer={
          <Button
            type="solid"
            size="large"
            icon="LucideCheck"
            disabled={!canSave}
            onClick={() => {
              const t = (s: string) => s.trim();
              const company = { name: t(draft.name), eik: t(draft.eik), vat: t(draft.vat), address: t(draft.address), mol: t(draft.mol) };
              if (editId == null) onAdd(company);
              else onUpdate(editId, company);
              setDraft(null);
            }}
          >
            Запази
          </Button>
        }
      >
        {field('name', 'Име', 'Въведи име')}
        <div style={row}>
          {field('eik', 'ЕИК', 'Въведи ЕИК')}
          {field('vat', 'ДДС №', 'Въведи номер')}
        </div>
        <div style={row}>
          {field('address', 'Адрес', 'Въведи адрес')}
          {field('mol', 'МОЛ', 'Въведи МОЛ')}
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Издай фактура"
      subtitle="Изберете от списъка с фирми или добавете нова."
      onClose={onClose}
      width={550}
      footer={(close) => (
        <Button
          type="solid"
          size="large"
          icon="LucideCheck"
          onClick={() => {
            onSave();
            close();
          }}
        >
          Приложи
        </Button>
      )}
    >
      {invoices.length ? (
        <ChoiceList
          name="invoice"
          label="Фирми"
          items={invoices}
          selected={selected}
          onSelect={onSelect}
          actions={(inv) => (
            <>
              <IconButton
                size="medium"
                icon={icon('LucidePencil')}
                tooltip="Редактирай"
                onClick={() => openForm(inv.id, invoices.find((x) => x.id === inv.id)?.company ?? EMPTY_COMPANY)}
              />
              <IconButton size="medium" icon={icon('LucideTrash')} tooltip="Изтрий" onClick={() => onDelete(inv.id)} />
            </>
          )}
        />
      ) : null}
      <Button type="outline" size="large" icon="LucidePlus" style={{ width: '100%', alignSelf: 'stretch' }} onClick={() => openForm(null, EMPTY_COMPANY)}>
        Нова фирма
      </Button>
    </Modal>
  );
}
