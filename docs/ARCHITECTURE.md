# Architecture Guide

This file contains the architecture documentation.

## Feature-Sliced Design (FSD)

The project follows the Feature-Sliced Design methodology for better maintainability and scalability.

### Layers

#### 1. Shared Layer (`shared/`)
- **UI** - UI primitives and base components
- **Lib** - Shared utilities, hooks, and constants
- **Providers** - Global providers and contexts
- **Styles** - Global styles and CSS variables

#### 2. Widgets Layer (`widgets/`)
- **Content** - Content widgets (home, news, jobs, etc.)
- **Cards** - Card components (article, profile, member, etc.)
- **Sections** - Section components (hero, carousel, search, etc.)

#### 3. Features Layer (`features/`)
- **Auth** - Authentication features
- **Profile** - Profile management features
- **Search** - Search functionality
- **I18n** - Internationalization features
- **Cities** - Location features
- **Editor** - Content editing features

#### 4. App Layer (`app/`)
- Next.js App Router pages and layouts
- API routes
- Middleware

### Import Rules

- **Shared** can import only from shared
- **Widgets** can import from shared and widgets
- **Features** can import from shared, widgets, and features
- **App** can import from all layers

### File Naming

- Use kebab-case for file names
- Use PascalCase for component names
- Use camelCase for function and variable names

### Directory Structure

```
project/
├── shared/           # Shared resources
├── widgets/          # Large UI blocks
├── features/         # Business logic
├── app/              # Next.js pages
├── lib/              # Core libraries
├── types/            # TypeScript types
├── config/           # Configuration files
└── docs/             # Documentation
```
```



