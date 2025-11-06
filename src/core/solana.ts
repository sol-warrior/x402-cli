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
} from '@solana/web3.js';
import { readFileSync } from 'fs';
import { PaymentOptions, PaymentResult } from '../types';
import { logger } from './logger';
import { solToLamports, getNetworkRpcUrl } from './utils';

/**
 * Create Solana connection
 */
export function createConnection(
  rpcUrl?: string,
  network: 'devnet' | 'mainnet-beta' | 'testnet' = 'devnet'
): Connection {
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
  network: 'devnet' | 'mainnet-beta' | 'testnet' = 'devnet'
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
