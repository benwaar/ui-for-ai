#!/bin/bash
# Test runner script for UI-for-AI project
#
# This script provides convenient commands for running various tests
# Add new test commands as needed for different parts of the project

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Display usage information
usage() {
    echo "Usage: ./run-tests.sh [command]"
    echo ""
    echo "Available commands:"
    echo "  components        Run component tests interactively (Angular CLI)"
    echo "  components:once   Run component tests once (headless)"
    echo "  services          Run service tests with coverage (Vitest)"
    echo "  coverage          View coverage report in browser"
    echo "  a11y              Run Pa11y accessibility tests (requires dev server)"
    echo "  a11y:report       View Pa11y JSON report"
    echo "  all               Run all tests (services + components once)"
    echo "  help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./run-tests.sh components        # Interactive component testing"
    echo "  ./run-tests.sh services          # Service coverage report"
    echo "  ./run-tests.sh a11y              # Pa11y a11y tests (start server first)"
    echo "  ./run-tests.sh all               # Run everything"
    echo ""
    echo "Tip: For automated Pa11y testing (with server management):"
    echo "  ./run-a11y-tests.sh              # Starts server, runs tests, stops server"
    exit 0
}

# Run component tests interactively
run_components_interactive() {
    echo -e "${BLUE}Running component tests (interactive mode)...${NC}"
    echo ""
    cd frontend
    bash -c 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use && ng test'
}

# Run component tests once (headless)
run_components_once() {
    echo -e "${BLUE}Running component tests (headless mode)...${NC}"
    echo ""
    cd frontend
    bash -c 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use && ng test --no-watch --browsers=ChromeHeadless'
}

# Run service tests with coverage
run_services() {
    echo -e "${BLUE}Running service tests with coverage...${NC}"
    echo ""
    cd frontend
    bash -c 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use && npm run test:coverage'
    echo ""
    echo -e "${GREEN}✅ Service coverage report generated${NC}"
    echo -e "${YELLOW}View report: open frontend/coverage/index.html${NC}"
}

# View coverage report
view_coverage() {
    if [ -f "frontend/coverage/index.html" ]; then
        echo -e "${BLUE}Opening coverage report...${NC}"
        open frontend/coverage/index.html 2>/dev/null || \
        xdg-open frontend/coverage/index.html 2>/dev/null || \
        echo "Coverage report: frontend/coverage/index.html"
    else
        echo -e "${YELLOW}No coverage report found. Run './run-tests.sh services' first.${NC}"
        exit 1
    fi
}

# Run pa11y accessibility tests
run_a11y() {
    echo -e "${BLUE}Running Pa11y accessibility tests...${NC}"
    echo ""
    echo "⚠️  Prerequisite: Dev server must be running on http://localhost:4200"
    echo "   Start server: cd frontend && npm start"
    echo ""

    # Check if server is running
    if ! curl -s http://localhost:4200 > /dev/null 2>&1; then
        echo -e "${YELLOW}❌ Dev server not running on localhost:4200${NC}"
        echo ""
        echo "To start the dev server:"
        echo "  cd frontend && npm start"
        echo ""
        echo "Then run this command again in another terminal."
        exit 1
    fi

    cd frontend
    bash -c 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use && npm run test:a11y'

    echo ""
    echo -e "${GREEN}✅ Pa11y accessibility tests completed${NC}"
    echo -e "${YELLOW}Review any issues above and fix in templates${NC}"
}

# View pa11y report (if JSON report exists)
view_a11y_report() {
    if [ -f "frontend/pa11y-reports/report.json" ]; then
        echo -e "${BLUE}Viewing Pa11y report...${NC}"
        cd frontend/pa11y-reports
        cat report.json | python3 -m json.tool
    else
        echo -e "${YELLOW}No Pa11y JSON report found.${NC}"
        echo ""
        echo "Generate report:"
        echo "  cd frontend && npm run test:a11y:json"
        exit 1
    fi
}

# Run all tests
run_all() {
    echo -e "${BLUE}Running all tests...${NC}"
    echo ""
    echo "======================================================================"
    echo "Step 1: Service Tests with Coverage"
    echo "======================================================================"
    run_services
    echo ""
    echo "======================================================================"
    echo "Step 2: Component Tests (Headless)"
    echo "======================================================================"
    run_components_once
    echo ""
    echo -e "${GREEN}✅ All tests completed!${NC}"
}

# Main command handler
case "${1:-help}" in
    components)
        run_components_interactive
        ;;
    components:once)
        run_components_once
        ;;
    services)
        run_services
        ;;
    coverage)
        view_coverage
        ;;
    a11y)
        run_a11y
        ;;
    a11y:report)
        view_a11y_report
        ;;
    all)
        run_all
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        echo "Unknown command: $1"
        echo ""
        usage
        ;;
esac
