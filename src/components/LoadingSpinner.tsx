import { cn } from "../lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  className,
  text = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6",
        className,
      )}
    >
      <div className="relative">
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />

        {/* Outer Ring */}
        <div className="h-16 w-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />

        {/* Center Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium tracking-wide">{text}</p>

        <p className="text-xs text-muted-foreground">Please wait a moment</p>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <div className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <div className="h-3 w-3 rounded-full bg-primary animate-bounce" />
      </div>

      <div className="text-center">
        <p className="font-medium">Loading</p>
        <p className="text-sm text-muted-foreground">
          Getting everything ready
        </p>
      </div>
    </div>
  );
}
