# Local CI/CD Deployment Simulation

This guide explains how to simulate the GitHub Actions CI/CD workflow locally on your Mac.

## Quick Start

```bash
# Run full deployment simulation (all apps)
./scripts/simulate-deployment.sh

# Run for a specific app
./scripts/simulate-deployment.sh --app api

# Run with containers after building
./scripts/simulate-deployment.sh --run-containers
```

## What It Does

The simulation script mimics the GitHub Actions workflow:

1. **Prerequisites Check** - Verifies Node.js, pnpm, and Docker
2. **Install Dependencies** - Runs `pnpm install --frozen-lockfile`
3. **Validate Code** - Runs lint, type-check, and format checks
4. **Run Tests** - Executes test suite (optional)
5. **Build Packages** - Builds all apps and packages
6. **Build Docker Images** - Creates Docker images for each app
7. **Run Containers** - Optionally starts containers (with `--run-containers`)

## Available Options

| Option | Description |
|--------|-------------|
| `--skip-validation` | Skip validation steps (lint, type-check, format) |
| `--skip-build` | Skip build steps |
| `--skip-docker` | Skip Docker image builds |
| `--run-containers` | Run Docker containers after building |
| `--skip-tests` | Skip test execution |
| `--app APP` | Deploy specific app (api, web, main, service) |
| `--verbose, -v` | Enable verbose output |
| `--help, -h` | Show help message |

## Examples

### Full Pipeline (All Apps)
```bash
./scripts/simulate-deployment.sh
```

### Deploy Single App (API Only)
```bash
./scripts/simulate-deployment.sh --app api
```

### Build and Run Containers
```bash
./scripts/simulate-deployment.sh --run-containers
```

### Skip Tests (Faster Validation)
```bash
./scripts/simulate-deployment.sh --skip-tests
```

### Build Docker Images Only
```bash
./scripts/simulate-deployment.sh --skip-validation --skip-tests
```

### Verbose Output (Debug Issues)
```bash
./scripts/simulate-deployment.sh --verbose
```

## Applications

The script deploys the following applications:

1. **API** (`@pacepard/api`) - Express API server
   - Port: 5015
   - Dockerfile: `apps/api/Dockerfile`
   - Build output: `apps/api/dist/`

2. **Web** (`@pacepard/web`) - Next.js web application
   - Port: 3020 (dev), 3000 (prod)
   - Dockerfile: `apps/web/Dockerfile`
   - Build output: `apps/web/.next/`

3. **App** (`@pacepard/app`) - Vite/React SPA (main app)
   - Port: 5176 (dev), 80 (prod)
   - Dockerfile: `apps/main/Dockerfile`
   - Build output: `apps/main/dist/`

4. **Service** (`@pacepard/service`) - Next.js service application
   - Port: 3015 (dev), 3000 (prod)
   - Dockerfile: `apps/service/Dockerfile`
   - Build output: `apps/service/.next/`

## Docker Images

After building, Docker images are tagged as:
- `pacepard-api:local`
- `pacepard-web:local`
- `pacepard-app:local`
- `pacepard-service:local`

## Running Containers

When using `--run-containers`, containers are named:
- `pacepard-api-local`
- `pacepard-web-local`
- `pacepard-app-local`
- `pacepard-service-local`

To stop containers:
```bash
docker stop pacepard-api-local pacepard-web-local pacepard-app-local pacepard-service-local
```

## Troubleshooting

### Docker Not Running
```bash
# Start Docker Desktop, then retry
./scripts/simulate-deployment.sh
```

### Build Failures
```bash
# Clean and rebuild
pnpm clean
pnpm install
./scripts/simulate-deployment.sh --verbose
```

### Port Conflicts
If ports are already in use, stop existing containers:
```bash
docker ps
docker stop <container-id>
```

### Missing Dependencies
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## CI/CD Workflow Comparison

The script mirrors these GitHub Actions workflows:

- **CI Workflow** (`.github/workflows/ci.yml`):
  - Validate → Build → Test → Security

- **Deploy Workflow** (`.github/workflows/deploy.yml`):
  - Build → Deploy (API, Web, App, Service)

## Next Steps

After successful local simulation:

1. Commit and push changes to trigger GitHub Actions
2. Monitor workflow runs in GitHub Actions tab
3. Check deployment status in your deployment environment

## Fixes Applied to CI/CD

The following fixes have been applied to improve CI/CD reliability:

1. ✅ Added `format:check` script to `package.json`
2. ✅ Updated CI workflow to use `pnpm format:check`
3. ✅ Improved error handling in `ci-success` job
4. ✅ Fixed deploy workflow dependency on `determine-environment`

These fixes address the following GitHub Actions failures:
- CI / CI Success - Better error reporting
- CI / Validate Code Quality - Fixed format check command
- Deploy / Build for Deployment - Fixed job dependencies
