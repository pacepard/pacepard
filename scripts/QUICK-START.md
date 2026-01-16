# 🚀 Quick Start - View Your Apps

All Pacepard applications are now **deployed and running** on your local machine!

## ✅ Apps Status

| App | URL | Status |
|-----|-----|--------|
| **Main App** | http://localhost:5176 | ✅ Running |
| **Web App** | http://localhost:3020 | ✅ Running |
| **Service App** | http://localhost:3015 | ✅ Running |
| **API Server** | http://localhost:5015 | ✅ Running |

## 🌐 Open All Apps in Browser

```bash
./scripts/open-apps.sh
```

This will automatically open all accessible apps in your default browser.

## 📱 Manual Access

Simply click or copy these URLs into your browser:

- **Main Application**: http://localhost:5176
- **Web Application**: http://localhost:3020  
- **Service Application**: http://localhost:3015
- **API Server**: http://localhost:5015

## 🔍 Check Status

```bash
./scripts/status.sh
```

## 🛑 Stop All Apps

```bash
./scripts/stop-apps.sh
```

## ▶️ Restart All Apps

```bash
./scripts/start-apps.sh
```

## 🐳 Deploy with Docker (Production-like)

If you want to deploy using Docker containers:

```bash
# Build and run all apps in Docker
./scripts/simulate-deployment.sh --run-containers
```

This will:
1. Build Docker images for each app
2. Start containers in production mode
3. Serve apps on the same ports

## 📊 What's Running

All apps are currently running in **development mode** with:
- ✅ Hot reload enabled
- ✅ Source maps for debugging
- ✅ Fast refresh
- ✅ Detailed error messages

## 🎯 Next Steps

1. **View the apps**: Open the URLs above in your browser
2. **Check status**: Run `./scripts/status.sh` anytime
3. **Make changes**: Code changes will auto-refresh
4. **Stop when done**: Run `./scripts/stop-apps.sh`

## 💡 Tips

- All apps run independently - you can stop/start them individually
- Development mode provides the best debugging experience
- Use Docker deployment for production-like testing
- Check logs in the terminal where you started each app

---

**All apps are ready to use!** 🎉
