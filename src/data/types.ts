export interface OptionGroup {
  label: string;
  options: string[];
}

/** An extra single-choice panel shown above the recipe (e.g. coffee flavours). */
export interface ExtraPanel {
  id: string;
  title: string;
  icon: string;
  items: string[];
  single?: boolean;
}

export interface Dish {
  id: number;
  title: string;
  /** Weight / volume label, e.g. "320 гр.". */
  grams: string;
  /** Base price in euros. Option labels ending in a price override it. */
  price: number;
  img: string;
  cat: string;
  sub: string;
  /** A single option list shown as a select on the card ("Размер", "Гарнитура"…). */
  options?: string[];
  optionLabel?: string;
  /** Several option groups, configured in the detail modal. */
  groups?: OptionGroup[];
  /** Default option index per group; undefined means the operator must choose. */
  defaults?: (number | undefined)[];
  /** Clicking the card opens the detail modal instead of adding straight away. */
  modalOnly?: boolean;
  /** Hide the price on the card. */
  noPrice?: boolean;
  /** Half-and-half pizza. */
  split?: boolean;
  /** Build-your-own pizza. */
  diy?: boolean;
  modalImg?: string;
  extraPanels?: ExtraPanel[];
  /** Ingredients the operator may remove. */
  ingredients?: string[];
  /** Paid add-ons ("Допълнително сирене 1,20 €"). */
  addons?: string[];
}

export interface HalfPizza {
  img: string;
  /** Which side of the source image the half is on. */
  side: 'L' | 'R';
  ingredients: string;
}
