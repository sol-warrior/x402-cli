/**
 * Shared TypeScript types for x402-cli
 */

/**
 * Configuration for the CLI
 */
export type SolanaNetwork = 'devnet' | 'mainnet-beta' | 'testnet';

export interface CliConfig {
  rpcUrl?: string;
  network?: SolanaNetwork;
  defaultWallet?: string;
}

/**
 * Payment transaction options
 */
export interface PaymentOptions {
  recipient: string;
  amount: number; // SOL amount
  from?: string; // Optional: specific wallet path
  network?: SolanaNetwork;
  skipPreflight?: boolean;
}

/**
 * Payment result
 */
export interface PaymentResult {
  signature: string;
  recipient: string;
  amount: number;
  network: string;
  status: 'success' | 'failed';
  error?: string;
}

/**
 * Verification result
 */
export interface VerificationResult {
  isValid: boolean;
  signature: string;
  network: SolanaNetwork;
  status: 'processed' | 'confirmed' | 'finalized' | 'failed' | 'not_found' | 'pending';
  confirmationStatus?: 'processed' | 'confirmed' | 'finalized';
  slot?: number;
  blockTime?: number | null;
  blockTimeIso?: string;
  amountLamports?: number;
  amountSol?: number;
  feeLamports?: number;
  source?: string;
  destination?: string;
  memo?: string | null;
  error?: string;
  message?: string;
}

/**
 * Logger levels
 */
export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';
