# Changelog

All notable changes to **playwright-hybrid-framework** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · Versioning follows [SemVer](https://semver.org/).

---

## [Unreleased]

---

## [1.3.0] — 2026-04-16
### `fix: custom fixtures, AJV schema validation, CI matrix and tsconfig hardening`

#### Framework — Fixtures (`src/ui/fixtures/index.ts`)
- Introduced custom Playwright `test.extend()` fixtures replacing repetitive `new XxxPage(page)` boilerplate across all UI tests
- `loginPage`, `inventoryPage`, `cartPage`, `checkoutPage` — POM instances pre-wired to current page
- `authenticatedPage` — pre-logged-in page fixture with automatic teardown (clears cookies post-test)
- `apiClient` — pre-configured `UserApiClient` instance eliminating `new UserApiClient(request, ENV.API_BASE_URL)` setup in every API test

#### Framework — Schema Validation
- Added `ajvValidator.ts` — full AJV v8 + `ajv-formats` schema validation replacing the basic custom `schemaValidator.ts`
- Strict JSON Schema definitions with `format: "email"` and `format: "uri"` validation for user objects
- `validate()` helper maintains drop-in compatibility with old interface (`{ valid, errors }`)
- Updated `auth.spec.ts` and `users.spec.ts` to use AJV validators

#### UI Tests — Refactored
- `login.spec.ts` — migrated to fixture-based imports (`@fixtures/index`)
- `inventory.spec.ts` — migrated to fixture-based imports, `authenticatedPage` fixture handles login setup

#### CI — Matrix Runs
- Split into two jobs: `test-api` (single run) and `test-ui` (matrix: chromium + firefox)
- `fail-fast: false` on matrix — Firefox failure won't abort Chromium run
- Added `actions/upload-artifact@v4` — HTML reports uploaded as CI artifacts (retained 7 days)
- `workflow_dispatch` retained for manual triggers

#### Config
- `playwright.config.ts` — added `ui-tests-firefox` project (`Desktop Firefox`)
- `package.json` — added `test:firefox` script, bumped to `v1.3.0`, added `ajv` and `ajv-formats` dependencies
- `tsconfig.json` — `ignoreDeprecations: "5.0"` consistently applied, `rootDir` removed

---

## [1.2.0] — 2026-04-14
### `feat: add cross-layer contract validation and extended API edge cases`

#### API — New Test Specs
- `contract.spec.ts` — 11 contract tests: API response consistency, UI data contracts, token lifecycle
- `edge-cases.spec.ts` — 10 boundary tests: out-of-range pages, timing, sequential CRUD, error shapes

#### Test Data
- `reqres.json` — added `zeroId`, `outOfRangePage`, `patchUser` fields

---

## [1.1.0] — 2026-04-11
### `feat: expand UI coverage with cart, checkout and E2E purchase flows`

#### UI — New Test Specs
- `cart.spec.ts` — 7 cases: empty cart, add/remove, persistence, navigation
- `checkout.spec.ts` — 10 cases: happy path, price math, validation errors, `problem_user` defects
- `e2e-purchase.spec.ts` — 3 end-to-end purchase journeys

#### Test Data
- `saucedemo.json` — added `multipleUsers` array, `allProducts` list

---

## [1.0.0] — 2026-04-08
### `feat: bootstrap hybrid framework with UI smoke tests and API foundation`

#### Framework Setup
- Dual-project Playwright config: `ui-tests` (Chromium + SauceDemo) and `api-tests` (ReqRes.in)
- TypeScript strict mode with path aliases (`@pages`, `@api`, `@shared`, `@fixtures`)
- `.env` support via dotenv, HTML reporter, screenshot + video on failure

#### UI — Page Objects + Tests (16 cases)
- `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`
- Login (7) + Inventory (9) test cases

#### API — Clients + Tests (16 cases)
- `BaseApiClient`, `UserApiClient`
- Auth (5) + Users CRUD (11) test cases

#### CI
- GitHub Actions workflow on push/PR to `main`

---

## Roadmap

| Version | Planned Release |
|---|---|
| `1.4.0` | Visual regression + accessibility checks |
| `2.0.0` | Allure reporting, parallel execution, full README with badges |

---

[Unreleased]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/releases/tag/v1.0.0
