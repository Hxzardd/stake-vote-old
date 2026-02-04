import { withClient } from '../db/client.js';
import type { PoolClient } from 'pg';
import {
  deployContract,
  getContract,
  initializeVoting,
  endVoting as contractEndVoting,
  getResult,
  getQuorumReached,
  getVoteCounts,
} from '../lib/contract.js';

export interface ProposalRow {
  id: string;
  title: string;
  description: string;
  quorum_bps: number;
  contract_address: string | null;
  status: string;
}

export async function deployProposalContract(proposalId: string): Promise<string> {
  return withClient(async (client: PoolClient) => {
    const row = await client.query<ProposalRow>(
      `SELECT id, description, quorum_bps, contract_address, status FROM proposals WHERE id = $1`,
      [proposalId]
    );
    if (row.rows.length === 0) throw new Error(`Proposal not found: ${proposalId}`);
    const p = row.rows[0];
    if (p.status !== 'snapshot_taken') {
      throw new Error(`Proposal must be in snapshot_taken status (current: ${p.status}). Run snapshot job first.`);
    }
    if (p.contract_address) {
      throw new Error(`Proposal already has contract: ${p.contract_address}`);
    }

    const contract = await deployContract({ quorumBps: p.quorum_bps });
    const address = await contract.getAddress();

    await client.query(
      `UPDATE proposals SET contract_address = $1, status = 'deployed', updated_at = now() WHERE id = $2`,
      [address, proposalId]
    );
    return address;
  });
}

export async function startVotingOnChain(proposalId: string): Promise<void> {
  return withClient(async (client: PoolClient) => {
    const row = await client.query<ProposalRow>(
      `SELECT id, description, contract_address, status FROM proposals WHERE id = $1`,
      [proposalId]
    );
    if (row.rows.length === 0) throw new Error(`Proposal not found: ${proposalId}`);
    const p = row.rows[0];
    if (p.status !== 'deployed') {
      throw new Error(`Proposal must be in deployed status (current: ${p.status}). Deploy contract first.`);
    }
    if (!p.contract_address) throw new Error('Proposal has no contract_address');

    const snapshots = await client.query<{ wallet_address: string; stake_amount: string }>(
      `SELECT wallet_address, stake_amount::text AS stake_amount FROM stake_snapshots WHERE proposal_id = $1 ORDER BY wallet_address`,
      [proposalId]
    );
    if (snapshots.rows.length === 0) throw new Error('No stake_snapshots for this proposal.');

    await initializeVoting(p.contract_address, p.description, snapshots.rows);

    await client.query(
      `UPDATE proposals SET status = 'voting', updated_at = now() WHERE id = $1`,
      [proposalId]
    );
  });
}

export async function endVotingOnChain(proposalId: string): Promise<void> {
  return withClient(async (client: PoolClient) => {
    const row = await client.query<ProposalRow>(
      `SELECT id, contract_address, status FROM proposals WHERE id = $1`,
      [proposalId]
    );
    if (row.rows.length === 0) throw new Error(`Proposal not found: ${proposalId}`);
    const p = row.rows[0];
    if (p.status !== 'voting') {
      throw new Error(`Proposal must be in voting status (current: ${p.status}).`);
    }
    if (!p.contract_address) throw new Error('Proposal has no contract_address');

    await contractEndVoting(p.contract_address);

    await client.query(
      `UPDATE proposals SET status = 'ended', updated_at = now() WHERE id = $1`,
      [proposalId]
    );
  });
}

export async function readResult(proposalId: string): Promise<{
  result: string;
  quorumReached: boolean;
  yesVotes: string;
  noVotes: string;
}> {
  return withClient(async (client: PoolClient) => {
    const row = await client.query<{ contract_address: string }>(
      `SELECT contract_address FROM proposals WHERE id = $1`,
      [proposalId]
    );
    if (row.rows.length === 0) throw new Error(`Proposal not found: ${proposalId}`);
    const addr = row.rows[0].contract_address;
    if (!addr) throw new Error('Proposal has no contract_address');

    const [result, quorumReached, voteCounts] = await Promise.all([
      getResult(addr),
      getQuorumReached(addr),
      getVoteCounts(addr),
    ]);
    return {
      result,
      quorumReached,
      yesVotes: voteCounts[0].toString(),
      noVotes: voteCounts[1].toString(),
    };
  });
}
