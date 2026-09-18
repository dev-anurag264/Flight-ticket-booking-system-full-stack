import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bookingApi } from "../../api/bookingapi";
import { paymentApi } from "../../api/paymentApi";

function paise(amount) {
  return (amount / 100).toFixed(2);
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { seat, flight, passenger, mealPreference } = location.state || {};
  const [error, setError] = useState("");
  const [step, setStep] = useState("booking"); // 'booking' -> 'payment' -> done (navigates away)
  const [booking, setBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!seat) {
    navigate("/search", { replace: true });
    return null;
  }

  // Client-side estimate for display only — the backend's FareCalculator is the source of truth.
  const baseFare = Math.round(flight.baseFare * 100);
  const gst = Math.round(baseFare * 0.18);
  const airportFee = 15000;
  const total = baseFare + gst + airportFee;

  async function handleCreateBooking() {
    setSubmitting(true);
    setError("");
    try {
      const response = await bookingApi.create({
        flightId: flight.id,
        passengers: [
          {
            seatId: seat.id,
            name: passenger.name,
            age: Number(passenger.age),
            gender: passenger.gender,
            mealPreference,
          },
        ],
      });
      setBooking(response.data);
      setStep("payment");
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePay() {
    setSubmitting(true);
    setError("");
    const idempotencyKey = crypto.randomUUID();
    try {
      await paymentApi.pay({ bookingId: booking.id, idempotencyKey });
      navigate("/booking/confirmation", { state: { booking } });
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. You can retry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow space-y-4">
      <h1 className="text-2xl font-bold">
        {step === "booking" ? "Review & Book" : "Payment"}
      </h1>

      <div className="border-t pt-3 space-y-1 text-sm">
        <p>
          <strong>Flight:</strong> {flight?.flightNumber} (
          {flight?.origin.iataCode} → {flight?.destination.iataCode})
        </p>
        <p>
          <strong>Seat:</strong> {seat.seatNumber} ({seat.seatClass})
        </p>
        <p>
          <strong>Passenger:</strong> {passenger?.name}, Age {passenger?.age}
        </p>
        <p>
          <strong>Meal:</strong> {mealPreference}
        </p>
      </div>

      <div className="border-t pt-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Base Fare</span>
          <span>₹{paise(baseFare)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>GST (5%)</span>
          <span>₹{paise(gst)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Airport Fee</span>
          <span>₹{paise(airportFee)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-1">
          <span>Total</span>
          <span>₹{paise(total)}</span>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {step === "booking" ? (
        <button
          onClick={handleCreateBooking}
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Booking..." : "Continue to Payment"}
        </button>
      ) : (
        <button
          onClick={handlePay}
          disabled={submitting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? "Processing Payment..." : "Pay Now (Simulated)"}
        </button>
      )}
    </div>
  );
}
