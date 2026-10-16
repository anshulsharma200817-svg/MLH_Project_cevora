# GitHub Copilot Instructions

This directory contains path-specific instruction files that automatically apply to relevant files in your workspace.

## 📋 How Instructions Work

Instructions files use frontmatter with `applyTo` patterns to automatically activate when working with matching files:

```markdown
---
applyTo: '**/*.ts,**/*.tsx'
description: 'TypeScript development guidelines'
---
```

## 📦 Installed Instructions

### Core Stack Instructions

| File                                                                       | Applies To               | Description                                                |
| -------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------- |
| [nextjs.instructions.md](nextjs.instructions.md)                           | Next.js files            | Next.js best practices for App Router, RSC, server actions |
| [typescript-5-es2022.instructions.md](typescript-5-es2022.instructions.md) | `**/*.ts`, `**/*.tsx`    | TypeScript 5.x guidelines targeting ES2022 output          |
| [reactjs.instructions.md](reactjs.instructions.md)                         | `**/*.jsx`, `**/*.tsx`   | ReactJS development standards and patterns                 |
| [nextjs-tailwind.instructions.md](nextjs-tailwind.instructions.md)         | Next.js + Tailwind files | Next.js + Tailwind CSS development standards               |

### Quality & Testing

| File                                                                           | Applies To     | Description                                 |
| ------------------------------------------------------------------------------ | -------------- | ------------------------------------------- |
| [playwright-typescript.instructions.md](playwright-typescript.instructions.md) | `**/*.spec.ts` | Playwright E2E test generation and patterns |
| [a11y.instructions.md](a11y.instructions.md)                                   | All files      | Accessibility guidelines for inclusive code |

### DevOps & CI/CD

| File                                                                                                       | Applies To                                      | Description                            |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------- |
| [github-actions-ci-cd-best-practices.instructions.md](github-actions-ci-cd-best-practices.instructions.md) | `**/*.yml`, `**/*.yaml` in `.github/workflows/` | GitHub Actions workflow best practices |

## 🎯 How They Help

**Automatic Context**: When you open a `.tsx` file, Copilot automatically knows:

- Next.js App Router patterns (from `nextjs.instructions.md`)
- TypeScript best practices (from `typescript-5-es2022.instructions.md`)
- React component patterns (from `reactjs.instructions.md`)
- Tailwind CSS conventions (from `nextjs-tailwind.instructions.md`)
- Accessibility standards (from `a11y.instructions.md`)

**No manual context needed** - instructions apply based on file patterns.

## 📝 Usage Examples

### When writing a React component:

```typescript
// Copilot automatically applies:
// - nextjs.instructions.md
// - typescript-5-es2022.instructions.md
// - reactjs.instructions.md
// - nextjs-tailwind.instructions.md
// - a11y.instructions.md

export function AppCard({ app }: { app: App }) {
  // Copilot suggests code following all 5 instruction sets
}
```

### When writing a test:

```typescript
// playwright-typescript.instructions.md automatically applies
import { test, expect } from '@playwright/test';

test('should render app card', async ({ page }) => {
  // Copilot suggests Playwright-specific patterns
});
```

### When writing a workflow:

```yaml
# github-actions-ci-cd-best-practices.instructions.md applies
name: CI
on: [push]
jobs:
  # Copilot suggests GitHub Actions best practices
```

## ⚙️ Customization

To add project-specific rules, create new `.instructions.md` files:

```markdown
---
applyTo: 'src/lib/**/*.ts'
description: 'Firebase service layer patterns'
---

# Firebase Service Guidelines

- Use Firestore batch operations for multiple writes
- Implement proper error handling for offline scenarios
- ...
```

## 🔄 Updating Instructions

To update to latest versions from awesome-copilot:

```bash
cd .github/instructions
curl -o nextjs.instructions.md https://raw.githubusercontent.com/github/awesome-copilot/main/instructions/nextjs.instructions.md
# Repeat for other files...
```

## 📚 Learn More

- [awesome-copilot Instructions](https://github.com/github/awesome-copilot/blob/main/docs/README.instructions.md)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [VS Code Workspace Instructions](https://code.visualstudio.com/docs/copilot/copilot-customization)

## ⚠️ Note

These instructions were installed on January 25, 2026 from the awesome-copilot repository. They automatically apply based on file patterns defined in their frontmatter.
