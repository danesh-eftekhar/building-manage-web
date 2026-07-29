import { useState } from "react";
import { buildingsApi } from "../../api/buildings";
import FormInput from "../ui/FormInput";
import toast from "react-hot-toast";

interface Props {
  building?: any;
  onSuccess: () => void;
  onClose: () => void;
}

const initialState = {
  name: "", code: "", province: "", city: "", address: "",
  postalCode: "", phone: "", managerName: "", managerMobile: "",
  floorsCount: 1, unitsCount: 1, parkingCount: 0, storageCount: 0,
  constructionYear: 1400, hasElevator: false, hasLobby: false,
  hasGarden: false, hasGym: false, hasPool: false, description: "",
  isActive: true, autoCreateUnits: true, unitsPerFloor: 4, defaultUnitArea: 100,
};

export default function BuildingForm({ building, onSuccess, onClose }: Props) {
  const [form, setForm] = useState(building || initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((f: any) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (building) {
        await buildingsApi.update(building.id, form);
        toast.success("ساختمان ویرایش شد");
      } else {
        await buildingsApi.create(form);
        toast.success("ساختمان اضافه شد");
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
        <FormInput label="نام ساختمان" name="name" value={form.name} onChange={handleChange} required />
        <FormInput label="کد" name="code" value={form.code} onChange={handleChange} required />
        <FormInput label="استان" name="province" value={form.province} onChange={handleChange} required />
        <FormInput label="شهر" name="city" value={form.city} onChange={handleChange} required />
        <FormInput label="کد پستی" name="postalCode" value={form.postalCode} onChange={handleChange} />
        <FormInput label="تلفن" name="phone" value={form.phone} onChange={handleChange} />
        <FormInput label="نام مدیر" name="managerName" value={form.managerName} onChange={handleChange} required />
        <FormInput label="موبایل مدیر" name="managerMobile" value={form.managerMobile} onChange={handleChange} required />
        <FormInput label="تعداد طبقات" name="floorsCount" type="number" value={form.floorsCount} onChange={handleChange} required />
        <FormInput label="تعداد واحد" name="unitsCount" type="number" value={form.unitsCount} onChange={handleChange} required />
        <FormInput label="پارکینگ" name="parkingCount" type="number" value={form.parkingCount} onChange={handleChange} />
        <FormInput label="انباری" name="storageCount" type="number" value={form.storageCount} onChange={handleChange} />
        <FormInput label="سال ساخت" name="constructionYear" type="number" value={form.constructionYear} onChange={handleChange} />
        <FormInput label="واحد در هر طبقه" name="unitsPerFloor" type="number" value={form.unitsPerFloor || 4} onChange={handleChange} />
        <FormInput label="متراژ پیش‌فرض واحد" name="defaultUnitArea" type="number" value={form.defaultUnitArea || 100} onChange={handleChange} />
      </div>

      <FormInput label="آدرس" name="address" value={form.address} onChange={handleChange} textarea required />
      <FormInput label="توضیحات" name="description" value={form.description} onChange={handleChange} textarea />

      <div className="grid grid-cols-3 gap-3">
  {[
    { name: "hasElevator", label: "آسانسور" },
    { name: "hasLobby", label: "لابی" },
    { name: "hasGarden", label: "باغ" },
    { name: "hasGym", label: "سالن ورزش" },
    { name: "hasPool", label: "استخر" },
    { name: "autoCreateUnits", label: "ساخت خودکار واحدها" },
  ].map((item) => (
    <label key={item.name} className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleChange} className="w-4 h-4" />
      <span className="text-sm">{item.label}</span>
    </label>
  ))}
</div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {loading ? "در حال ذخیره..." : building ? "ویرایش" : "افزودن"}
        </button>
        <button type="button" onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
          انصراف
        </button>
      </div>
    </form>
  );
}