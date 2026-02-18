# Git Hooks Guide

Automated commit message validation and lightweight repository checks for the UI for AI project.

## Overview

This project uses Git hooks to enforce Conventional Commits and run simple checks. Hooks run automatically when you commit code.

## Installed Hooks

### 1. Pre-Commit Hook

Runs **before** the commit is created to validate repository basics.

**Checks:**
- ✅ **Frontend JSON**: Validates `frontend/package.json` is valid JSON (if present)
- ✅ **Backend presence**: Warns if `backend/requirements.txt` is missing when `backend/` exists
- ✅ **TypeScript compile**: Runs `tsc --noEmit` to check for type errors without generating files
- ✅ **ESLint validation**: Lints staged TypeScript and HTML files using Angular ESLint
- ✅ **HTML validation**: Validates HTML structure and accessibility with html-validate
- ✅ **Unit tests**: Runs Vitest test suite to ensure all tests pass before commit

**When it runs:** Before every `git commit`

**What happens:**
- All checks must pass for the commit to succeed
- If any check fails, the commit is blocked
- You'll see detailed error output to help you fix issues

**Example output (success):**
```
======================================================================
Running pre-commit checks...
======================================================================

🔍 Frontend package.json validation...
✅ Frontend package.json validation passed

🔍 Backend requirements presence...
Note: backend directory present but requirements.txt missing
✅ Backend requirements check passed

======================================================================
✅ All pre-commit checks passed (non-applicable checks were skipped).
======================================================================
```

**Example output (failure):**
```
======================================================================
Running pre-commit checks...
======================================================================

🔍 Frontend package.json validation...
❌ Frontend package.json validation failed

Error: frontend/package.json is not valid JSON

❌ Some pre-commit checks failed
======================================================================

To fix:
  • Frontend: Ensure frontend/package.json is valid JSON
  • Backend: Provide backend/requirements.txt if using Python backend

To skip these checks (NOT RECOMMENDED):
  git commit --no-verify
```

### 2. Pre-Push Hook

Runs **before** pushing to remote repository to ensure code quality and builds successfully.

**Checks:**
- ✅ **UI service code coverage**: Runs `npm run test:coverage` to verify test coverage thresholds
- ✅ **Production build**: Runs `ng build --configuration production` to verify the app builds without errors

**Coverage Approach (Hybrid):**
- **Automated (Pre-Push):** Service coverage with Vitest (Theme Service)
  - Thresholds: Lines 90%, Statements 90%, Functions 90%, Branches 85%
  - Fast execution (~5 seconds)
- **Manual (Pre-Milestone):** Component tests with Angular CLI
  - ChatbotComponent: 38 tests covering initialization, messaging, context, corrections
  - Run manually: `cd frontend && ng test`
  - See "Manual Component Testing" section below

**Why Hybrid Approach?**
- Component tests require Angular's template compiler (not available in Vitest)
- Browser-based testing adds ~50MB dependencies and slower execution
- Service coverage provides fast pre-push validation
- Component tests run manually before major milestones or PR reviews

**When it runs:** Before every `git push`

**What happens:**
- Coverage check runs first (~5-10 seconds)
- If coverage thresholds are met, proceeds to build validation
- If coverage fails, push is blocked with detailed report path
- Build validation runs second (~30 seconds)
- Total time: ~35-40 seconds

**Example output (success):**
```
======================================================================
Running pre-push checks...
======================================================================

🔍 UI service code coverage...
✅ UI service code coverage passed

🔍 Frontend production build...
✅ Frontend production build passed

======================================================================
✅ All pre-push checks passed. Ready to push!
======================================================================
```

**Example output (failure):**
```
======================================================================
Running pre-push checks...
======================================================================

🔍 Frontend production build...
❌ Frontend production build failed

Error: Production build failed

Common issues:
  • Check for TypeScript errors
  • Verify all imports are correct
  • Review Angular template syntax

To debug locally:
  cd frontend && npx ng build

======================================================================
❌ Pre-push checks failed
======================================================================

Fix the issues above before pushing.

To skip this check (NOT RECOMMENDED):
  git push --no-verify
```

**Why this matters:**
- Prevents broken code from reaching collaborators
- Catches build-time errors before deployment
- More thorough than pre-commit TypeScript check (includes template compilation)

