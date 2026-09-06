import { Link, Outlet, useLocation } from "react-router-dom";

const TABS = [
  { path: "/admin/airports", label: "Airports" },
  { path: "/admin/flights", label: "Flights" },
];

export default function AdminDashboard() {
  const location = useLocation();

  return (
    <div>
      <div className="flex gap-4 border-b mb-6">
        {TABS.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`pb-2 px-1 ${
              location.pathname === tab.path
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
