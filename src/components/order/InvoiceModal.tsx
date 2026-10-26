import { icon } from '../../lib/assets';
import { Button } from '../ds/Button';
import { IconButton } from '../ds/IconButton';
import { Modal } from '../ds/Modal';
import { Radio } from '../ds/Radio';

export interface Invoice {
  id: number;
  label: string;
}

export interface InvoiceModalProps {
  invoices: Invoice[];
  selected: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onSave: () => void;
  onClose: () => void;
}

export function InvoiceModal({ invoices, selected, onSelect, onDelete, onSave, onClose }: InvoiceModalProps) {
  return (
    <Modal
      title="Издай фактура"
      subtitle="Добави нова фактура или избери от списъка с добавени."
      onClose={onClose}
      width={480}
      footer={
        <Button type="solid" size="large" icon="LucideCheck" onClick={onSave}>
          Запази
        </Button>
      }
    >
      {invoices.length ? (
        <div role="radiogroup" aria-label="Фактури" style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch', marginBottom: 'calc(var(--space-2-5) - var(--space-4))' }}>
          {invoices.map((inv, i) => (
            <div
              key={inv.id}
              className="hover-row"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 'var(--space-1-5)',
                padding: 'var(--space-1-5) 0',
                borderBottom: i < invoices.length - 1 ? '1px solid var(--grey-200)' : 'none',
                transition: 'background-color 150ms ease-out',
              }}
            >
              <div
                onClick={() => onSelect(inv.id)}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-1-5)', flexGrow: 1, minWidth: 0, cursor: 'pointer' }}
              >
                <Radio checked={inv.id === selected} name="invoice" onChange={() => onSelect(inv.id)} />
                <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: 'var(--grey-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
                  {inv.label}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-0-5)', flexShrink: 0 }}>
                {/* Not wired yet: meant to open an edit form. */}
                <IconButton size="medium" icon={icon('LucidePencil')} tooltip="Редактирай" />
                <IconButton size="medium" icon={icon('LucideTrash')} tooltip="Изтрий" onClick={() => onDelete(inv.id)} />
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <Button type="outline" size="large" icon="LucidePlus" style={{ width: '100%', alignSelf: 'stretch' }}>
        Нова фактура
      </Button>
    </Modal>
  );
}
