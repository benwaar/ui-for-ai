#!/bin/bash
# Install git hooks for conventional commits and basic repo checks

set -e

echo "Installing git hooks..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "Error: Not in a git repository root directory"
    exit 1
fi

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy hooks
cp hooks/pre-commit .git/hooks/pre-commit
cp hooks/commit-msg .git/hooks/commit-msg
cp hooks/prepare-commit-msg .git/hooks/prepare-commit-msg
cp hooks/pre-push .git/hooks/pre-push

# Make hooks executable
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/commit-msg
chmod +x .git/hooks/prepare-commit-msg
chmod +x .git/hooks/pre-push

echo "✅ Git hooks installed successfully!"
echo ""
echo "Installed hooks:"
echo "  - pre-commit: TypeScript, ESLint, and UI tests"
echo "  - commit-msg: Validates conventional commit format"
echo "  - prepare-commit-msg: Provides commit message template"
echo "  - pre-push: Production build validation"
echo ""
echo "Pre-commit checks:"
echo "  ✓ Frontend package.json JSON validation"
echo "  ✓ TypeScript compilation (no emit)"
echo "  ✓ ESLint validation (includes template accessibility)"
echo "  ✓ HTML structure and accessibility validation"
echo "  ✓ UI-focused unit tests (theme service)"
echo ""
echo "Pre-push checks:"
echo "  ✓ Production build (ng build --configuration production)"
echo ""
echo "Commit message format:"
echo "  Valid types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert"
echo "  Example: feat: add chatbot confidence indicator"
echo ""
echo "To skip pre-commit checks (NOT RECOMMENDED): git commit --no-verify"
