export const Contract = {
  build: async () => ({
    queryState: async () => ({ bandCounters: { get: () => 0n } }),
    callTx: {
      submitSalary: async () => ({ wait: async () => {} })
    }
  })
};
export const httpClientProofProvider = () => ({});
export type MidnightProviders = any;
export type ContractAddress = any;
export type DAppConnectorAPI = any;
export type DAppConnectorWalletAPI = any;
