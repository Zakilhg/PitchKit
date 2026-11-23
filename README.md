# PitchKit

Football jersey store: a React storefront talking to a Laravel 13 REST API, plus a Blade admin panel for managing the catalog. Started as a two-person student project in 2023 and modernized in 2026.

**Live demo:** https://zakilhg.github.io/PitchKit/ (the storefront in demo mode, with a built-in catalog and no backend).

## Highlights

- **Token-based API auth with Laravel Sanctum.** The API lets customers register and log in through `/api/auth/*` (rate-limited), and profile routes act only on the logged-in user. The original arbitrary `/api/user/{id}` routes are gone. The storefront's login and profile screens aren't connected to these endpoints yet.
- **Separate admin panel.** Session login at `/login`, limited to users with the `admin` role, with CRUD for jerseys, brands, leagues and clubs.
- **Catalog API** with pagination, search and route-model binding (`/api/jerseys`, `/api/leagues`, `/api/clubs`, `/api/brands`).
- **Tested and checked in CI.** Feature tests for auth, the catalog and admin access. GitHub Actions runs the frontend lint, build and `npm audit`, and the backend `composer validate`, `composer audit` and PHPUnit.

## Tech stack

**Client:** React 19 · Vite · React Router · TanStack Query
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
| Admin | `admin@pitchkit.test` | `pitchkit-demo` | Admin panel at http://127.0.0.1:8000/login |
| Customer | `fan@pitchkit.test` | `pitchkit-demo` | The `/api/auth/login` endpoint (the panel turns customers away) |

They're only created when `APP_ENV=local`, and the local admin login page shows them too. The password is public, so never use them on a real server.

## Demo mode

Built with `VITE_DEMO=true`, the storefront answers its API calls from `Client/src/demo/catalog.json` and serves the images next to the app, so it runs on static hosting. `.github/workflows/pages.yml` builds it this way and deploys it to GitHub Pages on every push to `main`. `DemoCatalogSeeder` loads the same catalog into the real database.

## Tests

```bash
cd Server && php artisan test
cd Client && npm run lint && npm run build
```

## Status

Working: the catalog API, customer auth and profile API, and the admin panel (dashboard, and adding, editing and deleting jerseys, clubs, leagues and brands with photo uploads). In the storefront: the home page, the shop page with search, league filters and sorting, product pages, and a bag and saved favorites kept in the browser. Not finished: the storefront's login and register screens (UI only), paging past the first 24 jerseys in the shop, plus checkout, orders and invoices. See [docs/MODERNIZATION.md](docs/MODERNIZATION.md) for the roadmap.

## Team

Built by [Zakaria Lahgaz](https://github.com/Zakilhg) and [AitTamaldou](https://github.com/AitTamaldou) as a school project. Zakaria led the 2026 modernization: the Laravel 13 upgrade, API security, tests and CI.
