import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ChevronDown, ChevronLeft, Building2 } from "lucide-react";
import api from "../../api/axios";
import Modal from "../../components/ui/Modal";
import UnitForm from "../../components/units/UnitForm";
import toast from "react-hot-toast";

export default function UnitsPage() {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [units, setUnits] = useState<{ [key: string]: any[] }>({});
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");

  useEffect(() => {
    api.get("/Buildings", { params: { page: 1, pageSize: 100 } }).then((res) => {
      setBuildings(res.data.items);
      setLoading(false);
    });
  }, []);

  const toggleBuilding = async (buildingId: string) => {
    if (expanded[buildingId]) {
      setExpanded((e) => ({ ...e, [buildingId]: false }));
      return;
    }

    if (!units[buildingId]) {
      const res = await api.get("/Units", {
        params: { buildingId, page: 1, pageSize: 100 }
      });
      setUnits((u) => ({ ...u, [buildingId]: res.data.items }));
    }

    setExpanded((e) => ({ ...e, [buildingId]: true }));
  };

  const handleDelete = async (id: string, buildingId: string) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    await api.delete(`/Units/${id}`);
    toast.success("واحد حذف شد");
    const res = await api.get("/Units", { params: { buildingId, page: 1, pageSize: 100 } });
    setUnits((u) => ({ ...u, [buildingId]: res.data.items }));
  };

  const handleAdd = (buildingId: string) => {
    setSelected(null);
    setSelectedBuildingId(buildingId);
    setShowModal(true);
  };

  const handleEdit = (unit: any) => {
    setSelected(unit);
    setSelectedBuildingId(unit.buildingId);
    setShowModal(true);
  };

  const handleSuccess = async () => {
    if (selectedBuildingId) {
      const res = await api.get("/Units", {
        params: { buildingId: selectedBuildingId, page: 1, pageSize: 100 }
      });
      setUnits((u) => ({ ...u, [selectedBuildingId]: res.data.items }));
    }
  };

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">واحدها</h1>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">در حال بارگذاری...</div>
      ) : (
        <div className="space-y-3">
          {buildings.map((b) => (
            <div key={b.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* هدر ساختمان */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => toggleBuilding(b.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{b.name}</h3>
                    <p className="text-xs text-gray-400">{b.city} — {b.floorsCount} طبقه — {b.unitsCount} واحد</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAdd(b.id); }}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700"
                  >
                    <Plus size={14} /> واحد جدید
                  </button>
                  {expanded[b.id]
                    ? <ChevronDown size={20} className="text-gray-400" />
                    : <ChevronLeft size={20} className="text-gray-400" />
                  }
                </div>
              </div>

              {/* لیست واحدها */}
              {expanded[b.id] && (
                <div className="border-t border-gray-100">
                  {!units[b.id] ? (
                    <div className="text-center py-4 text-gray-400">در حال بارگذاری...</div>
                  ) : units[b.id].length === 0 ? (
                    <div className="text-center py-4 text-gray-400">واحدی ثبت نشده</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 bg-gray-50">
                          <th className="text-right px-6 py-2">شماره</th>
                          <th className="text-right px-6 py-2">طبقه</th>
                          <th className="text-right px-6 py-2">متراژ</th>
                          <th className="text-right px-6 py-2">نوع</th>
                          <th className="text-right px-6 py-2">پارکینگ</th>
                          <th className="text-right px-6 py-2">وضعیت</th>
                          <th className="text-right px-6 py-2">عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {units[b.id].map((u) => (
                          <tr key={u.id} className="border-t hover:bg-gray-50">
                            <td className="px-6 py-3 font-medium">واحد {u.unitNumber}</td>
                            <td className="px-6 py-3">طبقه {u.floor}</td>
                            <td className="px-6 py-3">{u.area} m²</td>
                            <td className="px-6 py-3">{u.unitTypeName}</td>
                            <td className="px-6 py-3">
                              {u.hasParking ? "✅" : "❌"}
                            </td>
                            <td className="px-6 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {u.isActive ? "فعال" : "غیرفعال"}
                              </span>
                            </td>
                            <td className="px-6 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => handleEdit(u)} className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                                  <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(u.id, b.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={selected ? "ویرایش واحد" : "واحد جدید"} size="lg">
        <UnitForm unit={selected} buildingId={selectedBuildingId} onSuccess={handleSuccess} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}