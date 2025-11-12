/**
 * Solana connection and transaction handling
 */

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  type Finality,
} from '@solana/web3.js';
import { readFileSync } from 'fs';
import { PaymentOptions, PaymentResult, SolanaNetwork, VerificationResult } from '../types';
import { logger } from './logger';
import { solToLamports, getNetworkRpcUrl } from './utils';

/**
 * Create Solana connection
 */
export function createConnection(rpcUrl?: string, network: SolanaNetwork = 'devnet'): Connection {
  const url = rpcUrl || getNetworkRpcUrl(network);
  return new Connection(url, 'confirmed');
}

/**
 * Load keypair from file path
 */
export function loadKeypairFromPath(path: string): Keypair {
  try {
    const keyData = JSON.parse(readFileSync(path, 'utf-8'));
    const secretKey = Uint8Array.from(keyData);
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    throw new Error(
      `Failed to load keypair from ${path}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Create keypair from seed phrase (for testing - in production use proper wallet)
 */
export function createKeypairFromSeed(seed: string): Keypair {
  // This is a simplified version - in production, use proper BIP39 derivation
  // For now, we'll just use a deterministic approach
  const encoder = new TextEncoder();
  const seedBytes = encoder.encode(seed);
  return Keypair.fromSeed(seedBytes.slice(0, 32));
}

/**
 * Send SOL payment
 */
export async function sendPayment(options: PaymentOptions): Promise<PaymentResult> {
  const { recipient, amount, from, network = 'devnet' } = options;

  try {
    // Validate recipient address
    let recipientPubkey: PublicKey;
    try {
      recipientPubkey = new PublicKey(recipient);
    } catch {
      throw new Error(`Invalid recipient address: ${recipient}`);
    }

    // Load sender keypair
    // In production, this would integrate with wallet adapters
    // For now, we'll use a simple file-based approach or generate a test keypair
    let senderKeypair: Keypair;
    if (from) {
      senderKeypair = loadKeypairFromPath(from);
    } else {
      // For demo purposes, use a default test keypair
      // In production, this should prompt for wallet connection
      throw new Error('Wallet path required. Use --from <path> to specify keypair file.');
    }

    // Create connection
    const connection = createConnection(undefined, network);

    // Check balance
    const balance = await connection.getBalance(senderKeypair.publicKey);
    const lamportsAmount = solToLamports(amount);
    const minBalance = lamportsAmount + 5000; // 5000 lamports for transaction fee

    if (balance < minBalance) {
      throw new Error(
        `Insufficient balance. Required: ${(minBalance / LAMPORTS_PER_SOL).toFixed(9)} SOL, Available: ${(balance / LAMPORTS_PER_SOL).toFixed(9)} SOL`
      );
    }

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipientPubkey,
        lamports: lamportsAmount,
      })
    );

    // Send transaction
    logger.info(`Sending ${amount} SOL to ${recipient}...`);
    const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair], {
      skipPreflight: options.skipPreflight || false,
    });

    logger.debug(`Transaction signature: ${signature}`);

    return {
      signature,
      recipient,
      amount,
      network,
      status: 'success',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Payment failed: ${errorMessage}`);
    return {
      signature: '',
      recipient,
      amount,
      network,
      status: 'failed',
      error: errorMessage,
    };
  }
}

/**
 * Get account balance
 */
