# Local Applications Guide

All Pacepard applications are now running locally on your Mac!

## 🚀 Quick Access

### Applications Running:

| App | URL | Port | Status |
|-----|-----|------|--------|
| **Main App** | http://localhost:5176 | 5176 | ✅ Running |
| **Web App** | http://localhost:3020 | 3020 | ✅ Running |
| **Service App** | http://localhost:3015 | 3015 | ✅ Running |
| **API Server** | http://localhost:5015 | 5015 | ✅ Running |

## 📝 Available Scripts

### Check Status
```bash
./scripts/status.sh
```
Shows which apps are running and their ports.

### Start Individual App
```bash
./scripts/start-app.sh api      # Start API only
./scripts/start-app.sh web      # Start Web only
./scripts/start-app.sh app      # Start Main App only
./scripts/start-app.sh service  # Start Service only
```

### Start All Apps
```bash
./scripts/start-apps.sh
# or
pnpm dev
```

### Stop All Apps
```bash
./scripts/stop-apps.sh
```

## 🛠️ Using pnpm Commands

### Start Individual Apps
```bash
pnpm dev:api      # Start API (port 5015)
pnpm dev:web      # Start Web (port 3020)
pnpm dev:app      # Start Main App (port 5176)
pnpm dev:service  # Start Service (port 3015)
```

### Start All Apps
```bash
pnpm dev          # All apps in single terminal
pnpm dev:ui       # All apps with Turborepo UI
pnpm dev:fe       # Frontend apps only (web + app)
pnpm dev:be       # Backend apps only (api + api-docs)
```

## 🐳 Docker Deployment

To deploy using Docker (production-like):

```bash
# Build and run all apps in Docker
./scripts/simulate-deployment.sh --run-containers

# Build and run specific app
./scripts/simulate-deployment.sh --run-containers --app api
```

## 🔍 Health Checks

### API Health Endpoint
```bash
curl http://localhost:5015/health
```

### Web Health Check
```bash
curl http://localhost:3020/api/health
```

### Service Health Check
```bash
curl http://localhost:3015/api/health
```

## 📊 Monitoring

Check which processes are using the ports:
```bash
lsof -i :5015  # API
lsof -i :3020  # Web
lsof -i :5176  # Main App
lsof -i :3015  # Service
```

## 🛑 Stopping Applications

### Stop All (Script)
```bash
./scripts/stop-apps.sh
```

### Stop Individual Ports
```bash
# Find and kill process on port
lsof -ti:5015 | xargs kill   # API
lsof -ti:3020 | xargs kill   # Web
lsof -ti:5176 | xargs kill   # Main App
lsof -ti:3015 | xargs kill   # Service
```

### Stop Docker Containers
```bash
docker stop pacepard-api-local pacepard-web-local pacepard-app-local pacepard-service-local
```

## 📱 Accessing the Apps

Simply open these URLs in your browser:

- **Main Application**: http://localhost:5176
- **Web Application**: http://localhost:3020
- **Service Application**: http://localhost:3015
- **API Server**: http://localhost:5015

The API server provides backend services for the other applications.

## 🔄 Development Mode

All apps are running in development mode, which means:
- ✅ Hot reload enabled (changes auto-refresh)
- ✅ Source maps for debugging
- ✅ Detailed error messages
- ✅ Fast refresh for React components

## ⚠️ Troubleshooting

### Port Already in Use
If you see "port already in use" errors:
```bash
./scripts/stop-apps.sh
# Then restart
./scripts/start-apps.sh
```

### App Not Starting
1. Check dependencies: `pnpm install`
2. Check logs in terminal
3. Verify Node.js version: `node -v` (should be >= 20)
4. Verify pnpm version: `pnpm -v` (should be >= 9.0.0)

### Apps Running but Not Accessible
1. Check firewall settings
2. Verify ports aren't blocked
3. Try accessing `127.0.0.1` instead of `localhost`
4. Check if any proxy is interfering

## 📚 Additional Resources

- [Deployment Simulation Guide](./DEPLOYMENT-SIMULATION.md) - Full CI/CD simulation
- [README.md](../../README.md) - Project documentation
- [Docker Setup](../../docs/docker-setup.md) - Docker deployment guide
