import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import api from "../../api/axios";
import Modal from "../../components/ui/Modal";
import ChargeForm from "../../components/charges/ChargeForm";
import PaymentForm from "../../components/charges/PaymentForm";

export default function ChargesPage() {
  const [charges, setCharges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<any>(null);

  const load = () => {
    setLoading(true);
    api.get("/Charges", { params: { page: 1, pageSize: 20 } }).then((res) => {
      setCharges(res.data.items);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const statusColor = (s: string) => {
    switch (s) {
      case "Paid": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Overdue": return "bg-red-100 text-red-700";
      case "PartiallyPaid": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "Paid": return "پرداخت شده";
      case "Pending": return "در انتظار";
      case "Overdue": return "معوق";
      case "PartiallyPaid": return "ناقص";
      case "Cancelled": return "لغو";
      default: return s;
    }
  };

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">شارژ و مالی</h1>
        <button onClick={() => setShowChargeModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> شارژ جدید
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b bg-gray-50">
              <th className="text-right px-6 py-3">عنوان</th>
              <th className="text-right px-6 py-3">ساختمان</th>
              <th className="text-right px-6 py-3">واحد</th>
              <th className="text-right px-6 py-3">مبلغ</th>
              <th className="text-right px-6 py-3">پرداخت شده</th>
              <th className="text-right px-6 py-3">مانده</th>
              <th className="text-right px-6 py-3">سررسید</th>
              <th className="text-right px-6 py-3">وضعیت</th>
              <th className="text-right px-6 py-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-8 text-gray-400">در حال بارگذاری...</td></tr>
            ) : charges.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8 text-gray-400">شارژی ثبت نشده</td></tr>
            ) : charges.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{c.title}</td>
                <td className="px-6 py-4">{c.buildingName}</td>
                <td className="px-6 py-4">{c.unitNumber}</td>
                <td className="px-6 py-4">{c.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-green-600">{c.paidAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-red-500">{c.remainingAmount.toLocaleString()}</td>
                <td className="px-6 py-4">{new Date(c.dueDate).toLocaleDateString("fa-IR")}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColor(c.statusName)}`}>
                    {statusLabel(c.statusName)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {c.statusName !== "Paid" && (
                    <button onClick={() => { setSelectedCharge(c); setShowPaymentModal(true); }}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600">
                      ثبت پرداخت
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showChargeModal} onClose={() => setShowChargeModal(false)} title="شارژ جدید" size="lg">
        <ChargeForm onSuccess={load} onClose={() => setShowChargeModal(false)} />
      </Modal>

      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="ثبت پرداخت" size="md">
        {selectedCharge && (
          <PaymentForm chargeId={selectedCharge.id} remaining={selectedCharge.remainingAmount}
            onSuccess={load} onClose={() => setShowPaymentModal(false)} />
        )}
      </Modal>
    </div>
  );
}