import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentPlaceholderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { seat, flight, passenger, mealPreference } = location.state || {};

  if (!seat) {
    navigate("/search", { replace: true });
    return null;
  }

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow space-y-3">
      <h1 className="text-2xl font-bold">Booking Summary</h1>
      <p className="text-gray-600 text-sm">
        Payment and booking confirmation aren't built yet — this page confirms
        what we've collected so far.
      </p>
      <div className="border-t pt-3 space-y-1 text-sm">
        <p>
          <strong>Flight:</strong> {flight?.flightNumber} (
          {flight?.origin.iataCode} → {flight?.destination.iataCode})
        </p>
        <p>
          <strong>Seat:</strong> {seat.seatNumber} ({seat.seatClass})
        </p>
        <p>
          <strong>Passenger:</strong> {passenger?.name || "—"}, Age{" "}
          {passenger?.age || "—"}
        </p>
        <p>
          <strong>Meal:</strong> {mealPreference}
        </p>
        <p>
          <strong>Fare:</strong> ₹{flight?.baseFare}
        </p>
      </div>
    </div>
  );
}
