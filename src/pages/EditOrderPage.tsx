import { useNavigate } from 'react-router-dom';
import { TextButton } from '../components/ds/TextButton';
import { ControlPanel } from '../components/layout/ControlPanel';
import { EXISTING_ORDER } from '../data/orders';
import { ROUTES } from '../routes';
import { OrderScreen } from './OrderScreen';

/** Editing an existing order: the order screen, loaded with that order. Edit-only parts come later. */
export function EditOrderPage() {
  const navigate = useNavigate();
  return (
    <OrderScreen
      seed={EXISTING_ORDER}
      leftPanel={<ControlPanel />}
      compact
      navAction={<TextButton onClick={() => navigate(ROUTES.newOrder)}>Нова поръчка</TextButton>}
    />
  );
}
