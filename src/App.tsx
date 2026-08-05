import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/auth/LoginPage";
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import BuildingsPage from "./pages/buildings/BuildingsPage";
import UnitsPage from "./pages/units/UnitsPage";
import ResidentsPage from "./pages/residents/ResidentsPage";
import ChargesPage from "./pages/charges/ChargesPage";
import MaintenancePage from "./pages/maintenance/MaintenancePage";
import RegisterPage from "./pages/auth/RegisterPage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="buildings" element={<BuildingsPage />} />
          <Route path="units" element={<UnitsPage />} />
          <Route path="residents" element={<ResidentsPage />} />
          <Route path="charges" element={<ChargesPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}