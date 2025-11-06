/**
 * Tests for pay command
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isValidSolanaAddress, solToLamports, lamportsToSol, truncateAddress } from '../core/utils';

describe('Utils', () => {
  describe('isValidSolanaAddress', () => {
    it('should validate correct Solana addresses', () => {
      expect(isValidSolanaAddress('11111111111111111111111111111111')).toBe(true);
      expect(isValidSolanaAddress('So11111111111111111111111111111111111111112')).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(isValidSolanaAddress('invalid')).toBe(false);
      expect(isValidSolanaAddress('')).toBe(false);
      expect(isValidSolanaAddress('123')).toBe(false);
    });
  });

  describe('solToLamports', () => {
    it('should convert SOL to lamports correctly', () => {
      expect(solToLamports(1)).toBe(1000000000);
      expect(solToLamports(0.5)).toBe(500000000);
      expect(solToLamports(0.001)).toBe(1000000);
    });
  });

  describe('lamportsToSol', () => {
    it('should convert lamports to SOL correctly', () => {
      expect(lamportsToSol(1000000000)).toBe(1);
      expect(lamportsToSol(500000000)).toBe(0.5);
      expect(lamportsToSol(1000000)).toBe(0.001);
    });
  });

  describe('truncateAddress', () => {
    it('should truncate long addresses', () => {
      const address = 'So11111111111111111111111111111111111111112';
      const truncated = truncateAddress(address);
      expect(truncated).toBe('So11...1112');
      expect(truncated.length).toBeLessThan(address.length);
    });

    it('should not truncate short addresses', () => {
      const address = '1234567890';
      expect(truncateAddress(address)).toBe(address);
    });
  });
});
