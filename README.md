# Playwright
# 🎭 Playwright Automated Testing - BurgerSystem

## Academic Project: E2E Testing Based on UX/UI Design

This repository contains automated end-to-end (E2E) tests for the BurgerSystem application, designed following professional test case specification standards and aligned with UX/UI design principles.

---

## 📋 Project Overview

**Objective:** Validate critical user flows through automated browser-based testing using Playwright.

**Test Coverage:**
-  **9 Test Cases** across 3 critical user flows
-  **3 Positive Cases** - Happy path validation
-  **3 Negative Cases** - Error handling and validation
-  **3 Edge Cases** - Boundary conditions and special scenarios

**Flows Tested:**
1.  **User Authentication** (Login)
2.  **Product Browsing and Display**
3.  **Shopping Cart Management**

---

##  Project Structure

```
hamburguesa/
├── tests/
│   └── academic/                    # Academic test suite
│       ├── login.spec.js            # Authentication flow tests (TC-001 to TC-003)
│       ├── products.spec.js         # Product display tests (TC-004 to TC-006)
│       └── cart.spec.js             # Shopping cart tests (TC-007 to TC-009)
│
├── test-results/                    # Generated screenshots
│   ├── tc001-before-login.png
│   ├── tc001-after-login.png
│   └── ... (18+ screenshots)
│
├── playwright-report/               # HTML test report
│   └── index.html
│
├── playwright.config.js             # Playwright configuration
├── package.json                     # Dependencies
│
├── TEST_DESIGN_DOCUMENT.md          # 📘 Test case designs and UX analysis
├── TEST_ANALYSIS_REPORT.md          # 📊 Execution results and UX findings
└── README_TESTS.md                  # 📖 This file - Setup and execution guide
```

---

##  Quick Start

### Prerequisites

Before running the tests, ensure you have:

1. **Node.js** (v18 or higher)
   ```bash
   node --version   # Should be v18+
   ```

2. **XAMPP** running (Apache + MySQL)
   - Ensure Apache server is running on `http://localhost`
   - Database should be set up with test data

3. **NPM installed** (comes with Node.js)
   ```bash
   npm --version
   ```

### Installation

1. **Clone or navigate to the project folder:**
   ```bash
   cd C:\xampp\htdocs\hamburguesa
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install chromium
   ```
   *(Installs Chromium browser for testing)*

---

##  Running the Tests

### Run Academic Test Suite

To execute all 9 academic test cases:

```bash
npx playwright test tests/academic/
```

**Expected output:**
```
Running 9 tests using 3 workers

  ✓ [chromium] › login.spec.js:34:7 › TC-001: User can successfully login...
  ✓ [chromium] › login.spec.js:96:7 › TC-002: User receives error message...
  ✓ [chromium] › login.spec.js:161:7 › TC-003: User cannot submit empty...
  ✓ [chromium] › products.spec.js:30:7 › TC-004: Products display correctly...
  ...

  9 passed (1.5m)
```

### Run Specific Test File

**Login tests only:**
```bash
npx playwright test tests/academic/login.spec.js
```

**Product tests only:**
```bash
npx playwright test tests/academic/products.spec.js
```

**Cart tests only:**
```bash
npx playwright test tests/academic/cart.spec.js
```

### Run Single Test Case

To run a specific test by name:
```bash
npx playwright test --grep "TC-001"
```

### Run with UI Mode (Debugging)

To see tests running in browser:
```bash
npx playwright test tests/academic/ --headed
```

### Run in Debug Mode

To step through tests interactively:
```bash
npx playwright test tests/academic/ --debug
```

---

##  Viewing Test Reports

### HTML Report (Recommended)

After running tests, view the detailed HTML report:

```bash
npx playwright show-report
```

This opens an interactive report in your browser showing:
-  Pass/Fail status for each test
-  Execution time
-  Detailed logs and traces

**Manual access:** Open `playwright-report/index.html` in any browser.

### Terminal Output

For quick results in terminal:
```bash
npx playwright test tests/academic/ --reporter=list
```

### Generate JSON Report

For programmatic analysis:
```bash
npx playwright test tests/academic/ --reporter=json > test-results.json
```

---

## 📸 Screenshots and Artifacts

Each test generates screenshots automatically:

- **Before/After states** for each major action
- **Error states** when tests fail
- **Full-page captures** for context

**Location:** `test-results/` folder

**Examples:**
- `tc001-before-login.png` - Login form initial state
- `tc002-error-state.png` - Invalid credentials error display
- `tc007-after-add.png` - Cart after adding product

---

##  Test Cases Reference

### Flow 1: User Authentication 

| Test ID | Description | Type | Priority |
|---------|-------------|------|----------|
| TC-001 | Successful login with valid credentials | POSITIVE | HIGH |
| TC-002 | Error message with invalid credentials | NEGATIVE | HIGH |
| TC-003 | Cannot submit form with empty fields | EDGE | MEDIUM |

