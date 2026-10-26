import { describe, expect, it } from 'vitest';
import { addLine, bumpLine, dishQty, lineKey, productsTotal, replaceLine, type LineConfig } from './cart';

const salad: LineConfig = { dishId: 2, picked: ['Малка 7,29 €'], addons: [], removed: [] };
const bigSalad: LineConfig = { ...salad, picked: ['Голяма 9,29 €'] };
const soup: LineConfig = { dishId: 1, picked: [], addons: [], removed: [] };

describe('cart', () => {
  it('merges identical configurations', () => {
    const cart = addLine(addLine([], salad, 1), salad, 2);
    expect(cart).toHaveLength(1);
    expect(cart[0].qty).toBe(3);
  });

  it('keeps different configurations of a dish apart but counts them together', () => {
    const cart = addLine(addLine([], salad, 1), bigSalad, 2);
    expect(cart).toHaveLength(2);
    expect(dishQty(cart, 2)).toBe(3);
  });

  it('ignores add-on order when building keys', () => {
    expect(lineKey({ ...soup, addons: ['a', 'b'] })).toBe(lineKey({ ...soup, addons: ['b', 'a'] }));
  });

  it('drops a line when its quantity reaches zero', () => {
    const cart = addLine([], soup, 1);
    expect(bumpLine(cart, cart[0].key, -1)).toEqual([]);
    expect(bumpLine(cart, cart[0].key, 2)[0].qty).toBe(3);
  });

  it('replaces an edited line in place', () => {
    const cart = addLine(addLine([], salad, 1), soup, 1);
    const next = replaceLine(cart, cart[0].key, bigSalad, 4);
    expect(next.map((l) => l.picked[0])).toEqual(['Голяма 9,29 €', undefined]);
    expect(next[0].qty).toBe(4);
  });

  it('merges an edited line into an identical existing one', () => {
    const cart = addLine(addLine([], salad, 1), bigSalad, 2);
    const next = replaceLine(cart, cart[0].key, bigSalad, 1);
    expect(next).toHaveLength(1);
    expect(next[0].qty).toBe(3);
  });

  it('sums line totals', () => {
    const cart = addLine(addLine([], bigSalad, 2), soup, 1);
    expect(productsTotal(cart)).toBeCloseTo(9.29 * 2 + 3.83);
  });
});
