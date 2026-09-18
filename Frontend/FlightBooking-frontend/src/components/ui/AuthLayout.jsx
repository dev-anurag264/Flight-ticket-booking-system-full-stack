export default function AuthLayout({ eyebrow, title, children, footer }) {
  return (
    <div className="min-h-screen flex bg-paper-50">
      <div className="hidden lg:flex flex-1 bg-ink-900 items-center justify-center relative overflow-hidden">
        <div className="text-paper-50 text-center px-12 relative z-10">
          <p className="font-flight text-5xl tracking-tight mb-4">EaseFly</p>
          <div className="flex items-center justify-center gap-3 font-flight text-sm text-slate-300">
            <span>CONNECTING</span>
            <span className="flex-1 max-w-16 border-t border-dashed border-slate-300" />
            <span className="text-amber-500">✈</span>
            <span className="flex-1 max-w-16 border-t border-dashed border-slate-300" />
            <span>DREAMS</span>
          </div>
        </div>
      </div>
      {/* Left: form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="font-flight text-xs text-amber-600 tracking-widest uppercase mb-2">
              {eyebrow}
            </p>
            <h1 className="text-2xl font-semibold text-ink-900">{title}</h1>
          </div>
          {children}
          {footer && (
            <div className="mt-6 text-center text-sm text-ink-400">
              {footer}
            </div>
          )}
        </div>
      </div>

      {/* Right: brand panel — visual identity moment, hidden on mobile */}
    </div>
  );
}
