# PitchKit modernization

This document tracks the controlled upgrade of the original PitchKit football
jersey store. The `main` branch remains the historical baseline. All work is
performed on `codex/modernize-pitchkit` in small, verifiable commits.

## Baseline findings

- The original React storefront builds, but its ESLint script had no ESLint
  configuration.
- The frontend started with 16 known dependency vulnerabilities.
- Product listings call the Laravel API, while product details, authentication,
  profile data, favorites, cart, orders, and invoices are incomplete or static.
- API and image URLs are hard-coded to a local development server.
- Laravel 10 and PHP 8.1 are outside their security-support windows.
- Authentication and user-update endpoints require authorization and data-flow
  corrections before they are safe for production.
- Jersey image fields used by the application do not match the committed
  database migration.
- Order and invoice controllers are placeholders and the commerce schema needs
  an `order_items` model instead of one jersey directly attached to an order.
- The repository has almost no automated test coverage.

## Delivery phases

1. **Stabilize the baseline**
   - Create a protected modernization branch.
   - Restore linting and confirm the production build.
   - Upgrade frontend dependencies and remove known vulnerabilities.

2. **Modernize the foundation**
   - Introduce typed frontend boundaries and centralized environment config.
   - Upgrade Laravel, PHP, Sanctum, and the backend test toolchain.
   - Establish reproducible local development and CI environments.

3. **Repair the domain and security model**
   - Normalize catalog, product image, inventory, order, order item, and user
     profile data.
   - Implement authenticated session handling, authorization policies, request
     validation, and consistent API resources/errors.

4. **Complete the customer experience**
   - Dynamic catalog and product details.
   - Search, filters, favorites, cart, checkout, profile, and order history.
   - Accessible, responsive states for loading, empty data, errors, and success.

5. **Production readiness**
   - Unit, component, integration, and API tests.
   - Formatting, static analysis, dependency auditing, and CI.
   - Deployment configuration, observability, seed/demo data, and complete
     project documentation.

## Completed checkpoints

- **Frontend dependency foundation:** upgraded React, Vite, React Router,
  Motion, React Icons, and ESLint; removed unused packages; restored linting;
  and reduced the npm audit from 16 known vulnerabilities to zero.
- **Catalog data foundation:** centralized API and asset configuration, added
  cancellable cached server-state queries, replaced hard-coded product detail
  content with live API data, added explicit loading/error/empty states, and
  introduced a size-aware local cart boundary for the upcoming bag page.
- **API security and schema repair:** aligned registration with the user schema,
  added token-based login/logout, replaced arbitrary user-ID profile routes with
  authenticated current-user routes, restricted CORS by environment, added
  paginated catalog resources and route-model 404 handling, filled missing
  profile/catalog columns, and added API regression tests.
- **Current backend runtime:** upgraded the application requirements from
  end-of-life Laravel 10 / PHP 8.1 to Laravel 13 / PHP 8.3, updated Sanctum and
  the test toolchain, adopted hardened cache/session and CSRF defaults, and
  generated the Composer lock through the same CI environment that runs tests.

## Definition of done

PitchKit is complete when a customer can register, browse and search products,
select a size, manage a cart, place a test order, and view order history; an
administrator can manage the catalog and inventory; unauthorized data access is
rejected; automated checks pass; and the application can be reproduced and
deployed from the repository documentation.
