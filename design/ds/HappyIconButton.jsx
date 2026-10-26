/* Happy design system — IconButton, copied from the design system's
   components/actions/IconButton.jsx and packaged for <x-import>
   (module.exports instead of ESM). The only change: `icon` takes the URL of an
   icon asset, inlined so its strokes inherit the button's currentColor. */
const R = (typeof React !== 'undefined' ? React : window.React);

const SIZES = { small: 28, medium: 32, large: 36 };
const PADDING = { small: '4px 8px', medium: '6px 8px', large: '8px 10px' };
const RING = { small: 'var(--focused-primary-50)', medium: 'var(--focused-primary-50)', large: 'var(--focused-primary-50)' };

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

function IconButton({ icon, size = 'medium', state, onClick, title, tooltip, style, ...rest }) {
  const wrapRef = R.useRef(null);
  const [hover, setHover] = R.useState(false);
  const [focus, setFocus] = R.useState(false);
  const resolved = state || (focus ? 'focused' : hover ? 'hover' : 'default');
  const dim = SIZES[size] || SIZES.medium;
  const iconSvg = useInlineSvg(icon);
  let visual = { background: 'transparent', boxShadow: 'none', opacity: 1 };
  if (resolved === 'hover') visual = { background: 'var(--grey-100)', boxShadow: 'none', opacity: 1 };
  if (resolved === 'focused') {
    const ring = RING[size];
    visual = {
      background: 'var(--white)',
      boxShadow: ring === 'none' ? 'var(--hairline-focus)' : `var(--hairline-focus), ${ring}`,
      opacity: 1,
    };
  }
  if (resolved === 'disabled') visual = { background: 'transparent', boxShadow: 'none', opacity: 0.5 };
  const btn = (
    <button
      type="button"
      title={title}
      aria-label={tooltip}
      disabled={resolved === 'disabled'}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        appearance: 'none',
        border: 'none',
        width: dim,
        height: dim,
        padding: PADDING[size] || PADDING.medium,
        borderRadius: 'var(--rounded-lg)',
        display: 'inline-flex',
        gap: 'var(--space-1)',
        justifyContent: 'center',
        alignItems: 'center',
        color: resolved === 'hover' ? 'var(--grey-900)' : resolved === 'default' ? 'var(--grey-500)' : 'var(--grey-600)',
        cursor: resolved === 'disabled' ? 'not-allowed' : 'pointer',
        ...visual,
        ...style,
      }}
      {...rest}
    >
      <span aria-hidden="true" style={{ flexShrink: 0, width: 18, height: 18, display: 'inline-flex' }} dangerouslySetInnerHTML={{ __html: iconSvg }} />
    </button>
  );
  if (!tooltip) return btn;
  const RD = window.ReactDOM;
  const rect = hover && resolved !== 'disabled' && wrapRef.current ? wrapRef.current.getBoundingClientRect() : null;
  const tip = rect ? (
    <span role="tooltip" style={{ position: 'fixed', top: rect.top - 6, left: rect.left + rect.width / 2, transform: 'translate(-50%, -100%)', zIndex: 10000, padding: '4px 8px', borderRadius: 'var(--rounded-md)', background: 'var(--grey-900)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', lineHeight: '16px', fontWeight: 'var(--font-medium)', whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: 'var(--shadow-popover)' }}>{tooltip}</span>
  ) : null;
  return (
    <span ref={wrapRef} style={{ position: 'relative', display: 'inline-flex' }}>
      {btn}
      {tip && RD && RD.createPortal ? RD.createPortal(tip, document.body) : tip}
    </span>
  );
}

module.exports = { IconButton };
