export default function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-paper-200 rounded ${className}`} />;
}

export function FlightResultSkeleton() {
  return (
    <div className="bg-surface rounded-(--radius-card) border border-slate-300/60 p-4 flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-40" />
      </div>
      <Skeleton className="h-9 w-28" />
    </div>
  );
}
