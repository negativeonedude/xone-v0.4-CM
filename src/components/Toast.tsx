import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      onDismiss(latest.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-2.5 max-w-md w-full pointer-events-none" dir="rtl">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white border border-slate-200 shadow-xl rounded-xl p-4 flex items-start gap-3 transition-all animate-fadeIn"
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              toast.type === 'error'
                ? 'bg-rose-100 text-rose-700'
                : toast.type === 'info'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-emerald-100 text-[#00716B]'
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'task_alt'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 leading-tight">{toast.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.description}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
