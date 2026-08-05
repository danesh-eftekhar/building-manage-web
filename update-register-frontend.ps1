# ==================================================================
# update-register-frontend.ps1
# از ریشه پروژه فرانت اجرا کن: C:\Projects\building-manage-web
# ==================================================================

$ErrorActionPreference = "Stop"
function Write-Step($msg) { Write-Host ""; Write-Host "=== $msg ===" -ForegroundColor Cyan }

Write-Step "بکاپ گرفتن"
Copy-Item "src\api\auth.ts" "src\api\auth.ts.bak2" -Force
Copy-Item "src\pages\auth\RegisterPage.tsx" "src\pages\auth\RegisterPage.tsx.bak" -Force

# ------------------------------------------------------------------
# آپدیت auth.ts
# ------------------------------------------------------------------
Write-Step "آپدیت auth.ts"
@'
import api from './axios'

export const authApi = {
  login: (mobile: string, password: string) =>
    api.post('/Auth/login', { mobile, password }),

  verifyLoginOtp: (tempToken: string, code: string) =>
    api.post('/Auth/login/verify-otp', { tempToken, code }),

  register: (data: any) =>
    api.post('/Auth/register', data),

  setupTotp: () =>
    api.post('/Auth/totp/setup'),

  enableTotp: (code: string) =>
    api.post('/Auth/totp/enable', { code }),

  sendOtp: (mobile: string) =>
    api.post('/Auth/otp/send', { mobile }),

  verifyOtp: (mobile: string, code: string) =>
    api.post('/Auth/otp/verify', { mobile, code }),

  refreshToken: (refreshToken: string) =>
    api.post('/Auth/token/refresh', { refreshToken }),
}
'@ | Set-Content "src\api\auth.ts" -Encoding UTF8

# ------------------------------------------------------------------
# RegisterPage.tsx جدید
# ------------------------------------------------------------------
Write-Step "آپدیت RegisterPage.tsx"
@'
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

type Step = "info" | "totp-setup";
const steps = ["اطلاعات", "ورود دو مرحله‌ای"];

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("info");
  const [fullName, setFullName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const currentStep = step === "info" ? 0 : 1;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^09[0-9]{9}$/.test(mobile)) {
      toast.error("شماره موبایل معتبر نیست");
      return;
    }
    if (nationalCode.length !== 10) {
      toast.error("کد ملی باید ۱۰ رقم باشد");
      return;
    }
    if (password.length < 6) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    setLoading(true);
    try {
      // ۱. ثبت‌نام
      await authApi.register({ fullName, mobile, nationalCode, password });

      // ۲. لاگین خودکار (کاربر تازه، هنوز TOTP نداره، پس مستقیم توکن می‌گیریم)
      const loginRes = await authApi.login(mobile, password);
      login(loginRes.data);

      // ۳. ساخت QR برای فعال‌سازی TOTP
      const setupRes = await authApi.setupTotp();
      setQrCodeBase64(setupRes.data.qrCodeBase64);
      setStep("totp-setup");
      toast.success("حساب ساخته شد! حالا ورود دو مرحله‌ای را فعال کنید");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در ثبت نام");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`reg-otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`reg-otp-${index - 1}`)?.focus();
    }
  };

  const handleEnableTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("کد ۶ رقمی را وارد کنید");
      return;
    }
    setLoading(true);
    try {
      await authApi.enableTotp(code);
      toast.success("ورود دو مرحله‌ای فعال شد. خوش آمدید!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "کد اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* سمت چپ — دست‌نخورده */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 120 + 20,
                height: Math.random() * 120 + 20,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
              }} />
          ))}
        </div>
        <div className="relative text-white text-center">
          <div className="text-8xl mb-8">🏢</div>
          <h1 className="text-4xl font-black mb-4">به ما بپیوندید</h1>
          <p className="text-emerald-100 text-lg mb-12">مدیریت هوشمند ساختمان در دستان شما</p>
          <div className="space-y-4">
            {[
              { icon: "✅", text: "ثبت نام رایگان" },
              { icon: "🔐", text: "ورود دو مرحله‌ای امن" },
              { icon: "🔒", text: "امنیت بالا" },
              { icon: "⚡", text: "شروع فوری" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 bg-white bg-opacity-10 rounded-2xl px-6 py-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* سمت راست — فرم */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">

          <div className="lg:hidden text-center mb-8">
            <div className="text-5xl mb-2">🏢</div>
            <h1 className="text-2xl font-black text-gray-800">ثبت نام</h1>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i <= currentStep ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"
                }`}>
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <span className={`mr-2 text-xs ${i <= currentStep ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-1 mx-2 rounded ${i < currentStep ? "bg-emerald-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">

            {step === "info" && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-gray-800">ثبت نام</h2>
                  <p className="text-gray-500 mt-1">اطلاعات خود را تکمیل کنید</p>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">نام و نام خانوادگی *</label>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: علی احمدی"
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-right transition"
                      required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">کد ملی *</label>
                    <input value={nationalCode} onChange={(e) => setNationalCode(e.target.value)}
                      placeholder="۱۰ رقم" maxLength={10}
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-right transition"
                      required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">شماره موبایل *</label>
                    <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)}
                      placeholder="09121234567" maxLength={11}
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-right transition"
                      required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">رمز عبور *</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="حداقل ۶ کاراکتر"
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-right transition"
                      required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">تکرار رمز عبور *</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="تکرار رمز عبور"
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-right transition"
                      required />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-l from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 text-lg mt-4">
                    {loading ? "در حال ثبت نام..." : "ثبت نام"}
                  </button>
                  <p className="text-center text-gray-500 text-sm">
                    قبلاً ثبت نام کردید؟{" "}
                    <Link to="/login" className="text-emerald-600 font-semibold hover:underline">ورود</Link>
                  </p>
                </form>
              </>
            )}

            {step === "totp-setup" && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-gray-800">فعال‌سازی ورود دو مرحله‌ای</h2>
                  <p className="text-gray-500 mt-1">
                    این QR را با اپلیکیشن Google Authenticator اسکن کنید، سپس کد ۶ رقمی را وارد کنید
                  </p>
                </div>

                {qrCodeBase64 && (
                  <div className="flex justify-center mb-6">
                    <img
                      src={`data:image/png;base64,${qrCodeBase64}`}
                      alt="QR Code"
                      className="w-48 h-48 border-2 border-gray-200 rounded-2xl p-2"
                    />
                  </div>
                )}

                <form onSubmit={handleEnableTotp} className="space-y-5">
                  <div className="flex gap-3 justify-center" dir="ltr">
                    {otp.map((digit, index) => (
                      <input key={index} id={`reg-otp-${index}`} type="text" inputMode="numeric"
                        maxLength={1} value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition" />
                    ))}
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-l from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 text-lg">
                    {loading ? "در حال تایید..." : "فعال‌سازی و ورود"}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">© ۱۴۰۵ سیستم مدیریت ساختمان</p>
        </div>
      </div>
    </div>
  );
}
'@ | Set-Content "src\pages\auth\RegisterPage.tsx" -Encoding UTF8

Write-Step "تمام شد"
Write-Host "auth.ts و RegisterPage.tsx آپدیت شدن (بکاپ .bak2 و .bak کنارشون هست)." -ForegroundColor Green
