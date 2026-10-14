import React from 'react';
import { NavigationTab } from '../types';
import { useDissolve } from '../hooks/useDissolve';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onOpenDocumentDossier: (docId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenDocumentDossier
}) => {
  const { visible, closing } = useDissolve(isOpen);

  if (!visible) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'صورت‌وضعیت مالی شماره ۵ نیازمند اقدام فوری',
      desc: 'مهلت پاسخگویی زیر ۱۴ ساعت بر اساس ضوابط SLA قرارداد اسکلت بتنی.',
      time: '۱۰ دقیقه پیش',
      type: 'urgent',
      tab: 'approvals' as NavigationTab,
      docId: 'doc-xlsx-ipc5'
    },
    {
      id: 'notif-2',
      title: 'کلش بحرانی جدید (CLS-1042-089)',
      desc: 'برخورد لوله اصلی آب چیلر با تیر اصلی سازه بتنی در شفت شرقی طبقه ۲۲ ثبت شد.',
      time: '۴۵ دقیقه پیش',
      type: 'clash',
      tab: 'bim' as NavigationTab
    },
    {
      id: 'notif-3',
      title: 'بارگذاری نسخه Rev 04 مدل معماری و سازه',
      desc: 'مهندس سهراب پارسا نسخه جدید مدل رویت هسته برج را در مخزن CDE بارگذاری نمود.',
      time: '۲ ساعت پیش',
      type: 'info',
      tab: 'cde' as NavigationTab,
      docId: 'doc-revit-core'
    },
    {
      id: 'notif-4',
      title: 'گزارش جلسه هماهنگی تاسیسات (MoM-019)',
      desc: 'صورت‌جلسه رفع تداخل رایزرهای تاسیسات برق با خرپای سازه در سامانه منتشر شد.',
      time: 'دیروز',
      type: 'info',
      tab: 'dashboard' as NavigationTab
    }
  ];

  return (
    <div
      className={`fixed inset-0 z-[125] bg-slate-900/40 backdrop-blur-xs flex justify-start ${closing ? 'animate-backdrop-dissolve-out' : 'animate-backdrop-dissolve'}`}
      dir="rtl"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between ${closing ? 'animate-dissolve-out' : 'animate-dissolve'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00716B] text-xl">notifications_active</span>
            <h3 className="text-base font-bold text-slate-900">اعلان‌های سامانه CDE</h3>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold font-mono">
              ۳ خوانده‌نشده
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (n.docId) {
                  onOpenDocumentDossier(n.docId);
                } else if (n.tab) {
                  onNavigate(n.tab);
                }
                onClose();
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                n.type === 'urgent'
                  ? 'bg-red-50/60 border-red-200 hover:border-red-300'
                  : n.type === 'clash'
                  ? 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    n.type === 'urgent'
                      ? 'text-red-700'
                      : n.type === 'clash'
                      ? 'text-amber-800'
                      : 'text-slate-900'
                  }`}
                >
                  {n.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{n.desc}</p>
              <div className="pt-1 flex items-center justify-between text-[11px]">
                <span className="text-[#00716B] font-bold">بررسی مستقیم و اقدام ←</span>
                <span className="text-slate-400 font-mono text-[10px]">سیستم هشدار CDE</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => {
              onNavigate('approvals');
              onClose();
            }}
            className="text-[#00716B] font-bold hover:underline"
          >
            مشاهده تمام تاییدات و کارتابل
          </button>
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-100 text-slate-700">
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
