# @pacepard/app

Main application entry point for Pacepard. A Vite-based React application that serves as the primary user interface.

## Overview

This is the main application that provides the core user experience for Pacepard, including workspace management, project collaboration, and talent engagement features.

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- pnpm (for package management)

### Installation

From the monorepo root:

```bash
pnpm install
```

### Development

Start the development server:

```bash
# From the monorepo root
pnpm dev --filter @pacepard/app

# Or from the app directory
cd apps/main
pnpm dev
```

The app will be available at `http://localhost:5196` (configured port).

### Building

Build the application for production:

```bash
# From the monorepo root
pnpm build --filter @pacepard/app

# Or from the app directory
cd apps/main
pnpm build
```

### Preview

Preview the production build:

```bash
# From the monorepo root
pnpm preview --filter @pacepard/app

# Or from the app directory
cd apps/main
pnpm preview
```

The preview will be available at `http://localhost:5196` (configured port).

## Project Structure

```
apps/main/
├── src/
│   ├── app/              # Application routes and pages
│   ├── components/       # React components
│   ├── config/           # Configuration files
│   ├── hooks/            # Custom React hooks
│   ├── routes/           # Route definitions
│   └── utils/            # Utility functions
├── public/               # Static assets
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Package dependencies
```

## Dependencies

This application uses:

- **@pacepard/tiptap**: Tiptap editor functionality
- **@pacepard/sdk**: SDK for API interactions
- **@pacepard/ui**: UI component library
- **React**: UI framework
- **React Router**: Client-side routing
- **Vite**: Build tool and dev server
- **TanStack Query**: Data fetching and state management

## Configuration

The app uses shared configurations from the monorepo:

- **TypeScript**: Extends `@pacepard/configs/typescript/base.app.json`
- **ESLint**: Uses `@pacepard/configs/eslint/react-internal`

## Development Notes

- Development server runs on port `5196` (configured in `package.json`)
- Uses Vite with React SWC plugin for fast refresh
- Includes Tailwind CSS for styling
- SDK path aliases are configured via custom Vite plugin
