/* Happy design system — Dropdown + ListItem + Select, copied from the design system's
   components/overlays/Dropdown.jsx and ListItem.jsx and packaged for <x-import>
   (module.exports instead of ESM). Changes: the search Input and the ListItem
   icon are inlined here (same markup/values as ds/HappyInput.jsx and the DS
   ListItem) so the file is standalone, and `icon` takes an asset URL rather
   than a DS Icon name. Last synced from the design system. */
const R = (typeof React !== 'undefined' ? React : window.React);

const hair = (c) => `inset 0 0 0 0.5px ${c}, 0 0 0 0.5px ${c}`;

function SearchInput({ value, onChange, placeholder }) {
  const [hover, setHover] = R.useState(false);
  const [focus, setFocus] = R.useState(false);
  const visual = focus
    ? { background: 'var(--white)', boxShadow: `${hair('var(--primary-400)')}, var(--shadow-control), var(--focused-primary-50)` }
    : hover
      ? { background: 'var(--white)', boxShadow: `${hair('var(--grey-300)')}, var(--shadow-control)` }
      : { background: 'var(--white)', boxShadow: `${hair('var(--grey-200)')}, var(--shadow-control)` };
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: 32,
        padding: 'var(--space-1-5) var(--space-2)',
        borderRadius: 'var(--rounded-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        gap: 'var(--space-1-5)',
        alignItems: 'center',
        alignSelf: 'stretch',
        ...visual,
      }}
    >
      <img src="assets/icons/LucideSearch-a3.svg" alt="" width={16} height={16} style={{ flexShrink: 0 }} />
      <input
        value={value}
        placeholder={placeholder}
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
      />
    </div>
  );
}

