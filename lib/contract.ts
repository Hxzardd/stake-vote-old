import { BrowserProvider, Contract, ContractTransactionResponse } from 'ethers'

// TODO: Replace with your actual contract address after deployment
export const CONTRACT_ADDRESS = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8'

/**
 * ABI for StakeVoting contract. Matches exact function signatures required by frontend.
 * Full ABI JSON: contracts/abi/StakeVoting.json
 */
export const CONTRACT_ABI = [
  'function proposalTitle() view returns (string)',
  'function proposalDescription() view returns (string)',
  'function yesVotes() view returns (uint256)',
  'function noVotes() view returns (uint256)',
  'function totalVotes() view returns (uint256)',
  'function hasVoted(address) view returns (bool)',
  'function stakeToken() view returns (address)',
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

export async function fetchVotingData(
  signer: any,
  userAddress: string,
): Promise<VotingData> {
  const contract = await getVotingContract(signer)

  const [
    title,
    description,
    yesVotes,
    noVotes,
    totalVotingPower,
    hasVoted,
    stakeTokenAddress,
  ] = await Promise.all([
    contract.proposalTitle(),
    contract.proposalDescription(),
    contract.yesVotes(),
    contract.noVotes(),
    contract.totalVotes(),
    contract.hasVoted(userAddress),
    contract.stakeToken(),
  ])

  const stakeToken = new Contract(
    stakeTokenAddress,
    ['function balanceOf(address) view returns (uint256)'],
    signer,
  )

  const userStake = await stakeToken.balanceOf(userAddress)

  return {
    proposal: `${title} — ${description}`,
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
