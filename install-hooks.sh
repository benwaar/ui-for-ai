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

# Make hooks executable
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/commit-msg
chmod +x .git/hooks/prepare-commit-msg

echo "✅ Git hooks installed successfully!"
echo ""
echo "Installed hooks:"
echo "  - pre-commit: Lightweight JSON validation and repo checks"
echo "  - commit-msg: Validates conventional commit format"
echo "  - prepare-commit-msg: Provides commit message template"
echo ""
echo "Pre-commit checks:"
echo "  ✓ Frontend package.json JSON validation (if present)"
echo "  ✓ Backend requirements presence (if backend exists)"
echo ""
echo "Commit message format:"
echo "  Valid types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert"
echo "  Example: feat: add chatbot confidence indicator"
echo ""
echo "To skip pre-commit checks (NOT RECOMMENDED): git commit --no-verify"
