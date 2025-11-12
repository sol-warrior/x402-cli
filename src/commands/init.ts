/**
 * Init command - Initialize CLI configuration
 */

import { Command } from 'commander';
import { logger } from '../core/logger';
import { saveConfig, getConfigPath } from '../core/config';
import type { CliConfig, SolanaNetwork } from '../types';

interface InitCommandOptions {
  network?: string;
  rpcUrl?: string;
  wallet?: string;
}

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
    .action(async (options: InitCommandOptions) => {
      try {
        const config: Partial<CliConfig> = {};

        if (options.network) {
          const validNetworks: SolanaNetwork[] = ['devnet', 'mainnet-beta', 'testnet'];
          if (!validNetworks.includes(options.network as SolanaNetwork)) {
            logger.error(`Invalid network. Must be one of: ${validNetworks.join(', ')}`);
            process.exit(1);
          }
          config.network = options.network as SolanaNetwork;
        }

        if (options.rpcUrl) {
          config.rpcUrl = options.rpcUrl;
        }

        if (options.wallet) {
          config.defaultWallet = options.wallet;
        }

        saveConfig(config);
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
