const VARIANTS = {
  primary: "bg-ink-900 text-paper-50 hover:bg-ink-700",
  accent: "bg-amber-500 text-ink-900 hover:bg-amber-600 font-semibold",
  secondary:
    "bg-paper-100 text-ink-900 border border-slate-300 hover:bg-paper-200",
  destructive: "bg-rose-600 text-paper-50 hover:bg-rose-600/90",
  ghost: "text-ink-600 hover:bg-paper-100",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)]
        transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
