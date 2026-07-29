import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../../store/authStore";
import { Toaster } from "react-hot-toast";

export default function MainLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex bg-gray-100 min-h-screen" dir="rtl">
      <Toaster position="top-center" />
      <Sidebar />
      <main className="flex-1 mr-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
