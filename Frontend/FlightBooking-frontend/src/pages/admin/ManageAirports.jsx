import { useState, useEffect } from "react";
import { airportApi } from "../../api/airportapi";

export default function ManageAirports() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    iataCode: "",
    name: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    loadAirports();
  }, []);

  async function loadAirports() {
    setLoading(true);
    try {
      const response = await airportApi.getAll();
      setAirports(response.data);
    } catch (err) {
      setError("Failed to load airports");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await airportApi.create(form);
      setForm({ iataCode: "", name: "", city: "", country: "" });
      loadAirports();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create airport");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this airport?")) return;
    try {
      await airportApi.delete(id);
      loadAirports();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete airport");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Airports</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow flex gap-2 flex-wrap"
      >
        <input
          placeholder="IATA (BLR)"
          value={form.iataCode}
          onChange={(e) => setForm({ ...form, iataCode: e.target.value })}
          className="border rounded px-2 py-1 w-24"
          required
        />
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded px-2 py-1 flex-1"
          required
        />
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="border rounded px-2 py-1 w-32"
          required
        />
        <input
          placeholder="Country"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          className="border rounded px-2 py-1 w-32"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Code</th>
              <th className="p-2">Name</th>
              <th className="p-2">City</th>
              <th className="p-2">Country</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {airports.map((a) => (
              <tr key={a.id} className="border-b">
                <td className="p-2 font-mono">{a.iataCode}</td>
                <td className="p-2">{a.name}</td>
                <td className="p-2">{a.city}</td>
                <td className="p-2">{a.country}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-red-600 hover:underline text-sm"
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
