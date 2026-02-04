import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerificationSection() {
  return (
    <Card className="mt-12 bg-secondary/30 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">On-Chain Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground leading-relaxed">
          All votes are immutably recorded on the Polygon Amoy testnet. This ensures
          complete transparency and auditability of the voting process. Every vote
          is timestamped and cryptographically verified against the voter's wallet.
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-accent font-bold">✓</span>
            <span className="text-foreground">
              Votes are weighted by stakeholder token balance
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-accent font-bold">✓</span>
            <span className="text-foreground">
              Results are cryptographically verified in real-time
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-accent font-bold">✓</span>
            <span className="text-foreground">
              Vote transactions are permanent and tamper-proof
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-4 border-primary text-primary hover:bg-primary/5 bg-transparent"
        >
          View Smart Contract on Block Explorer →
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Contract: 0x742d35Cc6634C0532925a3b844Bc0e8AeAb8eAb
        </p>
      </CardContent>
    </Card>
  )
}
