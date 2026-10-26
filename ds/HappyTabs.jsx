/* Happy design system — HorizontalTabs + TabButton, copied from components/navigation/HorizontalTabs.jsx
   and packaged for <x-import>. Icon support dropped (not used here). */
const R = (typeof React !== 'undefined' ? React : window.React);
const SIZES = {
  small: { height: 28, padding: '4px 8px' },
  medium: { height: 32, padding: '6px 8px' },
  large: { height: 36, padding: '8px 10px' },
};
function TabButton({ label = 'Tab', size = 'medium', state = 'default', onClick, style, ...rest }) {
  const [hover, setHover] = R.useState(false);
  const resolved = state === 'active' ? 'active' : hover ? 'hover' : state;
  const s = SIZES[size] || SIZES.medium;
  const active = resolved === 'active';
  return R.createElement('button', {
    type: 'button', onClick,
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: {
      appearance: 'none', border: active ? '1px solid var(--grey-200)' : '1px solid transparent', boxSizing: 'border-box', font: 'inherit', height: s.height, padding: s.padding,
      borderRadius: 'var(--rounded-lg)', background: active ? 'var(--white)' : 'transparent',
      boxShadow: active ? 'var(--shadow-control)' : 'none',
      color: resolved === 'default' ? 'var(--grey-600)' : 'var(--grey-900)',
      display: 'inline-flex', gap: 'var(--space-1)', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
      fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', lineHeight: 'var(--leading-5)',
      whiteSpace: 'nowrap', flexShrink: 0, transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease', ...style,
    },
    ...rest,
  }, R.createElement('span', { style: { display: 'flex', alignItems: 'center', padding: '0 var(--space-0-5)' } }, label));
}
function HorizontalTabs({ items = [], value, onChange, size = 'medium', style, ...rest }) {
  return R.createElement('div', {
    style: { borderRadius: 'var(--rounded-lg)', background: 'var(--grey-50)', boxShadow: 'var(--hairline), var(--shadow-control)', display: 'inline-flex', flexDirection: 'row', gap: 'var(--space-0-5)', alignItems: 'center', maxWidth: '100%', overflowX: 'auto', flexShrink: 0, alignSelf: 'flex-start', ...style },
    ...rest,
  }, items.map((it, i) => {
    const key = it.value != null ? it.value : i;
    return R.createElement(TabButton, { key, label: it.label, size, state: value === key ? 'active' : 'default', onClick: () => onChange && onChange(key) });
  }));
}
module.exports = { HorizontalTabs, TabButton };
