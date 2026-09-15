import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { seatApi } from "../../api/seatApi";

export default function SeatSelectionPage() {
  const { flightId } = useParams(); //flights/:flightId/seats"
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    loadSeats();
  }, [flightId]);

  async function loadSeats() {
    setLoading(true);
    try {
      const response = await seatApi.getSeats(flightId);
      setSeats(response.data);
    } catch (err) {
      setError("Failed to load seats");
    } finally {
      setLoading(false);
    }
  }
  async function handleSeatClick(seat) {
    if (seat.status !== "AVAILABLE" || holding) return;
    setHolding(true);
    setError("");
    try {
      await seatApi.hold(seat.id);
      navigate("/booking/passenger-details", { state: { seat, flightId } });
    } catch (err) {
      setError(
        err.response?.data?.message || "This seat is no longer available",
      );
      loadSeats();
    } finally {
      setHolding(false);
    }
  }

  const statusStyles = {
    AVAILABLE: "bg-white border-gray-300 hover:bg-blue-50 cursor-pointer",
    HELD: "bg-yellow-100 border-yellow-300 cursor-not-allowed opacity-60",
    PAYMENT_PENDING:
      "bg-orange-100 border-orange-300 cursor-not-allowed opacity-60",
    CONFIRMED: "bg-gray-300 border-gray-400 cursor-not-allowed opacity-60",
  };

  if (loading) return <p>Loading seats...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Select Your Seat</h1>
      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>
      )}

      <div className="flex gap-4 text-sm">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-white border border-gray-300 rounded"></span>{" "}
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></span>{" "}
          Held
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-gray-300 border border-gray-400 rounded"></span>{" "}
          Booked
        </span>
      </div>

      <div className="grid grid-cols-6 gap-2 max-w-md">
        {seats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => handleSeatClick(seat)}
            disabled={seat.status !== "AVAILABLE" || holding}
            className={`border rounded p-2 text-sm font-mono ${statusStyles[seat.status]}`}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>
    </div>
  );
}
