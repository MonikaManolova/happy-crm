/* Happy design system — TextButton, copied from the design system's
   components/actions/TextButton.jsx and packaged for <x-import>
   (module.exports instead of ESM). The only change: `icon` takes the URL of an
   icon asset rather than a DS Icon name. */
const R = (typeof React !== 'undefined' ? React : window.React);

function visual(state) {
  if (state === 'hover') return { color: 'var(--grey-900)', textDecoration: 'underline' };
  if (state === 'disabled') return { color: 'var(--grey-400)', textDecoration: 'none' };
  return { color: 'var(--grey-600)', textDecoration: 'none' };
}

const SVG_CACHE = {};

/* Inlines the icon file so its strokes inherit the button's currentColor,
   the way the DS Icon component does. */
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

function TextButton({ state, icon, children, onClick, style, ...rest }) {
  const [hover, setHover] = R.useState(false);
  const iconSvg = useInlineSvg(icon);
  const resolved = state || (hover ? 'hover' : 'default');
  const disabled = resolved === 'disabled';
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        padding: 0,
        height: 20,
        display: 'inline-flex',
        flexDirection: 'row',
        gap: 'var(--space-1)',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        lineHeight: 'var(--leading-5)',
        whiteSpace: 'nowrap',
        ...visual(resolved),
        ...style,
      }}
      {...rest}
    >
      {icon ? (
        <span
          aria-hidden="true"
          style={{ flexShrink: 0, width: 18, height: 18, display: 'inline-flex', color: disabled ? 'currentColor' : 'var(--primary-500)' }}
          dangerouslySetInnerHTML={{ __html: iconSvg }}
        />
      ) : null}
      {children != null ? (
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-0-5)', textDecoration: 'inherit' }}>{children}</span>
      ) : null}
    </button>
  );
}

module.exports = { TextButton };
