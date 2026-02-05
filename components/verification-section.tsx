import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ExternalLink, CheckCircle2 } from "lucide-react";

interface VerificationSectionProps {
  contractAddress?: string;
  networkName?: string;
  explorerUrl?: string;
}

export default function VerificationSection({
  contractAddress = "0x1234567890abcdef1234567890abcdef12345678",
  networkName = "Polygon Amoy",
  explorerUrl = "https://amoy.polygonscan.com/address/0x1234567890abcdef1234567890abcdef12345678",
}: VerificationSectionProps) {
  const truncateAddress = (address: string | undefined) => {
    if (!address) return "N/A";
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  return (
    <Card>
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

        <Button variant="outline" className="w-full gap-2 bg-transparent" asChild>
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            View on Block Explorer
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
