import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import type { Connection, ParsedTransactionWithMeta } from '@solana/web3.js';
import { verifyTransactionSignature } from '../core/solana';

describe('verifyTransactionSignature', () => {
  let mockConnection: Connection;
  const getSignatureStatuses = vi.fn();
  const getParsedTransaction = vi.fn();

  beforeEach(() => {
    getSignatureStatuses.mockReset();
    getParsedTransaction.mockReset();

    mockConnection = {
      getSignatureStatuses: getSignatureStatuses as unknown as Connection['getSignatureStatuses'],
      getParsedTransaction:
        getParsedTransaction as unknown as Connection['getParsedTransaction'],
    } as Connection;
  });

  it('returns success details for a confirmed transfer', async () => {
    const signature = 'test-signature';
    const source = new PublicKey('6Y6Ub4uSqTvivJ6Tz6w1YyFk1B8mQi8QnGwdrDam8Abe');
    const destination = new PublicKey('FoJ9cZDNMjwWAoHb2ai1UWVoV8mWjzAm8h1Hn3pV3RrC');

    const parsedTransaction: ParsedTransactionWithMeta = {
      blockTime: 1_700_000_000,
      slot: 12345,
      meta: {
        err: null,
        fee: 5000,
        innerInstructions: [],
        loadedAddresses: { readonly: [], writable: [] },
        logMessages: ['Program log: Memo (len 11): Hello World'],
        postBalances: [],
        postTokenBalances: [],
        preBalances: [],
        preTokenBalances: [],
        rewards: [],
        status: { Ok: null },
      },
      transaction: {
        message: {
          accountKeys: [
            { pubkey: source, signer: true, writable: true },
            { pubkey: destination, signer: false, writable: true },
          ],
          instructions: [
            {
              program: 'system',
              programId: SystemProgram.programId,
              parsed: {
                type: 'transfer',
                info: {
                  source: source.toBase58(),
                  destination: destination.toBase58(),
                  lamports: 1_000_000_000,
                },
              },
            },
          ],
          recentBlockhash: 'dummy',
        },
        signatures: [signature],
      },
      version: 'legacy',
    };

    getSignatureStatuses.mockResolvedValue({
      value: [
        {
          err: null,
          confirmationStatus: 'confirmed',
          slot: 12345,
        },
      ],
    });

    getParsedTransaction.mockResolvedValue(parsedTransaction);

    const result = await verifyTransactionSignature(signature, {
      network: 'devnet',
      connection: mockConnection,
    });

    expect(result.isValid).toBe(true);
    expect(result.status).toBe('confirmed');
    expect(result.amountLamports).toBe(1_000_000_000);
    expect(result.amountSol).toBe(1);
    expect(result.source).toBe(source.toBase58());
    expect(result.destination).toBe(destination.toBase58());
    expect(result.memo).toBe('Hello World');
    expect(result.feeLamports).toBe(5000);
    expect(result.blockTimeIso).toBe('2023-11-14T06:13:20.000Z');
  });

  it('returns pending when transaction is not yet confirmed', async () => {
    const signature = 'pending-signature';

    getSignatureStatuses.mockResolvedValue({
      value: [
        {
          err: null,
          confirmationStatus: 'processed',
          slot: null,
        },
      ],
    });

    getParsedTransaction.mockResolvedValue(null);

    const result = await verifyTransactionSignature(signature, {
      network: 'devnet',
      connection: mockConnection,
    });

    expect(result.isValid).toBe(false);
    expect(result.status).toBe('pending');
    expect(result.message).toContain('pending confirmation');
  });

  it('returns not_found when signature does not exist', async () => {
    const signature = 'missing-signature';

    getSignatureStatuses.mockResolvedValue({
      value: [null],
    });

    const result = await verifyTransactionSignature(signature, {
      network: 'devnet',
      connection: mockConnection,
    });

    expect(result.isValid).toBe(false);
    expect(result.status).toBe('not_found');
    expect(result.message).toContain('Signature not found');
  });

  it('returns failure when transaction contains an error', async () => {
    const signature = 'failed-signature';

    getSignatureStatuses.mockResolvedValue({
      value: [
        {
          err: { InstructionError: [0, 'Custom'] },
          confirmationStatus: 'confirmed',
          slot: 100,
        },
      ],
    });

    const result = await verifyTransactionSignature(signature, {
      network: 'devnet',
      connection: mockConnection,
    });

    expect(result.isValid).toBe(false);
    expect(result.status).toBe('failed');
    expect(result.error).toContain('InstructionError');
  });
});
