# StakeVote

StakeVote is designed to mirror real-world corporate governance rather than token-based on-chain models. Voting power is tied to verified stakeholder ownership, with stake validated off-chain and voting enforcement handled on-chain through immutable smart contracts. By decentralizing vote execution and tallying-while keeping real-world verification where it belongs—the system ensures transparent, weighted, and tamper-proof decision-making without unnecessary complexity.

## Features

- **Wallet connection** - Connect a Web3 wallet (e.g. MetaMask) to view voting power and cast votes
- **Stake-weighted voting** - Voting power is proportional to assigned stake (verified off-chain, snapshotted on-chain)
- **Real-time results** - Live yes/no tally and participation percentage from the contract
- **On-chain verification** - Votes and results are recorded on the blockchain; no token transfers
- **Responsive UI** - Works on desktop and mobile (Next.js, Tailwind, shadcn/ui)

## Tech stack

| Layer        | Technology                    |
|-------------|-------------------------------|
| Frontend    | Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, ethers.js |
| Contract    | Solidity ^0.8 (StakeVotingGovernance) |
| Backend     | Node.js, PostgreSQL, ethers.js (snapshot + contract lifecycle) |

## What’s in this repo

| Part | Description |
|------|-------------|
| **Smart contract** | `contracts/StakeVotingGovernance.sol` — single-proposal, stake-weighted voting with admin lifecycle (Created → Voting → Ended), quorum and majority. Not deployed from this codebase; **tested and working in an IDE (e.g. Remix)**. |
| **Frontend** | Next.js DApp: connect wallet (MetaMask), view proposal and voting power, cast Yes/No, see live results. Reads only from the contract. |
| **Backend** | Off-chain support: PostgreSQL schema (users, wallets, holdings, proposals, stake snapshots), snapshot job (freeze stake at cutoff), and ethers.js helpers to deploy/call the contract. |

**Testing the contract on Remix:** The Solidity contract is not built or deployed from this repo. We tested it in Remix: create a new file (e.g. `StakeVotingGovernance.sol`), paste the contract source, compile with Solidity 0.8.x, then deploy with constructor arg `_quorumBps` (e.g. `4000` for 40%). After deploy, use the UI to call `setProposal`, `assignStake` for each voter, then `startVoting`. Copy the deployed address into `lib/contract.ts` as `CONTRACT_ADDRESS` so the frontend can connect.

---

## Quick start

**Prerequisites:** Node.js 18+, npm or pnpm.

1. **Run locally**  
   Install dependencies, then start the dev server: `npm install` (or `pnpm install`), then `npm run dev` (or `pnpm dev`). Open the app in your browser. For a production build: `npm run build` then `npm run start`. Lint: `npm run lint`. If the contract isn’t configured, you’ll see a setup message.

2. **Deploy the contract (Remix)**  
   Copy `contracts/StakeVotingGovernance.sol` into Remix, compile (0.8.x), deploy with constructor arg `_quorumBps` (e.g. `4000` for 40%). Use the UI to call `setProposal`, `assignStake` for each voter, then `startVoting`.

3. **Wire the frontend**  
   In `lib/contract.ts`, set `CONTRACT_ADDRESS` to the deployed contract address. Reload the app to load proposal and vote.

4. **Backend (optional)**  
   For snapshot-based stake and automated proposal lifecycle, see [backend/README.md](backend/README.md).

**Networks:** The DApp works with any EVM-compatible network (Remix VM, Sepolia, Polygon Amoy, etc.). Configure your wallet and set `CONTRACT_ADDRESS` after deploying the contract.

## To-Do

- **Implement smart contract in codebase:** The smart contract currently runs only experimentally (e.g. tested in Remix). Implement full build, deploy, and integration in this repo (e.g. Foundry/Hardhat scripts, CI, and wiring to frontend/backend).
- **Off-chain DB ↔ on-chain wallets:** The backend includes a PostgreSQL schema (`backend/schema/001_initial.sql`) that maps **user-holdings off-chain** (identity, KYC, live equity in `users`, `wallets`, `holdings`) to **user-wallets on-chain**. A snapshot job freezes stake at a cutoff time into `stake_snapshots` (proposal, wallet address, stake amount); the backend then calls the contract’s `assignStake(wallet, stake)` so voting power on-chain reflects the off-chain snapshot. Integrate and run the snapshot + proposal lifecycle when ready to go live.

## Contributors

- [Vani](https://github.com/VaniNaja)
- [Pranav](https://github.com/pranavdiddiisawesome)
- [Darsheel](https://github.com/Hxzardd)

## License

MIT.
