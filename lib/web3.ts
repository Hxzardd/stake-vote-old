import { BrowserProvider } from 'ethers'

declare global {
  interface Window {
    ethereum?: any
  }
}

export async function connectMetaMask(): Promise<string> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed')
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    return accounts[0]
  } catch (error) {
    throw new Error('Failed to connect to MetaMask')
  }
}

export async function getProvider(): Promise<BrowserProvider> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed')
  }
  return new BrowserProvider(window.ethereum)
}

export async function getSigner(provider: BrowserProvider) {
  return await provider.getSigner()
}

export async function getConnectedAddress(): Promise<string | null> {
  try {
    if (!window.ethereum) return null
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    })
    return accounts[0] || null
  } catch {
    return null
  }
}

export function setupMetaMaskListener(onAccountsChanged: (accounts: string[]) => void) {
  if (!window.ethereum) return

  window.ethereum.on('accountsChanged', onAccountsChanged)

  return () => {
    window.ethereum?.removeListener('accountsChanged', onAccountsChanged)
  }
}
