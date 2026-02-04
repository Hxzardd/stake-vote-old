export const config = {
  database: {
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/vote_governance',
  },
  chain: {
    rpcUrl: process.env.RPC_URL ?? 'http://127.0.0.1:8545',
    adminPrivateKey: process.env.ADMIN_PRIVATE_KEY ?? '',
  },
};
