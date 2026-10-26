import React from 'react';
import { Icon } from '../icons/Icon.jsx';
import { Field } from './Input.jsx';

const SIZES = {
  small: { height: 28, padding: '4px 6px' },
  medium: { height: 32, padding: '6px 8px' },
  large: { height: 36, padding: '8px 8px' },
};

/* Select draws its border as a 0.5px inset + 0.5px outset pair, exactly as the
   source does — a slightly finer hairline than Input's 1px. */
function selectVisual(state) {
  const hair = (c) => `inset 0 0 0 0.5px ${c}, 0 0 0 0.5px ${c}`;
  if (state === 'hover') return { background: 'var(--white)', boxShadow: `${hair('var(--grey-300)')}, var(--shadow-control)` };
  if (state === 'focused') return { background: 'var(--white)', boxShadow: `${hair('var(--primary-400)')}, var(--shadow-control)` };
  if (state === 'disabled') return { background: 'var(--grey-50)', boxShadow: `${hair('var(--grey-200)')}, var(--shadow-control)` };
  return { background: 'var(--white)', boxShadow: `${hair('var(--grey-200)')}, var(--shadow-control)` };
}

export function Select({
  label,
  error,
  placeholder = 'Select',
  value,
  size = 'medium',
  state,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const resolved = state || (hover ? 'hover' : 'default');
  const s = SIZES[size] || SIZES.medium;
  const filled = value != null && value !== '';
  return (
    <Field label={label} error={error} style={{ alignSelf: 'stretch', ...style }}>
      <div
        role="button"
        tabIndex={resolved === 'disabled' ? -1 : 0}
        onClick={resolved === 'disabled' ? undefined : onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          height: s.height,
          padding: s.padding,
          borderRadius: 'var(--rounded-lg)',
          display: 'flex',
          flexDirection: 'row',
          gap: 'var(--space-1)',
          alignItems: 'center',
          alignSelf: 'stretch',
          cursor: resolved === 'disabled' ? 'default' : 'pointer',
          outline: 'none',
          ...selectVisual(resolved),
        }}
        {...rest}
      >
        <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', alignItems: 'center', padding: '0 var(--space-0-5)' }}>
          <span
            style={{
              flexGrow: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-normal)',
              lineHeight: 'var(--leading-5)',
              color: filled ? 'var(--grey-900)' : 'var(--grey-400)',
            }}
          >
            {filled ? value : placeholder}
          </span>
        </div>
        <Icon name="LucideChevronDown" size={14} style={{ flexShrink: 0, color: 'var(--grey-600)' }} />
      </div>
    </Field>
  );
}

export default Select;
