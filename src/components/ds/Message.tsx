/* Happy design system — Message (components/feedback/Message.jsx), the
   non-dismissible warning variant used by the order panel. */

export function WarningMessage({ title }: { title: string }) {
  return (
    <div
      role="status"
      style={{
        borderRadius: 10,
        background: 'var(--white)',
        border: '1px solid #FFD8A8',
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
          background: '#FFF6EB',
          padding: 'var(--space-2)',
          display: 'flex',
          gap: 'var(--space-2)',
          alignItems: 'flex-start',
          flexGrow: 1,
          alignSelf: 'stretch',
        }}
      >
        <div style={{ width: 20, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, color: 'var(--warning-600)' }}>
          {/* Lucide triangle-alert */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            lineHeight: 'var(--leading-5)',
            color: 'var(--grey-900)',
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}
