
<img src="apps/web/public//blocks/pacepard.svg" alt="Pacepard Logo" width="400">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![Package Manager](https://img.shields.io/badge/package%20manager-pnpm-F69220)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/build%20system-turborepo-EF4444)](https://turbo.build/)

## Pacepard

### Helping African talents unlock their superhuman potential.

> Pacepard is a reward and engagement software for talents and product teams. We support the development of Open Source Software that solves problems faced daily by Africans, and we are creating points of entry into machine learning research.

By using Pacepard, African talents, organisations, and EdTech providers can collaborate, track talent skill mastery progress, and host competitions while leveraging our AI-powered engagement analytics.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Adding Dependencies](#adding-dependencies)
- [Building](#building)
- [Scripts Reference](#scripts-reference)
- [Contributing](#contributing)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.x ([Download](https://nodejs.org/))
- **pnpm** >= 9.0.0 ([Installation Guide](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/))

To verify your installations:

```bash
node --version  # Should be >= 20
pnpm --version  # Should be >= 9.0.0
git --version
```

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/pacepard/pacepard.git
cd pacepard
```

### Install Dependencies

Install all dependencies for the monorepo:

```bash
pnpm install
```

This will install dependencies for all apps and packages in the workspace.

### Verify Installation

After installation, you can verify everything is set up correctly:

```bash
pnpm run build
```

---

## Project Structure

This is a **monorepo** managed by [Turborepo](https://turbo.build/) and [pnpm workspaces](https://pnpm.io/workspaces). The project is organized as follows:

```
pacepard/
├── apps/              # Applications
│   ├── web/          # Next.js web application (@pacepard/web)
│   ├── api/          # Express API server (@pacepard/api)
│   ├── app/          # Main application (@pacepard/app)
│   ├── service/      # Service application (@pacepard/service)
│   ├── docs/         # Documentation site (@pacepard/docs)
│   └── main/         # Main app entry point
├── packages/          # Shared packages
│   ├── ui/           # UI component library (@pacepard/ui)
│   ├── core/         # Core utilities (@pacepard/core)
│   ├── editor/       # Editor package (@pacepard/editor)
│   └── auth/         # Authentication package (@pacepard/auth)
├── configs/          # Shared configurations
│   ├── eslint/       # ESLint configuration (@pacepard/configs/eslint)
│   └── typescript/   # TypeScript configuration (@pacepard/configs/typescript)
├── scripts/          # Utility scripts
├── package.json      # Root package.json
├── pnpm-workspace.yaml  # pnpm workspace configuration
├── turbo.json        # Turborepo configuration
└── tsconfig.json     # Root TypeScript configuration
```

### Workspace Packages

All packages use the `@pacepard/*` namespace:

- **Apps:**
  - `@pacepard/web` - Next.js web application (runs on port 3020)
  - `@pacepard/api` - Express API server
  - `@pacepard/app` - Main application
  - `@pacepard/service` - Service application
  - `@pacepard/docs` - Documentation site
  - `@pacepard/api-docs` - API documentation

- **Packages:**
  - `@pacepard/ui` - Shared UI component library (shadcn/ui based)
  - `@pacepard/core` - Core utilities and shared logic
  - `@pacepard/editor` - Editor functionality
  - `@pacepard/auth` - Authentication utilities

- **Configs:**
  - `@pacepard/configs/eslint` - Shared ESLint configuration
  - `@pacepard/configs/typescript` - Shared TypeScript configuration

---

## Development

### Running All Applications

Start all applications in development mode:

```bash
pnpm dev
```

### Running Specific Applications

You can run specific applications or groups:

```bash
# Frontend applications (web + app)
pnpm dev:fe

# Backend applications (api + api-docs)
pnpm dev:be

# Individual applications
pnpm dev:web      # Next.js web app (port 3020)
pnpm dev:api      # Express API server
pnpm dev:app      # Main application
pnpm dev:service  # Service application
pnpm dev:docs     # API documentation
```

### Running with Turbo UI

For a visual interface to monitor builds and tasks:

```bash
pnpm dev:ui
```

### Development URLs

- **Web App**: http://localhost:3020
- **API**: Check the API app's configuration for its port
- **Docs**: Check the docs app's configuration for its port

---

## Adding Dependencies

### Adding a Dependency to a Specific App or Package

To add a dependency to a specific workspace package:

```bash
# Add to a specific app/package
pnpm add <package-name> --filter @pacepard/web
pnpm add <package-name> --filter @pacepard/api
pnpm add <package-name> --filter @pacepard/ui
```

### Adding a Dev Dependency

```bash
pnpm add -D <package-name> --filter @pacepard/web
```

### Adding a Root Dependency

To add a dependency at the root level (shared across all packages):

```bash
pnpm add <package-name> -w
```

### Adding a Dependency to Multiple Packages

You can add to multiple packages at once:

```bash
pnpm add <package-name> --filter @pacepard/web --filter @pacepard/app
```

### Using Workspace Packages

To use a workspace package in another package, reference it in `package.json`:

```json
{
  "dependencies": {
    "@pacepard/ui": "workspace:*",
    "@pacepard/core": "workspace:*"
  }
}
```

The `workspace:*` protocol tells pnpm to use the local workspace version.

---

## Building

### Build All Packages

Build all apps and packages:

```bash
pnpm build
```

### Build Specific Package

```bash
pnpm build --filter @pacepard/web
pnpm build --filter @pacepard/api
```

### Build Documentation

```bash
pnpm build:docs
```

---

## Scripts Reference

### Root Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all applications in development mode |
| `pnpm dev:fe` | Start frontend applications (web + app) |
| `pnpm dev:be` | Start backend applications (api + api-docs) |
| `pnpm dev:web` | Start web application only |
| `pnpm dev:api` | Start API server only |
| `pnpm dev:app` | Start main app only |
| `pnpm dev:service` | Start service app only |
| `pnpm dev:docs` | Start docs app only |
| `pnpm dev:ui` | Start with Turborepo UI |
| `pnpm build` | Build all packages |
| `pnpm build:docs` | Build documentation |
| `pnpm test` | Run tests across all packages |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm check-types` | Type-check all packages |
| `pnpm clean` | Clean build artifacts |
| `pnpm clean:modules` | Remove all node_modules |
| `pnpm clean:all` | Remove node_modules and pnpm-lock.yaml |

### Package-Specific Scripts

Each app/package may have its own scripts. Check individual `package.json` files for details.

---

## Contributing

We welcome contributions! Here's how you can help:

### 1. Fork and Clone

```bash
# Fork the repository on GitHub (https://github.com/pacepard/pacepard), then:
git clone https://github.com/your-username/pacepard.git
cd pacepard
```

### 2. Create a Branch

Use the format `@username/feature-your-task` for branch names:

```bash
git checkout -b @username/feature-your-task
# or for bug fixes
git checkout -b @username/fix-your-bug-fix
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Make Your Changes

- Write clean, maintainable code
- Follow the existing code style
- Add tests if applicable
- Update documentation as needed

### 5. Run Checks

Before committing, ensure everything passes:

```bash
# Type checking
pnpm check-types

# Linting
pnpm lint

# Format code
pnpm format

# Build (optional, but recommended)
pnpm build
```

### 6. Commit Your Changes

We use [Changesets](https://github.com/changesets/changesets) for version management. For significant changes, create a changeset:

```bash
pnpm changeset
```

Follow conventional commit messages:

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

### 7. Keep Your Branch Up to Date

Before pushing or merging your feature, make sure your branch is up to date:

```bash
git fetch origin
git rebase origin/staging
```

### 8. Push to Remote

```bash
git push origin @username/feature-your-task
```

### 9. Create Pull Request

Create a Pull Request on GitHub with the following guidelines:

- **Target Branch**: Your PR should target `staging` — not `master`
- **Reference Issues**: Include the issue number in the PR description (e.g., `Closes #502`)
- **Add Context**: Provide context and screenshots/logs when helpful
- **Request Reviewers**: Request reviewers before merging

### 10. Merge into Staging (After PR Approval)

Once your PR is approved:

```bash
git checkout staging
git merge @username/feature-your-task-name
git push origin staging
```

### 11. Release Workflow

When ready for deployment, create a release branch from staging:

```bash
git checkout staging
git checkout -b release/v1.0.2
git push origin release/v1.0.2
```

Final QA and bug-fixing happen on this `release/*` branch before production deployment.

After final QA on the release branch, merge it into both `master` and `staging`:

```bash
# Merge into master
git checkout master
git merge release/v1.0.2
git push origin master

# Merge back into staging to ensure it stays updated
git checkout staging
git merge release/v1.0.2
git push origin staging
```

### Creating an Issue

If you discover a bug or have a suggestion, raise an issue via the GitHub Issues tab (if you have permission), or notify your team lead for triage and assignment.

### Development Guidelines

- **Code Style**: Follow the ESLint and Prettier configurations
- **TypeScript**: All code should be properly typed
- **Testing**: Add tests for new features when possible
- **Documentation**: Update README and code comments as needed
- **Workspace Packages**: Use workspace protocol (`workspace:*`) for internal dependencies

### Project-Specific Guidelines

- **UI Components**: Add new components to `@pacepard/ui` package
- **Shared Logic**: Put shared utilities in `@pacepard/core`
- **API Changes**: Update API documentation in `apps/docs`
- **Environment Variables**: Use `.env` files (they're gitignored)

### Pull Request Guidelines

- PRs should target the `staging` branch (not `master`)
- Reference issues using `Closes #issue-number` in the PR description
- Add context and screenshots/logs when helpful
- Request reviewers before merging

---

## Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

For questions, issues, or contributions, please open an issue on GitHub or contact the maintainers.
