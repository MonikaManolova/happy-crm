import { EXPECTED_DELIVERY, TRACKING, type TrackingStatus, type TrackingStep } from '../../data/tracking';
import { Button } from '../ds/Button';
import { Icon } from '../ds/Icon';

const STATUS_LABEL: Record<TrackingStatus, string> = { done: 'Завършено', active: 'В процес', pending: 'Предстои' };

function StepMarker({ status }: { status: TrackingStatus }) {
  if (status === 'done') {
    return (
      <span style={{ width: 24, height: 24, flexShrink: 0, borderRadius: 'var(--rounded-3xl)', background: 'var(--primary-500)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon icon="LucideCheck" size={14} />
      </span>
    );
  }
  if (status === 'active') {
    // A partly drawn ring: the step is under way.
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="11" fill="none" stroke="var(--primary-500)" strokeWidth="1.5" strokeLinecap="round" pathLength="100" strokeDasharray="55 100" transform="rotate(-90 12 12)" />
      </svg>
    );
  }
  return <span style={{ width: 24, height: 24, flexShrink: 0, borderRadius: 'var(--rounded-3xl)', border: '1px solid var(--grey-300)' }} />;
}

function Step({ step }: { step: TrackingStep }) {
  const pending = step.status === 'pending';
  return (
    <li style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'stretch', padding: '6px var(--space-1-5) 6px 0' }}>
      <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <StepMarker status={step.status} />
        <span style={{ flex: '1 0 0', width: 1, background: 'var(--grey-300)' }} />
      </div>
      <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: 24 }}>
          <span style={{ flex: '1 0 0', minWidth: 0, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: pending ? 'var(--grey-600)' : 'var(--grey-900)' }}>
            {step.title}
            <span className="sr-only">, {STATUS_LABEL[step.status]}</span>
          </span>
          {step.trackable ? (
            <Button type="outline" size="small">
              Проследи
            </Button>
          ) : null}
          {step.time ? <span style={{ flexShrink: 0, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: 'var(--grey-900)', whiteSpace: 'nowrap' }}>{step.time}</span> : null}
        </div>
        <span style={{ fontSize: 14, lineHeight: '20px', color: 'var(--grey-600)' }}>{step.detail}</span>
      </div>
    </li>
  );
}

/** "Проследяване" tab of the control panel (Figma 1123:8487): expected delivery and the order's steps. */
export function TrackingTimeline() {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: '8px 10px', borderRadius: 8, background: 'var(--success-50)', border: '1px solid var(--primary-50)', color: 'var(--primary-700)', fontSize: 14, lineHeight: '20px' }}>
        <Icon icon="LucideClock4" size={18} />
        <span style={{ display: 'flex', gap: 6, padding: '0 2px', whiteSpace: 'nowrap' }}>
          Очаквана доставка: <strong style={{ fontWeight: 600 }}>{EXPECTED_DELIVERY}</strong>
        </span>
      </div>
      <ol aria-label="Етапи на поръчката" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
        {TRACKING.map((step) => (
          <Step key={step.title} step={step} />
        ))}
      </ol>
    </>
  );
}
