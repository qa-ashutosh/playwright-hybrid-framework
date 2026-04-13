# playwright-hybrid-framework

<div align="center">

<!-- CI/CD -->
![CI](https://github.com/qa-ashutosh/playwright-hybrid-framework/actions/workflows/ci.yml/badge.svg)

<!-- Tech Stack -->
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)

<!-- Framework Info -->
![Version](https://img.shields.io/badge/version-1.2.0-blue?style=flat)
![Tests](https://img.shields.io/badge/tests-63%20cases-brightgreen?style=flat)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

<!-- Testing Type -->
![UI Testing](https://img.shields.io/badge/UI_Testing-SauceDemo-E2441C?style=flat)
![API Testing](https://img.shields.io/badge/API_Testing-ReqRes.in-6C47FF?style=flat)
![POM](https://img.shields.io/badge/Pattern-Page_Object_Model-blueviolet?style=flat)

</div>

---

A hybrid UI + API test automation framework built with [Playwright](https://playwright.dev/) and TypeScript — covering end-to-end UI flows, REST API validation, cross-layer contract testing, and CI/CD integration.

**System Under Test:**
- UI → [SauceDemo](https://www.saucedemo.com) — e-commerce demo app
- API → [ReqRes.in](https://reqres.in) — hosted REST API

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Playwright | UI + API test execution |
| TypeScript | Type-safe test code |
| Page Object Model | UI abstraction layer |
| ReqRes.in | REST API under test |
| GitHub Actions | CI/CD pipeline |
| HTML Reporter | Test reporting |

---

## Project Structure

```
playwright-hybrid-framework/
├── src/
│   ├── ui/
│   │   ├── pages/        # Page Object Model classes
│   │   ├── tests/        # UI test specs
│   │   └── fixtures/     # Custom Playwright fixtures (coming soon)
│   ├── api/
│   │   ├── clients/      # API client classes
│   │   ├── tests/        # API test specs
│   │   └── schemas/      # JSON schema definitions
│   └── shared/
│       ├── config/       # Environment config
│       ├── helpers/      # Shared utilities
│       ├── data/         # Test data (JSON)
│       └── types/        # TypeScript interfaces
├── .github/workflows/    # CI/CD pipeline
├── playwright.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation

```bash
git clone https://github.com/qa-ashutosh/playwright-hybrid-framework.git

cd playwright-hybrid-framework

npm install

npx playwright install chromium
```

### Environment Setup

```bash
cp .env.example .env
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run only UI tests
npm run test:ui

# Run only API tests
npm run test:api

# Run in headed mode (browser visible)
npm run test:headed

# Debug mode
npm run test:debug
```

---

## Test Coverage

### UI — SauceDemo

| Module | Scenarios |
|---|---|
| Login | Valid login, invalid creds, locked user, empty fields, redirect, logout |
| Inventory | Product count, sorting (all 4 options), cart badge, problem_user images |
| Cart | Empty state, add/remove items, persistence, navigation |
| Checkout | Happy path, price validation, all error cases, problem_user defects |
| E2E | Single item purchase, multi-item purchase, remove then buy |

### API — ReqRes.in

| Module | Scenarios |
|---|---|
| Auth | Login/register success and 400 error cases |
| Users CRUD | GET list/single, POST, PUT, PATCH, DELETE |
| Schema | All response bodies validated against JSON schemas |
| Contract | Payload echo, token lifecycle, email/URL format validation |
| Edge Cases | Boundary pages, timing, sequential operations, error shape |

---

## Viewing Reports

```bash
npm run report
```

HTML report is generated at `reports/html-report/index.html`.

---

## Roadmap

- [x] Login + Inventory UI tests
- [x] Cart + Checkout UI tests
- [x] E2E purchase flows
- [x] Full API CRUD test suite
- [x] Cross-layer contract validation
- [ ] Custom Playwright fixtures
- [ ] Visual regression testing
- [ ] Accessibility checks (`@axe-core/playwright`)
- [ ] Allure reporting
- [ ] Parallel execution (Chromium + Firefox)

---

## License

[MIT](LICENSE)