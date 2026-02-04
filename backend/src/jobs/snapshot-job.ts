import { withClient } from '../db/client.js';
import type { PoolClient } from 'pg';

export interface SnapshotInput {
  proposalId: string;
  cutoffAt: Date;
}

export interface SnapshotResult {
  proposalId: string;
  rowsWritten: number;
  totalStake: string;
}

export async function runSnapshot(input: SnapshotInput): Promise<SnapshotResult> {
  return withClient(async (client: PoolClient) => {
    const { proposalId, cutoffAt } = input;

    const proposalCheck = await client.query(
      `SELECT id, status FROM proposals WHERE id = $1`,
      [proposalId]
    );
    if (proposalCheck.rows.length === 0) {
      throw new Error(`Proposal not found: ${proposalId}`);
    }
    if (proposalCheck.rows[0].status !== 'draft') {
      throw new Error(`Proposal ${proposalId} is not in draft (status: ${proposalCheck.rows[0].status}). Snapshot already taken or voting started.`);
    }

    const existing = await client.query(
      `SELECT 1 FROM stake_snapshots WHERE proposal_id = $1 LIMIT 1`,
      [proposalId]
    );
    if (existing.rows.length > 0) {
      throw new Error(`Snapshot already exists for proposal ${proposalId}. Snapshots are immutable.`);
    }

    const stakePerUser = await client.query<{ user_id: string; total_stake: string }>(`
      SELECT h.user_id, SUM(h.equity_units)::text AS total_stake
      FROM holdings h
      WHERE h.effective_at <= $1
      GROUP BY h.user_id
      HAVING SUM(h.equity_units) > 0
    `, [cutoffAt]);

    if (stakePerUser.rows.length === 0) {
      throw new Error(`No holdings at cutoff ${cutoffAt.toISOString()}. Cannot create empty snapshot.`);
    }

    const userIds = stakePerUser.rows.map(r => r.user_id);
    const wallets = await client.query<{ user_id: string; address: string }>(`
      SELECT user_id, address FROM wallets
      WHERE user_id = ANY($1) AND is_primary = true
    `, [userIds]);

    const walletByUser = new Map(wallets.rows.map(r => [r.user_id, r.address]));

    const rows: { proposal_id: string; wallet_address: string; stake_amount: string }[] = [];
    let totalStake = 0n;
    for (const row of stakePerUser.rows) {
      const wallet = walletByUser.get(row.user_id);
      if (!wallet) continue;
      rows.push({ proposal_id: proposalId, wallet_address: wallet, stake_amount: row.total_stake });
      totalStake += BigInt(row.total_stake);
    }

    if (rows.length === 0) {
      throw new Error('No users with primary wallet and positive stake. Add wallets (is_primary=true) and holdings.');
    }

    for (const r of rows) {
      await client.query(
        `INSERT INTO stake_snapshots (proposal_id, wallet_address, stake_amount) VALUES ($1, $2, $3)`,
        [r.proposal_id, r.wallet_address, r.stake_amount]
      );
    }

    await client.query(
      `UPDATE proposals SET status = 'snapshot_taken', updated_at = now() WHERE id = $1`,
      [proposalId]
    );

    return {
      proposalId,
      rowsWritten: rows.length,
      totalStake: totalStake.toString(),
    };
  });
}
