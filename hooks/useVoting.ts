'use client'

import { useEffect, useState } from 'react'
import { fetchVotingData, submitVote, VotingData } from '@/lib/contract'

interface UseVotingState {
  proposal: string
  yesVotes: number
  noVotes: number
  userStake: number
  hasVoted: boolean
  totalVotingPower: number
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  txHash: string | null
}

export function useVoting(signer: any, address: string | null) {
  const [state, setState] = useState<UseVotingState>({
    proposal: '',
    yesVotes: 0,
    noVotes: 0,
    userStake: 0,
    hasVoted: false,
    totalVotingPower: 0,
    isLoading: false,
    isSubmitting: false,
    error: null,
    txHash: null,
  })

  // Fetch voting data when signer or address changes
  useEffect(() => {
    if (!signer || !address) {
      setState({
        proposal: '',
        yesVotes: 0,
        noVotes: 0,
        userStake: 0,
        hasVoted: false,
        totalVotingPower: 0,
        isLoading: false,
        isSubmitting: false,
        error: null,
        txHash: null,
      })
      return
    }

    const fetchData = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      try {
        const data = await fetchVotingData(signer, address)
        setState((prev) => ({
          ...prev,
          proposal: data.proposal,
          yesVotes: Number(data.yesVotes),
          noVotes: Number(data.noVotes),
          userStake: Number(data.userStake),
          hasVoted: data.hasVoted,
          totalVotingPower: Number(data.totalVotingPower),
          isLoading: false,
        }))
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch voting data'
        console.error('[v0] Voting data fetch error:', err)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }))
      }
    }

    fetchData()
  }, [signer, address])

  const vote = async (support: boolean) => {
    if (!signer || !address) {
      setState((prev) => ({
        ...prev,
        error: 'Wallet not connected',
      }))
      return
    }

    if (state.hasVoted) {
      setState((prev) => ({
        ...prev,
        error: 'You have already voted',
      }))
      return
    }

    setState((prev) => ({
      ...prev,
      isSubmitting: true,
      error: null,
      txHash: null,
    }))

    try {
      const hash = await submitVote(signer, support)
      setState((prev) => ({
        ...prev,
        hasVoted: true,
        isSubmitting: false,
        txHash: hash,
        yesVotes: support
          ? prev.yesVotes + prev.userStake
          : prev.yesVotes,
        noVotes: !support
          ? prev.noVotes + prev.userStake
          : prev.noVotes,
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit vote'
      console.error('[v0] Vote submission error:', err)
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: errorMessage,
      }))
    }
  }

  const refetch = async () => {
    if (!signer || !address) return

    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const data = await fetchVotingData(signer, address)
      setState((prev) => ({
        ...prev,
        proposal: data.proposal,
        yesVotes: Number(data.yesVotes),
        noVotes: Number(data.noVotes),
        userStake: Number(data.userStake),
        hasVoted: data.hasVoted,
        totalVotingPower: Number(data.totalVotingPower),
        isLoading: false,
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refetch voting data'
      console.error('[v0] Voting data refetch error:', err)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }

  return {
    ...state,
    vote,
    refetch,
  }
}
