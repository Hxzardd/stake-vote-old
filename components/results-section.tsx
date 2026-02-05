import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface ResultsSectionProps {
  yesVotes: number;
  noVotes: number;
  totalStake?: number;
  yesPercentage?: number;
  noPercentage?: number;
  participation?: number;
}

export default function ResultsSection({
  yesVotes,
  noVotes,
  totalStake,
  yesPercentage: propYesPercentage,
  noPercentage: propNoPercentage,
  participation,
}: ResultsSectionProps) {
  const calcTotalStake = totalStake ?? yesVotes + noVotes;
  const yesPercentage = propYesPercentage ?? (calcTotalStake > 0 ? (yesVotes / calcTotalStake) * 100 : 0);
  const noPercentage = propNoPercentage ?? (calcTotalStake > 0 ? (noVotes / calcTotalStake) * 100 : 0);

  const formatStake = (value: number) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold text-foreground">
            Current Results
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Yes Votes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Yes</span>
            <span className="text-sm font-semibold text-foreground">
              {formatStake(yesVotes)} tokens
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-secondary border-2 border-gray-500 overflow-hidden">
            <div
              className="h-full rounded-full bg-chart-1 transition-all duration-500"
              style={{ width: `${yesPercentage}%` }}
            />
          </div>
        </div>

        {/* No Votes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">No</span>
            <span className="text-sm font-semibold text-foreground">
              {formatStake(noVotes)} tokens
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-secondary border-2 border-gray-500 overflow-hidden">
            <div
              className="h-full rounded-full bg-destructive transition-all duration-500"
              style={{ width: `${noPercentage}%` }}
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-gray-500">
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">
              {yesPercentage.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">Yes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">
              {noPercentage.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">No</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">
              {formatStake(calcTotalStake)}
            </p>
            <p className="text-xs text-muted-foreground">
              {participation !== undefined ? "Participation" : "Total Stake"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
