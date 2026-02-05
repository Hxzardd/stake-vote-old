import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ProposalSectionProps {
  title?: string;
  description?: string;
  proposalId?: string;
  proposal?: string;
}

export default function ProposalSection({
  title = "Approval of Q1 2026 Strategic Investment Budget",
  description = "This proposal seeks stakeholder approval for the allocation of 2,500,000 tokens toward strategic investments in emerging markets and technology infrastructure. The investment will be distributed across three key areas: market expansion (40%), R&D initiatives (35%), and operational scaling (25%).",
  proposalId = "PROP-2026-001",
  proposal = "",
}: ProposalSectionProps) {
  // Support both old and new prop names
  const displayDescription = proposal || description;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <FileText className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">
            Active Proposal
          </span>
          <span className="ml-auto text-xs font-mono bg-secondary px-2 py-0.5 rounded border-2 border-gray-500">
            {proposalId}
          </span>
        </div>
        <CardTitle className="text-xl font-semibold text-foreground text-balance">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{displayDescription}</p>
      </CardContent>
    </Card>
  );
}
