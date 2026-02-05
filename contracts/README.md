# StakeVotingGovernance

Solidity smart contract for stake-weighted, single-proposal governance. Voting power is assigned by a chairperson (e.g. from an off-chain snapshot); votes are cast on-chain and tallied immutably.

## Overview

- **Single proposal** - One active proposal per contract instance.
- **Stake-weighted** - Each voter has a fixed stake assigned by the chairperson (no token balance reads).
- **Phase-based** - Lifecycle: `Created` → `Voting` → `Ended`.
- **Quorum** - Result can be `FAILED_QUORUM` if not enough voting power participated.

## What It Currently Does

### State and roles

- **Chairperson** - Deployer; only address that can set proposal, assign stake, start voting, and end voting.
- **Phase** - `Created` | `Voting` | `Ended`.
- **Proposal** - Single `proposalDescription` (string).
- **Stake** - `stake[voter]` = voting power; assigned once per voter in `Created`.
- **Quorum** - `quorumBps` (basis points, 0-10000) set in constructor; used when computing result.

### Admin (chairperson only)

| Function         | Phase   | Description |
|-----------------|--------|-------------|
| `setProposal(description)` | Created | Set the proposal text. |
| `assignStake(voter, amount)` | Created | Assign voting power to `voter`; each voter can be assigned only once. |
| `startVoting()` | Created | Move to `Voting` (requires non-empty proposal and at least one stake). |
| `endVoting()`   | Voting | Move to `Ended`. |

### Voting

| Function      | Phase | Description |
|---------------|-------|-------------|
| `vote(bool support)` | Voting | Cast one vote (yes/no). Caller must have stake and must not have voted yet. Vote weight = `stake[msg.sender]`. |

### Views

| Function | Description |
|----------|-------------|
| `getVoteCounts()` | Returns `(yesVotes, noVotes)`. |
| `getPhase()` | Returns current phase. |
| `getUserVotingPower(address)` | Returns `stake[voter]`. |
| `result()` | Callable only when phase is `Ended`. Returns `"APPROVED"` \| `"REJECTED"` \| `"FAILED_QUORUM"`. |
| `quorumReached()` | View: whether current yes+no votes meet quorum. |

### Events

- `ProposalCreated(string description)`
- `StakeAssigned(address indexed voter, uint256 amount)`
- `VotingStarted()`
- `VotingEnded()`
- `VoteCast(address indexed voter, bool support, uint256 weight)`

## Deployment

- **Compiler** - Solidity 0.8.x.
- **Constructor** - `StakeVotingGovernance(uint256 _quorumBps)` with `_quorumBps` in 1-10000 (e.g. `4000` = 40% quorum).

Typical flow: deploy → `setProposal` → `assignStake` for each voter → `startVoting` → users call `vote` → chairperson calls `endVoting` → read `result()`.

## Future Improvements

- **Multiple proposals** - Proposal IDs or a list of proposals so one contract can run many votes (e.g. `proposalId` in state, or mapping by id).
- **Time-based voting** - Voting deadline (e.g. `votingEndsAt`) and optional auto-transition to `Ended` when time expires.
- **Chairperson transfer** - `transferChairperson(newChair)` or two-step ownership transfer for safety.
- **Stake updates / snapshots** - Allow updating stake in `Created` or support multiple snapshots for recurring votes.
- **Emergency pause** - Pausable pattern to halt voting in case of bug or incident.
- **Proposal metadata** - Store more than description (e.g. title, link, category) and expose via view or event.
- **Execution / timelock** - After `APPROVED`, optional timelock and “execute” step for on-chain actions (e.g. parameter change, funding).
- **Delegation** - Allow delegating voting power to another address.
- **Gas optimizations** - Packed storage, batch `assignStake`, or other layout changes to reduce cost.
- **Upgradeability** - Proxy (UUPS/Transparent) if you expect to change logic later; otherwise keep non-upgradeable for simplicity.
- **Token / share integration** - Optional: read voting power from an external token or share contract instead of fixed assigned stake.
- **Governance over chairperson** - Replace single chairperson with a multisig or DAO for admin actions.

## License

MIT.
