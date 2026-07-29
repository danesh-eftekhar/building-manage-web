import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface Props {
  resident?: any;
  onSuccess: () => void;
  onClose: () => void;
}

const residentTypes = [
  { value: 1, label: "مالک" }, { value: 2, label: "مستاجر" },
  { value: 3, label: "عضو خانواده" }, { value: 4, label: "سایر" },
];

export default function ResidentForm({ resident, onSuccess, onClose }: Props) {
  const [buildingId, setBuildingId] = useState(resident?.buildingId || "");
  const [unitId, setUnitId] = useState(resident?.unitId || "");
  const [fullName, setFullName] = useState(resident?.fullName || "");
  const [nationalCode, setNationalCode] = useState(resident?.nationalCode || "");
  const [mobile, setMobile] = useState(resident?.mobile || "");
  const [phone, setPhone] = useState(resident?.phone || "");
  const [email, setEmail] = useState(resident?.email || "");
  const [residentType, setResidentType] = useState(resident?.residentType || 1);
  const [isPrimaryResident, setIsPrimaryResident] = useState(resident?.isPrimaryResident ?? true);
  const [isActive, setIsActive] = useState(resident?.isActive ?? true);
  const [emergencyContact, setEmergencyContact] = useState(resident?.emergencyContact || "");
  const [emergencyPhone, setEmergencyPhone] = useState(resident?.emergencyPhone || "");
  const [description, setDescription] = useState(resident?.description || "");
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    api.get("/Buildings", { params: { page: 1, pageSize: 100 } }).then((res) => {
      setBuildings(res.data.items);
    });
  }, []);

  useEffect(() => {
    if (buildingId) {
      api.get("/Units", { params: { buildingId, page: 1, pageSize: 100 } }).then((res) => {
        setUnits(res.data.items);
      });
    }
  }, [buildingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      buildingId, unitId, fullName, nationalCode, mobile,
      phone, email, residentType: Number(residentType),
      isPrimaryResident, isActive, emergencyContact, emergencyPhone, description,
    };
    try {
      if (resident) {
        await api.put(`/Residents/${resident.id}`, data);
        toast.success("ساکن ویرایش شد");
      } else {
        await api.post("/Residents", data);
        toast.success("ساکن اضافه شد");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در ذخیره");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ساختمان *</label>
          <select value={buildingId} onChange={(e) => setBuildingId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="">انتخاب کنید</option>
            {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">واحد *</label>
          <select value={unitId} onChange={(e) => setUnitId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="">انتخاب کنید</option>
            {units.map((u) => <option key={u.id} value={u.id}>واحد {u.unitNumber}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام و نام خانوادگی *</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">کد ملی *</label>
          <input value={nationalCode} onChange={(e) => setNationalCode(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">موبایل *</label>
          <input value={mobile} onChange={(e) => setMobile(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تلفن</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع ساکن</label>
          <select value={residentType} onChange={(e) => setResidentType(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {residentTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تماس اضطراری</label>
          <input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">موبایل اضطراری</label>
          <input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isPrimaryResident} onChange={(e) => setIsPrimaryResident(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">ساکن اصلی</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">فعال</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {loading ? "در حال ذخیره..." : resident ? "ویرایش" : "افزودن"}
        </button>
        <button type="button" onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
          انصراف
        </button>
      </div>
    </form>
  );
}