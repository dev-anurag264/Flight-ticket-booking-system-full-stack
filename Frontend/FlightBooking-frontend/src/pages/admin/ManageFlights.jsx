import { useState, useEffect } from "react";
import { flightApi } from "../../api/flightapi";
import { airportApi } from "../../api/airportapi";

const STATUS_OPTIONS = ["SCHEDULED", "DELAYED", "CANCELLED", "DEPARTED"];

export default function ManageFlights() {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    flightNumber: "",
    originAirportId: "",
    destinationAirportId: "",
    departureTime: "",
    arrivalTime: "",
    aircraftType: "",
    baseFare: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [flightsRes, airportsRes] = await Promise.all([
        flightApi.getAll(),
        airportApi.getAll(),
      ]);
      setFlights(flightsRes.data);
      setAirports(airportsRes.data);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await flightApi.create({
        ...form,
        originAirportId: Number(form.originAirportId),
        destinationAirportId: Number(form.destinationAirportId),
        baseFare: Number(form.baseFare),
      });
      setForm({
        flightNumber: "",
        originAirportId: "",
        destinationAirportId: "",
        departureTime: "",
        arrivalTime: "",
        aircraftType: "",
        baseFare: "",
      });
      loadData();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0] ||
        "Failed to create flight";
      setError(message);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await flightApi.updateStatus(id, status);
      loadData();
    } catch (err) {
      setError("Failed to update status");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this flight?")) return;
    try {
      await flightApi.delete(id);
      loadData();
    } catch (err) {
      setError("Failed to delete flight");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Flights</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <input
          placeholder="Flight Number"
          value={form.flightNumber}
          onChange={(e) => setForm({ ...form, flightNumber: e.target.value })}
          className="border rounded px-2 py-1"
          required
        />

        <select
          value={form.originAirportId}
          onChange={(e) =>
            setForm({ ...form, originAirportId: e.target.value })
          }
          className="border rounded px-2 py-1"
          required
        >
          <option value="">Origin</option>
          {airports.map((a) => (
            <option key={a.id} value={a.id}>
              {a.iataCode} — {a.city}
            </option>
          ))}
        </select>

        <select
          value={form.destinationAirportId}
          onChange={(e) =>
            setForm({ ...form, destinationAirportId: e.target.value })
          }
          className="border rounded px-2 py-1"
          required
        >
          <option value="">Destination</option>
          {airports.map((a) => (
            <option key={a.id} value={a.id}>
              {a.iataCode} — {a.city}
            </option>
          ))}
        </select>

        <input
          placeholder="Aircraft Type"
          value={form.aircraftType}
          onChange={(e) => setForm({ ...form, aircraftType: e.target.value })}
          className="border rounded px-2 py-1"
        />

        <input
          type="datetime-local"
          value={form.departureTime}
          onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
          className="border rounded px-2 py-1"
          required
        />

        <input
          type="datetime-local"
          value={form.arrivalTime}
          onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
          className="border rounded px-2 py-1"
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Base Fare"
          value={form.baseFare}
          onChange={(e) => setForm({ ...form, baseFare: e.target.value })}
          className="border rounded px-2 py-1"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Add Flight
        </button>
      </form>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white rounded shadow text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Flight</th>
              <th className="p-2">Route</th>
              <th className="p-2">Departure</th>
              <th className="p-2">Fare</th>
              <th className="p-2">Status</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {flights.map((f) => (
              <tr key={f.id} className="border-b">
                <td className="p-2 font-mono">{f.flightNumber}</td>
                <td className="p-2">
                  {f.origin.iataCode} → {f.destination.iataCode}
                </td>
                <td className="p-2">{f.departureTime}</td>
                <td className="p-2">₹{f.baseFare}</td>
                <td className="p-2">
                  <select
                    value={f.status}
                    onChange={(e) => handleStatusChange(f.id, e.target.value)}
                    className="border rounded px-1 py-0.5 text-xs"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