### Flow 2: Product Display 

| Test ID | Description | Type | Priority |
|---------|-------------|------|----------|
| TC-004 | Homepage displays product catalog | POSITIVE | HIGH |
| TC-005 | Handles missing product data gracefully | NEGATIVE | MEDIUM |
| TC-006 | Stock status indicators visible | EDGE | MEDIUM |

### Flow 3: Shopping Cart 🛒

| Test ID | Description | Type | Priority |
|---------|-------------|------|----------|
| TC-007 | Add product to cart successfully | POSITIVE | HIGH |
| TC-008 | Remove product from cart | NEGATIVE | HIGH |
| TC-009 | Cart state persists after page refresh | EDGE | MEDIUM |

---

##  Configuration

### Playwright Config (`playwright.config.js`)

Key settings:

- **Base URL:** `http://localhost/hamburguesa/src/public`
- **Timeout:** 30 seconds per test
- **Retries:** 0 (for academic consistency)
- **Browser:** Chromium
- **Workers:** 3 (parallel execution)
- **Reporter:** HTML + List

### Environment Variables

Create `.env` file if needed:
```env
BASE_URL=http://localhost/hamburguesa/src/public
TEST_USER_EMAIL=test@test.com
TEST_USER_PASSWORD=test123
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Cannot find Playwright

**Error:** `'playwright' is not recognized...`

**Solution:**
```bash
npm install
npx playwright install
```

#### 2. XAMPP/Apache not running

**Error:** `net::ERR_CONNECTION_REFUSED`

**Solution:**
- Open XAMPP Control Panel
- Start Apache service
- Verify: Open `http://localhost` in browser

#### 3. Test timeout

**Error:** `Test timeout of 30000ms exceeded`

**Solution:**
- Check if server is responding
- Increase timeout in test:
  ```javascript
  test.setTimeout(60000); // 60 seconds
  ```

#### 4. Element not found

**Error:** `Locator not found: button:has-text("Login")`

**Solution:**
- Verify page loaded completely
- Check if element selector matches your HTML
- Tests use multiple fallback selectors

#### 5. Database/Product data missing

**Error:** Tests fail because no products are displayed

**Solution:**
- Ensure database has test products
- Run database setup scripts:
  ```bash
  php src/setup/setup_bd.php
  ```

---

##  Additional Documentation

### For Test Design Details
See **`TEST_DESIGN_DOCUMENT.md`** for:
- UX flow analysis
- Detailed test case specifications
- Expected results and preconditions

### For Test Results and UX Findings
See **`TEST_ANALYSIS_REPORT.md`** for:
- Execution results breakdown
- UX issues discovered
- Recommendations for improvement
- Reflection on testing process

---

##  Academic Deliverables Checklist

 **Test Design Document** (PDF Ready)
- [x] UX flow descriptions
- [x] 9 structured test cases
- [x] Coverage explanation

 **Source Code** (Git Repository)
- [x] Playwright configuration
- [x] All automated tests
- [x] Proper folder structure
- [x] README with instructions (this file)

 **Test Report**
- [x] Generated HTML report
- [x] Screenshots of execution results
- [x] Analysis document

---

##  Contributing

This is an academic project. For improvements:

1. Fork the repository
2. Create a feature branch
3. Follow existing test patterns
4. Ensure all tests pass before committing
5. Submit pull request with clear description

---

## 📄 License

Academic project - Educational use only

---

##  Support

For questions or issues:

1. Check **TEST_DESIGN_DOCUMENT.md** for test specifications
2. Review **TEST_ANALYSIS_REPORT.md** for known issues
3. Consult Playwright documentation: https://playwright.dev
4. Contact course instructor

---

##  Key Features of This Test Suite

✨ **User-Centric:** Tests validate UX behavior, not just technical functionality  
✨ **Robust:** Multiple fallback selectors prevent brittleness  
✨ **Visual:** Screenshots provide evidence and debugging context  
✨ **Well-Documented:** Clear comments explain test intent  
✨ **Professional:** Follows industry best practices (Page Object Model patterns)  
✨ **Academic Compliant:** Meets all course requirements  

---

**Version:** 1.0  
**Last Updated:** March 9, 2026  
**Playwright Version:** 1.48.2  
**Node Version:** v18+

---

## Quick Command Reference

```bash
# Install everything
npm install && npx playwright install chromium

# Run all academic tests
npx playwright test tests/academic/

# Run with visible browser
npx playwright test tests/academic/ --headed

# Debug mode
npx playwright test tests/academic/ --debug

# View report
npx playwright show-report

# Run specific test
npx playwright test --grep "TC-001"

# Run specific file
npx playwright test tests/academic/login.spec.js

# Update snapshots (if using visual testing)
npx playwright test --update-snapshots
```

---

