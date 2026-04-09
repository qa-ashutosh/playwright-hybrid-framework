# playwright-hybrid-framework

A hybrid UI + API test automation framework built with [Playwright](https://playwright.dev/) and TypeScript.

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
git clone https://github.com/yourusername/playwright-hybrid-framework.git
cd playwright-hybrid-framework
npm install
npx playwright install chromium
```

### Environment Setup

Copy the example env file:

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

### API — ReqRes.in

| Module | Scenarios |
|---|---|
| Auth | Login success/failure, register success/failure, missing fields |
| Users GET | List pagination, single user, 404, delay resilience |
| Users CRUD | POST create, PUT update, PATCH partial, DELETE 204 |
| Schema | All response bodies validated against JSON schemas |

---

## Viewing Reports

```bash
npm run report
```

HTML report is generated at `reports/html-report/index.html`.

---

## Roadmap

- [ ] Cart + Checkout UI test flows
- [ ] Custom Playwright fixtures
- [ ] GitHub Actions CI/CD pipeline
- [ ] Visual regression testing
- [ ] Allure reporting
- [ ] Accessibility checks (`@axe-core/playwright`)
- [ ] Parallel execution (Chromium + Firefox)
