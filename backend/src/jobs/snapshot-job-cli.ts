import { runSnapshot } from './snapshot-job.js';

const proposalId = process.argv[2];
const cutoffArg = process.argv[3];

if (!proposalId) {
  console.error('Usage: node build/jobs/snapshot-job.js <proposal_id> [cutoff_iso]');
  process.exit(1);
}

const cutoffAt = cutoffArg ? new Date(cutoffArg) : new Date();

runSnapshot({ proposalId, cutoffAt })
  .then((r) => {
    console.log('Snapshot completed:', r);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Snapshot failed:', err.message);
    process.exit(1);
  });
