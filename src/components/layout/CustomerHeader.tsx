import { Fragment, useState, type CSSProperties } from 'react';
import { ADDRESSES, CUSTOMER } from '../../data/app';
import { icon } from '../../lib/assets';
import { Icon } from '../ds/Icon';
import { AddressModal } from './AddressModal';

const crumb: CSSProperties = { fontWeight: 500, fontSize: 14, lineHeight: '20px', whiteSpace: 'nowrap' };
const meta: CSSProperties = { fontWeight: 500, fontSize: 12, lineHeight: '16px', color: '#525252', whiteSpace: 'nowrap' };
const control = 'inset 0 0 0 0.5px #E5E5E5,0 0 0 0.5px #E5E5E5,0 0.5px 2px 0 rgba(0,0,0,0.05)';
const ellipsis: CSSProperties = { fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#171717', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };

/** Down arrow of the header selects; darkens when its select is hovered (see .header-select). */
function SelectChevron() {
  return (
    <span className="select-chevron" style={{ display: 'flex', flexShrink: 0 }}>
      <Icon icon="LucideChevronDown-s" size={14} />
    </span>
  );
}

function ContactPill({ iconName, text }: { iconName: string; text: string }) {
  return (
    <div style={{ height: 24, display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
      <div style={{ width: 24, height: 24, borderRadius: 26, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <img src={icon(iconName)} alt="" style={{ width: 14, height: 14 }} />
      </div>
      <span style={meta}>{text}</span>
    </div>
  );
}

function BrandButton({ label, iconName, background, color = '#FFFFFF', outline }: { label: string; iconName: string; background: string; color?: string; outline?: boolean }) {
  return (
    <button
      type="button"
      className={outline ? 'hover-outline' : undefined}
      style={{
        appearance: 'none',
        border: 'none',
        font: 'inherit',
        height: 36,
        borderRadius: 8,
        background,
        boxShadow: outline ? 'inset 0 0 0 1px #E5E5E5,0 0.5px 2px 0 rgba(0,0,0,0.05)' : '0 0.5px 2px 0 rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'row',
        gap: 4,
        padding: '8px 10px',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <img src={icon(iconName)} alt="" style={{ width: 18, height: 18 }} />
      <span style={{ display: 'flex', padding: '0 2px', fontWeight: 500, fontSize: 14, lineHeight: '20px', color, whiteSpace: 'nowrap' }}>{label}</span>
    </button>
  );
}

export interface PageHeader {
  /** Breadcrumb trail; the last item is the current page. */
  breadcrumb: string[];
  /** Page title. Without one, the client's name is the title. */
  title?: string;
  /** Show the "Сигнал" action. */
  signal?: boolean;
}

export function CustomerHeader({ header }: { header: PageHeader }) {
  const [addressId, setAddressId] = useState(ADDRESSES[0].id);
  const [addressOpen, setAddressOpen] = useState(false);
  // Choice inside the open modal; applied only on "Запази".
  const [draft, setDraft] = useState<number | null>(addressId);
  const address = ADDRESSES.find((a) => a.id === addressId)?.label ?? '';

  return (
    <section
      aria-label="Клиент"
      style={{
        position: 'relative',
        height: 140,
        flexShrink: 0,
        alignSelf: 'stretch',
        background: 'radial-gradient(883.488px 125.848px at 66.79% -6.39%, rgba(219,234,254,0.8) 0%, rgba(219,254,248,0) 100%), #FFFFFF',
        border: '1px solid #E5E5E5',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '16px 24px',
      }}
    >
      <div style={{ height: 108, display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center', alignItems: 'flex-start' }}>
        {/* Breadcrumb (Figma 531:5997): earlier items --grey-400, the current one --grey-900. */}
        <nav aria-label="Път" style={{ height: 20, display: 'flex', flexDirection: 'row', gap: 'var(--space-1-5)', alignItems: 'center' }}>
          {header.breadcrumb.map((item, i) => {
            const current = i === header.breadcrumb.length - 1;
            return (
              <Fragment key={item}>
                {i > 0 ? (
                  <span aria-hidden="true" style={{ fontWeight: 500, fontSize: 12, lineHeight: '16px', color: 'var(--grey-400)' }}>
                    /
                  </span>
                ) : null}
                <span aria-current={current ? 'page' : undefined} style={{ ...crumb, color: current ? 'var(--grey-900)' : 'var(--grey-400)', cursor: current ? undefined : 'pointer' }}>
                  {item}
                </span>
              </Fragment>
            );
          })}
        </nav>

        <div style={{ height: 76, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{ height: 36, alignSelf: 'stretch', display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <div style={{ height: 32, display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', flexGrow: 1 }}>
              {header.title ? (
                <h1 style={{ margin: 0, fontWeight: 600, fontSize: 20, lineHeight: '32px', color: '#171717', whiteSpace: 'nowrap', flexShrink: 0 }}>{header.title}</h1>
              ) : (
                <div style={{ height: 32, display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'flex-start', flexShrink: 0 }}>
                  <h1 style={{ margin: 0, fontWeight: 600, fontSize: 20, lineHeight: '32px', color: '#171717', whiteSpace: 'nowrap' }}>{CUSTOMER.name}</h1>
                  <button
                    type="button"
                    aria-label="Редактирай клиента"
                    className="hover-grey"
                    style={{ appearance: 'none', border: 'none', background: 'transparent', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
                  >
                    <img src={icon('LucidePencil-g5')} alt="" style={{ width: 18, height: 18 }} />
                  </button>
                </div>
              )}
              <div style={{ height: 24, display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                {header.title ? (
                  <>
                    <Icon icon="LucideChevronsRight" size={18} color="var(--grey-500)" />
                    {/* The client, secondary to the page title (Figma 937:4775). */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', paddingRight: 'var(--space-1)' }}>
                      <div style={{ width: 24, height: 24, borderRadius: 26, background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon icon="LucideUserRound" size={14} color="var(--primary-600)" />
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: 'var(--grey-900)', whiteSpace: 'nowrap' }}>{CUSTOMER.name}</span>
                    </div>
                  </>
                ) : null}
                <div style={{ height: 24, borderRadius: 26, boxShadow: 'inset 0 0 0 1px #66C27F', display: 'flex', flexDirection: 'row', gap: 4, padding: '4px 10px 4px 8px', alignItems: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 9999, background: '#CCE6D1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#33A556' }} />
                  </div>
                  <span style={meta}>{CUSTOMER.status}</span>
                </div>
                <ContactPill iconName="LucidePhone-s" text={CUSTOMER.phone} />
                <ContactPill iconName="LucideMail-s" text={CUSTOMER.email} />
              </div>
            </div>

            <div style={{ height: 36, display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
              <BrandButton label="Captain Cook" iconName="CaptainCookSymbol-w" background="#015388" />
              <BrandButton label="Burrata" iconName="BurrataSymbol-w" background="#262626" />
              <BrandButton label="Pickup" iconName="LucideStore-s" background="#FFFFFF" color="#171717" outline />
              <button
                type="button"
                aria-label="Още"
                className="hover-outline"
                style={{ appearance: 'none', border: 'none', width: 36, height: 36, borderRadius: 8, background: '#FFFFFF', boxShadow: 'inset 0 0 0 1px #E5E5E5,0 0.5px 2px 0 rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
              >
                <img src={icon('LucideEllipsis-s')} alt="" style={{ width: 18, height: 18 }} />
              </button>
            </div>
          </div>

          <div style={{ height: 32, display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'flex-end' }}>
            <button
              type="button"
              className="header-select"
              aria-haspopup="dialog"
              aria-label={`Адрес за доставка: ${address}`}
              onClick={() => {
                setDraft(addressId);
                setAddressOpen(true);
              }}
              style={{ appearance: 'none', border: 'none', font: 'inherit', textAlign: 'left', width: 342, height: 32, borderRadius: 8, background: '#FFFFFF', boxShadow: control, display: 'flex', flexDirection: 'row', gap: 4, padding: '6px 8px 6px 6px', alignItems: 'center', cursor: 'pointer' }}
            >
              <div style={{ height: 20, borderRadius: 6, background: '#E6F3E8', display: 'flex', alignItems: 'center', padding: '0 6px', flexShrink: 0 }}>
                <span style={{ fontWeight: 500, fontSize: 12, lineHeight: '16px', color: '#006612', whiteSpace: 'nowrap' }}>До адрес</span>
              </div>
              <div style={{ display: 'flex', padding: '0 2px', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
                <span style={ellipsis}>{address}</span>
              </div>
              <SelectChevron />
            </button>
            <button
              type="button"
              className="header-select"
              aria-label={`Ресторант: ${CUSTOMER.restaurant}`}
              style={{ appearance: 'none', border: 'none', font: 'inherit', textAlign: 'left', width: 172, height: 32, borderRadius: 8, background: '#FFFFFF', boxShadow: control, display: 'flex', flexDirection: 'row', gap: 4, padding: '6px 8px', alignItems: 'center', cursor: 'pointer' }}
            >
              <img src={icon('HappySymbol-r')} alt="" style={{ width: 18, height: 18, flexShrink: 0 }} />
              <div style={{ display: 'flex', padding: '0 2px', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
                <span style={ellipsis}>{CUSTOMER.restaurant}</span>
              </div>
              <SelectChevron />
            </button>
            <div style={{ width: 177, height: 32, borderRadius: 8, background: '#E6F3E8', display: 'flex', flexDirection: 'row', gap: 4, padding: '6px 8px', alignItems: 'center' }}>
              <img src={icon('LucideClock4-gd')} alt="" style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span style={{ display: 'flex', padding: '0 2px', fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#015410', whiteSpace: 'nowrap' }}>{CUSTOMER.deliveryEta}</span>
            </div>
            {header.signal ? (
              // "Сигнал" (Figma 1092:75445): plain markup on purpose, not a design-system Button.
              <button type="button" className="signal-button">
                <Icon icon="LucideTriangleAlert" size={18} />
                Сигнал
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {addressOpen ? (
        <AddressModal
          addresses={ADDRESSES}
          selected={draft}
          onSelect={setDraft}
          onSave={() => {
            if (draft != null) setAddressId(draft);
          }}
          onClose={() => setAddressOpen(false)}
        />
      ) : null}
    </section>
  );
}
