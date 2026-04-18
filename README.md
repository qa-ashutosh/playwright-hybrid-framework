# playwright-hybrid-framework

<div align="center">

<!-- CI/CD -->
![CI](https://github.com/qa-ashutosh/playwright-hybrid-framework/actions/workflows/ci.yml/badge.svg)

<!-- Tech Stack -->
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)

<!-- Framework Info -->
![Version](https://img.shields.io/badge/version-2.0.0-blue?style=flat)
![Tests](https://img.shields.io/badge/tests-158%20cases-brightgreen?style=flat)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

<!-- Testing Types -->
![UI Testing](https://img.shields.io/badge/UI_Testing-SauceDemo-E2441C?style=flat)
![API Testing](https://img.shields.io/badge/API_Testing-ReqRes.in-6C47FF?style=flat)
![Visual](https://img.shields.io/badge/Visual-Regression-orange?style=flat)
![A11y](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-blue?style=flat)
![POM](https://img.shields.io/badge/Pattern-Page_Object_Model-blueviolet?style=flat)

</div>

---

A production-grade hybrid UI + API test automation framework built with [Playwright](https://playwright.dev/) and TypeScript. Covers end-to-end UI flows, REST API validation, cross-layer contract testing, visual regression, accessibility checks, and full CI/CD integration with Allure reporting.

**System Under Test:**
- UI → [SauceDemo](https://www.saucedemo.com) — e-commerce demo app
- API → [ReqRes.in](https://reqres.in) — hosted REST API

---

## Architecture

```
playwright-hybrid-framework/
├── src/
│   ├── ui/
│   │   ├── pages/              # Page Object Model classes
│   │   ├── fixtures/           # Custom Playwright fixtures
│   │   └── tests/
│   │       ├── *.spec.ts       # UI functional tests
│   │       ├── visual/         # Visual regression tests
│   │       └── a11y/           # Accessibility tests
│   ├── api/
│   │   ├── clients/            # BaseApiClient + UserApiClient
│   │   ├── schemas/            # JSON schema definitions
│   │   └── tests/              # API test specs
│   └── shared/
│       ├── config/             # Environment config
│       ├── helpers/            # AJV validator + utilities
│       ├── data/               # JSON test data
│       └── types/              # TypeScript interfaces
├── .github/workflows/          # CI/CD — 5 parallel jobs
├── allure-results/             # Raw Allure data
├── allure-report/              # Generated Allure HTML report
├── reports/html-report/        # Playwright HTML report
└── visual-snapshots/           # Baseline screenshots
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Playwright | UI + API test execution |
| TypeScript | Type-safe test code |
| Page Object Model | UI abstraction layer |
| AJV v8 + ajv-formats | JSON schema validation with email/URI format checks |
| axe-core / @axe-core/playwright | WCAG 2.1 AA accessibility checks |
| Allure | Rich test reporting with history and trends |
| GitHub Actions | CI/CD — parallel matrix execution |

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- [Allure CLI](https://docs.qameta.io/allure/#_installing_a_commandline) (optional, for local Allure reports)

### Installation

```bash
git clone https://github.com/qa-ashutosh/playwright-hybrid-framework.git
cd playwright-hybrid-framework
npm install
npx playwright install chromium firefox
```

### Environment Setup

```bash
cp .env.example .env
```

---

## Running Tests

```bash
# All tests
npm test

# By suite
npm run test:ui          # UI tests — Chromium
npm run test:firefox     # UI tests — Firefox
npm run test:api         # API tests
npm run test:visual      # Visual regression
npm run test:a11y        # Accessibility

# Development
npm run test:headed      # Browser visible
npm run test:debug       # Step-through debugger

# Visual baselines
npm run test:visual:update   # Regenerate baseline screenshots
```

---

## Test Coverage

### UI — SauceDemo (63 cases)

| Suite | Cases | Highlights |
|---|---|---|
| Login | 7 | Valid/invalid/locked/empty, redirect, logout |
| Inventory | 9 | Product count, all 4 sort options, cart badge, problem_user images |
| Cart | 7 | Empty state, add/remove, persistence, navigation |
| Checkout | 10 | Happy path, price math, all 3 validation errors, problem_user defects |
| E2E Purchase | 3 | Single item, multi-item, remove then buy |
| Visual | 7 | Baseline screenshots for all major pages + problem_user diff |
| Accessibility | 7 | WCAG 2.1 AA — all pages, known SauceDemo defects documented |

### API — ReqRes.in (42 cases)

| Suite | Cases | Highlights |
|---|---|---|
| Auth | 5 | Login/register success and 400 error cases |
| Users CRUD | 11 | Full GET/POST/PUT/PATCH/DELETE coverage |
| Contract | 11 | Payload echo, token lifecycle, email/URI format, UI↔API consistency |
| Edge Cases | 10 | Boundary pages, timing, sequential ops, error shapes |
| Schema | all | AJV v8 validation with email + URI format checks on every response |

---

## Reporting

### Playwright HTML Report
```bash
npm run report
# Opens reports/html-report/index.html
```

### Allure Report (local)
```bash
npm run allure:serve
# Serves live report at http://localhost:port
```

### CI Reports
All test jobs upload artifacts to GitHub Actions:
- Per-suite HTML reports (7-day retention)
- Combined Allure report across all suites (30-day retention)

---

## CI/CD Pipeline

5 parallel jobs on every push and PR:

```
push / PR to main
       │
       ├── test-api          (ReqRes.in — API + contract + edge cases)
       ├── test-ui            (matrix: Chromium + Firefox)
       ├── test-visual        (visual regression — Chromium)
       ├── test-a11y          (WCAG 2.1 AA — Chromium)
       └── publish-allure     (merges all results → combined report)
```

---

## Key Design Decisions

**Custom fixtures** — `test.extend()` eliminates POM boilerplate. `authenticatedPage` handles login + teardown automatically.

**AJV schema validation** — strict JSON Schema with `format: "email"` and `format: "uri"` catches more than field presence checks alone.

**Known defects documented** — SauceDemo a11y violations (`button-name`, `select-name`) are excluded via `disableRules` with inline comments explaining the decision — distinguishing app defects from test failures.

**Visual baselines committed** — snapshot files live in the repo so CI can diff deterministically without a separate storage layer.

---

## License

[MIT](LICENSE)

---

### If this saves you time, consider giving it a ⭐ — it helps more people discover it.
