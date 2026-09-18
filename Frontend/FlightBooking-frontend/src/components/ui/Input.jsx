export default function Input({ label, error, className = "", id, ...props }) {
  const inputId = id || props.name;
  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-ink-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3 py-2.5 rounded-[var(--radius-control)] border bg-white text-sm
          placeholder:text-ink-400 transition-colors
          focus:outline-none focus:ring-2 focus:ring-ink-900/10 focus:border-ink-900
          ${error ? "border-rose-600" : "border-slate-300"}
          ${className}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-rose-600 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
