# Playwright API Testing Framework

A clean, maintainable, and beginner-friendly API testing framework using Playwright, TypeScript, and Allure reports. This project demonstrates best practices for API testing, including schema validation, response verification, and clear reporting.

## Getting Started

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
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

## Running Tests

- **Run all tests:**
  ```sh
  npm run test
  ```
- **Run tests and generate Allure report:**
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

## What's Included

- **TypeScript-based API tests** using Playwright Test
- **GoRest API client abstraction**
- **JSON schema validation** with Ajv
- **Allure reporting** for clear, actionable test results
- **Arrange/Act/Assert pattern** in all test files
- **Environment variable support** for secure token management
- **Example test** for GET /users/:id with schema validation

## Folder Structure

```
src/
  api/        # API client abstraction
  schemas/    # JSON schema definitions
  tests/      # Test files
  utils/      # Helpers (e.g., schema validation)
```

## Requirements
- Node.js
- npm
- GoRest API token

## Contributing
Pull requests and suggestions are welcome!

---

For more details, see the example test in `src/tests/getUser.spec.ts`.
