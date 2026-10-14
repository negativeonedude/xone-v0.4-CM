import React, { useState } from 'react';
import { NavigationTab, Project } from '../types';

interface HeaderProps {
  currentTab: NavigationTab;
  currentProject: Project;
  onOpenProjectSwitcher: () => void;
  onOpenSearch: () => void;
  onOpenUpload: () => void;
  onOpenNotifications: () => void;
  onNavigate: (tab: NavigationTab) => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  currentProject,
  onOpenProjectSwitcher,
  onOpenSearch,
  onOpenUpload,
  onOpenNotifications,
  onNavigate,
  unreadCount = 3
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getPageTitle = (tab: NavigationTab) => {
    switch (tab) {
      case 'dashboard':
        return 'صفحه فعال: پیشخوان اصلی خانه و راهبری CDE';
      case 'cde':
        return 'صفحه فعال: محیط داده مشترک (CDE) - ISO 19650';
      case 'bim':
        return 'صفحه فعال: تداخلات و مدل‌های سه‌بعدی BIM';
      case 'approvals':
        return 'صفحه فعال: تاییدات اسناد CDE';
      case 'permissions':
        return 'صفحه فعال: مدیریت دسترسی و حاکمیت CDE';
      case 'portfolio':
        return 'صفحه فعال: پورتفوی جامع پروژه‌ها';
      case 'login':
        return 'ورود به سامانه';
      default:
        return 'محیط داده مشترک (CDE)';
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4 lg:px-6 select-none font-['Markazi_Text',sans-serif] antialiased" dir="rtl">
      {/* Right side: Logo, Project Switcher, Active Page Badge */}
      <div className="flex items-center gap-3 lg:gap-4 shrink-0">
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center pl-3 border-l border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img
            alt="لوگوی گروه ساختمانی باران"
            className="h-9 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDHmvPAvF_cpDuaXL2aFP1WfkKDaEbGo-Yhv1H7Z0Z2gRbY3s-W4VDRYJCAmlp18TbfIzuHjMB28Z7GjKhuPBqaq6hmBLzFBwC-a_KykN7289zrF9-4yb-8t8fB_3-a3pAC08_RNWypgMAlgd2zQITjzgGgE5qI2aw7uNLCK-Pad72ceGdCc7XkxjJ8JJrcw2VQ5OfxAyfGd9AVUaKCzSt9_XXA-0Dcv0_S8urpDKECytCJsfj_CFkckY_m26R29SlPtHskDnRqHBMqA"
          />
        </div>

        {/* Project Switcher button */}
        <button
          onClick={onOpenProjectSwitcher}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-slate-800 border border-slate-200 text-xs shadow-2xs cursor-pointer group"
          title="تغییر پروژه جاری"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00716B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00716B]"></span>
          </span>
          <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#00716B] transition-colors">
            {currentProject.name}
          </span>
          <span className="text-[11px] text-slate-500 font-medium font-mono hidden sm:inline">
            ({currentProject.code} • فعال)
          </span>
          <span className="material-symbols-outlined text-base text-slate-400">unfold_more</span>
        </button>

        {/* Active page badge */}
        <span className="hidden xl:inline-flex text-xs font-bold px-3 py-1 rounded-lg bg-[#00716B]/10 text-[#00716B] border border-[#00716B]/20">
          • {getPageTitle(currentTab)}
        </span>
      </div>

      {/* Middle: Global Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-lg mx-4 lg:mx-6">
        <button
          onClick={onOpenSearch}
          className="relative w-full flex items-center bg-slate-50 hover:bg-white hover:border-[#00716B] text-slate-800 text-xs sm:text-sm rounded-xl pr-10 pl-12 py-2 outline-none border border-slate-200 transition-all text-right shadow-2xs group cursor-pointer"
        >
          <span className="material-symbols-outlined absolute right-3 text-slate-400 text-lg pointer-events-none group-hover:text-[#00716B] transition-colors">
            search
          </span>
          <span className="text-slate-400 font-sans text-xs truncate">
            جستجو...
          </span>
          <span className="absolute left-2.5 px-1.5 py-0.5 rounded bg-slate-200/70 text-[11px] text-slate-600 font-sans font-medium">
            ⌘K
          </span>
        </button>
      </div>

      {/* Left side: Upload Button, Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Upload CTA */}
        <button
          onClick={onOpenUpload}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#00716B] hover:bg-[#005e59] text-white shadow-xs transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">cloud_upload</span>
          <span>بارگذاری سند جدید</span>
        </button>

        {/* Notifications Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          title="اعلان‌ها"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-slate-200 mx-0.5"></div>

        {/* User Profile */}
        <div className="relative">
          <div
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition-colors border border-transparent hover:border-slate-200 select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#00716B]/15 text-[#00716B] flex items-center justify-center font-bold text-sm">
              <span className="material-symbols-outlined text-xl">person</span>
            </div>
            <div className="hidden lg:flex flex-col text-right leading-tight">
              <span className="text-xs font-bold text-slate-900 leading-tight">مهندس سهراب پارسا</span>
              <span className="text-[11px] text-[#00716B] leading-tight font-medium">مدیر ارشد طراحی و راهبری CDE</span>
            </div>
            <span className="material-symbols-outlined text-base text-slate-400 hidden sm:inline">
              expand_more
            </span>
          </div>

          {/* User Profile Menu Dropdown */}
          {userMenuOpen && (
            <div
              className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-right font-sans"
              onClick={() => setUserMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">مهندس سهراب پارسا</div>
                <div className="text-[11px] text-[#00716B] font-mono">sohrab.parsa@baran.ir</div>
                <div className="text-[10px] text-slate-400 mt-0.5">سطح دسترسی: مدیر ارشد CDE و BIM (Level 5)</div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-right"
                >
                  <span className="material-symbols-outlined text-base text-slate-400">space_dashboard</span>
                  <span>پیشخوان شخصی</span>
                </button>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-right"
                >
                  <span className="material-symbols-outlined text-base text-slate-400">apartment</span>
                  <span>درگاه پروژه‌های هلدینگ</span>
                </button>
                <button
                  onClick={() => onNavigate('permissions')}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-right"
                >
                  <span className="material-symbols-outlined text-base text-slate-400">admin_panel_settings</span>
                  <span>تنظیمات حاکمیت داده‌ها</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => onNavigate('login')}
                  className="w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 text-right font-bold"
                >
                  <span className="material-symbols-outlined text-base text-red-600">logout</span>
                  <span>خروج یا تغییر حساب کاربری</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
