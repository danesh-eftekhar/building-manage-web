import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  LayoutDashboard, Building2, Home, Users,
  CreditCard, Wrench, LogOut, ChevronDown,
  ChevronLeft, BarChart3, Settings, Zap,
  Crown, Bell, MessageSquare, Megaphone,
  Cpu, ShoppingCart, User, Edit
} from "lucide-react";

const menuItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "داشبورد" },
  { path: "/buildings", icon: Building2, label: "بلوک‌ها" },
  { path: "/units", icon: Home, label: "واحدها" },
  { path: "/residents", icon: Users, label: "ساکنین" },
  {
    label: "مالی",
    icon: CreditCard,
    children: [
      { path: "/charges", label: "حساب‌های مالی" },
      { path: "/charge-issue", label: "اعلام شارژ" },
    ]
  },
  {
    label: "عملیات",
    icon: Wrench,
    children: [
      { path: "/maintenance", label: "تعمیرات" },
      { path: "/notifications", label: "اطلاعیه‌ها" },
    ]
  },
  {
    label: "گزارشات",
    icon: BarChart3,
    children: [
      { path: "/reports/financial", label: "گزارش مالی" },
      { path: "/reports/residents", label: "گزارش ساکنین" },
    ]
  },
  {
    label: "امکانات",
    icon: Settings,
    children: [
      { path: "/sms", label: "پیامک‌ها" },
      { path: "/settings", label: "تنظیمات" },
    ]
  },
  { path: "/ai-tools", icon: Cpu, label: "ابزارهای هوشمند" },
  { path: "/chat", icon: MessageSquare, label: "اتاق گفتگو" },
];

export default function Sidebar() {
  const { user, subscription, isPro, logout } = useAuthStore();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white border-l border-gray-200 text-gray-700 flex flex-col h-screen fixed right-0 top-0 shadow-sm" dir="rtl">

      {/* هدر — پروفایل */}
      <div className="relative">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition border-b border-gray-100"
        >
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user?.fullName?.charAt(0) || "م"}
          </div>
          <div className="text-right flex-1">
            <p className="font-bold text-sm text-gray-800 truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-400">{user?.mobile}</p>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </button>

        {/* منوی پروفایل */}
        {showProfile && (
          <div className="absolute top-full right-0 w-full bg-white border border-gray-200 rounded-b-xl shadow-lg z-50">
            <button
              onClick={() => { navigate("/profile"); setShowProfile(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm"
            >
              <Edit size={16} className="text-green-600" />
              <span>ویرایش پروفایل</span>
            </button>
            <button
              onClick={() => { navigate("/my-buildings"); setShowProfile(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm"
            >
              <Building2 size={16} className="text-green-600" />
              <span>ساختمان‌های من</span>
            </button>
            <div className="border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 text-sm"
              >
                <LogOut size={16} />
                <span>خروج</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* منو */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {menuItems.map((item) => {
          if (!item.children) {
            return (
              <NavLink
                key={item.path}
                to={item.path!}
                onClick={() => setShowProfile(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl transition text-sm mb-0.5 ${
                    isActive
                      ? "bg-green-50 text-green-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          }

          const isOpen = openMenus.includes(item.label);

          return (
            <div key={item.label} className="mx-2 mb-0.5">
              <button
                onClick={() => { toggleMenu(item.label); setShowProfile(false); }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </div>
                {isOpen
                  ? <ChevronDown size={16} className="text-gray-400" />
                  : <ChevronLeft size={16} className="text-gray-400" />
                }
              </button>

              {isOpen && (
                <div className="mr-8 mt-1 space-y-0.5 border-r-2 border-green-100 pr-3">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-xs transition ${
                          isActive
                            ? "text-green-700 font-bold"
                            : "text-gray-500 hover:text-gray-800"
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* نوار Free/Pro */}
      <div className="p-3 border-t border-gray-100">
        {isPro ? (
          <div className="bg-gradient-to-l from-yellow-500 to-amber-400 rounded-xl p-3 flex items-center gap-2">
            <Crown size={18} className="text-white" />
            <div>
              <p className="text-white text-xs font-bold">نسخه حرفه‌ای</p>
              <p className="text-yellow-100 text-xs">
                تا {new Date(subscription?.endDate || "").toLocaleDateString("fa-IR")}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3">
            <p className="text-red-600 text-xs mb-2 font-medium">در حال استفاده از نسخه رایگان</p>
            <button
              onClick={() => navigate("/upgrade")}
              className="w-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <ShoppingCart size={14} />
              خرید نسخه حرفه‌ای
            </button>
          </div>
        )}
      </div>
    </div>
  );
}