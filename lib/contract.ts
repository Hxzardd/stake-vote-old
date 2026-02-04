import { BrowserProvider, Contract, ContractTransactionResponse } from 'ethers'

// TODO: Replace with your actual contract address after deployment
export const CONTRACT_ADDRESS = '0x...'

export function isContractConfigured(): boolean {
  return Boolean(CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x...')
}

export const CONTRACT_ABI = [
  'function proposalDescription() view returns (string)',
  'function getVoteCounts() view returns (uint256, uint256)',
  'function getUserVotingPower(address) view returns (uint256)',
  'function hasVoted(address) view returns (bool)',
  'function totalVotingPower() view returns (uint256)',
  'function getPhase() view returns (uint8)',
  'function vote(bool support)',
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

const EMPTY_VOTING_DATA: VotingData = {
  proposal: '',
  yesVotes: 0n,
  noVotes: 0n,
  userStake: 0n,
  hasVoted: false,
  totalVotingPower: 0n,
}

export async function fetchVotingData(
  signer: any,
  userAddress: string,
): Promise<VotingData> {
  if (!isContractConfigured()) {
    return EMPTY_VOTING_DATA
  }
  const contract = await getVotingContract(signer)

  const [proposal, [yesVotes, noVotes], userStake, hasVoted, totalVotingPower] =
    await Promise.all([
      contract.proposalDescription(),
      contract.getVoteCounts(),
      contract.getUserVotingPower(userAddress),
      contract.hasVoted(userAddress),
      contract.totalVotingPower(),
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
