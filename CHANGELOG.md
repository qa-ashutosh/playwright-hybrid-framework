# Changelog

All notable changes to **playwright-hybrid-framework** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · Versioning follows [SemVer](https://semver.org/).

---

## [2.0.0] — 2026-04-19
### `feat: Allure reporting, parallel execution and full README polish`

#### Reporting — Allure
- Integrated `allure-playwright` reporter alongside existing HTML reporter
- Both reporters run simultaneously on every test execution
- `allure:generate`, `allure:open`, `allure:serve` npm scripts added
- CI `publish-allure-report` job merges results from all 4 test jobs into a single combined report (30-day artifact retention)

#### Performance — Parallel Execution
- `fullyParallel: true` — all tests now run in parallel within each project
- `workers` bumped from 1 → 2 (local) and 2 → 4 (CI) for faster execution
- No test isolation issues — all tests verified to be independent

#### CI
- Added `publish-allure-report` job — runs after all test jobs complete (`needs` + `if: always()`)
- Downloads all `allure-results-*` artifacts, merges, generates combined Allure HTML report
- Per-job HTML reports now also uploaded as separate artifacts alongside Allure results

#### Documentation
- Full README rewrite with architecture diagram, complete test coverage table, CI pipeline diagram, key design decisions section
- Version badge updated to `2.0.0`, test count badge updated to `91 cases`
- Added Visual and A11y badges to shield row

#### Config
- `playwright.config.ts` — `allure-playwright` reporter added, `fullyParallel: true`, workers `2/4`
- `package.json` — bumped to `v2.0.0`, added `allure-playwright` and `allure-commandline`

---

## [1.4.0] — 2026-04-17
### `feat: add visual regression and accessibility test suites`

#### UI — Visual Regression
- `visual/visual.spec.ts` — 7 baseline screenshot tests: login, login error, inventory (standard/problem/sorted), cart, checkout confirmation
- `maxDiffPixelRatio: 0.02`, `animations: "disabled"` for stable diffs

#### UI — Accessibility
- `a11y/accessibility.spec.ts` — 7 WCAG 2.1 AA tests using `@axe-core/playwright`
- Only critical/serious violations fail — known SauceDemo defects excluded via `disableRules` with inline documentation

#### CI
- Added `test-visual` and `test-a11y` jobs — 4 total parallel jobs

---

## [1.3.0] — 2026-04-16
### `fix: custom fixtures, AJV schema validation, CI matrix and tsconfig hardening`

- `src/ui/fixtures/index.ts` — `test.extend()` fixtures: POM instances, `authenticatedPage`, `apiClient`
- `ajvValidator.ts` — AJV v8 + `ajv-formats` with email/URI format validation
- `login.spec.ts`, `inventory.spec.ts` — migrated to fixtures
- `auth.spec.ts`, `users.spec.ts` — migrated to AJV validators
- CI matrix: Chromium + Firefox, report artifacts per job

---

## [1.2.0] — 2026-04-14
### `feat: add cross-layer contract validation and extended API edge cases`

- `contract.spec.ts` — 11 contract tests across API + UI layers
- `edge-cases.spec.ts` — 10 boundary and timing edge cases

---

## [1.1.0] — 2026-04-11
### `feat: expand UI coverage with cart, checkout and E2E purchase flows`

- `cart.spec.ts` — 7 cases, `checkout.spec.ts` — 10 cases, `e2e-purchase.spec.ts` — 3 E2E journeys

---

## [1.0.0] — 2026-04-08
### `feat: bootstrap hybrid framework with UI smoke tests and API foundation`

- Dual-project Playwright config, TypeScript strict mode, full POM layer
- 16 UI tests (login + inventory), 16 API tests (auth + CRUD), GitHub Actions CI

---

[2.0.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.4.0...v2.0.0
[1.4.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/qa-ashutosh/playwright-hybrid-framework/releases/tag/v1.0.0
