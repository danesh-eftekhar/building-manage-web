import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  LayoutDashboard, Building2, Home,
  Users, CreditCard, Wrench, LogOut,
} from "lucide-react";

const menuItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "داشبورد" },
  { path: "/buildings", icon: Building2, label: "ساختمان‌ها" },
  { path: "/units", icon: Home, label: "واحدها" },
  { path: "/residents", icon: Users, label: "ساکنین" },
  { path: "/charges", icon: CreditCard, label: "شارژ و مالی" },
  { path: "/maintenance", icon: Wrench, label: "تعمیرات" },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed right-0 top-0" dir="rtl">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🏢</div>
          <div>
            <h2 className="font-bold text-sm">مدیریت ساختمان</h2>
            <p className="text-gray-400 text-xs">{user?.fullName}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition w-full text-sm"
        >
          <LogOut size={18} />
          <span>خروج</span>
        </button>
      </div>
    </div>
  );
}