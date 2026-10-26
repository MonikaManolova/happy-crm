import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { DEFAULT_ADDONS, DEFAULT_INGREDIENTS, DIY_CATS, DIY_IMG, HALVES, SAMPLE_RECIPE } from '../../data/menu';
import type { Dish, OptionGroup } from '../../data/types';
import { asset, icon } from '../../lib/assets';
import type { LineConfig } from '../../lib/cart';
import { detailUnitPrice, eur, priceOf, stripPrice } from '../../lib/pricing';
import { Chip } from '../ds/Chip';
import { Dropdown } from '../ds/Dropdown';
import { IconButton } from '../ds/IconButton';
import { HorizontalTabs } from '../ds/Tabs';
import { Tag } from '../ds/Tag';
import { ChefHatIcon } from '../order/icons';
import { Allergens } from './Allergens';
import { OptionPanel } from './OptionPanel';

/** Option groups of a dish: explicit groups, or its single card option list. */
export function groupsOf(d: Dish): OptionGroup[] {
  if (d.groups) return d.groups;
  if (d.options) return [{ label: d.optionLabel || 'Гарнитура', options: d.options }];
  return [];
}

export interface DetailInit {
  qty?: number;
  picked?: string[];
  addons?: string[];
  removed?: string[];
  /** Set when editing an existing cart line. */
  editKey?: string;
}

export interface DishDetailModalProps {
  dish: Dish;
  init: DetailInit;
  /** Option currently chosen on the dish's card. */
  cardPick?: string;
  onSubmit: (config: LineConfig, qty: number, editKey?: string) => void;
  onClose: () => void;
}

type Picks = Record<string, boolean>;
const toPicks = (list: string[] = []): Picks => Object.fromEntries(list.map((k) => [k, true]));
const fromPicks = (p: Picks) => Object.keys(p).filter((k) => p[k]);

const ANIM_MS = 200;

