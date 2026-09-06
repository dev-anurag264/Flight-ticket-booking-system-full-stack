import { useAuth } from "../auth/useAuth";
import { useNavigate, Link } from "react-router-dom";
export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <span className="text-xl font-bold text-blue-600">
          Flight-Booking-Portal
        </span>
        <div className="flex items-center gap-4">
          <Link
            to="/search"
            className="text-sm text-gray-700 hover:text-blue-600"
          >
            Search Flights
          </Link>
          {user?.role === "ADMIN" && (
            <Link
              to="/admin/airports"
              className="text-sm text-gray-700 hover:text-blue-600"
            >
              Admin
            </Link>
          )}
          <span className="text-sm text-gray-600">
            {user?.email} <span className="text-gray-400">({user?.role})</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
