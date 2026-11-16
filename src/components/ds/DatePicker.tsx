import { DayPicker, type ChevronProps } from 'react-day-picker';
import { bg } from 'react-day-picker/locale';
import type { ControlSize } from './Button';
import { Select } from './Dropdown';

/* Local extension (not in the Happy design system yet): a Select whose panel is a
   react-day-picker calendar, styled from tokens in styles/index.css (.happy-calendar). */

const pad = (n: number) => String(n).padStart(2, '0');

/** Dates travel as `dd.mm.yyyy` strings, like the rest of the order data. */
export const formatDate = (d: Date) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;

export function parseDate(s: string | undefined): Date | undefined {
  const m = s?.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  return m ? new Date(+m[3], +m[2] - 1, +m[1]) : undefined;
}

function Chevron({ orientation }: ChevronProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={orientation === 'left' ? 'm15 18-6-6 6-6' : orientation === 'up' ? 'm18 15-6-6-6 6' : orientation === 'down' ? 'm6 9 6 6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

export interface DatePickerProps {
  label?: string;
  placeholder?: string;
  /** `dd.mm.yyyy` */
  value?: string;
  size?: ControlSize;
  disabled?: boolean;
  /** Earliest selectable day; defaults to today. */
  minDate?: Date;
  maxDate?: Date;
  onSelect?: (date: string) => void;
  menuPlacement?: 'top' | 'bottom';
}

export function DatePicker({ minDate, maxDate, value, onSelect, ...rest }: DatePickerProps) {
  const selected = parseDate(value);
  const min = minDate ?? new Date(new Date().setHours(0, 0, 0, 0));
  return (
    <Select
      {...rest}
      value={value}
      menu={(close) => (
        <div className="happy-calendar">
          <DayPicker
            mode="single"
            locale={bg}
            selected={selected}
            defaultMonth={selected ?? min}
            startMonth={min}
            endMonth={maxDate}
            disabled={[{ before: min }, ...(maxDate ? [{ after: maxDate }] : [])]}
            components={{ Chevron }}
            onSelect={(d) => {
              if (!d) return;
              onSelect?.(formatDate(d));
              close();
            }}
          />
        </div>
      )}
    />
  );
}
