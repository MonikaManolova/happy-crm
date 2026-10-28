import { useState } from 'react';
import { icon } from '../../lib/assets';
import { Button } from '../ds/Button';
import { IconButton } from '../ds/IconButton';
import { HorizontalTabs } from '../ds/Tabs';

/** Sample count until signals come from the backend. */
const SIGNAL_COUNT = 2;

/**
 * "Контролен панел" (Figma 997:19146): the EditOrder page's left panel, with
 * signal and tracking tabs and RK log shortcuts. Tab contents come later.
 */
export function ControlPanel() {
  const [tab, setTab] = useState(0);
  return (
    <aside
      aria-label="Контролен панел"
      style={{
        width: 400,
        flexShrink: 0,
        alignSelf: 'stretch',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--white)',
        borderRight: '1px solid var(--grey-200)',
        boxShadow: '0px 2px 6px 0px rgba(0,0,0,0.02)',
      }}
    >
      <div style={{ height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '10px 14px' }}>
        <h2 style={{ margin: 0, flex: '1 0 0', minWidth: 0, fontWeight: 600, fontSize: 16, lineHeight: '24px', color: 'var(--grey-900)' }}>Контролен панел</h2>
        {/* Not wired yet: meant to collapse the panel. */}
        <IconButton size="small" icon={icon('LucidePanelLeftClose')} tooltip="Скрий панела" tooltipPlacement="bottom-end" />
      </div>

      <div style={{ flex: '1 0 0', minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: '0 16px' }}>
        <HorizontalTabs
          fill
          label="Контролен панел"
          items={[
            { label: 'Сигнали', icon: 'LucideTriangleAlert', count: SIGNAL_COUNT },
            { label: 'Проследяване', icon: 'LucideHistory' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      <div style={{ flexShrink: 0, borderTop: '1px solid var(--grey-200)', padding: 8, display: 'flex', gap: 'var(--space-1-5)' }}>
        <Button type="outline" size="medium">
          RK Log
        </Button>
        <Button type="outline" size="medium">
          RK Log Browser
        </Button>
      </div>
    </aside>
  );
}
