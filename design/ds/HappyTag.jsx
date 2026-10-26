/* Happy design system — Tag, copied from components/data-display/Tag.jsx and
   packaged for <x-import> (module.exports instead of ESM). The only change:
   `icon` takes the URL of an icon asset rather than a DS Icon name. */
const R = (typeof React !== 'undefined' ? React : window.React);

const COLORS = {
  grey: { background: 'var(--tag-wash-grey)', border: 'var(--grey-200)', color: 'var(--grey-600)' },
  primary: { background: 'var(--tag-wash-primary)', border: 'var(--primary-100)', color: 'var(--primary-500)' },
  red: { background: 'var(--tag-wash-red)', border: 'var(--danger-100)', color: 'var(--danger-500)' },
  yellow: { background: 'var(--tag-wash-yellow)', border: 'var(--warning-200)', color: 'var(--warning-700)' },
  blue: { background: 'var(--tag-wash-blue)', border: 'var(--info-100)', color: 'var(--info-600)' },
  purple: { background: 'var(--tag-wash-purple)', border: 'var(--purple-200)', color: 'var(--purple-600)' },
};

const SIZES = {
  small: { height: 20, font: 'var(--text-xs)', line: 'var(--leading-4)', icon: 16 },
  medium: { height: 24, font: 'var(--text-sm)', line: 'var(--leading-5)', icon: 18 },
};

function Tag({ color = 'grey', size = 'medium', icon, children = 'Tag', style, ...rest }) {
  const c = COLORS[color] || COLORS.grey;
  const s = SIZES[size] || SIZES.medium;
  return R.createElement(
    'span',
    {
      style: {
        height: s.height,
        borderRadius: 'var(--rounded-md)',
        background: c.background,
        boxShadow: `inset 0 0 0 1px ${c.border}`,
        color: c.color,
        display: 'inline-flex',
        flexDirection: 'row',
        gap: 'var(--space-0-5)',
        padding: '2px 4px',
        alignItems: 'center',
        ...style,
      },
      ...rest,
    },
    icon ? R.createElement('img', { src: icon, alt: '', width: s.icon, height: s.icon, style: { flexShrink: 0 } }) : null,
    R.createElement(
      'span',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 var(--space-0-5)',
          fontFamily: 'var(--font-body)',
          fontSize: s.font,
          fontWeight: 'var(--font-medium)',
          lineHeight: s.line,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
      children
    )
  );
}

module.exports = { Tag, default: Tag };
