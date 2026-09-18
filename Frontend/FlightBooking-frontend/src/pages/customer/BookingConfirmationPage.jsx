import { useLocation, Link, useNavigate } from "react-router-dom";

export default function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};

  if (!booking) {
    navigate("/search", { replace: true });
    return null;
  }

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow space-y-4 text-center">
      <h1 className="text-2xl font-bold text-green-600">Booking Confirmed!</h1>
      <p className="text-gray-600">Your PNR</p>
      <p className="text-4xl font-mono font-bold tracking-widest">
        {booking.pnr}
      </p>
      <p className="text-sm text-gray-500">
        {booking.flight.flightNumber} · {booking.flight.origin.iataCode} →{" "}
        {booking.flight.destination.iataCode}
      </p>
      <Link
        to="/my-bookings"
        className="inline-block text-blue-600 hover:underline"
      >
        View My Bookings
      </Link>
    </div>
  );
}
