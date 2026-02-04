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

export async function revokeWalletPermissions(): Promise<void> {
  try {
    if (!window.ethereum?.request) return
    await window.ethereum.request({
      method: 'wallet_revokePermissions',
      params: [{ eth_accounts: {} }],
    })
  } catch {
    // Wallets that don't support wallet_revokePermissions will throw; ignore
  }
}

export function setupMetaMaskListener(
  onAccountsChanged: (accounts: string[]) => void,
  onChainChanged?: () => void
) {
  if (!window.ethereum) return () => {}

  window.ethereum.on('accountsChanged', onAccountsChanged)
  if (onChainChanged) {
    window.ethereum.on('chainChanged', onChainChanged)
  }

  return () => {
    window.ethereum?.removeListener('accountsChanged', onAccountsChanged)
    if (onChainChanged) {
      window.ethereum?.removeListener('chainChanged', onChainChanged)
    }
  }
}
