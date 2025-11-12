import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { logger } from '../core/logger';
import { loadConfig } from '../core/config';
import { verifyTransactionSignature } from '../core/solana';
import { lamportsToSol } from '../core/utils';
import type { SolanaNetwork, VerificationResult } from '../types';

interface VerifyCommandOptions {
  network?: string;
  rpcUrl?: string;
  commitment?: string;
  json?: boolean;
}

export function createVerifyCommand(): Command {
  const command = new Command('verify');

  command
    .description('Verify a Solana transaction signature and display payment details')
    .argument('<signature>', 'Transaction signature to verify')
    .option('-n, --network <network>', 'Network: devnet, mainnet-beta, or testnet')
    .option('--rpc-url <url>', 'Custom RPC URL override')
    .option(
      '-c, --commitment <commitment>',
      'Commitment level: processed, confirmed, or finalized',
      'confirmed'
    )
    .option('--json', 'Output verification result as JSON', false)
    .action(async (signature: string, options: VerifyCommandOptions) => {
      const spinner = ora('Verifying transaction...').start();

      try {
        const config = loadConfig();
        const network = (options.network || config.network || 'devnet') as SolanaNetwork;
        const rpcUrl = options.rpcUrl || config.rpcUrl;

        const validCommitments = new Set(['processed', 'confirmed', 'finalized']);
        const commitment =
          typeof options.commitment === 'string' && validCommitments.has(options.commitment)
            ? (options.commitment as 'processed' | 'confirmed' | 'finalized')
            : 'confirmed';

        const result: VerificationResult = await verifyTransactionSignature(signature, {
          network,
          rpcUrl,
          commitment,
        });

        spinner.stop();

        if (options.json) {
          logger.raw(JSON.stringify(result, null, 2));
          if (!result.isValid) {
            const exitCode = result.status === 'pending' ? 2 : 1;
            process.exit(exitCode);
          }
          return;
        }

        if (!result.isValid) {
          if (result.status === 'pending') {
            logger.warning('Transaction is pending confirmation. Try again shortly.');
          } else if (result.status === 'not_found') {
            logger.error('Signature not found on the selected network.');
          } else {
            logger.error(result.message ?? 'Failed to verify transaction.');
            if (result.error) {
              logger.debug(`Verification error: ${result.error}`);
            }
          }
          const exitCode = result.status === 'pending' ? 2 : 1;
          process.exit(exitCode);
        }

        logger.success('Transaction verified successfully!');
        logger.raw('');
        logger.info(chalk.bold('Verification Summary'));

        const printDetail = (label: string, value?: string | null) => {
          if (value === undefined || value === null || value === '') {
            return;
          }
          const formattedLabel = chalk.gray(`${label.padEnd(14)}:`);
          logger.raw(`  ${formattedLabel} ${value}`);
        };

        printDetail('Signature', chalk.cyan(result.signature));
        printDetail('Network', chalk.white(result.network.toUpperCase()));

        if (result.status === 'finalized') {
          printDetail('Status', chalk.green('FINALIZED'));
        } else if (result.status === 'confirmed') {
          printDetail('Status', chalk.cyan('CONFIRMED'));
        } else if (result.status === 'pending') {
          printDetail('Status', chalk.yellow('PENDING'));
        } else {
          printDetail('Status', chalk.white(result.status.toUpperCase()));
        }

        if (result.confirmationStatus) {
          printDetail('Conf. Status', chalk.white(result.confirmationStatus.toUpperCase()));
        }

        if (result.slot !== undefined) {
          printDetail('Slot', chalk.white(result.slot.toLocaleString()));
        }

        if (result.blockTimeIso) {
          const humanTime = new Date(result.blockTimeIso).toLocaleString();
          printDetail('Block Time', chalk.white(humanTime));
        }

        if (typeof result.amountSol === 'number') {
          const amountSolText = chalk.cyan(`${result.amountSol.toFixed(9)} SOL`);
          const lamportsText =
            typeof result.amountLamports === 'number'
              ? chalk.gray(` (${result.amountLamports.toLocaleString()} lamports)`)
              : '';
          printDetail('Amount', `${amountSolText}${lamportsText}`);
        }

        if (typeof result.feeLamports === 'number') {
          const feeSol = lamportsToSol(result.feeLamports).toFixed(9);
          const feeLamports = result.feeLamports.toLocaleString();
          printDetail(
            'Fee',
            `${chalk.yellow(`${feeSol} SOL`)} ${chalk.gray(`(${feeLamports} lamports)`)}`
          );
        }

        if (result.source) {
          printDetail('From', chalk.white(result.source));
        }

        if (result.destination) {
          printDetail('To', chalk.white(result.destination));
        }

        if (result.memo) {
          printDetail('Memo', chalk.magenta(result.memo));
        }
      } catch (error) {
        spinner.stop();
        const message = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to verify transaction: ${message}`);
        process.exit(1);
      }
    });

  return command;
}
