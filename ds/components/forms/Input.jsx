import React from 'react';
import { Icon } from '../icons/Icon.jsx';

const SIZES = {
  small: { height: 28, padding: '4px 6px' },
  medium: { height: 32, padding: '6px 8px' },
  large: { height: 36, padding: '8px 8px' },
};

export function fieldVisual(state) {
  if (state === 'hover') return { background: 'var(--white)', boxShadow: 'var(--hairline-strong), var(--shadow-control)' };
  if (state === 'focused') return { background: 'var(--white)', boxShadow: 'var(--hairline-focus), var(--shadow-control)' };
  if (state === 'disabled') return { background: 'var(--grey-50)', boxShadow: 'var(--hairline), var(--shadow-control)' };
  return { background: 'var(--white)', boxShadow: 'var(--hairline), var(--shadow-control)' };
}

export function Field({ label, error, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', alignItems: 'flex-start', ...style }}>
      {label ? (
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-normal)', lineHeight: 'var(--leading-4)', color: 'var(--grey-600)' }}>{label}</span>
      ) : null}
      {children}
      {error ? (
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-normal)', lineHeight: 'var(--leading-4)', color: 'var(--danger-400)' }}>{error}</span>
      ) : null}
    </div>
  );
}

export function Input({
  label,
  error,
  icon,
  placeholder = 'Placeholder',
  value,
  onChange,
  size = 'medium',
  state,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const resolved = state || (focus ? 'focused' : hover ? 'hover' : 'default');
  const s = SIZES[size] || SIZES.medium;
  const disabled = resolved === 'disabled';
  return (
    <Field label={label} error={error} style={{ alignSelf: 'stretch', ...style }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
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
        {icon ? <Icon name={icon} size={16} style={{ flexShrink: 0, color: 'var(--grey-400)' }} /> : null}
        <input
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={value != null && !onChange}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flexGrow: 1,
            minWidth: 0,
            appearance: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-normal)',
            lineHeight: 'var(--leading-5)',
            color: 'var(--grey-900)',
          }}
          {...rest}
        />
      </div>
    </Field>
  );
}

export default Input;
