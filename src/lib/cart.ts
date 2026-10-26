import { findDish } from '../data/menu';
import { unitPrice } from './pricing';

/** One line in the order: a dish with a particular configuration. */
export interface CartLine {
  key: string;
  dishId: number;
  /** Chosen option per group, e.g. ["Малка 7,29 €"]. */
  picked: string[];
  addons: string[];
  removed: string[];
  qty: number;
}

export type LineConfig = Omit<CartLine, 'key' | 'qty'>;

/** Lines with the same dish and configuration share a key and are merged. */
export const lineKey = (c: LineConfig) =>
  [c.dishId, c.picked.join(' | '), [...c.addons].sort().join(' | '), [...c.removed].sort().join(' | ')].join('::');

/** Adds `qty` of a configuration, merging with an identical line if present. */
export function addLine(cart: CartLine[], config: LineConfig, qty: number): CartLine[] {
  const key = lineKey(config);
  if (cart.some((l) => l.key === key)) return cart.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
  return [...cart, { ...config, key, qty }];
}

/** Changes a line's quantity, dropping it at zero. */
export function bumpLine(cart: CartLine[], key: string, delta: number): CartLine[] {
  return cart.flatMap((l) => {
    if (l.key !== key) return [l];
    const qty = l.qty + delta;
    return qty > 0 ? [{ ...l, qty }] : [];
  });
}

/**
 * Replaces an edited line in place. If the new configuration matches another
 * existing line, the two are merged.
 */
export function replaceLine(cart: CartLine[], oldKey: string, config: LineConfig, qty: number): CartLine[] {
  const key = lineKey(config);
  if (key !== oldKey && cart.some((l) => l.key === key)) {
    return cart.filter((l) => l.key !== oldKey).map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
  }
  return cart.map((l) => (l.key === oldKey ? { ...config, key, qty } : l));
}

/** Total quantity of a dish across all its configurations. */
export const dishQty = (cart: CartLine[], dishId: number) =>
  cart.reduce((n, l) => (l.dishId === dishId ? n + l.qty : n), 0);

export function lineTotal(line: CartLine): number {
  const dish = findDish(line.dishId);
  return dish ? unitPrice(dish, line.picked, line.addons) * line.qty : 0;
}

export const productsTotal = (cart: CartLine[]) => cart.reduce((s, l) => s + lineTotal(l), 0);
