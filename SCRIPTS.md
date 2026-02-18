# Available Startup Scripts

Three ways to run the backend and frontend together:

## 1. `./start.sh` - Combined (Recommended)

Runs both servers in the same terminal process.

```bash
./start.sh
```

**Pros:**
- Single command
- Both outputs in same terminal
- Easy to stop both with Ctrl+C

**Cons:**
- Both outputs mixed together
- Can't interact with individual servers

---

## 2. `./start-tmux.sh` - Split Panes

Runs both servers in tmux with split panes.

```bash
./start-tmux.sh
```

**Requires:** `brew install tmux`

**Pros:**
- Clean split view
- Separate outputs side-by-side
- Can interact with each server independently
- Switch panes with `Ctrl+B` then arrow keys

**Cons:**
- Requires tmux installed
- Need to learn basic tmux commands

**Tmux Commands:**
- Switch panes: `Ctrl+B` then arrow keys
- Detach session: `Ctrl+B` then `D`
- Reattach: `tmux attach -t ui-for-ai`
- Kill session: `tmux kill-session -t ui-for-ai`

---

## 3. `./start-separate.sh` - Separate Windows (macOS)

Opens backend and frontend in separate Terminal windows.

```bash
./start-separate.sh
```

**Pros:**
- Completely separate windows
- Can position/resize independently
- Easy to focus on one server at a time

**Cons:**
- macOS only (uses AppleScript)
- More window management
- Must close each window individually

---

## Manual Start (No Script)

If you prefer full control:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---

## Ports

- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:4200

## Stopping Servers

- `start.sh`: Press `Ctrl+C` in the terminal
- `start-tmux.sh`: `Ctrl+C` in each pane or `tmux kill-session -t ui-for-ai`
- `start-separate.sh`: Close each Terminal window or `Ctrl+C` in each

# Additional Scripts

## Git Hooks

Install git hooks for code quality and commit standards:

```bash
./install-hooks.sh
```

**What it does:**
- Installs three git hooks into your `.git/hooks` directory
- Validates conventional commit message format
- Performs lightweight pre-commit checks

**Installed hooks:**

1. **pre-commit** - Runs before each commit
   - Validates `frontend/package.json` JSON syntax
   - Checks for backend requirements file presence
   - Prevents broken commits from entering the repository

2. **commit-msg** - Validates commit message format
   - Enforces conventional commits (e.g., `feat:`, `fix:`, `docs:`)
   - Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
   - Example: `feat: add chatbot confidence indicator`

3. **prepare-commit-msg** - Provides commit message template
   - Pre-fills commit message structure to guide formatting

**Skip hooks (not recommended):**
```bash
git commit --no-verify
```

See [install-hooks.sh](install-hooks.sh) for implementation details.