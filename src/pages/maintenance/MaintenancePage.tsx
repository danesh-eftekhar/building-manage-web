import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import api from "../../api/axios";
import Modal from "../../components/ui/Modal";
import MaintenanceForm from "../../components/maintenance/MaintenanceForm";

export default function MaintenancePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    setLoading(true);
    api.get("/Maintenance", { params: { search, page: 1, pageSize: 20 } }).then((res) => {
      setItems(res.data.items);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [search]);

  const priorityColor = (p: string) => {
    switch (p) {
      case "Critical": return "bg-red-100 text-red-700";
      case "High": return "bg-orange-100 text-orange-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const priorityLabel = (p: string) => {
    switch (p) {
      case "Critical": return "بحرانی";
      case "High": return "بالا";
      case "Medium": return "متوسط";
      case "Low": return "پایین";
      default: return p;
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "Pending": return "در انتظار";
      case "InProgress": return "در حال انجام";
      case "Completed": return "تکمیل شده";
      case "Cancelled": return "لغو شده";
      case "Rejected": return "رد شده";
      default: return s;
    }
  };

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">درخواست‌های تعمیر</h1>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> درخواست جدید
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
        <div className="relative">
          <Search size={18} className="absolute right-3 top-3 text-gray-400" />
          <input type="text" placeholder="جستجو..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pr-10 pl-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b bg-gray-50">
              <th className="text-right px-6 py-3">عنوان</th>
              <th className="text-right px-6 py-3">ساختمان</th>
              <th className="text-right px-6 py-3">واحد</th>
              <th className="text-right px-6 py-3">درخواست دهنده</th>
              <th className="text-right px-6 py-3">اولویت</th>
              <th className="text-right px-6 py-3">وضعیت</th>
              <th className="text-right px-6 py-3">تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">در حال بارگذاری...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">درخواستی ثبت نشده</td></tr>
            ) : items.map((m) => (
              <tr key={m.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{m.title}</td>
                <td className="px-6 py-4">{m.buildingName}</td>
                <td className="px-6 py-4">{m.unitNumber || "عمومی"}</td>
                <td className="px-6 py-4">{m.requestedBy || "-"}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${priorityColor(m.priorityName)}`}>
                    {priorityLabel(m.priorityName)}
                  </span>
                </td>
                <td className="px-6 py-4">{statusLabel(m.statusName)}</td>
                <td className="px-6 py-4">{new Date(m.createdAt).toLocaleDateString("fa-IR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="درخواست تعمیر جدید" size="lg">
        <MaintenanceForm onSuccess={load} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}