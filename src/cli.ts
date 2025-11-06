#!/usr/bin/env node

/**
 * x402-cli - Main CLI entry point
 * A professional CLI tool for simulating and testing Solana x402 payments
 */

import { Command } from 'commander';
import { logger } from './core/logger';
import { createPayCommand } from './commands/pay';
import { createVerifyCommand } from './commands/verify';
import { createInitCommand } from './commands/init';
import { createMockServerCommand } from './commands/mock-server';

const pkg = require('../package.json');

function main(): void {
  const program = new Command();

  program
    .name('x402-cli')
    .description('A CLI tool for simulating and testing Solana x402 payments')
    .version(pkg.version, '-v, --version', 'Display version number')
    .option('-V, --verbose', 'Enable verbose logging');

  // Register commands
  program.addCommand(createPayCommand());
  program.addCommand(createVerifyCommand());
  program.addCommand(createInitCommand());
  program.addCommand(createMockServerCommand());

  // Parse arguments
  program.parse();

  // Set verbose mode if flag is present
  if (program.opts().verbose) {
    logger.setVerbose(true);
  }
}

// Run CLI
main();
