const TONES = {
  neutral: "bg-paper-200 text-ink-600",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-500/15 text-amber-600",
  danger: "bg-rose-50 text-rose-600",
};

const STATUS_TONE_MAP = {
  AVAILABLE: "success",
  HELD: "warning",
  PAYMENT_PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "danger",
  PENDING: "neutral",
  SCHEDULED: "success",
  DELAYED: "warning",
  DEPARTED: "neutral",
};

export default function Badge({ status, tone, children }) {
  const resolvedTone = tone || STATUS_TONE_MAP[status] || "neutral";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TONES[resolvedTone]}`}
    >
      {children || status}
    </span>
  );
}
