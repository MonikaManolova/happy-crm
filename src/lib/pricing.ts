import type { Dish } from '../data/types';

/** Formats euros the Bulgarian way: 7.29 → "7,29 €". */
export const eur = (n: number) => n.toFixed(2).replace('.', ',') + ' €';

const TRAILING_PRICE = /(\d+)[.,](\d{2})\s*€?\s*$/;

/** Reads a trailing price from an option label ("С ориз 10,29 €" → 10.29), or 0. */
export function priceOf(label: string): number {
  const m = label.match(TRAILING_PRICE);
  return m ? parseFloat(m[1] + '.' + m[2]) : 0;
}

/** Drops a trailing price from a label ("Лешник 0,60 €" → "Лешник"). */
export const stripPrice = (label: string) => label.replace(/\s*\d+[.,]\d+\s*€?\s*$/, '').trim();

/**
 * Price of one unit with the given options and add-ons. For a split pizza the
 * halves' prices add up; otherwise the first option carrying a price replaces
 * the dish's base price.
 */
export function unitPrice(dish: Dish, picked: string[], addons: string[] = []): number {
  let base = dish.price;
  if (dish.split) base = picked.reduce((s, p) => s + priceOf(p), 0);
  else
    for (const p of picked) {
      const v = priceOf(p);
      if (v) {
        base = v;
        break;
      }
    }
  return base + addons.reduce((s, a) => s + priceOf(a), 0);
}

/** "From" price shown on a menu card. */
export function cardPrice(dish: Dish, pick?: string): number {
  if (dish.groups) {
    const prices = dish.groups.flatMap((g) => g.options).map(priceOf).filter((p) => p > 0);
    return prices.length ? Math.min(...prices) : dish.price;
  }
  if (dish.options) return unitPrice(dish, [pick ?? dish.options[0]]);
  return dish.price;
}

/** Unit price shown in the dish detail modal while options are being picked. */
export function detailUnitPrice(dish: Dish, picked: string[], addons: string[]): number {
  const base = dish.diy
    ? dish.price
    : dish.split || picked.some((p) => priceOf(p) > 0)
      ? unitPrice(dish, picked)
      : cardPrice(dish);
  return base + addons.reduce((s, a) => s + priceOf(a), 0);
}

export interface Totals {
  products: number;
  fee: number;
  voucher: number;
  promoDiscount: number;
  total: number;
}

/** Promo codes ending in a number give that many percent off ("SUMMER15" → 15). */
export function promoPercent(code: string | null, fallback: number): number {
  if (!code) return 0;
  const m = code.match(/(\d+)$/);
  return (m && parseInt(m[1], 10)) || fallback;
}

export function orderTotals(products: number, fee: number, voucher: number, promoPct: number): Totals {
  const promoDiscount = Math.round(Math.max(0, products - voucher) * promoPct) / 100;
  return { products, fee, voucher, promoDiscount, total: Math.max(0, products + fee - voucher - promoDiscount) };
}
