# Roadmap

This document outlines the planned features and improvements for `x402-cli`.

## Current Status (v0.1.0)

✅ **Completed:**

- Core CLI infrastructure
- `pay` command - Send SOL payments
- `init` command - Configuration management
- `verify` command - Transaction verification
- Configuration system
- Logging and error handling
- Unit tests
- CI/CD pipeline
- Documentation

## Short-term (v0.2.0 - v0.3.0)

### Enhanced Pay Command (v0.2.0)

- [ ] Multiple recipients support
- [ ] Batch payments
- [ ] Payment scheduling
- [ ] Transaction fee estimation
- [ ] Better error messages

### Mock Server (v0.3.0)

- [ ] Express.js-based mock API server
- [ ] x402 payment endpoint simulation
- [ ] Test payment workflows
- [ ] Configurable endpoints
- [ ] Request/response logging

**Example Usage:**

```bash
x402-cli mock-server --port 3000
x402-cli mock-server --network devnet --verbose
```

## Medium-term (v0.4.0 - v0.5.0)

### Agent Payment Workflows (v0.4.0)

- [ ] `agent-pay` command
- [ ] Agent-to-agent payment flows
- [ ] Payment request generation
- [ ] Agent discovery
- [ ] Payment verification

### Facilitator Integration (v0.5.0)

- [ ] Facilitator discovery
- [ ] Payment routing through facilitators
- [ ] Fee calculation and display
- [ ] Facilitator selection
- [ ] Multi-hop payments

### Wallet Integration (v0.5.0)

- [ ] Wallet adapter support
- [ ] Phantom wallet integration
- [ ] Solflare wallet integration
- [ ] CLI wallet prompts
- [ ] Hardware wallet support (Ledger)

## Long-term (v0.6.0+)

### Advanced Features

- [ ] Payment templates
- [ ] Recurring payments
- [ ] Payment analytics
- [ ] Multi-signature support
- [ ] Token payments (SPL tokens)

### Developer Experience

- [ ] Interactive CLI mode
- [ ] Command aliases
- [ ] Plugin system
- [ ] Custom command support
- [ ] Better error recovery

### SDK Extraction

- [ ] Extract core logic into `@x402/sdk`
- [ ] Browser-compatible SDK
- [ ] TypeScript-first SDK
- [ ] Comprehensive SDK documentation
- [ ] SDK examples and tutorials

### Testing & Quality

- [ ] Integration test suite
- [ ] E2E tests with real networks
- [ ] Performance benchmarks
- [ ] Security audit
- [ ] Code coverage goals (90%+)

### Documentation

- [ ] Interactive tutorials
- [ ] Video guides
- [ ] API documentation
- [ ] Architecture diagrams
- [ ] Best practices guide

### CI/CD Improvements

- [ ] Automated release notes
- [ ] Semantic versioning automation
- [ ] Automated dependency updates
- [ ] Multi-platform builds
- [ ] Performance regression testing

## Feature Ideas (Under Consideration)

### Payment Features

- Payment history tracking
- Payment receipts generation
- Payment analytics dashboard
- Payment scheduling/cron
- Conditional payments

### Integration Features

- Webhook support
- REST API wrapper
- GraphQL API
- Database integration
- Cloud provider integrations

### Developer Tools

- Payment testing framework
- Mock network support
- Transaction replay tools
- Debugging utilities
- Payment simulation tools

## Versioning Strategy

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features, backward compatible
- **PATCH** (0.0.x): Bug fixes, backward compatible

## Release Cycle

- **Monthly releases** for minor features
- **Hotfix releases** as needed for critical bugs
- **Major releases** planned quarterly (if needed)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./contributing.md) for guidelines.

**Priority areas for contributors:**

1. Test coverage improvements
2. Documentation enhancements
3. Bug fixes
4. Feature implementations from roadmap

## Feedback

Have ideas or suggestions? Please:

- Open an issue
- Start a discussion
- Submit a pull request

## Related Projects

- [Solana CLI](https://docs.solana.com/cli)
- [@solana/web3.js](https://github.com/solana-labs/solana-web3.js)
- [Anchor Framework](https://www.anchor-lang.com/)
