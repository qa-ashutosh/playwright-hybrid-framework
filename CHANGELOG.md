# Changelog

All notable changes to **playwright-hybrid-framework** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · Versioning follows [SemVer](https://semver.org/).

---

## [1.4.0] — 2026-04-17
### `feat: add visual regression and accessibility test suites`

#### UI — Visual Regression (`src/ui/tests/visual/`)
- `visual.spec.ts` — 7 baseline screenshot tests across all major pages:
  - Login page (default + error state)
  - Inventory page (standard_user, problem_user broken state, sorted Z-A)
  - Cart page with items
  - Checkout step 1 and confirmation page
- `maxDiffPixelRatio: 0.02` — tolerates up to 2% pixel difference to handle minor rendering deltas
- `animations: "disabled"` — prevents flaky diffs from CSS animations
- Baselines stored in `src/ui/tests/visual/__snapshots__/`
- `npm run test:visual:update` script to regenerate baselines

#### UI — Accessibility (`src/ui/tests/a11y/`)
- `accessibility.spec.ts` — 7 WCAG 2.1 AA compliance tests using `@axe-core/playwright`:
  - Login (default + error state), Inventory, Cart, Checkout step 1, Checkout step 2, Confirmation
- Only `critical` and `serious` violations fail the test — `moderate` and `minor` are reported only
- Custom `runA11yCheck()` helper with configurable rule exclusions for flexibility

#### CI
- Added `test-visual` job — runs visual regression suite, uploads report artifact
- Added `test-a11y` job — runs accessibility suite, uploads report artifact
- Pipeline now has 4 parallel jobs: `test-api`, `test-ui` (matrix), `test-visual`, `test-a11y`

#### Config
- `playwright.config.ts` — added `visual-tests` and `a11y-tests` projects
- `expect.toHaveScreenshot` config — `maxDiffPixelRatio: 0.02`, `animations: "disabled"`
- `package.json` — bumped to `v1.4.0`, added `@axe-core/playwright`, added `test:visual`, `test:a11y`, `test:visual:update` scripts

---

## [1.3.0] — 2026-04-16
### `fix: custom fixtures, AJV schema validation, CI matrix and tsconfig hardening`

#### Framework — Fixtures
- `src/ui/fixtures/index.ts` — custom `test.extend()` fixtures: POM instances, `authenticatedPage`, `apiClient`

#### Framework — Schema Validation
- `ajvValidator.ts` — AJV v8 + `ajv-formats` replacing basic `schemaValidator.ts`
- `auth.spec.ts`, `users.spec.ts` — migrated to AJV validators

#### UI Tests
- `login.spec.ts`, `inventory.spec.ts` — migrated to fixture-based imports

#### CI
- Matrix runs: `ui-tests` (Chromium) + `ui-tests-firefox` (Firefox)
- Report artifacts uploaded per job (7-day retention)

#### Config
- Added `ui-tests-firefox` project, `test:firefox` script
- `tsconfig.json` — `ignoreDeprecations: "5.0"`, `rootDir` removed

---

## [1.2.0] — 2026-04-14
### `feat: add cross-layer contract validation and extended API edge cases`

- `contract.spec.ts` — 11 contract tests: API consistency, UI data contracts, token lifecycle
- `edge-cases.spec.ts` — 10 boundary tests: out-of-range pages, timing, sequential CRUD, error shapes

---

## [1.1.0] — 2026-04-11
### `feat: expand UI coverage with cart, checkout and E2E purchase flows`

- `cart.spec.ts` — 7 cases, `checkout.spec.ts` — 10 cases, `e2e-purchase.spec.ts` — 3 E2E journeys

---

## [1.0.0] — 2026-04-08
### `feat: bootstrap hybrid framework with UI smoke tests and API foundation`

- Dual-project Playwright config, TypeScript strict mode, POM for all SauceDemo flows
- 16 UI tests (login + inventory), 16 API tests (auth + CRUD), GitHub Actions CI

---

## Roadmap

| Version | Planned Release |
|---|---|
| `2.0.0` | Allure reporting, parallel execution, full README polish with architecture diagram |

---

[Unreleased]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/releases/tag/v1.0.0
