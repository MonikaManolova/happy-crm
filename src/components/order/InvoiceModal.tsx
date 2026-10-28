import { icon } from '../../lib/assets';
import { ChoiceList } from '../common/ChoiceList';
import { Button } from '../ds/Button';
import { IconButton } from '../ds/IconButton';
import { Modal } from '../ds/Modal';

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
          Запази
        </Button>
      )}
    >
      {invoices.length ? (
        <ChoiceList
          name="invoice"
          label="Фактури"
          items={invoices}
          selected={selected}
          onSelect={onSelect}
          actions={(inv) => (
            <>
              {/* Not wired yet: meant to open an edit form. */}
              <IconButton size="medium" icon={icon('LucidePencil')} tooltip="Редактирай" />
              <IconButton size="medium" icon={icon('LucideTrash')} tooltip="Изтрий" onClick={() => onDelete(inv.id)} />
            </>
          )}
        />
      ) : null}
      <Button type="outline" size="large" icon="LucidePlus" style={{ width: '100%', alignSelf: 'stretch' }}>
        Нова фактура
      </Button>
    </Modal>
  );
}
