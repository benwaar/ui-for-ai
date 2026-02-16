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

### 2. Commit Message Hook

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

### 3. Prepare Commit Message Hook

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

### Skipping Pre-Commit Checks

**⚠️ NOT RECOMMENDED** - Only use when absolutely necessary:

```bash
git commit --no-verify -m "feat: emergency hotfix"
```

This skips the pre-commit hook but still validates the commit message.

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

**Last Updated:** 2026-02-16
**Project:** UI for AI
