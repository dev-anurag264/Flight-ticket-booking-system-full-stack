import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/admin/overview", label: "Overview", icon: "◈" },
  { path: "/admin/flights", label: "Flights", icon: "✈" },
  { path: "/admin/airports", label: "Airports", icon: "◎" },
  { path: "/admin/lookup", label: "Flight Lookup", icon: "⌕" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-slate-300/60 bg-surface min-h-[calc(100vh-73px)] py-6">
      <p className="font-flight text-xs text-ink-400 uppercase tracking-widest px-5 mb-3">
        Admin
      </p>
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-amber-500/10 text-ink-900 font-medium border-r-2 border-amber-500"
                  : "text-ink-600 hover:bg-paper-100"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
