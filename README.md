# PitchKit

Football jersey store: a React storefront talking to a Laravel 13 REST API, plus a Blade admin panel for managing the catalog. Started as a two-person student project in 2023 and modernized in 2026.

**Live demo:**

- **Store:** https://zakilhg.github.io/PitchKit/. Log in as `fan@pitchkit.test` / `pitchkit-demo` and buy a jersey with the built-in test payment.
- **Admin:** https://pitchkit-admin.onrender.com/admin, as `admin@pitchkit.test` / `pitchkit-demo`.

The API runs on Render's free tier. After 15 idle minutes it sleeps, so the first visit can take up to a minute while it wakes; the store says so while you wait. Every restart resets the data.

## Highlights

- **A checkout that can't oversell.** Stock is tracked per size and reserved with a conditional update when the order is placed. The server prices every order itself, and unpaid orders give their stock back after 35 minutes. Payments go through one interface: a built-in test gateway by default, or Stripe Checkout with a signature-checked webhook when `STRIPE_SECRET` is set.
- **Token-based API auth with Laravel Sanctum.** Customers register and log in through `/api/auth/*` (rate-limited), and see their own order history.
- **Storefront built on shadcn/ui.** Search palette (Ctrl/⌘ K), slide-over bag, filter drawer on phones, light/dark/system theme, and a product page with a size picker and toasts.
- **Separate admin panel.** Session login at `/admin/login`, limited to users with the `admin` role, with CRUD for jerseys, brands, leagues and clubs.
- **Catalog API** with pagination, search and route-model binding (`/api/jerseys`, `/api/leagues`, `/api/clubs`, `/api/brands`).
- **Tested and checked in CI.** Feature tests for auth, the catalog and admin access. GitHub Actions runs the frontend lint, build and `npm audit`, and the backend `composer validate`, `composer audit` and PHPUnit.

## Tech stack

**Client:** React 19 · Vite · Tailwind CSS v4 · shadcn/ui (Radix) · React Router · TanStack Query
**Server:** Laravel 13 · PHP 8.3+ · Sanctum · MySQL (SQLite in tests) · PHPUnit

## Architecture

```
Client/  React SPA (Vite)  ──HTTP + Bearer token──▶  Server/  Laravel API  ──▶  MySQL
                                                      └── Blade admin panel (session auth, admin role)
```

The SPA reads `VITE_API_BASE_URL` and `VITE_ASSET_BASE_URL` from `Client/.env`. The API allows the SPA's origin through `CORS_ALLOWED_ORIGINS` in `Server/.env`.

## Getting started

Prerequisites: PHP 8.3+, Composer, Node.js 22.12+, and MySQL.

**API and admin panel** (http://127.0.0.1:8000):

```bash
cd Server
composer install
cp .env.example .env
php artisan key:generate
# set DB_DATABASE, DB_USERNAME, DB_PASSWORD in .env
php artisan migrate
php artisan db:seed            # optional: 14 sample jerseys and two test accounts
php artisan storage:link
php artisan serve
```

**Storefront** (http://localhost:5173):

```bash
cd Client
npm install
cp .env.example .env
npm run dev
```

## Test accounts

`php artisan db:seed` creates two accounts for trying the project locally:

| Role | Email | Password | Can use |
|---|---|---|---|
| Admin | `admin@pitchkit.test` | `pitchkit-demo` | Admin panel at http://127.0.0.1:8000/admin |
| Customer | `fan@pitchkit.test` | `pitchkit-demo` | The storefront login, checkout and account page (the admin panel turns customers away) |

They're only created when `APP_ENV=local` (or `DEMO_ACCOUNTS=true` on a demo server), and the admin login page shows them too. The password is public, so never use them on a real server.

## Deployment

The storefront is a static build on GitHub Pages. `.github/workflows/pages.yml` builds it on every push to `main`, pointed at the API through `API_ORIGIN`.

`render.yaml` deploys the API and admin panel to [Render](https://render.com)'s free tier:

1. Sign in to Render with GitHub and choose **New > Blueprint**.
2. Pick this repository and apply. Render builds `Server/Dockerfile` and starts the `pitchkit-admin` service.
3. Open `https://<your-service>.onrender.com/admin` and log in with the admin test account above. If your service URL differs, update `APP_URL` in `render.yaml` and `API_ORIGIN` in the Pages workflow.

The demo runs on SQLite and reseeds on every start, so orders, changes and uploads disappear when the free instance restarts. Render ends HTTPS at its proxy, so the image sets `TRUSTED_PROXIES=*` to keep Laravel's links on `https://`. `DEMO_ACCOUNTS=true` turns on the test accounts outside a local machine; never set it on a real store.

To run the same image locally:

```bash
docker build -f Server/Dockerfile -t pitchkit-server .
docker run -p 8080:8080 -e DEMO_ACCOUNTS=true pitchkit-server
```

## Demo mode

Built with `VITE_DEMO=true`, the storefront answers its API calls from `Client/src/demo/catalog.json` and serves the images next to the app, so it runs on static hosting with no backend at all (login and checkout are turned off). `DemoCatalogSeeder` loads the same catalog into the real database.

## Tests

```bash
cd Server && php artisan test
cd Client && npm run lint && npm run build
```

### End-to-end tests

`Client/e2e/` holds [Playwright](https://playwright.dev) tests that drive the real storefront against a real API. One test logs in as the test customer, buys a jersey, pays and finds the order in the account. The other declines a payment, cancels, and checks the stock comes back. CI runs them on every push, against `php artisan serve` on a fresh SQLite database.

To run them locally, start a seeded API that lets the test storefront (port 5174) in. Docker is the easiest way:

```bash
docker build -f Server/Dockerfile -t pitchkit-server .
docker run -d -p 8020:8080 -e DEMO_ACCOUNTS=true -e API_RATE_LIMIT=1000 \
  -e CORS_ALLOWED_ORIGINS=http://localhost:5174 -e STOREFRONT_URL=http://localhost:5174 pitchkit-server
cd Client
npx playwright install chromium
E2E_API_ORIGIN=http://127.0.0.1:8020 npm run e2e
```

## Status

Working: the catalog API, customer auth and profile API, and the admin panel (dashboard, and adding, editing and deleting jerseys, clubs, leagues and brands with photo uploads). In the storefront: the home page, the shop page with search, league filters and sorting, product pages, and a bag and saved favorites kept in the browser. Not finished: the storefront's login and register screens (UI only), paging past the first 24 jerseys in the shop, plus checkout, orders and invoices. See [docs/MODERNIZATION.md](docs/MODERNIZATION.md) for the roadmap.

## Team

Built by [Zakaria Lahgaz](https://github.com/Zakilhg) and [AitTamaldou](https://github.com/AitTamaldou) as a school project. Zakaria led the 2026 modernization: the Laravel 13 upgrade, API security, tests and CI.
