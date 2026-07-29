import { useEffect, useState } from "react";
import { dashboardApi } from "../../api/dashboard";
import { Building2, Home, Users, CreditCard, TrendingUp, AlertCircle } from "lucide-react";

interface DashboardData {
  totalBuildings: number;
  activeBuildings: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  totalResidents: number;
  activeResidents: number;
  totalCharges: number;
  totalPaid: number;
  totalDebt: number;
  pendingCharges: number;
  overdueCharges: number;
  currentMonthCharges: number;
  currentMonthPayments: number;
  topDebtors: any[];
  recentPayments: any[];
}

const StatCard = ({ icon: Icon, label, value, color, sub }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    <div className="text-gray-500 text-sm mt-1">{label}</div>
    {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.get().then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">در حال بارگذاری...</div>
    </div>
  );

  if (!data) return null;

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">داشبورد</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Building2} label="ساختمان‌ها" value={data.totalBuildings} color="bg-blue-500" sub={`${data.activeBuildings} فعال`} />
        <StatCard icon={Home} label="واحدها" value={data.totalUnits} color="bg-green-500" sub={`${data.vacantUnits} خالی`} />
        <StatCard icon={Users} label="ساکنین" value={data.totalResidents} color="bg-purple-500" sub={`${data.activeResidents} فعال`} />
        <StatCard icon={CreditCard} label="بدهی کل" value={`${data.totalDebt.toLocaleString()} ریال`} color="bg-red-500" sub={`${data.overdueCharges} معوق`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-blue-500" />
            <h2 className="font-bold text-gray-800">ماه جاری</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">شارژ صادر شده</span>
              <span className="font-bold">{data.currentMonthCharges.toLocaleString()} ریال</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">پرداخت دریافتی</span>
              <span className="font-bold text-green-600">{data.currentMonthPayments.toLocaleString()} ریال</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-red-500" />
            <h2 className="font-bold text-gray-800">بدهکاران برتر</h2>
          </div>
          <div className="space-y-2">
            {data.topDebtors.slice(0, 5).map((d, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">{d.residentName} — واحد {d.unitNumber}</span>
                <span className="font-bold text-red-500">{d.totalDebt.toLocaleString()}</span>
              </div>
            ))}
            {data.topDebtors.length === 0 && (
              <p className="text-gray-400 text-sm">بدهکاری وجود ندارد 🎉</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 mb-4">آخرین پرداخت‌ها</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-right py-2">ساختمان</th>
                <th className="text-right py-2">واحد</th>
                <th className="text-right py-2">مبلغ</th>
                <th className="text-right py-2">تاریخ</th>
                <th className="text-right py-2">روش</th>
              </tr>
            </thead>
            <tbody>
              {data.recentPayments.map((p) => (
                <tr key={p.paymentId} className="border-b hover:bg-gray-50">
                  <td className="py-2">{p.buildingName}</td>
                  <td className="py-2">{p.unitNumber}</td>
                  <td className="py-2 font-bold">{p.amount.toLocaleString()}</td>
                  <td className="py-2">{new Date(p.paymentDate).toLocaleDateString("fa-IR")}</td>
                  <td className="py-2">{p.paymentMethod}</td>
                </tr>
              ))}
              {data.recentPayments.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-4">پرداختی ثبت نشده</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}