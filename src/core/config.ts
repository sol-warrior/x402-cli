/**
 * Configuration management for x402-cli
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { CliConfig } from '../types';

const CONFIG_DIR = join(homedir(), '.x402-cli');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

/**
 * Default configuration
 */
const DEFAULT_CONFIG: CliConfig = {
  rpcUrl: 'https://api.devnet.solana.com',
  network: 'devnet',
};

/**
 * Load configuration from file or return defaults
 */
export function loadConfig(): CliConfig {
  if (!existsSync(CONFIG_FILE)) {
    return { ...DEFAULT_CONFIG };
  }

  try {
    const content = readFileSync(CONFIG_FILE, 'utf-8');
    const config = JSON.parse(content) as CliConfig;
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    // If config file is corrupted, return defaults
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Save configuration to file
 */
export function saveConfig(config: CliConfig): void {
  // Ensure config directory exists
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }

  // Load existing config and merge
  const existing = loadConfig();
  const merged = { ...existing, ...config };

  writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), 'utf-8');
}

/**
 * Get config file path (for display purposes)
 */
export function getConfigPath(): string {
  return CONFIG_FILE;
}
