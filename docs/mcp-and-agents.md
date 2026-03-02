# MCP and Agents

## Table of Contents

- [Overview](#overview)
- [MCPs (Model Context Protocols)](#mcps-model-context-protocols)
  - [Where MCPs Live](#where-mcps-live)
  - [MCP Configuration](#mcp-configuration)
  - [MCP File Structure](#mcp-file-structure)
- [Agents](#agents)
  - [Where Agents Live](#where-agents-live)
  - [Agent Configuration](#agent-configuration)
  - [Agent File Structure](#agent-file-structure)
- [Key Differences](#key-differences)
  - [When to Use What](#when-to-use-what)
  - [Example Workflow](#example-workflow)
- [Real-World Examples](#real-world-examples)
  - [MCP Example: Filesystem Server](#mcp-example-filesystem-server)
  - [Agent Example: Accessibility Lead](#agent-example-accessibility-lead)
  - [How They Work Together](#how-they-work-together)
  - [Directory Layout Example](#directory-layout-example)

## Overview

This document explains the distinction between MCPs and Agents in the context of Claude Code and AI tooling.

## MCPs (Model Context Protocols)

**MCPs are scripts** that provide external functionality to AI models through standardized interfaces.

- **Implementation**: Executable scripts (JavaScript, Python, etc.)
- **Purpose**: Extend AI capabilities with external tools and data sources
- **Examples**: File system access, API integrations, database queries
- **Execution**: Run as separate processes that communicate via stdio

### Where MCPs Live

MCPs are configured in Claude Code settings and run as independent server processes:

**Global Configuration:**
```
~/.claude/settings.json
```

**Project-Specific Configuration:**
```
/path/to/project/.claude/settings.json
```

**MCP Server Code:**
MCPs can live anywhere as standalone projects:
- Separate repositories (e.g., `@modelcontextprotocol/server-filesystem`)
- Local directories (e.g., `~/mcp-servers/custom-server/`)
- npm packages (installed globally or per-project)
- Python packages (in virtual environments)

### MCP Configuration

MCPs are configured in `settings.json` under the `mcpServers` key:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"],
      "description": "Provides file system access"
    },
    "postgres": {
      "command": "uvx",
      "args": ["mcp-server-postgres", "postgresql://localhost/mydb"],
      "env": {
        "PGPASSWORD": "secret"
      }
    },
    "custom-server": {
      "command": "node",
      "args": ["/Users/username/mcp-servers/custom/index.js"],
      "cwd": "/Users/username/mcp-servers/custom"
    }
  }
}
```

### MCP File Structure

A typical MCP server project structure:

```
mcp-server-example/
├── package.json              # Node.js dependencies & metadata
├── src/
│   ├── index.ts             # Entry point
│   ├── tools/               # Tool implementations
│   │   ├── read-file.ts
│   │   ├── write-file.ts
│   │   └── search.ts
│   └── resources/           # Resource providers
│       └── file-list.ts
├── build/                   # Compiled JavaScript
│   └── index.js            # Executable entry point
└── README.md
```

**Key characteristics:**
- Has its own `package.json` or `pyproject.toml`
- Implements MCP protocol (stdio-based communication)
- Provides tools, resources, or prompts via standardized interfaces
- Runs as a separate process from Claude Code

## Agents

**Agents are markdown files and hooks** that define specialized AI behaviors and workflows.

- **Implementation**:
  - Markdown (`.md`) files containing prompts and instructions
  - Hooks (shell commands) that execute in response to events
- **Purpose**: Orchestrate complex tasks with domain-specific knowledge
- **Examples**: Code review agents, accessibility specialists, build validators
- **Execution**: Loaded into AI context as prompts, hooks run as shell commands

### Where Agents Live

Agents are organized in a hierarchical directory structure within the `.claude` folder:

**Global Agents:**
```
~/.claude/agents/
```

**Project-Specific Agents:**
```
/path/to/project/.claude/agents/
```

**Agent Directory Structure:**
```
.claude/
├── agents/
│   ├── accessibility-lead.md        # Individual agent
│   ├── build-validator.md
│   ├── test-runner.md
│   └── team-name/                   # Agent team/namespace
│       ├── lead-agent.md
│       ├── specialist-1.md
│       └── specialist-2.md
└── settings.json                    # Agent configuration & hooks
```

### Agent Configuration

Agents are configured in two ways:

**1. Agent Definition (Markdown File):**

```markdown
# Agent Name

You are a specialized agent for [purpose].

## Responsibilities
- Task 1
- Task 2

## Tools Available
- Tool 1
- Tool 2

## Instructions
[Detailed behavior and guidelines]
```

**2. Hooks Configuration (settings.json):**

```json
{
  "hooks": {
    "UserPromptSubmit": "~/my-hooks/accessibility-check.sh",
    "BeforeToolCall[Write]": "echo 'About to write file'",
    "AfterToolCall[Bash]": "~/my-hooks/log-command.sh"
  },
  "agents": {
    "subagentTypes": {
      "accessibility-lead": {
        "agentFile": "~/.claude/agents/accessibility-agents/accessibility-lead.md",
        "description": "Leads accessibility review and coordination"
      },
      "custom-reviewer": {
        "agentFile": ".claude/agents/custom-reviewer.md",
        "tools": ["Read", "Grep", "Glob"],
        "description": "Reviews code for custom standards"
      }
    }
  }
}
```

### Agent File Structure

**Simple Agent:**
```
.claude/
└── agents/
    └── code-reviewer.md              # Single-file agent
```

**Agent Team:**
```
.claude/
└── agents/
    └── accessibility-agents/         # Team namespace
        ├── accessibility-lead.md     # Coordinator agent
        ├── aria-specialist.md        # Specialist
        ├── keyboard-nav-specialist.md
        ├── color-contrast-specialist.md
        └── screen-reader-specialist.md
```

**With Hooks:**
```
project/
├── .claude/
│   ├── agents/
│   │   └── build-validator.md
│   ├── hooks/
│   │   ├── pre-commit-check.sh      # Hook scripts
│   │   └── accessibility-check.sh
│   └── settings.json                # Hook configuration
```

**Key characteristics:**
- Agents are `.md` files with prompt instructions
- Can be organized into teams/namespaces via subdirectories
- Hooks are shell scripts triggered by Claude Code events
- Configuration ties hooks and agents together
- Agents don't run as separate processes—they're loaded into context

## Key Differences

| Aspect | MCPs | Agents |
|--------|------|--------|
| **Format** | Executable scripts | Markdown files + hooks |
| **Runtime** | External processes | AI prompts + shell hooks |
| **Location** | Anywhere (npm, pip, local) | `.claude/agents/` directory |
| **Configuration** | `mcpServers` in settings.json | `agents` + `hooks` in settings.json |
| **File Type** | `.js`, `.py`, `.ts`, etc. | `.md` files + `.sh` scripts |
| **Extensibility** | Tool-based (implement MCP protocol) | Prompt-based (markdown instructions) |
| **State** | Can maintain state across calls | Context-based (conversation state) |
| **Language** | Any (JS, Python, Go, Rust, etc.) | Markdown + Bash |
| **Dependencies** | Has own package.json/requirements.txt | No dependencies (plain text) |
| **Execution** | Spawned as subprocess | Loaded into AI context |
| **Communication** | stdio (JSON-RPC) | Direct prompt injection |
| **Lifecycle** | Persistent server process | Per-invocation |
| **Distribution** | npm/pip packages or git repos | Copied into .claude/ folder |
| **Development** | Requires coding & compilation | Write markdown files |

### When to Use What

**Use MCPs when you need:**
- External integrations (databases, APIs, file systems)
- Stateful operations
- Performance-critical operations
- Reusable tools across different AI tools
- Complex data processing

**Use Agents when you need:**
- Specialized AI behavior for your project
- Task orchestration and workflow management
- Domain-specific knowledge and guidelines
- Event-driven automations (hooks)
- Quick customization without coding

### Example Workflow

A typical workflow might combine both:

1. **MCP** provides tools (e.g., database access, API calls)
2. **Agent** orchestrates the workflow (e.g., "When user asks for report, query DB via MCP tools, format results, generate visualizations")
3. **Hooks** enforce policies (e.g., "Before committing, run linter and tests")

```
User Request
    ↓
Agent (accessibility-lead.md)
    ↓
Uses MCP Tools (filesystem, grep, etc.)
    ↓
Hook Executes (pre-commit check)
    ↓
Result
```

## Real-World Examples

### MCP Example: Filesystem Server

**Location:** `~/.claude/settings.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/projects"]
    }
  }
}
```

**What it does:**
- Runs as a Node.js process
- Provides tools: `read_file`, `write_file`, `list_directory`, etc.
- Claude Code calls these tools during conversations
- Can access files outside project directory (if configured)

### Agent Example: Accessibility Lead

**Location:** `.claude/agents/accessibility-agents/accessibility-lead.md`

```markdown
# Accessibility Lead Agent

You are the lead accessibility agent responsible for ensuring web accessibility compliance.

## Your Role
- Coordinate specialist agents (ARIA, keyboard nav, color contrast)
- Review UI code changes for accessibility issues
- Enforce WCAG 2.1 AA standards

## When Invoked
You are automatically invoked via UserPromptSubmit hook when:
- User modifies HTML, JSX, or component files
- User requests accessibility review
- PR is created with UI changes

## Available Tools
- Read, Write, Edit (for code changes)
- Grep, Glob (for finding files)
- Agent (to delegate to specialists)

## Process
1. Identify the scope of UI changes
2. Delegate to relevant specialists
3. Compile findings and recommendations
4. Suggest fixes with code examples
```

**Hook Configuration in `.claude/settings.json`:**

```json
{
  "hooks": {
    "UserPromptSubmit": "~/.claude/hooks/accessibility-check.sh"
  },
  "agents": {
    "subagentTypes": {
      "accessibility-agents:accessibility-lead": {
        "agentFile": ".claude/agents/accessibility-agents/accessibility-lead.md",
        "description": "Leads accessibility review",
        "tools": ["Read", "Write", "Edit", "Grep", "Glob", "Agent"]
      }
    }
  }
}
```

**Hook Script (`~/.claude/hooks/accessibility-check.sh`):**

```bash
#!/bin/bash
# Check if this is a web project and UI code might be affected
if [[ -f "package.json" ]] && grep -q "react\|vue\|angular\|svelte" package.json; then
  echo "INSTRUCTION: MANDATORY ACCESSIBILITY CHECK — YOU MUST FOLLOW THIS"
  echo "DETECTED: This is a web project. Accessibility agents are ALWAYS required."
  echo ""
  echo "REQUIRED ACTIONS:"
  echo "1. Use the Agent tool to delegate to accessibility-agents:accessibility-lead"
  echo "2. Do NOT write or edit UI code without accessibility-lead review FIRST"
fi
```

### How They Work Together

**Scenario:** User asks to "add a login form"

1. **Hook fires** (UserPromptSubmit) → detects web project → prints accessibility requirement
2. **Claude Code** sees hook output → invokes accessibility-lead agent
3. **Agent** reviews request → delegates to specialists
4. **Agent** uses MCP tools (Read/Write via filesystem MCP or built-in tools)
5. **Agent** returns recommendations
6. **Claude Code** implements changes with accessibility built-in

### Directory Layout Example

Complete project structure:

```
my-web-project/
├── src/
│   └── components/
│       └── LoginForm.tsx
├── .claude/
│   ├── agents/
│   │   ├── accessibility-agents/
│   │   │   ├── accessibility-lead.md
│   │   │   ├── aria-specialist.md
│   │   │   └── keyboard-nav-specialist.md
│   │   └── build-validator.md
│   ├── hooks/
│   │   ├── accessibility-check.sh
│   │   └── pre-commit.sh
│   └── settings.json
├── package.json
└── README.md
```

**settings.json:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  },
  "agents": {
    "subagentTypes": {
      "accessibility-agents:accessibility-lead": {
        "agentFile": ".claude/agents/accessibility-agents/accessibility-lead.md"
      },
      "build-validator": {
        "agentFile": ".claude/agents/build-validator.md"
      }
    }
  },
  "hooks": {
    "UserPromptSubmit": ".claude/hooks/accessibility-check.sh",
    "BeforeToolCall[Bash]": ".claude/hooks/pre-commit.sh"
  }
}
```

In this setup:
- **MCPs** (filesystem, github) provide tools for file/API access
- **Agents** (accessibility-lead, build-validator) provide specialized AI behavior
- **Hooks** enforce policies automatically
- Everything works together seamlessly
