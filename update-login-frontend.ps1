# ==================================================================
# update-login-frontend.ps1
# این رو از ریشه پروژه فرانت اجرا کن: C:\Projects\building-manage-web
# ==================================================================

$ErrorActionPreference = "Stop"

function Write-Step($msg) { Write-Host ""; Write-Host "=== $msg ===" -ForegroundColor Cyan }

# بکاپ از فایل‌های فعلی
Write-Step "بکاپ گرفتن"
Copy-Item "src\api\auth.ts" "src\api\auth.ts.bak" -Force
Copy-Item "src\pages\auth\LoginPage.tsx" "src\pages\auth\LoginPage.tsx.bak" -Force

# ------------------------------------------------------------------
# آپدیت auth.ts — اضافه شدن verifyLoginOtp
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

  sendOtp: (mobile: string) =>
    api.post('/Auth/otp/send', { mobile }),

  verifyOtp: (mobile: string, code: string) =>
    api.post('/Auth/otp/verify', { mobile, code }),

  refreshToken: (refreshToken: string) =>
    api.post('/Auth/token/refresh', { refreshToken }),
}
'@ | Set-Content "src\api\auth.ts" -Encoding UTF8

# ------------------------------------------------------------------
# آپدیت LoginPage.tsx — مرحله ۲ از "کد پیامکی" به "کد Google Authenticator"
# ------------------------------------------------------------------
Write-Step "آپدیت LoginPage.tsx"
@'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

type Step = "credentials" | "otp";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("credentials");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^09[0-9]{9}$/.test(mobile)) {
      toast.error("شماره موبایل معتبر نیست");
      return;
    }
    if (!password) {
      toast.error("رمز عبور را وارد کنید");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login(mobile, password);
      if (res.data.requiresOtp) {
        setTempToken(res.data.tempToken);
        setStep("otp");
        toast.success("کد Google Authenticator را وارد کنید");
      } else {
        login(res.data);
        toast.success("خوش آمدید!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "موبایل یا رمز عبور اشتباه است");
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
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("کد ۶ رقمی را وارد کنید");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.verifyLoginOtp(tempToken, code);
      login(res.data);
      toast.success("خوش آمدید!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "کد اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* سمت چپ — تصویر (دست‌نخورده) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 100 + 20,
                height: Math.random() * 100 + 20,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
              }} />
          ))}
        </div>
        <div className="relative text-white text-center">
          <div className="text-8xl mb-8">🏢</div>
          <h1 className="text-4xl font-black mb-4">مدیریت ساختمان</h1>
          <p className="text-blue-200 text-lg">سیستم جامع مدیریت آپارتمان و مجتمع‌های مسکونی</p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[
              { icon: "🏗️", label: "ساختمان‌ها" },
              { icon: "🏠", label: "واحدها" },
              { icon: "👥", label: "ساکنین" },
            ].map((item) => (
              <div key={item.label} className="bg-white bg-opacity-10 rounded-2xl p-4">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-sm text-blue-200">{item.label}</div>
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
            <h1 className="text-2xl font-black text-gray-800">مدیریت ساختمان</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">

            {step === "credentials" ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-gray-800">ورود به سیستم</h2>
                  <p className="text-gray-500 mt-2">شماره موبایل و رمز عبور خود را وارد کنید</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      شماره موبایل
                    </label>
                    <div className="relative">
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">📱</span>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="09121234567"
                        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 pr-12 focus:outline-none focus:border-blue-500 text-right text-lg transition"
                        required
                        maxLength={11}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رمز عبور
                    </label>
                    <div className="relative">
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔒</span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="رمز عبور"
                        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 pr-12 focus:outline-none focus:border-blue-500 text-right text-lg transition"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50 text-lg"
                  >
                    {loading ? "در حال بررسی..." : "ورود"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <button onClick={() => setStep("credentials")} className="text-blue-600 text-sm mb-4 flex items-center gap-1">
                    ← بازگشت
                  </button>
                  <h2 className="text-2xl font-black text-gray-800">تایید دو مرحله‌ای</h2>
                  <p className="text-gray-500 mt-2">
                    کد ۶ رقمی از اپلیکیشن Google Authenticator را وارد کنید
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="flex gap-3 justify-center" dir="ltr">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50 text-lg"
                  >
                    {loading ? "در حال تایید..." : "ورود به سیستم"}
                  </button>
                </form>
              </>
            )}

          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            © ۱۴۰۵ سیستم مدیریت ساختمان
          </p>
        </div>
      </div>
    </div>
  );
}
'@ | Set-Content "src\pages\auth\LoginPage.tsx" -Encoding UTF8

Write-Step "تمام شد"
Write-Host "دو فایل آپدیت شدن (بکاپ .bak کنارشون هست)." -ForegroundColor Green
Write-Host "حالا dev server رو ری‌استارت کن (اگه در حال اجراست، معمولا خودش hot-reload می‌کنه):"
Write-Host "  npm run dev"
