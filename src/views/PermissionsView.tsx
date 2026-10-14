import React, { useState } from 'react';
import { ROLE_PERMISSIONS, USER_OVERRIDES } from '../data/mockData';
import { UserOverride } from '../types';

interface PermissionsViewProps {
  onTriggerToast: (title: string, desc: string, type?: 'success' | 'error' | 'info') => void;
}

export const PermissionsView: React.FC<PermissionsViewProps> = ({ onTriggerToast }) => {
  const [inheritFromParent, setInheritFromParent] = useState(true);
  const [activeViewMode, setActiveViewMode] = useState<'folder' | 'role'>('folder');
  const [selectedFolder, setSelectedFolder] = useState('ARC-REVIT');
  const [userOverrides, setUserOverrides] = useState<UserOverride[]>(USER_OVERRIDES);
  const [newUserName, setNewUserName] = useState('');
  const [newAccessLevel, setNewAccessLevel] = useState('بارگذاری و ویرایش (WIP)');

  const handleAddOverride = () => {
    if (!newUserName.trim()) {
      onTriggerToast('خطا در ثبت استثنا', 'لطفاً نام یا شناسه کاربر را وارد نمایید.', 'error');
      return;
    }
    const newOverride: UserOverride = {
      id: `u-${Date.now()}`,
      initials: newUserName.slice(0, 2),
      name: newUserName,
      roleTitle: 'کارشناس فنی پروژه • استثنای جدید',
      overrideType: 'بازنویسی اختصاصی (Override)',
      accessLevel: newAccessLevel,
      email: 'user@baran.ir'
    };
    setUserOverrides([...userOverrides, newOverride]);
    setNewUserName('');
    onTriggerToast('استثنای مجوز ثبت شد', `مجوز اختصاصی برای ${newUserName} در پوشه جاری اعمال گردید.`, 'success');
  };

  const handleRemoveOverride = (id: string, name: string) => {
    setUserOverrides(userOverrides.filter((u) => u.id !== id));
    onTriggerToast('حذف استثنا', `استثنای اختصاصی کاربر ${name} حذف شد و به قانون والد بازگشت.`, 'info');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8" dir="rtl">
      {/* Page Header & Action Toolbar Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight font-['Markazi_Text']">
              مدیریت دسترسی و حاکمیت پوشه‌های CDE
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
              <span className="material-symbols-outlined text-xs">verified</span>
              استاندارد ISO 19650
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            کنترل جامع سطوح دسترسی به مخزن اسناد، نقشه‌ها و مدل‌های پروژه برج آلفا (PRJ-1042) بر اساس ساختار استاندارد مخزن داده مشترک.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setInheritFromParent(true);
              onTriggerToast('بازنشانی به وراثت', 'تمامی قوانین زیرشاخه‌ها به قانون وراثت والد بازنشانی شد.', 'info');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            <span>بازنشانی به وراثت پیش‌فرض</span>
          </button>
          <button
            onClick={() => onTriggerToast('خروجی ماتریس ممیزی', 'ماتریس حاکمیت داده‌ها در قالب فایل اکسل صادر گردید.', 'success')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-base">receipt_long</span>
            <span>خروجی ماتریس (Audit)</span>
          </button>
          <button
            onClick={() => onTriggerToast('تغییرات ذخیره شد', 'مجوزهای حاکمیتی با احراز هویت دوعاملی 2FA در سرور ثبت گردید.', 'success')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[#00716B] hover:bg-[#005e59] text-white shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">save</span>
            <span>ذخیره تغییرات مجوزها</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">پوشه‌های فعال در مخزن WBS</span>
            <div className="text-xl font-bold text-slate-900 leading-none font-['Markazi_Text']">۲۴ شاخه استاندارد</div>
            <span className="text-[11px] text-slate-400 mt-1.5 inline-block">۳.۸ گیگابایت حجم محافظت‌شده</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#00716B]/10 text-[#00716B] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">account_tree</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">نقش‌های سازمانی فعال</span>
            <div className="text-xl font-bold text-slate-900 leading-none font-['Markazi_Text']">۷ دیسیپلین مهندسی</div>
            <span className="text-[11px] text-slate-400 mt-1.5 inline-block">معماری، سازه، MEP و نظارت</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">استثنائات و بازنویسی (Override)</span>
            <div className="text-xl font-bold text-amber-700 leading-none font-['Markazi_Text']">
              {userOverrides.length} پروفایل اختصاصی
            </div>
            <span className="text-[11px] text-amber-600 mt-1.5 inline-block">تفکیک صریح از قانون والد</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">tune</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1">انطباق امنیتی و احراز هویت</span>
            <div className="text-xl font-bold text-emerald-700 leading-none font-['Markazi_Text']">۱۰۰٪ (2FA + امضا)</div>
            <span className="text-[11px] text-emerald-600 mt-1.5 inline-block">هش SHA-256 و لاگ بلادرنگ</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
        </div>
      </div>

      {/* Tab View & Quick Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveViewMode('folder')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === 'folder'
                ? 'bg-[#00716B] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">folder</span>
            <span>نمای درختی پوشه‌ها (Folder-Centric)</span>
          </button>
          <button
            onClick={() => setActiveViewMode('role')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === 'role'
                ? 'bg-[#00716B] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">badge</span>
            <span>نمای تفکیک نقش‌ها و اعضا (Role-Centric)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute right-3 top-2 text-slate-400 text-sm">filter_alt</span>
            <input
              type="text"
              placeholder="فیلتر سریع بر اساس دیسیپلین، نام پوشه یا کاربر..."
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pr-8 pl-3 py-1.5 text-slate-800 outline-none focus:border-[#00716B]"
            />
          </div>
        </div>
      </div>

      {/* Main Governance 2-Column Grid */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Right Column in RTL: WBS Folder Structure (5 Cols) */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00716B] text-xl">folder_supervised</span>
              <h2 className="text-base font-bold text-slate-900">ساختار پوشه‌های مخزن (WBS)</h2>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">PRJ-1042</span>
          </div>

          {/* WBS Tree */}
          <div className="space-y-1.5 text-xs font-medium">
            {/* Root DOCUMENT */}
            <div
              onClick={() => setSelectedFolder('DOCUMENT')}
              className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                selectedFolder === 'DOCUMENT' ? 'bg-[#00716B]/10 text-[#00716B] font-bold' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-base">chevron_left</span>
                <span className="material-symbols-outlined text-amber-500 text-lg">folder</span>
                <span className="font-bold">XON-1042-ALF-DOCUMENT</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">عمومی (۶ فایل)</span>
            </div>

            {/* Root IMPORT */}
            <div
              onClick={() => setSelectedFolder('IMPORT')}
              className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                selectedFolder === 'IMPORT' ? 'bg-[#00716B]/10 text-[#00716B] font-bold' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-base">chevron_left</span>
                <span className="material-symbols-outlined text-amber-500 text-lg">folder</span>
                <span className="font-bold">XON-1042-ALF-IMPORT</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">ورودی (۳ سند)</span>
            </div>

            {/* Root PHASE 1 (Expanded) */}
            <div className="space-y-1.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-900 font-bold cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-500 text-base">expand_more</span>
                  <span className="material-symbols-outlined text-amber-600 text-lg">folder_open</span>
                  <span>XON-1042-ALF-PHASE 1</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">فعال اجرایی</span>
              </div>

              {/* Nested PH1-ARC */}
              <div className="mr-4 space-y-1.5 pt-1.5 border-r border-slate-300 pr-2.5">
                <div className="flex items-center justify-between text-slate-800 font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-slate-500 text-sm">expand_more</span>
                    <span className="material-symbols-outlined text-amber-600 text-base">folder_open</span>
                    <span>XON-PH1-ARC (معماری - ۷ زیرشاخه)</span>
                  </div>
                </div>

                <div className="mr-4 space-y-1 pr-2 border-r border-slate-200">
                  <div
                    onClick={() => setSelectedFolder('ARC-3DMAX')}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                      selectedFolder === 'ARC-3DMAX' ? 'bg-[#00716B]/10 text-[#00716B] font-bold' : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-base">folder</span>
                      <span>ARC-3DMAX</span>
                    </div>
                    <span className="text-[10px] text-slate-400">۳۲ فایل</span>
                  </div>

                  <div
                    onClick={() => setSelectedFolder('ARC-CAD')}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                      selectedFolder === 'ARC-CAD' ? 'bg-[#00716B]/10 text-[#00716B] font-bold' : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-base">folder</span>
                      <span>ARC-CAD</span>
                    </div>
                    <span className="text-[10px] text-slate-400">۱۸ فایل</span>
                  </div>

                  {/* ACTIVE / SELECTED FOLDER: ARC-REVIT */}
                  <div
                    onClick={() => setSelectedFolder('ARC-REVIT')}
                    className="bg-[#00716B] text-white rounded-xl p-3 shadow-xs space-y-2 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-300 text-xl">folder_open</span>
                        <span className="font-bold text-sm tracking-wide">ARC-REVIT (مدل‌های رویت)</span>
                      </div>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">پوشه انتخابی</span>
                    </div>
                    <div className="mr-4 space-y-1 text-slate-100 border-r border-white/30 pr-2 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs">folder</span> 3D model
                        </span>
                        <span className="text-[10px] opacity-80">۲.۴ گیگابایت</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs">folder</span> Animation
                        </span>
                        <span className="text-[10px] opacity-80">۱.۴ گیگابایت</span>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedFolder('ARC-Rhino')}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                      selectedFolder === 'ARC-Rhino' ? 'bg-[#00716B]/10 text-[#00716B] font-bold' : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-base">folder</span>
                      <span>ARC-Rhino</span>
                    </div>
                    <span className="text-[10px] text-slate-400">۹ فایل</span>
                  </div>

                  <div
                    onClick={() => setSelectedFolder('ARC-Lumion')}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                      selectedFolder === 'ARC-Lumion' ? 'bg-[#00716B]/10 text-[#00716B] font-bold' : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-base">folder</span>
                      <span>ARC-Lumion</span>
                    </div>
                    <span className="text-[10px] text-slate-400">۵ فایل</span>
                  </div>
                </div>

                {/* Sibling Disciplines */}
                <div
                  onClick={() => setSelectedFolder('STR')}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-base">chevron_left</span>
                    <span className="material-symbols-outlined text-amber-500 text-base">folder</span>
                    <span>XON-PH1-STR (سازه - ۴ پوشه)</span>
                  </div>
                </div>
                <div
                  onClick={() => setSelectedFolder('MEC')}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-base">chevron_left</span>
                    <span className="material-symbols-outlined text-amber-500 text-base">folder</span>
                    <span>XON-PH1-MEC (مکانیک - ۳ پوشه)</span>
                  </div>
                </div>
                <div
                  onClick={() => setSelectedFolder('ELC')}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-base">chevron_left</span>
                    <span className="material-symbols-outlined text-amber-500 text-base">folder</span>
                    <span>XON-PH1-ELC (الکتریکال - ۳ پوشه)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 mt-auto">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="material-symbols-outlined text-sm">route</span>
              <span className="font-medium">مسیر فولدر انتخابی:</span>
            </div>
            <div className="font-mono text-slate-800 font-bold" dir="ltr">
              PRJ-1042 &gt; PHASE 1 &gt; PH1-ARC &gt; {selectedFolder}
            </div>
            <div className="pt-2 flex items-center justify-between text-slate-600 border-t border-slate-200 text-[11px]">
              <span>وضعیت: <strong className="text-amber-700">WIP (کار در جریان)</strong></span>
              <span>حجم کل: ۳.۸ گیگابایت (۲۴ فایل)</span>
              <span className="text-emerald-700 font-bold">وراثت با ۲ بازنویسی</span>
            </div>
          </div>
        </div>

        {/* Left Column in RTL: Permissions & Access Governance (7 Cols) */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Current Folder Governance Top Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-[#00716B]/10 text-[#00716B] font-bold px-2.5 py-0.5 rounded-md">
                    پوشه جاری
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                    XON-PH1-{selectedFolder}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  تنظیم مجوزهای دسترسی برای مدل‌های خام و مستندات مهندسی رویت معماری فاز ۱
                </p>
              </div>

              {/* Inheritance Switch */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800">وراثت از والد (Inherit)</span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    {inheritFromParent ? 'قوانین والد فعال است' : 'استثنائات مستقل'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inheritFromParent}
                    onChange={(e) => {
                      setInheritFromParent(e.target.checked);
                      onTriggerToast(
                        'تغییر حالت وراثت پوشه',
                        e.target.checked ? 'قوانین وراثت از شاخه والد فعال شد.' : 'قوانین پوشه مستقل شد.',
                        'info'
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00716B]"></div>
                </label>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
              💡 قوانین پیش‌فرض والد برای تمامی زیرپوشه‌ها اعمال می‌گردد مگر آنکه به صورت صریح با حالت بازنویسی (Override) تغییر یابد.
            </p>
          </div>

          {/* Section 1: Role-Based Permissions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00716B] text-xl">shield_person</span>
                <h3 className="text-base font-bold text-slate-900">دسترسی نقش‌های سازمانی (Role-Based Permissions)</h3>
              </div>
              <button
                onClick={() => onTriggerToast('افزودن نقش به پوشه', 'پنجره تخصیص نقش به شاخه باز شد.', 'info')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00716B]/10 text-[#00716B] hover:bg-[#00716B]/20 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>افزودن نقش به پوشه</span>
              </button>
            </div>

            {/* Roles List */}
            <div className="space-y-3">
              {ROLE_PERMISSIONS.map((role) => (
                <div
                  key={role.code}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border transition-colors gap-3 ${
                    role.permissionLevel === 'none'
                      ? 'bg-red-50/50 border-red-200'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                        role.permissionLevel === 'full'
                          ? 'bg-emerald-100 text-emerald-800'
                          : role.permissionLevel === 'contributor'
                          ? 'bg-[#00716B]/15 text-[#00716B]'
                          : role.permissionLevel === 'reviewer'
                          ? 'bg-blue-100 text-blue-800'
                          : role.permissionLevel === 'none'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {role.code}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{role.roleName}</h4>
                      <span className="text-[11px] text-slate-500">{role.description}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        role.permissionLevel === 'full'
                          ? 'text-emerald-800 bg-emerald-100/80 border-emerald-300'
                          : role.permissionLevel === 'contributor'
                          ? 'text-[#00716B] bg-[#00716B]/10 border-[#00716B]/20'
                          : role.permissionLevel === 'reviewer'
                          ? 'text-blue-800 bg-blue-50 border-blue-200'
                          : role.permissionLevel === 'none'
                          ? 'text-red-700 bg-red-100 border-red-300'
                          : 'text-slate-700 bg-slate-200/80 border-slate-300'
                      }`}
                    >
                      {role.levelLabel}
                    </span>
                    <button
                      onClick={() => onTriggerToast('تنظیمات نقش', `تنظیمات دسترسی ${role.code} باز شد.`, 'info')}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="تنظیمات بیشتر"
                    >
                      <span className="material-symbols-outlined text-base">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Overrides & Exceptions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-xl">tune</span>
                <h3 className="text-base font-bold text-slate-900">دسترسی اختصاصی اعضا و اشخاص (Overrides &amp; Exceptions)</h3>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                {userOverrides.length} استثنا فعال
              </span>
            </div>

            {/* Add Exception Toolbar */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute right-3 top-2 text-slate-400 text-sm">person_search</span>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="جستجو و انتخاب کاربر (مثلاً: مهندس ر...)"
                  className="w-full bg-white border border-slate-200 text-xs rounded-lg pr-8 pl-3 py-1.5 text-slate-800 outline-none focus:border-[#00716B]"
                />
              </div>

              <select
                value={newAccessLevel}
                onChange={(e) => setNewAccessLevel(e.target.value)}
                className="w-full sm:w-48 bg-white border border-slate-200 text-xs rounded-lg px-2 py-1.5 text-slate-700 outline-none focus:border-[#00716B]"
              >
                <option value="بارگذاری و ویرایش (WIP)">بارگذاری و ویرایش (WIP)</option>
                <option value="فقط مشاهده (Read-only)">فقط مشاهده (Read-only)</option>
                <option value="مدیریت کامل (Owner)">مدیریت کامل (Owner)</option>
                <option value="مسدودسازی صریح (Deny)">مسدودسازی صریح (Deny)</option>
              </select>

              <button
                onClick={handleAddOverride}
                className="w-full sm:w-auto px-4 py-1.5 text-xs font-bold rounded-lg bg-[#00716B] text-white hover:bg-[#005e59] transition-colors whitespace-nowrap cursor-pointer"
              >
                + اعمال استثنا
              </button>
            </div>

            {/* Exceptions List */}
            <div className="space-y-2.5">
              {userOverrides.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#00716B]/15 text-[#00716B] flex items-center justify-center font-bold text-xs">
                      {u.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{u.name}</span>
                        <span className="text-[10px] font-bold bg-[#00716B]/10 text-[#00716B] px-2 py-0.5 rounded">
                          {u.overrideType}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{u.roleTitle} • {u.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {u.accessLevel}
                    </span>
                    {u.overrideType !== 'مالک پوشه' && (
                      <button
                        onClick={() => handleRemoveOverride(u.id, u.name)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="حذف استثنا"
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Audit & Security Verification Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shadow-xs">
        <div className="flex items-center gap-2 text-right">
          <span className="material-symbols-outlined text-emerald-600 text-lg">security</span>
          <span>
            آخرین تغییرات مجوزها توسط <strong className="text-slate-800">مهندس سهراب پارسا</strong> در ۱۴۰۳/۰۸/۲۴ ساعت ۱۰:۱۵ اعمال شد. اعتبارسنجی با احراز هویت دوعاملی (2FA) و امضای SHA-256.
          </span>
        </div>
        <button
          onClick={() => onTriggerToast('مشاهده لاگ ممیزی', 'تاریخچه ممیزی کامل مجوزها (Audit Trail) باز شد.', 'info')}
          className="text-[#00716B] font-bold hover:underline flex items-center gap-1 shrink-0"
        >
          مشاهده لاگ کامل تاریخچه مجوزها (Audit Trail) ←
        </button>
      </div>
    </div>
  );
};
