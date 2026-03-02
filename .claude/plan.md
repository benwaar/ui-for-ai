# Implementation Plan: Complete Free A11y Setup

## Overview
Complete the remaining 3 free accessibility tooling items:
1. Add Pa11y to CI/CD pipeline
2. Set up MCP for Claude Desktop
3. Install Taylor Arndt's a11y-agent-team (optional)

---

## Task 1: Add Pa11y to CI Pipeline

### Current State
- ✅ Pa11y-ci installed (`frontend/node_modules/pa11y-ci`)
- ✅ Config file exists (`.pa11yci.json`)
- ✅ npm script exists (`test:a11y`)
- ❌ Not running in GitHub Actions

### Implementation
**File:** `.github/workflows/ci.yml`

Add new job step after "Build application":

```yaml
- name: Run accessibility tests
  run: |
    npm start &
    npx wait-on http://localhost:4200 --timeout 60000
    npm run test:a11y
    kill %1
  continue-on-error: false
```

### Key Decisions
- **Run after build** - ensures app compiles before testing
- **Start dev server** - Pa11y needs running app (localhost:4200)
- **Use wait-on** - waits for server to be ready
- **Kill background process** - cleanup dev server
- **continue-on-error: false** - blocks PRs with violations

### Tradeoffs
- **Pro:** Catches runtime a11y issues (contrast, focus, ARIA)
- **Con:** Adds ~30-60s to CI time
- **Con:** More complex than static linting

---

## Task 2: MCP Setup for Claude Desktop

### Current State
- ❌ No Claude Desktop config exists
- ❌ a11y-mcp not installed
- ❌ Chromium not installed for Puppeteer

### Implementation Steps

#### Step 2a: Install Prerequisites
```bash
# Install Chromium for Puppeteer
npx puppeteer browsers install chrome

# Install a11y-mcp globally (or as dev dep)
npm install -g a11y-mcp
```

#### Step 2b: Create Claude Desktop Config
**File:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/DBenoy/src/_research/_benwaar/ui-for-ai"
      ]
    },
    "a11y": {
      "command": "npx",
      "args": [
        "-y",
        "a11y-mcp"
      ]
    }
  }
}
```

#### Step 2c: Document Setup
**File:** `docs/ai-tools-for-ui-a11y.md`

Add installation instructions section with:
- Prerequisites (Node 18+, Claude Desktop)
- Step-by-step commands
- How to test the setup
- Example usage prompts

#### Step 2d: Restart Claude Desktop
User must quit (⌘+Q) and reopen Claude Desktop to load MCP servers.

### Key Decisions
- **Filesystem path** - project root to access all files
- **npx -y** - auto-installs servers without prompting
- **Global vs local** - installing a11y-mcp globally for convenience

### What This Enables
- Claude can read/edit Angular templates
- Claude can run axe-core audits via browser
- Claude can auto-fix accessibility violations
- Claude explains WCAG rules in context

---

## Task 3: Taylor Arndt's a11y-agent-team (Optional)

### Current State
- ❌ Not installed
- ❌ SLASH_COMMAND_TOOL_CHAR_BUDGET not set

### Implementation Steps

#### Step 3a: Install Agent Team
```bash
curl -fsSL https://raw.githubusercontent.com/Community-Access/accessibility-agents/main/install.sh | bash -s -- --global
```

#### Step 3b: Set Character Budget
**File:** `~/.zshrc`

Add line:
```bash
export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000
```

**For immediate effect:**
```bash
export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000
source ~/.zshrc
```

#### Step 3c: Verify Installation
```bash
ls -la ~/.claude/agents/ | grep accessibility
```

Expected agents:
- `accessibility-lead.md`
- `aria-specialist.md`
- `modal-specialist.md`
- `contrast-master.md`
- `keyboard-navigator.md`
- `forms-specialist.md`

#### Step 3d: Restart Claude Code
Exit and reopen Claude Code to load agents.

### Key Decisions
- **Global install** - available across all projects
- **Character budget** - required for agents to load properly
- **Optional** - not critical but adds specialized expertise

### What This Enables
- 6 specialized accessibility agents
- Deep ARIA expertise
- Focus trap handling
- Contrast checking
- Keyboard navigation
- Screen reader announcements

### Limitations
- React-focused (Angular patterns may differ)
- Requires Claude API access
- Manual invocation (not automated)
- Newer/less mature than Pa11y/axe

---

## Implementation Order

### Priority 1: Pa11y in CI (highest value)
**Time:** 10 minutes
**Impact:** Blocks PRs with accessibility violations
**Risk:** Low (can revert easily)

### Priority 2: MCP Setup (medium value)
**Time:** 15 minutes
**Impact:** Active accessibility agent during dev
**Risk:** Low (only affects Claude Desktop, not codebase)

### Priority 3: a11y-agent-team (nice-to-have)
**Time:** 5 minutes
**Impact:** Additional expertise during reviews
**Risk:** Very low (just adds documentation/context)

---

## Testing Plan

### Pa11y CI Test
1. Create intentional a11y violation (remove alt text)
2. Push to branch
3. Verify CI fails with Pa11y error
4. Fix violation
5. Verify CI passes

### MCP Test
1. Open Claude Desktop
2. Check for MCP servers in status
3. Ask: "Use the a11y MCP server to audit https://example.com"
4. Verify it returns WCAG violations

### Agent Team Test
1. Check `ls ~/.claude/agents/`
2. Ask Claude Code to review a component
3. Verify specialized agent knowledge in responses

---

## Rollback Plan

### Pa11y CI
- Remove job step from `.github/workflows/ci.yml`
- Commit and push

### MCP
- Delete `~/Library/Application Support/Claude/claude_desktop_config.json`
- Restart Claude Desktop

### Agent Team
- `rm -rf ~/.claude/agents/accessibility-*.md`
- Unset char budget in `~/.zshrc`

---

## Files to Create/Modify

### New Files
- `~/Library/Application Support/Claude/claude_desktop_config.json`

### Modified Files
- `.github/workflows/ci.yml` (add Pa11y job)
- `docs/ai-tools-for-ui-a11y.md` (add setup instructions)
- `~/.zshrc` (add char budget export)

### No Changes to
- `frontend/package.json` (scripts already exist)
- `.pa11yci.json` (already configured)
- `eslint.config.mjs` (already configured)

---

## Success Criteria

✅ **Pa11y CI:** Pull requests fail when accessibility violations detected
✅ **MCP:** Claude Desktop can run a11y audits and modify files
✅ **Agents:** Specialized accessibility expertise available in Claude Code
