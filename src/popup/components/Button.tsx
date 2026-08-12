import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-carleton-red text-white shadow-sm hover:bg-carleton-red-hover active:bg-carleton-red-dark disabled:opacity-50",
  secondary:
    "border border-theme-border bg-theme-elevated text-theme-text hover:bg-theme-surface active:bg-theme-segment disabled:opacity-50",
  ghost:
    "text-theme-muted hover:bg-theme-surface hover:text-theme-text active:bg-theme-segment",
};

const baseStyles =
  "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carleton-red/40 focus-visible:ring-offset-1 focus-visible:ring-offset-theme-page disabled:cursor-not-allowed";

export function Button({
  variant = "primary",
  isLoading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