### 3. Commit Message Hook

Validates commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) format.

**Format:**
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Valid types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Other changes
- `revert`: Revert a previous commit

**Examples:**
```bash
# Good
git commit -m "feat(chatbot): add confidence indicator"
git commit -m "fix(agent): correct pause/resume behavior"
git commit -m "docs: update UI principles and study plan"

# Bad (will be rejected)
git commit -m "Added stuff"
git commit -m "WIP"
git commit -m "fixed it"
```

### 4. Prepare Commit Message Hook

Provides a commit message template to help you write properly formatted messages.

## Installation

Run the installation script:

```bash
./install-hooks.sh
```

This copies hooks from `hooks/` to `.git/hooks/` and makes them executable.

**Note:** The hooks are installed locally in your `.git/hooks/` directory and are **not** tracked by git. Each developer must run `./install-hooks.sh` after cloning the repository.

## Common Workflows

### Making a Commit

Normal workflow - hooks run automatically:

```bash
git add frontend/src/app/components/chatbot/chatbot.component.ts README.md
git commit -m "feat(chatbot): stream tokens with stop control"
```

The pre-commit hook runs first, then the commit message is validated.

### Skipping Hooks

**⚠️ NOT RECOMMENDED** - Only use when absolutely necessary:

**Skip pre-commit checks:**
```bash
git commit --no-verify -m "feat: emergency hotfix"
```

**Skip pre-push checks (coverage + build):**
```bash
git push --no-verify
```

Use `--no-verify` sparingly and only when you're certain the code is correct.

### Fixing Quality Issues

If pre-commit checks fail:

**frontend/package.json invalid:**
```bash
# Validate JSON structure
python3 -m json.tool frontend/package.json
```

**backend requirements missing:**
```bash
# Add a minimal requirements file (if backend used)
echo -e "flask==3.0.0\nrequests==2.*" > backend/requirements.txt
```

**TypeScript compilation errors:**
```bash
# Run TypeScript check to see full error output
cd frontend
npx tsc --noEmit

# Fix type errors in the reported files
```

**ESLint errors:**
```bash
# Auto-fix most lint issues
cd frontend
npm run lint:fix

# Or check specific file
npx eslint src/path/to/file.ts

# Disable specific rule (use sparingly)
# Add comment above offending line:
// eslint-disable-next-line rule-name
```

**Unit test failures:**
```bash
# Run tests locally to see detailed results
cd frontend
npm test

# Run specific test file
npm test -- chatbot.service.spec.ts

# Update snapshots (if needed)
npm test -- -u
```

**HTML validation failures:**
```bash
# View all issues in HTML files
cd frontend
npm run validate:html

# Common accessibility issues:
#  - Images missing alt attributes
#  - Form inputs without labels
#  - Buttons without accessible names (aria-label or text)
#  - Invalid ARIA attribute usage
#  - Progress bars missing ARIA attributes
#  - Improper element nesting

# Fix patterns:
# <img> → <img alt="description">
# <button><mat-icon>send</mat-icon></button> → <button aria-label="Send message"><mat-icon>send</mat-icon></button>
# <input> → <label>Label<input></label> or <input aria-label="Label">
# <mat-progress-bar> → <mat-progress-bar role="progressbar" [attr.aria-valuenow]="value">
```

**Code coverage failures:**
```bash
# Run coverage locally to see full report
cd frontend
npm run test:coverage

# Open HTML coverage report
open coverage/index.html

# The report shows:
#  - Uncovered lines highlighted in red
#  - Uncovered functions and branches
#  - Per-file coverage percentages

# Common fixes:
#  - Add tests for uncovered functions
#  - Test edge cases and error paths
#  - Test conditional branches (if/else statements)
#  - Test all method parameters and return values

# Run coverage with UI (interactive)
npm run test:coverage:ui

# Note: Component tests need Angular compiler
# Current coverage only includes UI services (theme service)
```

**Production build failures:**
```bash
# Run build locally to see full error output
cd frontend
npx ng build --configuration production

# Common fixes:
# - Fix TypeScript errors in components/services
# - Resolve missing imports
# - Fix template syntax errors in .html files
# - Check for circular dependencies

# Run development build for more detailed errors
npx ng build
```

## Accessibility Testing

