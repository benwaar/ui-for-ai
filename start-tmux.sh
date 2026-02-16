#!/bin/bash

# UI for AI - Startup Script (tmux version)
# Runs both backend and frontend in tmux panes

set -e

SESSION_NAME="ui-for-ai"

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo "❌ tmux is not installed. Please install it with: brew install tmux"
    echo "Or use ./start.sh instead"
    exit 1
fi

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Run this script from the ui-for-ai root directory"
    exit 1
fi

# Kill existing session if it exists
tmux kill-session -t $SESSION_NAME 2>/dev/null || true

echo "🚀 Starting UI for AI Learning Lab in tmux..."

# Create new tmux session with backend
tmux new-session -d -s $SESSION_NAME -n "ui-for-ai"

# Run backend in first pane
tmux send-keys -t $SESSION_NAME "cd backend && source venv/bin/activate && python app.py" C-m

# Split window vertically
tmux split-window -h -t $SESSION_NAME

# Run frontend in second pane
tmux send-keys -t $SESSION_NAME "cd frontend && source ~/.nvm/nvm.sh && nvm use 20 && npm start" C-m

# Attach to the session
echo ""
echo "✓ Started in tmux session '$SESSION_NAME'"
echo ""
echo "📍 Backend:  http://localhost:5000 (left pane)"
echo "📍 Frontend: http://localhost:4200 (right pane)"
echo ""
echo "Commands:"
echo "  - Switch panes: Ctrl+B then arrow keys"
echo "  - Detach: Ctrl+B then D"
echo "  - Reattach: tmux attach -t $SESSION_NAME"
echo "  - Kill session: tmux kill-session -t $SESSION_NAME"
echo ""

tmux attach-session -t $SESSION_NAME
