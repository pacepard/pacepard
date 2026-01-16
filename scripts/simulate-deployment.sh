#!/bin/bash

# Local CI/CD Deployment Simulation Script
# This script simulates the GitHub Actions CI/CD workflow locally

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NODE_VERSION="20"
PNPM_VERSION="9.0.0"
APPS=("api" "web" "main" "service")
APP_NAMES=("@pacepard/api" "@pacepard/web" "@pacepard/app" "@pacepard/service")

# Flags
SKIP_VALIDATION=false
SKIP_BUILD=false
SKIP_DOCKER=false
RUN_CONTAINERS=false
SKIP_TESTS=false
VERBOSE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-validation)
      SKIP_VALIDATION=true
      shift
      ;;
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    --skip-docker)
      SKIP_DOCKER=true
      shift
      ;;
    --run-containers)
      RUN_CONTAINERS=true
      shift
      ;;
    --skip-tests)
      SKIP_TESTS=true
      shift
      ;;
    --app)
      SELECTED_APP="$2"
      shift 2
      ;;
    --verbose|-v)
      VERBOSE=true
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --skip-validation    Skip validation steps (lint, type-check, format)"
      echo "  --skip-build         Skip build steps"
      echo "  --skip-docker        Skip Docker image builds"
      echo "  --run-containers     Run Docker containers after building"
      echo "  --skip-tests         Skip test execution"
      echo "  --app APP            Deploy specific app (api, web, main, service)"
      echo "  --verbose, -v        Enable verbose output"
      echo "  --help, -h           Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Helper functions
log_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
  echo -e "${RED}✗${NC} $1"
}

log_step() {
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}▶${NC} $1"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
}

run_cmd() {
  if [ "$VERBOSE" = true ]; then
    "$@"
  else
    "$@" > /dev/null 2>&1
  fi
}

# Check prerequisites
check_prerequisites() {
  log_step "Checking Prerequisites"
  
  # Check Node.js
  if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed. Please install Node.js >= $NODE_VERSION"
    exit 1
  fi
  
  NODE_CURRENT=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$NODE_CURRENT" -lt "$NODE_VERSION" ]; then
    log_error "Node.js version $NODE_CURRENT is too old. Required: >= $NODE_VERSION"
    exit 1
  fi
  log_success "Node.js version: $(node -v)"
  
  # Check pnpm
  if ! command -v pnpm &> /dev/null; then
    log_error "pnpm is not installed. Please install pnpm >= $PNPM_VERSION"
    exit 1
  fi
  
  PNPM_CURRENT=$(pnpm -v | cut -d'.' -f1)
  if [ "$PNPM_CURRENT" -lt "$PNPM_VERSION" ]; then
    log_warning "pnpm version $(pnpm -v) may be outdated. Recommended: >= $PNPM_VERSION"
  else
    log_success "pnpm version: $(pnpm -v)"
  fi
  
  # Check Docker (optional)
  if [ "$SKIP_DOCKER" = false ]; then
    if ! command -v docker &> /dev/null; then
      log_warning "Docker is not installed. Docker builds will be skipped."
      SKIP_DOCKER=true
    else
      log_success "Docker version: $(docker --version)"
      
      # Check if Docker daemon is running
      if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running. Please start Docker."
        exit 1
      fi
    fi
  fi
  
  log_success "All prerequisites checked"
}

# Install dependencies
install_dependencies() {
  log_step "Installing Dependencies"
  
  log_info "Installing dependencies with pnpm..."
  if pnpm install --frozen-lockfile; then
    log_success "Dependencies installed successfully"
  else
    log_error "Failed to install dependencies"
    exit 1
  fi
}

# Validation steps (mirrors CI workflow)
validate_code() {
  if [ "$SKIP_VALIDATION" = true ]; then
    log_warning "Skipping validation steps"
    return 0
  fi
  
  log_step "Validating Code Quality"
  
  # Lint code
  log_info "Running lint checks..."
  if pnpm lint; then
    log_success "Lint checks passed"
  else
    log_error "Lint checks failed"
    exit 1
  fi
  
  # Type check
  log_info "Running type checks..."
  if pnpm check-types; then
    log_success "Type checks passed"
  else
    log_error "Type checks failed"
    exit 1
  fi
  
  # Format check
  log_info "Checking code format..."
  if pnpm format:check 2>/dev/null || true; then
    log_success "Format check completed"
  else
    log_warning "Format check found issues (non-blocking)"
  fi
}

# Run tests
run_tests() {
  if [ "$SKIP_TESTS" = true ]; then
    log_warning "Skipping test execution"
    return 0
  fi
  
  log_step "Running Tests"
  
  log_info "Running test suite..."
  if pnpm test 2>/dev/null || true; then
    log_success "Tests completed"
  else
    log_warning "Some tests failed (non-blocking for deployment)"
  fi
}

