import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { SIGNALS, type Signal } from '../../data/signals';
import { icon } from '../../lib/assets';
import { Button } from '../ds/Button';
import { Dropdown } from '../ds/Dropdown';
import { IconButton } from '../ds/IconButton';
import { HorizontalTabs } from '../ds/Tabs';
import { SignalCard } from './SignalCard';
import { TrackingTimeline } from './TrackingTimeline';

const EXPANDED_WIDTH = 400;
/** 48px rail + the 1px right border (Figma 1078:73917). */
const COLLAPSED_WIDTH = 49;
const ANIM_MS = 240;
/** The rail's buttons vanish quickly on expand, so they don't linger over the opening panel. */
const RAIL_HIDE_MS = 80;

const RK_LOGS = ['RK Log', 'RK Log Browser'];

const SIGNALS_TAB = 0;
const TRACKING_TAB = 1;

/** Keeps a hidden layer out of the tab order and the accessibility tree. */
function Layer({ hidden, hideMs = ANIM_MS, style, children }: { hidden: boolean; hideMs?: number; style: CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.toggleAttribute('inert', hidden);
  }, [hidden]);
  return (
    <div ref={ref} aria-hidden={hidden} style={{ opacity: hidden ? 0 : 1, transition: `opacity ${hidden ? hideMs : ANIM_MS}ms ease-out`, pointerEvents: hidden ? 'none' : undefined, ...style }}>
      {children}
    </div>
  );
}

/** The rail's "Настройки" button: opens the RK log shortcuts beside the rail. */
function SettingsMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const away = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!buttonRef.current?.contains(t) && !menuRef.current?.contains(t)) setMenuOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [menuOpen]);

  // The rail clips its overflow, so the menu is portalled and pinned next to the button, bottom-aligned.
  const rect = menuOpen ? buttonRef.current?.getBoundingClientRect() : undefined;
  return (
    <div ref={buttonRef} style={{ display: 'flex' }}>
      <Button
        type="outline"
        size="medium"
        iconOnly
        icon="LucideSettings"
        tooltip={menuOpen ? undefined : 'Настройки'}
        tooltipPlacement="right"
        aria-label="Настройки"
        aria-haspopup="listbox"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      />
      {rect
        ? createPortal(
            <div ref={menuRef} style={{ position: 'fixed', left: rect.right + 6, bottom: window.innerHeight - rect.bottom, zIndex: 30 }}>
              <Dropdown items={RK_LOGS} search={false} width={200} onSelect={() => setMenuOpen(false)} />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

/**
 * "Контролен панел" (Figma 997:19146): the EditOrder page's left panel, with
 * the courier signals (with replies), a tracking tab and RK log shortcuts.
 * It collapses to a 48px icon rail (Figma 1078:73917); a rail button opens
 * the panel on its tab.
 */
export function ControlPanel() {
  const [tab, setTab] = useState(SIGNALS_TAB);
  const [signals, setSignals] = useState<Signal[]>(SIGNALS);
  // Starts as the rail and expands once it has been painted, so landing on the page animates it open.
  const [collapsed, setCollapsed] = useState(true);
  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setCollapsed(false));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const open = (t?: number) => {
    if (t != null) setTab(t);
    setCollapsed(false);
  };

  return (
    <aside
      aria-label="Контролен панел"
      className="control-panel"
      style={{
        position: 'relative',
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        transition: `width ${ANIM_MS}ms ease-out`,
        overflow: 'hidden',
        flexShrink: 0,
        alignSelf: 'stretch',
        minHeight: 0,
        background: 'var(--white)',
        borderRight: '1px solid var(--grey-200)',
        boxShadow: '0px 2px 6px 0px rgba(0,0,0,0.02)',
      }}
    >
      {/* Expanded panel, at its full width so nothing reflows while the width animates. */}
      <Layer hidden={collapsed} style={{ width: EXPANDED_WIDTH - 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '10px 14px' }}>
          <h2 style={{ margin: 0, flex: '1 0 0', minWidth: 0, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: 'var(--grey-900)' }}>Контролен панел</h2>
          <IconButton size="small" icon={icon('LucidePanelLeftClose')} tooltip="Скрий панела" tooltipPlacement="right" onClick={() => setCollapsed(true)} />
        </div>

        <div style={{ flex: '1 0 0', minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: '0 16px 16px' }}>
          <HorizontalTabs
            fill
            label="Контролен панел"
            items={[
              { label: 'Сигнали', icon: 'LucideTriangleAlert', count: signals.length },
              { label: 'Проследяване', icon: 'LucideHistory' },
            ]}
            value={tab}
            onChange={setTab}
          />
          {tab === SIGNALS_TAB
            ? signals.map((s) => (
                <SignalCard key={s.id} signal={s} onReply={(reply) => setSignals((list) => list.map((x) => (x.id === s.id ? { ...x, reply } : x)))} />
              ))
            : <TrackingTimeline />}
        </div>

        <div style={{ flexShrink: 0, borderTop: '1px solid var(--grey-200)', padding: 8, display: 'flex', gap: 'var(--space-1-5)' }}>
          {RK_LOGS.map((label) => (
            <Button key={label} type="outline" size="medium">
              {label}
            </Button>
          ))}
        </div>
      </Layer>

      {/* Collapsed icon rail. */}
      <Layer hidden={!collapsed} hideMs={RAIL_HIDE_MS} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: COLLAPSED_WIDTH - 1, display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
        <div style={{ flexShrink: 0, borderBottom: '1px solid var(--grey-200)', padding: 8 }}>
          <IconButton size="medium" icon={icon('LucidePanelLeftOpen')} tooltip="Разпъни панела" tooltipPlacement="right" onClick={() => open()} />
        </div>
        <div style={{ flex: '1 0 0', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', padding: 8 }}>
          <div style={{ position: 'relative', display: 'flex' }}>
            <Button type="outline" size="medium" iconOnly icon="LucideTriangleAlert" tooltip="Сигнали" tooltipPlacement="right" aria-label={`Сигнали (${signals.length})`} onClick={() => open(SIGNALS_TAB)} />
            {signals.length ? (
              <span
                aria-hidden="true"
                className={collapsed ? 'signal-badge-pulse' : undefined}
                style={{
                  position: 'absolute',
                  zIndex: 0,
                  top: -4,
                  right: -4,
                  minWidth: 16,
                  height: 16,
                  padding: '1px 4px 0',
                  borderRadius: 'var(--rounded-2xl)',
                  background: 'var(--warning-600)',
                  color: 'var(--white)',
                  fontWeight: 600,
                  fontSize: 12,
                  lineHeight: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                {signals.length}
              </span>
            ) : null}
          </div>
          <Button type="outline" size="medium" iconOnly icon="LucideHistory" tooltip="Проследяване" tooltipPlacement="right" onClick={() => open(TRACKING_TAB)} />
        </div>
        <div style={{ flexShrink: 0, borderTop: '1px solid var(--grey-200)', padding: 8 }}>
          {collapsed ? <SettingsMenu /> : null}
        </div>
      </Layer>
    </aside>
  );
}
