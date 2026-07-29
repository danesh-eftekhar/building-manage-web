import { useState, useEffect } from "react";
import api from "../../api/axios";
import FormInput from "../ui/FormInput";
import toast from "react-hot-toast";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

const chargeTypes = [
  { value: 1, label: "شارژ ماهانه" }, { value: 2, label: "شارژ ویژه" },
  { value: 3, label: "تعمیرات" }, { value: 4, label: "جریمه" },
  { value: 5, label: "آب" }, { value: 6, label: "برق" },
  { value: 7, label: "گاز" }, { value: 9, label: "نظافت" },
  { value: 10, label: "نگهبانی" }, { value: 100, label: "سایر" },
];

const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `ماه ${i + 1}` }));
const years = Array.from({ length: 5 }, (_, i) => ({ value: 1402 + i, label: `${1402 + i}` }));

export default function ChargeForm({ onSuccess, onClose }: Props) {
  const [form, setForm] = useState({
    buildingId: "", unitId: "", chargeType: 1, title: "",
    amount: 0, year: 1403, month: 1,
    dueDate: new Date().toISOString().split("T")[0], description: "",
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
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/Charges", form);
      toast.success("شارژ ثبت شد");
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
        <FormInput label="واحد" name="unitId" value={form.unitId} onChange={handleChange} required
          options={units.map((u) => ({ value: u.id, label: `واحد ${u.unitNumber}` }))} />
        <FormInput label="نوع شارژ" name="chargeType" value={form.chargeType} onChange={handleChange} options={chargeTypes} />
        <FormInput label="عنوان" name="title" value={form.title} onChange={handleChange} required />
        <FormInput label="مبلغ (ریال)" name="amount" type="number" value={form.amount} onChange={handleChange} required />
        <FormInput label="سررسید" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required />
        <FormInput label="سال" name="year" value={form.year} onChange={handleChange} options={years} />
        <FormInput label="ماه" name="month" value={form.month} onChange={handleChange} options={months} />
      </div>
      <FormInput label="توضیحات" name="description" value={form.description} onChange={handleChange} textarea />

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {loading ? "در حال ذخیره..." : "ثبت شارژ"}
        </button>
        <button type="button" onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
          انصراف
        </button>
      </div>
    </form>
  );
}