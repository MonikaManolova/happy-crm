import { forwardRef, useImperativeHandle, useRef, useState, type CSSProperties, type InputHTMLAttributes } from 'react';
import type { ControlSize } from './Button';
import { Field, fieldVisual, textControl } from './Field';

/* Happy design system — Input (components/forms/Input.jsx). `icon` is an
   asset URL. */

const SIZES: Record<ControlSize, { height: number; padding: string }> = {
  small: { height: 28, padding: 'var(--space-1) var(--space-1-5)' },
  medium: { height: 32, padding: 'var(--space-1-5) var(--space-2)' },
  large: { height: 36, padding: 'var(--space-2)' },
};

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'style'> {
  label?: string;
  error?: string;
  icon?: string;
  size?: ControlSize;
  style?: CSSProperties;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, icon, placeholder = 'Placeholder', size = 'medium', disabled, style, onFocus, onBlur, ...rest },
  ref,
) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  const resolved = disabled ? 'disabled' : focus ? 'focused' : hover ? 'hover' : error ? 'error' : 'default';
  const s = SIZES[size];
  return (
    <Field label={label} error={error} style={{ alignSelf: 'stretch', width: '100%', ...style }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseDown={(e) => {
          if (!disabled && e.target !== inputRef.current) {
            e.preventDefault();
            inputRef.current?.focus();
          }
        }}
        style={{
          height: s.height,
          padding: s.padding,
          borderRadius: 'var(--rounded-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          gap: 'var(--space-1-5)',
          alignItems: 'center',
          alignSelf: 'stretch',
          ...fieldVisual(resolved),
        }}
      >
        {icon ? <img src={icon} alt="" width={16} height={16} style={{ flexShrink: 0 }} /> : null}
        <input
          ref={inputRef}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={(e) => {
            setFocus(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            onBlur?.(e);
          }}
          style={{
            ...textControl,
            color: disabled ? 'var(--grey-400)' : 'var(--grey-900)',
            WebkitTextFillColor: disabled ? 'var(--grey-400)' : undefined,
          }}
          {...rest}
        />
      </div>
    </Field>
  );
});
