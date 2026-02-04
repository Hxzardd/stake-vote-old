'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/header'
import ProposalSection from '@/components/proposal-section'
import VotingPanel from '@/components/voting-panel'
import ResultsSection from '@/components/results-section'
import VerificationSection from '@/components/verification-section'
import { useWeb3 } from '@/hooks/useWeb3'
import { useVoting } from '@/hooks/useVoting'

export default function Home() {
  const web3 = useWeb3()
  const voting = useVoting(web3.signer, web3.address)
  const [userVote, setUserVote] = useState<'yes' | 'no' | null>(null)

  // Format wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return null
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleConnectWallet = async () => {
    await web3.connect()
  }

  const handleDisconnectWallet = () => {
    web3.disconnect()
    setUserVote(null)
  }

  const handleVote = async (direction: 'yes' | 'no') => {
    if (voting.isSubmitting) return
    
    const support = direction === 'yes'
    await voting.vote(support)
    
    if (!voting.error && voting.txHash) {
      setUserVote(direction)
    }
  }

  const totalVotes = voting.yesVotes + voting.noVotes
  const yesPercentage =
    totalVotes > 0 ? (voting.yesVotes / totalVotes) * 100 : 0
  const noPercentage =
    totalVotes > 0 ? (voting.noVotes / totalVotes) * 100 : 0
  const participation =
    voting.totalVotingPower > 0
      ? (totalVotes / voting.totalVotingPower) * 100
      : 0

  return (
    <main className="min-h-screen bg-background">
      <Header
        isConnected={web3.isConnected}
        walletAddress={formatAddress(web3.address)}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <ProposalSection proposal={voting.proposal} />

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <VotingPanel
            isConnected={web3.isConnected}
            hasVoted={voting.hasVoted}
            userVote={userVote}
            userStake={voting.userStake}
            onVote={handleVote}
            isLoading={voting.isSubmitting}
            error={voting.error || web3.error}
          />

          <ResultsSection
            yesVotes={voting.yesVotes}
            noVotes={voting.noVotes}
            yesPercentage={yesPercentage}
            noPercentage={noPercentage}
            participation={participation}
          />
        </div>

        <VerificationSection />
      </div>
    </main>
  )
}
