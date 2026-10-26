import { useState, type CSSProperties, type TextareaHTMLAttributes } from 'react';
import type { ControlSize } from './Button';
import { Field, fieldVisual, textControl } from './Field';

/* Happy design system — Textarea (components/forms/Textarea.jsx). */

const HEIGHTS: Record<ControlSize, number> = { small: 68, medium: 72, large: 76 };
const PADDING: Record<ControlSize, string> = {
  small: 'var(--space-1) var(--space-1-5)',
  medium: 'var(--space-1-5) var(--space-2)',
  large: 'var(--space-2)',
};

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  label?: string;
  error?: string;
  size?: ControlSize;
  style?: CSSProperties;
}

export function Textarea({ label, error, placeholder = 'Placeholder', size = 'medium', disabled, style, ...rest }: TextareaProps) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const resolved = disabled ? 'disabled' : focus ? 'focused' : hover ? 'hover' : error ? 'error' : 'default';
  return (
    <Field label={label} error={error} style={{ alignSelf: 'stretch', ...style }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          height: HEIGHTS[size],
          padding: PADDING[size],
          borderRadius: 'var(--rounded-lg)',
          overflow: 'hidden',
          display: 'flex',
          gap: 'var(--space-1-5)',
          alignItems: 'flex-start',
          alignSelf: 'stretch',
          ...fieldVisual(resolved),
        }}
      >
        <textarea
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            ...textControl,
            height: '100%',
            resize: 'none',
            color: disabled ? 'var(--grey-400)' : 'var(--grey-900)',
            WebkitTextFillColor: disabled ? 'var(--grey-400)' : undefined,
          }}
          {...rest}
        />
      </div>
    </Field>
  );
}
