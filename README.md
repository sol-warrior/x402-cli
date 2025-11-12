# x402-cli

> A professional CLI tool for simulating and testing Solana x402 payments (micropayments between agents and APIs)

[![CI](https://github.com/sol-warrior/x402-cli/workflows/CI/badge.svg)](https://github.com/sol-warrior/x402-cli/actions)
[![npm version](https://img.shields.io/npm/v/x402-cli.svg)](https://www.npmjs.com/package/x402-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

`x402-cli` is a production-ready TypeScript CLI tool designed to help developers simulate, test, and interact with Solana x402 payment protocols. It provides a clean, intuitive interface for sending micropayments on Solana networks and will support advanced features like signature verification, mock API servers, and facilitator services.

## Features

- ✅ **Send SOL Payments** - Transfer SOL tokens on devnet, mainnet-beta, or testnet
- 🔄 **Configuration Management** - Persistent CLI configuration with `init` command
- 🎨 **Beautiful CLI Output** - Color-coded logs and progress indicators
- 🔒 **Wallet Integration** - Secure keypair management (file-based)
- 📋 **Transaction Details** - Links to Solana Explorer for transaction verification
- 🚧 **Coming Soon**:
  - Signature verification (`verify` command)
  - Mock API server for testing (`mock-server` command)
  - Agent payment workflows (`agent-pay` command)
  - Facilitator services integration

## Installation

### Using npm

```bash
npm install -g @solwarrior/x402-cli
```

### Using npx (no installation required)

```bash
npx @solwarrior/x402-cli --help
```

### From Source

```bash
git clone https://github.com/sol-warrior/x402-cli.git
cd x402-cli
npm install
npm run build
npm link
```

## Quick Start

### 1. Initialize Configuration

```bash
x402-cli init --network devnet --rpc-url https://api.devnet.solana.com
```

### 2. Send a Payment

```bash
x402-cli pay \
  --recipient <RECIPIENT_ADDRESS> \
  --amount 0.1 \
  --from ~/.config/solana/id.json \
  --network devnet
```

### 3. View Help

```bash
x402-cli --help
x402-cli pay --help
```

## Usage

### Pay Command

Send SOL to a recipient address on Solana.

```bash
x402-cli pay [options]

Options:
  -r, --recipient <address>    Recipient Solana address (required)
  -a, --amount <amount>         Amount in SOL (required)
  -f, --from <path>             Path to keypair JSON file
  -n, --network <network>       Network: devnet, mainnet-beta, or testnet (default: devnet)
  --skip-preflight              Skip transaction preflight checks
  -h, --help                    Display help for command
```

**Example:**

```bash
x402-cli pay \
  --recipient So11111111111111111111111111111111111111112 \
  --amount 0.5 \
  --from ~/.config/solana/id.json \
  --network devnet
```

### Init Command

Configure default settings for the CLI.

```bash
x402-cli init [options]

Options:
  -n, --network <network>    Default network: devnet, mainnet-beta, or testnet
  -r, --rpc-url <url>        Custom RPC URL
  -w, --wallet <path>        Default wallet keypair path
  -h, --help                 Display help for command
```

**Example:**

```bash
x402-cli init --network devnet --wallet ~/.config/solana/id.json
```

### Verify Command (Coming Soon)

Verify payment signatures.

```bash
x402-cli verify <signature>
```

### Mock Server Command (Coming Soon)

Start a local mock API server for testing x402 payments.

```bash
x402-cli mock-server [options]
```

## Configuration

Configuration is stored in `~/.x402-cli/config.json`. You can modify it directly or use the `init` command.

**Example config:**

```json
{
  "rpcUrl": "https://api.devnet.solana.com",
  "network": "devnet",
  "defaultWallet": "~/.config/solana/id.json"
}
```

## Architecture

See [ARCHITECTURE.md](./docs/architecture.md) for detailed architecture documentation.

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

```bash
git clone https://github.com/sol-warrior/x402-cli.git
cd x402-cli
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
npm run test:watch
npm run test:coverage
```

### Lint & Format

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

### Local Development

```bash
# Build and link locally
npm run build
npm link

# Test the CLI
x402-cli --help
```

## Roadmap

See [ROADMAP.md](./docs/roadmap.md) for planned features and improvements.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./docs/contributing.md) for guidelines.

## Security

**⚠️ Important Security Notes:**

- Never commit private keys or keypair files to version control
- This CLI uses file-based keypair management for development/testing
- For production use, integrate with proper wallet adapters (Phantom, Solflare, etc.)
- Always use testnet/devnet for development and testing

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

- 📖 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/sol-warrior/x402-cli/issues)
- 💬 [Discussions](https://github.com/sol-warrior/x402-cli/discussions)

## Acknowledgments

Built with ❤️ by [Nishant](https://github.com/sol-warrior)

Inspired by the Solana x402 protocol and micropayment innovations in the Web3 ecosystem.

## Related Projects

- [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) - Solana JavaScript SDK
- [Solana CLI](https://docs.solana.com/cli) - Official Solana CLI tool
