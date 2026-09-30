import { describe, it, expect, beforeEach } from 'vitest';
import { setNetworkId, getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { payecho, type PayEchoContract, type PayEchoState } from '../managed/payecho';

describe('PayEcho ZK Protocol Unit Test Suite', () => {
    let mockContract: PayEchoContract;
    let mockState: PayEchoState;

    beforeEach(() => {
        setNetworkId('preview');

        mockState = {
            bandCounters: new Map<bigint, bigint>([
                [1n, 10n],
                [2n, 25n],
                [3n, 5n]
            ]),
            nullifiers: new Map<string, boolean>()
        };

        mockContract = {
            contractAddress: '02806c1326edbe4ecc853fd43765d7dbcb797167c4922443d1ac5e2cac60f292',
            queryState: async () => mockState,
            callTx: {
                submitSalary: async (witnesses) => {
                    const salary = witnesses.local_salary();
                    const salt = witnesses.local_salt();
                    const nullifier = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

                    if (mockState.nullifiers.has(nullifier)) {
                        throw new Error('Salary already submitted with this salt (nullifier collision)');
                    }
                    if (salary < 0n) {
                        throw new Error('Invalid negative salary amount');
                    }

                    const bandId = salary < 50000n ? 1n : salary < 100000n ? 2n : 3n;
                    mockState.nullifiers.set(nullifier, true);
                    mockState.bandCounters.set(bandId, (mockState.bandCounters.get(bandId) ?? 0n) + 1n);

                    return {
                        public: { txHash: '0x1234567890abcdef', blockHeight: 100 },
                        wait: async () => ({ txHash: '0x1234567890abcdef', blockHeight: 100 })
                    };
                }
            }
        };
    });

    it('sets and retrieves target Midnight network id correctly', () => {
        expect(getNetworkId()).toBe('preview');
    });

    it('initializes payecho contract configuration properly', () => {
        expect(payecho.contractConfig.name).toBe('payecho');
        expect(payecho.contractConfig.networkId).toBe('preview');
        expect(payecho.contractInitialState.bandCounters.get(1n)).toBe(0n);
        expect(payecho.contractInitialState.bandCounters.get(2n)).toBe(0n);
        expect(payecho.contractInitialState.bandCounters.get(3n)).toBe(0n);
    });

    it('correctly categorizes Band 1 salary (< $50,000)', async () => {
        const salt = new Uint8Array(32).fill(1);
        const result = await mockContract.callTx.submitSalary({
            local_salary: () => 45000n,
            local_salt: () => salt
        });
        const waitRes = await result.wait();
        expect(waitRes.txHash).toBeDefined();

        const state = await mockContract.queryState();
        expect(state.bandCounters.get(1n)).toBe(11n);
    });

    it('correctly categorizes Band 2 salary ($50,000 - $100,000)', async () => {
        const salt = new Uint8Array(32).fill(2);
        await mockContract.callTx.submitSalary({
            local_salary: () => 75000n,
            local_salt: () => salt
        });

        const state = await mockContract.queryState();
        expect(state.bandCounters.get(2n)).toBe(26n);
    });

    it('correctly categorizes Band 3 salary (> $100,000)', async () => {
        const salt = new Uint8Array(32).fill(3);
        await mockContract.callTx.submitSalary({
            local_salary: () => 180000n,
            local_salt: () => salt
        });

        const state = await mockContract.queryState();
        expect(state.bandCounters.get(3n)).toBe(6n);
    });

    it('enforces one-way nullifier anti-sybil protection on duplicate salt', async () => {
        const salt = new Uint8Array(32).fill(42);
        await mockContract.callTx.submitSalary({
            local_salary: () => 80000n,
            local_salt: () => salt
        });

        await expect(mockContract.callTx.submitSalary({
            local_salary: () => 80000n,
            local_salt: () => salt
        })).rejects.toThrow('Salary already submitted with this salt');
    });

    it('rejects invalid negative salary input', async () => {
        const salt = new Uint8Array(32).fill(99);
        await expect(mockContract.callTx.submitSalary({
            local_salary: () => -5000n,
            local_salt: () => salt
        })).rejects.toThrow('Invalid negative salary amount');
    });
});
