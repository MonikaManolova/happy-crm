/** Where an order's step stands in the "Проследяване" timeline. */
export type TrackingStatus = 'done' | 'active' | 'pending';

/** One step of an order's progress, shown in the EditOrder control panel. */
export interface TrackingStep {
  title: string;
  detail: string;
  status: TrackingStatus;
  time?: string;
  /** Offers "Проследи" next to the title. */
  trackable?: boolean;
}

export const EXPECTED_DELIVERY = 'Днес, 14:20';

/** Newest step first (Figma 1123:8487). */
export const TRACKING: TrackingStep[] = [
  { title: 'Доставка', detail: 'Доставя се от:', status: 'pending' },
  { title: 'Пакетиране', detail: 'Пакетира се от:', status: 'pending', trackable: true },
  { title: 'Приготвяне', detail: 'В процес на приготвяне', status: 'active', time: 'Днес, 13:09' },
  { title: 'Поръчката е приета', detail: 'Приета от Теодор Колев (оператор)', status: 'done', time: 'Днес, 13:05' },
  { title: 'Поръчката е създадена', detail: 'Успешно създаване от Теодор Колев (оператор)', status: 'done', time: 'Днес, 13:05' },
];
