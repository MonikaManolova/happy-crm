import { asset, icon } from '../lib/assets';
import type { Dish, HalfPizza } from './types';

/* Static menu data, carried over from the prototype. Replace with API data
   once the backend exists. */

const food = (f: string) => asset(`food/${f}`);

export const DISHES: Dish[] = [
  { id: 1, title: 'Крем супа моркови и картофи', grams: '280 гр.', price: 3.83, img: food('d01.png'), cat: 'Супи', sub: 'Предястия' },
  { id: 2, title: 'Лятна тиро салата', options: ['Малка 7,29 €', 'Голяма 9,29 €'], optionLabel: 'Размер', grams: '320 гр.', price: 7.29, img: food('d02.png'), cat: 'Салати', sub: 'Салати' },
  { id: 3, title: 'Фешън бурата със смокини', grams: '320 гр.', price: 9.99, img: food('d03.png'), cat: 'Салати', sub: 'Салати' },
  {
    id: 4,
    title: 'Пилешка пържола',
    options: ['С ориз 10,29 €', 'С печен овкусен картоф 9,29 €', 'С френски картофки 10,29 €', 'С картофено пюре 10,29 €'],
    grams: '320 гр.',
    price: 10.29,
    img: food('d04.png'),
    cat: 'Основни ястия',
    sub: 'Основни',
  },
  { id: 5, title: 'Скариди на плоча', grams: '130 гр.', price: 10.49, img: food('d05.png'), cat: 'Морски', sub: 'Основни' },
  { id: 6, title: 'Комбо Кесадия с Печено', grams: '320 гр.', price: 7.29, img: food('d06.png'), cat: 'Най-поръчвани', sub: 'Основни' },
  { id: 7, title: 'Хрупкави Пилешки', grams: '230 гр.', price: 7.59, img: food('d07.png'), cat: 'Най-поръчвани', sub: 'Протеиново' },
  { id: 8, title: 'Комбо Блек Ангъс Такос', grams: '310 гр.', price: 10.29, img: food('d08.png'), cat: 'Основни ястия', sub: 'Основни' },
  { id: 9, title: 'Хепи Късчета с Френч', grams: '340 гр.', price: 9.29, img: food('d09.png'), cat: 'Детско', sub: 'Детско меню' },
  {
    id: 13,
    title: 'Айс лате',
    modalOnly: true,
    defaults: [0, 0, 0],
    groups: [
      { label: 'Размери', options: ['Малко 3.20', 'Средно 3.90', 'Голямо 4.50'] },
      { label: 'Тип кафе', options: ['Сигничър рос', 'Блонд', 'Декаф', '1/2 Декаф'] },
      { label: 'Мляко', options: ['Краве пълномаслено', 'Безлактозно', 'Бадемово', 'Кокосово'] },
    ],
    extraPanels: [
      { id: 'flavor', single: true, title: 'Добави вкус', icon: food('opt-flavor.png'), items: ['Лешник 0,60 €', 'Ванилия 0,60 €', 'Карамел 0,60 €'] },
      { id: 'topping', single: true, title: 'Добави топинг', icon: food('opt-topping.png'), items: ['Шоколадов сос 0,50 €', 'Бита сметана 0,80 €', 'Какао 0,30 €'] },
    ],
    grams: '250 мл.',
    price: 9.99,
    img: food('d16.png'),
    cat: 'Детско',
    sub: 'Десерти',
  },
  {
    id: 16,
    title: 'Пица 1/2+1/2',
    noPrice: true,
    modalOnly: true,
    split: true,
    defaults: [0, 1, 0],
    groups: [
      { label: 'Лява половина', options: ['Пеперони 4.99', 'Маргарита 4.14'] },
      { label: 'Дясна половина', options: ['Пеперони 4.99', 'Маргарита 4.14'] },
      { label: 'Тесто', options: ['Класическо италианско', 'Класическо тънко'] },
    ],
    grams: '',
    price: 0,
    img: food('pizza-half.png'),
    cat: 'Основно меню',
    sub: 'Основни',
  },
  {
    id: 17,
    title: 'Направи си сам',
    noPrice: true,
    modalOnly: true,
    diy: true,
    defaults: [0],
    groups: [{ label: 'Тесто', options: ['Класическо италианско', 'Класическо тънко'] }],
    grams: '',
    price: 9.99,
    img: food('pizza-diy.png'),
    modalImg: food('pizza-diy-base.png'),
    cat: 'Основно меню',
    sub: 'Основни',
  },
  { id: 10, title: 'Кето Гараш с Малини', grams: '90 гр.', price: 5.49, img: food('d10.png'), cat: 'Най-поръчвани', sub: 'Десерти' },
  { id: 11, title: 'Gaming Combo Криспи', options: ['Coca-Cola', 'Sprite', 'Fanta'], optionLabel: 'Напитки', grams: '450 гр.', price: 12.99, img: food('d11.png'), cat: 'Най-поръчвани', sub: 'Основни' },
  { id: 12, title: 'Авокадо градинарска', grams: '300 гр.', price: 8.49, img: food('d12.png'), cat: 'Салати', sub: 'Салати' },
  { id: 14, title: 'Комбо Кесадия с Печено', grams: '320 гр.', price: 7.29, img: food('d06.png'), cat: 'Основно меню', sub: 'Основни' },
  { id: 15, title: 'Тон и сьомга покебол', options: ['Двоен протеин 7,29 €', 'Стандарт 13,58 €'], grams: '380 гр.', price: 11.99, img: food('d11.png'), cat: 'Морски', sub: 'Поке бол' },
];

