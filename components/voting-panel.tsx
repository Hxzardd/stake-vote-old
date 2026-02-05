"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Info, Wallet } from "lucide-react";

interface VotingPanelProps {
  isConnected: boolean;
  walletAddress?: string | null;
  hasVoted: boolean;
  userVote: "yes" | "no" | null;
  userStake?: number;
  onVote: (vote: "yes" | "no") => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function VotingPanel({
  isConnected,
  walletAddress,
  hasVoted,
  userVote,
  userStake = 0,
  onVote,
  onConnect,
  onDisconnect,
  isLoading = false,
  error = null,
}: VotingPanelProps) {
  const truncateAddress = (address: string | undefined) => {
    if (!address) return "Connected";
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
            <Button onClick={onConnect} className="gap-2 w-full">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-lg border-2 border-gray-500 bg-secondary/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-1" />
                <span className="text-sm font-medium text-foreground">
                  {truncateAddress(walletAddress)}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={onDisconnect}>
                Disconnect
              </Button>
            </div>

            {userStake > 0 && (
              <div className="bg-secondary/50 rounded-lg p-4 border-2 border-gray-500">
                <p className="text-sm text-muted-foreground">Your Voting Power</p>
                <p className="text-2xl font-bold text-chart-1">{userStake} tokens</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm font-medium text-red-900 dark:text-red-200">Error</p>
                <p className="text-sm text-red-800 dark:text-red-300 mt-1">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                className="h-14 gap-2 bg-chart-1 text-primary-foreground hover:bg-chart-1/90"
                disabled={hasVoted || isLoading}
                onClick={() => onVote("yes")}
              >
                <ThumbsUp className="h-5 w-5" />
                Vote Yes
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="h-14 gap-2"
                disabled={hasVoted || isLoading}
                onClick={() => onVote("no")}
              >
                <ThumbsDown className="h-5 w-5" />
                Vote No
              </Button>
            </div>

            {hasVoted && userVote && (
              <div className="rounded-lg bg-sky-500/10 border-2 border-gray-500 p-4 text-center space-y-2">
                <p className="text-lg font-semibold text-black">
                  Thank you for Voting!
                </p>
                <p className="text-sm text-black/70">
                  You voted{" "}
                  <span className="font-semibold capitalize text-black">{userVote}</span>
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
