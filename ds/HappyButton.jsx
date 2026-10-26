/* Happy design system — Button, copied from the design system's
   components/actions/Button.jsx and packaged for <x-import>. `icon` /
   `trailingIcon` take icon-asset URLs, inlined so strokes inherit currentColor. */
const R = (typeof React !== 'undefined' ? React : window.React);

const SIZES = {
  small: { height: 28, padding: 'var(--space-1) var(--space-2)' },
  medium: { height: 32, padding: 'var(--space-1-5) var(--space-2)' },
  large: { height: 36, padding: 'var(--space-2) var(--space-2-5)' },
};

const SVG_CACHE = {};

function useInlineSvg(url) {
  const [markup, setMarkup] = R.useState(url ? SVG_CACHE[url] || '' : '');
  R.useEffect(() => {
    if (!url) return;
    if (SVG_CACHE[url]) { setMarkup(SVG_CACHE[url]); return; }
    let alive = true;
    fetch(url)
      .then((r) => r.text())
      .then((t) => {
        const cleaned = t
          .replace(/<\?xml[^>]*\?>/g, '')
          .replace(/<metadata[\s\S]*?<\/metadata>/g, '')
          .replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"')
          .replace(/fill="(?!none)#[^"]*"/g, 'fill="currentColor"')
          .replace(/<svg([^>]*)>/, '<svg$1 width="100%" height="100%">');
        SVG_CACHE[url] = cleaned;
        if (alive) setMarkup(cleaned);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [url]);
  return markup;
}

function visual(type, state) {
  if (type === 'solid') {
    const base = { background: 'var(--primary-600)', color: 'var(--white)', boxShadow: 'var(--shadow-control)' };
    if (state === 'hover') return { ...base, background: 'var(--primary-500)' };
    if (state === 'focused') return { ...base, boxShadow: 'var(--shadow-control), var(--focused-primary-200)' };
    if (state === 'disabled') return { ...base, opacity: 0.5 };
    return base;
  }
  const base = { background: 'var(--white)', color: 'var(--grey-900)', boxShadow: 'var(--hairline), var(--shadow-control)' };
  if (state === 'hover') return { ...base, background: 'var(--grey-50)', boxShadow: 'var(--hairline-strong), var(--shadow-control)' };
  if (state === 'focused') return { ...base, boxShadow: 'var(--hairline-focus), var(--shadow-control), var(--focused-primary-50)' };
  if (state === 'disabled') return { ...base, background: 'var(--grey-50)', color: 'var(--grey-400)' };
  return base;
}

function Button({
  type = 'solid',
  size = 'medium',
  state,
  iconOnly = false,
  icon,
  trailingIcon,
  children,
  onClick,
  style,
  tooltip,
  ...rest
}) {
  if (typeof icon === 'string' && !/[\/.]/.test(icon)) icon = 'assets/icons/' + icon + '.svg';
  const [hover, setHover] = R.useState(false);
  const [focus, setFocus] = R.useState(false);
  const wrapRef = R.useRef(null);
  const resolved = state || (focus ? 'focused' : hover ? 'hover' : 'default');
  const s = SIZES[size] || SIZES.medium;
  const disabled = resolved === 'disabled';
  const iconColor = type !== 'solid' && resolved === 'default' ? 'var(--grey-500)' : undefined;
  const iconSvg = useInlineSvg(icon);
  const trailingSvg = useInlineSvg(trailingIcon);
  const btn = (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={iconOnly ? tooltip : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        appearance: 'none',
        border: 'none',
        font: 'inherit',
        height: s.height,
        width: iconOnly ? s.height : undefined,
        padding: s.padding,
        borderRadius: 'var(--rounded-lg)',
        display: 'inline-flex',
        flexDirection: 'row',
        gap: 'var(--space-1)',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 'var(--leading-5)',
        whiteSpace: 'nowrap',
        ...visual(type, resolved),
        ...style,
      }}
      {...rest}
    >
      {icon ? <span aria-hidden="true" style={{ flexShrink: 0, width: 18, height: 18, display: 'inline-flex', color: iconColor }} dangerouslySetInnerHTML={{ __html: iconSvg }} /> : null}
      {!iconOnly && children != null ? (
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-0-5)' }}>{children}</span>
      ) : null}
      {!iconOnly && trailingIcon ? <span aria-hidden="true" style={{ flexShrink: 0, width: 18, height: 18, display: 'inline-flex', color: iconColor }} dangerouslySetInnerHTML={{ __html: trailingSvg }} /> : null}
    </button>
  );
  if (!tooltip) return btn;
  const RD = window.ReactDOM;
  const rect = hover && wrapRef.current ? wrapRef.current.getBoundingClientRect() : null;
  const tip = rect && !disabled ? (
    <span role="tooltip" style={{ position: 'fixed', top: rect.top - 6, left: rect.right, transform: 'translate(-100%, -100%)', zIndex: 10000, padding: '4px 8px', borderRadius: 'var(--rounded-md)', background: 'var(--grey-900)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', lineHeight: '16px', fontWeight: 'var(--font-medium)', whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: 'var(--shadow-popover)' }}>{tooltip}</span>
  ) : null;
  return (
    <span ref={wrapRef} style={{ position: 'relative', display: 'inline-flex' }}>
      {btn}
      {tip && RD && RD.createPortal ? RD.createPortal(tip, document.body) : tip}
    </span>
  );
}

module.exports = { Button };
