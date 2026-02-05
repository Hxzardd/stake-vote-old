'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, Info, Wallet } from 'lucide-react';

interface VotingPanelProps {
  isConnected: boolean;
  walletAddress: string | null;
  hasVoted: boolean;
  userVote: 'yes' | 'no' | null;
  userStake: number;
  onVote: (direction: 'yes' | 'no') => void;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function VotingPanel({
  isConnected,
  walletAddress,
  hasVoted,
  userVote,
  userStake,
  onVote,
  onConnect,
  onDisconnect,
  isLoading = false,
  error = null,
}: VotingPanelProps) {
  const truncateAddress = (address: string | null) => {
    if (!address) return 'Connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Cast Your Vote
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="rounded-lg border-2 border-gray-500 bg-secondary/50 p-4 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              To cast your vote, connect your wallet
            </p>
            <Button onClick={onConnect} className="gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-lg border-2 border-gray-500 bg-secondary/50 px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-1" />
                  <span className="text-sm font-medium text-foreground">
                    {truncateAddress(walletAddress)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Voting power: {userStake.toLocaleString()} tokens
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onDisconnect}>
                Disconnect
              </Button>
            </div>

            {error && (
              <div className="rounded-lg border-2 border-destructive/50 bg-destructive/10 p-4">
                <p className="text-sm font-medium text-destructive-foreground">
                  Error
                </p>
                <p className="text-sm text-destructive/90 mt-1">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                className="h-14 gap-2 bg-chart-1 text-primary-foreground hover:bg-chart-1/90"
                disabled={hasVoted || isLoading}
                onClick={() => onVote('yes')}
              >
                <ThumbsUp className="h-5 w-5" />
                {isLoading ? 'Processing...' : 'Vote Yes'}
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="h-14 gap-2"
                disabled={hasVoted || isLoading}
                onClick={() => onVote('no')}
              >
                <ThumbsDown className="h-5 w-5" />
                {isLoading ? 'Processing...' : 'Vote No'}
              </Button>
            </div>

            {hasVoted && userVote && (
              <div className="rounded-lg bg-sky-500/10 border-2 border-gray-500 p-4 text-center space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  Thank you for Voting!
                </p>
                <p className="text-sm text-muted-foreground">
                  You voted{' '}
                  <span className="font-semibold capitalize text-foreground">
                    {userVote}
                  </span>{' '}
                  with {userStake.toLocaleString()} voting power
                </p>
              </div>
            )}
          </>
        )}

        <div className="flex items-start gap-2 pt-2">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your voting power is proportional to your stake. Votes are final and
            recorded on-chain.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
