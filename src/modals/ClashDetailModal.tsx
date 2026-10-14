import React, { useRef } from 'react';
import { ClashItem } from '../types';
import { useDissolve } from '../hooks/useDissolve';

interface ClashDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  clash: ClashItem | null;
  onViewIn3D: (clash: ClashItem) => void;
  onTriggerToast: (title: string, desc: string, type?: 'success' | 'error' | 'info') => void;
}

export const ClashDetailModal: React.FC<ClashDetailModalProps> = ({
  isOpen,
  onClose,
  clash,
  onViewIn3D,
  onTriggerToast
}) => {
  const { visible, closing } = useDissolve(isOpen);
  const lastClashRef = useRef<ClashItem | null>(null);
  if (clash) lastClashRef.current = clash;
  const shownClash = clash || lastClashRef.current;

  if (!visible || !shownClash) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm ${closing ? 'animate-backdrop-dissolve-out' : 'animate-backdrop-dissolve'}`}
      dir="rtl"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col ${closing ? 'animate-modal-dissolve-out' : 'animate-modal-dissolve'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs ${
                shownClash.severity === 'critical'
                  ? 'bg-rose-500 text-white'
                  : shownClash.severity === 'medium'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">
                {shownClash.status === 'resolved' ? 'task_alt' : 'warning'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-slate-200 text-slate-800">
                  {shownClash.code}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                    shownClash.severity === 'critical'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : shownClash.severity === 'medium'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {shownClash.severityLabel} • {shownClash.type}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-teal-50 text-[#00716B] text-xs font-mono font-bold border border-teal-200">
                  {shownClash.discipline1} ✕ {shownClash.discipline2}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{shownClash.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="بستن پنجره"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700">
          {/* Top Description Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
            <span className="text-slate-400 font-bold">شرح کامل تداخل فنی و فضایی:</span>
            <p className="text-slate-800 text-sm leading-relaxed">{shownClash.description}</p>
          </div>

          {/* 2-Column: Elements in Conflict */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Element 1 */}
            <div className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-rose-800 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  المان اول درگیر (Primary Element)
                </span>
                <span className="font-mono text-[11px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                  {shownClash.discipline1}
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between border-b border-rose-100 pb-1">
                  <span className="text-slate-500">نام المان:</span>
                  <span className="font-mono font-bold text-slate-800">{shownClash.element1}</span>
                </div>
                <div className="flex justify-between border-b border-rose-100 pb-1">
                  <span className="text-slate-500">شناسه رویت (Element ID):</span>
                  <span className="font-mono font-bold text-slate-800">{shownClash.element1Id}</span>
                </div>
                <div className="flex justify-between border-b border-rose-100 pb-1">
                  <span className="text-slate-500">رشته تخصصی:</span>
                  <span className="font-bold text-slate-700">{shownClash.discipline1}</span>
                </div>
              </div>
            </div>

            {/* Element 2 */}
            <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  المان دوم درگیر (Intersecting Element)
                </span>
                <span className="font-mono text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  {shownClash.discipline2}
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between border-b border-emerald-100 pb-1">
                  <span className="text-slate-500">نام المان:</span>
                  <span className="font-mono font-bold text-slate-800">{shownClash.element2}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-100 pb-1">
                  <span className="text-slate-500">شناسه رویت (Element ID):</span>
                  <span className="font-mono font-bold text-slate-800">{shownClash.element2Id}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-100 pb-1">
                  <span className="text-slate-500">رشته تخصصی:</span>
                  <span className="font-bold text-slate-700">{shownClash.discipline2}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Spatial & Physical Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-[11px]">موقعیت و طبقه:</span>
              <span className="font-bold text-slate-800 text-xs">{shownClash.location}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-[11px]">زون کالبدی:</span>
              <span className="font-bold text-slate-800 text-xs">{shownClash.zone}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-[11px]">عمق نفوذ تداخل:</span>
              <span className="font-mono font-bold text-rose-600 text-xs" dir="ltr">{shownClash.penetration}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-[11px]">قدمت ثبت در CDE:</span>
              <span className="font-bold text-slate-800 text-xs">{shownClash.age}</span>
            </div>
          </div>

          {/* Coordinates & Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">مختصات فضایی در مدل (WCS):</span>
                <span className="font-mono font-bold text-slate-800 mt-0.5 block" dir="ltr">{shownClash.coordinates}</span>
              </div>
              <button
                onClick={() => onTriggerToast('مختصات کپی شد', shownClash.coordinates, 'info')}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                کپی
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">ارجاع‌شده به جهت اقدام:</span>
                <span className="font-bold text-[#00716B] mt-0.5 block">{shownClash.assignedTo || 'مدیر هماهنگی BIM باران'}</span>
              </div>
              <span className="material-symbols-outlined text-teal-600">person</span>
            </div>
          </div>

          {/* BIM Coordinator Resolution Note */}
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#00716B] font-bold text-xs">
              <span className="material-symbols-outlined text-lg">psychology</span>
              <span>دستور اصلاحی و یادداشت مدیر هماهنگی BIM (Resolution Protocol):</span>
            </div>
            <p className="text-slate-800 leading-relaxed text-xs text-justify pr-6">
              {shownClash.coordinatorNote}
            </p>
          </div>

          {/* BCF Topic Standard Card */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600">verified</span>
              <span>پروتکل استاندارد تبادل بین‌المللی: <strong>BCF 3.0 (BuildingSmart XML/REST)</strong></span>
            </div>
            <span className="font-mono">UUID: 8f9b21a0-40e1-4c12-91ef</span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onTriggerToast('خروجی BCF صادر شد', `بسته BCF موضوع ${shownClash.code} آماده ارسال شد.`, 'success');
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">file_download</span>
              <span>خروجی BCF 3.0</span>
            </button>
            <button
              onClick={() => {
                onTriggerToast('تغییر وضعیت ثبت شد', `وضعیت تعارض ${shownClash.code} به‌روزرسانی شد.`, 'info');
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">sync</span>
              <span>تغییر وضعیت</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            >
              بستن
            </button>
            <button
              onClick={() => {
                onClose();
                onViewIn3D(shownClash);
              }}
              className="px-4 py-1.5 rounded-xl bg-[#00716B] hover:bg-[#005e59] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">view_in_ar</span>
              <span>مشاهده در نمایشگر سه‌بعدی ۳D</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
