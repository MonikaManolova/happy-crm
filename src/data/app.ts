import { icon } from '../lib/assets';

/* Static customer, navigation and order-panel data from the prototype. */

export const NAV_ITEMS = [
  { label: 'Основно табло', icon: icon('Home-g') },
  { label: 'Шофьори', icon: icon('UserGroup-ga') },
  { label: 'Статистика', icon: icon('ChartPie-g') },
  { label: 'Табло', icon: icon('ViewColumns-g') },
  { label: 'Отчети', icon: icon('DocumentText-g') },
  { label: 'Документи', icon: icon('Folder-g') },
  { label: 'Настройки', icon: icon('Cog6Tooth-g') },
];

export const CUSTOMER = {
  name: 'Александър Петров',
  status: 'Online user',
  phone: '0888333320',
  email: 'alex_ivanov@gmail.com',
  address: 'гр. София, ул. Св. Иван Рилски 46',
  restaurant: 'Happy Виктория',
  deliveryEta: '40 мин за доставка',
};

export const ORDER_ID = '#1381';
export const DELIVERY_FEE = 2;
export const MIN_ORDER = 10;
export const VOUCHER_AMOUNT = 10;
/** Promo discount (%) when the code doesn't end in a number. */
export const DEFAULT_PROMO_PERCENT = 10;

export const PAYMENT_METHODS = ['В брой', 'С карта (pay link)', 'Микросметка'];
export const DEFAULT_PAYMENT = 'В брой';

export const DELIVERY_SLOTS = ['17:00 ч.', '17:30 ч.', '18:00 ч.', '18:30 ч.', '19:00 ч.', '19:30 ч.', '20:00 ч.'];
export const DELIVERY_DATES = ['23.09.2026', '24.09.2026', '25.09.2026', '26.09.2026', '27.09.2026'];

export const DEFAULT_INVOICES = [
  { id: 1, label: 'Хоризонт ООД, ЕИК: 208340001' },
  { id: 2, label: 'Бозмов ЕООД, ЕИК: 893000123' },
];

export interface ActiveOrder {
  id: string;
  placedAt: string;
  status: string;
  restaurant: string;
  delivery: string;
  eta: string;
}

/** The customer's other open orders, which a new order can be linked to. */
export const ACTIVE_ORDERS: ActiveOrder[] = [
  { id: '#1023', placedAt: 'Днес, 09:25', status: 'Приготвя се', restaurant: 'Happy Саут Парк', delivery: 'До адрес', eta: '13:10' },
];
