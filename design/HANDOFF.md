# Handoff: Happy CRM — New Order (Empty Cart screen)

## Overview
Internal CRM screen used by Happy operators to create a new delivery/pickup order for a customer. The operator searches the menu, filters by category, adds dishes to the order, and fills order details (recipient, notes, delivery time, payment method, invoice). This bundle covers the **Empty Cart** state of the New/Edit Order flow. Other screens in the flow (Order Cart with items, extra forms/modals) are not designed yet.

## About the design files
The files here are **design references built in HTML**: prototypes that show the intended look and behavior. They are not production code. Recreate them in the target codebase using its existing framework, component library and patterns. If there is no codebase yet, pick a suitable stack (React + TypeScript is a good fit, since the design-system components are React).

Open `Empty Cart (standalone).html` in a browser to see the working prototype. `Empty Cart.dc.html` is the source. It loads `support.js` and must be served over HTTP (e.g. `npx serve .`) rather than opened from disk.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii and interactions are final and taken from the Happy Design System (Figma: `Happy.fig`). Match them pixel-exactly.

## Screen layout (min 1100×640, full viewport)
- **App bar**: 64px tall, white, 1px `#E5E5E5` border, padding 10px 24px 10px 20px. Contains the menu icon, "Admin" (18/20, 700), a bell with a count of 4 in `#D97706`, and a 36px avatar circle (`#171717`, initials "NS").
- **Side nav**: 64px wide, white, 7 icon items. Each item is 40px tall with 8px radius. The active item is highlighted.
- **Customer header**: 140px tall. White background with a faint radial blue wash. Contents:
  - Breadcrumb at 12/16, 500 weight. Links in `#737373`, the current item in `#171717`, `/` separator in `#A3A3A3`.
  - Customer name "Александър Петров" (20/32, 600) with a pencil icon button.
  - Status pill "Online user", phone and email.
  - Brand buttons on the right: Captain Cook `#015388`, Burrata `#262626`, Pickup (outline), plus an ellipsis button.
  - A second row with three controls: an address select (342px, tag "До адрес"), a restaurant select (172px, "Happy Виктория"), and the delivery-time badge "40 мин за доставка" (`#E6F3E8` background, `#015410` text).
- **Body**: padding 16px 16px 0, gap 16px. Two columns:
  1. **Menu column** (flexible width):
     - Filter card: white, 12px radius. Contains a search Input (large, placeholder "Търси по име и/или съставка"), a tags multi-select, an ingredients Select (140px), and a wrap row of category Chips. The selected category renders as a solid Button.
     - Below the card, a scrolling dish grid with a sticky header ("Основно меню", 18/28, 600) and subcategory Chips in size small.
  2. **Order panel** (right): the "Нова поръчка" header and order-detail rows.

## Components
All components come from the Happy Design System. Local wrappers live in `ds/`: Button, IconButton, TextButton, Chip, Input, Select/Dropdown, Textarea, Radio, Tabs, Tag. The bundle `_ds/.../_ds_bundle.js` provides Modal and Dropdown.

### Dish card
- Grid: `repeat(auto-fill, minmax(210px, 1fr))`, gap 12px.
- Card: white, 12px radius, 8px padding. On hover it gets `inset 0 0 0 1px var(--primary-400)` and the image scales to 1.04 (180ms ease-out).
- Image well: 130px tall, `#F5F5F5`, 10px radius, `object-fit: contain`. Food-tag icons (protein / spicy / vegan) sit in 24px white tiles at the bottom-left.
- Price and details are laid out with `space-between`.
- **НОВО ribbon**: orange gradient `#D97708`→`#F59E09` in the top-left corner, text rotated −45°. Shown on cards 2–4.
- **Custom cursor**: over a card, the native cursor is hidden and a 46px custom cursor follows the mouse.
- **Quantity badge**: 24×24, `--primary-400`, 6px radius, top-right, white 14/20 600 number. On hover the background becomes `--grey-600` and a minus icon replaces the number. Clicking it decrements the quantity.
- Clicking a card adds the dish. Dishes with options open a dish-detail modal (option groups, half-and-half pizza, DIY pizza, add-ons).

### Order panel: "Нова поръчка" header
- **"Мін. Сума" toggle**: track is `--primary-500` when on and `--grey-300` when off. When off, the 10€ minimum-order line is hidden.
- On the right, two medium outline buttons, "Свържи към поръчка" and "Още действия". They are separated by a 16px-tall `--grey-400` divider and spaced with gap `--space-1`.
- Both buttons show a tooltip on hover. "Свържи към поръчка" does nothing else for now.
- "Още действия" opens a right-aligned Dropdown, 220px wide, with two items: "Прегледай оригинала" (eye icon) and "Позвъни" (phone icon). It closes on outside click.

