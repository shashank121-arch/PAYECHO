import { describe, it, expect, beforeAll } from 'vitest';
import { NetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { Contract } from '../managed/payecho';
import { payecho } from '../managed/payecho';

describe('PayEcho Smart Contract', () => {
    let TestnetEnvironment: any;
    let env: any;
    let providers: any;
    let contract: Contract<any>;

    beforeAll(async () => {
        setNetworkId(NetworkId.TestNet);
        try {
            // @ts-ignore
            const testing = await import('@midnight-ntwrk/testing');
            TestnetEnvironment = testing.TestnetEnvironment;
        } catch (e) {
            console.warn("Midnight testing SDK not found. Skipping full integration suite setup.");
            return;
        }

        if (TestnetEnvironment && process.env.DEPLOYER_MNEMONIC) {
            env = await TestnetEnvironment.build({
                networkId: NetworkId.TestNet,
                seed: process.env.DEPLOYER_MNEMONIC
            });
            providers = await env.getProviders();

            contract = await Contract.deploy(
                providers,
                payecho.contractInitialState,
                payecho.contractConfig
            );
        }
    });

    it('should initialize the contract correctly', async () => {
        if (!contract) return;
        
        const state = await contract.queryState();
        expect(state).toBeDefined();
        expect(state.bandCounters).toBeDefined();
        // Check initial state logic if necessary
    });

    it('should submit a salary securely (Band 1)', async () => {
        if (!contract) return;

        const salary = 50000;
        const saltBytes = new TextEncoder().encode("salt-band-1".padEnd(32, '\0')).slice(0, 32);

        const tx = await contract.callTx.submitSalary({
            local_salary: () => BigInt(salary),
            local_salt: () => saltBytes
        });
        await tx.wait();

        const state = await contract.queryState();
        expect(Number(state.bandCounters.get(1n))).toBeGreaterThan(0);
    });

    it('should reject invalid salary data', async () => {
        if (!contract) return;

        const invalidSalary = -100;
        const saltBytes = new TextEncoder().encode("invalid-salt".padEnd(32, '\0')).slice(0, 32);

        await expect(contract.callTx.submitSalary({
            local_salary: () => BigInt(invalidSalary),
            local_salt: () => saltBytes
        })).rejects.toThrow();
    });
});
