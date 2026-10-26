import { useId } from 'react';

/** Orange "НОВО" corner ribbon on new dishes. */
export function NewRibbon() {
  // Gradient and filter ids must be unique per card.
  const id = useId().replace(/:/g, '');
  return (
    <div style={{ position: 'absolute', left: -4, top: -4, width: 51, height: 51, pointerEvents: 'none' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="51" height="51" viewBox="0 0 51 51" fill="none" style={{ position: 'absolute', left: 0, top: 0 }}>
        <g filter={`url(#inner-${id})`}>
          <path
            d="M23.2602 1.77494C24.3854 0.649719 25.9116 0.0175781 27.5029 0.0175781H50.0176L0.0175781 50.0176V27.5029C0.0175781 25.9116 0.649719 24.3854 1.77494 23.2602L23.2602 1.77494Z"
            fill={`url(#fill-${id})`}
          />
        </g>
        <defs>
          <filter id={`inner-${id}`} x="0" y="-2" width="50.0599" height="52.06" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="-2" />
            <feGaussianBlur stdDeviation="1.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.999023 0 0 0 0 0.999023 0 0 0 0 0.999023 0 0 0 0.34 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
          </filter>
          <linearGradient id={`fill-${id}`} x1="27.5176" y1="23.0176" x2="13.0176" y2="8.01758" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D97708" />
            <stop offset="1" stopColor="#F59E09" />
          </linearGradient>
        </defs>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none" style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d="M4 46V50H-5.96046e-08L4 46Z" fill="#92400D" />
        <path d="M50 0V4H46L50 0Z" fill="#92400D" />
      </svg>
      <span
        style={{
          position: 'absolute',
          left: 2,
          top: 2,
          width: 51,
          height: 51,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(-45deg)',
          transformOrigin: 'center',
          fontWeight: 700,
          fontSize: 12,
          lineHeight: '16px',
          color: '#FFFFFF',
          letterSpacing: 0.2,
          whiteSpace: 'nowrap',
          paddingBottom: 24,
        }}
      >
        НОВО
      </span>
    </div>
  );
}
