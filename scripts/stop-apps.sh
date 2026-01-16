#!/bin/bash

# Stop all running Pacepard applications

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}Stopping Pacepard applications...${NC}"
echo ""

PORTS=(5015 3020 5176 3015)
NAMES=("API" "Web" "Main App" "Service")

STOPPED=0

for i in "${!PORTS[@]}"; do
  PORT=${PORTS[$i]}
  NAME=${NAMES[$i]}
  
  PID=$(lsof -ti:$PORT 2>/dev/null || true)
  
  if [ -n "$PID" ]; then
    echo -e "${YELLOW}Stopping $NAME (port $PORT, PID $PID)...${NC}"
    kill $PID 2>/dev/null || true
    STOPPED=$((STOPPED + 1))
    sleep 1
  else
    echo -e "${GREEN}✓ $NAME is not running${NC}"
  fi
done

# Also stop any Docker containers
echo ""
echo -e "${BLUE}Stopping Docker containers...${NC}"

for APP in api web main service; do
  CONTAINER="pacepard-$APP-local"
  if docker ps -q -f name=$CONTAINER 2>/dev/null | grep -q .; then
    echo -e "${YELLOW}Stopping Docker container: $CONTAINER...${NC}"
    docker stop $CONTAINER 2>/dev/null || true
    docker rm $CONTAINER 2>/dev/null || true
  fi
done

echo ""
if [ $STOPPED -gt 0 ]; then
  echo -e "${GREEN}✓ Stopped $STOPPED application(s)${NC}"
else
  echo -e "${GREEN}✓ No applications were running${NC}"
fi
echo ""
