import React, { useRef, useState } from 'react';
import { CdeDocument } from '../types';
import { useDissolve } from '../hooks/useDissolve';

interface DocumentDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: CdeDocument | null;
  onDownload: (docTitle: string) => void;
  onOpen3dViewer: () => void;
}

export const DocumentDossierModal: React.FC<DocumentDossierModalProps> = ({
  isOpen,
  onClose,
  document,
  onDownload,
  onOpen3dViewer
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'diff'>('details');

  const { visible, closing } = useDissolve(isOpen);
  const lastDocRef = useRef<CdeDocument | null>(null);
  if (document) lastDocRef.current = document;
  const shownDoc = document || lastDocRef.current;

  if (!visible || !shownDoc) return null;

  return (
    <div
      className={`fixed inset-0 z-[140] bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto ${closing ? 'animate-backdrop-dissolve-out' : 'animate-backdrop-dissolve'}`}
      data-lenis-prevent
      dir="rtl"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] overflow-y-auto ${closing ? 'animate-modal-dissolve-out' : 'animate-modal-dissolve'} flex flex-col divide-y divide-slate-100`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Strip */}
        <header className="p-5 lg:p-6 flex flex-col gap-4 bg-gradient-to-r from-slate-50 via-white to-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#00716B] text-white flex items-center justify-center shadow-md shrink-0">
                <span className="material-symbols-outlined text-2xl">folder_special</span>
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900 leading-tight">
                    پرونده فنی و شناسنامه مدرک
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    دارای ویرایش معتبر جاری
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  مدل‌های اطلاعاتی BIM و نقشه‌های رویت / فاز ۱ اجرایی (PHASE 1) • پروژه ساختمانی برج آلفا (طبقات ۲۰ الی ۲۵)
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => onDownload(shownDoc.title)}
                className="h-9 px-3.5 flex items-center gap-1.5 rounded-xl bg-[#00716B] hover:bg-[#005e59] text-white transition-colors text-xs font-bold shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>دانلود آخرین نسخه (Rev 04)</span>
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                title="بستن پنجره"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </div>

          {/* ISO Naming Code & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-600 font-bold">کد استاندارد ملی مدرک (ISO Naming):</span>
              <code className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-[#00716B] font-mono text-xs font-bold tracking-wider select-all" dir="ltr">
                {shownDoc.isoCode}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(shownDoc.isoCode)}
                className="p-1 rounded text-slate-400 hover:text-[#00716B] transition-colors"
                title="کپی کد"
              >
                <span className="material-symbols-outlined text-base">content_copy</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-[#00716B]/10 text-[#00716B] border border-[#00716B]/20 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">verified</span>
                وضعیت ISO 19650: SHARED (منتشر شده)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold flex items-center gap-1 shadow-2xs">
                <span className="material-symbols-outlined text-sm">task_alt</span>
                کد تاییدیه نظارت: Code A (تایید بدون قید)
              </span>
            </div>
          </div>
        </header>

        {/* 2-Column Body */}
        <div className="p-5 lg:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Right Column: 3D Preview, Quick Specs & Version History (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* 3D BIM Viewer Card */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm flex flex-col">
              <div className="relative w-full h-64 bg-slate-950 overflow-hidden group">
                <img
                  alt="مدل سه‌بعدی BIM برج آلفا"
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZLHUAVLVVhzDCszn_Yp2GbtGpW2xkO9JnYgChmVCWGKkEbTaRzVYz4nwZ_jvg_Bn3oH6Vk--QTlG7CPy7AE-n5ZdE4P5MK0ElfBoSdCwYo-UgXxZxrzD_jb4vih68Sx9fn_4Mya7VHGeyCNmoyc0WD9nBczeSMWhlxK6mR0Rl2kgFrTbTc2ckP7LPwuP4hHHF8iM6zlU1B9VsMhShjdbLm83SzPJAxR5E__kViM8Y9Z2i0Nd8eUvLZ8g3wNndwx-s_Inr_A3S61lT7g"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                {/* Floating Top Badges */}
                <div className="absolute top-3 right-3 left-3 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur text-white flex items-center gap-1.5 border border-white/10">
                    <span className="material-symbols-outlined text-sm text-[#80d5ce]">view_in_ar</span>
                    مدل هماهنگ بیم (Autodesk Revit 2024.2)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#00716B] text-white font-bold">
                    LOD 350 (مرحله اجرایی)
                  </span>
                </div>

                {/* Floating Bottom Info */}
                <div className="absolute bottom-3 right-3 left-3 flex flex-wrap items-end justify-between gap-2 text-white">
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      مدل یکپارچه سازه و معماری برج آلفا - طبقات ۲۰ تا ۲۵
                    </h4>
                    <p className="text-[11px] text-slate-300 font-mono mt-0.5" dir="ltr">
                      UTM: E: 538201.24 | N: 3951204.88 | Level 0.00: +1450.20m
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onOpen3dViewer();
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00716B] hover:bg-[#005e59] text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    <span>باز کردن در ویوور سه‌بعدی CDE</span>
                  </button>
                </div>
              </div>

              {/* Quick Spec Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 border-t border-slate-200 text-xs">
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">دیسیپلین مهندسی</span>
                  <span className="font-bold text-[#00716B] mt-0.5 block">{shownDoc.discipline}</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">فرمت پرونده</span>
                  <span className="font-bold text-slate-800 mt-0.5 block font-mono" dir="ltr">
                    Autodesk RVT (.rvt)
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">حجم فایل اصلی</span>
                  <span className="font-bold text-slate-800 mt-0.5 block font-mono">{shownDoc.size}</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">آخرین ویرایشگر</span>
                  <span className="font-bold text-slate-700 mt-0.5 block truncate">{shownDoc.author}</span>
                </div>
              </div>
            </div>

            {/* Direct Download Banner */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-teal-50/80 border border-teal-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00716B] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">cloud_download</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">دریافت مستقیم آخرین نسخه مصوب (Rev 04)</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">شامل تمامی شیت‌های تاییدشده، فمیلی‌های پارامتریک و جداول متره برآورد</p>
                </div>
              </div>
              <button
                onClick={() => onDownload(shownDoc.title)}
                className="px-4 py-2 rounded-xl bg-[#00716B] hover:bg-[#005e59] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>دانلود نسخه جاری ({shownDoc.size})</span>
              </button>
            </div>

            {/* Version History Stack */}
            <section className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00716B] text-lg">history_edu</span>
                  <h3 className="text-sm font-bold text-slate-900">تاریخچه نسخه‌ها (Version History)</h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                    ۴ نسخه ثبت‌شده
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab(activeTab === 'diff' ? 'details' : 'diff')}
                  className="text-xs font-bold text-[#00716B] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">compare_arrows</span>
                  <span>{activeTab === 'diff' ? 'بازگشت به جزییات' : 'مقایسه دو نسخه (Diff Visualizer)'}</span>
                </button>
              </div>

              {/* Version Stack */}
              <div className="space-y-2.5">
                {/* Rev 04 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-[#00716B]/30 relative overflow-hidden space-y-1.5">
                  <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-[#00716B]"></div>
                  <div className="flex items-center justify-between text-xs mr-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#00716B] text-white font-bold text-xs">Rev 04</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        نسخه فعال و جاری
                      </span>
                      <span className="text-[11px] text-slate-400">امروز، ساعت ۱۴:۵۵</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-700 text-[11px]">توسط: <strong>مهندس سهراب پارسا</strong></span>
                    </div>
                    <span className="font-mono text-xs text-slate-600">142.5 MB</span>
                  </div>
                  <p className="text-xs text-slate-600 mr-1 leading-relaxed">
                    اعمال تغییرات کلش‌های تاسیسات مکانیکی و الکتریکی (MEP) شفت شرقی طبقه ۲۲، اصلاح رایزرهای آتش‌نشانی و تطبیق با آکس‌های تغییریافته سازه هسته بتنی.
                  </p>
                  <div className="mr-1 pt-1 flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      تاییدیه کنترل کیفی (QC Passed)
                    </span>
                    <span>هش: <code className="font-mono">e9b1d7f3c2b84</code></span>
                  </div>
                </div>

                {/* Rev 03 */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">Rev 03</span>
                      <span className="text-slate-400 text-[11px]">۱۸ آبان ۱۴۰۲ - ساعت ۱۰:۱۵</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-700 text-[11px]">توسط: <strong>مهندس نیما احمدی</strong></span>
                    </div>
                    <span className="font-mono text-slate-500">139.8 MB</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    نسخه نهایی مصوب جلسه هماهنگی VDC و کنترل ابعاد کورها و بازشوهای داکت‌های تاسیساتی بر اساس تغییرات پمپ‌روم طبقه ۲۳.
                  </p>
                </div>

                {/* Rev 02 */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">Rev 02</span>
                      <span className="text-slate-400 text-[11px]">۳۰ مهر ۱۴۰۲ - ساعت ۱۶:۴۰</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-700 text-[11px]">توسط: <strong>مهندس پریسا سلطانی</strong></span>
                    </div>
                    <span className="font-mono text-slate-500">134.2 MB</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    مدل اولیه سازه بتنی و سقف‌های مجوف بر اساس آخرین نقشه سازه مصوب مشاور مهندسین، ایجاد تیپ‌بندی تیرها و ستون‌ها.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Left Column: Audit Trail & BIM Technical Metadata (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Audit Trail Section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00716B] text-lg">verified_user</span>
                  <h3 className="text-sm font-bold text-slate-900">ردیابی رویدادها (Audit Trail)</h3>
                </div>
                <button
                  onClick={() => onDownload('گزارش Audit Trail')}
                  className="text-xs text-[#00716B] font-bold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">table_view</span>
                  <span>خروجی لاگ</span>
                </button>
              </div>

              {/* Audit Rows */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 text-xs">
                {/* Event 1 */}
                <div className="p-3 hover:bg-slate-50 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Check-in Rev 04</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400" dir="ltr">Today, 14:55:12</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pr-3.5">
                    ثبت موفق مدل در دایرکتوری فاز ۱، محاسبه خودکار کلش‌ها و استخراج IFC.
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono pr-3.5" dir="ltr">
                    سهراب پارسا • IP: 192.168.10.42
                  </div>
                </div>

                {/* Event 2 */}
                <div className="p-3 hover:bg-slate-50 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-[#00716B]"></span>
                      <span>صدور تاییدیه تداخل</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400" dir="ltr">Today, 13:10:04</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pr-3.5">
                    تایید برطرف شدن ۱۲ مورد تداخل بحرانی (Hard Clash) در داکت غربی طبقه ۲۲.
                  </div>
                  <div className="text-[10px] text-[#00716B] font-mono pr-3.5" dir="ltr">
                    Certificate: #QC-9014-CLASH-OK
                  </div>
                </div>

                {/* Event 3 */}
                <div className="p-3 hover:bg-slate-50 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>تغییر وضعیت SHARED</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400" dir="ltr">Yesterday, 16:20:45</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pr-3.5">
                    انتشار عمومی مدرک در فضای اشتراکی پس از امضای دیجیتال مدیر پروژه.
                  </div>
                </div>
              </div>
            </section>

            {/* BIM Metadata Matrix */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                <span className="material-symbols-outlined text-[#00716B] text-lg">assignment_turned_in</span>
                <h3 className="text-sm font-bold text-slate-900">مشخصات و متادیتای تکمیلی BIM</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">سیستم مختصات پروژه (CRS)</span>
                    <span className="font-bold text-slate-800">UTM Zone 39N - WGS84</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">مختصات ژئودزی شهری</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">محیط نرم‌افزاری تالیف</span>
                    <span className="font-bold text-slate-800 font-mono" dir="ltr">Autodesk Revit 2024.2</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">سازگار با Navisworks</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">سطح دسترسی و محرمانگی</span>
                    <span className="font-bold text-[#00716B]">داخلی هلدینگ باران (Restricted)</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">پیمانکاران مجاز فاز ۱</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">سطح دقت هندسی و اطلاعاتی</span>
                    <span className="font-bold text-slate-800">LOD 350 / LOI 300</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">مرحله شاپ‌دراویینگ ساخت</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-4 px-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00716B] text-lg">security</span>
            <span>این مدرک حاوی امضای دیجیتال معتبر SHA-256 در زیرساخت مدیریت اسناد ابری باران است.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">شناسه مدرک:</span>
            <code className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-300 font-bold" dir="ltr">
              UUID: b47e802a-9f12-4c28-98de
            </code>
          </div>
        </footer>
      </div>
    </div>
  );
};
