import { BrowserProvider, Contract, ContractTransactionResponse } from 'ethers'

// TODO: Replace with your actual contract address
export const CONTRACT_ADDRESS = '0x...'

// TODO: Replace with your actual contract ABI
export const CONTRACT_ABI = [
  'function proposal() public view returns (string)',
  'function voters(address) public view returns (uint256 stake, bool voted)',
  'function yesVotes() public view returns (uint256)',
  'function noVotes() public view returns (uint256)',
  'function vote(bool support) public',
]

export interface VotingData {
  proposal: string
  yesVotes: bigint
  noVotes: bigint
  userStake: bigint
  hasVoted: boolean
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

  const [proposal, yesVotes, noVotes, voterInfo] = await Promise.all([
    contract.proposal(),
    contract.yesVotes(),
    contract.noVotes(),
    contract.voters(userAddress),
  ])

  return {
    proposal,
    yesVotes,
    noVotes,
    userStake: voterInfo.stake,
    hasVoted: voterInfo.voted,
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
