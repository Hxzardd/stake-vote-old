'use client';

import { Button } from '@/components/ui/button'

interface HeaderProps {
  isConnected: boolean
  walletAddress: string | null
  onConnect: () => void
  onDisconnect: () => void
}

export default function Header({
  isConnected,
  walletAddress,
  onConnect,
  onDisconnect,
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">StakeVote</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Transparent, stake-weighted corporate voting
          </p>
        </div>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {walletAddress}
                </p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onDisconnect}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={onConnect}
              size="sm"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
