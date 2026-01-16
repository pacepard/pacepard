#!/bin/bash

# Start all Pacepard applications locally
# This script starts each app in development mode

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd "$(dirname "$0")/.." || exit 1

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Starting Pacepard Applications Locally                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if apps are already running
check_port() {
  if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    return 0
  else
    return 1
  fi
}

echo -e "${BLUE}Checking ports...${NC}"
if check_port 5015; then
  echo -e "${YELLOW}⚠ Port 5015 (API) is already in use${NC}"
fi
if check_port 3020; then
  echo -e "${YELLOW}⚠ Port 3020 (Web) is already in use${NC}"
fi
if check_port 5176; then
  echo -e "${YELLOW}⚠ Port 5176 (Main App) is already in use${NC}"
fi
if check_port 3015; then
  echo -e "${YELLOW}⚠ Port 3015 (Service) is already in use${NC}"
fi

echo ""
echo -e "${GREEN}Starting all applications...${NC}"
echo ""
echo -e "${BLUE}Access URLs:${NC}"
echo -e "  ${GREEN}Main App:${NC}      http://localhost:5176"
echo -e "  ${GREEN}Web App:${NC}       http://localhost:3020"
echo -e "  ${GREEN}Service App:${NC}   http://localhost:3015"
echo -e "  ${GREEN}API:${NC}           http://localhost:5015"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all applications${NC}"
echo ""

# Start all apps
pnpm dev