### Order-detail rows (accordions)
Rows: recipient, notes, delivery time, payment method.
- Only one row can be open at a time.
- An open row expands with a white background.
- A row closes only via its own close/save buttons or a click outside it.
- Saved values are shown in the row's collapsed state.

### "Начин на плащане" (payment method) row
- Closed state: hover background `--grey-100`, no trailing icon.
- Contains an "Издай фактура" button.
- After an invoice is saved, that button is replaced by a container holding "Фактура: [company]" and a small X button, with no gap between them. Container styling:
  - background `--grey-100`
  - shadow `inset 0 0 0 1px var(--grey-200), var(--shadow-control)`
  - `overflow: hidden`
- Clicking X clears the selected invoice.

### "Издай фактура" modal
- Modal with a title and subtitle. Backdrop is black at 0.5 opacity. Esc closes it.
- **Invoice list**: defaults are "Хоризонт ООД, ЕИК: 208340001" and "Бозмов ЕООД, ЕИК: 893000123". Each row has:
  - a Radio
  - the company name (14px, 500, `--grey-900`)
  - pencil and trash IconButtons, with tooltips "Редактирай" and "Изтрий" centered above them.
- Rows hover to `--grey-50` with a smooth background transition.
- **"Нова фактура"**: outline button, large, full width, gap `--space-2-5` below the list.
- **Footer**: "Запази" solid button, large. It saves the selected invoice to the payment row and closes the modal.
- Trash removes an invoice from the list. Pencil is not wired yet (intended to open an edit form).

## State
From the prototype's logic class:
- `query`: search text, filters dishes by name or ingredient
- `cat`, `sub`: active category and subcategory
- `nav`: active side-nav item
- `cart`: `{ [dishId::option]: qty }`
- `picks`: selected option per dish
- `openNote`: key of the open accordion row (`recipient` | note keys | `time` | `pay` | null)
- `notes`, `drafts`: saved and in-progress row values
- `payMethod`: default "В брой"
- `minOn`: whether the minimum-order toggle is on
- `moreOpen`: whether the "Още действия" dropdown is open
- `invoiceOpen`, `invoiceList`, `invoiceSel`, `invoiceSaved`: invoice modal state
- `detailShown`, `halfMenu`: dish-detail modal state

No data fetching is mocked. Menu data, customer data and invoices are static in the prototype.

## Design tokens
Use the CSS variables in `_ds/.../tokens/*.css`. Key values:
- Primary: `--primary-600` `#006612`, `--primary-500`, `--primary-400`, `--primary-50`. Success tint `#E6F3E8`.
- Greys: 50 `#FAFAFA`, 100 `#F5F5F5`, 200 `#E5E5E5`, 300 `#D4D4D4`, 400 `#A3A3A3`, 500 `#737373`, 600 `#525252`, 900 `#171717`.
- App background `#F5F5F5`; page canvas `#DEE3E9`.
- Type: Inter only. Sizes: 12/16 labels, 14/20 body and controls, 18/28 600 section and modal titles, 20/32 600 customer name. 500 weight is the default.
- Spacing: 4px base with half-steps (`--space-1` 4px, `--space-2-5` 10px, …).
- Radii: 8px on controls, 6px on tags and badges, 10–12px on cards, dropdowns and modals.
- Borders are drawn as inset box-shadows (`inset 0 0 0 1px`), never CSS borders.
- Shadows:
  - `--shadow-control` `0 0.5px 2px rgba(0,0,0,.05)`
  - `--shadow-popover` `0 1px 3px rgba(0,0,0,.16)`
  - card `0 2px 6px rgba(0,0,0,.04)`
- Motion: 120–180ms ease-out on background and opacity only.

## Assets
- `assets/icons/`: Lucide-based SVG icons from the design file, plus the Happy / Burrata / Captain Cook brand symbols, food-tag and allergen icons.
- `assets/food/`, `assets/ingredients/`: dish and ingredient images (PNG).
- `assets/empty-cart-box.png`: empty-cart illustration.
- Known issue: 7 image references fail to load in the prototype. Replace them with real product images in production.

## Files
- `Empty Cart (standalone).html`: self-contained prototype, open directly in a browser
- `Empty Cart.dc.html`: prototype source (markup + logic class)
- `support.js`: runtime for the `.dc.html` file
- `ds/`: React wrappers for the design-system components used
- `_ds/happy-design-system-…/`: design tokens and component bundle
- `assets/`: icons and images
