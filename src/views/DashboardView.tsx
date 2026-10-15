import React, { useState } from 'react';
import { Project, NavigationTab, ClashPreset } from '../types';

interface DashboardViewProps {
  currentProject: Project;
  onNavigate: (tab: NavigationTab) => void;
  onOpenDocumentDossier: (docId: string) => void;
  onOpenUpload: () => void;
  onTriggerToast: (title: string, desc: string, type?: 'success' | 'error' | 'info') => void;
  onOpenExcelIpc?: () => void;
  onOpenClashFilters?: (preset: ClashPreset) => void;
}

type CameraKey = 'cam1' | 'cam2' | 'drone';

const CAMERAS: Record<CameraKey, { label: string; zone: string; img: string }> = {
  cam1: {
    label: 'دوربین ۱: شمال کارگاه',
    zone: 'پارت B دال ۲۲',
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1UvcaUhBYsITuZHEDLEJ-EivrwVhJLmQSNaFwAj9Wkxvzl0aTZEtrwiVhhoY_9IXZUGIRvYzbJFImtVCqqQPNgm4LVnQkokci8Ls8ylBci9yBm129hlAl64fZ2pBhmHXxL9LWtoq3oPPHziRqDCSfeCtcDeVqE1_eSwv9dDRdnkx-mkoqGIr6Ct66mS4hlBG6EhC3B--3vhrYN0_qoRWCWgeLLoxEkSCYmd689YMU1a4hZVJ_ORTE7oDtI',
  },
  cam2: {
    label: 'دوربین ۲: جنوب',
    zone: 'اسکلت طبقه ۲۱',
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1UvcaUhBYsITuZHEDLEJ-EivrwVhJLmQSNaFwAj9Wkxvzl0aTZEtrwiVhhoY_9IXZUGIRvYzbJFImtVCqqQPNgm4LVnQkokci8Ls8ylBci9yBm129hlAl64fZ2pBhmHXxL9LWtoq3oPPHziRqDCSfeCtcDeVqE1_eSwv9dDRdnkx-mkoqGIr6Ct66mS4hlBG6EhC3B--3vhrYN0_qoRWCWgeLLoxEkSCYmd689YMU1a4hZVJ_ORTE7oDtI',
  },
  drone: {
    label: 'پهپاد سایت (Drone)',
    zone: 'پایش هوایی کل سایت',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWVorSojtxKqm7i8PyUBYa15o4MYCGtdqqsyFRykz08b0VG1fnW1Rgg_SM0ACfwJNEmwtJlBJ3TtSJSgMb4JPZyIoPvdmbdOy6FiJSI3v8HyMlc7eFQ8tzR1XX8gHsXdyf7zSxsixJ8Q5Qm1NxpX8GlHGMwGmEP3zrEKE73iQc0uGR-PMiUqKRoiJehLxtwAKA4YLuRj_9OvRxXyd0xNKgxlKxu5-KYnKfGKATu711cVxNM9j0dVzj-8Yh0rTjv4kbnutDO9LUioovhQ',
  },
};

interface WorkflowRow {
  id: string;
  title: string;
  discipline: string;
  provider: string;
  slaLabel: string;
  slaTone: 'urgent' | 'ok';
  slaIcon: string;
}

const WORKFLOW_ACTIVE: WorkflowRow[] = [
  {
    id: 'wf-1',
    title: 'صورت‌وضعیت شماره ۵ موقت کارکرد اسکلت بتنی پارت B',
    discipline: 'مالی / قرارداد',
    provider: 'سازه‌پردازان پارس (مهندس علیزاده)',
    slaLabel: '۱۲ ساعت تاخیر',
    slaTone: 'urgent',
    slaIcon: 'hourglass_top',
  },
  {
    id: 'wf-2',
    title: 'گزارش روزانه عملیات کارگاهی بتن‌ریزی سقف طبقه ۲۲',
    discipline: 'اجرای ابنیه',
    provider: 'سرپرست کارگاه (مهندس محمدی)',
    slaLabel: '۴ ساعت باقی‌مانده',
    slaTone: 'urgent',
    slaIcon: 'warning',
  },
  {
    id: 'wf-3',
    title: 'تاییدیه مصالح (Material Submittal) میلگردهای A3 ذوب‌آهن',
    discipline: 'متریال و QC',
    provider: 'مهندسین مشاور پایا (ناظر مقیم)',
    slaLabel: '۱ روز باقی‌مانده',
    slaTone: 'ok',
    slaIcon: 'schedule',
  },
  {
    id: 'wf-4',
    title: 'نقشه شاپ‌دراوینگ اجرایی رایزرها و داکت تاسیسات طبقه ۲۲',
    discipline: 'نقشه‌های شاپ / BIM',
    provider: 'مهندسین مشاور پایا (دفتر فنی پیمانکار)',
    slaLabel: '۶ ساعت تاخیر',
    slaTone: 'urgent',
    slaIcon: 'priority_high',
  },
  {
    id: 'wf-5',
    title: 'دستور تغییر پیشنهادی #۴۲ اصلاح سنگ تراورتن نمای جنوبی',
    discipline: 'معماری / قرارداد',
    provider: 'آتلیه طراحان معاصر (طراح نما)',
    slaLabel: '۲ روز باقی‌مانده',
    slaTone: 'ok',
    slaIcon: 'schedule',
  },
];

const WORKFLOW_ARCHIVE: WorkflowRow[] = [
  {
    id: 'ar-1',
    title: 'صورت‌وضعیت شماره ۴ (سازه دال‌های پس‌کشیده) — تسویه شده',
    discipline: 'مالی / قرارداد',
    provider: 'سازه‌پردازان پارس (مهندس علیزاده)',
    slaLabel: 'تایید شده',
    slaTone: 'ok',
    slaIcon: 'check_circle',
  },
  {
    id: 'ar-2',
    title: 'تاییدیه مصالح قالب‌مدولار آلومینیومی طبقات ۱۸ تا ۲۴',
    discipline: 'متریال و QC',
    provider: 'مهندسین مشاور پایا (ناظر مقیم)',
    slaLabel: 'تایید شده',
    slaTone: 'ok',
    slaIcon: 'check_circle',
  },
  {
    id: 'ar-3',
    title: 'نقشه شاپ اجرایی داربست‌های نما (Rev 02)',
    discipline: 'نقشه‌های شاپ / BIM',
    provider: 'دفتر فنی پیمانکار',
    slaLabel: 'تایید شده',
    slaTone: 'ok',
    slaIcon: 'check_circle',
  },
];

