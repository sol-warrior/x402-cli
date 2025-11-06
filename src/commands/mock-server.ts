/**
 * Mock server command - Simulate x402 APIs (future implementation)
 */

import { Command } from 'commander';
import { logger } from '../core/logger';

export function createMockServerCommand(): Command {
  const command = new Command('mock-server');

  command
    .description('Start a mock x402 API server for testing (coming soon)')
    .option('-p, --port <port>', 'Port to run server on', '3000')
    .option('-n, --network <network>', 'Network to use', 'devnet')
    .action(async options => {
      logger.warning('The mock-server command is not yet implemented.');
      logger.info('This feature will provide a local API server for testing x402 payments.');
      logger.info(`Planned options: port=${options.port}, network=${options.network}`);
      // TODO: Implement mock server
    });

  return command;
}
