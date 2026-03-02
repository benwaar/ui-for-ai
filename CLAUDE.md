# UI for AI - Learning Lab Project

This is a research and learning project focused on building accessible, trustworthy AI UX patterns.

## Project Purpose

- **Primary Goal**: Teach UI developers principles for AI interface design
- **Secondary Goal**: Demonstrate accessible development practices with AI tooling
- **Audience**: Skilled UI developers new to AI UX patterns

## Architecture

### Frontend (Angular 19)
- Standalone components (no NgModules)
- Reactive patterns with RxJS
- Component library: Tuesday's Chatbot (main example)
- Located in: `frontend/src/app/`

### Backend (Python/FastAPI)
- REST API for chatbot interactions
- Located in: `backend/`
- Simple, educational implementation

### Testing & Quality
- **Linters**: ESLint, html-validate
- **Accessibility**: Pa11y-ci with axe-core and htmlcs runners
- **CI/CD**: GitHub Actions with strict gates
- **Hooks**: Pre-commit and pre-push validation

## Code Standards

### Angular Conventions
- Use standalone components exclusively
- Follow Angular style guide
- Prefer reactive forms over template-driven
- Keep components focused and testable
- Use signals for state management where appropriate

### Accessibility Policy (CRITICAL)
- **WCAG 2.2 AA minimum** for ALL components
- Semantic HTML before ARIA attributes
- Keyboard navigation is mandatory
- Screen reader compatibility required
- Color contrast must meet AA standards
- Always explain accessibility decisions in comments

### Commit Standards
- Follow conventional commits format (feat:, fix:, docs:, etc.)
- Include Co-Authored-By for AI assistance
- Never skip pre-commit hooks (--no-verify is forbidden)
- All commits must pass linting and tests
- Write clear, descriptive commit messages

## Project-Specific Rules

### Documentation First
- This is a learning lab - documentation clarity matters
- Code should be readable for educational purposes
- Include comments explaining "why" not just "what"
- Link to relevant principles in `docs/ui-for-ai-principles-and-patterns.md`

### Accessibility Agents
- Accessibility agents are ENABLED and mandatory
- Do not bypass accessibility reviews for UI changes
- This project demonstrates best practices - act accordingly
- Invoke accessibility-lead agent for all UI work

### Dependencies
- Minimize external dependencies
- Use Angular built-ins when possible
- Document reasons for any new dependencies in commit messages
- Justify every new package.json dependency

### Testing Requirements
- Unit test coverage: 80% minimum
- All UI components must have accessibility tests
- Pa11y-ci must pass before merge
- Tests should be educational (clear, well-commented)

## File Structure

```
ui-for-ai/
├── frontend/               # Angular 19 application
│   ├── src/app/
│   │   ├── components/    # UI components (chatbot, etc.)
│   │   └── services/      # Angular services
│   └── package.json
├── backend/               # Python FastAPI backend
│   ├── main.py
│   └── requirements.txt
├── docs/                  # Documentation (key resource!)
│   ├── ui-for-ai-principles-and-patterns.md  # Core principles
│   ├── study-plan.md                         # Week-long exercises
│   ├── ai-tools-for-ui-a11y.md              # Tooling guide
│   └── mcp-and-agents.md                     # MCP & Agents guide
├── .github/workflows/     # CI/CD pipelines
├── scripts/              # Development scripts
├── .mcp.json            # MCP server configuration
└── CLAUDE.md            # This file
```

## Development Workflow

1. **Start**: `./start.sh` (launches both frontend and backend)
2. **Lint**: `npm run lint` in frontend directory
3. **Test**: `npm test` in frontend directory
4. **A11y Check**: `npm run test:a11y` (requires local server running)
5. **Commit**: Pre-commit hooks run automatically
6. **Push**: Pre-push hooks run build + coverage checks

## Key Resources

- **Principles**: Read `docs/ui-for-ai-principles-and-patterns.md` first
- **Study Plan**: `docs/study-plan.md` for structured learning
- **Accessibility Tooling**: `docs/ai-tools-for-ui-a11y.md`
- **MCP & Agents Guide**: `docs/mcp-and-agents.md`
- **Meta Learning**: `docs/meta-learning-observations.md`

## MCP Servers Configured

This project uses two MCP servers (configured in `.mcp.json`):

1. **filesystem**: Provides file system access to this project
2. **a11y**: Accessibility testing with axe-core for WCAG audits

Both servers are approved and ready to use.

## When Working on This Project

### Always Consider:
- Is this change accessible?
- Does it follow the UI for AI principles?
- Would this code teach good patterns to developers?
- Is the documentation clear?
- Have I invoked accessibility agents for UI work?

### Never:
- Skip accessibility checks
- Bypass linting or hooks
- Add dependencies without justification
- Commit code without tests
- Use `--no-verify` flag
- Make UI changes without accessibility-lead review

## UI for AI Principles (Quick Reference)

From `docs/ui-for-ai-principles-and-patterns.md`:

1. **Show Confidence**: Make uncertainty visible
2. **Cite Sources**: Link to evidence
3. **Enable Correction**: Let users fix mistakes
4. **Supervise Agents**: Human-in-the-loop for autonomous actions
5. **Report DMI**: Document, Monitor, Intervene for safety

## Example Scenarios

### Adding a New Component
1. Review relevant principles in docs
2. Invoke accessibility-lead agent for design review
3. Implement with semantic HTML
4. Add unit tests (including a11y tests)
5. Run Pa11y-ci locally
6. Commit with conventional commit message

### Fixing a Bug
1. Write a failing test first
2. If UI-related, invoke accessibility-lead for review
3. Fix the bug with minimal changes
4. Ensure tests pass
5. Update documentation if needed
6. Commit with "fix:" prefix

### Updating Documentation
1. Ensure clarity for educational purposes
2. Include examples where helpful
3. Link to related docs
4. Commit with "docs:" prefix

## Notes for AI Assistants

- This project is both a learning resource AND a working example
- Quality and clarity matter more than clever solutions
- Accessibility is non-negotiable - it's the core demonstration
- Educational value should guide all decisions
- When in doubt, ask the user rather than making assumptions
