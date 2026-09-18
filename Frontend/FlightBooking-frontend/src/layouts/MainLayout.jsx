import { useAuth } from "../auth/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function MainLayout({ children }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper-50">
      <nav className="bg-surface border-b border-slate-300/60 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="font-flight text-lg font-semibold text-ink-900">
          EaseFly
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link
                to="/my-bookings"
                className="text-ink-600 hover:text-ink-900"
              >
                My Bookings
              </Link>

              {user?.role === "ADMIN" && (
                <Link
                  to="/admin/airports"
                  className="text-ink-600 hover:text-ink-900"
                >
                  Admin
                </Link>
              )}

              <span className="text-ink-400">{user?.email}</span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-ink-600 hover:text-ink-900">
                Log in
              </Link>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">{children}</main>
    </div>
  );
}
