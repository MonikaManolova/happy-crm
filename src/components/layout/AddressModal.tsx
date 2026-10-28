import { icon } from '../../lib/assets';
import { ChoiceList, type Choice } from '../common/ChoiceList';
import { Button } from '../ds/Button';
import { IconButton } from '../ds/IconButton';
import { Message } from '../ds/Message';
import { Modal } from '../ds/Modal';

export interface AddressModalProps {
  addresses: Choice<number>[];
  selected: number | null;
  onSelect: (id: number) => void;
  onSave: () => void;
  onClose: () => void;
}

/** "Адрес за доставка": pick the delivery address, laid out like the invoice modal. */
export function AddressModal({ addresses, selected, onSelect, onSave, onClose }: AddressModalProps) {
  return (
    <Modal
      title="Адрес за доставка"
      onClose={onClose}
      width={550}
      footer={(close) => (
        <Button
          type="solid"
          size="large"
          icon="LucideCheck"
          disabled={selected == null}
          onClick={() => {
            onSave();
            close();
          }}
        >
          Запази
        </Button>
      )}
    >
      <Message
        type="warning"
        title="Избора на друг адрес, може да промени поръчката."
        subtitle="Смяната на адреса може да доведе до смяна на доставящия ресторант. Това може да наложи промени в поръчката."
        dismissible={false}
      />
      <ChoiceList
        name="address"
        label="Адреси"
        items={addresses}
        selected={selected}
        onSelect={onSelect}
        // Not wired yet: meant to open an edit form.
        actions={() => <IconButton size="medium" icon={icon('LucidePencil')} tooltip="Редактирай" />}
      />
      <Button type="outline" size="large" icon="LucidePlus" style={{ width: '100%', alignSelf: 'stretch' }}>
        Нов Адрес
      </Button>
    </Modal>
  );
}
