import { useAuth } from "../auth/useAuth";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome, {user?.name || user?.email}
      </h1>
      <p className="text-gray-600 mt-2">
        You're logged in as <strong>{user?.role}</strong>. Flight search coming
        in Phase 2.
      </p>
    </div>
  );
}
