import React, { useState } from 'react';
import { ApprovalItem } from '../types';
import { APPROVAL_ITEMS } from '../data/mockData';

interface ApprovalsViewProps {
  onOpenDocumentDossier: (docId: string) => void;
  onTriggerToast: (title: string, desc: string, type?: 'success' | 'error' | 'info') => void;
  onOpenExcelIpc?: () => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  onOpenDocumentDossier,
  onTriggerToast,
  onOpenExcelIpc
}) => {
  const [activeTab, setActiveTab] = useState<'myAction' | 'all' | 'published' | 'delayed'>('myAction');
  const [selectedIds, setSelectedIds] = useState<string[]>(['app-ipc5']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === APPROVAL_ITEMS.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(APPROVAL_ITEMS.map((i) => i.id));
    }
  };

  const filteredItems = APPROVAL_ITEMS.filter((item) => {
    if (activeTab === 'myAction' && item.status !== 'pending' && item.status !== 'revision') {
      return false;
    }
    if (activeTab === 'published' && item.status !== 'approved') return false;
    if (activeTab === 'delayed' && !item.slaUrgent && item.status !== 'revision') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.sender.includes(q) ||
        item.discipline.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8" dir="rtl">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00716B]"></span>
            <span className="text-xs font-bold text-[#00716B] font-mono tracking-wider">
              ISO 19650-2 WORKFLOW CONTROLLER
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mt-1 font-['Markazi_Text']">
            تاییدات و انتشار اسناد CDE - برج آلفا
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            بررسی، تعیین‌تکلیف و تایید یا رد فایل‌ها و مدارک بارگذاری‌شده توسط مشاوران و تیم‌های فنی جهت انتشار رسمی در محیط داده مشترک (CDE طبق استاندارد ISO 19650)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => onTriggerToast('ماتریس اختیارات RACI', 'ماتریس تخصیص نقش‌های تصمیم‌گیری نمایش داده شد.', 'info')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">tune</span>
            <span>ماتریس اختیارات RACI</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">کل اسناد در صف تایید</span>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#00716B]">
              <span className="material-symbols-outlined text-base">alt_route</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-bold font-['Markazi_Text'] text-slate-900">۴۵</span>
            <span className="text-xs text-slate-400">کل اسناد در صف</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-[#00716B] font-bold">۸ بسته در هفته جاری</span>
            <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-[#00716B]" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">نیازمند اقدام مدیر طراحی (اقدام فوری)</span>
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">notification_important</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-bold font-['Markazi_Text'] text-rose-600">۰۳</span>
            <span className="text-xs text-rose-600 font-bold">مورد زیر SLA</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
            <span>۲ صورت‌وضعیت مالی + ۱ مدل شفت</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">تایید مشروط / در انتظار اصلاح مشاور</span>
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">rule</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-bold font-['Markazi_Text'] text-amber-800">۰۸</span>
            <span className="text-xs text-slate-400">نیازمند Rev جدید</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>میانگین بازگشت: ۴.۲ روز</span>
            <span className="text-amber-800 font-bold font-mono">کد وضعیت S2/S3</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">منتشر شده در CDE (ماه جاری)</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-[#00716B] flex items-center justify-center">
              <span className="material-symbols-outlined text-base">verified</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-bold font-['Markazi_Text'] text-[#00716B]">۳۴</span>
            <span className="text-xs text-slate-400">مدرک نهایی‌شده</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-[#00716B] font-bold">دروازه اشتراک: ۱۰۰٪</span>
            <span className="font-bold text-[#00716B] font-mono">کد انتشار A</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('myAction')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'myAction'
                ? 'bg-[#00716B] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>نیازمند اقدام من</span>
            <span className="w-5 h-5 rounded-full bg-white text-[#00716B] text-[10px] flex items-center justify-center font-bold">
              ۳
            </span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#00716B] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>همه اسناد در صف تایید</span>
            <span className="text-[10px] font-mono">۱۳</span>
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'published'
                ? 'bg-[#00716B] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>اسناد تایید و منتشر شده</span>
            <span className="text-[10px] font-mono">۳۴</span>
          </button>
          <button
            onClick={() => setActiveTab('delayed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'delayed'
                ? 'bg-[#00716B] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>معوق و دارای تاخیر</span>
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-[10px] text-rose-600 font-mono font-bold">۲</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute right-2.5 top-2 text-slate-400 text-base">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی کد سند، پیمانکار یا دیسیپلین..."
              className="w-full bg-slate-50 rounded-lg pr-9 pl-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#00716B] border border-slate-200"
            />
          </div>
          <button
            onClick={() => onTriggerToast('فیلتر پیشرفته', 'فیلترهای پیشرفته بر اساس بازه تاریخ فعال شد.', 'info')}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="فیلتر پیشرفته"
          >
            <span className="material-symbols-outlined text-lg">filter_list</span>
          </button>
        </div>
      </div>

      {/* Main Approval Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px]">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === APPROVAL_ITEMS.length}
                    onChange={toggleSelectAll}
                    className="accent-[#00716B] rounded cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 w-16">فرمت</th>
                <th className="py-3 px-3">کد مدرک در CDE (ISO 19650)</th>
                <th className="py-3 px-3 w-64">عنوان بسته مهندسی</th>
                <th className="py-3 px-3">دیسیپلین</th>
                <th className="py-3 px-3">فرستنده / مشاور</th>
                <th className="py-3 px-3">مهلت اقدام (SLA)</th>
                <th className="py-3 px-3">وضعیت تایید</th>
                <th className="py-3 px-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      isSelected ? 'bg-teal-50/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="accent-[#00716B] rounded cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          item.format === 'RVT'
                            ? 'bg-teal-50 text-[#00716B]'
                            : item.format === 'IFC'
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.format === 'DWG'
                            ? 'bg-amber-50 text-amber-800'
                            : item.format === 'XLSX'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {item.format}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#00716B] font-mono text-[11px]" dir="ltr">
                          {item.code}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{item.phase}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 w-64">
                      <span className="font-medium text-slate-900 leading-snug">{item.title}</span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {item.discipline}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-slate-800">{item.sender}</span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.slaUrgent
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.sla}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.status === 'approved'
                              ? 'bg-emerald-500'
                              : item.status === 'rejected'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        ></span>
                        <span
                          className={`font-bold ${
                            item.status === 'approved'
                              ? 'text-emerald-700'
                              : item.status === 'rejected'
                              ? 'text-rose-700'
                              : 'text-amber-800'
                          }`}
                        >
                          {item.statusLabel}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      {item.format === 'XLSX' ? (
                        <button
                          onClick={() => {
                            if (onOpenExcelIpc) onOpenExcelIpc();
                            else onOpenDocumentDossier('doc-xlsx-ipc5');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#107C41] hover:bg-[#0c6334] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                          title="مشاهده و تایید در قالب اکسل"
                        >
                          <span className="material-symbols-outlined text-sm">table_chart</span>
                          <span>بررسی در قالب اکسل</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenDocumentDossier('doc-revit-core')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#00716B]/30 text-[#00716B] hover:bg-[#00716B]/10 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">fact_check</span>
                          <span>{item.status === 'pending' ? 'بررسی و تایید' : 'بررسی'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Action Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-700">{selectedIds.length} مدرک انتخاب شده است</span>
            <div className="h-4 w-px bg-slate-300 mx-1"></div>
            <button
              onClick={() => onTriggerToast('دریافت فایل مبنا', 'فایل‌های مبنای مدارک انتخابی دانلود شدند.', 'success')}
              className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-[#00716B] font-bold flex items-center gap-1 border border-slate-200 shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>دریافت فایل مبنا</span>
            </button>
            <button
              onClick={() => onTriggerToast('خروجی لاگ تاییدات', 'گزارش ممیزی تاییدات دانلود گردید.', 'success')}
              className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-[#00716B] font-bold flex items-center gap-1 border border-slate-200 shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">history</span>
              <span>خروجی لاگ تاییدات</span>
            </button>
            <button
              onClick={() => {
                onTriggerToast('تایید و انتشار گروهی انجام شد', `${selectedIds.length} سند با موفقیت تایید و در دروازه Shared CDE منتشر شدند.`, 'success');
              }}
              className="px-3 py-1 rounded bg-[#00716B] text-white hover:bg-[#005e59] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">done_all</span>
              <span>تایید و انتشار گروهی</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span>صفحه ۱ از ۴ (کل اسناد: ۴۵)</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400" disabled>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
              <button className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
