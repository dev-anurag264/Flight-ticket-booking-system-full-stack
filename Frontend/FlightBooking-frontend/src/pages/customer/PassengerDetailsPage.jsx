import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { flightApi } from "../../api/flightapi";

const MEAL_OPTIONS = [
  {
    value: "NONE",
    label: "No meal",
    description: "Skip in-flight meal service",
  },
  {
    value: "VEG",
    label: "Vegetarian",
    description: "Standard vegetarian meal",
  },
  {
    value: "NON_VEG",
    label: "Non-Vegetarian",
    description: "Standard non-vegetarian meal",
  },
  {
    value: "VEGAN",
    label: "Vegan",
    description: "Plant-based, dairy-free meal",
  },
];

export default function PassengerDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { seat, flightId, travelerName: incomingName } = location.state || {};

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [passenger, setPassenger] = useState({
    name: incomingName || "",
    age: "",
    gender: "MALE",
  });
  const [mealPreference, setMealPreference] = useState("NONE");

  useEffect(() => {
    if (!seat || !flightId) {
      navigate("/search", { replace: true });
      return;
    }
    loadFlight();
  }, [flightId]);

  async function loadFlight() {
    setLoading(true);
    try {
      const response = await flightApi.getById(flightId);
      setFlight(response.data);
    } catch (err) {
      setError("Failed to load flight details");
    } finally {
      setLoading(false);
    }
  }

  function proceedToPayment(selectedMeal) {
    navigate("/booking/payment", {
      state: {
        seat,
        flightId,
        flight,
        passenger,
        mealPreference: selectedMeal,
      },
    });
  }

  function handleContinue(e) {
    e.preventDefault();
    if (!passenger.name || !passenger.age) {
      setError("Please fill in passenger name and age");
      return;
    }
    proceedToPayment(mealPreference);
  }

  function handleSkip() {
    proceedToPayment("NONE");
  }

  if (loading) return <p>Loading...</p>;
  if (error && !flight) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Passenger Details</h1>

      {flight && (
        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <p className="font-bold">{flight.flightNumber}</p>
            <p className="text-sm text-gray-600">
              {flight.origin.iataCode} → {flight.destination.iataCode}
            </p>
            <p className="text-sm text-gray-600">
              {flight.departureTime} — {flight.arrivalTime}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Seat</p>
            <p className="text-xl font-bold font-mono">{seat.seatNumber}</p>
            <p className="text-xs text-gray-500">{seat.seatClass}</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleContinue}
        className="bg-white p-4 rounded shadow space-y-4"
      >
        <h2 className="font-semibold text-gray-800">Passenger</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3">
          <input
            placeholder="Full name"
            value={passenger.name}
            onChange={(e) =>
              setPassenger({ ...passenger, name: e.target.value })
            }
            className="border rounded px-3 py-2 flex-1"
          />
          <input
            type="number"
            placeholder="Age"
            value={passenger.age}
            onChange={(e) =>
              setPassenger({ ...passenger, age: e.target.value })
            }
            className="border rounded px-3 py-2 w-24"
          />
          <select
            value={passenger.gender}
            onChange={(e) =>
              setPassenger({ ...passenger, gender: e.target.value })
            }
            className="border rounded px-3 py-2"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <h2 className="font-semibold text-gray-800 pt-2">Meal Preference</h2>
        <div className="grid grid-cols-2 gap-3">
          {MEAL_OPTIONS.map((meal) => (
            <label
              key={meal.value}
              className={`border rounded p-3 cursor-pointer ${
                mealPreference === meal.value
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="meal"
                value={meal.value}
                checked={mealPreference === meal.value}
                onChange={(e) => setMealPreference(e.target.value)}
                className="mr-2"
              />
              <span className="font-medium">{meal.label}</span>
              <p className="text-xs text-gray-500 ml-5">{meal.description}</p>
            </label>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={handleSkip}
            className="text-gray-600 hover:underline text-sm"
          >
            Skip to Payment →
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
