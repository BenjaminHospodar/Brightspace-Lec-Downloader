import type { LucideIcon } from "lucide-react";

export interface InstructionStep {
  icon: LucideIcon;
  title: string;
  detail?: string;
}

interface InstructionListProps {
  steps: InstructionStep[];
  compact?: boolean;
}

export function InstructionList({
  steps,
  compact = false,
}: InstructionListProps) {
  return (
    <ul
      className={`list-none ${compact ? "mb-1 space-y-2" : "mb-3 space-y-3"}`}
      aria-label="Download steps"
    >
      {steps.map(({ icon: Icon, title, detail }) => (
        <li key={title} className="flex items-start gap-2.5">
          <span
            className={`flex shrink-0 items-center justify-center rounded-lg glass-red ${
              compact ? "h-7 w-7" : "h-8 w-8"
            }`}
            aria-hidden="true"
          >
            <Icon
              className={`text-carleton-red ${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`}
            />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p
              className={`font-medium leading-snug text-theme-text ${
                compact ? "text-xs" : "text-sm"
              }`}
            >
              {title}
            </p>
            {detail && (
              <p
                className={`mt-0.5 leading-snug text-theme-muted ${
                  compact ? "text-[11px]" : "text-xs"
                }`}
              >
                {detail}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
