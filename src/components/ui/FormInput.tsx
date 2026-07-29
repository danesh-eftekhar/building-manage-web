interface FormInputProps {
  label: string;
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: any; label: string }[];
  textarea?: boolean;
}

export default function FormInput({
  label, name, value, onChange, type = "text",
  required, placeholder, options, textarea
}: FormInputProps) {
  const baseClass = "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <select name={name} value={value} onChange={onChange} className={baseClass} required={required}>
          <option value="">انتخاب کنید</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : textarea ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder}
          className={baseClass} required={required} rows={3} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder} className={baseClass} required={required} />
      )}
    </div>
  );
}