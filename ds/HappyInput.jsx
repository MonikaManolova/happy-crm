/* Happy design system — Input (with its Field wrapper), copied from the design
   system's components/forms/Input.jsx and packaged for <x-import>
   (module.exports instead of ESM). The only change: `icon` takes the URL of an
   icon asset rather than a DS Icon name, so it can render the Figma file's own
   SVG exports. Last synced from the design system. */
const R = (typeof React !== 'undefined' ? React : window.React);

const SIZES = {
  small: { height: 28, padding: 'var(--space-1) var(--space-1-5)' },
  medium: { height: 32, padding: 'var(--space-1-5) var(--space-2)' },
  large: { height: 36, padding: 'var(--space-2)' },
};

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

function Input({
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
  const [hover, setHover] = R.useState(false);
  const [focus, setFocus] = R.useState(false);
  const resolved = state || (focus ? 'focused' : hover ? 'hover' : error ? 'error' : 'default');
  const s = SIZES[size] || SIZES.medium;
  const disabled = resolved === 'disabled';
  const inputRef = R.useRef(null);
  return (
    <Field label={label} error={error} style={{ alignSelf: 'stretch', width: '100%', ...style }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseDown={(e) => { if (!disabled && e.target !== inputRef.current) { e.preventDefault(); inputRef.current && inputRef.current.focus(); } }}
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
            color: disabled ? 'var(--grey-400)' : 'var(--grey-900)',
            WebkitTextFillColor: disabled ? 'var(--grey-400)' : undefined,
          }}
          {...rest}
        />
      </div>
    </Field>
  );
}

module.exports = { Input, Field, fieldVisual };
