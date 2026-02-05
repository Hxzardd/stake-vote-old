import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface ProposalSectionProps {
  proposal?: string;
}

const DEFAULT_PROPOSAL =
  'This proposal seeks approval for the allocation of $2.5M from the corporate treasury to fund three strategic initiatives for Q1 2025: infrastructure modernization, talent acquisition, and market expansion in APAC regions.';

export default function ProposalSection({ proposal = '' }: ProposalSectionProps) {
  const displayProposal = proposal || DEFAULT_PROPOSAL;
  const proposalId = 'PROP-2024-001';
  const title = 'Proposal #2024-001: Q1 Budget Allocation';

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <FileText className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">
            Active Proposal
          </span>
          <span className="ml-auto text-xs font-mono bg-secondary px-2 py-0.5 rounded border border-border">
            {proposalId}
          </span>
        </div>
        <CardTitle className="text-xl font-semibold text-foreground text-balance">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {displayProposal}
        </p>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-gray-500">
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
            <p className="font-semibold text-chart-1">In Progress</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
