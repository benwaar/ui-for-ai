# Accessibility Tooling Options – MCP, CI/CD, and Linters

## 1️⃣ MCP with Claude – Free vs Paid

### 🧠 What MCP Gives You

MCP (Model Context Protocol) allows Claude to interact with:

- Your filesystem  
- Your terminal  
- A browser (Playwright / Puppeteer)  
- External tools (axe-core, Pa11y, etc.)

Instead of just explaining problems, Claude can:

- Run audits  
- Read results  
- Edit files  
- Refactor code  
- Re-run validation  

It becomes an active accessibility agent rather than just a chatbot.

---

## 🆓 Free MCP Setup

### Tools
- Claude (free or paid tier)
- Filesystem MCP
- Terminal MCP
- Playwright MCP (optional)
- html-validate
- @angular-eslint
- Pa11y & axe-core https://github.com/pa11y/pa11y  
- (alt) https://github.com/priyankark/a11y-mcp  

### What You Get
- Claude runs your linters
- Claude runs axe-core audits
- Claude fixes Angular templates + SCSS
- Claude explains WCAG reasoning
- Fully customizable workflow

### Limitations
- Requires setup
- Slightly slower than pure static linting
- Not as polished as commercial tooling

**Best for:** Dev teams who want automation + intelligence without licensing cost.

---

## 💳 Paid Option – Claude + Commercial Tools

Using:
- axe DevTools Linter (CLI/Connector license)

### What You Get
- 40+ axe-core-backed static rules
- Very low false positives
- Fast pre-commit & CI enforcement
- Enterprise reporting

**Best for:**
- Regulated industries
- Large teams
- Legal compliance requirements (WCAG AA/AAA)

---

# 2️⃣ CI/CD Accessibility Pipelines – Free vs Paid

## 🆓 Free CI/CD Stack

Works with:
- GitHub Actions
- GitLab CI
- Azure DevOps

### Static Checks (Fast)
- `ng lint`
- html-validate

### Dynamic Checks (Stronger)
- Pa11y
- axe-core via Playwright
- Cypress + axe-core

### What It Gives You
- Blocks PRs with violations
- Catches color contrast issues
- Detects focus traps
- Flags ARIA misuse
- Generates reports

**Cost:** $0  
**Tradeoff:** You build and maintain it yourself.

---

## 💳 Paid CI/CD Option

Using:
- axe DevTools Linter

### What You Get
- Source-code scanning (no browser required)
- Faster pipeline execution
- Centralized dashboards
- Enterprise compliance reporting

**Cost:** License required  
**Tradeoff:** Less flexible, more turnkey.

---

# 3️⃣ What MCP Gives You Over a Linter

| Feature | Static Linter | MCP + Claude |
|----------|---------------|---------------|
| Missing alt detection | ✅ | ✅ |
| Color contrast detection | ❌ | ✅ (via axe-core) |
| Cross-file Angular logic analysis | ❌ | ✅ |
| Auto-refactor templates | ❌ | ✅ |
| Fix SCSS contrast issues | ❌ | ✅ |
| Explain WCAG rule in context | Minimal | Deep explanation |
| Run audit + fix loop automatically | ❌ | ✅ |
| Works in CI | ✅ | Possible but more complex |

---

# 🎯 Recommended Balanced Setup (Angular Team)

## Pre-commit
- @angular-eslint
- html-validate

## CI
- Pa11y (axe-core)
- PR blocking on violations

## Dev-Time
- Claude with Filesystem + Terminal MCP
- Example workflow:
  - “Run a full axe audit and fix contrast violations.”

### Result
- Static + dynamic coverage
- Automated remediation
- Zero license cost
- Intelligent accessibility improvements
