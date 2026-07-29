import { useState, useEffect } from "react";
import api from "../../api/axios";
import FormInput from "../ui/FormInput";
import toast from "react-hot-toast";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

const priorities = [
  { value: 1, label: "پایین" }, { value: 2, label: "متوسط" },
  { value: 3, label: "بالا" }, { value: 4, label: "بحرانی" },
];

export default function MaintenanceForm({ onSuccess, onClose }: Props) {
  const [form, setForm] = useState({
    buildingId: "", unitId: "", title: "", description: "",
    priority: 2, requestedBy: "", requestedByMobile: "", estimatedCost: 0,
  });
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    api.get("/Buildings", { params: { page: 1, pageSize: 100 } }).then((res) => {
      setBuildings(res.data.items);
    });
  }, []);

  useEffect(() => {
    if (form.buildingId) {
      api.get("/Units", { params: { buildingId: form.buildingId, page: 1, pageSize: 100 } }).then((res) => {
        setUnits(res.data.items);
      });
    }
  }, [form.buildingId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: ["priority", "estimatedCost"].includes(name) ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/Maintenance", form);
      toast.success("درخواست ثبت شد");
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
        <FormInput label="ساختمان" name="buildingId" value={form.buildingId} onChange={handleChange} required
          options={buildings.map((b) => ({ value: b.id, label: b.name }))} />
        <FormInput label="واحد" name="unitId" value={form.unitId} onChange={handleChange}
          options={[{ value: "", label: "عمومی (بدون واحد)" }, ...units.map((u) => ({ value: u.id, label: `واحد ${u.unitNumber}` }))]} />
        <FormInput label="عنوان" name="title" value={form.title} onChange={handleChange} required />
        <FormInput label="اولویت" name="priority" value={form.priority} onChange={handleChange} options={priorities} />
        <FormInput label="درخواست دهنده" name="requestedBy" value={form.requestedBy} onChange={handleChange} />
        <FormInput label="موبایل درخواست دهنده" name="requestedByMobile" value={form.requestedByMobile} onChange={handleChange} />
        <FormInput label="هزینه تخمینی (ریال)" name="estimatedCost" type="number" value={form.estimatedCost} onChange={handleChange} />
      </div>
      <FormInput label="توضیحات" name="description" value={form.description} onChange={handleChange} textarea required />

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {loading ? "در حال ذخیره..." : "ثبت درخواست"}
        </button>
        <button type="button" onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
          انصراف
        </button>
      </div>
    </form>
  );
}