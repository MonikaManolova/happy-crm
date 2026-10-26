/* Happy design system — Radio + Checkbox, copied verbatim from the design system's
   components/forms/Checkbox.jsx and Radio.jsx, packaged for <x-import>. */
const R = (typeof React !== 'undefined' ? React : window.React);

const SHADOW = '0px 0.5px 2px 0px rgba(0,0,0,0.05)';
const T = 'background-color 150ms, box-shadow 150ms, color 150ms';

function choiceBoxStyle({ kind, on, state }) {
  const ring = state === 'focused' ? ', var(--focused-primary-50)' : '';
  const disabled = state === 'disabled';
  const hover = state === 'hover';
  if (kind === 'radio') {
    const c = disabled ? 'var(--primary-300)' : hover ? 'var(--primary-700)' : 'var(--primary-500)';
    const off = disabled ? 'var(--grey-200)' : hover ? 'var(--grey-400)' : 'var(--grey-300)';
    return {
      width: 16, height: 16, borderRadius: 100, flexShrink: 0, boxSizing: 'border-box',
      background: disabled && !on ? 'var(--grey-50)' : 'var(--white)',
      boxShadow: `inset 0 0 0 ${on ? 5 : 1}px ${on ? c : off}, ${SHADOW}${ring}`,
      transition: T,
    };
  }
  const bg = on ? (disabled ? 'var(--primary-300)' : hover ? 'var(--primary-700)' : 'var(--primary-500)') : disabled ? 'var(--grey-50)' : 'var(--white)';
  const border = on ? '' : `inset 0 0 0 1px ${disabled ? 'var(--grey-200)' : hover ? 'var(--grey-400)' : 'var(--grey-300)'}, `;
  return {
    width: 16, height: 16, borderRadius: 4, flexShrink: 0, boxSizing: 'border-box', position: 'relative',
    background: bg, color: 'var(--white)', boxShadow: `${border}${SHADOW}${ring}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: T,
  };
}

function ChoiceRow({ kind, checked, defaultChecked, onChange, label, description, disabled, state, name, value, style, children, ...rest }) {
  const controlled = checked != null;
  const [inner, setInner] = R.useState(!!defaultChecked);
  const on = controlled ? !!checked : inner;
  const [hover, setHover] = R.useState(false);
  const [focus, setFocus] = R.useState(false);
  const isDisabled = disabled || state === 'disabled';
  const resolved = state || (isDisabled ? 'disabled' : focus ? 'focused' : hover ? 'hover' : 'default');
  const toggle = (e) => {
    if (isDisabled) return;
    const next = kind === 'radio' ? true : !on;
    if (!controlled) setInner(next);
    if (onChange) onChange(next, e);
  };
  return (
    <label
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 'var(--space-2)', cursor: isDisabled ? 'not-allowed' : 'pointer', userSelect: 'none', ...style }}
      {...rest}
    >
      <input
        type={kind}
        name={name}
        value={value}
        checked={on}
        disabled={isDisabled}
        onChange={toggle}
        onFocus={(e) => { if (e.target.matches(':focus-visible')) setFocus(true); }}
        onBlur={() => setFocus(false)}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1, margin: 0, pointerEvents: 'none' }}
      />
      <span style={{ height: 20, display: 'flex', alignItems: 'center' }}>
        <span style={choiceBoxStyle({ kind, on, state: resolved })}>
          {kind === 'checkbox' ? (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" style={{ opacity: on ? 1 : 0, transform: on ? 'scale(1)' : 'scale(0.6)', transition: 'opacity 150ms, transform 150ms' }}>
              <path d="M 9.69 0.276 C 10.09 0.657 10.105 1.29 9.724 1.69 L 4.01 7.69 C 3.821 7.888 3.559 8 3.286 8 C 3.012 8 2.75 7.888 2.562 7.69 L 0.276 5.29 C -0.105 4.89 -0.09 4.257 0.31 3.876 C 0.71 3.495 1.343 3.51 1.724 3.91 L 3.286 5.55 L 8.276 0.31 C 8.657 -0.09 9.29 -0.105 9.69 0.276 Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          ) : null}
        </span>
      </span>
      {label || description || children ? (
        <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {label || children ? (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', lineHeight: 'var(--leading-5)', color: isDisabled ? 'var(--grey-400)' : 'var(--grey-600)', transition: 'color 150ms' }}>{label || children}</span>
          ) : null}
          {description ? (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-normal)', lineHeight: 'var(--leading-5)', color: isDisabled ? 'var(--grey-400)' : 'var(--grey-600)' }}>{description}</span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}

function Checkbox(props) {
  return <ChoiceRow kind="checkbox" {...props} />;
}


function Radio(props) {
  return <ChoiceRow kind="radio" {...props} />;
}

module.exports = { Radio, Checkbox, ChoiceRow, choiceBoxStyle };
