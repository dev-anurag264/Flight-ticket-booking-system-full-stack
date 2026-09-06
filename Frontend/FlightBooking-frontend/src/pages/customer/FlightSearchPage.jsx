import { useState } from "react";
import { flightApi } from "../../api/flightapi";

export default function FlightSearchPage() {
  const [form, setForm] = useState({ origin: "", destination: "", date: "" });
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setError("");
    setSearching(true);
    try {
      const response = await flightApi.search(form);
      setResults(response.data);
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Search Flights</h1>

      <form
        onSubmit={handleSearch}
        className="bg-white p-4 rounded shadow flex gap-2 flex-wrap items-end"
      >
        <div>
          <label className="block text-sm text-gray-600">From (IATA)</label>
          <input
            value={form.origin}
            onChange={(e) => setForm({ ...form, origin: e.target.value })}
            className="border rounded px-2 py-1 w-24"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">To (IATA)</label>
          <input
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            className="border rounded px-2 py-1 w-24"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border rounded px-2 py-1"
            required
          />
        </div>
        <button
          type="submit"
          disabled={searching}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {results && results.length === 0 && (
        <p className="text-gray-600">
          No flights found for this route and date.
        </p>
      )}

      {results && results.length > 0 && (
        <div className="space-y-3">
          {results.map((f) => (
            <div
              key={f.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{f.flightNumber}</p>
                <p className="text-sm text-gray-600">
                  {f.origin.iataCode} → {f.destination.iataCode} ·{" "}
                  {f.departureTime} - {f.arrivalTime}
                </p>
              </div>
              <p className="text-lg font-bold text-blue-600">₹{f.baseFare}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
