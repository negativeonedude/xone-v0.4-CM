import React, { useState, useEffect } from 'react';
import { CDE_DOCUMENTS, CLASHES, CDE_FOLDERS } from '../data/mockData';
import { NavigationTab } from '../types';
import { useDissolve } from '../hooks/useDissolve';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onOpenDocumentDossier: (docId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenDocumentDossier
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const { visible, closing } = useDissolve(isOpen);

  if (!visible) return null;

  const filteredDocs = query.trim()
    ? CDE_DOCUMENTS.filter(
        (d) =>
          d.title.includes(query) ||
          d.isoCode.toLowerCase().includes(query.toLowerCase()) ||
          d.discipline.includes(query) ||
          d.author.includes(query)
      )
    : CDE_DOCUMENTS.slice(0, 4);

  const filteredClashes = query.trim()
    ? CLASHES.filter(
        (c) =>
          c.title.includes(query) ||
          c.code.toLowerCase().includes(query.toLowerCase()) ||
          c.description.includes(query) ||
          c.location.includes(query)
      )
    : CLASHES.slice(0, 3);

  return (
    <div
      className={`fixed inset-0 z-[130] bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 ${closing ? 'animate-backdrop-dissolve-out' : 'animate-backdrop-dissolve'}`}
      dir="rtl"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden ${closing ? 'animate-modal-dissolve-out' : 'animate-modal-dissolve'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در مدارک ISO 19650، کلش‌های BIM، پوشه‌ها و نقش‌های CDE..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
            autoFocus
          />
          <kbd className="px-2 py-0.5 rounded bg-slate-200 text-slate-600 text-xs font-mono">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Quick Shortcuts */}
          {!query.trim() && (
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 flex-wrap">
              <span className="text-[11px] text-slate-400">بخش‌های پرکاربرد:</span>
              <button
                onClick={() => {
                  onNavigate('cde');
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#00716B]/10 hover:text-[#00716B] text-slate-700 text-xs font-medium transition-colors"
              >
                مخزن CDE
              </button>
              <button
                onClick={() => {
                  onNavigate('bim');
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#00716B]/10 hover:text-[#00716B] text-slate-700 text-xs font-medium transition-colors"
              >
                ناظر کلش‌گیری BIM
              </button>
              <button
                onClick={() => {
                  onNavigate('approvals');
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#00716B]/10 hover:text-[#00716B] text-slate-700 text-xs font-medium transition-colors"
              >
                کارتابل تاییدات
              </button>
              <button
                onClick={() => {
                  onNavigate('permissions');
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#00716B]/10 hover:text-[#00716B] text-slate-700 text-xs font-medium transition-colors"
              >
                مجوزها و حاکمیت
              </button>
            </div>
          )}

          {/* Documents Section */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span>مدارک و فایل‌های مهندسی CDE</span>
              <span className="text-[10px] text-slate-400 font-normal">({filteredDocs.length} مورد)</span>
            </div>
            <div className="space-y-1.5">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    onOpenDocumentDossier(doc.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-[#00716B]/10 text-[#00716B] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {doc.format}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{doc.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">{doc.isoCode}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#00716B] font-bold shrink-0">مشاهده شناسنامه ←</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clashes Section */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span>تعارضات و کلش‌های BIM</span>
              <span className="text-[10px] text-slate-400 font-normal">({filteredClashes.length} مورد)</span>
            </div>
            <div className="space-y-1.5">
              {filteredClashes.map((clash) => (
                <div
                  key={clash.id}
                  onClick={() => {
                    onNavigate('bim');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      BIM
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{clash.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{clash.location} • {clash.code}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-rose-600 font-bold shrink-0">{clash.penetration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>برای انتخاب Enter و برای خروج ESC را بزنید</span>
          <span className="font-mono">Xone Intelligent Search Engine</span>
        </div>
      </div>
    </div>
  );
};
