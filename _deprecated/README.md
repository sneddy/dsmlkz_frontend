# Deprecated Components

This folder contains components that are deprecated and should not be used in new code.

## Components

### seo-head.tsx
- **Deprecated**: This component uses the legacy Next.js `Head` component
- **Reason**: Next.js 13+ App Router uses the new Metadata API instead
- **Migration**: Use Next.js Metadata API in layout.tsx or page.tsx files
- **Removal Date**: TBD

## Migration Guidelines

When migrating away from deprecated components:

1. Check if there's a modern equivalent in the new architecture
2. Update all imports to use the new components
3. Test thoroughly to ensure functionality is preserved
4. Remove the deprecated component once all references are updated