export function DishDetailModal({ dish, init, cardPick, onSubmit, onClose }: DishDetailModalProps) {
  const groups = groupsOf(dish);
  const [sel, setSel] = useState<(number | undefined)[]>(() =>
    groups.map((g, i) => {
      const fromInit = init.picked ? g.options.indexOf(init.picked[i]) : -1;
      if (fromInit >= 0) return fromInit;
      if (dish.groups) return dish.defaults?.[i];
      const p = cardPick ? g.options.indexOf(cardPick) : -1;
      return p >= 0 ? p : 0;
    }),
  );
  const [qty, setQty] = useState(init.qty ?? 1);
  const [add, setAdd] = useState<Picks>(() => toPicks(init.addons));
  const [rm, setRm] = useState<Picks>(() => toPicks(init.removed));
  const [panelOpen, setPanelOpen] = useState<Record<string, boolean>>({});
  const [diyTab, setDiyTab] = useState(0);
  const [halfMenu, setHalfMenu] = useState<number | null>(null);
  const [shown, setShown] = useState(false);

  // Fade/slide in on the frame after mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  const close = () => {
    setShown(false);
    setHalfMenu(null);
    setTimeout(onClose, ANIM_MS);
  };

  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, []);

  const picked = groups.map((g, i) => (sel[i] != null ? g.options[sel[i] as number] : undefined)).filter((x): x is string => !!x);
  const addons = fromPicks(add);
  const removed = fromPicks(rm);
  const ready = groups.every((_, i) => typeof sel[i] === 'number');
  const unit = detailUnitPrice(dish, picked, addons);
  const pick = (gi: number, i: number) => setSel((s) => Object.assign([...s], { [gi]: i }));

  const submit = () => {
    if (!ready) return;
    onSubmit({ dishId: dish.id, picked, addons, removed }, qty, init.editKey);
    close();
  };

  const togglePick = (setter: typeof setAdd, items: string[], single?: boolean) => (label: string) =>
    setter((cur) => {
      const next = { ...cur };
      const was = !!next[label];
      if (single) items.forEach((x) => delete next[x]);
      next[label] = !was;
      return next;
    });

  const panel = (id: string, title: string, items: string[], target: 'add' | 'rm', opts: { thumb?: string; single?: boolean } = {}) => (
    <OptionPanel
      key={id}
      title={title}
      thumb={opts.thumb}
      items={items}
      single={opts.single}
      open={!!panelOpen[id]}
      onToggleOpen={() => setPanelOpen((p) => ({ ...p, [id]: !p[id] }))}
      isOn={(l) => !!(target === 'add' ? add : rm)[l]}
      onToggleItem={togglePick(target === 'add' ? setAdd : setRm, items, opts.single)}
    />
  );

  const doughIndex = dish.split ? 2 : 0;
  const dough =
    dish.split || dish.diy ? (
      <div style={{ flexShrink: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#525252' }}>{groups[doughIndex].label}</span>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 'var(--space-1-5)' }}>
          {groups[doughIndex].options.map((o, i) => (
            <Chip key={o} size="medium" active={sel[doughIndex] === i} onClick={() => pick(doughIndex, i)}>
              {o}
            </Chip>
          ))}
        </div>
      </div>
    ) : null;

  let body: ReactNode;
  if (dish.split) {
    const halves = [0, 1].map((gi) => {
      const g = groups[gi];
      const opt = g.options[sel[gi] ?? 0];
      const name = stripPrice(opt);
      const h = HALVES[name];
      const flip = h?.side !== (gi === 0 ? 'L' : 'R');
      return { gi, g, name, h, flip, price: eur(priceOf(opt)) };
    });
    body = (
      <>
        <div style={{ flexShrink: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'row', gap: 2 }}>
          {halves.map(({ gi, h, flip }) => (
            <div key={gi} style={{ flex: '1 1 0', minWidth: 0, height: 240, overflow: 'hidden', background: '#F5F5F5', borderRadius: gi === 0 ? '10px 0 0 10px' : '0 10px 10px 0', display: 'flex', padding: '8px 0' }}>
              <img
                src={h?.img}
                alt=""
                width={508}
                height={480}
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: (gi === 0) !== flip ? 'right center' : 'left center', transform: flip ? 'scaleX(-1)' : 'none' }}
              />
            </div>
          ))}
        </div>
        <div style={{ flexShrink: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'row', gap: 12 }}>
          {halves.map(({ gi, g, name, price }) => (
            <div key={gi} style={{ flex: '1 1 0', minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column', gap: 2, alignItems: gi === 0 ? 'flex-start' : 'flex-end' }}>
              <span style={{ fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#737373' }}>{g.label}</span>
              <button
                type="button"
                className="hover-half-name"
                aria-haspopup="listbox"
                aria-expanded={halfMenu === gi}
                onClick={(e) => {
                  e.stopPropagation();
                  setHalfMenu(halfMenu === gi ? null : gi);
                }}
                style={{ appearance: 'none', border: 'none', background: 'transparent', font: 'inherit', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '2px 4px', margin: '0 -4px', borderRadius: 8, transition: 'background 140ms ease-out, color 140ms ease-out', color: '#525252' }}
              >
                <span style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#171717', whiteSpace: 'nowrap' }}>{name}</span>
                <span style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#018017', whiteSpace: 'nowrap' }}>{price}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="m7 15 5 5 5-5" />
                  <path d="m7 9 5-5 5 5" />
                </svg>
              </button>
              {halfMenu === gi ? (
                <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '100%', marginTop: 4, [gi === 0 ? 'left' : 'right']: 0, zIndex: 20, display: 'flex' }}>
                  <Dropdown
                    items={g.options.map((o) => stripPrice(o) + ' ' + eur(priceOf(o)))}
                    searchPlaceholder="Търси пица"
                    width={240}
                    onSelect={(_, i) => {
                      pick(gi, i);
                      setHalfMenu(null);
                    }}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div style={{ flexShrink: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'row', gap: 8 }}>
          {halves.map(({ gi, h }) => (
            <div key={gi} style={{ flex: '1 1 0', minWidth: 0, borderRadius: 10, background: '#FAFAFA', boxShadow: 'inset 0 0 0 1px #F5F5F5', display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                <ChefHatIcon size={20} style={{ color: '#33A556' }} />
                <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#171717' }}>Съставки</span>
              </div>
              <span style={{ flexGrow: 1, minHeight: 60, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#525252' }}>{h?.ingredients}</span>
              <Allergens />
            </div>
          ))}
        </div>
        {dough}
      </>
    );
  } else if (dish.diy) {
    body = (
      <>
        <div style={{ flexShrink: 0, alignSelf: 'stretch', height: 240, borderRadius: 10, overflow: 'hidden', background: '#FAFAFA', display: 'flex', padding: '12px 0' }}>
          <img src={dish.modalImg || dish.img} alt="" width={1024} height={480} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <TitleRow title={dish.title} price={eur(unit)} style={{ alignItems: 'center', gap: 12, paddingTop: 4 }} />
        <HorizontalTabs items={DIY_CATS.map((c) => c.label)} value={diyTab} onChange={setDiyTab} style={{ flexShrink: 0, maxWidth: '100%' }} />
        <div style={{ flexShrink: 0, alignSelf: 'stretch', display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 8 }}>
          {DIY_CATS[diyTab].items.map((name) => {
            const on = !!add[name];
            return (
              <div
                key={name}
                className="diy-card"
                data-on={on ? '1' : '0'}
                role="checkbox"
                aria-checked={on}
                tabIndex={0}
                onClick={() => setAdd((a) => ({ ...a, [name]: !a[name] }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setAdd((a) => ({ ...a, [name]: !a[name] }));
                  }
                }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 8px 14px',
                  borderRadius: 10,
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'box-shadow 180ms ease-out',
                  boxShadow: on ? 'inset 0 0 0 1px var(--primary-400), 0 0 0 2px var(--primary-50)' : 'inset 0 0 0 1px var(--grey-200)',
                }}
              >
                {DIY_IMG[name] ? (
                  <img className="diy-img" src={DIY_IMG[name]} alt="" width={432} height={270} style={{ width: '100%', height: 'auto', aspectRatio: '8/5', objectFit: 'contain', borderRadius: 8, transition: 'transform 180ms ease-out' }} />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '8/5', borderRadius: 8, background: '#F5F5F5' }} />
                )}
                <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#171717', textAlign: 'center' }}>{name}</span>
                {on ? (
                  <div style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: 5, background: '#33A556', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        {dough}
      </>
    );
  } else {
    body = (
      <>
        <div style={{ height: 140, flexShrink: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'row', gap: 8 }}>
          <ImageWell src={dish.img} />
          <ImageWell src={asset('dish-detail-2.png')}>
            <Tag color="grey" style={{ position: 'absolute', left: 6, top: 6 }}>
              За издаване
            </Tag>
          </ImageWell>
        </div>

        <div style={{ flexShrink: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TitleRow title={dish.title} price={eur(unit)} style={{ gap: 10 }} />
          {groups.length ? (
            <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {groups.map((g, gi) => (
                <div key={g.label} role="radiogroup" aria-label={g.label} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginTop: gi === 0 ? 0 : 'var(--space-1)' }}>
                  <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#525252' }}>{g.label}</span>
                  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 'var(--space-1-5)' }}>
                    {g.options.map((o, i) => (
                      <Chip key={o} size="medium" active={sel[gi] === i} onClick={() => pick(gi, i)}>
                        {o}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {dish.extraPanels?.length ? (
          <div style={{ flexShrink: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dish.extraPanels.map((p) => panel(p.id, p.title, p.items, 'add', { thumb: p.icon, single: p.single }))}
          </div>
        ) : null}

        <div style={{ flexShrink: 0, alignSelf: 'stretch', overflow: 'hidden', borderRadius: 10, background: '#FAFAFA', boxShadow: 'inset 0 0 0 1px #F5F5F5', display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px' }}>
          <div style={{ height: 20, display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center', flexGrow: 1 }}>
              <ChefHatIcon size={20} style={{ color: '#33A556' }} />
              <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#171717', whiteSpace: 'nowrap' }}>Рецепта</span>
            </div>
            <Allergens />
          </div>
          <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#525252' }}>{SAMPLE_RECIPE.text}</span>
          <div style={{ height: 20, display: 'flex', flexDirection: 'row', gap: 6 }}>
            <span style={{ flexGrow: 1, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#171717' }}>Общ грамаж:</span>
            <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#171717', whiteSpace: 'nowrap' }}>{SAMPLE_RECIPE.weight}</span>
          </div>
        </div>

        <div style={{ flexShrink: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {panel('rm', 'Премахни съставки', dish.ingredients || DEFAULT_INGREDIENTS, 'rm')}
          {panel('add', 'Добавки', dish.addons || DEFAULT_ADDONS, 'add')}
        </div>
      </>
    );
  }

  const fade: CSSProperties = { opacity: shown ? 1 : 0, transition: `opacity ${ANIM_MS}ms ease-out` };

  return (
    <div
      onClick={close}
      style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(23,23,23,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, pointerEvents: shown ? 'auto' : 'none', ...fade }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={dish.title}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: 550,
          maxHeight: '100%',
          transition: `transform ${ANIM_MS}ms ease-out, opacity ${ANIM_MS}ms ease-out`,
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
          borderRadius: 12,
          background: '#FFFFFF',
          boxShadow: 'inset 0 0 0 1px #DDE4EE,0 12px 32px 0 rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 30 }}>
          <IconButton size="medium" icon={icon('LucideX-a3')} tooltip="Затвори" onClick={close} />
        </div>

        <div
          onClick={() => halfMenu != null && setHalfMenu(null)}
          style={{ position: 'relative', flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: 20, alignItems: 'flex-start' }}
        >
          {body}
        </div>

        <div style={{ height: 60, flexShrink: 0, borderTop: '1px solid #DDE4EE', display: 'flex', flexDirection: 'row', padding: '12px 16px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center', padding: 2, borderRadius: 8, background: 'var(--grey-100)' }}>
            <IconButton size="medium" icon={icon('LucideMinus')} tooltip="Намали" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))} />
            <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#171717', minWidth: 18, textAlign: 'center' }}>{qty}</span>
            <IconButton size="medium" icon={icon('LucidePlus')} tooltip="Увеличи" onClick={() => setQty((q) => q + 1)} />
          </div>
          <div style={{ display: 'flex', cursor: ready ? 'default' : 'not-allowed' }}>
            <button
              type="button"
              className="hover-add"
              disabled={!ready}
              onClick={submit}
              style={{
                appearance: 'none',
                border: 'none',
                font: 'inherit',
                height: 36,
                borderRadius: 8,
                background: '#006612',
                display: 'flex',
                gap: 6,
                padding: '8px 12px',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: ready ? 'pointer' : 'not-allowed',
                opacity: ready ? 1 : 0.5,
                pointerEvents: ready ? 'auto' : 'none',
              }}
            >
              <span style={{ fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                {(init.editKey ? 'Запази за ' : 'Добави за ') + eur(unit * qty)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageWell({ src, children }: { src: string; children?: ReactNode }) {
  return (
    <div style={{ position: 'relative', height: 140, overflow: 'hidden', borderRadius: 10, background: '#F5F5F5', display: 'flex', padding: '8px 0', alignItems: 'center', flex: '1 1 0', minWidth: 0 }}>
      <img src={src} alt="" style={{ flexGrow: 1, alignSelf: 'stretch', objectFit: 'contain', minWidth: 0 }} />
      {children}
    </div>
  );
}

function TitleRow({ title, price, style }: { title: string; price: string; style?: CSSProperties }) {
  return (
    <div style={{ flexShrink: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', ...style }}>
      <h2 style={{ margin: 0, flexGrow: 1, fontWeight: 600, fontSize: 18, lineHeight: '28px', color: '#171717' }}>{title}</h2>
      <span style={{ flexShrink: 0, fontWeight: 600, fontSize: 18, lineHeight: '28px', color: '#018017', whiteSpace: 'nowrap' }}>{price}</span>
    </div>
  );
}
