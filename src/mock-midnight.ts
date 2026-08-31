export const Contract = {
  build: async () => ({
    queryState: async () => ({ bandCounters: { get: () => 0n } }),
    callTx: {
      submitSalary: async () => ({ wait: async () => {} })
    }
  })
};
export const httpClientProofProvider = () => ({});
