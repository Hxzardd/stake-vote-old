import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ResultsSectionProps {
  yesVotes: number
  noVotes: number
  yesPercentage: number
}

export default function ResultsSection({
  yesVotes,
  noVotes,
  yesPercentage,
}: ResultsSectionProps) {
  const totalVotes = yesVotes + noVotes
  const noPercentage = 100 - yesPercentage

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Yes Votes</span>
            <span className="text-sm font-semibold text-primary">
              {yesVotes.toLocaleString()} tokens ({yesPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${yesPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">No Votes</span>
            <span className="text-sm font-semibold text-primary">
              {noVotes.toLocaleString()} tokens ({noPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${noPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Total Votes Cast</p>
            <p className="text-xl font-bold text-foreground">
              {totalVotes.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Participation</p>
            <p className="text-xl font-bold text-accent">42.3%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
