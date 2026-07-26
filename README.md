# DriveMate — Premium Automotive Services Platform

A full doorstep car & bike servicing platform, styled after Urban Company (UI/UX patterns,
login/cart flow) and GoMechanic (service categories, offers, doorstep model), built around
your DriveMate logo.

```
drivemate-project/
├── frontend/                  Static site — open directly in a browser, or serve with any static host
│   ├── index.html             Homepage — hero (2W/4W toggle), offers, services, plans, testimonials
│   ├── four-wheelers.html     Car services catalog (hatchback / sedan / SUV / luxury)
│   ├── two-wheelers.html      Bike & scooter services catalog
│   ├── professionals.html     "Become a mechanic" partner registration landing page
│   ├── login.html             Log in / sign up (tabbed, Urban-Company-style)
│   ├── cart.html              Cart, slot picker, order summary
│   ├── css/styles.css         All design tokens & component styles
│   ├── js/script.js           Scroll reveals, cursor tool-trail effect, tabs, filters
│   ├── js/api.js              Talks to the backend API (login/signup wiring included)
│   └── assets/
│       ├── logo.jpg           Your uploaded DriveMate logo
│       └── vehicles/*.svg     Custom line-art vehicle illustrations (no stock photos —
│                               keeps the project copyright-clean; swap in real photography
│                               any time by replacing these files or the <img> tags)
│
└── backend/                   Node.js + Express REST API
    ├── server.js               Entry point — wires up all routes, run with `npm start`
    ├── package.json
    ├── routes/
    │   ├── auth.js              POST /api/auth/signup, /api/auth/login (JWT + bcrypt)
    │   ├── services.js          GET  /api/services?category=two|four
    │   ├── vehicles.js          GET  /api/vehicles/brands?type=two|four
    │   ├── offers.js            GET  /api/offers
    │   ├── cart.js               /api/cart (auth required)
    │   └── bookings.js           /api/bookings — checkout (auth required)
    ├── middleware/auth.js       JWT verification middleware
    └── data/                    JSON-file "database" (services, vehicles, offers, users, carts, bookings)
```

## Running it

### 1. Frontend only (no backend needed to preview the design)
Just open `frontend/index.html` in a browser — every page, animation and the cursor tool-trail
effect works standalone. Login/signup forms will show a friendly error until the backend is running.

### 2. Full stack (frontend talking to a real backend)
```bash
cd backend
npm install
npm start          # → DriveMate backend running on http://localhost:4000
```
Then open `frontend/index.html` (or serve the `frontend/` folder with any static server, e.g.
`npx serve frontend`). The frontend is pre-configured to call `http://localhost:4000/api` —
change `window.DRIVEMATE_API_BASE` at the top of `frontend/js/api.js` if you deploy the backend elsewhere.

### API quick reference
| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | – | Create an account, returns a JWT |
| POST | `/api/auth/login` | – | Log in, returns a JWT |
| GET | `/api/services?category=two\|four` | – | List services for bikes or cars |
| GET | `/api/vehicles/brands?type=two\|four` | – | List serviced brands |
| GET | `/api/offers` | – | List active promo offers |
| GET/POST | `/api/cart` | JWT | View / add to cart |
| DELETE | `/api/cart/:itemId` | JWT | Remove a cart item |
| POST | `/api/bookings` | JWT | Checkout the cart into a confirmed booking |

## Design notes
- **Palette**: carbon-workshop dark theme (near-black graphite) with a brushed-copper accent,
  pulled directly from your logo's bronze ring and steel lettering.
- **Type**: Oswald (display/headings), Manrope (body), JetBrains Mono (labels, prices, codes).
- **Signature interaction**: a custom cursor that streams tiny wrench/bolt/gear/screwdriver
  SVGs as it moves, with a denser burst on click — built in plain JS + Web Animations API,
  no external libraries. Automatically disabled on touch devices.
- **Vehicle art**: hand-built SVG line illustrations instead of stock photography, so the
  whole project is copyright-clean and ready to publish as-is. Swap in real vehicle/garage
  photography later by replacing the files in `assets/vehicles/` or the relevant `<img>` tags.

## Next steps you may want
- Replace the JSON-file backend with a real database (Postgres/MongoDB) — the route files are
  small and structured so this is a drop-in swap.
- Add payment gateway integration (Razorpay/Stripe) inside `routes/bookings.js`.
- Replace placeholder brand initials in `backend/data/vehicles.json` with real brand logos
  once you have licensing/usage rights for them.
