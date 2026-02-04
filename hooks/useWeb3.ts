'use client'

import { useEffect, useState } from 'react'
import { BrowserProvider } from 'ethers'
import {
  connectMetaMask,
  getProvider,
  getSigner,
  getConnectedAddress,
  revokeWalletPermissions,
  setupMetaMaskListener,
} from '@/lib/web3'

interface UseWeb3State {
  address: string | null
  signer: any | null
  provider: BrowserProvider | null
  isConnecting: boolean
  error: string | null
}

export function useWeb3() {
  const [state, setState] = useState<UseWeb3State>({
    address: null,
    signer: null,
    provider: null,
    isConnecting: false,
    error: null,
  })

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const address = await getConnectedAddress()
        if (address) {
          const provider = await getProvider()
          const signer = await getSigner(provider)
          setState({
            address,
            signer,
            provider,
            isConnecting: false,
            error: null,
          })
        }
      } catch (err) {
        console.error('[v0] Failed to restore connection:', err)
      }
    }

    checkConnection()

    const cleanup = setupMetaMaskListener(
      (accounts) => {
        if (accounts.length === 0) {
          setState({
            address: null,
            signer: null,
            provider: null,
            isConnecting: false,
            error: null,
          })
        } else {
          checkConnection()
        }
      },
      () => {
        checkConnection()
      }
    )

    return cleanup
  }, [])

  const connect = async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }))
    try {
      const address = await connectMetaMask()
      const provider = await getProvider()
      const signer = await getSigner(provider)

      setState({
        address,
        signer,
        provider,
        isConnecting: false,
        error: null,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setState({
        address: null,
        signer: null,
        provider: null,
        isConnecting: false,
        error: errorMessage,
      })
    }
  }

  const disconnect = async () => {
    setState({
      address: null,
      signer: null,
      provider: null,
      isConnecting: false,
      error: null,
    })
    await revokeWalletPermissions()
  }

  return {
    ...state,
    connect,
    disconnect,
    isConnected: state.address !== null,
  }
}
