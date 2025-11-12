/**
 * Pay command - Send SOL on devnet/mainnet/testnet
 */

import { Command } from 'commander';
import ora from 'ora';
import { sendPayment } from '../core/solana';
import { logger } from '../core/logger';
import { loadConfig } from '../core/config';
import { truncateAddress } from '../core/utils';
import { PaymentResult, SolanaNetwork } from '../types';

interface PayCommandOptions {
  recipient: string;
  amount: number;
  from?: string;
  network?: string;
  skipPreflight?: boolean;
}

export function createPayCommand(): Command {
  const command = new Command('pay');

  command
    .description('Send SOL payment to a recipient address')
    .requiredOption('-r, --recipient <address>', 'Recipient Solana address')
    .requiredOption('-a, --amount <amount>', 'Amount in SOL (e.g., 0.1)', parseFloat)
    .option('-f, --from <path>', 'Path to keypair JSON file')
    .option('-n, --network <network>', 'Network: devnet, mainnet-beta, or testnet', 'devnet')
    .option('--skip-preflight', 'Skip transaction preflight checks', false)
    .action(async (options: PayCommandOptions) => {
      const spinner = ora('Processing payment...').start();

      try {
        // Load config for defaults
        const config = loadConfig();
        const network = (options.network || config.network || 'devnet') as SolanaNetwork;

        // Validate recipient address format
        if (!options.recipient || options.recipient.length < 32) {
          spinner.fail('Invalid recipient address');
          process.exit(1);
        }

        // Validate amount
        if (isNaN(options.amount) || options.amount <= 0) {
          spinner.fail('Invalid amount. Must be a positive number.');
          process.exit(1);
        }

        spinner.text = `Sending ${options.amount} SOL to ${truncateAddress(options.recipient)}...`;

        const result: PaymentResult = await sendPayment({
          recipient: options.recipient,
          amount: options.amount,
          from: options.from,
          network,
          skipPreflight: options.skipPreflight,
        });

        spinner.stop();

        if (result.status === 'success') {
          logger.success(`Payment successful!`);
          logger.raw(`\nTransaction Details:`);
          logger.raw(`  Recipient: ${result.recipient}`);
          logger.raw(`  Amount: ${result.amount} SOL`);
          logger.raw(`  Network: ${result.network}`);
          logger.raw(`  Signature: ${result.signature}`);
          logger.raw(`\nView on Solana Explorer:`);
          logger.raw(
            `  https://explorer.solana.com/tx/${result.signature}?cluster=${result.network === 'mainnet-beta' ? '' : result.network}`
          );
        } else {
          logger.error(`Payment failed: ${result.error || 'Unknown error'}`);
          process.exit(1);
        }
      } catch (error) {
        spinner.stop();
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Payment failed: ${errorMessage}`);
        process.exit(1);
      }
    });

  return command;
}
