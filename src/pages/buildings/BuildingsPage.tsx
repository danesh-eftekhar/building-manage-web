import { useEffect, useState } from "react";
import { buildingsApi } from "../../api/buildings";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Modal from "../../components/ui/Modal";
import BuildingForm from "../../components/buildings/BuildingForm";
import toast from "react-hot-toast";

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const load = () => {
    setLoading(true);
    buildingsApi.getAll({ search, page: 1, pageSize: 20 }).then((res) => {
      setBuildings(res.data.items);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    await buildingsApi.delete(id);
    toast.success("ساختمان حذف شد");
    load();
  };

  const handleEdit = (b: any) => {
    setSelected(b);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelected(null);
    setShowModal(true);
  };

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ساختمان‌ها</h1>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> ساختمان جدید
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
              <th className="text-right px-6 py-3">کد</th>
              <th className="text-right px-6 py-3">شهر</th>
              <th className="text-right px-6 py-3">مدیر</th>
              <th className="text-right px-6 py-3">طبقات</th>
              <th className="text-right px-6 py-3">واحدها</th>
              <th className="text-right px-6 py-3">وضعیت</th>
              <th className="text-right px-6 py-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">در حال بارگذاری...</td></tr>
            ) : buildings.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">ساختمانی یافت نشد</td></tr>
            ) : buildings.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{b.name}</td>
                <td className="px-6 py-4">{b.code}</td>
                <td className="px-6 py-4">{b.city}</td>
                <td className="px-6 py-4">{b.managerName}</td>
                <td className="px-6 py-4">{b.floorsCount}</td>
                <td className="px-6 py-4">{b.unitsCount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${b.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {b.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(b)} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(b.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={selected ? "ویرایش ساختمان" : "ساختمان جدید"} size="xl">
        <BuildingForm building={selected} onSuccess={load} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}