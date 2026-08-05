import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../../store/authStore";
import { Toaster } from "react-hot-toast";
import { authApi } from "../../api/auth";

export default function MainLayout() {
  const { isAuthenticated, setSubscription } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      authApi.getMySubscription()
        .then((res) => setSubscription(res.data))
        .catch(() => {});
    }
  }, [isAuthenticated]);

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