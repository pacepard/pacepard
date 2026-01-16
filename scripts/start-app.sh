#!/bin/bash

# Start individual Pacepard applications
# Usage: ./scripts/start-app.sh [api|web|app|service]

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd "$(dirname "$0")/.." || exit 1

APP=$1

if [ -z "$APP" ]; then
  echo -e "${RED}Error: Please specify an app${NC}"
  echo ""
  echo "Usage: ./scripts/start-app.sh [api|web|app|service]"
  echo ""
  echo "Available apps:"
  echo "  api      - Express API server (port 5015)"
  echo "  web      - Next.js web app (port 3020)"
  echo "  app      - Vite/React main app (port 5176)"
  echo "  service  - Next.js service app (port 3015)"
  exit 1
fi

case $APP in
  api)
    PORT=5015
    URL="http://localhost:$PORT"
    CMD="pnpm dev:api"
    NAME="API Server"
    ;;
  web)
    PORT=3020
    URL="http://localhost:$PORT"
    CMD="pnpm dev:web"
    NAME="Web App"
    ;;
  app)
    PORT=5176
    URL="http://localhost:$PORT"
    CMD="pnpm dev:app"
    NAME="Main App"
    ;;
  service)
    PORT=3015
    URL="http://localhost:$PORT"
    CMD="pnpm dev:service"
    NAME="Service App"
    ;;
  *)
    echo -e "${RED}Error: Invalid app: $APP${NC}"
    echo "Valid options: api, web, app, service"
    exit 1
    ;;
esac

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Starting $NAME                               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}App:${NC}     $NAME"
echo -e "${GREEN}Port:${NC}    $PORT"
echo -e "${GREEN}URL:${NC}     $URL"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

# Check if port is in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo -e "${YELLOW}⚠ Port $PORT is already in use${NC}"
  echo -e "${YELLOW}⚠ Trying to start anyway...${NC}"
  echo ""
fi

# Start the app
exec $CMD
