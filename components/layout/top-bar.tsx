// Base top bar for the app shell. Static for Stage 1; will hold breadcrumbs,
// search and the signed-in user once auth lands.

export function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-6">
      <div className="rise-in font-mono text-xs text-muted-foreground">
        ~/codelearn<span className="caret pl-0.5">_</span>
      </div>
      <div className="rise-in flex items-center gap-3 text-sm" style={{ animationDelay: "120ms" }}>
        <span className="text-muted-foreground">Guest</span>
        <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground transition-transform duration-200 hover:scale-110">
          G
        </span>
      </div>
    </header>
  );
}
