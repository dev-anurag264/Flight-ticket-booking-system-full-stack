import { useState, useEffect, useRef } from "react";
import { airportApi } from "../../api/airportapi";

export default function AirportSelector({ label, value, onChange, exclude }) {
  const [airports, setAirports] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    airportApi
      .getAll()
      .then((res) => setAirports(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = airports.filter((a) => {
    if (a.iataCode === exclude) return false;
    const q = query.toLowerCase();
    return (
      a.city.toLowerCase().includes(q) ||
      a.iataCode.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
    );
  });

  const selected = airports.find((a) => a.iataCode === value);

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-medium text-ink-700 mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left px-3 py-2.5 rounded-[var(--radius-control)] border border-slate-300 bg-surface hover:border-ink-400 focus:outline-none focus:ring-2 focus:ring-ink-900/10 focus:border-ink-900"
      >
        {selected ? (
          <span>
            <span className="font-flight font-semibold">
              {selected.iataCode}
            </span>
            <span className="text-ink-600"> — {selected.city}</span>
          </span>
        ) : (
          <span className="text-ink-400">Select airport</span>
        )}
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-80 bg-surface border border-slate-300 rounded-[var(--radius-card)] shadow-lg overflow-hidden">
          <input
            autoFocus
            placeholder="Search city or airport code"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border-b border-slate-200 focus:outline-none"
          />
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-sm text-ink-400 text-center">
                No airports found
              </p>
            )}
            {filtered.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  onChange(a.iataCode);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-paper-100 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-ink-900">{a.city}</p>
                  <p className="text-xs text-ink-400">{a.name}</p>
                </div>
                <span className="font-flight text-sm text-ink-600">
                  {a.iataCode}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
