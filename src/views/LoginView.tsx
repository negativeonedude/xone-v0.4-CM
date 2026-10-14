import React, { useState, useEffect } from 'react';
import { NavigationTab } from '../types';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onTriggerToast: (title: string, desc: string, type?: 'success' | 'error' | 'info') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigate,
  onTriggerToast
}) => {
  const [activeMethod, setActiveMethod] = useState<'pass' | 'otp'>('pass');
  const [username, setUsername] = useState('BARAN-40293');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(119);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeMethod === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeMethod, countdown]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onTriggerToast('برقراری ارتباط ایمن', 'در حال فراخوانی دسترسی‌های مدیر پروژه در سامانه Xone...', 'info');

    setTimeout(() => {
      setIsLoading(false);
      onTriggerToast('احراز هویت موفق', 'خوش آمدید مهندس گرامی. ورود به کارتابل CDE انجام شد.', 'success');
      onLoginSuccess();
    }, 1200);
  };

  const handleSmartCard = () => {
    onTriggerToast('اسکن توکن سخت‌افزاری', 'لطفاً دانگل USB یا کلید امنیتی اختصاصی خود را متصل فرمایید.', 'info');
    setTimeout(() => {
      onTriggerToast('امضای دیجیتال تایید شد', 'هویت مدیر ارشد با گواهی ریشه هلدینگ باران تصدیق شد.', 'success');
      onLoginSuccess();
    }, 1500);
  };

  const formatCountdown = () => {
    const mins = Math.floor(countdown / 60);
    const secs = countdown % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-8" dir="rtl">
      {/* Blueprint grid background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40 blueprint-grid-bg"></div>

      <div className="relative z-10 w-full max-w-xl mx-auto rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Architectural Brand Banner */}
        <div className="relative h-44 w-full overflow-hidden bg-[#005652]">
          <img
            alt="پروژه برج آلفا هلدینگ باران"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity transform hover:scale-105 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VyZJ-wYwM0jMpUbUAJeD_K1hbzIhcCcErzzS-LSRFMxISnKkGhzpf-5YpNvgPAkitq62gBfXoS2F_mHjHfUjBjDhQ4KOHafIfm4FXHDqUam_cyo51VgI6VE49YaZbkuCqKV4hD58p_cO7oZsmcahPLH34h3QeqBQauhTxNWxdI36AHXf983bVXbFe41KQieZN5aEkFRO1TxcI78BMtHqRAe7G5UsmnONmI_XkWxP6T1i0reCoGxiTfwyM"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#005652] via-[#005652]/75 to-transparent"></div>

          <div className="absolute inset-0 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/15 backdrop-blur text-teal-100 text-xs font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse"></span>
                  پرتال نظارت و ساخت
                </span>
              </div>
              <div className="flex items-center gap-1 text-teal-200/80 text-xs font-mono">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                TLS 256-bit
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Markazi_Text']">
                ورود به سامانه یکپارچه باران
              </h2>
              <p className="text-xs text-teal-200 mt-0.5">توسعه، به سبک باران</p>
            </div>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="p-6 sm:p-8 flex flex-col gap-5">
          {/* Strategy Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveMethod('pass')}
              className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMethod === 'pass'
                  ? 'bg-white text-[#00716B] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">password</span>
              <span>کلمه عبور سازمانی</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMethod('otp');
                setCountdown(119);
              }}
              className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMethod === 'otp'
                  ? 'bg-white text-[#00716B] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">sms</span>
              <span>رمز یکبارمصرف (SMS)</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Username / National code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>{activeMethod === 'pass' ? 'شناسه کاربری / کد سازمانی' : 'شماره تلفن همراه پرسنلی'}</span>
                <span className="text-[10px] text-slate-400 font-normal">کد ۶ الی ۱۰ رقمی</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute right-3 text-slate-400 pointer-events-none">
                  <span className="material-symbols-outlined text-lg">badge</span>
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  dir="ltr"
                  className="w-full h-11 pr-10 pl-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-[#00716B] focus:bg-white transition-all text-left"
                  placeholder={activeMethod === 'pass' ? 'BARAN-40293 یا 0081234567' : '۰۹۱۲۱۲۳۴۵۶۷'}
                  required
                />
              </div>
            </div>

            {/* Password */}
            {activeMethod === 'pass' && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-700">کلمه عبور متمرکز</label>
                  <a href="#" className="text-[#00716B] hover:underline text-[11px]">
                    بازیابی رمز عبور؟
                  </a>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute right-3 text-slate-400 pointer-events-none">
                    <span className="material-symbols-outlined text-lg">lock</span>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                    className="w-full h-11 pr-10 pl-11 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-[#00716B] focus:bg-white transition-all text-left"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* OTP Block */}
            {activeMethod === 'otp' && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-700">کد ۵ رقمی تایید پیامکی</label>
                  <span className="text-[#00716B] font-mono text-[11px] font-bold">
                    {formatCountdown()} مانده تا ارسال مجدد
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute right-3 text-slate-400 pointer-events-none">
                    <span className="material-symbols-outlined text-lg">pin</span>
                  </span>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={5}
                    placeholder="• • • • •"
                    dir="ltr"
                    className="w-full h-11 pr-10 pl-28 rounded-xl bg-slate-50 border border-slate-200 text-sm tracking-[0.4em] text-center text-slate-900 outline-none focus:border-[#00716B] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    disabled={countdown > 0}
                    onClick={() => {
                      setCountdown(119);
                      onTriggerToast('کد جدید ارسال شد', 'کد تایید پیامکی مجدداً برای شماره همراه شما ارسال گردید.', 'info');
                    }}
                    className="absolute left-2 text-xs px-2.5 py-1.5 rounded-lg bg-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    ارسال مجدد
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-[#00716B] accent-[#00716B] cursor-pointer"
                />
                <span>مرا به خاطر بسپار</span>
              </label>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00716B]"></span>
                <span>سامانه مرکزی Xone</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-2 rounded-xl bg-[#00716B] hover:bg-[#005e59] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-75"
            >
              <span className="material-symbols-outlined text-xl">login</span>
              <span>{isLoading ? 'در حال احراز هویت...' : 'ورود به پنل جامع نظارت و ساخت'}</span>
            </button>
          </form>

          {/* Split Divider */}
          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink-0 mx-3 text-xs text-slate-400">یا دسترسی حرفه‌ای ویژه ناظران</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {/* Smart Card Action */}
          <button
            type="button"
            onClick={handleSmartCard}
            className="w-full h-11 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#00716B] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">token</span>
            <span>ورود با توکن سخت‌افزاری و امضای دیجیتال (Smart Card)</span>
          </button>

          {/* Footer Security Strip */}
          <div className="mt-2 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>ارتباط پایدار با پایگاه داده مستغلات</span>
            </div>
            <div className="flex items-center gap-2">
              <span>نسخه سامانه: <b className="font-mono text-slate-700">v2.4 Enterprise</b></span>
              <span>•</span>
              <button onClick={() => onNavigate('dashboard')} className="text-[#00716B] font-bold hover:underline">
                بازگشت به پیشخوان
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
