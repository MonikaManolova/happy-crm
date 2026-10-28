import { useState, type ReactNode } from 'react';
import { DishDetailModal, type DetailInit } from '../components/dish/DishDetailModal';
import { AppBar } from '../components/layout/AppBar';
import { CustomerHeader } from '../components/layout/CustomerHeader';
import { SideNav } from '../components/layout/SideNav';
import { CustomCursorProvider } from '../components/menu/CustomCursor';
import { MenuColumn } from '../components/menu/MenuColumn';
import { OrderPanel } from '../components/order/OrderPanel';
import { findDish } from '../data/menu';
import { NEW_ORDER, type OrderSeed } from '../data/orders';
import type { Dish } from '../data/types';
import { addLine, bumpLine, lineKey, replaceLine, type CartLine, type LineConfig } from '../lib/cart';

type Notes = Record<string, string>;

/** Drops notes whose cart line no longer exists. */
const pruneNotes = (notes: Notes, cart: CartLine[]): Notes =>
  Object.fromEntries(Object.entries(notes).filter(([k]) => cart.some((l) => l.key === k)));

/**
 * The order-taking screen: menu, customer header and order panel. NewOrder and
 * EditOrder both render it; `seed` is the order it starts with, `navAction`
 * fills the top bar's slot next to "Admin" and `leftPanel` sits left of the menu.
 */
export function OrderScreen({
  navAction,
  seed = NEW_ORDER,
  leftPanel,
}: {
  navAction?: ReactNode;
  seed?: OrderSeed;
  /** Panel to the left of the menu, below the customer header (EditOrder's control panel). */
  leftPanel?: ReactNode;
}) {
  const [nav, setNav] = useState(1);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Основно меню');
  const [subcategory, setSubcategory] = useState('Салати');
  /** Option chosen in each dish card's select, by dish id. */
  const [picks, setPicks] = useState<Record<number, string>>({});
  const [cart, setCart] = useState<CartLine[]>(seed.cart);
  /** Per-line notes, by cart line key. */
  const [notes, setNotes] = useState<Notes>({});
  const [detail, setDetail] = useState<{ dish: Dish; init: DetailInit } | null>(null);

  const updateCart = (next: CartLine[]) => {
    setCart(next);
    setNotes((n) => pruneNotes(n, next));
  };

  const quickAdd = (dish: Dish) => {
    if (dish.modalOnly) return setDetail({ dish, init: {} });
    const picked = dish.options ? [picks[dish.id] ?? dish.options[0]] : [];
    updateCart(addLine(cart, { dishId: dish.id, picked, addons: [], removed: [] }, 1));
  };

  const removeOne = (dishId: number) => {
    const last = [...cart].reverse().find((l) => l.dishId === dishId);
    if (last) updateCart(bumpLine(cart, last.key, -1));
  };

  const submitDetail = (config: LineConfig, qty: number, editKey?: string) => {
    if (!editKey) return updateCart(addLine(cart, config, qty));
    const key = lineKey(config);
    // Carry the edited line's note over to its new key.
    if (key !== editKey && notes[editKey]) {
      setNotes((n) => {
        const next = { ...n, [key]: n[key] ? `${n[key]} ${n[editKey]}` : n[editKey] };
        delete next[editKey];
        return next;
      });
    }
    updateCart(replaceLine(cart, editKey, config, qty));
  };

  return (
    <CustomCursorProvider>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          minWidth: 1100,
          minHeight: 640,
          overflow: 'hidden',
          background: '#F5F5F5',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <AppBar action={navAction} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', flexGrow: 1, alignSelf: 'stretch', zIndex: 1, minHeight: 0 }}>
          <SideNav active={nav} onChange={setNav} />
          <main style={{ position: 'relative', display: 'flex', flexDirection: 'column', flexGrow: 1, alignSelf: 'stretch', minWidth: 0, minHeight: 0 }}>
            <CustomerHeader header={seed.header} />
            <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, alignSelf: 'stretch', minHeight: 0 }}>
              {leftPanel}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', gap: 16, padding: '16px 16px 0 16px', flexGrow: 1, minWidth: 0, minHeight: 0 }}>
                <MenuColumn
                  query={query}
                  onQuery={setQuery}
                  category={category}
                  onCategory={setCategory}
                  subcategory={subcategory}
                  onSubcategory={setSubcategory}
                  cart={cart}
                  picks={picks}
                  onPick={(id, o) => setPicks((p) => ({ ...p, [id]: o }))}
                  onAdd={quickAdd}
                  onDetails={(dish) => setDetail({ dish, init: {} })}
                  onRemoveOne={removeOne}
                />
                <OrderPanel
                  title={seed.title}
                  initialDetails={seed.details}
                  initialPromo={seed.promo}
                  cart={cart}
                  notes={notes}
                  onNote={(key, note) =>
                    setNotes((n) => {
                      const next = { ...n };
                      if (note) next[key] = note;
                      else delete next[key];
                      return next;
                    })
                  }
                  onBump={(key, d) => updateCart(bumpLine(cart, key, d))}
                  onEdit={(line) => {
                    const dish = findDish(line.dishId);
                    if (dish) setDetail({ dish, init: { qty: line.qty, picked: line.picked, addons: line.addons, removed: line.removed, editKey: line.key } });
                  }}
                  onSubmit={() => updateCart([])}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
      {detail ? (
        <DishDetailModal
          key={detail.dish.id + (detail.init.editKey ?? '')}
          dish={detail.dish}
          init={detail.init}
          cardPick={picks[detail.dish.id]}
          onSubmit={submitDetail}
          onClose={() => setDetail(null)}
        />
      ) : null}
    </CustomCursorProvider>
  );
}
