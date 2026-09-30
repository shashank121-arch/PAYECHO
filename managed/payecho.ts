// Midnight ZK PayEcho Contract Interface and Configurations
export interface PayEchoWitnesses {
    local_salary(): bigint;
    local_salt(): Uint8Array;
}

export interface PayEchoState {
    bandCounters: Map<bigint, bigint>;
    nullifiers: Map<string, boolean>;
}

export interface PayEchoCallTxResult {
    public: {
        txHash: string;
        blockHeight?: number;
    };
    wait(): Promise<{ txHash: string; blockHeight?: number }>;
}

export interface PayEchoContract {
    contractAddress: string;
    queryState(): Promise<PayEchoState>;
    callTx: {
        submitSalary(witnesses: PayEchoWitnesses): Promise<PayEchoCallTxResult>;
    };
}

export type Contract<_T = any> = PayEchoContract;

export const payecho = {
    contractConfig: {
        name: 'payecho',
        networkId: 'preview',
        version: '0.1.0'
    },
    contractInitialState: {
        bandCounters: new Map<bigint, bigint>([
            [1n, 0n],
            [2n, 0n],
            [3n, 0n]
        ]),
        nullifiers: new Map<string, boolean>()
    }
};
