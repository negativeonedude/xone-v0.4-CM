import React, { useState } from 'react';
import { CdeDocument } from '../types';
import { useDissolve } from '../hooks/useDissolve';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentCreated: (doc: CdeDocument) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentCreated
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 Matrix Fields
  const [phase, setPhase] = useState('PH2');
  const [discipline, setDiscipline] = useState('ELC');
  const [subjectCode, setSubjectCode] = useState('QS-PAY');
  const [level, setLevel] = useState('TWR-ALL');
  const [selectedFolder, setSelectedFolder] = useState('صورت‌وضعیت‌ها و امور مالی (IPC / Claims)');

  // Step 2 Form Fields
  const [fileName, setFileName] = useState('Interim_Payment_ELC_Rev01.xlsx');
  const [amount, setAmount] = useState('۴۸,۲۵۰,۰۰۰,۰۰۰');
  const [progress, setProgress] = useState('۴۳.۸');
  const [periodNumber, setPeriodNumber] = useState('شماره ۵ (دوره میان‌دوره‌ای زمستان)');
  const [startDate, setStartDate] = useState('۰۱ دی ۱۴۰۳');
  const [endDate, setEndDate] = useState('۳۰ دی ۱۴۰۳');
  const [complianceChecked, setComplianceChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { visible, closing } = useDissolve(isOpen);

  if (!visible) return null;

  // Live ISO Code Generator
  const generatedIsoCode = `ALF-${phase}-${discipline}-${subjectCode}-2025-02-18-Rev02`;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newDoc: CdeDocument = {
        id: `doc-${Date.now()}`,
        isoCode: generatedIsoCode,
        title: `صورت‌وضعیت شماره ۵: تاسیسات الکتریکی (${discipline})`,
        format: 'XLSX',
        discipline: discipline === 'ELC' ? 'تاسیسات الکتریکی' : discipline === 'MEC' ? 'تاسیسات مکانیکی' : 'سازه',
        author: 'مشاور فنی برق باران',
        authorRole: 'پیمانکار دیسیپلین',
        revision: 'Rev 02',
        date: 'امروز، چند لحظه پیش',
        size: '۱۴.۲ مگابایت',
        status: 'pending',
        statusLabel: 'در انتظار تایید مدیر طراحی',
        suitabilityCode: 'S2 (جهت بررسی)',
        folderPath: `PRJ-1042 / ${selectedFolder}`
      };
      onDocumentCreated(newDoc);
      setIsSubmitting(false);
      onClose();
      setStep(1);
    }, 1000);
  };

  return (
    <div
      className={`fixed inset-0 z-[150] bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 overflow-y-auto ${closing ? 'animate-backdrop-dissolve-out' : 'animate-backdrop-dissolve'}`}
      data-lenis-prevent
      dir="rtl"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden my-auto ${closing ? 'animate-modal-dissolve-out' : 'animate-modal-dissolve'} flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Stepper */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00716B]/10 text-[#00716B] flex items-center justify-center text-lg font-bold">
              <span className="material-symbols-outlined text-2xl">
                {step === 1 ? 'account_tree' : 'cloud_upload'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  بارگذاری و ثبت سند جدید در محیط داده مشترک (CDE)
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00716B]/10 text-[#00716B] font-medium border border-[#00716B]/20">
                  ISO 19650
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 1
                    ? 'bg-[#00716B] text-white shadow-xs'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {step === 2 ? '✓' : '۱'}
              </span>
              <span className={`text-xs font-bold ${step === 1 ? 'text-[#00716B]' : 'text-emerald-700'}`}>
                تعیین مسیر و نام‌گذاری
              </span>
            </button>
            <div className={`w-8 h-[2px] ${step === 2 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 2
                    ? 'bg-[#00716B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 border border-slate-300'
                }`}
              >
                ۲
              </span>
              <span
                className={`text-xs font-bold ${
                  step === 2 ? 'text-[#00716B]' : 'text-slate-500'
                }`}
              >
                بارگذاری فایل و شاخص‌ها
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* STEP 1: PATH & NAMING MATRIX */}
        {step === 1 && (
          <div className="p-6 md:p-8 space-y-6">
            {/* Governance Info Banner */}
            <div className="p-3.5 bg-teal-50/70 border border-teal-200/70 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00716B] text-lg">verified_user</span>
                <span>
                  <strong>مسیر انتشار و حاکمیت CDE:</strong> نیازمند بررسی و تایید مدیر ارشد طراحی (مهندس سهراب پارسا) پیش از انتشار رسمی در دروازه Shared.
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#00716B] font-bold bg-white px-2.5 py-1 rounded-lg border border-teal-200 shadow-2xs whitespace-nowrap">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>مهلت اقدام (SLA): ۴۸ ساعت</span>
              </div>
            </div>

            {/* 2-Column Matrix Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Right Column: Destination Folder Selection */}
              <div className="lg:col-span-5 bg-slate-50/70 rounded-xl p-5 border border-slate-200/90 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00716B] text-lg">account_tree</span>
                      پوشه مقصد در ساختار درختی CDE
                    </span>
                  </div>

                  {/* Folder Structure */}
                  <div className="bg-white rounded-lg p-3.5 border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="material-symbols-outlined text-amber-500 text-base">folder</span>
                      <span>پروژه برج تجاری-مسکونی آلفا (PRJ-1042)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 mr-3">
                      <span className="material-symbols-outlined text-slate-300 text-xs">subdirectory_arrow_left</span>
                      <span className="material-symbols-outlined text-amber-500 text-base">folder</span>
                      <span>فاز ۲ (توسعه کارگاهی و نقشه‌های اجرایی)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 mr-6">
                      <span className="material-symbols-outlined text-slate-300 text-xs">subdirectory_arrow_left</span>
                      <span className="material-symbols-outlined text-amber-500 text-base">folder</span>
                      <span>دیسیپلین تاسیسات الکتریکی (ELC)</span>
                    </div>
                    <div className="flex items-center justify-between bg-teal-50/90 border border-teal-300 rounded-md p-2 mr-9 text-[#00716B] font-bold">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#00716B] text-base">folder_open</span>
                        <span>{selectedFolder}</span>
                      </div>
                    </div>
                  </div>

                  {/* Folder Metrics */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="block text-[10px] text-slate-400">حجم فایل‌ها</span>
                      <span className="text-xs font-bold text-slate-700 font-mono">۳۸۴ MB</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="block text-[10px] text-slate-400">تعداد اسناد</span>
                      <span className="text-xs font-bold text-slate-700 font-mono">۱۴ مدرک</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="block text-[10px] text-slate-400">سطح دسترسی شما</span>
                      <span className="text-[11px] font-bold text-emerald-600">مجاز ثبت (WIP)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[11px] text-amber-900 leading-relaxed">
                  <span className="material-symbols-outlined text-amber-600 text-base shrink-0 mt-0.5">info</span>
                  <span>انتخاب این پوشه باعث فراخوانی خودکار فیلدهای شاخص صورت‌وضعیت مالی و بازرسی متره در گام بعدی خواهد شد.</span>
                </div>
              </div>

              {/* Left Column: Smart ISO 19650 Naming Matrix Engine */}
              <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#00716B]/10 text-[#00716B] flex items-center justify-center text-xs">
                      <span className="material-symbols-outlined text-base">auto_fix_high</span>
                    </span>
                    <h3 className="text-sm font-bold text-slate-800">موتور هوشمند نام‌گذاری مدرک (ISO 19650 Naming Matrix)</h3>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                    تولید استاندارد خودکار
                  </span>
                </div>

                {/* 4 Naming Selectors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Phase */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">گام اول: فاز پروژه (Project Phase)</label>
                    <select
                      value={phase}
                      onChange={(e) => setPhase(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#00716B]"
                    >
                      <option value="PH2">PH2 - فاز ۲ اجرایی (توسعه کارگاهی)</option>
                      <option value="PH1">PH1 - فاز ۱ نقشه‌ها و مدل‌ها</option>
                      <option value="PH0">PH0 - فاز صفر و مطالعات پایه</option>
                    </select>
                  </div>

                  {/* Discipline */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">گام دوم: دیسیپلین مهندسی (Discipline)</label>
                    <select
                      value={discipline}
                      onChange={(e) => setDiscipline(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#00716B]"
                    >
                      <option value="ELC">ELC - تاسیسات الکتریکی</option>
                      <option value="MEC">MEC - تاسیسات مکانیکی</option>
                      <option value="STR">STR - سازه و اسکلت بتنی</option>
                      <option value="ARC">ARC - معماری و نازک‌کاری</option>
                    </select>
                  </div>

                  {/* Subject Code */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">گام سوم: نوع سند (Subject Code)</label>
                    <select
                      value={subjectCode}
                      onChange={(e) => setSubjectCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#00716B]"
                    >
                      <option value="QS-PAY">QS-PAY - صورت‌وضعیت و مالی پیمانکار</option>
                      <option value="DWG">DWG - شیت نقشه اجرایی</option>
                      <option value="RFI">RFI - استعلام اطلاعات فنی</option>
                      <option value="MOD">MOD - مدل سه‌بعدی BIM</option>
                    </select>
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">گام چهارم: موقعیت کالبدی / Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#00716B]"
                    >
                      <option value="TWR-ALL">کل طبقات برج (TWR-ALL)</option>
                      <option value="LVL-POD">طبقات پودیوم و مشاعات</option>
                      <option value="LVL-B01">طبقه منفی ۱ (موتورخانه مرکزی)</option>
                      <option value="LVL-20-25">طبقات ۲۰ الی ۲۵</option>
                    </select>
                  </div>
                </div>

                {/* Live Generated Code Display Box */}
                <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">کد استاندارد تولید شده بر اساس ماتریس ISO:</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedIsoCode)}
                      className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                      کپی شناسه
                    </button>
                  </div>
                  <div className="font-mono text-sm sm:text-base tracking-wider text-teal-300 font-bold bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700 flex items-center justify-between" dir="ltr">
                    <span>{generatedIsoCode}</span>
                    <span className="text-[10px] font-sans font-normal px-2 py-0.5 bg-teal-500/20 text-teal-200 rounded border border-teal-500/30">
                      نسخه ۲
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors"
              >
                انصراف و بستن
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#00716B] hover:bg-[#005a55] shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>مرحله بعد: بارگذاری فایل و شاخص‌ها</span>
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FILE UPLOAD & DYNAMIC PARAMETERS */}
        {step === 2 && (
          <div className="p-6 md:p-8 space-y-6">
            {/* Step 1 Summary Strip */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-2.5 py-1 rounded-md bg-[#00716B] text-white font-mono font-bold text-xs tracking-wider" dir="ltr">
                  {generatedIsoCode}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-amber-500 text-sm">folder</span>
                  مسیر: <strong>پروژه باران ۵ / فاز ۲ / تاسیسات برقی / صورت‌وضعیت‌ها (IPC)</strong>
                </span>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-[#00716B] text-xs font-semibold underline underline-offset-4 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                ویرایش نام یا مسیر
              </button>
            </div>

            {/* 2-Column Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Right Column: File Upload & Checksum */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/90 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#00716B] text-base">upload_file</span>
                      بارگذاری فایل اصلی سند
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">XLSX, PDF, DWG</span>
                  </div>

                  {/* Drag and Drop Box */}
                  <div className="border-2 border-dashed border-teal-400 bg-teal-50/40 rounded-xl p-5 text-center transition-all hover:bg-teal-50/60">
                    <div className="w-12 h-12 rounded-full bg-[#00716B]/10 text-[#00716B] flex items-center justify-center text-xl mx-auto mb-2">
                      <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700">فایل سند یا شیت را اینجا بکشید و رها کنید</p>
                    <p className="text-[11px] text-slate-400 mt-1 mb-3">یا برای انتخاب فایل از رایانه خود دکمه زیر را بزنید</p>
                    <button className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs">
                      انتخاب از دیسک محلی
                    </button>
                  </div>

                  {/* Uploaded File Item */}
                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <span className="material-symbols-outlined text-xl">table_chart</span>
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-slate-800 block font-mono" dir="ltr">
                            {fileName}
                          </span>
                          <span className="text-[10px] text-slate-400">حجم: ۱۴.۲ مگابایت • بارگذاری کامل شده (۱۰۰٪)</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                    </div>

                    {/* SHA-256 Checksum */}
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-600">
                          <span className="material-symbols-outlined text-[#00716B] text-xs">lock</span>
                          چک‌سام امنیتی مدرک (SHA-256):
                        </span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                          تایید اصالت و ضد جعل
                        </span>
                      </div>
                      <div className="font-mono text-[9px] text-slate-600 bg-white p-1.5 rounded border border-slate-200 break-all leading-tight" dir="ltr">
                        e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Column: Dynamic Fields (IPC Engine) */}
              <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#00716B]/10 text-[#00716B] flex items-center justify-center text-xs">
                      <span className="material-symbols-outlined text-base">receipt_long</span>
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">اطلاعات و شاخص‌های کلی سند مالی (پویا)</h3>
                      <p className="text-[11px] text-slate-400">فراخوانی هوشمند بر اساس نوع پوشه صورت‌وضعیت‌ها</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full font-medium">
                    فیلدهای اختصاصی IPC
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Amount */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <label className="block text-xs text-slate-500 font-medium mb-1">مبلغ کل کارکرد دوره (ریال)</label>
                    <div className="text-base font-bold text-slate-900 font-mono flex items-center justify-between">
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent font-bold outline-none w-full"
                      />
                      <span className="text-xs font-normal text-slate-500 font-sans shrink-0 mr-2">ریال</span>
                    </div>
                  </div>

                  {/* Physical Progress */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <label className="block text-xs text-slate-500 font-medium mb-1">پیشرفت تجمعی فیزیکی (برنامه زمان‌بندی)</label>
                    <div className="text-base font-bold text-emerald-700 flex items-center justify-between">
                      <span className="font-mono">{progress}٪</span>
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        منطبق با برنامه
                      </span>
                    </div>
                  </div>

                  {/* Period Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">شماره دوره صورت‌وضعیت</label>
                    <input
                      type="text"
                      value={periodNumber}
                      onChange={(e) => setPeriodNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#00716B]"
                    />
                  </div>

                  {/* Date range */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">بازه کارکرد ادعاشده</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 text-center outline-none"
                      />
                      <input
                        type="text"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 text-center outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Compliance Agreement */}
                <div className="p-3 bg-teal-50/60 border border-teal-200/80 rounded-xl flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="compliance-check"
                    checked={complianceChecked}
                    onChange={(e) => setComplianceChecked(e.target.checked)}
                    className="mt-0.5 rounded text-[#00716B] focus:ring-[#00716B] h-4 w-4 cursor-pointer accent-[#00716B]"
                  />
                  <label htmlFor="compliance-check" className="text-xs text-slate-700 leading-relaxed cursor-pointer select-none">
                    این سند با رعایت کامل مفاد قرارداد و استاندارد CDE توسط مشاور برق بارگذاری شده و نیازمند تایید{' '}
                    <strong>مهندس سهراب پارسا (مدیر ارشد طراحی)</strong> می‌باشد.
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                <span>بازگشت به مرحله ۱ (ویرایش مسیر و نام‌گذاری)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                >
                  ذخیره پیش‌نویس
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !complianceChecked}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#00716B] hover:bg-[#005a55] shadow-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>{isSubmitting ? 'در حال ثبت در CDE...' : 'ثبت نهایی و ارسال به مدیر طراحی'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
