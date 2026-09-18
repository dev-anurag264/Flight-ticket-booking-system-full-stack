import { useState } from "react";
import { flightApi } from "../../api/flightapi";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
          <DatePicker
            selected={form.date ? new Date(form.date) : null}
            onChange={(date) =>
              setForm({ ...form, date: date.toISOString().split("T")[0] })
            }
            minDate={new Date()}
            dateFormat="dd MMM yyyy"
            placeholderText="Select date"
            className="border rounded px-2 py-1 w-full"
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
          Oops! No flights found for the selected route and date. Please try a
          different search.
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
                  {f.origin.iataCode} to {f.destination.iataCode} ·{" "}
                  {f.departureTime} - {f.arrivalTime}
                </p>
              </div>
              <Link
                to={`/flights/${f.id}/seats`}
                className="bg-orange-500 text-white px-4 py-2 rounded  hover:bg-orange-600"
              >
                Book Now - ₹{f.baseFare}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
