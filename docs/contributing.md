# Contributing to x402-cli

Thank you for your interest in contributing to `x402-cli`! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Follow professional standards

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Basic TypeScript knowledge

### Development Setup

1. **Fork the repository**

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/sol-warrior/x402-cli.git
cd x402-cli
```

2. **Install dependencies**

```bash
npm install
```

3. **Build the project**

```bash
npm run build
```

4. **Run tests**

```bash
npm test
```

5. **Link locally (optional)**

```bash
npm link
```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch (if applicable)
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Creating a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Making Changes

1. **Code Style**
   - Follow existing code style
   - Run `npm run format` before committing
   - Run `npm run lint` to check for issues

2. **TypeScript**
   - Use strict TypeScript settings
   - Add types for all new code
   - Avoid `any` types (use `unknown` if needed)

3. **Testing**
   - Write tests for new features
   - Ensure all tests pass (`npm test`)
   - Aim for high test coverage

4. **Documentation**
   - Update README.md if needed
   - Add JSDoc comments for public APIs
   - Update architecture docs if structure changes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

**Examples:**

```
feat(pay): add batch payment support
fix(config): handle corrupted config files gracefully
docs(readme): update installation instructions
test(utils): add tests for address validation
```

### Pre-commit Checks

Husky runs pre-commit hooks automatically:

- Linting
- Formatting check
- Tests

To bypass (not recommended):

```bash
git commit --no-verify
```

## Pull Request Process

### Before Submitting

1. **Update your branch**

   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run all checks**

   ```bash
   npm run lint
   npm run format:check
   npm test
   npm run build
   ```

3. **Test your changes**
   - Test locally with `npm link`
   - Test on different Node.js versions if possible
   - Test edge cases

### Submitting a PR

1. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Use clear, descriptive title
   - Reference related issues
   - Describe changes in detail
   - Include screenshots if UI changes

3. **PR Template**
   - Description of changes
   - Testing steps
   - Checklist
   - Related issues

### PR Review Process

- Maintainers will review within 48 hours
- Address feedback promptly
- Keep PR focused (one feature/fix per PR)
- Keep PRs small when possible

### After Approval

- Squash commits if requested
- Wait for CI to pass
- Maintainers will merge

## Code Standards

### TypeScript

- Use strict mode
- Prefer interfaces over types for object shapes
- Use `const` assertions where appropriate
- Avoid `any` - use `unknown` if type is truly unknown

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Functions**: `camelCase`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase` (no `I` prefix)

### Code Organization

- One function/class per file when possible
- Group related code together
- Keep functions small and focused
- Use early returns for readability

### Error Handling

- Use try/catch for async operations
- Provide clear error messages
- Log errors appropriately
- Exit with proper exit codes

### Examples

**Good:**

```typescript
async function sendPayment(options: PaymentOptions): Promise<PaymentResult> {
  try {
    const result = await processPayment(options);
    return { status: 'success', ...result };
  } catch (error) {
    logger.error(`Payment failed: ${error.message}`);
    return { status: 'failed', error: error.message };
  }
}
```

**Bad:**

```typescript
async function sendPayment(options: any) {
  const result = await processPayment(options);
  return result;
}
```

## Testing Guidelines

### Unit Tests

- Test one thing per test
- Use descriptive test names
- Test edge cases
- Mock external dependencies

**Example:**

```typescript
describe('isValidSolanaAddress', () => {
  it('should validate correct Solana addresses', () => {
    expect(isValidSolanaAddress('111...111')).toBe(true);
  });

  it('should reject invalid addresses', () => {
    expect(isValidSolanaAddress('invalid')).toBe(false);
  });
});
```

### Integration Tests

- Test command execution end-to-end
- Use real Solana devnet for network tests
- Clean up after tests

## Documentation

### Code Comments

- Add JSDoc for public functions
- Explain "why" not "what"
- Update comments when code changes

**Example:**

```typescript
/**
 * Send SOL payment to a recipient address.
 * Validates inputs, checks balance, and sends transaction.
 *
 * @param options - Payment options including recipient and amount
 * @returns Payment result with signature or error
 */
export async function sendPayment(options: PaymentOptions): Promise<PaymentResult> {
  // ...
}
```

### README Updates

- Update usage examples
- Add new command documentation
- Update installation steps if needed

## Areas for Contribution

### High Priority

- Test coverage improvements
- Bug fixes
- Documentation improvements
- Performance optimizations

### Feature Development

- See [ROADMAP.md](./roadmap.md) for planned features
- Pick a feature from roadmap
- Discuss in issue before implementing

### Bug Reports

- Use GitHub Issues
- Include: steps to reproduce, expected vs actual behavior, environment details
- Add labels if possible

## Questions?

- Open a GitHub Discussion
- Check existing issues
- Review documentation

## Thank You!

Your contributions make this project better. Thank you for taking the time to contribute! 🎉
