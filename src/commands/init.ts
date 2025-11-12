/**
 * Init command - Initialize CLI configuration
 */

import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { logger } from '../core/logger';
import { saveConfig, getConfigPath, loadConfig } from '../core/config';
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
        logger.banner('Welcome to x402-cli', 'Let’s set up your payment toolkit');

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

        const spinner = ora('Saving configuration...').start();
        saveConfig(config);
        spinner.succeed('Configuration saved successfully!');

        const finalConfig = loadConfig();

        logger.raw('');
        logger.info(chalk.bold('Configuration Summary'));

        const details: Array<[string, string | undefined]> = [
          ['Config File', getConfigPath()],
          ['Default Network', finalConfig.network?.toUpperCase()],
          ['RPC URL', finalConfig.rpcUrl],
          ['Default Wallet', finalConfig.defaultWallet],
        ];

        for (const [label, value] of details) {
          if (!value) {
            continue;
          }
          const formattedLabel = chalk.gray(`${label.padEnd(16)}:`);
          logger.raw(`  ${formattedLabel} ${chalk.white(value)}`);
        }

        logger.raw('');
        logger.success('You are ready to send and verify x402 payments!');
      } catch (error) {
        ora().fail('Failed to save configuration.');
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to initialize config: ${errorMessage}`);
        process.exit(1);
      }
    });

  return command;
}
