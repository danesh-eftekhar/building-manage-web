import { useState } from "react";
import api from "../../api/axios";
import FormInput from "../ui/FormInput";
import toast from "react-hot-toast";

interface Props {
  chargeId: string;
  remaining: number;
  onSuccess: () => void;
  onClose: () => void;
}

const paymentMethods = [
  { value: 1, label: "نقدی" }, { value: 2, label: "انتقال بانکی" },
  { value: 3, label: "پرداخت آنلاین" }, { value: 4, label: "چک" },
];

export default function PaymentForm({ chargeId, remaining, onSuccess, onClose }: Props) {
  const [form, setForm] = useState({
    chargeId, amount: remaining, paymentMethod: 1,
    paymentDate: new Date().toISOString().split("T")[0],
    referenceNumber: "", description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/Charges/${chargeId}/payments`, form);
      toast.success("پرداخت ثبت شد");
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
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
        مانده بدهی: <strong>{remaining.toLocaleString()} ریال</strong>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormInput label="مبلغ پرداخت (ریال)" name="amount" type="number" value={form.amount} onChange={handleChange} required />
        <FormInput label="روش پرداخت" name="paymentMethod" value={form.paymentMethod} onChange={handleChange} options={paymentMethods} />
        <FormInput label="تاریخ پرداخت" name="paymentDate" type="date" value={form.paymentDate} onChange={handleChange} required />
        <FormInput label="شماره مرجع" name="referenceNumber" value={form.referenceNumber} onChange={handleChange} />
      </div>
      <FormInput label="توضیحات" name="description" value={form.description} onChange={handleChange} textarea />

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
          {loading ? "در حال ذخیره..." : "ثبت پرداخت"}
        </button>
        <button type="button" onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
          انصراف
        </button>
      </div>
    </form>
  );
}