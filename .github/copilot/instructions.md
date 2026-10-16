# Amity Labs Showcase - GitHub Copilot Instructions

## Project Context

This is **Amity Labs Showcase** - a technology showcase platform for the Amity University community built with Next.js 14, TypeScript, Firebase, and Tailwind CSS.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.8+
- **Styling**: Tailwind CSS 3.4 + shadcn/ui components
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation

## Code Style & Standards (2026)

### TypeScript

- Use `type` for object shapes, `interface` only for extensible APIs
- Prefer `type` imports: `import type { App } from '@/types'`
- Enable strict mode; avoid `any` - use `unknown` when type is genuinely unknown
- Use const assertions for immutable data
- Leverage discriminated unions for complex state

### React Patterns

- Use Server Components by default (Next.js App Router)
- Add `'use client'` directive only when needed (hooks, events, browser APIs)
- Prefer composition over HOCs and render props
- Use React.memo() sparingly - only for expensive renders
- Implement proper error boundaries for production resilience

### Component Structure

```tsx
// 1. Type imports first
import type { ComponentProps } from 'react';

// 2. External imports
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 3. Internal imports (organized)
import { Button } from '@/components/ui/button';
import { AppCard } from '@/components/apps/AppCard';

// 4. Types/interfaces
type Props = {
  // ...
};

// 5. Component
export function MyComponent({ prop }: Props) {
  // ...
}
```

### Styling & UI

- Use shadcn/ui components from `@/components/ui/`
- Follow Tailwind utility-first approach
- Use `cn()` utility for conditional classes: `cn('base-classes', condition && 'extra-classes')`
- Prefer semantic color tokens: `bg-background`, `text-foreground`
- Mobile-first responsive design: Start with base styles, add `md:`, `lg:` breakpoints

### Data Fetching & State

- Use TanStack Query for server state
- Implement proper loading and error states
- Use optimistic updates for better UX
- Leverage React Suspense for data fetching
- Cache Firebase queries appropriately

### Firebase Patterns

- Check `isFirebaseReady` before Firestore operations
- Use proper error handling with try-catch
- Implement pagination for large collections
- Use security rules for access control
- Validate data with Zod schemas before submission

### Forms & Validation

- Use React Hook Form for form management
- Integrate Zod for schema validation with `zodResolver`
- Provide clear error messages
- Implement proper accessibility (ARIA labels)
- Use controlled components for complex interactions

### Performance Best Practices

- Lazy load components with `dynamic()` from `next/dynamic`
- Optimize images with Next.js Image component
- Implement proper code splitting
- Use React Server Components to reduce bundle size
- Debounce expensive operations

### Accessibility (A11Y)

- Use semantic HTML elements
- Provide proper ARIA labels and roles
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Test with screen readers

### Error Handling

- Create error boundaries for graceful degradation
- Log errors appropriately (console.error for dev, analytics for prod)
- Provide user-friendly error messages
- Implement retry mechanisms for network failures
- Show loading states during async operations

### Testing (When Implemented)

- Write unit tests for utilities and hooks
- Integration tests for critical user flows
- E2E tests for main features
- Test accessibility with automated tools
- Use React Testing Library patterns

## File Organization

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # shadcn/ui primitives
│   ├── layout/      # Layout components
│   ├── apps/        # App-specific components
│   └── admin/       # Admin components
├── lib/             # Utilities and services
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── data/            # Static data and constants
```

## Naming Conventions

- **Components**: PascalCase (e.g., `AppCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `type App = ...`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_UPLOAD_SIZE`)

## Git Commit Messages

Follow Conventional Commits:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting, missing semi-colons, etc.
- `refactor:` code restructuring
- `test:` adding tests
- `chore:` maintenance tasks

## Environment Variables

Required in `.env.local`:

- Firebase config (NEXT*PUBLIC_FIREBASE*\*)
- API keys and secrets
- Feature flags

## Security Considerations

- Never expose Firebase Admin SDK credentials in client code
- Validate all user inputs
- Implement proper authentication checks
- Use Firebase Security Rules
- Sanitize data before rendering

## When Generating Code

1. Ask for clarification if requirements are ambiguous
2. Suggest better approaches if there's a more optimal solution
3. Consider edge cases and error scenarios
4. Include proper TypeScript types
5. Follow the project's existing patterns and conventions
6. Add comments for complex logic
7. Consider accessibility from the start
8. Think about responsive design
9. Optimize for performance
10. Write self-documenting code

## Project-Specific Context

- **Target Users**: Amity University students and faculty
- **Main Features**: App showcase, submissions, admin dashboard
- **Categories**: Campus, Research, Student projects
- **Admin Features**: App approval, visibility management
- **Public Features**: Browse apps, view details, filter by category

## Additional Notes

- Prioritize user experience and performance
- Keep components focused and reusable
- Document complex logic
- Consider SEO for public pages
- Maintain consistency with existing codebase
