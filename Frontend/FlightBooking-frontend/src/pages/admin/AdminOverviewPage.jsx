import { useState, useEffect } from "react";
import { flightApi } from "../../api/flightapi";
import Card from "../../components/ui/Card";
import ErrorState from "../../components/ui/ErrorState";

function StatCard({ label, value, tone = "default" }) {
  const toneClasses = {
    default: "text-ink-900",
    success: "text-emerald-600",
    warning: "text-amber-600",
    danger: "text-rose-600",
  };
  return (
    <Card className="p-5">
      <p className="text-sm text-ink-400">{label}</p>
      <p
        className={`font-flight text-3xl font-semibold mt-1 ${toneClasses[tone]}`}
      >
        {value}
      </p>
    </Card>
  );
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const response = await flightApi.getStats();
      setStats(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <p className="text-ink-400 text-sm">Loading metrics...</p>;
  if (error)
    return (
      <ErrorState
        error={error}
        action={
          <button onClick={load} className="text-sm underline">
            Retry
          </button>
        }
      />
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Flights" value={stats.totalFlights} />
        <StatCard label="Live Now" value={stats.liveFlights} tone="success" />
        <StatCard label="Scheduled" value={stats.scheduledFlights} />
        <StatCard label="Delayed" value={stats.delayedFlights} tone="warning" />
        <StatCard
          label="Cancelled"
          value={stats.cancelledFlights}
          tone="danger"
        />
        <StatCard label="Departed" value={stats.departedFlights} />
      </div>
    </div>
  );
}
