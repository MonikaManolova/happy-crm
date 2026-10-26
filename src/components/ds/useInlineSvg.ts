import { useEffect, useState } from 'react';

const SVG_CACHE: Record<string, string> = {};

/* Fetches an icon file and inlines it so its strokes and fills inherit the
   surrounding currentColor, the way the design system's Icon component does. */
export function useInlineSvg(url?: string) {
  const [markup, setMarkup] = useState(url ? SVG_CACHE[url] || '' : '');
  useEffect(() => {
    if (!url) return;
    if (SVG_CACHE[url]) {
      setMarkup(SVG_CACHE[url]);
      return;
    }
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
    return () => {
      alive = false;
    };
  }, [url]);
  return markup;
}
