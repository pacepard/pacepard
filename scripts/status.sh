#!/bin/bash

# Check status of all Pacepard applications

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Pacepard Applications Status                           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

check_port() {
  local port=$1
  local name=$2
  local url=$3
  
  if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    local pid=$(lsof -ti:$port)
    echo -e "${GREEN}✓${NC} $name"
    echo -e "   ${BLUE}Port:${NC} $port"
    echo -e "   ${BLUE}URL:${NC}  $url"
    echo -e "   ${BLUE}PID:${NC}  $pid"
    echo ""
    return 0
  else
    echo -e "${RED}✗${NC} $name (not running)"
    echo -e "   ${BLUE}Expected:${NC} $url"
    echo ""
    return 1
  fi
}

check_port 5015 "API Server" "http://localhost:5015"
check_port 3020 "Web App" "http://localhost:3020"
check_port 5176 "Main App" "http://localhost:5176"
check_port 3015 "Service App" "http://localhost:3015"

# Check Docker containers
echo -e "${BLUE}Docker Containers:${NC}"
for APP in api web main service; do
  CONTAINER="pacepard-$APP-local"
  if docker ps -q -f name=$CONTAINER 2>/dev/null | grep -q .; then
    echo -e "${GREEN}✓${NC} $CONTAINER (running)"
  else
    echo -e "${YELLOW}○${NC} $CONTAINER (not running)"
  fi
done

echo ""
