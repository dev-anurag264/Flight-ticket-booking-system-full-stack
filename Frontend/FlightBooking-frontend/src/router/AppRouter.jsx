import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import FlightSearchPage from "../pages/customer/FlightSearchPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageAirports from "../pages/admin/ManageAirports";
import ManageFlights from "../pages/admin/ManageFlights";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FlightSearchPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        >
          <Route path="airports" element={<ManageAirports />} />
          <Route path="flights" element={<ManageFlights />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