The project uses a three-layer approach to accessibility validation:

### Layer 1: Static HTML Validation (html-validate)

**When it runs:** Pre-commit hook on staged HTML files

**What it checks:**
- HTML structure and element nesting
- Required attributes (alt, aria-label, etc.)
- WCAG-specific rules for forms, images, buttons
- Proper use of ARIA attributes

**Running manually:**
```bash
cd frontend
npm run validate:html                # Check all HTML files
```

**Common issues and fixes:**
```html
<!-- Missing alt attribute -->
<img src="icon.png">
→ <img src="icon.png" alt="Chat icon">

<!-- Button without accessible name -->
<button><mat-icon>send</mat-icon></button>
→ <button aria-label="Send message"><mat-icon>send</mat-icon></button>

<!-- Input without label -->
<input [(ngModel)]="text">
→ <input [(ngModel)]="text" aria-label="Message input">

<!-- Progress bar missing ARIA -->
<mat-progress-bar [value]="50"></mat-progress-bar>
→ <mat-progress-bar [value]="50" role="progressbar"
   [attr.aria-valuenow]="50" [attr.aria-valuemin]="0"
   [attr.aria-valuemax]="100"></mat-progress-bar>
```

### Layer 2: Angular Template Accessibility (ESLint)

**When it runs:** Pre-commit hook on staged TS/HTML files

**What it checks:**
- Angular-specific accessibility patterns
- Interactive elements have keyboard support
- Click events paired with key events
- Valid ARIA attribute usage in Angular templates

**Already enabled** - ESLint runs automatically in pre-commit hook.

### Layer 3: Runtime WCAG Compliance (Pa11y)

**When to run:** Before pull requests, major milestones, or after significant UI changes

**What it checks:**
- Full WCAG 2.1 Level AA compliance
- Color contrast (if enabled)
- Keyboard navigation
- Screen reader compatibility
- Dynamic content announcements

**Running Pa11y tests:**

**Option 1: Automated (Recommended)**
```bash
./run-a11y-tests.sh
```
This script automatically:
- Starts the dev server in background
- Waits for it to be ready
- Runs Pa11y tests
- Stops the server when done

**Option 2: Manual (Two Terminals)**

**Step 1: Start dev server (Terminal 1)**
```bash
cd frontend
npm start
# Wait for "Application bundle generation complete"
```

**Step 2: Run Pa11y tests (Terminal 2)**
```bash
./run-tests.sh a11y
```

**Expected output:**
```
Running Pa11y accessibility tests...

✔ http://localhost:4200

0 errors, 2 warnings

Warnings:
  • Notice: aria-live="polite" on element with role="log"
  • Notice: Consider using heading elements (h1-h6)

✅ Pa11y accessibility tests completed
```

**Viewing detailed report:**
```bash
# Generate JSON report
cd frontend
npm run test:a11y:json

# View report
./run-tests.sh a11y:report
```

**Understanding Pa11y results:**

**Errors (must fix):**
- Missing alt text on images
- Form fields without labels
- Invalid ARIA usage
- Keyboard-inaccessible interactive elements

**Warnings (should review):**
- Heading hierarchy issues
- Potentially confusing ARIA combinations
- Best practice recommendations

**Notices (informational):**
- Valid patterns that may need review
- Edge cases in WCAG interpretation

### Accessibility Testing Workflow

**During development:**
1. Write component template
2. Run pre-commit checks (html-validate + ESLint catch basic issues)
3. Fix any validation errors

**Before PR/milestone:**
1. Run Pa11y: `./run-a11y-tests.sh` (automated, starts/stops server)
   - Or manually: Start server → `./run-tests.sh a11y`
2. Review and fix any errors/warnings
3. Test manually with keyboard navigation
4. Test with screen reader if available

**Best practices:**
- Test with keyboard only (no mouse)
- Use browser DevTools accessibility inspector
- Run Pa11y after significant template changes
- Document known issues that can't be fixed (Material Design limitations)

## Troubleshooting

### Hook Not Running

Make sure hooks are installed:
```bash
./install-hooks.sh
```

Check hook is executable:
```bash
ls -la .git/hooks/pre-commit
# Should show: -rwxr-xr-x
```

### Python Not Found

The hooks require Python 3. Install it:
- **macOS:** `brew install python3`
- **Linux:** `sudo apt install python3`
- **Windows:** Download from python.org

