import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { flightApi } from "../../api/flightapi";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import ErrorState from "../../components/ui/ErrorState";

function formatDuration(departure, arrival) {
  const mins = Math.round((new Date(arrival) - new Date(departure)) / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function formatTime(iso) {
  return iso?.slice(11, 16);
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function FlightDetailsPage() {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [travelerName, setTravelerName] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    loadFlight();
  }, [flightId]);

  async function loadFlight() {
    setLoading(true);
    setError(null);
    try {
      const response = await flightApi.getById(flightId);
      setFlight(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    if (!travelerName.trim()) {
      setNameError("Please enter your name to continue");
      return;
    }
    navigate(`/flights/${flightId}/seats`, {
      state: { travelerName: travelerName.trim(), flight },
    });
  }

  if (loading) {
    return (
      <div className="space-y-3 max-w-2xl">
        <div className="h-32 bg-paper-200 animate-pulse rounded-[var(--radius-card)]" />
        <div className="h-40 bg-paper-200 animate-pulse rounded-[var(--radius-card)]" />
      </div>
    );
  }

  if (error) return <ErrorState error={error} />;
  if (!flight) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <Link to="/" className="text-sm text-ink-600 hover:text-ink-900">
        &larr; Back to search
      </Link>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-flight text-lg font-semibold text-ink-900">
              {flight.flightNumber}
            </p>
            <p className="text-sm text-ink-400">
              {flight.aircraftType || "Aircraft type unavailable"}
            </p>
          </div>
          <Badge status={flight.status} />
        </div>

        {/* Route visual — same motif as search results and auth panel */}
        <div className="flex items-center gap-4 font-flight py-4">
          <div>
            <p className="text-2xl font-semibold text-ink-900">
              {flight.origin.iataCode}
            </p>
            <p className="text-sm text-ink-600">{flight.origin.city}</p>
            <p className="text-xs text-ink-400">{flight.origin.name}</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <p className="text-xs text-ink-400 mb-1">
              {formatDuration(flight.departureTime, flight.arrivalTime)} ·
              Nonstop
            </p>
            <div className="w-full flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-900" />
              <span className="flex-1 border-t border-dashed border-slate-400" />
              <span className="text-amber-500">✈</span>
              <span className="flex-1 border-t border-dashed border-slate-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-ink-900" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-ink-900">
              {flight.destination.iataCode}
            </p>
            <p className="text-sm text-ink-600">{flight.destination.city}</p>
            <p className="text-xs text-ink-400">{flight.destination.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-300/60 text-sm">
          <div>
            <p className="text-ink-400">Departure</p>
            <p className="font-flight font-medium text-ink-900">
              {formatDate(flight.departureTime)},{" "}
              {formatTime(flight.departureTime)}
            </p>
          </div>
          <div>
            <p className="text-ink-400">Arrival</p>
            <p className="font-flight font-medium text-ink-900">
              {formatDate(flight.arrivalTime)}, {formatTime(flight.arrivalTime)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <p className="text-sm font-medium text-ink-700 mb-3">Fare</p>
        <div className="flex justify-between items-baseline">
          <p className="text-sm text-ink-600">Base fare</p>
          <p className="font-flight text-xl font-semibold text-ink-900">
            ₹{flight.baseFare}
          </p>
        </div>
        <p className="text-xs text-ink-400 mt-1">
          Taxes, GST and airport fees calculated at checkout
        </p>
      </Card>

      <Card className="p-6">
        <p className="text-sm font-medium text-ink-700 mb-1">Cancellation</p>
        <p className="text-sm text-ink-600">
          Free cancellation up to 24 hours before departure.
        </p>
      </Card>

      <Card className="p-6 space-y-3">
        <p className="text-sm font-medium text-ink-700">Who's flying?</p>
        <Input
          label="Full name"
          placeholder="As it appears on your ID"
          value={travelerName}
          onChange={(e) => {
            setTravelerName(e.target.value);
            setNameError("");
          }}
          error={nameError}
        />
        <Button
          variant="accent"
          size="lg"
          className="w-full"
          onClick={handleContinue}
        >
          Continue to seat selection
        </Button>
      </Card>
    </div>
  );
}
