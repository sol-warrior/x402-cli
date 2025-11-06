/**
 * Init command - Initialize CLI configuration
 */

import { Command } from 'commander';
import { logger } from '../core/logger';
import { saveConfig, getConfigPath } from '../core/config';

export function createInitCommand(): Command {
  const command = new Command('init');

  command
    .description('Initialize x402-cli configuration')
    .option(
      '-n, --network <network>',
      'Default network: devnet, mainnet-beta, or testnet',
      'devnet'
    )
    .option('-r, --rpc-url <url>', 'Custom RPC URL')
    .option('-w, --wallet <path>', 'Default wallet keypair path')
    .action(async options => {
      try {
        const config: Record<string, string> = {};

        if (options.network) {
          const validNetworks = ['devnet', 'mainnet-beta', 'testnet'];
          if (!validNetworks.includes(options.network)) {
            logger.error(`Invalid network. Must be one of: ${validNetworks.join(', ')}`);
            process.exit(1);
          }
          config.network = options.network;
        }

        if (options.rpcUrl) {
          config.rpcUrl = options.rpcUrl;
        }

        if (options.wallet) {
          config.defaultWallet = options.wallet;
        }

        saveConfig(config as any);
        logger.success('Configuration saved successfully!');
        logger.info(`Config file: ${getConfigPath()}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to initialize config: ${errorMessage}`);
        process.exit(1);
      }
    });

  return command;
}