### Node/NPM Not Found

Ensure Node.js and npm are installed for frontend work:

**macOS:**
```bash
brew install node
```

**Ubuntu/Debian:**
```bash
sudo apt install nodejs npm
```

## Manual Component Testing

Component tests exist but run manually (not in pre-push hooks) because they require Angular's template compiler and browser environment.

### When to Run Component Tests

Run component tests before:
- Creating pull requests
- Major milestones or releases
- Making significant UI changes
- Reusing components in new features

### Running Component Tests Locally

**Interactive Mode (Watch for Changes):**
```bash
cd frontend
ng test

# Tests run in browser with live reload
# Click on test names to filter/debug
# Useful for test-driven development
```

**Headless Mode (One-Time Run):**
```bash
cd frontend
ng test --no-watch --browsers=ChromeHeadless

# Runs all tests once and exits
# Good for quick validation before commits
```

### Component Test Coverage

**ChatbotComponent (38 tests):**
- ✅ Component initialization and default values
- ✅ Message sending with validation (empty, whitespace, loading state)
- ✅ User input handling and clearing
- ✅ API integration with success/error flows
- ✅ Network error handling with fallback messages
- ✅ Confidence level helpers (high/medium/low classification)
- ✅ Confidence UI rendering (icons, labels, colors)
- ✅ Theme toggle integration with ThemeService
- ✅ Context panel toggle and display
- ✅ Context management (adding, limiting to 10 items)
- ✅ Correction flow (show/cancel/submit)
- ✅ Interrupt handling for long-running requests

**Test File Location:**
- `frontend/src/app/components/chatbot/chatbot.component.spec.ts` (446 lines)

### Interpreting Component Test Results

**All tests passing:**
```
✓ src/app/components/chatbot/chatbot.component.spec.ts (38 tests) 156ms
  ✓ ChatbotComponent (38)
    ✓ should create
    ✓ should initialize with empty messages array
    [... 36 more tests ...]

Test Files  1 passed (1)
     Tests  38 passed (38)
  Duration  2.5s
```

**Test failures:**
```
❌ ChatbotComponent > should send message correctly
   Expected: "Test message"
   Received: undefined

Fix: Check component logic, service mocks, or test expectations
```

### Best Practices for Component Testing

1. **Test User Interactions:** Focus on what users do (click, type, submit)
2. **Test Visual States:** Loading indicators, error messages, success states
3. **Test Integration Points:** Service calls, theme changes, navigation
4. **Don't Over-Mock:** Use real Angular testing utilities (TestBed, ComponentFixture)
5. **Keep Tests Maintainable:** One assertion per test when possible

## Customization

### Modifying Checks

Edit `hooks/pre-commit` to add/remove checks:

```bash
# Example: Add TypeScript compile check
run_check "TypeScript compile (dry run)" bash -lc "cd frontend && npx tsc --noEmit" || true
```

After editing, reinstall:
```bash
./install-hooks.sh
```

### Disabling Specific Checks

Comment out checks in `hooks/pre-commit`:

```bash
# Disable backend check
# run_check "Backend requirements presence" validate_backend_requirements || true

run_check "Frontend package.json validation" validate_frontend_package_json || true
```

### Adjusting Commit Message Rules

Edit `hooks/commit-msg` to change validation rules, valid types, or message length limits.

## Best Practices

1. **Use conventional commits**: Makes history readable and enables automated changelogs
2. **Keep commits focused**: One feature/fix per commit where practical
3. **Run quick checks locally**: e.g., `npx tsc --noEmit` or `npm run lint` before committing
4. **Document changes**: Update README/study docs when principles evolve
5. **Don't skip hooks**: They exist to maintain project quality

## Integration with Workflow

The hooks align with your UI learning and build workflow:

- **New UI patterns**: Use `feat(chatbot|agent|dmi):` for new components or behaviors
- **Bug fixes**: Use `fix(service|component):` for targeted corrections
- **Docs**: Use `docs:` when updating principles and study plan
- **Build/CI**: Use `build:`/`ci:` for tooling changes

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Git Hooks Documentation](https://git-scm.com/docs/githooks)
 

---

**Last Updated:** 2026-02-18
**Project:** UI for AI
