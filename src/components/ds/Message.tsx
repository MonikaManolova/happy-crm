import type { ReactNode } from 'react';
import { icon } from '../../lib/assets';
import { IconButton } from './IconButton';

/* Happy design system — Message (components/feedback/Message.jsx). */

export type MessageType = 'info' | 'warning' | 'error';

const svg = (children: ReactNode) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const TYPES: Record<MessageType, { border: string; surface: string; iconColor: string; icon: ReactNode }> = {
  info: {
    border: 'var(--info-200)',
    surface: 'var(--info-50)',
    iconColor: 'var(--info-600)',
    // Lucide info
    icon: svg(
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </>,
    ),
  },
  warning: {
    border: '#FFD8A8',
    surface: '#FFF6EB',
    iconColor: 'var(--warning-600)',
    // Lucide triangle-alert
    icon: svg(
      <>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>,
    ),
  },
  error: {
    border: 'var(--danger-200)',
    surface: 'var(--danger-50)',
    iconColor: 'var(--danger-500)',
    // Lucide ban
    icon: svg(
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m4.9 4.9 14.2 14.2" />
      </>,
    ),
  },
};

export interface MessageProps {
  type?: MessageType;
  title: ReactNode;
  subtitle?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Message({ type = 'info', title, subtitle, dismissible = true, onDismiss }: MessageProps) {
  const t = TYPES[type];
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      style={{
        alignSelf: 'stretch',
        borderRadius: 10,
        background: 'var(--white)',
        border: `1px solid ${t.border}`,
        boxShadow: 'var(--shadow-control)',
        padding: 2,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-2)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          borderRadius: 'var(--rounded-lg)',
          background: t.surface,
          padding: 'var(--space-2)',
          display: 'flex',
          gap: 'var(--space-2)',
          alignItems: 'flex-start',
          flexGrow: 1,
          alignSelf: 'stretch',
        }}
      >
        <div style={{ width: 20, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, color: t.iconColor }}>{t.icon}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-0-5)', alignItems: 'flex-start', flexGrow: 1 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', lineHeight: 'var(--leading-5)', color: 'var(--grey-900)' }}>
            {title}
          </span>
          {subtitle ? (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-normal)', lineHeight: 'var(--leading-4)', color: 'var(--grey-700)' }}>
              {subtitle}
            </span>
          ) : null}
        </div>
        {dismissible ? <IconButton icon={icon('LucideX-a3')} size="small" tooltip="Затвори" onClick={onDismiss} style={{ flexShrink: 0 }} /> : null}
      </div>
    </div>
  );
}
