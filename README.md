# Playwright API Testing Framework

[![Playwright](https://img.shields.io/badge/Playwright-API%20Testing-green)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![Allure](https://img.shields.io/badge/Allure-Reporting-orange)](https://docs.qameta.io/allure/)

A clean, maintainable, and beginner-friendly API testing framework using Playwright, TypeScript, and Allure reports. This project demonstrates good practices for API testing, including schema validation, response verification, clear reporting, and robust design patterns.

---

## ✨ Features & Design Principles

- **Simple, readable code:** Minimal boilerplate, clear arrange/act/assert pattern
- **Easy to maintain:** Add new endpoints and tests with simple helpers
- **Beginner-friendly:** Intuitive structure and clear documentation
- **Abstraction for readability:** Common API actions are in helpers
- **Comprehensive reporting:** Allure reports with history and stack traces
- **Best practices:** Schema validation, negative/edge case tests, secure token management

---

## 🚀 Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/don-peters/playwright-api-framework.git
   cd playwright-api-framework
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Set up your GoRest API token**
   - Copy `.env.example` to `.env`
   - Add your token to `.env`:
     ```
     GOREST_TOKEN=your_gorest_token_here
     ```

---

## 🧪 Running Tests & Generating Reports

- **Run all tests:**
  ```sh
  npm run test
  ```
- **Run tests and generate Allure report (with history):**
  ```sh
  npm run test:report
  ```
- **Generate Allure report only:**
  ```sh
  npm run report:generate
  ```
- **Open the Allure report:**
  ```sh
  npm run report:open
  ```
- **Clean Allure results and reports:**
  ```sh
  npm run report:clean
  ```

---

## 🗂️ Project Structure

```
src/
  api/        # API client abstraction
  schemas/    # JSON schema definitions
  tests/      # Test files (CRUD, negative, edge cases)
  utils/      # Helpers (API actions, schema validation)
.env.example  # Example environment file
README.md     # Project documentation
```

---

## 🧩 Example Usage

```typescript
// Example: Validate all users in GET /users
const response = await getUserList(request, token);
const users = await response.json();
for (const user of users) {
  const { valid, errors } = validateSchema(userSchema, user);
  expect(valid, `Schema errors: ${JSON.stringify(errors)}`).toBe(true);
}
```

---

## 📋 Included Test Patterns

- **CRUD operations:** Create, update, delete users
- **Negative & edge cases:** Invalid data, duplicate emails, missing fields, unauthorized requests
- **Schema validation:** Ajv with formats for strict response checks
- **Helpers:** All API actions abstracted for clean specs
- **Allure reporting:** History/trends, stack traces, clear pass/fail

---

## 🛡️ Requirements
- Node.js
- npm
- GoRest API token

---

## 🤝 Contributing
Pull requests and suggestions are welcome! Please open an issue or PR for improvements.

---

## 📚 References
- [Playwright Test Docs](https://playwright.dev/docs/test-api-testing)
- [Allure Reporting](https://docs.qameta.io/allure/)
- [Ajv JSON Schema](https://ajv.js.org/)
- [GoRest API](https://gorest.co.in/)

---

For more details, see the example tests in `src/tests/`.
