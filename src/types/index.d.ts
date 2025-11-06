/**
 * Shared TypeScript types for x402-cli
 */

/**
 * Configuration for the CLI
 */
export interface CliConfig {
  rpcUrl?: string;
  network?: 'devnet' | 'mainnet-beta' | 'testnet';
  defaultWallet?: string;
}

/**
 * Payment transaction options
 */
export interface PaymentOptions {
  recipient: string;
  amount: number; // SOL amount
  from?: string; // Optional: specific wallet path
  network?: 'devnet' | 'mainnet-beta' | 'testnet';
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
  message?: string;
}

/**
 * Logger levels
 */
export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';
