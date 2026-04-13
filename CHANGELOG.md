# Changelog

All notable changes to **playwright-hybrid-framework** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · Versioning follows [SemVer](https://semver.org/).

---

## [Unreleased]

---

## [1.2.0] — 2026-04-14
### `feat: add cross-layer contract validation and extended API edge cases`

#### API — New Test Specs
- `contract.spec.ts` — 11 contract tests across 3 suites:
  - **API response consistency** — no duplicate user IDs across pages, total count math, ID echo, payload echo on create/update, token format, email format validation, avatar URL format validation
  - **UI data contracts** — product count matches expected catalogue, all UI product names exist in known data contract, all prices are positive non-NaN numbers
  - **Token lifecycle** — token reusable in subsequent requests, register + login with same credentials both succeed
- `edge-cases.spec.ts` — 10 boundary and edge case tests: out-of-range page (0 and 999), ID zero returns 404, fake-API stateless delete verification, delay response timing assertion, ISO 8601 `createdAt` validation, `updatedAt` recency check, PATCH response shape, create→update→delete status code sequence, sequential GET consistency, all 400 error shapes

#### Test Data
- `reqres.json` — added `zeroId`, `outOfRangePage`, `patchUser` fields

---

## [1.1.0] — 2026-04-11
### `feat: expand UI coverage with cart, checkout and E2E purchase flows`

#### UI — New Test Specs
- `cart.spec.ts` — 7 test cases: empty cart state, single/multi item add, item removal, cart persistence across navigation, continue shopping, empty cart checkout button behaviour
- `checkout.spec.ts` — 10 test cases: full happy path, confirmation message, back-to-home navigation, subtotal+tax=total price validation, item count on overview, all 3 validation errors, cancel returns to cart, `problem_user` last name defect (negative), `problem_user` blocked at step 1 (negative)
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
- JSON test data files for both SauceDemo and ReqRes
- Utility helpers: `waitForNetworkIdle`, `parsePrice`, `normalize`, `buildUrl`
- Lightweight custom schema validator for bootstrapping (planned replacement with AJV)

#### UI — Page Objects
- `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage` — full POM coverage for all SauceDemo flows

#### UI — Tests (16 cases)
- **Login** — valid login, invalid credentials, locked user, empty fields, redirect, logout
- **Inventory** — product count, all 4 sort options, cart badge, `problem_user` broken images

#### API — Clients
- `BaseApiClient` — centralised HTTP wrapper with `defaultHeaders`, per-request header overrides
- `UserApiClient` — full ReqRes.in coverage across all endpoints

#### API — Tests (16 cases)
- **Auth** — login/register success and 400 error cases
- **Users** — full CRUD, pagination, schema validation, 404, delay resilience

#### CI
- GitHub Actions workflow on push/PR to `main`

---

## Roadmap

| Version | Planned Release |
|---|---|
| `1.3.0` | Custom fixtures, AJV schema validation, CI matrix runs, `tsconfig` hardening |
| `1.4.0` | Visual regression + accessibility checks |
| `2.0.0` | Allure reporting, parallel execution, full README with badges |

---

[Unreleased]: https://github.com/yourusername/playwright-hybrid-framework/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/yourusername/playwright-hybrid-framework/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/yourusername/playwright-hybrid-framework/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/yourusername/playwright-hybrid-framework/releases/tag/v1.0.0
