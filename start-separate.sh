#!/bin/bash

# UI for AI - Startup Script (Separate Terminal Windows for macOS)
# Opens backend and frontend in separate Terminal windows

set -e

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Run this script from the ui-for-ai root directory"
    exit 1
fi

CURRENT_DIR=$(pwd)

echo "🚀 Starting UI for AI Learning Lab..."
echo ""
echo "Opening backend and frontend in separate Terminal windows..."
echo ""

# Start Backend in new Terminal window
osascript <<END
tell application "Terminal"
    do script "cd '$CURRENT_DIR/backend' && source venv/bin/activate && echo '🔷 Backend Server' && echo '' && python app.py"
    set custom title of front window to "Backend - Flask (Port 5000)"
end tell
END

# Wait a moment
sleep 2

# Start Frontend in new Terminal window
osascript <<END
tell application "Terminal"
    do script "cd '$CURRENT_DIR/frontend' && source ~/.nvm/nvm.sh && nvm use 20 2>/dev/null && echo '🔶 Frontend Server' && echo '' && npm start"
    set custom title of front window to "Frontend - Angular (Port 4200)"
end tell
END

echo "✓ Opened 2 Terminal windows:"
echo "  - Backend:  http://localhost:5000"
echo "  - Frontend: http://localhost:4200"
echo ""
echo "Close those Terminal windows to stop the servers"
