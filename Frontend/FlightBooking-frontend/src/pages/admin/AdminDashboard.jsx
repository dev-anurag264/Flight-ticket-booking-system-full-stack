import { Outlet } from "react-router-dom";
import ThemeToggle from "../../components/ui/ThemeToggle";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="flex -mx-6 -mt-6">
      {" "}
      {/* cancels MainLayout's default padding for a true full-height sidebar */}
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
