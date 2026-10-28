import type { PageHeader } from '../components/layout/CustomerHeader';
import type { OrderDetailsValue } from '../components/order/OrderDetails';
import { EMPTY_DETAILS } from '../components/order/OrderDetails';
import { addLine, type CartLine } from '../lib/cart';
import { CUSTOMER, ORDER_ID } from './app';
import { DEFAULT_ADDONS, findDish } from './menu';

/** What an order screen starts with. NewOrder starts empty; EditOrder loads an existing order. */
export interface OrderSeed {
  header: PageHeader;
  title: string;
  cart: CartLine[];
  details: OrderDetailsValue;
  promo: string | null;
}

export const NEW_ORDER: OrderSeed = {
  header: { breadcrumb: ['Нова offline поръчка', CUSTOMER.name] },
  title: 'Нова поръчка',
  cart: [],
  details: EMPTY_DETAILS,
  promo: null,
};

/** A dish option, taken from the menu so names and prices always match the food list. */
function option(dishId: number, label: string): string {
  const found = findDish(dishId)?.options?.find((o) => o.startsWith(label));
  if (!found) throw new Error(`Menu has no option "${label}" for dish ${dishId}`);
  return found;
}

const SALAD = 2; // Лятна тиро салата
const CHICKEN = 4; // Пилешка пържола

/** Sample existing order shown on the EditOrder page until orders come from the backend. */
export const EXISTING_ORDER: OrderSeed = {
  header: { breadcrumb: ['Редакция на поръчка', ORDER_ID], title: `Поръчка ${ORDER_ID}`, signal: true },
  title: 'Поръчка',
  cart: [
    { config: { dishId: SALAD, picked: [option(SALAD, 'Малка')], addons: DEFAULT_ADDONS, removed: [] }, qty: 1 },
    { config: { dishId: CHICKEN, picked: [option(CHICKEN, 'С печен овкусен картоф')], addons: [], removed: [] }, qty: 2 },
  ].reduce<CartLine[]>((cart, l) => addLine(cart, l.config, l.qty), []),
  details: { ...EMPTY_DETAILS, operatorNote: 'Клиента е трудноподвижен' },
  promo: 'BUNDLE15',
};
