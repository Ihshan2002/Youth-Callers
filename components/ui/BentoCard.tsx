import { cn } from "@/lib/utils";

type BentoCardProps = React.HTMLAttributes<HTMLDivElement>;

export function BentoCard({ className, children, ...props }: BentoCardProps) {
  return (
    <div
      className={cn(
        "relative bg-background border border-border rounded-xl p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
