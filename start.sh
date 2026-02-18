#!/bin/bash

# UI for AI - Startup Script
# Runs both backend and frontend servers

set -e

echo "🚀 Starting UI for AI Learning Lab..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Run this script from the ui-for-ai root directory"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Backend
echo -e "${BLUE}📦 Starting Flask Backend...${NC}"
cd backend

# Check if Flask is installed
if ! python -c "import flask" &> /dev/null; then
    echo -e "${YELLOW}📥 Installing Flask dependencies...${NC}"
    pip install flask flask-cors
fi

python app.py &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Backend running on http://localhost:5000 (PID: $BACKEND_PID)${NC}"
else
    echo -e "${YELLOW}❌ Backend failed to start${NC}"
    exit 1
fi

# Start Frontend
echo -e "${BLUE}🎨 Starting Angular Frontend...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Installing frontend dependencies...${NC}"
    npm install
fi

# Use nvm if available
if [ -f "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    source "$NVM_DIR/nvm.sh"
    # Use .nvmrc if it exists, otherwise use latest Node
    if [ -f ".nvmrc" ]; then
        nvm use
    else
        nvm use 22 2>/dev/null || nvm use default 2>/dev/null || true
    fi
fi

npm start &
FRONTEND_PID=$!
cd ..

# Wait a bit for frontend to start
sleep 5

echo ""
echo -e "${GREEN}✓ Frontend running on http://localhost:4200${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Both servers are running!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Backend:  http://localhost:5000"
echo "📍 Frontend: http://localhost:4200"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
