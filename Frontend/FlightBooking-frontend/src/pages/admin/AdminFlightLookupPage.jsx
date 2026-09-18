import { useState, useEffect } from "react";
import { flightApi } from "../../api/flightapi";
import { seatApi } from "../../api/seatApi";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

export default function AdminFlightLookupPage() {
  const [allFlights, setAllFlights] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [seats, setSeats] = useState(null);

  useEffect(() => {
    flightApi
      .getAll()
      .then((res) => setAllFlights(res.data))
      .catch(() => {});
  }, []);

  const results = query.trim()
    ? allFlights.filter(
        (f) =>
          f.flightNumber.toLowerCase().includes(query.toLowerCase()) ||
          f.origin.iataCode.toLowerCase().includes(query.toLowerCase()) ||
          f.destination.iataCode.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  async function selectFlight(flight) {
    setSelected(flight);
    setSeats(null);
    try {
      const res = await seatApi.getSeats(flight.id);
      setSeats(res.data);
    } catch {
      setSeats([]);
    }
  }

  const seatCounts = seats?.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Input
          placeholder="Search by flight number or airport code"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="space-y-2">
          {query && results.length === 0 && (
            <p className="text-sm text-ink-400 px-1">No matching flights</p>
          )}
          {results.map((f) => (
            <button
              key={f.id}
              onClick={() => selectFlight(f)}
              className={`w-full text-left px-4 py-3 rounded-[var(--radius-card)] border transition-colors ${
                selected?.id === f.id
                  ? "border-ink-900 bg-paper-100"
                  : "border-slate-300/60 bg-surface hover:border-ink-400"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-flight font-semibold text-ink-900">
                  {f.flightNumber}
                </span>
                <Badge status={f.status} />
              </div>
              <p className="text-xs text-ink-400 mt-0.5">
                {f.origin.iataCode} → {f.destination.iataCode}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div>
        {!selected && (
          <EmptyState
            title="Select a flight"
            description="Search and pick a flight to see its full details and seat map status."
          />
        )}

        {selected && (
          <Card className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-flight text-lg font-semibold text-ink-900">
                  {selected.flightNumber}
                </p>
                <p className="text-sm text-ink-400">
                  {selected.origin.iataCode} → {selected.destination.iataCode}
                </p>
              </div>
              <Badge status={selected.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm border-t border-slate-300/60 pt-3">
              <div>
                <p className="text-ink-400">Departure</p>
                <p className="font-flight text-ink-900">
                  {selected.departureTime}
                </p>
              </div>
              <div>
                <p className="text-ink-400">Arrival</p>
                <p className="font-flight text-ink-900">
                  {selected.arrivalTime}
                </p>
              </div>
              <div>
                <p className="text-ink-400">Aircraft</p>
                <p className="text-ink-900">{selected.aircraftType || "—"}</p>
              </div>
              <div>
                <p className="text-ink-400">Base Fare</p>
                <p className="font-flight text-ink-900">₹{selected.baseFare}</p>
              </div>
            </div>

            <div className="border-t border-slate-300/60 pt-3">
              <p className="text-sm font-medium text-ink-700 mb-2">
                Seat Status
              </p>
              {seats === null && (
                <p className="text-sm text-ink-400">Loading seats…</p>
              )}
              {seats?.length === 0 && (
                <p className="text-sm text-ink-400">
                  No seats generated for this flight yet.
                </p>
              )}
              {seatCounts && (
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(seatCounts).map(([status, count]) => (
                    <Badge key={status} status={status}>
                      {status} · {count}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
