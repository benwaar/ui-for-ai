# Accessibility Tooling Options – MCP, CI/CD, and Linters

## Table of Contents
- [What is MCP?](#what-is-mcp)
- [What are Accessibility Agents?](#what-are-accessibility-agents)
- [MCP with Claude – Free vs Paid](#️⃣-mcp-with-claude--free-vs-paid)
- [CI/CD Accessibility Pipelines](#️⃣-cicd-accessibility-pipelines--free-vs-paid)
- [MCP vs Linters vs CI/CD](#mcp-vs-linters-vs-cicd)
- [Recommended Setup](#-recommended-balanced-setup-angular-team)
- [Testing MCP](#testing-mcp)
- [Testing Accessibility Agents](#testing-accessibility-agents)
- [Implementation Status](#-implementation-status-this-project)

---

## What is MCP?

**MCP (Model Context Protocol)** is a standard that lets AI assistants interact with external tools and data sources.

### Plain English Explanation

Think of it like giving Claude "hands":
- **Without MCP:** Claude can only read/write in the chat interface
- **With MCP:** Claude can read your files, run commands, open web pages, and use accessibility testing tools

### For Accessibility Testing

With MCP configured, you can ask Claude Desktop:
> "Audit https://example.com for WCAG 2.2 AA violations"

Claude will:
1. Use the a11y-mcp server to launch a browser
2. Run axe-core accessibility tests
3. Analyze results and explain violations
4. Suggest fixes with code examples

### MCP Servers in This Project

Two MCP servers are configured:
- **Filesystem MCP:** Read/write project files
- **A11y MCP:** Run accessibility audits on URLs

**Important Limitation:** The a11y MCP server runs in isolation and cannot access `localhost` on your machine. It can only audit publicly accessible URLs or URLs exposed via tunneling tools (ngrok, localtunnel, etc.).

---

## What are Accessibility Agents?

**Taylor Arndt's a11y-agent-team** is a collection of 55 specialized AI agents built by a blind developer specifically for accessibility work.

### How They Work

Unlike general-purpose AI, these agents have:
- **Persistent accessibility expertise** - They can't "forget" WCAG rules
- **Specialized roles** - Each agent focuses on specific domains
- **Enforcement hooks** - They proactively block inaccessible code before it's written

### The 6 Core Agents

| Agent | What It Does |
|-------|--------------|
| **accessibility-lead** | Coordinates the team, delegates to specialists |
| **aria-specialist** | ARIA roles, states, properties, relationships |
| **modal-specialist** | Focus trapping, escape behavior, backdrop |
| **contrast-master** | WCAG AA/AAA color ratios |
| **keyboard-navigator** | Tab order, shortcuts, focus indicators |
| **live-region-controller** | Screen reader announcements |

### Enforcement Hooks

The agents include 3 hooks that run automatically:

1. **UserPromptSubmit Hook** - Detects web projects and injects accessibility guidance
2. **PreToolUse Hook** - Blocks edits to HTML/templates without accessibility review
3. **PostToolUse Hook** - Unlocks editing after accessibility-lead approves changes

**Example:** If you try to edit a component template, Claude Code will be blocked and required to call the accessibility-lead agent first.

---

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

# MCP vs Linters vs CI/CD

## When to Use Each Tool

**Linters (ESLint, html-validate)**
- ✅ Fast feedback during coding
- ✅ Catches missing alt text, invalid ARIA
- ❌ Can't detect color contrast
- ❌ Can't test runtime behavior
- **Use for:** Pre-commit checks

**CI/CD (Pa11y in GitHub Actions)**
- ✅ Blocks PRs with violations
- ✅ Tests live app in browser
- ✅ Catches contrast, focus issues
- ❌ Slower (30-60s per run)
- **Use for:** PR gate before merge

**MCP (Claude Desktop + a11y-mcp)**
- ✅ Interactive development workflow
- ✅ Explains violations in context
- ✅ Suggests and applies fixes
- ❌ Manual (not automated)
- **Use for:** Active development and refactoring

**Accessibility Agents (Claude Code)**
- ✅ Proactive prevention
- ✅ Enforces review before edits
- ✅ Deep WCAG expertise
- ❌ Adds step to workflow
- **Use for:** Building new accessible components

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
  - "Run a full axe audit and fix contrast violations."

### Result
- Static + dynamic coverage
- Automated remediation
- Zero license cost
- Intelligent accessibility improvements

---

# Testing MCP

## Prerequisites
- Claude Desktop installed and restarted
- MCP servers showing as connected in Claude Desktop settings

## Test 1: Audit a Public Website

Open Claude Desktop and paste this:

```
Use the a11y MCP server to audit https://example.com for WCAG 2.2 AA violations.
Show me the top 3 most critical issues.
```

**Expected result:** Claude will return a list of accessibility violations with WCAG criteria references.

## Test 2: Audit Your Local App

**Note:** The a11y MCP server runs in isolation and **cannot access localhost** on your machine. To test your local app:

**Option A: Use ngrok or similar tunneling tool**
```bash
# Expose your local server publicly
ngrok http 4200
# Then use the ngrok URL in Claude Desktop
```

**Option B: Deploy to a staging environment**
Use the MCP server to audit your staging/preview URL instead of localhost.


## Test 3: Read Project Files

```
Use the filesystem MCP to read frontend/src/app/components/chatbot/chatbot.component.html
and identify any accessibility issues.
```

**Expected result:** Claude will read the file and point out violations.

## Troubleshooting

If MCP servers show as "disconnected":
1. Check `~/Library/Logs/Claude/mcp.log` for errors
2. Verify nvm wrapper exists: `ls -la ~/.local/bin/npx-with-nvm.sh`
3. Test wrapper manually: `~/.local/bin/npx-with-nvm.sh --version`

---

# Testing Accessibility Agents

## Prerequisites
- Claude Code (VSCode extension or CLI)
- Accessibility agents installed (verify: `ls ~/.claude/agents/accessibility-lead.md`)

## Test 1: Trigger the Enforcement Hook

Try to edit any HTML template file:

1. Open `frontend/src/app/components/chatbot/chatbot.component.html`
2. Ask Claude Code: "Add a new button to this component"
3. **Expected result:** Claude will be blocked by the PreToolUse hook and must:
   - Explain the accessibility implications
   - Follow WCAG best practices
   - Ask for your explicit approval before proceeding

**How It Works:**
- The agents provide accessibility expertise as context/knowledge
- Enforcement hooks block UI edits automatically
- Claude must consider accessibility before making changes
- You provide final approval for edits

## Test 2: Proper Workflow with Agent Review

Ask Claude Code:

```
Review frontend/src/app/components/chatbot/chatbot.component.html for accessibility
and suggest improvements for keyboard navigation.
```

**Expected result:**
- accessibility-lead agent is automatically invoked
- Specialized agents (keyboard-navigator, aria-specialist) provide review
- Specific WCAG violations identified
- Code fixes suggested

## Test 3: Build New Component with Accessibility

```
Build a new Angular form component with:
- Email and password fields
- Accessible error messages
- WCAG 2.2 AA compliance
```

**Expected result:**
- accessibility-lead coordinates the work
- forms-specialist ensures proper labels
- aria-specialist adds ARIA attributes
- contrast-master validates color ratios
- Component is built with accessibility baked in

## Verify Agents Are Active

Check for the enforcement hook message when you start a task:

```
INSTRUCTION: MANDATORY ACCESSIBILITY CHECK — YOU MUST FOLLOW THIS
DETECTED: This is a web project. Accessibility agents are ALWAYS required here.
```

If you see this message, the agents are active and enforcing accessibility reviews.

---

# ✅ Implementation Status (This Project)

## Completed
- ✅ @angular-eslint with a11y rules
- ✅ html-validate with WCAG rules
- ✅ GitHub Actions CI pipeline
- ✅ ESLint + html-validate running in CI
- ✅ Pa11y-ci installed with axe + htmlcs runners
- ✅ npm scripts for local a11y testing

## Completed (Free Setup Additions)
- ✅ **Pa11y running in CI pipeline** - blocks PRs with violations
- ✅ **Taylor Arndt's a11y-agent-team** - 55 agents with enforcement hooks
- ✅ **MCP for Claude Desktop** - fully working with nvm wrapper

## Test Results

### ✅ Pa11y CI (Verified Working)
- **Status:** Active and blocking PRs
- **Test result:** Successfully caught missing alt text in test PR
- **Error:** `@angular-eslint/template/alt-text` blocked at linting step
- **Proof:** Multi-layer protection working (ESLint + Pa11y)

### ✅ Accessibility Agents (Verified Working)
- **Status:** Active with enforcement hooks
- **Evidence:** PreToolUse hook blocked UI edit without accessibility review
- **What it does:** Requires accessibility-lead review before editing HTML/templates
- **Installation:** 55 agents + 3 enforcement hooks

### ✅ MCP for Claude Desktop (Verified Working)
- **Status:** ✅ Both servers connected and operational
- **Solution:** Created nvm wrapper script at `~/.local/bin/npx-with-nvm.sh`
- **Servers active:**
  - Filesystem MCP (v0.2.0) - read/write project files
  - A11y MCP (v1.0.0) - audit webpages, get WCAG summaries
- **Config:** `~/Library/Application Support/Claude/claude_desktop_config.json`

## Manual Test Commands

```bash
# Test Pa11y locally
cd frontend
npm start &
npx wait-on http://localhost:4200
npm run test:a11y

# Test linting
npm run lint

# Test HTML validation
npm run validate:html
```
