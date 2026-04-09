# Changelog

All notable changes to **playwright-hybrid-framework** are documented in this file.
Follows [Semantic Versioning](https://semver.org/) and [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) conventions.

| Bump | When |
|---|---|
| `PATCH` x.x.**1** | Bug fix, locator fix, config tweak |
| `MINOR` x.**1**.0 | New feature, new test suite, new tool |
| `MAJOR` **1**.0.0 | Breaking framework restructure |

---

## [Unreleased]

---

## [1.0.0] — 2026-04-08

> Initial release — hybrid UI + API framework bootstrapped with full POM layer, ReqRes API client, and smoke test suites.

### Added
- **Framework config** — `playwright.config.ts` with dual projects (`ui-tests` on Chromium/SauceDemo, `api-tests` on ReqRes.in), HTML reporter, screenshot/video on failure, CI retry support

- **TypeScript setup** — strict `tsconfig.json` with path aliases (`@pages`, `@api`, `@shared`, `@fixtures`)
- **Shared types** — interfaces for all SauceDemo and ReqRes domain objects (`SauceUser`, `CheckoutInfo`, `ReqResUser`, `ReqResListResponse`, auth payloads, etc.)
- **Shared config** — `env.ts` centralising all environment variables with `.env` / dotenv support and safe fallback defaults
- **Shared helpers** — `utils.ts` (price parser, normalizer, URL builder, network idle wait); `schemaValidator.ts` (lightweight field + type validator, AJV replacement planned for v1.3.0)
- **Test data** — `saucedemo.json` (users, checkout scenarios, product expectations); `reqres.json` (auth payloads, user IDs, CRUD payloads)
- **Page Objects** — `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage` covering all SauceDemo flows
- **UI Tests** — `login.spec.ts` (7 cases: happy path, invalid creds, locked user, empty fields, redirect, logout); `inventory.spec.ts` (9 cases: product count, all 4 sort options, cart badge, `problem_user` negative test)
- **API Client** — `BaseApiClient` with centralised `defaultHeaders`, per-request header override support, correct `Content-Type` stripping on `GET`/`DELETE`; `UserApiClient` covering all ReqRes endpoints (auth, CRUD, delay)
- **API Schemas** — `reqres.schema.json` defining response shapes for all ReqRes types (user, list, login, register, create, update, error)
- **API Tests** — `auth.spec.ts` (5 cases: login/register success + schema validation, missing password, unregistered email); `users.spec.ts` (11 cases: pagination meta, no-overlap across pages, per-user schema, 404, delay resilience, POST/PUT/PATCH/DELETE)
- **CI** — `.github/workflows/ci.yml` with Node 20, Chromium install, full test run on push/PR to `main`

### Roadmap

| Version | Planned |
|---|---|
| `1.1.0` | Cart + Checkout UI tests, data-driven expansion |
| `1.2.0` | Cross-layer contract validation (UI ↔ API) |
| `1.3.0` | Custom fixtures, AJV schema validation, CI matrix runs |
| `1.4.0` | Visual regression, accessibility checks (`@axe-core/playwright`) |
| `2.0.0` | Allure reporting, parallel execution, full README with badges |

---

[Unreleased]: https://github.com/yourusername/playwright-hybrid-framework/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/playwright-hybrid-framework/releases/tag/v1.0.0
