import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProposalSectionProps {
  proposal?: string
}

export default function ProposalSection({ proposal = '' }: ProposalSectionProps) {
  // Display proposal from contract if available, otherwise show placeholder
  const displayProposal = proposal || 'This proposal seeks approval for the allocation of $2.5M from the corporate treasury to fund three strategic initiatives for Q1 2025: infrastructure modernization, talent acquisition, and market expansion in APAC regions.'
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Proposal #2024-001: Q1 Budget Allocation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground leading-relaxed">
          {displayProposal}
        </p>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Voting Deadline</p>
            <p className="font-semibold text-foreground">Feb 28, 2025</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Quorum Required</p>
            <p className="font-semibold text-foreground">51%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-semibold text-accent">In Progress</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
