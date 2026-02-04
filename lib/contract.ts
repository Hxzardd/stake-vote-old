import { BrowserProvider, Contract, ContractTransactionResponse } from 'ethers'

// TODO: Replace with your actual contract address after deployment
export const CONTRACT_ADDRESS = '0x...'

/**
 * ABI for StakeVoting contract. Matches exact function signatures required by frontend.
 * Full ABI JSON: contracts/abi/StakeVoting.json
 */
export const CONTRACT_ABI = [
  'function getProposal() view returns (string description)',
  'function getVoteCounts() view returns (uint256 yesVotes, uint256 noVotes)',
  'function getUserVotingPower(address voter) view returns (uint256 votingPower)',
  'function hasUserVoted(address voter) view returns (bool)',
  'function vote(bool support)',
  // Recommended (optional for UI)
  'function getProposalDeadline() view returns (uint256 blockTimestamp)',
  'function getQuorumPercentage() view returns (uint256)',
  'function getTotalVotingPower() view returns (uint256)',
  'function getProposalStatus() view returns (string)',
]

export interface VotingData {
  proposal: string
  yesVotes: bigint
  noVotes: bigint
  userStake: bigint
  hasVoted: boolean
  totalVotingPower: bigint
}

export async function getVotingContract(signer: any) {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x...') {
    throw new Error('Contract address not configured. Update CONTRACT_ADDRESS in lib/contract.ts')
  }
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
}

export async function fetchVotingData(
  signer: any,
  userAddress: string,
): Promise<VotingData> {
  const contract = await getVotingContract(signer)

  const [proposal, [yesVotes, noVotes], userStake, hasVoted, totalVotingPower] =
    await Promise.all([
      contract.getProposal(),
      contract.getVoteCounts(),
      contract.getUserVotingPower(userAddress),
      contract.hasUserVoted(userAddress),
      contract.getTotalVotingPower(),
    ])

  return {
    proposal,
    yesVotes,
    noVotes,
    userStake,
    hasVoted,
    totalVotingPower,
  }
}

export async function submitVote(
  signer: any,
  support: boolean,
): Promise<string> {
  const contract = await getVotingContract(signer)

  const tx: ContractTransactionResponse | null = await contract.vote(support)
  if (!tx) throw new Error('Failed to send transaction')

  const receipt = await tx.wait()
  if (!receipt) throw new Error('Transaction failed')

  return receipt.hash
}
