import React, { useState } from 'react';
import { Project } from '../types';
import { PROJECTS } from '../data/mockData';
import { useDissolve } from '../hooks/useDissolve';

interface ProjectSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: Project;
  onSelectProject: (project: Project) => void;
}

export const ProjectSwitcherModal: React.FC<ProjectSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  onSelectProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { visible, closing } = useDissolve(isOpen);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 ${closing ? 'animate-backdrop-dissolve-out' : 'animate-backdrop-dissolve'}`}
      dir="rtl"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden ${closing ? 'animate-modal-dissolve-out' : 'animate-modal-dissolve'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00716B]/10 text-[#00716B] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">apartment</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-markazi text-lg">انتخاب پروژه فعال در پلتفرم Xone</h3>
              <p className="text-xs text-slate-500">پروژه‌های فعال گروه ساختمانی و سرمایه‌گذاری باران متصل به CDE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Quick Search in Switcher */}
        <div className="px-6 pt-3 pb-1 border-b border-slate-100 flex items-center gap-3 bg-white">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="جستجوی سریع پروژه..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#00716B] outline-hidden"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
          {PROJECTS.filter((p) => !searchQuery || p.name.includes(searchQuery) || p.code.toLowerCase().includes(searchQuery.toLowerCase())).map((proj) => {
            const isSelected = proj.id === currentProject.id;
            return (
              <div
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj);
                  onClose();
                }}
                className={`group rounded-xl border p-4 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-[#00716B] bg-[#00716B]/5 shadow-sm ring-2 ring-[#00716B]/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* Vertical Portrait Image */}
                <div className="relative aspect-3/4 w-full rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={proj.image}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur text-white text-[10px] font-mono font-bold">
                    {proj.code}
                  </div>
                  {proj.year && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/20 backdrop-blur text-white text-[10px] font-bold">
                      {proj.year}
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 left-2 flex items-center justify-between text-[11px] text-white">
                    <span className="bg-[#00716B] px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {proj.statusText}
                    </span>
                    {proj.floors && (
                      <span className="text-[10px] text-slate-200">
                        {proj.floors}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#00716B] transition-colors leading-tight">
                    {proj.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-1">{proj.stage}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{proj.location}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">پیشرفت فیزیکی</span>
                    <span className="font-bold text-slate-800 font-mono">{proj.progress}٪</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block">برآورد بودجه</span>
                    <span className="font-bold text-[#00716B] font-mono text-[11px]">{proj.budget}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-[#00716B] text-white'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-[#00716B] group-hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isSelected ? 'check_circle' : 'arrow_forward'}
                  </span>
                  <span>{isSelected ? 'پروژه فعال کنونی' : 'انتخاب این پروژه'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>پروژه‌های متصل به زیرساخت ابری Xone CDE Infrastructure</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
