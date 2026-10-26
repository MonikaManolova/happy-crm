import { describe, expect, it } from 'vitest';
import { findDish } from '../data/menu';
import type { Dish } from '../data/types';
import { cardPrice, detailUnitPrice, eur, orderTotals, priceOf, promoPercent, stripPrice, unitPrice } from './pricing';

const dish = (id: number) => findDish(id) as Dish;

describe('eur', () => {
  it('formats with a decimal comma', () => {
    expect(eur(7.29)).toBe('7,29 €');
    expect(eur(10)).toBe('10,00 €');
  });
});

describe('priceOf / stripPrice', () => {
  it('reads trailing prices in either decimal style', () => {
    expect(priceOf('С ориз 10,29 €')).toBe(10.29);
    expect(priceOf('Пеперони 4.99')).toBe(4.99);
    expect(priceOf('Coca-Cola')).toBe(0);
  });
  it('strips trailing prices', () => {
    expect(stripPrice('Лешник 0,60 €')).toBe('Лешник');
    expect(stripPrice('Маргарита 4.14')).toBe('Маргарита');
    expect(stripPrice('Блонд')).toBe('Блонд');
  });
});

describe('unitPrice', () => {
  it('uses the base price when no option has one', () => {
    expect(unitPrice(dish(11), ['Sprite'])).toBe(12.99);
  });
  it('lets a priced option replace the base price', () => {
    expect(unitPrice(dish(4), ['С печен овкусен картоф 9,29 €'])).toBe(9.29);
  });
  it('adds up both halves of a split pizza', () => {
    expect(unitPrice(dish(16), ['Пеперони 4.99', 'Маргарита 4.14', 'Класическо тънко'])).toBeCloseTo(9.13);
  });
  it('adds paid add-ons', () => {
    expect(unitPrice(dish(3), [], ['Сос песто 0,80 €'])).toBeCloseTo(10.79);
  });
});

describe('cardPrice', () => {
  it('shows the cheapest priced option for multi-group dishes', () => {
    expect(cardPrice(dish(13))).toBe(3.2);
  });
  it('follows the option picked on the card', () => {
    expect(cardPrice(dish(2))).toBe(7.29);
    expect(cardPrice(dish(2), 'Голяма 9,29 €')).toBe(9.29);
  });
});

describe('detailUnitPrice', () => {
  it('keeps the fixed price for build-your-own pizza', () => {
    expect(detailUnitPrice(dish(17), ['Класическо тънко'], ['Бекон'])).toBe(9.99);
  });
  it('includes add-ons on top of the picked size', () => {
    expect(detailUnitPrice(dish(13), ['Голямо 4.50', 'Блонд', 'Бадемово'], ['Карамел 0,60 €'])).toBeCloseTo(5.1);
  });
});

describe('promoPercent / orderTotals', () => {
  it('takes the percentage from the end of the code', () => {
    expect(promoPercent('SUMMER15', 10)).toBe(15);
    expect(promoPercent('HAPPY', 10)).toBe(10);
    expect(promoPercent(null, 10)).toBe(0);
  });
  it('applies the voucher before the promo discount and never goes negative', () => {
    expect(orderTotals(30, 2, 10, 10)).toEqual({ products: 30, fee: 2, voucher: 10, promoDiscount: 2, total: 20 });
    expect(orderTotals(5, 2, 10, 0).total).toBe(0);
  });
});
