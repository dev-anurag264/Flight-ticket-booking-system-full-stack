import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { flightApi } from "../../api/flightapi";
import AirportSelector from "../../components/ui/AirportSelector";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import { FlightResultSkeleton } from "../../components/ui/Skeleton";

const RECENT_KEY = "aerobook_recent_searches";

export default function FlightSearchPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  function saveRecentSearch(entry) {
    const updated = [
      entry,
      ...recent.filter(
        (r) =>
          !(r.origin === entry.origin && r.destination === entry.destination),
      ),
    ].slice(0, 4);
    setRecent(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  }

  function swap() {
    setOrigin(destination);
    setDestination(origin);
  }

  async function runSearch(o, d, dt) {
    if (!o || !d || !dt) return;
    setSearching(true);
    setError(null);
    setResults(null);
    try {
      const response = await flightApi.search({
        origin: o,
        destination: d,
        date: dt.toISOString().split("T")[0],
      });
      setResults(response.data);
      saveRecentSearch({ origin: o, destination: d });
    } catch (err) {
      setError(err);
    } finally {
      setSearching(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    runSearch(origin, destination, date);
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-flight text-xs text-amber-600 tracking-widest uppercase mb-2">
          Find your flight
        </p>
        <h1 className="text-2xl font-semibold text-ink-900">
          Where are you headed?
        </h1>
      </div>

      <Card className="p-5">
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-3"
        >
          <div className="flex items-end gap-2 flex-1 min-w-[280px]">
            <div className="flex-1">
              <AirportSelector
                label="From"
                value={origin}
                onChange={setOrigin}
                exclude={destination}
              />
            </div>
            <button
              type="button"
              onClick={swap}
              aria-label="Swap origin and destination"
              className="mb-1 h-10 w-10 flex items-center justify-center rounded-full border border-slate-300 hover:bg-paper-100 text-ink-600"
            >
              ⇄
            </button>
            <div className="flex-1">
              <AirportSelector
                label="To"
                value={destination}
                onChange={setDestination}
                exclude={origin}
              />
            </div>
          </div>

          <div className="w-44">
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Departure
            </label>
            <DatePicker
              selected={date}
              onChange={setDate}
              minDate={new Date()}
              dateFormat="dd MMM yyyy"
              placeholderText="Select date"
              className="w-full px-3 py-2.5 rounded-[var(--radius-control)] border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-ink-900/10 focus:border-ink-900 font-flight"
              wrapperClassName="w-full"
            />
          </div>

          <Button type="submit" variant="accent" size="lg" loading={searching}>
            {searching ? "Searching" : "Search flights"}
          </Button>
        </form>
      </Card>

      {!results && !searching && recent.length > 0 && (
        <div>
          <p className="text-sm font-medium text-ink-700 mb-2">
            Recent searches
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  setOrigin(r.origin);
                  setDestination(r.destination);
                }}
                className="font-flight text-sm px-3 py-1.5 rounded-full border border-slate-300 bg-surface hover:border-ink-400 text-ink-700"
              >
                {r.origin} <span className="text-ink-400">→</span>{" "}
                {r.destination}
              </button>
            ))}
          </div>
        </div>
      )}

      {searching && (
        <div className="space-y-3">
          <FlightResultSkeleton />
          <FlightResultSkeleton />
          <FlightResultSkeleton />
        </div>
      )}

      {error && <ErrorState error={error} />}

      {results && results.length === 0 && (
        <EmptyState
          title="No flights found"
          description="Try a different date or route."
        />
      )}

      {results && results.length > 0 && (
        <div className="space-y-3">
          {results.map((f) => (
            <Card
              key={f.id}
              className="p-4 flex items-center justify-between hover:border-ink-400 transition-colors"
            >
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-flight font-semibold text-ink-900">
                    {f.flightNumber}
                  </p>
                  <Badge status={f.status} />
                </div>
                <div className="flex items-center gap-3 font-flight text-sm">
                  <div className="text-center">
                    <p className="text-base font-semibold text-ink-900">
                      {f.origin.iataCode}
                    </p>
                    <p className="text-xs text-ink-400">
                      {f.departureTime?.slice(11, 16)}
                    </p>
                  </div>
                  <span className="flex-1 w-12 border-t border-dashed border-slate-400" />
                  <span className="text-amber-500 text-xs">✈</span>
                  <span className="flex-1 w-12 border-t border-dashed border-slate-400" />
                  <div className="text-center">
                    <p className="text-base font-semibold text-ink-900">
                      {f.destination.iataCode}
                    </p>
                    <p className="text-xs text-ink-400">
                      {f.arrivalTime?.slice(11, 16)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-flight text-lg font-semibold text-ink-900">
                  ₹{f.baseFare}
                </p>
                <Link to={`/flights/${f.id}/details`}>
                  <Button variant="primary">View flight</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
