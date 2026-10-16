# GitHub Copilot Prompts

This directory contains reusable GitHub Copilot prompts from the [awesome-copilot](https://github.com/github/awesome-copilot) repository.

## 📋 How to Use

1. **Via VS Code Chat**: Type `/prompt-name` in the Copilot chat (e.g., `/create-readme`)
2. **Command Palette**: Run `Chat: Run Prompt` and select from the list
3. **Run Button**: Open a prompt file and click the run button

## 📦 Installed Prompts

### Documentation & Planning

| Prompt                                                                                           | Command                                 | Description                                 |
| ------------------------------------------------------------------------------------------------ | --------------------------------------- | ------------------------------------------- |
| [create-readme.prompt.md](create-readme.prompt.md)                                               | `/create-readme`                        | Create comprehensive README.md files        |
| [create-specification.prompt.md](create-specification.prompt.md)                                 | `/create-specification`                 | Create AI-optimized specification documents |
| [create-implementation-plan.prompt.md](create-implementation-plan.prompt.md)                     | `/create-implementation-plan`           | Generate detailed implementation plans      |
| [create-architectural-decision-record.prompt.md](create-architectural-decision-record.prompt.md) | `/create-architectural-decision-record` | Document architectural decisions (ADRs)     |
| [add-educational-comments.prompt.md](add-educational-comments.prompt.md)                         | `/add-educational-comments`             | Add learning-focused comments to code       |

### Development & Quality

| Prompt                                                                       | Command                       | Description                              |
| ---------------------------------------------------------------------------- | ----------------------------- | ---------------------------------------- |
| [github-copilot-starter.prompt.md](github-copilot-starter.prompt.md)         | `/github-copilot-starter`     | Set up complete Copilot configuration    |
| [javascript-typescript-jest.prompt.md](javascript-typescript-jest.prompt.md) | `/javascript-typescript-jest` | Jest testing best practices              |
| [review-and-refactor.prompt.md](review-and-refactor.prompt.md)               | `/review-and-refactor`        | Code review and refactoring              |
| [conventional-commit.prompt.md](conventional-commit.prompt.md)               | `/conventional-commit`        | Generate conventional commit messages    |
| [multi-stage-dockerfile.prompt.md](multi-stage-dockerfile.prompt.md)         | `/multi-stage-dockerfile`     | Create optimized multi-stage Dockerfiles |

### GitHub Integration

| Prompt                                                   | Command             | Description               |
| -------------------------------------------------------- | ------------------- | ------------------------- |
| [my-issues.prompt.md](my-issues.prompt.md)               | `/my-issues`        | List your assigned issues |
| [my-pull-requests.prompt.md](my-pull-requests.prompt.md) | `/my-pull-requests` | List your pull requests   |

## 🎯 Quick Start Examples

### Create README

```
@workspace /create-readme
```

### Write Tests

```
#file:MyComponent.tsx /javascript-typescript-jest
Write comprehensive tests for this component
```

### Generate Commit Message

```
/conventional-commit
```

### Review Code

```
@workspace /review-and-refactor
```

## 🔄 Updating Prompts

To update prompts to the latest versions from awesome-copilot:

```bash
cd .github/prompts
curl -o create-readme.prompt.md https://raw.githubusercontent.com/github/awesome-copilot/main/prompts/create-readme.prompt.md
# Repeat for other prompts...
```

## 📚 Learn More

- [awesome-copilot Prompts](https://github.com/github/awesome-copilot/blob/main/docs/README.prompts.md)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [VS Code Chat Documentation](https://code.visualstudio.com/docs/copilot/copilot-chat)

## ⚠️ Note

These prompts were installed on January 25, 2026. Check for updates periodically to get the latest features and improvements.