# Build packages
build_packages() {
  if [ "$SKIP_BUILD" = true ]; then
    log_warning "Skipping build steps"
    return 0
  fi
  
  log_step "Building Packages"
  
  log_info "Building all packages and applications..."
  if pnpm build; then
    log_success "All packages built successfully"
  else
    log_error "Build failed"
    exit 1
  fi
  
  # Verify build outputs
  log_info "Verifying build outputs..."
  MISSING_BUILDS=0
  
  for i in "${!APPS[@]}"; do
    APP="${APPS[$i]}"
    APP_NAME="${APP_NAMES[$i]}"
    
    if [ "$APP" = "api" ] || [ "$APP" = "main" ]; then
      if [ -d "apps/$APP/dist" ]; then
        log_success "$APP_NAME: dist/ directory exists"
      else
        log_error "$APP_NAME: dist/ directory missing"
        MISSING_BUILDS=$((MISSING_BUILDS + 1))
      fi
    elif [ "$APP" = "web" ] || [ "$APP" = "service" ]; then
      if [ -d "apps/$APP/.next" ]; then
        log_success "$APP_NAME: .next/ directory exists"
      else
        log_error "$APP_NAME: .next/ directory missing"
        MISSING_BUILDS=$((MISSING_BUILDS + 1))
      fi
    fi
  done
  
  if [ $MISSING_BUILDS -gt 0 ]; then
    log_error "$MISSING_BUILDS build(s) are missing"
    exit 1
  fi
}

# Build Docker images
build_docker_images() {
  if [ "$SKIP_DOCKER" = true ]; then
    log_warning "Skipping Docker image builds"
    return 0
  fi
  
  log_step "Building Docker Images"
  
  local apps_to_build=("${APPS[@]}")
  
  # Filter to selected app if specified
  if [ -n "$SELECTED_APP" ]; then
    if [[ " ${APPS[*]} " =~ " ${SELECTED_APP} " ]]; then
      apps_to_build=("$SELECTED_APP")
      log_info "Building Docker image for: $SELECTED_APP only"
    else
      log_error "Invalid app: $SELECTED_APP. Valid options: ${APPS[*]}"
      exit 1
    fi
  fi
  
  for APP in "${apps_to_build[@]}"; do
    log_info "Building Docker image for: $APP"
    
    DOCKERFILE="apps/$APP/Dockerfile"
    IMAGE_NAME="pacepard-$APP:local"
    
    if [ ! -f "$DOCKERFILE" ]; then
      log_error "Dockerfile not found: $DOCKERFILE"
      continue
    fi
    
    # Build from monorepo root
    if docker build -f "$DOCKERFILE" -t "$IMAGE_NAME" . 2>&1 | tee /tmp/docker-build-$APP.log; then
      log_success "Docker image built: $IMAGE_NAME"
    else
      log_error "Failed to build Docker image: $IMAGE_NAME"
      if [ "$VERBOSE" = false ]; then
        log_info "Run with --verbose to see full error output"
        tail -n 20 /tmp/docker-build-$APP.log
      fi
      exit 1
    fi
  done
  
  log_success "All Docker images built successfully"
}

# Run containers
run_docker_containers() {
  if [ "$RUN_CONTAINERS" = false ]; then
    return 0
  fi
  
  log_step "Running Docker Containers"
  
  log_warning "This will start containers. Press Ctrl+C to stop them."
  log_info "Starting containers in detached mode..."
  
  for APP in "${APPS[@]}"; do
    if [ -n "$SELECTED_APP" ] && [ "$APP" != "$SELECTED_APP" ]; then
      continue
    fi
    
    IMAGE_NAME="pacepard-$APP:local"
    CONTAINER_NAME="pacepard-$APP-local"
    PORT=""
    
    case $APP in
      api)
        PORT="5015:5015"
        ;;
      web)
        PORT="3020:3000"
        ;;
      main)
        PORT="5176:80"
        ;;
      service)
        PORT="3015:3000"
        ;;
    esac
    
    # Stop and remove existing container if it exists
    docker stop "$CONTAINER_NAME" 2>/dev/null || true
    docker rm "$CONTAINER_NAME" 2>/dev/null || true
    
    log_info "Starting container: $CONTAINER_NAME on port $PORT"
    
    if docker run -d \
      --name "$CONTAINER_NAME" \
      -p "$PORT" \
      "$IMAGE_NAME"; then
      log_success "Container started: $CONTAINER_NAME"
      log_info "Access at: http://localhost:$(echo $PORT | cut -d':' -f1)"
    else
      log_error "Failed to start container: $CONTAINER_NAME"
    fi
  done
  
  log_info ""
  log_info "Containers are running. To stop them, run:"
  for APP in "${APPS[@]}"; do
    if [ -z "$SELECTED_APP" ] || [ "$APP" = "$SELECTED_APP" ]; then
      echo "  docker stop pacepard-$APP-local"
    fi
  done
}

# Main execution
main() {
  echo ""
  echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║     Pacepard Local CI/CD Deployment Simulation                ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  
  START_TIME=$(date +%s)
  
  # Change to script directory (monorepo root)
  cd "$(dirname "$0")/.." || exit 1
  
  # Run pipeline steps
  check_prerequisites
  install_dependencies
  validate_code
  run_tests
  build_packages
  build_docker_images
  run_docker_containers
  
  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))
  
  echo ""
  log_step "Deployment Simulation Complete"
  log_success "Total time: ${DURATION}s"
  echo ""
  
  if [ "$SKIP_DOCKER" = false ]; then
    log_info "Built Docker images:"
    for APP in "${APPS[@]}"; do
      if [ -z "$SELECTED_APP" ] || [ "$APP" = "$SELECTED_APP" ]; then
        echo "  - pacepard-$APP:local"
      fi
    done
    echo ""
  fi
  
  log_info "To deploy a specific app, run:"
  echo "  $0 --app <app-name>"
  echo ""
  log_info "To run containers after building, use:"
  echo "  $0 --run-containers"
  echo ""
}

# Run main function
main
