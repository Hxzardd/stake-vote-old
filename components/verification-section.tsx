import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Shield, ExternalLink, CheckCircle2 } from 'lucide-react';

const POLYGON_AMOY_EXPLORER = 'https://amoy.polygonscan.com';

interface VerificationSectionProps {
  contractAddress?: string;
  networkName?: string;
  explorerUrl?: string;
}

function truncateAddress(address: string | undefined): string {
  if (!address || address === '0x...') return 'N/A';
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}

export default function VerificationSection({
  contractAddress,
  networkName = 'Polygon Amoy',
  explorerUrl,
}: VerificationSectionProps) {
  const resolvedExplorerUrl =
    explorerUrl ??
    (contractAddress && contractAddress !== '0x...'
      ? `${POLYGON_AMOY_EXPLORER}/address/${contractAddress}`
      : POLYGON_AMOY_EXPLORER);

  return (
    <Card className="mt-12 bg-secondary/30 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold text-foreground">
            On-Chain Verification
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-chart-1" />
            <span className="text-muted-foreground">
              All votes are permanently recorded on the blockchain
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-chart-1" />
            <span className="text-muted-foreground">
              Results are transparent and independently verifiable
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-chart-1" />
            <span className="text-muted-foreground">
              Voting power calculated from on-chain stake data
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-secondary border-2 border-gray-500 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Network</span>
            <span className="font-medium text-foreground">{networkName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Contract</span>
            <span className="font-mono text-xs text-foreground">
              {truncateAddress(contractAddress)}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2 bg-transparent border-primary text-primary hover:bg-primary/5"
          asChild
        >
          <a
            href={resolvedExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            View on Block Explorer
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
