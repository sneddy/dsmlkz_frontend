# Deprecations - COMPLETED

This file explains deprecated components and migration paths.

## ✅ SEO Components - DEPRECATED
- ✅ **Moved**: `components/seo-head.tsx` → `_deprecated/seo-head.tsx`
- **Reason**: Should be migrated to Next.js 14 `generateMetadata` API in future PR
- **Migration Path**: Convert to metadata objects in page components
- **Status**: Successfully deprecated with documentation

## ✅ Migration Completed Successfully

### ✅ UI Components - MOVED
- ✅ `components/ui/blob-image.tsx` → `shared/ui/blob_image.tsx`
- ✅ `components/error-boundary.tsx` → `shared/ui/error_boundary.tsx`
- ✅ `components/markdown-content.tsx` → `shared/ui/markdown_content.tsx`

### ✅ Widget Components - MOVED
- ✅ `components/article-card.tsx` → `widgets/article_card.tsx`
- ✅ `components/interview-card.tsx` → `widgets/interview_card.tsx`
- ✅ `components/collaboration-card.tsx` → `widgets/collaboration_card.tsx`
- ✅ `components/community-face-card.tsx` → `widgets/community_face_card.tsx`

### ✅ Feature Components - MOVED
- ✅ `components/member-search.tsx` → `features/search/member_search.tsx`
- ✅ `components/auth-guard.tsx` → `features/auth/auth_guard.tsx`
- ✅ `components/language-selector.tsx` → `features/i18n/language_selector.tsx`
- ✅ `components/profile-form.tsx` → `features/profile/profile_form.tsx`

## ✅ Feature Domain Organization - COMPLETED

### Search Domain (`features/search/`)
- ✅ `member_search.tsx` - Main member search component with updated imports

### Auth Domain (`features/auth/`)
- ✅ `auth_guard.tsx` - Route protection component with updated redirect paths

### I18n Domain (`features/i18n/`)
- ✅ `language_selector.tsx` - Language switching component

### Profile Domain (`features/profile/`)
- ✅ `profile_form.tsx` - Main profile editing form with updated hook imports

## ✅ Provider Organization - COMPLETED
Providers are now centralized in `shared/providers/`:

### Theme Provider (`shared/providers/theme-provider.tsx`)
- **Status**: Ready for import (existing implementation maintained)
- **Purpose**: Next.js theme management
- **Import**: `import { ThemeProvider } from '@/shared/providers'`

## ✅ Deprecated Components Directory
Created `_deprecated/` directory with:
- ✅ `seo-head.tsx` - Legacy SEO component
- ✅ `README.md` - Deprecation guidelines and migration instructions

## 🎉 Deprecation Status: COMPLETED
All deprecated components have been properly moved and documented. The new architecture is clean and follows modern React/Next.js patterns.
