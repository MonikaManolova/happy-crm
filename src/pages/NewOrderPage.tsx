import { useNavigate } from 'react-router-dom';
import { TextButton } from '../components/ds/TextButton';
import { ROUTES } from '../routes';
import { OrderScreen } from './OrderScreen';

export function NewOrderPage() {
  const navigate = useNavigate();
  return <OrderScreen navAction={<TextButton onClick={() => navigate(ROUTES.editOrder)}>Редактирай поръчка</TextButton>} />;
}