export async function getBalance(
  address: string,
  rpcUrl?: string,
  network: SolanaNetwork = 'devnet'
): Promise<number> {
  try {
    const pubkey = new PublicKey(address);
    const connection = createConnection(rpcUrl, network);
    const lamports = await connection.getBalance(pubkey);
    return lamports / LAMPORTS_PER_SOL;
  } catch (error) {
    throw new Error(
      `Failed to get balance: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export type VerificationCommitment = 'processed' | Finality;

export interface VerifyTransactionOptions {
  network?: SolanaNetwork;
  rpcUrl?: string;
  commitment?: VerificationCommitment;
  connection?: Connection;
}

/**
 * Verify a transaction signature and extract payment details
 */
export async function verifyTransactionSignature(
  signature: string,
  options: VerifyTransactionOptions = {}
): Promise<VerificationResult> {
  const {
    network = 'devnet',
    rpcUrl,
    commitment = 'confirmed',
    connection: providedConnection,
  } = options;

  const connection = providedConnection ?? createConnection(rpcUrl, network);

  try {
    const statusResponse = await connection.getSignatureStatuses([signature], {
      searchTransactionHistory: true,
    });
    const status = statusResponse.value[0];

    if (!status) {
      return {
        isValid: false,
        signature,
        network,
        status: 'not_found',
        message: 'Signature not found. It may be incorrect or pruned from RPC history.',
      };
    }

    if (status.err) {
      return {
        isValid: false,
        signature,
        network,
        status: 'failed',
        confirmationStatus: status.confirmationStatus ?? undefined,
        slot: status.slot ?? undefined,
        error: typeof status.err === 'string' ? status.err : JSON.stringify(status.err),
        message: 'Transaction execution failed.',
      };
    }

    const confirmationStatus = status.confirmationStatus ?? 'processed';
    let derivedStatus: VerificationResult['status'] = 'pending';

    if (confirmationStatus === 'confirmed') {
      derivedStatus = 'confirmed';
    } else if (confirmationStatus === 'finalized') {
      derivedStatus = 'finalized';
    } else if (confirmationStatus === 'processed') {
      derivedStatus = 'pending';
    }

    const parsedCommitment: Finality | undefined =
      commitment === 'processed' ? undefined : commitment;

    const parsedTransaction = await connection.getParsedTransaction(signature, {
      commitment: parsedCommitment,
      maxSupportedTransactionVersion: 0,
    });

    if (!parsedTransaction) {
      return {
        isValid: derivedStatus === 'confirmed' || derivedStatus === 'finalized',
        signature,
        network,
        status: derivedStatus,
        confirmationStatus: confirmationStatus === 'processed' ? undefined : confirmationStatus,
        slot: status.slot ?? undefined,
        message:
          derivedStatus === 'pending'
            ? 'Transaction is pending confirmation. Try again shortly.'
            : 'Transaction confirmed but detailed data is unavailable (RPC history may be trimmed).',
      };
    }

    const meta = parsedTransaction.meta;

    if (meta?.err) {
      return {
        isValid: false,
        signature,
        network,
        status: 'failed',
        confirmationStatus: confirmationStatus === 'processed' ? undefined : confirmationStatus,
        slot: parsedTransaction.slot,
        error: typeof meta.err === 'string' ? meta.err : JSON.stringify(meta.err),
        message: 'Transaction failed during execution.',
      };
    }

    const blockTime = parsedTransaction.blockTime ?? null;
    let amountLamports: number | undefined;
    let amountSol: number | undefined;
    let source: string | undefined;
    let destination: string | undefined;
    let memo: string | null | undefined;

    const instructions = parsedTransaction.transaction.message.instructions ?? [];

    for (const instruction of instructions) {
      if ('parsed' in instruction && instruction.program === 'system') {
        if (instruction.parsed?.type === 'transfer') {
          const info = instruction.parsed.info as {
            source: string;
            destination: string;
            lamports: number;
          };
          source = info.source;
          destination = info.destination;
          amountLamports = info.lamports;
          amountSol = info.lamports / LAMPORTS_PER_SOL;
        }
      }

      if ('parsed' in instruction && instruction.program === 'spl-memo') {
        memo = (instruction.parsed as { info?: { memo?: string } }).info?.memo ?? null;
      }
    }

    if (!memo && typeof meta?.logMessages !== 'undefined') {
      const memoLog = meta.logMessages?.find(msg => msg.startsWith('Program log: Memo'));
      if (memoLog) {
        const match = memoLog.match(/Program log: Memo \(len \d+\):\s*(.*)$/);
        memo = match ? match[1] : memoLog.replace('Program log: Memo', '').trim();
      }
    }

    return {
      isValid: true,
      signature,
      network,
      status: derivedStatus,
      confirmationStatus: confirmationStatus === 'processed' ? undefined : confirmationStatus,
      slot: parsedTransaction.slot,
      blockTime,
      blockTimeIso: blockTime ? new Date(blockTime * 1000).toISOString() : undefined,
      amountLamports,
      amountSol,
      feeLamports: meta?.fee,
      source,
      destination,
      memo: typeof memo === 'undefined' ? null : memo,
      message: 'Transaction verified successfully.',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      isValid: false,
      signature,
      network,
      status: 'failed',
      message: 'Failed to verify transaction.',
      error: errorMessage,
    };
  } finally {
    if (!options.connection) {
      // no-op: connection is managed externally by RPC client
    }
  }
}
