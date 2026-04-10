# Changelog

All notable changes to **playwright-hybrid-framework** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · Versioning follows [SemVer](https://semver.org/).

---

## [Unreleased]

---

## [1.1.0] — 2026-04-11
### `feat: expand UI coverage with cart, checkout and E2E purchase flows`

#### UI — New Test Specs
- `cart.spec.ts` — 7 test cases covering empty cart state, single/multi item add, item removal, cart persistence across navigation, continue shopping, and empty cart checkout button behaviour
- `checkout.spec.ts` — 10 test cases: full happy path, confirmation message, back-to-home navigation, subtotal+tax=total price validation, item count on overview, all 3 validation errors (missing first name / last name / postal code), cancel returns to cart, `problem_user` last name field defect (negative), `problem_user` blocked at step 1 (negative)
- `e2e-purchase.spec.ts` — 3 end-to-end journeys: single item purchase, multi-item purchase, remove item then complete checkout

#### Test Data
- `saucedemo.json` — added `multipleUsers` array for data-driven checkout scenarios, added `allProducts` array for full inventory assertions

---

## [1.0.0] — 2026-04-08
### `feat: bootstrap hybrid framework with UI smoke tests and API foundation`

#### Framework Setup
- Dual-project Playwright config: `ui-tests` (Chromium + SauceDemo) and `api-tests` (ReqRes.in)
- TypeScript strict mode with path aliases (`@pages`, `@api`, `@shared`, `@fixtures`)
- `.env` support via dotenv with `.env.example` for safe onboarding
- HTML reporter with screenshot + video capture on failure

#### Shared Layer
- Centralised `env.ts` config with fallback defaults
- TypeScript interfaces for all SauceDemo and ReqRes domain objects
- JSON test data files for both SauceDemo (`users`, `checkout`, `products`) and ReqRes (`auth`, `users`, `crud`)
- Utility helpers: `waitForNetworkIdle`, `parsePrice`, `normalize`, `buildUrl`
- Lightweight custom schema validator for bootstrapping (planned replacement with AJV)

#### UI — Page Objects
- `LoginPage` — login, logout, error assertion, page guard
- `InventoryPage` — sort, add to cart, badge count, product images, logout
- `CartPage` — item listing, remove, empty state, navigation
- `CheckoutPage` — three-step flow (info → overview → confirmation), price extraction, error handling

#### UI — Tests (16 cases)
- **Login** — valid login, invalid credentials, locked user, empty username/password, unauthenticated redirect, logout
- **Inventory** — product count, all 4 sort options, cart badge (single + multi), `problem_user` broken images (negative test)

#### API — Clients
- `BaseApiClient` — centralised HTTP wrapper with `defaultHeaders`, per-request header overrides, correct `Content-Type` stripping on `GET`/`DELETE`
- `UserApiClient` — full ReqRes.in coverage: `getUsers`, `getUserById`, `createUser`, `updateUser`, `patchUser`, `deleteUser`, `getUsersWithDelay`, `login`, `register`

#### API — Tests (16 cases)
- **Auth** — login success + token validation, login 400 (missing password), login 400 (unregistered), register success, register 400
- **Users** — list pagination meta, page 1 vs page 2 no overlap, per-object schema validation, single user fetch, 404, delay resilience, POST create, PUT update, PATCH partial, DELETE 204

#### CI
- GitHub Actions workflow on push/PR to `main` — Node 20, Chromium install, full test run

---

## Roadmap

| Version | Planned Release |
|---|---|
| `1.2.0` | Cross-layer contract validation (UI ↔ API) |
| `1.3.0` | Custom fixtures, AJV schema validation, CI matrix runs |
| `1.4.0` | Visual regression + accessibility checks |
| `2.0.0` | Allure reporting, parallel execution, full README with badges |

---

[Unreleased]: https://github.com/yourusername/playwright-hybrid-framework/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/yourusername/playwright-hybrid-framework/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/yourusername/playwright-hybrid-framework/releases/tag/v1.0.0
