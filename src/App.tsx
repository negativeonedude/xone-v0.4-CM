import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { NavigationTab, Project, CdeDocument } from './types';
import { PROJECTS, CDE_DOCUMENTS, APPROVAL_ITEMS, DEFAULT_IPC_CERTIFICATE } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast, ToastMessage } from './components/Toast';
import { ProjectSwitcherModal } from './components/ProjectSwitcherModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { UploadModal } from './modals/UploadModal';
import { DocumentDossierModal } from './modals/DocumentDossierModal';
import { ExcelIpcModal } from './modals/ExcelIpcModal';

// Views
import { DashboardView } from './views/DashboardView';
import { CdeFilesView } from './views/CdeFilesView';
import { ClashDetectionView } from './views/ClashDetectionView';
import { ApprovalsView } from './views/ApprovalsView';
import { PermissionsView } from './views/PermissionsView';
import { PortfolioView } from './views/PortfolioView';
import { LoginView } from './views/LoginView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('login');
  const [currentProject, setCurrentProject] = useState<Project>(PROJECTS[0]);
  const [documents, setDocuments] = useState<CdeDocument[]>(CDE_DOCUMENTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [isProjectSwitcherOpen, setIsProjectSwitcherOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDossierDocId, setSelectedDossierDocId] = useState<string | null>(null);
  const [isExcelIpcOpen, setIsExcelIpcOpen] = useState(false);

  // Quick prototype guide toggle
  const [showDemoTour, setShowDemoTour] = useState(false);
  const [isBarMinimized, setIsBarMinimized] = useState(false);

  const pendingApprovalsCount = APPROVAL_ITEMS.filter(
    (item) => item.status === 'pending'
  ).length;

  const addToast = (title: string, description: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, description, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Smooth scrolling (Lenis)
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });
    let raf: number;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsProjectSwitcherOpen(false);
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsUploadOpen(false);
        setSelectedDossierDocId(null);
        setIsExcelIpcOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenDocumentDossier = (docId: string) => {
    setSelectedDossierDocId(docId);
  };

  const handleOpenExcelIpc = (_doc?: CdeDocument) => {
    setIsExcelIpcOpen(true);
  };

  const handleDocumentCreated = (newDoc: CdeDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    addToast(
      'سند با موفقیت به CDE افزوده شد',
      `مدرک «${newDoc.isoCode}» در وضعیت بارگذاری قرار گرفت و کد اعتبارسنجی SHA-256 ثبت شد.`,
      'success'
    );
  };

  const selectedDocument =
    documents.find((d) => d.id === selectedDossierDocId) ||
    CDE_DOCUMENTS.find((d) => d.id === selectedDossierDocId) ||
    (selectedDossierDocId ? documents[0] : null);

  // If in login view, render login view directly without sidebar/header
  if (currentTab === 'login') {
    return (
      <div className="min-h-screen bg-[#070e17] text-slate-100 font-sans selection:bg-[#00f2fe]/30 selection:text-white animate-dissolve">
        <LoginView
          onLoginSuccess={() => {
            // First proceed to portfolio (project selection), from which user selects project and goes to dashboard (home)
            setCurrentTab('portfolio');
            addToast(
              'ورود موفق به سیستم',
              'به سامانه یکپارچه باران خوش آمدید. لطفاً پروژه مورد نظر خود را انتخاب نمایید.',
              'success'
            );
          }}
          onNavigate={(tab) => setCurrentTab(tab)}
          onTriggerToast={addToast}
        />
        <Toast toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E3E8EF] text-slate-800 flex flex-col font-sans selection:bg-[#00716B]/20 selection:text-[#00716B] antialiased" dir="rtl">
      {/* Top Header - Fixed at top-0 h-16 (64px) */}
      <Header
        currentTab={currentTab}
        currentProject={currentProject}
        onOpenProjectSwitcher={() => setIsProjectSwitcherOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onNavigate={(tab) => setCurrentTab(tab)}
        unreadCount={pendingApprovalsCount}
      />

      {/* Vertical Sidebar on the right - Fixed at right-0 top-16 bottom-0 w-16 (64px) */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main Body - Padded with pt-16 (64px) for Header and pr-16 (64px) for Sidebar */}
      <div className="flex-1 pt-16 pr-16 min-h-screen bg-[#E3E8EF] flex flex-col">
        {/* Main Content Area with generous bottom clearance (pb-28) and minimal dissolve page transition */}
        <main key={currentTab} className="flex-1 w-full pb-28 bg-[#E3E8EF] animate-dissolve">
          {currentTab === 'dashboard' && (
            <DashboardView
              currentProject={currentProject}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenDocumentDossier={handleOpenDocumentDossier}
              onTriggerToast={addToast}
              onOpenExcelIpc={handleOpenExcelIpc}
            />
          )}

          {currentTab === 'cde' && (
            <CdeFilesView
              documents={documents}
              onOpenDocumentDossier={handleOpenDocumentDossier}
              onOpenUpload={() => setIsUploadOpen(true)}
              onTriggerToast={addToast}
              onOpenExcelIpc={handleOpenExcelIpc}
            />
          )}

          {currentTab === 'bim' && (
            <ClashDetectionView
              onTriggerToast={addToast}
            />
          )}

          {currentTab === 'approvals' && (
            <ApprovalsView
              onOpenDocumentDossier={handleOpenDocumentDossier}
              onTriggerToast={addToast}
              onOpenExcelIpc={handleOpenExcelIpc}
            />
          )}

          {currentTab === 'permissions' && (
            <PermissionsView onTriggerToast={addToast} />
          )}

          {currentTab === 'portfolio' && (
            <PortfolioView
              currentProject={currentProject}
              onSelectProject={(proj) => {
                setCurrentProject(proj);
                addToast('تغییر پروژه فعال', `پروژه «${proj.name}» به عنوان پروژه فعال انتخاب شد.`, 'info');
              }}
              onNavigate={(tab) => setCurrentTab(tab)}
              onTriggerToast={addToast}
              onOpenExcelIpc={handleOpenExcelIpc}
              onOpenDocumentDossier={handleOpenDocumentDossier}
            />
          )}
        </main>
      </div>

      {/* Interactive Prototype Screen Switcher Pill (Floating bar at bottom for instant reviewer navigation) */}
      {isBarMinimized ? (
        <button
          onClick={() => setIsBarMinimized(false)}
          className="fixed bottom-3 right-20 z-40 bg-[#0d1825]/95 hover:bg-[#0d1825] border border-[#00f2fe]/40 rounded-full px-3 py-1.5 shadow-xl text-xs text-[#00f2fe] flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
          title="باز کردن نوار ناوبری ارائه‌پذیر"
        >
          <span className="material-symbols-outlined text-[15px] animate-pulse">auto_awesome</span>
          <span className="font-bold">منوی ارائه‌پذیر (CDE Screens)</span>
        </button>
      ) : (
        <div className="fixed bottom-3 right-20 z-40 bg-[#0d1825]/95 backdrop-blur-md border border-[#00f2fe]/30 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1">
          <div className="px-2.5 py-1 text-[11px] font-bold text-[#00f2fe] flex items-center gap-1.5 border-l border-white/10 ml-1">
            <span className="material-symbols-outlined text-[15px] animate-pulse">auto_awesome</span>
            <span>نسخه آزمایشی CDE</span>
          </div>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium ${
              currentTab === 'dashboard'
                ? 'bg-[#00f2fe] text-[#0a111a] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="صفحه اصلی و داشبورد اجرایی"
          >
            ۱. داشبورد اصلی
          </button>

          <button
            onClick={() => setCurrentTab('cde')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium ${
              currentTab === 'cde'
                ? 'bg-[#00f2fe] text-[#0a111a] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="مخزن فایل‌های CDE و ساختار ISO 19650"
          >
            ۲. مخزن CDE
          </button>

          <button
            onClick={() => setCurrentTab('bim')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium ${
              currentTab === 'bim'
                ? 'bg-[#00f2fe] text-[#0a111a] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="هماهنگی BIM و کلش‌گیری سه‌بعدی"
          >
            ۳. تداخلات BIM
          </button>

          <button
            onClick={() => setCurrentTab('approvals')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium relative ${
              currentTab === 'approvals'
                ? 'bg-[#00f2fe] text-[#0a111a] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="کارتابل تاییدات و گردش کار ISO"
          >
            ۴. تایید مدارک
            {pendingApprovalsCount > 0 && (
              <span className="inline-block mr-1 px-1 py-0.2 bg-rose-500 text-white text-[10px] rounded-full">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('permissions')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium ${
              currentTab === 'permissions'
                ? 'bg-[#00f2fe] text-[#0a111a] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="حاکمیت پوشه‌ها و دسترسی نقش‌ها"
          >
            ۵. ماتریس دسترسی
          </button>

          <button
            onClick={() => setCurrentTab('portfolio')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium ${
              currentTab === 'portfolio'
                ? 'bg-[#00f2fe] text-[#0a111a] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="پرتال جامع چندپروژه‌ای باران"
          >
            ۶. پورتفوی پروژه‌ها
          </button>

          <button
            onClick={() => setCurrentTab('login')}
            className="px-2 py-1 text-xs rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all font-medium"
            title="مشاهده صفحه ورود پرسنلی"
          >
            ۷. صفحه ورود
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-0.5"></div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-2 py-1 text-xs rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition-all flex items-center gap-1 font-medium"
            title="تست ویزارد ۲ مرحله‌ای بارگذاری مدارک"
          >
            <span className="material-symbols-outlined text-[14px]">cloud_upload</span>
            <span>بارگذاری مدرک</span>
          </button>

          <button
            onClick={() => handleOpenDocumentDossier('doc-01')}
            className="px-2 py-1 text-xs rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 transition-all flex items-center gap-1 font-medium"
            title="مشاهده شناسنامه و پرونده فنی Revit"
          >
            <span className="material-symbols-outlined text-[14px]">description</span>
            <span>پرونده فنی</span>
          </button>

          <button
            onClick={() => handleOpenExcelIpc()}
            className="px-2 py-1 text-xs rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/40 border border-emerald-500/30 transition-all flex items-center gap-1 font-medium"
            title="مشاهده قالب اکسل صورت وضعیت مالی (Interim Payment Certificate)"
          >
            <span className="material-symbols-outlined text-[14px]">table_chart</span>
            <span>اکسل صورت‌وضعیت</span>
          </button>

          <button
            onClick={() => setShowDemoTour((v) => !v)}
            className="px-1.5 py-1 text-xs rounded-lg text-slate-400 hover:text-white transition-all"
            title="راهنمای پروتوتایپ"
          >
            <span className="material-symbols-outlined text-[16px]">info</span>
          </button>

          <button
            onClick={() => setIsBarMinimized(true)}
            className="px-1.5 py-1 text-xs rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title="کوچک‌کردن نوار"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Guide dialog if clicked */}
      {showDemoTour && (
        <div className="fixed bottom-16 right-20 z-50 w-96 bg-[#0c1622] border border-[#00f2fe]/40 rounded-2xl p-4 shadow-2xl animate-fade-in text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-2 text-[#00f2fe] font-bold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>راهنمای نسخه ارائه‌پذیر Xone CDE</span>
            </div>
            <button
              onClick={() => setShowDemoTour(false)}
              className="text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <p className="text-slate-300 mb-2 leading-relaxed">
            این پروتوتایپ کلیک‌پذیر به‌طور دقیق بر مبنای طراحی سیستم‌های محیط داده مشترک (CDE) گروه ساختمانی باران و استاندارد <strong>ISO 19650</strong> طراحی شده است:
          </p>
          <ul className="space-y-1.5 text-slate-400 mb-3 pr-2 list-disc list-inside">
            <li><strong className="text-white">داشبورد اجرایی:</strong> کنترل زنده دوربین‌های کارگاه، گزارش بتن‌ریزی، وضعیت صورت‌وضعیت‌ها و فرآیندهای حیاتی.</li>
            <li><strong className="text-white">مخزن CDE:</strong> کاوشگر پوشه‌های WBS طبق فرمت نام‌گذاری ملی ISO، پیش‌نمایش مدارک و فیلتر رشته‌ها.</li>
            <li><strong className="text-white">BIM & کلش:</strong> ماتریس ریسک و برخورد دیسیپلین‌ها همراه با ویوور سه‌بعدی تعاملی.</li>
            <li><strong className="text-white">تایید مدارک:</strong> کارتابل تفکیک‌شده تایید، ابلاغ، ارجاع، و تاییدات فوری کمتر از ۲۴ ساعت.</li>
            <li><strong className="text-white">شناسنامه فنی:</strong> پرونده جامع شامل هش SHA-256، آرشیو نسخه، گردش کار و بارکد ردیابی.</li>
          </ul>
          <div className="text-[11px] text-teal-400 bg-teal-500/10 p-2 rounded-lg border border-teal-500/20">
            💡 برای جستجوی فوری در کل مدارک و کدهای WBS کلید <kbd className="px-1.5 py-0.5 bg-black/40 rounded border border-white/20">Cmd + K</kbd> را فشار دهید.
          </div>
        </div>
      )}

      {/* Global Modals */}
      <ProjectSwitcherModal
        isOpen={isProjectSwitcherOpen}
        onClose={() => setIsProjectSwitcherOpen(false)}
        currentProject={currentProject}
        onSelectProject={(proj) => {
          setCurrentProject(proj);
          addToast('تغییر پروژه فعال', `پروژه «${proj.name}» به عنوان پروژه فعال انتخاب شد.`, 'info');
        }}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenDocumentDossier={handleOpenDocumentDossier}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenDocumentDossier={handleOpenDocumentDossier}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocumentCreated={handleDocumentCreated}
      />

      <DocumentDossierModal
        isOpen={!!selectedDossierDocId}
        onClose={() => setSelectedDossierDocId(null)}
        document={selectedDocument}
        onDownload={(docTitle) => {
          addToast('دانلود آغاز شد', `در حال دریافت فایل «${docTitle}» از سرور امن CDE...`, 'success');
        }}
        onOpen3dViewer={() => {
          setSelectedDossierDocId(null);
          setCurrentTab('bim');
          addToast('انتقال به نمایشگر ۳بعدی', 'مدل BIM هماهنگ باز شد.', 'info');
        }}
      />

      <ExcelIpcModal
        isOpen={isExcelIpcOpen}
        onClose={() => setIsExcelIpcOpen(false)}
        ipcData={DEFAULT_IPC_CERTIFICATE}
        onTriggerToast={addToast}
      />

      {/* Global Toasts */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