const MILESTONES = [
  { title: 'گودبرداری، نیلینگ و فونداسیون رادیه', done: true },
  { title: 'اسکلت زیرزمین‌ها تا تراز همکف (±۰.۰۰)', done: true },
  { title: 'بتن‌ریزی سقف طبقه ۲۲ و تکمیل اسکلت', done: false },
  { title: 'نصب رایزرهای تاسیسات و باس‌داکت برق', done: false },
  { title: 'تیغه‌چینی وال‌پست‌ها و نماسازی بیرونی', done: false },
  { title: 'راه‌اندازی آسانسورها، تست گرم و تحویل موقت', done: false },
];

const DISCIPLINE_PROGRESS = [
  { label: 'فاز فونداسیون و دیوارهای حائل', pct: 100, color: 'bg-[#00716B]', badge: 'تکمیل', badgeTone: 'bg-teal-50 text-[#00716B] border-teal-200/60' },
  { label: 'اسکلت بتنی و سقف‌ها (تا ط ۲۲)', pct: 88, color: 'bg-[#00716B]', badge: 'زون A/B فعال', badgeTone: 'bg-teal-50 text-[#00716B] border-teal-200/60' },
  { label: 'تاسیسات مکانیکی و شفت‌های رایزر', pct: 42, color: 'bg-teal-600', badge: 'در جریان', badgeTone: 'bg-amber-50 text-amber-700 border-amber-200/60' },
  { label: 'نازک‌کاری، وال‌پست و تیغه‌چینی', pct: 15, color: 'bg-slate-400', badge: 'شروع اولیه', badgeTone: 'bg-slate-100 text-slate-600 border-slate-200' },
];

