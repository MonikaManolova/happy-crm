# Happy CRM

Internal CRM for Happy operators. The first screen is **New Order**: search the menu, add dishes to a customer's order, set order details (notes, recipient, delivery time, payment, invoice) and submit.

Built with React 18, TypeScript and Vite, on the Happy Design System's tokens and components.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command             | What it does                                 |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                   |
| `npm run build`     | Type-check and build to `dist/`              |
| `npm run preview`   | Serve the production build locally           |
| `npm test`          | Unit tests (Vitest)                          |
| `npm run typecheck` | TypeScript only                              |

## Project layout

```
src/
  App.tsx                 page layout and shared state (cart, notes, open dish)
  components/
    ds/                   Happy Design System components (Button, Chip, Input, Select, Modal…)
    layout/               app bar, side nav, customer header
    menu/                 filters, dish grid, dish card, custom "+" cursor
    order/                order panel, cart rows, detail accordions, totals, invoice modal
    dish/                 dish detail modal (standard, half-and-half pizza, build-your-own)
  data/                   static menu, customer and order data (replace with API calls)
  lib/                    pricing and cart logic, with unit tests
  styles/                 design tokens and global CSS
public/assets/            icons, food and ingredient images
design/                   original design handoff (prototype, spec, design-system bundle)
```

## Design reference

`design/HANDOFF.md` is the design spec. `design/Empty Cart (standalone).html` is the original prototype and opens directly in a browser. (`Empty Cart.dc.html` is its source; it expects the images in `design/assets/`, which now live in `public/assets/`.) The app was checked against it screenshot-by-screenshot.

Where the app intentionally differs from the prototype:

- The "Съставки" filter is 140px wide, as the spec says (the prototype renders it narrower).
- Adding the same dish with the same options from the card and from the detail modal merges into one cart line.
- Editing a cart line keeps it in place instead of moving it to the bottom.
- Multi-option dishes (e.g. Айс лате) show their cheapest price on the card instead of 0,00 €.
- A "Друга дата" delivery time shows the chosen date.
- The open order-detail row closes (discarding the draft) on a click outside it, per the spec.

## Not built yet

All data is static, so there is no backend, persistence or login. Category and subcategory chips highlight but don't filter the dishes. The tags and ingredients filters, the invoice pencil and "Нова фактура" buttons, and the "Свържи към поръчка" and "Още действия" items have no behaviour yet, as in the prototype.
