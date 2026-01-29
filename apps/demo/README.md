# Pacepard Demo

A demonstration application showcasing the Pacepard Tiptap editor implementations. This app includes two editor examples: a simple editor and a Notion-like editor.

## Overview

This demo app provides working examples of how to use the `@pacepard/tiptap` package to build rich text editors with various features and configurations.

## Available Editors

### Simple Editor

A straightforward editor implementation with basic formatting tools, suitable for simple content editing needs.

**Features:**
- Basic text formatting (bold, italic, strike, code, underline)
- Headings and lists
- Blockquotes and code blocks
- Text alignment
- Image uploads
- Link insertion
- Color highlighting
- Superscript and subscript

### Notion-like Editor

A comprehensive editor implementation inspired by Notion, with advanced features and collaboration support.

**Features:**
- All features from Simple Editor
- Advanced collaboration support
- AI-powered features
- Table of contents
- Drag and drop
- Slash commands
- Emoji and mention support
- Advanced table editing
- Mobile-responsive toolbars

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
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
pnpm dev --filter @pacepard/demo

# Or from the demo directory
cd apps/demo
pnpm dev
```

The app will be available at `http://localhost:5186` (configured port).

### Building

Build the application for production:

```bash
pnpm build
```

### Preview

Preview the production build:

```bash
# From the monorepo root
pnpm preview --filter @pacepard/demo

# Or from the demo directory
cd apps/demo
pnpm preview
```

The preview will be available at `http://localhost:5186` (configured port).

## Project Structure

```
apps/demo/
├── apps/
│   ├── App.tsx              # Main app router
│   ├── main.tsx             # Application entry point
│   ├── simple/              # Simple editor implementation
│   │   ├── simple-editor.tsx
│   │   ├── simple-editor.scss
│   │   ├── theme-toggle.tsx
│   │   └── data/
│   │       └── content.json
│   └── notion-like/         # Notion-like editor implementation
│       ├── notion-like-editor.tsx
│       ├── notion-like-editor.scss
│       ├── notion-like-editor-header.tsx
│       └── ... (other components)
├── public/                  # Static assets
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Package dependencies
```

## Dependencies

This demo app uses:

- **@pacepard/tiptap**: The core Tiptap editor package with shared components, hooks, and utilities
- **React**: UI framework
- **React Router**: Client-side routing
- **Vite**: Build tool and dev server

## Configuration

The app uses shared configurations from the monorepo:

- **TypeScript**: Extends `@pacepard/configs/typescript/base.app.json`
- **ESLint**: Uses `@pacepard/configs/eslint/react-internal`

## Routes

- `/` - Home page with editor selection
- `/editor` - Simple editor demo
- `/notion` - Notion-like editor demo

## Development Notes

- All shared editor components, hooks, and utilities come from `@pacepard/tiptap`
- Demo-specific files (themes, styles, data) are kept in the `apps/` directory
- The `@` alias points to the `apps/` directory for local imports
- Uses shared TypeScript and ESLint configurations from `@pacepard/configs`
- Development server runs on port `5186` (configured in `package.json`)

## Adding Tiptap Resources

To add new Tiptap components or extensions that can be used in the demo:

```bash
# From packages/tiptap directory
cd packages/tiptap
pnpm dlx @tiptap/cli@latest add heading-button

# Then import in your demo app
import { HeadingButton } from '@pacepard/tiptap/components/tiptap-ui/heading-button'
```