function ListItem({ label = 'Item', icon, avatar, type = 'default', state = 'default', onClick, style, ...rest }) {
  const [hover, setHover] = R.useState(false);
  const resolved = state === 'hover' || hover ? 'hover' : 'default';
  const isAvatar = type === 'avatar';
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: 32,
        borderRadius: 'var(--rounded-lg)',
        background: resolved === 'hover' ? 'var(--grey-100)' : 'var(--white)',
        padding: isAvatar ? '4px 6px' : '6px 8px',
        display: 'flex',
        flexDirection: 'row',
        gap: isAvatar ? 'var(--space-1-5)' : 'var(--space-2)',
        alignItems: 'center',
        alignSelf: 'stretch',
        cursor: 'pointer',
        ...style,
      }}
      {...rest}
    >
      {isAvatar ? (
        <img src={avatar} alt="" style={{ width: 24, height: 24, borderRadius: 'var(--rounded-full)', objectFit: 'cover', flexShrink: 0 }} />
      ) : icon ? (
        <img src={icon} alt="" width={18} height={18} style={{ flexShrink: 0 }} />
      ) : null}
      <span
        style={{
          flexGrow: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          fontWeight: isAvatar ? 'var(--font-medium)' : 'var(--font-normal)',
          lineHeight: 'var(--leading-5)',
          color: 'var(--grey-900)',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Dropdown({
  items = [],
  groups,
  footerItems = [],
  search = true,
  searchPlaceholder = 'Търси по име',
  onSelect,
  width = 280,
  style,
  ...rest
}) {
  const [query, setQuery] = R.useState('');
  const bands = groups && groups.length ? groups : [items];
  const norm = (it) => (typeof it === 'string' ? { label: it } : it);
  const match = (it) => !query || (norm(it).label || '').toLowerCase().includes(query.toLowerCase());
  return (
    <div
      style={{
        width,
        minWidth: width,
        flexShrink: 0,
        borderRadius: 'var(--rounded-xl)',
        background: 'var(--white)',
        boxShadow: 'var(--hairline), var(--shadow-popover)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      {search ? (
        <div style={{ padding: 'var(--space-2) var(--space-2) 0 var(--space-2)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'stretch' }}>
          <SearchInput value={query} placeholder={searchPlaceholder} onChange={(e) => setQuery(e.target.value)} />
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'stretch' }}>
        {bands.map((band, b) => (
          <div
            key={b}
            style={{
              padding: 'var(--space-2)',
              borderTop: b > 0 ? '1px solid var(--grey-200)' : undefined,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              alignSelf: 'stretch',
            }}
          >
            {(band || []).filter(match).map((raw, i) => {
              const it = norm(raw);
              return (
                <ListItem
                  key={(it.label || '') + i}
                  label={it.label}
                  icon={it.icon}
                  avatar={it.avatar}
                  type={it.avatar ? 'avatar' : 'default'}
                  onClick={() => onSelect && onSelect(it.label, i)}
                />
              );
            })}
          </div>
        ))}
        {footerItems.map((raw, i) => {
          const it = norm(raw);
          return (
            <div
              key={(it.label || '') + i}
              style={{ borderTop: '1px solid var(--grey-200)', padding: 'var(--space-2)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'stretch' }}
            >
              <ListItem label={it.label} icon={it.icon} onClick={() => onSelect && onSelect(it.label, -1 - i)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}


const SELECT_SIZES = {
  small: { height: 28, padding: 'var(--space-1) var(--space-1-5)' },
  medium: { height: 32, padding: 'var(--space-1-5) var(--space-2)' },
  large: { height: 36, padding: 'var(--space-2)' },
};

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

/* Select draws its border as a 0.5px inset + 0.5px outset pair, exactly as the
   source does — a slightly finer hairline than Input's 1px. */
function selectVisual(state) {
  if (state === 'hover') return { background: 'var(--white)', boxShadow: `${hair('var(--grey-300)')}, var(--shadow-control)` };
  if (state === 'focused') return { background: 'var(--white)', boxShadow: `${hair('var(--primary-400)')}, var(--shadow-control), var(--focused-primary-50)` };
  if (state === 'disabled') return { background: 'var(--grey-50)', boxShadow: `${hair('var(--grey-200)')}, var(--shadow-control)` };
  if (state === 'error') return { background: 'var(--white)', boxShadow: `${hair('var(--danger-400)')}, var(--shadow-control)` };
  return { background: 'var(--white)', boxShadow: `${hair('var(--grey-200)')}, var(--shadow-control)` };
}

function Select({
  label,
  error,
  placeholder = 'Select',
  value,
  size = 'medium',
  state,
  onClick,
  options,
  search = true,
  searchPlaceholder,
  footerItems,
  onSelect,
  /* local extension: the DS Select always drops its menu below the trigger;
     'top' flips it above, for triggers sitting at the bottom of a panel. */
  menuPlacement = 'bottom',
  style,
  ...rest
}) {
  const [hover, setHover] = R.useState(false);
  const [open, setOpen] = R.useState(false);
  const [picked, setPicked] = R.useState(null);
  const wrapRef = R.useRef(null);
  const hasMenu = Array.isArray(options) && options.length > 0;
  const resolved = state || (open ? 'focused' : hover ? 'hover' : error ? 'error' : 'default');
  const s = SELECT_SIZES[size] || SELECT_SIZES.medium;
  const shown = value != null && value !== '' ? value : picked;
  const filled = shown != null && shown !== '';
  R.useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);
  return (
    <Field label={label} error={error} style={{ alignSelf: 'stretch', ...style }}>
      <div ref={wrapRef} style={{ position: 'relative', alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
        <div
          role="button"
          tabIndex={resolved === 'disabled' ? -1 : 0}
          onClick={resolved === 'disabled' ? undefined : (e) => { if (hasMenu) setOpen((o) => !o); if (onClick) onClick(e); }}
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
                color: resolved === 'disabled' || !filled ? 'var(--grey-400)' : 'var(--grey-900)',
              }}
            >
              {filled ? shown : placeholder}
            </span>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 120ms ease', color: resolved === 'hover' ? 'var(--grey-900)' : 'var(--grey-600)' }}
          >
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </div>
        {hasMenu && open ? (
          <Dropdown
            items={options}
            footerItems={footerItems}
            search={search}
            searchPlaceholder={searchPlaceholder}
            width="100%"
            style={
              menuPlacement === 'top'
                ? { position: 'absolute', bottom: 'calc(100% + var(--space-1))', left: 0, zIndex: 20 }
                : { position: 'absolute', top: 'calc(100% + var(--space-1))', left: 0, zIndex: 20 }
            }
            onSelect={(label, i) => { setPicked(label); setOpen(false); if (onSelect) onSelect(label, i); }}
          />
        ) : null}
      </div>
    </Field>
  );
}

module.exports = { Dropdown, ListItem, Select, Field };
