import { useState, useEffect } from "react";
import { bookingApi } from "../../api/bookingapi";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    setError("");
    try {
      const response = await bookingApi.getMyBookings();
      const data = response.data;

      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        console.error("Expected an array from /bookings/my but got:", data);
        setBookings([]);
        setError("Unexpected response from server");
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setBookings([]);
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await bookingApi.cancel(id);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Bookings</h1>
      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>
      )}
      {bookings.length === 0 && !error && (
        <p className="text-gray-600">No bookings yet.</p>
      )}

      {bookings.map((b) => (
        <div key={b.id} className="bg-surface p-4 rounded shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-mono font-bold text-lg">{b.pnr}</p>
              <p className="text-sm text-gray-600">
                {b.flight.flightNumber} · {b.flight.origin.iataCode} →{" "}
                {b.flight.destination.iataCode}
              </p>
              <p className="text-sm text-gray-500">{b.flight.departureTime}</p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${
                b.status === "CANCELLED"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {b.status}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {b.passengers.map((p) => (
              <p key={p.id}>
                {p.name} — Seat {p.seatNumber} — {p.mealPreference}
              </p>
            ))}
          </div>
          {b.status !== "CANCELLED" && (
            <button
              onClick={() => handleCancel(b.id)}
              className="mt-2 text-red-600 hover:underline text-sm"
            >
              Cancel Booking
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
