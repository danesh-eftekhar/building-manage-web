import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface Props {
  unit?: any;
  buildingId?: string;
  onSuccess: () => void;
  onClose: () => void;
}

const unitTypes = [
  { value: 1, label: "مسکونی" }, { value: 2, label: "تجاری" },
  { value: 3, label: "اداری" }, { value: 4, label: "انباری" },
  { value: 5, label: "پارکینگ" }, { value: 7, label: "پنت‌هاوس" },
];

export default function UnitForm({ unit, buildingId, onSuccess, onClose }: Props) {
  const [selBuildingId, setSelBuildingId] = useState(unit?.buildingId || buildingId || "");
  const [unitNumber, setUnitNumber] = useState(unit?.unitNumber || "");
  const [block, setBlock] = useState(unit?.block || "");
  const [floor, setFloor] = useState(unit?.floor || 0);
  const [unitType, setUnitType] = useState(unit?.unitType || 1);
  const [area, setArea] = useState(unit?.area || 100);
  const [roomsCount, setRoomsCount] = useState(unit?.roomsCount || 2);
  const [bathroomsCount, setBathroomsCount] = useState(unit?.bathroomsCount || 1);
  const [hasParking, setHasParking] = useState(unit?.hasParking || false);
  const [hasStorage, setHasStorage] = useState(unit?.hasStorage || false);
  const [hasBalcony, setHasBalcony] = useState(unit?.hasBalcony || false);
  const [hasGasMeter, setHasGasMeter] = useState(unit?.hasGasMeter || false);
  const [hasWaterMeter, setHasWaterMeter] = useState(unit?.hasWaterMeter || false);
  const [hasElectricityMeter, setHasElectricityMeter] = useState(unit?.hasElectricityMeter || false);
  const [isResidential, setIsResidential] = useState(unit?.isResidential ?? true);
  const [isActive, setIsActive] = useState(unit?.isActive ?? true);
  const [description, setDescription] = useState(unit?.description || "");
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<any[]>([]);

  useEffect(() => {
    api.get("/Buildings", { params: { page: 1, pageSize: 100 } }).then((res) => {
      setBuildings(res.data.items);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      buildingId: selBuildingId, unitNumber, block,
      floor: Number(floor), unitType: Number(unitType),
      area: Number(area), roomsCount: Number(roomsCount),
      bathroomsCount: Number(bathroomsCount),
      hasParking, hasStorage, hasBalcony,
      hasGasMeter, hasWaterMeter, hasElectricityMeter,
      isResidential, isActive, description,
    };
    try {
      if (unit) {
        await api.put(`/Units/${unit.id}`, data);
        toast.success("واحد ویرایش شد");
      } else {
        await api.post("/Units", data);
        toast.success("واحد اضافه شد");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در ذخیره");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ساختمان *</label>
          <select value={selBuildingId} onChange={(e) => setSelBuildingId(e.target.value)} className={inputClass} required>
            <option value="">انتخاب کنید</option>
            {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">شماره واحد *</label>
          <input value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">بلوک</label>
          <input value={block} onChange={(e) => setBlock(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">طبقه *</label>
          <input type="number" value={floor} onChange={(e) => setFloor(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع واحد</label>
          <select value={unitType} onChange={(e) => setUnitType(e.target.value)} className={inputClass}>
            {unitTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">متراژ *</label>
          <input type="number" value={area} onChange={(e) => setArea(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تعداد اتاق</label>
          <input type="number" value={roomsCount} onChange={(e) => setRoomsCount(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تعداد سرویس</label>
          <input type="number" value={bathroomsCount} onChange={(e) => setBathroomsCount(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { val: hasParking, set: setHasParking, label: "پارکینگ" },
          { val: hasStorage, set: setHasStorage, label: "انباری" },
          { val: hasBalcony, set: setHasBalcony, label: "بالکن" },
          { val: hasGasMeter, set: setHasGasMeter, label: "کنتور گاز" },
          { val: hasWaterMeter, set: setHasWaterMeter, label: "کنتور آب" },
          { val: hasElectricityMeter, set: setHasElectricityMeter, label: "کنتور برق" },
          { val: isResidential, set: setIsResidential, label: "مسکونی" },
          { val: isActive, set: setIsActive, label: "فعال" },
        ].map((item) => (
          <label key={item.label} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={item.val} onChange={(e) => item.set(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">{item.label}</span>
          </label>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} rows={3} />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {loading ? "در حال ذخیره..." : unit ? "ویرایش" : "افزودن"}
        </button>
        <button type="button" onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
          انصراف
        </button>
      </div>
    </form>
  );
}