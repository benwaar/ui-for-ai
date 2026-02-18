#!/bin/bash
# Automated Pa11y accessibility test runner
# Starts dev server, runs Pa11y tests, and cleans up

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BLUE}Pa11y Accessibility Tests - Automated Runner${NC}"
echo -e "${BLUE}======================================================================${NC}"
echo ""

# Check if server is already running
if curl -s http://localhost:4200 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Dev server is already running on localhost:4200${NC}"
    echo -e "${YELLOW}Using existing server...${NC}"
    echo ""

    # Run Pa11y tests
    cd frontend
    bash -c 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use && npm run test:a11y'

    echo ""
    echo -e "${GREEN}✅ Pa11y tests completed (using existing server)${NC}"
    exit 0
fi

# Start dev server in background
echo -e "${BLUE}🚀 Starting Angular dev server...${NC}"
cd frontend
bash -c 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use && npm start' > /tmp/ng-serve.log 2>&1 &
SERVER_PID=$!

# Save PID for cleanup
echo $SERVER_PID > /tmp/ng-serve.pid

echo -e "${BLUE}Dev server starting (PID: ${SERVER_PID})...${NC}"

# Wait for server to be ready
echo -e "${BLUE}Waiting for server to be ready...${NC}"
MAX_WAIT=60
WAIT_COUNT=0

while ! curl -s http://localhost:4200 > /dev/null 2>&1; do
    sleep 2
    WAIT_COUNT=$((WAIT_COUNT + 2))

    if [ $WAIT_COUNT -ge $MAX_WAIT ]; then
        echo -e "${RED}❌ Server failed to start within ${MAX_WAIT} seconds${NC}"
        echo ""
        echo -e "${YELLOW}Server log (last 20 lines):${NC}"
        tail -20 /tmp/ng-serve.log

        # Clean up
        kill $SERVER_PID 2>/dev/null || true
        rm -f /tmp/ng-serve.pid
        exit 1
    fi

    echo -e "${YELLOW}Still waiting... (${WAIT_COUNT}s elapsed)${NC}"
done

echo -e "${GREEN}✅ Dev server is ready!${NC}"
echo ""

# Run Pa11y tests
echo -e "${BLUE}======================================================================${NC}"
echo -e "${BLUE}Running Pa11y accessibility tests...${NC}"
echo -e "${BLUE}======================================================================${NC}"
echo ""

bash -c 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use && npm run test:a11y'
TEST_RESULT=$?

echo ""
echo -e "${BLUE}======================================================================${NC}"

# Clean up server
echo -e "${BLUE}🛑 Stopping dev server (PID: ${SERVER_PID})...${NC}"
kill $SERVER_PID 2>/dev/null || true
rm -f /tmp/ng-serve.pid /tmp/ng-serve.log

if [ $TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Pa11y tests completed successfully!${NC}"
else
    echo -e "${RED}❌ Pa11y tests failed${NC}"
    echo ""
    echo -e "${YELLOW}Review the errors above and fix accessibility issues in templates${NC}"
fi

echo -e "${BLUE}======================================================================${NC}"
exit $TEST_RESULT
