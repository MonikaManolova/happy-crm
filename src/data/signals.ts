/** A courier's report about an order, shown in the EditOrder control panel. */
export interface Signal {
  id: number;
  reason: string;
  author: string;
  time: string;
  message?: string;
  reply?: SignalReply;
}

/** The operator's answer to a signal. */
export interface SignalReply {
  /** Who the reply is for, e.g. "Съобщение към шофьора". */
  type: string;
  author: string;
  time: string;
  message: string;
}

/** Recipients an operator can reply to. */
export const REPLY_TYPES = ['Съобщение към шофьора'];

/** Who replies are signed as, until there is a signed-in user. */
export const CURRENT_OPERATOR = 'Оператор: Admin';

/** Sample signals until they come from the backend. */
export const SIGNALS: Signal[] = [
  { id: 1, reason: 'Неоткрит клиент', author: 'Куриер: Тони Милов', time: 'преди 14 мин' },
  {
    id: 2,
    reason: 'Неоткрит клиент',
    author: 'Куриер: Тони Милов',
    time: 'преди 16 мин',
    message: 'Клиента не беше на посочения адрес.',
  },
];