const toFa = (n: number) => n.toLocaleString('fa-IR');

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentProject,
  onNavigate,
  onOpenDocumentDossier,
  onTriggerToast,
  onOpenExcelIpc,
  onOpenClashFilters,
}) => {
  const [activeCamera, setActiveCamera] = useState<CameraKey>('cam1');
  const [bimLayerArc, setBimLayerArc] = useState(true);
  const [bimLayerStr, setBimLayerStr] = useState(true);
  const [bimLayerMep, setBimLayerMep] = useState(true);
  const [workflowTab, setWorkflowTab] = useState<'active' | 'archive'>('active');
  const [workflowQuery, setWorkflowQuery] = useState('');
  const [checkedRows, setCheckedRows] = useState<string[]>([]);

  const camera = CAMERAS[activeCamera];
  const rows = (workflowTab === 'active' ? WORKFLOW_ACTIVE : WORKFLOW_ARCHIVE).filter((r) =>
    workflowQuery.trim() === '' ||
    r.title.includes(workflowQuery.trim()) ||
    r.provider.includes(workflowQuery.trim())
  );
  const pendingCount = WORKFLOW_ACTIVE.length;

  const toggleRow = (id: string) =>
    setCheckedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));

  const handleReview = (row: WorkflowRow) => {
    onTriggerToast(
      'بازکردن جریان تایید',
      `مدرک «${row.title}» برای اقدام مدیر ساخت باز شد.`,
      'info'
    );
    onNavigate('approvals');
  };

  const handleBatchApprove = () => {
    if (checkedRows.length === 0) {
      onTriggerToast('موردی انتخاب نشده', 'ابتدا یک یا چند مدرک را از جدول انتخاب کنید.', 'error');
      return;
    }
    onTriggerToast(
      'تایید گروهی انجام شد',
      `${toFa(checkedRows.length)} مدرک با یادداشت مدیر ساخت تایید و در CDE ثبت شد.`,
      'success'
    );
    setCheckedRows([]);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-8 p-4 sm:p-6 lg:p-7 max-w-[1700px] mx-auto" dir="rtl">
      {/* =========================================================
          PROJECT HEADER RIBBON
          ========================================================= */}
      <section className="w-full bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#00716B] text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">apartment</span>
            <span>{currentProject.code || 'PRJ-1042'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-900">
            <span className="font-bold text-sm">شناسنامه کارگاهی:</span>
            <span className="text-xs text-slate-600 font-medium">{currentProject.name}</span>
          </div>
          <div className="hidden sm:block h-3.5 w-px bg-slate-200"></div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span className="font-bold text-slate-700">پیمانکار اصلی:</span>
            <span>شرکت سازه‌پردازان پارس</span>
          </div>
          <div className="hidden sm:block h-3.5 w-px bg-slate-200"></div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span className="font-bold text-slate-700">فاز عملیاتی:</span>
            <span>اسکلت طبقه ۲۲ و تاسیسات رایزرها</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-teal-50 text-[#00716B] border border-teal-200/60 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00716B] animate-pulse"></span>
            <span>وضعیت: فعال و دو شیفت کاری</span>
          </div>
          <div className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#00716B]">verified_user</span>
            <span>HSE گرید A+</span>
          </div>
          <div className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg text-xs font-mono">ISO 19650-2</div>
        </div>
      </section>

      {/* =========================================================
          ROW 1: 5 KPI CARDS
          ========================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Pending CM Sign-off */}
        <div
          onClick={() => onNavigate('approvals')}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">اقدام مدیر ساخت</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60">
              <span className="material-symbols-outlined text-lg">timer</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-['Markazi_Text'] text-[#00716B]">۵ مورد</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">در صف تایید نهایی کارگاه</div>
            <p className="text-[11px] text-amber-800 bg-amber-50 rounded px-2 py-0.5 mt-2 inline-block font-medium border border-amber-200/50">
              ۳ مورد SLA فوری
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>۲ صورت‌وضعیت • ۱ روزانه</span>
            <span className="font-bold text-[#00716B]">۱ تغییر • ۱ شاپ</span>
          </div>
        </div>

        {/* KPI 2: Physical Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">پیشرفت فیزیکی اجرا</span>
            <span className="w-8 h-8 rounded-lg bg-teal-50 text-[#00716B] flex items-center justify-center border border-teal-100">
              <span className="material-symbols-outlined text-lg">construction</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="flex items-center justify-between gap-3 mt-1">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold font-['Markazi_Text'] text-slate-800">۶۲.۴۰٪</span>
                </div>
                <span className="text-[11px] font-medium text-emerald-600 mt-0.5">+۱.۸٪ این هفته</span>
              </div>
              <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full shadow-inner border border-slate-200/60"
                  style={{ background: 'conic-gradient(#00716B 0% 62.4%, #e2e8f0 62.4% 100%)' }}
                ></div>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>خط مبنا WBS: ۶۵.۸٪</span>
            <span className="text-rose-600 font-bold font-mono">-۳.۴٪ انحراف</span>
          </div>
        </div>

        {/* KPI 3: Contractor Financial Progress */}
        <div
          onClick={() => onOpenExcelIpc?.()}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">پیشرفت مالی قرارداد</span>
            <span className="w-8 h-8 rounded-lg bg-teal-50 text-[#00716B] flex items-center justify-center border border-teal-100">
              <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="flex items-center justify-between gap-3 mt-1">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold font-['Markazi_Text'] text-slate-800">۵۸.۵٪</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5">۳.۴ از ۵.۸ م.ت</span>
              </div>
              <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full shadow-inner border border-slate-200/60"
                  style={{ background: 'conic-gradient(#00716B 0% 58.5%, #e2e8f0 58.5% 100%)' }}
                ></div>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>تسویه اخیر</span>
            <span className="font-bold text-slate-700">ص.و ۴ (سازه دال)</span>
          </div>
        </div>

        {/* KPI 4: Change Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">دستورات تغییر (CO)</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <span className="material-symbols-outlined text-lg">published_with_changes</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-['Markazi_Text'] text-amber-700">۴ مورد</span>
              <span className="text-xs text-slate-500">+۱۴ روز تاخیر</span>
            </div>
            <p className="text-[11px] text-amber-800 bg-amber-50 rounded px-2 py-0.5 mt-2 inline-block font-medium border border-amber-200/50">
              +۱,۲۵۰,۰۰۰,۰۰۰ ت اثر مالی
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>دستور تغییر جاری</span>
            <span className="font-bold text-slate-700">#۴۲ نمای جنوبی</span>
          </div>
        </div>

        {/* KPI 5: SLA Overdue */}
        <div
          onClick={() => onNavigate('approvals')}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">معوقات زمانی (SLA)</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
              <span className="material-symbols-outlined text-lg">hourglass_bottom</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-['Markazi_Text'] text-rose-600">۳ مدرک</span>
              <span className="text-xs text-rose-700 font-medium">هشدار تاخیر</span>
            </div>
            <p className="text-[11px] text-rose-700 bg-rose-50 rounded px-2 py-0.5 mt-2 inline-block font-medium border border-rose-200/50">
              نقشه ازبیلت شفت (۸ روز تاخیر)
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>اخطار انطباق</span>
            <span className="font-bold text-rose-600">صدور اخطار تاخیر</span>
          </div>
        </div>
      </section>

      {/* =========================================================
          ROW 2: LIVE SITE MONITORING (IoT Telemetry & Camera Stream)
          ========================================================= */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden p-5 lg:p-6 transition-shadow hover:shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00716B]/10 text-[#00716B] flex items-center justify-center border border-[#00716B]/20">
              <span className="material-symbols-outlined text-[22px]">videocam</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">پایش زنده و هوشمند وضعیت کارگاه</h2>
              <p className="text-xs text-slate-500 mt-0.5">مخابره برخط دوربین‌های هوشمند کارگاهی مستقر در سایت پروژه</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
              {(Object.keys(CAMERAS) as CameraKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCamera(key)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeCamera === key
                      ? 'bg-white text-[#00716B] font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {CAMERAS[key].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Live Camera Viewport */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-950 border border-slate-200/90 shadow-inner group">
              <img
                alt={camera.label}
                className="w-full h-full object-cover rounded-xl opacity-90 transition-transform duration-700 group-hover:scale-[1.02]"
                src={camera.img}
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-2 border border-white/10 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="font-bold">🔴 {camera.label}</span>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 border border-white/10">
                  <span className="material-symbols-outlined text-[14px] text-amber-400 inline-block align-middle">schedule</span> زنده: ۲ دقیقه پیش
                </div>
              </div>
              <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-slate-200 border border-white/10 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">construction</span>
                <span className="font-mono text-[11px]">{camera.zone}</span>
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 shadow-2xl flex items-center gap-3 text-slate-200 text-xs whitespace-nowrap z-10">
                <button
                  type="button"
                  onClick={() => onTriggerToast('نمایش تمام‌صفحه', 'پخش زنده دوربین در حالت تمام‌صفحه آغاز شد.', 'info')}
                  className="hover:text-teal-300 flex items-center gap-1 transition-colors flex-shrink-0 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                  <span>تمام‌صفحه</span>
                </button>
                <span className="text-slate-600 flex-shrink-0">|</span>
                <button
                  type="button"
                  onClick={() => onTriggerToast('ضبط تایم‌لپس', 'ضبط تایم‌لپس دوربین فعال شد و در CDE ذخیره می‌شود.', 'success')}
                  className="hover:text-teal-300 flex items-center gap-1 transition-colors flex-shrink-0 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[16px]">videocam</span>
                  <span>ضبط تایم‌لپس</span>
                </button>
                <span className="text-slate-600 flex-shrink-0">|</span>
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>کیفیت HD 1080p
                </span>
              </div>
            </div>
          </div>

          {/* Environmental Telemetry & Physical Compliance */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="bg-slate-50/90 rounded-xl border border-slate-200/80 p-4 space-y-3 flex-1 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00716B]/10 text-[#00716B] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">routine</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">ایستگاه اینترنت اشیاء کارگاه و تله‌متری محیطی</h4>
                    <span className="text-[10px] text-slate-500 font-mono">IoT Sensor Station #04</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>مجوز HSE تایید
                </span>
              </div>

              {/* 3 weather metric boxes */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-xs hover:border-[#00716B]/30 transition-colors">
                  <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                    <span className="material-symbols-outlined text-[19px]">wb_sunny</span>
                    <span className="font-bold font-['Markazi_Text'] text-slate-900 text-[18px]">۲۸°C</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-600 block">دمای محیط</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">صاف و آفتابی</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-xs hover:border-[#00716B]/30 transition-colors">
                  <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                    <span className="material-symbols-outlined text-[19px]">humidity_percentage</span>
                    <span className="font-bold font-['Markazi_Text'] text-slate-900 text-[18px]">۳۲٪</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-600 block">رطوبت نسبی</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">شرایط ایده‌آل بتن</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-xs hover:border-[#00716B]/30 transition-colors">
                  <div className="flex items-center justify-center gap-1 text-[#00716B] mb-1">
                    <span className="material-symbols-outlined text-[19px]">air</span>
                    <span className="font-bold font-['Markazi_Text'] text-slate-900 text-[18px]">۱۲ <span className="text-xs font-mono">km/h</span></span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-600 block">سرعت باد</span>
                  <span className="text-[9px] text-emerald-700 mt-0.5 block font-bold">مجاز تاورکرین</span>
                </div>
              </div>

              {/* AQI bar */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] font-bold text-slate-700">شاخص کیفیت هوا:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 text-xs">AQI: 65</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200/60">سالم</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full rounded-r-full" style={{ width: '35%' }}></div>
                  <div className="bg-amber-400 h-full opacity-40" style={{ width: '25%' }}></div>
                  <div className="bg-rose-400 h-full opacity-30" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>

            {/* Physical Compliance Card */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#00716B] flex items-center justify-center border border-teal-100">
                    <span className="material-symbols-outlined text-[18px]">model_training</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">انطباق فیزیکی کارگاه (انطباق با مدل اجرایی)</h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">trending_up</span>+۱.۸٪ هفتگی
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-['Markazi_Text'] text-[#00716B]">۷۸.۵٪</span>
                  <span className="text-xs font-medium text-slate-500">انطباق واقعی کارگاه</span>
                </div>
                <div className="text-xs text-slate-500">
                  <span className="text-[11px]">خط مبنا: <b className="font-mono font-bold text-slate-700">۷۵.۰٪</b></span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#00716B] h-full rounded-full transition-all duration-700" style={{ width: '78.5%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ROW 3: SCHEDULE & S-CURVE (7 cols) + MILESTONES (5 cols)
          ========================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Schedule & S-Curve */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between pb-3 gap-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#00716B] flex items-center justify-center border border-teal-100">
                  <span className="material-symbols-outlined text-lg">stacked_bar_chart</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">برنامه زمان‌بندی و منحنی اس پیشرفت (WBS & S-Curve)</h2>
                  <span className="text-[11px] text-slate-500">پایش خط مبنای مصوب پروژه و نرخ پیشرفت واقعی فازها</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg text-xs text-slate-600 font-medium">
                <span className="material-symbols-outlined text-sm text-[#00716B]">calendar_month</span>
                <span>هفته ۴۴ کارگاهی (جاری)</span>
              </div>
            </div>

            {/* Visual S-Curve Box */}
            <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-3 my-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">منحنی تجمعی S-Curve (واقعی در برابر خط مبنا)</span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-[#00716B] font-bold">
                    <span className="w-3 h-0.5 bg-[#00716B]"></span>
                    واقعی (۶۲.۴٪)
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 font-medium">
                    <span className="w-3 h-0.5 bg-slate-400"></span>
                    برنامه WBS (۶۵.۸٪)
                  </span>
                </div>
              </div>
              <div className="w-full h-36">
                <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 500 140">
                  <line className="text-slate-200" stroke="currentColor" strokeWidth="0.5" x1="0" x2="500" y1="20" y2="20"></line>
                  <line className="text-slate-200" stroke="currentColor" strokeWidth="0.5" x1="0" x2="500" y1="60" y2="60"></line>
                  <line className="text-slate-200" stroke="currentColor" strokeWidth="0.5" x1="0" x2="500" y1="100" y2="100"></line>
                  <line className="text-slate-200" stroke="currentColor" strokeWidth="0.5" x1="0" x2="500" y1="139" y2="139"></line>
                  <path className="text-slate-400" d="M 0,135 C 150,130 250,80 340,46 C 410,24 460,15 500,10" fill="none" stroke="currentColor" strokeDasharray="4 3" strokeWidth="2"></path>
                  <path className="text-[#00716B]/10" d="M 0,135 C 140,133 240,90 340,58 L 340,140 L 0,140 Z" fill="currentColor"></path>
                  <path className="text-[#00716B]" d="M 0,135 C 140,133 240,90 340,58" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                  <circle className="fill-[#00716B]" cx="340" cy="58" r="4"></circle>
                  <circle className="stroke-[#00716B]/40 fill-none" cx="340" cy="58" r="8" strokeWidth="1.5"></circle>
                  <text className="fill-slate-400 font-mono text-[9px]" x="10" y="132">W10</text>
                  <text className="fill-slate-400 font-mono text-[9px]" x="120" y="132">W20</text>
                  <text className="fill-slate-400 font-mono text-[9px]" x="230" y="132">W30</text>
                  <text className="fill-[#00716B] font-mono text-[9px] font-bold" x="340" y="132">W44 (امروز)</text>
                  <text className="fill-slate-400 font-mono text-[9px]" x="460" y="132">W52</text>
                </svg>
              </div>
            </div>

            {/* Progress Bars by Discipline */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                <span className="font-bold text-slate-800">وضعیت جبهه‌های فعال کارگاهی (زون A و B)</span>
                <span>بازه پایش: اسکلت و نازک‌کاری</span>
              </div>
              {DISCIPLINE_PROGRESS.map((d) => (
                <div key={d.label} className="bg-slate-50 p-2 rounded-xl border border-slate-200/60 flex items-center justify-between gap-3 text-xs">
                  <div className="w-48 font-medium truncate text-slate-700">{d.label}</div>
                  <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className={`${d.color} h-full rounded-full`} style={{ width: `${d.pct}%` }}></div>
                  </div>
                  <span className="font-mono text-[#00716B] font-bold w-12 text-left">{toFa(d.pct)}٪</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${d.badgeTone}`}>{d.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Construction Milestones */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#00716B] flex items-center justify-center border border-teal-100">
                  <span className="material-symbols-outlined text-lg">flag</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">مایل‌استون‌های فاز اجرایی و ساخت</h2>
                  <span className="text-[11px] text-slate-500">وضعیت تحقق نقاط عطف پروژه (انجام شده / انجام‌نشده)</span>
                </div>
              </div>
              <span className="bg-teal-50 text-[#00716B] border border-teal-200/60 px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono">۲ از ۶ تکمیل‌شده</span>
            </div>

            <div className="space-y-2.5 mt-3.5">
              {MILESTONES.map((m) => (
                <div key={m.title} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 transition-colors hover:bg-slate-100/60">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                      m.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <span className={`material-symbols-outlined text-sm ${m.done ? 'font-bold' : ''}`}>
                        {m.done ? 'check' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">{m.title}</span>
                  </div>
                  {m.done ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 shrink-0">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      تکمیل شده
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                      انجام‌نشده / در دست اقدام
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ROW 4: BIM 3D VIEWER (7 cols) + CLASH COORDINATION (5 cols)
          ========================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BIM 3D Viewer */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between pb-3 gap-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#00716B] flex items-center justify-center border border-teal-100">
                  <span className="material-symbols-outlined text-lg">view_in_ar</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">ناظر سه‌بعدی مدل‌های تجمیعی (BIM Federated Model Viewer)</h2>
                  <span className="text-[11px] text-slate-500">نمایش زنده هماهنگی معماری، سازه و تاسیسات مکانیکی/برقی</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-teal-50 text-[#00716B] text-xs font-bold px-2.5 py-1 rounded-lg border border-teal-200/60 font-mono">LOD 350</span>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg">همگام با رویت</span>
              </div>
            </div>

            {/* Layer Toggles Bar & Controls */}
            <div className="flex flex-wrap items-center justify-between py-2.5 text-xs gap-2 border-b border-slate-100">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#00716B]">layers</span>
                  لایه‌های فعال:
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-[#00716B] font-medium">
                  <input
                    type="checkbox"
                    checked={bimLayerArc}
                    onChange={(e) => setBimLayerArc(e.target.checked)}
                    className="rounded border-slate-300 text-[#00716B] focus:ring-[#00716B] w-4 h-4"
                  />
                  <span>معماری</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-[#00716B] font-medium">
                  <input
                    type="checkbox"
                    checked={bimLayerStr}
                    onChange={(e) => setBimLayerStr(e.target.checked)}
                    className="rounded border-slate-300 text-[#00716B] focus:ring-[#00716B] w-4 h-4"
                  />
                  <span>سازه و اسکلت</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-[#00716B] font-medium">
                  <input
                    type="checkbox"
                    checked={bimLayerMep}
                    onChange={(e) => setBimLayerMep(e.target.checked)}
                    className="rounded border-slate-300 text-[#00716B] focus:ring-[#00716B] w-4 h-4"
                  />
                  <span>تاسیسات (MEP)</span>
                </label>
              </div>
              <button
                type="button"
                onClick={() => onTriggerToast('بازنشانی دوربین', 'زاویه دید دوربین به حالت پیش‌فرض بازگشت.', 'info')}
                className="text-[11px] font-semibold text-[#00716B] hover:bg-teal-50 px-2 py-1 rounded transition-colors"
                title="بازنشانی زاویه دید دوربین"
              >
                بازنشانی دوربین
              </button>
            </div>

            {/* 3D BIM Viewport Container */}
            <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden bg-slate-950 shadow-inner my-3">
              <img
                alt="مدل سه‌بعدی BIM برج آلفا"
                className="w-full h-full object-cover opacity-90"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWVorSojtxKqm7i8PyUBYa15o4MYCGtdqqsyFRykz08b0VG1fnW1Rgg_SM0ACfwJNEmwtJlBJ3TtSJSgMb4JPZyIoPvdmbdOy6FiJSI3v8HyMlc7eFQ8tzR1XX8gHsXdyf7zSxsixJ8Q5Qm1NxpX8GlHGMwGmEP3zrEKE73iQc0uGR-PMiUqKRoiJehLxtwAKA4YLuRj_9OvRxXyd0xNKgxlKxu5-KYnKfGKATu711cVxNM9j0dVzj-8Yh0rTjv4kbnutDO9LUioovhQ"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-2 border border-white/10 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>هماهنگی زنده: طبقات ۱۹ الی ۲۶</span>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 border border-white/10 font-mono">
                  Rev: 2025.10-FED
                </div>
              </div>
              <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-slate-200 border border-white/10 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-400">filter_center_focus</span>
                <span>داکت‌های رایزر مرکزی</span>
              </div>
              {/* Floating Controls Toolbar */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 shadow-2xl flex items-center gap-3 text-slate-200 text-xs whitespace-nowrap z-10">
                <button type="button" onClick={() => onTriggerToast('حالت چرخش', 'حالت چرخش سه‌بعدی مدل فعال شد.', 'info')} className="hover:text-teal-300 flex items-center gap-1 transition-colors whitespace-nowrap" title="چرخش سه‌بعدی">
                  <span className="material-symbols-outlined text-[16px]">3d_rotation</span>
                  <span>چرخش</span>
                </button>
                <span className="text-slate-600">|</span>
                <button type="button" onClick={() => onTriggerToast('حالت جابجایی', 'حالت جابجایی صفحه (Pan) فعال شد.', 'info')} className="hover:text-teal-300 flex items-center gap-1 transition-colors whitespace-nowrap" title="جابجایی صفحه">
                  <span className="material-symbols-outlined text-[16px]">pan_tool</span>
                  <span>جابجایی</span>
                </button>
                <span className="text-slate-600">|</span>
                <button type="button" onClick={() => onTriggerToast('برش مقطع', 'ابزار برش سکشن فعال شد.', 'info')} className="hover:text-teal-300 flex items-center gap-1 transition-colors whitespace-nowrap" title="برش سکشن">
                  <span className="material-symbols-outlined text-[16px]">cut</span>
                  <span>برش مقطع</span>
                </button>
                <span className="text-slate-600">|</span>
                <button type="button" onClick={() => onTriggerToast('ابزار سنجش', 'ابزار اندازه‌گیری فاصله فعال شد.', 'info')} className="hover:text-teal-300 flex items-center gap-1 transition-colors whitespace-nowrap" title="ابزار اندازه‌گیری">
                  <span className="material-symbols-outlined text-[16px]">straighten</span>
                  <span>سنجش</span>
                </button>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={() => onNavigate('bim')}
                  className="text-rose-400 font-bold hover:text-rose-300 flex items-center gap-1 bg-rose-500/20 px-2 py-0.5 rounded-full transition-colors whitespace-nowrap"
                  title="نمایش کلش‌ها"
                >
                  <span className="material-symbols-outlined text-[15px]">crisis_alert</span>
                  <span>۱۲ کلش باز</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Toolbar */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">اسناد مدل فعال:</span>
              <button
                onClick={() => onOpenDocumentDossier('doc-01')}
                className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-700 hover:border-[#00716B]/40"
              >
                پلان تراز همکف و لابی (Rev 05)
              </button>
              <button
                onClick={() => onOpenDocumentDossier('doc-02')}
                className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-700 hover:border-[#00716B]/40"
              >
                تابلوهای برق چیلر (Rev 03)
              </button>
            </div>
            <button
              onClick={() => onNavigate('bim')}
              className="text-[#00716B] font-bold hover:underline flex items-center gap-1"
            >
              <span>ناظر تمام‌صفحه WebGL</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
          </div>
        </div>

        {/* Clash Coordination with 8-Week Vector Histogram */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#00716B] flex items-center justify-center border border-teal-100">
                  <span className="material-symbols-outlined text-lg">crisis_alert</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">گزارشات هماهنگی و کلش‌گیری (Clash Coordination)</h2>
                  <span className="text-[11px] text-slate-500">پایش تعارضات مدل در ۸ هفته اخیر (LOD 350)</span>
                </div>
              </div>
              <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-200/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                ۳ کلش بحرانی
              </span>
            </div>

            {/* Stats row (3 metric boxes) */}
            <div className="grid grid-cols-3 gap-2 my-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] text-slate-500 block">کل تعارضات</span>
                <span className="text-lg font-bold font-['Markazi_Text'] text-slate-900">۶۰ مورد</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">در ۴ مدل</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
                <span className="text-[10px] text-emerald-700 font-medium block">رفع‌شده (Resolved)</span>
                <span className="text-lg font-bold font-['Markazi_Text'] text-emerald-700">۴۸ مورد</span>
                <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">۸۰٪ نرخ رفع موفق</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/70">
                <span className="text-[10px] text-rose-700 font-medium block">تعارض باز (Active)</span>
                <span className="text-lg font-bold font-['Markazi_Text'] text-rose-600">۱۲ مورد</span>
                <span className="text-[9px] text-rose-700 font-bold block mt-0.5">هفته جاری</span>
              </div>
            </div>

            {/* 8-Week Unsolved Clashes Histogram (interactive) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-xs block">هیستوگرام تعارضات حل‌نشده (۸ هفته گذشته)</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">تعداد کلش‌های باز و فعال در پایان هر هفته</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1 font-mono shrink-0">
                  <span className="material-symbols-outlined text-xs">trending_down</span>
                  ۷۷٪- بهبود
                </span>
              </div>

              {/* 8-Week Bars */}
              <div className="grid grid-cols-8 gap-1.5 pt-2 items-end h-28 border-b border-slate-200 pb-1 text-center">
                {[
                  { week: 'هـ۱', count: 52, height: '100%', isCurrent: false },
                  { week: 'هـ۲', count: 48, height: '92%', isCurrent: false },
                  { week: 'هـ۳', count: 43, height: '82%', isCurrent: false },
                  { week: 'هـ۴', count: 36, height: '69%', isCurrent: false },
                  { week: 'هـ۵', count: 31, height: '59%', isCurrent: false },
                  { week: 'هـ۶', count: 25, height: '48%', isCurrent: false },
                  { week: 'هـ۷', count: 19, height: '36%', isCurrent: false },
                  { week: 'جاری', count: 12, height: '23%', isCurrent: true },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      onOpenClashFilters?.({
                        status: 'open',
                        label: `هفته ${item.week} • ${item.count} تعارض حل‌نشده`,
                      })
                    }
                    className="flex flex-col items-center justify-end h-full gap-1 group cursor-pointer"
                    title={`مشاهده لیست ${item.count} تعارض حل‌نشده هفته ${item.week}`}
                  >
                    <span
                      className={`text-[10px] font-mono leading-none transition-transform group-hover:scale-110 ${
                        item.isCurrent ? 'font-bold text-rose-600' : 'text-slate-500 font-medium'
                      }`}
                    >
                      {item.count}
                    </span>
                    <div
                      className={`w-full rounded-t transition-all ${
                        item.isCurrent
                          ? 'bg-rose-500 shadow-2xs group-hover:bg-rose-400'
                          : 'bg-slate-300 group-hover:bg-[#00716B]/60'
                      }`}
                      style={{ height: item.height }}
                    ></div>
                    <span
                      className={`text-[9px] font-mono mt-0.5 leading-none ${
                        item.isCurrent ? 'font-bold text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {item.week}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1 text-[#00716B] font-medium">
                  <span className="material-symbols-outlined text-xs">ads_click</span>
                  برای مشاهده لیست تعارضات هر هفته، روی ستون آن کلیک کنید
                </span>
                <span className="font-bold text-slate-700">وضعیت کنونی: <strong className="text-rose-600 font-mono">۱۲</strong> تعارض باز</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 text-xs text-slate-500 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-mono">آخرین به‌روزرسانی کلش: امروز ۰۹:۳۰</span>
            <button
              onClick={() => onNavigate('bim')}
              className="text-[#00716B] hover:underline font-bold flex items-center gap-1 transition-colors"
            >
              <span>مشاهده ماتریس تداخلات BIM</span>
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          ROW 5: APPROVAL WORKFLOW TABLE (کارتابل تاییدات مدیر ساخت)
          ========================================================= */}
      <section className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col gap-3">
        {/* Table Header Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWorkflowTab('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                workflowTab === 'active'
                  ? 'bg-[#00716B] text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <span>نیازمند اقدام مدیر ساخت</span>
              <span className={`text-[10px] font-black rounded-full px-1.5 py-0.2 ${
                workflowTab === 'active' ? 'bg-white text-[#00716B]' : 'bg-slate-100 text-slate-600'
              }`}>{toFa(pendingCount)}</span>
            </button>
            <button
              type="button"
              onClick={() => setWorkflowTab('archive')}
              className={`px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                workflowTab === 'archive'
                  ? 'bg-[#00716B] text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <span>تاریخچه و اسناد تایید شده کارگاه</span>
              <span className={`text-[10px] rounded-full px-1.5 py-0.2 ${
                workflowTab === 'archive' ? 'bg-white text-[#00716B]' : 'bg-slate-100 text-slate-600'
              }`}>۸۶</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-2 flex-1 max-w-sm justify-end">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute right-2.5 top-2 text-slate-400 text-sm pointer-events-none">search</span>
              <input
                type="text"
                value={workflowQuery}
                onChange={(e) => setWorkflowQuery(e.target.value)}
                className="w-full bg-slate-50 text-xs rounded-xl pr-8 pl-3 py-1.5 text-slate-800 border border-slate-200 focus:outline-none focus:bg-white focus:border-[#00716B]"
                placeholder="فیلتر بر اساس پیمانکار یا عنوان..."
              />
            </div>
            <button
              type="button"
              onClick={() => onTriggerToast('فیلتر پیشرفته', 'پنل فیلتر پیشرفته مدارک به‌زودی فعال می‌شود.', 'info')}
              className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900"
              title="فیلتر پیشرفته"
            >
              <span className="material-symbols-outlined text-base">tune</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto rounded-xl">
          <table className="w-full text-right text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80 text-[11px]">
              <tr>
                <th className="p-3 w-8 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-[#00716B] focus:ring-[#00716B]"
                    checked={rows.length > 0 && checkedRows.length === rows.length}
                    onChange={(e) => setCheckedRows(e.target.checked ? rows.map((r) => r.id) : [])}
                  />
                </th>
                <th className="p-3">عنوان بسته و فعالیت کارگاهی</th>
                <th className="p-3">دیسیپلین</th>
                <th className="p-3">ارائه‌دهنده / مهندس</th>
                <th className="p-3">مهلت اقدام (SLA)</th>
                <th className="p-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-teal-50/40 transition-colors">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-[#00716B] focus:ring-[#00716B]"
                      checked={checkedRows.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                    />
                  </td>
                  <td className="p-3 font-bold text-slate-900">{row.title}</td>
                  <td className="p-3 text-slate-500">{row.discipline}</td>
                  <td className="p-3">{row.provider}</td>
                  <td className="p-3">
                    {row.slaTone === 'urgent' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">
                        <span className="material-symbols-outlined text-xs">{row.slaIcon}</span>
                        {row.slaLabel}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px]">
                        <span className="material-symbols-outlined text-xs">{row.slaIcon}</span>
                        {row.slaLabel}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleReview(row)}
                      className="bg-[#00716B] text-white hover:bg-[#005a55] px-3.5 py-1 rounded-lg text-xs font-medium transition-colors shadow-xs"
                    >
                      بررسی
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    موردی مطابق فیلتر جستجو یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Batch actions */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-medium">انتخاب شده: {toFa(checkedRows.length)} مورد</span>
            <button
              type="button"
              onClick={handleBatchApprove}
              className="text-[#00716B] hover:underline font-bold"
            >
              تایید گروهی با یادداشت مدیر ساخت
            </button>
          </div>
          <div className="flex items-center gap-1 font-mono">
            <span>نمایش {toFa(rows.length)} مدرک در {workflowTab === 'active' ? 'اولویت اقدام' : 'آرشیو تایید شده'}</span>
          </div>
        </div>
      </section>

      {/* =========================================================
          ROW 6: 3 COLUMNS (IPC, MoM, Recent CDE Files)
          ========================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: IPC Financial Tracking */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00716B] text-lg">account_balance_wallet</span>
                <span className="font-bold text-xs text-slate-900">وضعیت صورت‌وضعیت‌ها (IPC)</span>
              </div>
              <button onClick={() => onOpenExcelIpc?.()} className="text-xs font-mono font-bold text-[#00716B] hover:underline">۳.۴ م.ت مصوب</button>
            </div>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">صورت‌وضعیت ۵ (اسکلت بتنی پارت B)</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">در حال بررسی</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>مبلغ کارکرد اعلامی پیمانکار:</span>
                  <span className="font-mono font-bold text-slate-900">۴۸۰,۰۰۰,۰۰۰ تومان</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">صورت‌وضعیت ۴ (سازه دال‌های پس‌کشیده)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">تسویه شده</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>مبلغ تایید و پرداخت شده:</span>
                  <span className="font-mono font-bold text-emerald-700">۶۲۰,۰۰۰,۰۰۰ تومان</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">پیش‌پرداخت تهاتر میلگرد کارگاهی</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">مستهلک شده</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>مبلغ کسر از فازهای ۲ و ۳:</span>
                  <span className="font-mono font-bold text-slate-900">۸۵۰,۰۰۰,۰۰۰ تومان</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3">
            <button
              type="button"
              onClick={() => onOpenExcelIpc?.()}
              className="w-full bg-slate-50 hover:bg-slate-100 text-[#00716B] font-bold text-xs py-2 rounded-xl border border-slate-200/70 transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              گزارش جامع مالی و صورت‌حساب‌های کارگاه
            </button>
          </div>
        </div>

        {/* Column 2: Minutes of Meeting (MoM) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00716B] text-lg">groups</span>
                <span className="font-bold text-xs text-slate-900">صورت‌جلسات فنی و کارگاهی</span>
              </div>
              <button
                type="button"
                onClick={() => onTriggerToast('ثبت جلسه جدید', 'فرم ثبت صورت‌جلسه فنی کارگاهی باز شد.', 'info')}
                className="text-[11px] text-[#00716B] font-bold hover:underline flex items-center gap-0.5"
              >
                + ثبت جلسه جدید
              </button>
            </div>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/70 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-xs text-slate-900 leading-tight">هماهنگی رفع تعارض رایزرهای تاسیسات با سازه</div>
                    <div className="font-mono text-[10px] text-slate-400 mt-0.5">MOM-ALF-1042-021 • ۲۲ آبان</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onTriggerToast('دانلود صورتجلسه', 'فایل صورت‌جلسه MOM-ALF-1042-021 در حال دانلود است.', 'success')}
                    className="p-1 rounded bg-white border border-slate-200 text-[#00716B] hover:bg-teal-50 transition-colors"
                    title="دانلود صورتجلسه"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 mt-1.5">تصمیم‌گیری: جابجایی داکت اگزاست فن و تعریض اسپیسر به میزان ۵ سانتی‌متر.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/70 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-xs text-slate-900 leading-tight">بررسی اتصال شاسی‌های آسانسور پرسرعت ۳m/s</div>
                    <div className="font-mono text-[10px] text-slate-400 mt-0.5">MOM-ALF-1042-019 • ۱۸ آبان</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onTriggerToast('دانلود صورتجلسه', 'فایل صورت‌جلسه MOM-ALF-1042-019 در حال دانلود است.', 'success')}
                    className="p-1 rounded bg-white border border-slate-200 text-[#00716B] hover:bg-teal-50 transition-colors"
                    title="دانلود صورتجلسه"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 mt-1.5">تصمیم‌گیری: تایید صفحه پلیت‌های دفنی چاهک با حضور نماینده بازرسی استاندارد.</div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3">
            <button
              type="button"
              onClick={() => onTriggerToast('آرشیو صورت‌جلسات', 'آرشیو ۲۱ صورت‌جلسه کارگاهی در CDE موجود است.', 'info')}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs py-2 rounded-xl border border-slate-200/70 transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">folder_open</span>
              مشاهده آرشیو صورت‌جلسات کارگاهی (۲۱ جلسه)
            </button>
          </div>
        </div>

        {/* Column 3: Recently Uploaded Files in CDE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00716B] text-lg">cloud_sync</span>
                <span className="font-bold text-xs text-slate-900">فایل‌های اخیر بارگذاری در CDE</span>
              </div>
              <span className="bg-teal-50 text-[#00716B] border border-teal-200/60 text-[10px] font-bold px-2 py-0.5 rounded-full">همگام با سرور</span>
            </div>
            <div className="space-y-2">
              {[
                { ext: 'JPG', tone: 'bg-teal-50 text-[#00716B] border-teal-200/60', title: 'عکس‌های پایش هوایی کارگاه (پهپاد)', meta: '۲ ساعت پیش • واحد نقشه‌برداری' },
                { ext: 'PDF', tone: 'bg-rose-50 text-rose-600 border-rose-200/80', title: 'لاگ روزانه مقاومت فشاری ۷ روزه بتن', meta: '۴ ساعت پیش • آزمایشگاه مقیم' },
                { ext: 'RVT', tone: 'bg-amber-50 text-amber-700 border-amber-200/80', title: 'مدل سه‌بعدی رویت ازبیلت پارت A طبقه ۲۱', meta: 'دیروز • پیمانکار سازه' },
              ].map((f) => (
                <div key={f.title} className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors border border-transparent hover:border-slate-200">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs font-mono ${f.tone}`}>
                      {f.ext}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{f.title}</div>
                      <div className="text-[10px] text-slate-400">{f.meta}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onTriggerToast('پیش‌نمایش فایل', `فایل «${f.title}» در نمایشگر CDE باز شد.`, 'info')}
                    className="p-1 rounded text-slate-400 hover:text-[#00716B]"
                  >
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3">
            <button
              type="button"
              onClick={() => onNavigate('cde')}
              className="w-full bg-slate-50 hover:bg-slate-100 text-[#00716B] font-bold text-xs py-2 rounded-xl border border-slate-200/70 transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">folder_shared</span>
              مشاهده پوشه اسناد کارگاهی محیط CDE
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-14 px-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 mt-2">
        <div>تمامی حقوق برای گروه ساختمانی و مهندسی باران محفوظ است © ۱۴۰۳ | پلتفرم مدیریت مهندسی XONE CDE</div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>سرور ابری پایدار</span>
          <span>•</span>
          <button onClick={() => onTriggerToast('پشتیبانی فاوا', 'تیم پشتیبانی مهندسی فاوا در دسترس است.', 'info')} className="hover:text-slate-900 transition-colors">پشتیبانی مهندسی فاوا</button>
          <span>•</span>
          <button onClick={() => onTriggerToast('مستندات ISO 19650', 'مستندات حاکمیتی ISO 19650 در حال نمایش است.', 'info')} className="hover:text-slate-900 transition-colors">مستندات حاکمیتی ISO 19650</button>
        </div>
      </footer>
    </div>
  );
};
