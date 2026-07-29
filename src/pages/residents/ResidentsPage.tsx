import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import api from "../../api/axios";
import Modal from "../../components/ui/Modal";
import ResidentForm from "../../components/residents/ResidentForm";
import toast from "react-hot-toast";

export default function ResidentsPage() {
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const load = () => {
    setLoading(true);
    api.get("/Residents", { params: { search, page: 1, pageSize: 20 } }).then((res) => {
      setResidents(res.data.items);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    await api.delete(`/Residents/${id}`);
    toast.success("ساکن حذف شد");
    load();
  };

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ساکنین</h1>
        <button onClick={() => { setSelected(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> ساکن جدید
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
              <th className="text-right px-6 py-3">نام</th>
              <th className="text-right px-6 py-3">موبایل</th>
              <th className="text-right px-6 py-3">کد ملی</th>
              <th className="text-right px-6 py-3">ساختمان</th>
              <th className="text-right px-6 py-3">واحد</th>
              <th className="text-right px-6 py-3">نوع</th>
              <th className="text-right px-6 py-3">وضعیت</th>
              <th className="text-right px-6 py-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">در حال بارگذاری...</td></tr>
            ) : residents.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">ساکنی یافت نشد</td></tr>
            ) : residents.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{r.fullName}</td>
                <td className="px-6 py-4">{r.mobile}</td>
                <td className="px-6 py-4">{r.nationalCode}</td>
                <td className="px-6 py-4">{r.buildingName}</td>
                <td className="px-6 py-4">{r.unitNumber}</td>
                <td className="px-6 py-4">{r.residentTypeName}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${r.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {r.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setSelected(r); setShowModal(true); }} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(r.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={selected ? "ویرایش ساکن" : "ساکن جدید"} size="lg">
        <ResidentForm resident={selected} onSuccess={load} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}