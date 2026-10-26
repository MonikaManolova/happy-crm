/* Happy design system — Textarea, copied from the design system's
   components/forms/Textarea.jsx and packaged for <x-import>. Field and
   fieldVisual are inlined copies of Input.jsx's exports. */
const R = (typeof React !== 'undefined' ? React : window.React);

const HEIGHTS = { small: 68, medium: 72, large: 76 };
const PADDING = { small: 'var(--space-1) var(--space-1-5)', medium: 'var(--space-1-5) var(--space-2)', large: 'var(--space-2)' };

const hair = (c) => `inset 0 0 0 0.5px ${c}, 0 0 0 0.5px ${c}`;

function fieldVisual(state) {
  if (state === 'hover') return { background: 'var(--white)', boxShadow: `${hair('var(--grey-300)')}, var(--shadow-control)` };
  if (state === 'focused') return { background: 'var(--white)', boxShadow: `${hair('var(--primary-400)')}, var(--shadow-control), var(--focused-primary-50)` };
  if (state === 'disabled') return { background: 'var(--grey-50)', boxShadow: `${hair('var(--grey-200)')}, var(--shadow-control)` };
  if (state === 'error') return { background: 'var(--white)', boxShadow: `${hair('var(--danger-400)')}, var(--shadow-control)` };
  return { background: 'var(--white)', boxShadow: `${hair('var(--grey-200)')}, var(--shadow-control)` };
}

function Field({ label, error, children, style }) {
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

function Textarea({ label, error, placeholder = 'Placeholder', value, onChange, size = 'medium', state, style, ...rest }) {
  const [hover, setHover] = R.useState(false);
  const [focus, setFocus] = R.useState(false);
  const resolved = state || (focus ? 'focused' : hover ? 'hover' : error ? 'error' : 'default');
  const disabled = resolved === 'disabled';
  return (
    <Field label={label} error={error} style={{ alignSelf: 'stretch', ...style }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          height: HEIGHTS[size] || HEIGHTS.medium,
          padding: PADDING[size] || PADDING.medium,
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
            height: '100%',
            resize: 'none',
            appearance: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-normal)',
            lineHeight: 'var(--leading-5)',
            color: disabled ? 'var(--grey-400)' : 'var(--grey-900)',
            WebkitTextFillColor: disabled ? 'var(--grey-400)' : undefined,
          }}
          {...rest}
        />
      </div>
    </Field>
  );
}

module.exports = { Textarea, Field, fieldVisual };
