# Architecture

This document describes the architecture and design decisions for `x402-cli`.

## Overview

`x402-cli` is designed as a modular, extensible CLI tool following industry best practices. The architecture emphasizes:

- **Modularity** - Clear separation of concerns
- **Type Safety** - Strict TypeScript configuration
- **Testability** - Unit and integration tests
- **Extensibility** - Easy to add new commands and features
- **Developer Experience** - Clean APIs and comprehensive documentation

## Project Structure

```
x402-cli/
├── src/
│   ├── cli.ts                 # Main CLI entry point
│   ├── commands/              # Command implementations
│   │   ├── pay.ts            # Pay command
│   │   ├── verify.ts         # Verify command (future)
│   │   ├── init.ts           # Init command
│   │   └── mock-server.ts    # Mock server (future)
│   ├── core/                  # Core business logic
│   │   ├── solana.ts         # Solana blockchain interactions
│   │   ├── config.ts         # Configuration management
│   │   ├── logger.ts         # Logging utilities
│   │   └── utils.ts          # Shared utilities
│   ├── types/                 # TypeScript type definitions
│   │   └── index.d.ts
│   └── tests/                 # Test files
│       ├── pay.test.ts
│       ├── verify.test.ts
│       └── mock-server.test.ts
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI
├── .husky/                   # Git hooks
│   └── pre-commit
├── docs/                     # Documentation
│   ├── architecture.md
│   ├── roadmap.md
│   └── contributing.md
└── [config files]
```

## Core Modules

### CLI Entry Point (`cli.ts`)

The main entry point that:

- Sets up Commander.js program
- Registers all commands
- Handles global options (verbose, version)
- Parses command-line arguments

### Commands (`commands/`)

Each command is a self-contained module that:

- Exports a `createXCommand()` function
- Returns a configured Commander.js `Command` instance
- Handles command-specific logic
- Uses core modules for business logic

**Design Pattern:**

- Commands are thin wrappers around core logic
- All business logic lives in `core/` modules
- Commands handle CLI-specific concerns (parsing, output formatting)

### Core Modules (`core/`)

#### `solana.ts`

Handles all Solana blockchain interactions:

- Connection management
- Transaction creation and sending
- Keypair loading and management
- Balance queries

**Design Decisions:**

- Uses `@solana/web3.js` for blockchain interactions
- Supports multiple networks (devnet, mainnet-beta, testnet)
- Current implementation uses file-based keypairs (for development)
- Future: Integration with wallet adapters

#### `config.ts`

Manages CLI configuration:

- Loads/saves configuration from `~/.x402-cli/config.json`
- Provides defaults
- Handles configuration merging

**Design Decisions:**

- Configuration stored in user's home directory
- JSON format for human readability
- Graceful fallback to defaults on corruption

#### `logger.ts`

Provides colored, formatted console output:

- Info, success, warning, error, debug levels
- Uses `chalk` for colors
- Verbose mode support

**Design Decisions:**

- Centralized logging for consistent output
- Verbose mode for debugging
- Console-based (no file logging for CLI)

#### `utils.ts`

Shared utility functions:

- Address validation
- SOL/lamports conversion
- Address truncation
- Network RPC URL resolution

**Design Decisions:**

- Pure functions where possible
- Reusable across commands
- Well-tested

### Types (`types/`)

Centralized TypeScript type definitions:

- `CliConfig` - Configuration structure
- `PaymentOptions` - Payment command options
- `PaymentResult` - Payment operation result
- `VerificationResult` - Verification result
- Shared types exported for use across modules

## Command Flow

### Pay Command Flow

```
User Input
  ↓
cli.ts (parse args)
  ↓
commands/pay.ts (validate, parse options)
  ↓
core/solana.ts (sendPayment)
  ├─→ Load keypair
  ├─→ Create connection
  ├─→ Validate balance
  ├─→ Create transaction
  └─→ Send transaction
  ↓
core/logger.ts (output result)
  ↓
Exit
```

### Init Command Flow

```
User Input
  ↓
cli.ts (parse args)
  ↓
commands/init.ts (parse options)
  ↓
core/config.ts (saveConfig)
  ↓
core/logger.ts (output success)
  ↓
Exit
```

## Testing Strategy

### Unit Tests

- Core modules (`utils.ts`, `config.ts`, `logger.ts`)
- Pure functions
- Mocked dependencies

### Integration Tests

- End-to-end command execution
- Real Solana interactions (devnet)
- Transaction verification

### Test Tools

- **Vitest** - Fast, Vite-native test runner
- **Coverage** - v8 coverage provider
- **CI Integration** - Automated testing on PR/commit

## Configuration Management

### Configuration Location

- Path: `~/.x402-cli/config.json`
- Format: JSON
- Defaults: Hardcoded in `config.ts`

### Configuration Schema

```typescript
interface CliConfig {
  rpcUrl?: string;
  network?: 'devnet' | 'mainnet-beta' | 'testnet';
  defaultWallet?: string;
}
```

### Configuration Priority

1. Command-line arguments (highest priority)
2. Configuration file
3. Defaults (lowest priority)

## Error Handling

### Error Types

1. **Validation Errors** - Invalid input (addresses, amounts)
2. **Network Errors** - RPC connection issues
3. **Transaction Errors** - Insufficient balance, transaction failures
4. **File System Errors** - Missing keypair files, config issues

### Error Handling Strategy

- Commands catch errors and display user-friendly messages
- Core modules throw errors with clear messages
- CLI exits with appropriate exit codes (0 = success, 1 = error)
- Errors logged with `logger.error()`

## Future Architecture Considerations

### Wallet Integration

Current: File-based keypairs
Future: Wallet adapter integration

- Support for browser wallets (Phantom, Solflare)
- CLI wallet prompts
- Hardware wallet support

### Facilitator Services

Future: `facilitator.ts` module

- Facilitator discovery
- Payment routing
- Fee calculation

### Mock Server

Future: `mock-server.ts` command

- Express.js server
- x402 API simulation
- Test payment endpoints

## Performance Considerations

- **Connection Pooling**: Reuse Solana connections when possible
- **Transaction Batching**: Future support for batch payments
- **Caching**: Cache network configuration and RPC URLs
- **Lazy Loading**: Load keypairs only when needed

## Security Considerations

- **Keypair Storage**: Never commit keys to version control
- **Input Validation**: Validate all addresses and amounts
- **Transaction Signing**: Local signing only (no remote signing)
- **Network Selection**: Explicit network selection required
- **Preflight Checks**: Default enabled (can be skipped for testing)

## Dependencies

### Runtime Dependencies

- `@solana/web3.js` - Solana blockchain SDK
- `commander` - CLI framework
- `chalk` - Terminal colors
- `ora` - Spinners/loading indicators

### Development Dependencies

- `typescript` - TypeScript compiler
- `vitest` - Test runner
- `eslint` - Linting
- `prettier` - Code formatting
- `husky` - Git hooks

## Build Process

1. TypeScript compilation (`tsc`)
2. Output to `dist/`
3. Type declarations included
4. Source maps for debugging
5. Package.json configured for npm publishing

## Publishing

### npm Package Structure

- `dist/` - Compiled JavaScript
- `README.md` - Documentation
- `LICENSE` - License file
- `package.json` - Package metadata

### Versioning

- Follows semantic versioning (semver)
- Automated via GitHub Actions on tag push
- Pre-publish checks: build, test, lint