export const findDish = (id: number) => DISHES.find((d) => d.id === id);

/** Defaults for dishes that don't list their own removable ingredients / add-ons. */
export const DEFAULT_INGREDIENTS = ['Козе сирене', 'Смокини', 'Кедрови ядки'];
export const DEFAULT_ADDONS = ['Допълнително сирене 1,20 €', 'Сос песто 0,80 €'];

/** Placeholder recipe shown in the dish detail until dishes carry their own. */
export const SAMPLE_RECIPE = {
  text: 'Домати кубчета 2 см. 200гр. Домашно печен марин. пипер 100гр. Сирене краве (натрушено) 50гр. Магданозено песто 20гр. Мариновани чушки сиврия подг. 30гр',
  weight: '370 гр.',
};

export const CATEGORIES = ['Салати', 'Основно меню', 'Най-поръчвани', 'Предястия', 'Супи', 'Основни ястия', 'Морски', 'Детско', 'Протеиново меню', 'Прибори'];

/** Category chip icons: [unselected, selected]. */
export const CATEGORY_ICONS: Record<string, [string, string]> = {
  'Най-поръчвани': [icon('LucideSparkles-s'), icon('LucideSparkles-w')],
  Прибори: [icon('LucideUtensils-s'), icon('LucideUtensils-w')],
};

export const SUBCATEGORIES = ['Предястия', 'Салати', 'Протеиново', 'Основни', 'Поке бол', 'Детско меню', 'Десерти'];

export const HALVES: Record<string, HalfPizza> = {
  Пеперони: { img: food('half-pepperoni.png'), side: 'L', ingredients: 'Пикантен салам пеперони, Моцарела, Доматен сос, Пресен босилек' },
  Маргарита: { img: food('half-margherita.png'), side: 'R', ingredients: 'Моцарела, Доматен сос, Риган, Пресен босилек' },
};

const ingredient = (f: string) => asset(`ingredients/${f}`);

export const DIY_IMG: Record<string, string> = {
  Бекон: ingredient('bacon.png'),
  'Кълцано месо блек ангъс': ingredient('angus.png'),
  'Пилешко месо на BBQ': ingredient('bbq-chicken.png'),
  'Салам пеперони': ingredient('pepperoni.png'),
  'Прошуто крудо': ingredient('prosciutto-crudo.png'),
  'Прошуто кото': ingredient('prosciutto-cotto.png'),
  'Телешко бавно готвено': ingredient('slow-beef.png'),
};

export const DIY_CATS = [
  { label: 'Меса и колбаси', items: ['Бекон', 'Кълцано месо блек ангъс', 'Пилешко месо на BBQ', 'Салам пеперони', 'Прошуто крудо', 'Прошуто кото', 'Телешко бавно готвено'] },
  { label: 'Зеленчуци', items: ['Гъби', 'Чери домати', 'Червен лук', 'Чушки', 'Маслини', 'Рукола', 'Царевица'] },
  { label: 'Сирена', items: ['Моцарела', 'Бурата', 'Пармезан', 'Горгонзола', 'Козе сирене', 'Чедър'] },
  { label: 'Сосове и подправки', items: ['Доматен сос', 'Сметанов сос', 'Песто', 'BBQ сос', 'Риган', 'Люти чушки'] },
];
