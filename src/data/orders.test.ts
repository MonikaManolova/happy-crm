import { describe, expect, it } from 'vitest';
import { productsTotal } from '../lib/cart';
import { orderTotals, promoPercent } from '../lib/pricing';
import { findDish } from './menu';
import { EXISTING_ORDER, NEW_ORDER } from './orders';

describe('order seeds', () => {
  it('starts a new order empty', () => {
    expect(NEW_ORDER.cart).toEqual([]);
    expect(NEW_ORDER.promo).toBeNull();
  });

  it('loads the existing order with menu items and options from the food list', () => {
    const lines = EXISTING_ORDER.cart.map((l) => `${findDish(l.dishId)?.title} | ${l.picked.join(', ')} | x${l.qty} | +${l.addons.length}`);
    expect(lines).toEqual(['Лятна тиро салата | Малка 7,29 € | x1 | +2', 'Пилешка пържола | С печен овкусен картоф 9,29 € | x2 | +0']);
    expect(EXISTING_ORDER.details.operatorNote).toBe('Клиента е трудноподвижен');
    expect(EXISTING_ORDER.title).toBe('Поръчка');
  });

  it('prices the existing order with the BUNDLE15 promo', () => {
    const products = productsTotal(EXISTING_ORDER.cart);
    expect(products).toBeCloseTo(7.29 + 1.2 + 0.8 + 9.29 * 2);
    const t = orderTotals(products, 2, 0, promoPercent(EXISTING_ORDER.promo, 10));
    expect(t.promoDiscount).toBe(4.18);
    expect(t.total).toBeCloseTo(25.69);
  });
});
