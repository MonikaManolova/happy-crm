/* Happy design system — Chip, copied verbatim from the design system's
   components/actions/Chip.jsx and packaged for <x-import> (module.exports
   instead of ESM). The only change: `icon` takes the URL of an icon asset
   rather than a DS Icon name, so it can render the file's own SVG exports. */
const R = (typeof React !== 'undefined' ? React : window.React);

const SIZES = {
  small: { height: 28, padding: '4px 8px' },
  medium: { height: 32, padding: '6px 8px' },
  large: { height: 36, padding: '8px 10px' },
};

function Chip({ size = 'medium', state, iconOnly = false, icon, children, onClick, style, ...rest }) {
  const [hover, setHover] = R.useState(false);
  const resolved = state || (hover ? 'hover' : 'default');
  const s = SIZES[size] || SIZES.medium;
  let visual = { background: 'var(--grey-100)', boxShadow: 'none', color: 'var(--grey-900)' };
  if (resolved === 'hover') visual = { background: 'var(--grey-200)', boxShadow: 'none', color: 'var(--grey-900)' };
  if (resolved === 'active') {
    visual = {
      background: 'var(--success-50)',
      boxShadow: 'var(--hairline-focus), var(--shadow-control)',
      color: 'var(--primary-600)',
    };
  }
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        appearance: 'none',
        border: 'none',
        font: 'inherit',
        height: s.height,
        width: iconOnly ? s.height : undefined,
        padding: s.padding,
        borderRadius: 'var(--rounded-lg)',
        display: 'inline-flex',
        gap: 'var(--space-1)',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 'var(--leading-5)',
        whiteSpace: 'nowrap',
        ...visual,
        ...style,
      }}
      {...rest}
    >
      {icon ? <img src={icon} alt="" width={18} height={18} style={{ flexShrink: 0 }} /> : null}
      {!iconOnly && children != null ? (
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-0-5)' }}>{children}</span>
      ) : null}
    </button>
  );
}

module.exports = { Chip };
