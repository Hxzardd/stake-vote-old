'use client';

export function Header() {
  return (
    <header className="pt-8 pb-4">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-lg border border-border">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7 text-card-foreground"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              StakeVote
            </h1>
            <p className="text-sm text-foreground/80">
              Transparent, stake-weighted corporate voting
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
