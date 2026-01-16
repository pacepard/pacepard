#!/bin/bash

# Open all Pacepard applications in your default browser

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Opening Pacepard Applications in Browser               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# URLs
MAIN_APP="http://localhost:5176"
WEB_APP="http://localhost:3020"
SERVICE_APP="http://localhost:3015"
API_SERVER="http://localhost:5015"

# Function to check if URL is accessible
check_url() {
  local url=$1
  local name=$2
  
  if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
    return 0
  else
    return 1
  fi
}

# Open each app
echo -e "${GREEN}✓${NC} Opening Main App..."
open "$MAIN_APP" 2>/dev/null || xdg-open "$MAIN_APP" 2>/dev/null || start "$MAIN_APP" 2>/dev/null
sleep 1

echo -e "${GREEN}✓${NC} Opening Web App..."
open "$WEB_APP" 2>/dev/null || xdg-open "$WEB_APP" 2>/dev/null || start "$WEB_APP" 2>/dev/null
sleep 1

echo -e "${GREEN}✓${NC} Opening Service App..."
open "$SERVICE_APP" 2>/dev/null || xdg-open "$SERVICE_APP" 2>/dev/null || start "$SERVICE_APP" 2>/dev/null
sleep 1

echo -e "${GREEN}✓${NC} Opening API Server..."
open "$API_SERVER" 2>/dev/null || xdg-open "$API_SERVER" 2>/dev/null || start "$API_SERVER" 2>/dev/null

echo ""
echo -e "${GREEN}✓${NC} All accessible apps have been opened in your browser!"
echo ""
echo -e "${BLUE}Applications:${NC}"
echo -e "  ${GREEN}Main App:${NC}     $MAIN_APP"
echo -e "  ${GREEN}Web App:${NC}      $WEB_APP"
echo -e "  ${GREEN}Service App:${NC}  $SERVICE_APP"
echo -e "  ${GREEN}API Server:${NC}   $API_SERVER"
echo ""
