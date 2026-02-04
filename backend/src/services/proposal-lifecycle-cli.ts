import {
  deployProposalContract,
  startVotingOnChain,
  endVotingOnChain,
  readResult,
} from './proposal-lifecycle.js';

const command = process.argv[2];
const proposalId = process.argv[3];

if (!command || !proposalId) {
  console.error('Usage: node build/services/proposal-lifecycle.js <deploy|start-voting|end-voting|result> <proposal_id>');
  process.exit(1);
}

async function main() {
  switch (command) {
    case 'deploy': {
      const address = await deployProposalContract(proposalId);
      console.log('Deployed contract:', address);
      break;
    }
    case 'start-voting': {
      await startVotingOnChain(proposalId);
      console.log('Voting started on chain.');
      break;
    }
    case 'end-voting': {
      await endVotingOnChain(proposalId);
      console.log('Voting ended on chain.');
      break;
    }
    case 'result': {
      const r = await readResult(proposalId);
      console.log('Result:', r);
      break;
    }
    default:
      console.error('Unknown command:', command);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
