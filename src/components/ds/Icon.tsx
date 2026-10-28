import type { CSSProperties } from 'react';
import { resolveIcon } from './Button';
import { useInlineSvg } from './useInlineSvg';

/** An icon from public/assets/icons, inlined so it takes `color` (default: the surrounding text colour). */
export function Icon({ icon, size = 18, color, style }: { icon: string; size?: number; color?: string; style?: CSSProperties }) {
  const svg = useInlineSvg(resolveIcon(icon));
  return (
    <span
      aria-hidden="true"
      style={{ flexShrink: 0, width: size, height: size, display: 'inline-flex', color, ...style }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
