# 🏇 Horse Racing Game

A simulation game built with **Vue 3**, powered by **Vite** and **Pinia**. This project utilizes modern frontend tooling including **Tailwind CSS v4**, **TypeScript**, and robust testing strategies with **Vitest** and **Playwright**.

## 🛠 Tech Stack

* **Framework:** [Vue 3](https://vuejs.org/) (Composition API)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **State Management:** [Pinia](https://pinia.vuejs.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Validation:** [Zod](https://zod.dev/)
* **Testing:** Vitest (Unit) & Playwright (E2E)
* **Language:** TypeScript

## 📋 Prerequisites

Please ensure you have **Node.js** installed with one of the following versions (as specified in `package.json` engines):

* `^20.19.0`
* `>=22.12.0`

## 🚀 Getting Started

1. **Clone the repository:**
```bash
git clone <repository-url>
cd horse-racing-game

```


2. **Install dependencies:**
```bash
npm install

```
```bash
npx playwright install   

```


3. **Start the development server:**
```bash
npm run dev

```


The application will be available at `http://localhost:5173`.

## 🧪 Testing

This project employs a comprehensive testing strategy using both Unit and End-to-End tests.

### Unit Testing (Vitest)

Run unit tests for components and logic (using `jsdom` environment).

```bash
# Run tests
npm run test:unit

# Run tests with code coverage report (v8 provider)
npm run test:unit:coverage

```

### E2E Testing (Playwright)

End-to-End tests simulate real user interactions.

```bash
# Run E2E tests in headless mode
npm run test:e2e

# Open Playwright UI mode (interactive debugger)
npm run test:e2e:ui

# View the HTML report of the last run
npm run test:e2e:report

```

> **Note:** The project includes `monocart-reporter` for advanced E2E coverage reporting.

## 📦 Production Build

To build the application for production. This script runs type-checking (`vue-tsc`) before building to ensure type safety.

```bash
npm run build

```

To preview the production build locally:

```bash
npm run preview

```

## 🎨 Code Quality

We use ESLint and Prettier to maintain code quality and consistency.

```bash
# Lint and fix files
npm run lint

# Format files using Prettier
npm run format

```

## 📂 Project Scripts Overview

| Script | Description |
| --- | --- |
| `dev` | Starts the Vite development server. |
| `build` | Type-checks and builds the project for production. |
| `preview` | Serves the production build locally. |
| `test:unit` | Runs unit tests using Vitest. |
| `test:unit:coverage` | Generates a test coverage report. |
| `test:e2e` | Runs E2E tests using Playwright. |
| `test:e2e:ui` | Opens Playwright's interactive UI mode. |
| `lint` | Runs ESLint with auto-fix enabled. |
| `type-check` | Runs TypeScript type checking without emitting files. |