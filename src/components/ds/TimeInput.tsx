import { useState } from 'react';
import type { ControlSize } from './Button';
import { Input } from './Input';

/* Local extension (not in the Happy design system yet): a typed `HH:MM` field.
   Any minute is allowed. */

const pad = (n: number) => String(n).padStart(2, '0');

/** Minutes since midnight, or null when `s` isn't a valid `H:MM` / `HH:MM` time. */
export function parseTime(s: string): number | null {
  const m = s.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m || +m[1] > 23 || +m[2] > 59) return null;
  return +m[1] * 60 + +m[2];
}

export const formatTime = (mins: number) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

/** Error text for a typed time, or '' when it's valid. `min` is the earliest allowed `HH:MM`. */
export function timeError(s: string, min?: string): string {
  if (!s) return '';
  const t = parseTime(s);
  if (t == null) return 'Невалиден час.';
  const lo = min ? parseTime(min) : null;
  if (lo != null && t < lo) return `Най-рано ${min} ч.`;
  return '';
}

/**
 * Formats digits as they're typed. A digit that can't start a valid hour or minute is
 * zero-padded (`9` → `09:`, `17:7` → `17:07`) and the colon appears once the hour is
 * complete (`17` → `17:`). Deleting is left alone so backspace can remove the colon.
 */
function autoFormat(raw: string, deleting: boolean): string {
  if (deleting) return raw.replace(/[^\d:]/g, '').slice(0, 5);
  const d = raw.replace(/\D/g, '');
  if (!d) return '';
  let hh: string;
  let rest: string;
  if (d[0] > '2') [hh, rest] = [`0${d[0]}`, d.slice(1)];
  else if (d.length === 1) return d;
  else if (d[0] === '2' && d[1] > '3') [hh, rest] = ['02', d.slice(1)];
  else [hh, rest] = [d.slice(0, 2), d.slice(2)];
  const mm = rest && rest[0] > '5' ? `0${rest[0]}` : rest.slice(0, 2);
  return `${hh}:${mm}`;
}

/** Completes a partial time when the field is left: `9` → `09:00`, `9:3` → `09:30`. */
function complete(s: string): string {
  const m = s.match(/^(\d{1,2})(?::(\d{0,2}))?$/);
  if (!m) return s;
  const mins = m[2] == null || m[2] === '' ? '00' : m[2].length === 1 ? `${m[2]}0` : m[2];
  return `${pad(+m[1])}:${mins}`;
}

export interface TimeInputProps {
  label?: string;
  placeholder?: string;
  /** `HH:MM` (may be partial while typing) */
  value: string;
  onChange: (value: string) => void;
  /** Earliest allowed `HH:MM`. */
  min?: string;
  size?: ControlSize;
}

export function TimeInput({ label, placeholder = 'чч:мм', value, onChange, min, size = 'medium' }: TimeInputProps) {
  const [focus, setFocus] = useState(false);
  const error = !focus || value.length === 5 ? timeError(value, min) : '';
  return (
    <Input
      label={label}
      size={size}
      value={value}
      placeholder={placeholder}
      inputMode="numeric"
      error={error}
      onChange={(e) => onChange(autoFormat(e.target.value, (e.nativeEvent as InputEvent).inputType?.startsWith('delete') ?? false))}
      onFocus={() => setFocus(true)}
      onBlur={() => {
        setFocus(false);
        if (value) onChange(complete(value));
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && value) onChange(complete(value));
      }}
    />
  );
}
