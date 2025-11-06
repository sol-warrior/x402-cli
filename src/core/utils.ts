/**
 * Utility functions shared across the CLI
 */

import { PublicKey } from '@solana/web3.js';

/**
 * Validate Solana address format
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format SOL amount for display
 */
export function formatSolAmount(lamports: number): string {
  return (lamports / 1e9).toFixed(9);
}

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * 1e9);
}

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: number): number {
  return lamports / 1e9;
}

/**
 * Truncate address for display (first 4 + ... + last 4)
 */
export function truncateAddress(
  address: string,
  startChars: number = 4,
  endChars: number = 4
): string {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Get network RPC URL
 */
export function getNetworkRpcUrl(network: 'devnet' | 'mainnet-beta' | 'testnet'): string {
  const urls = {
    devnet: 'https://api.devnet.solana.com',
    'mainnet-beta': 'https://api.mainnet-beta.solana.com',
    testnet: 'https://api.testnet.solana.com',
  };
  return urls[network];
}
