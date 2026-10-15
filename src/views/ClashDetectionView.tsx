import React, { useState, useMemo, useEffect } from 'react';
import { ClashItem, ClashPreset } from '../types';
import { CLASHES } from '../data/mockData';
import { ClashDetailModal } from '../modals/ClashDetailModal';

interface ClashDetectionViewProps {
  onTriggerToast: (title: string, desc: string, type?: 'success' | 'error' | 'info') => void;
  initialFilters?: ClashPreset | null;
}

// Matrix Floor Rows
const MATRIX_ROWS = [
  { id: 'floors-20-25', title: 'طبقات ۲۰ تا ۲۵', subtitle: 'برج (زون C)' },
  { id: 'floors-10-19', title: 'طبقات ۱۰ تا ۱۹', subtitle: 'میانی (زون B)' },
  { id: 'floors-1-9', title: 'طبقات ۱ تا ۹', subtitle: 'پایه برج (زون A)' },
  { id: 'lobby', title: 'همکف و لابی', subtitle: 'Lobby / Retail' },
  { id: 'basements', title: 'زیرزمین‌ها', subtitle: 'B1-B4 / فونداسیون' }
];

// Matrix Discipline Columns
const MATRIX_COLS = [
  { id: 'STR_MEP', title: 'سازه × مکانیک', subtitle: '(STR × MEP)' },
  { id: 'STR_ARC', title: 'سازه × معماری', subtitle: '(STR × ARC)' },
  { id: 'MEP_ELC', title: 'مکانیک × برق', subtitle: '(MEP × ELC)' },
  { id: 'FAC_STR', title: 'نما × سازه', subtitle: '(FAC × STR)' },
  { id: 'ARC_MEP', title: 'معماری × مکانیک', subtitle: '(ARC × MEP)' }
];

// Matrix cell configuration
const MATRIX_CELL_DATA: Record<string, Record<string, { label: string; sublabel: string; color: string; count: number; critical: number }>> = {
  'floors-20-25': {
    STR_MEP: { label: '۱۲ تعارض', sublabel: '۳ بحرانی', color: 'bg-rose-600 text-white hover:bg-rose-700', count: 12, critical: 3 },
    STR_ARC: { label: '۵ تعارض', sublabel: '۱ بحرانی', color: 'bg-amber-400/90 text-amber-950 hover:bg-amber-400', count: 5, critical: 1 },
    MEP_ELC: { label: '۲ تعارض', sublabel: 'عادی', color: 'bg-amber-100 text-amber-900 hover:bg-amber-200', count: 2, critical: 0 },
    FAC_STR: { label: '۶ تعارض', sublabel: '۲ بحرانی', color: 'bg-amber-400/90 text-amber-950 hover:bg-amber-400', count: 6, critical: 2 },
    ARC_MEP: { label: '۲ تعارض', sublabel: '۱ بحرانی', color: 'bg-rose-500 text-white hover:bg-rose-600', count: 2, critical: 1 }
  },
  'floors-10-19': {
    STR_MEP: { label: '۷ تعارض', sublabel: '۱ بحرانی', color: 'bg-amber-400/90 text-amber-950 hover:bg-amber-400', count: 7, critical: 1 },
    STR_ARC: { label: '۳ تعارض', sublabel: 'عادی', color: 'bg-amber-100 text-amber-900 hover:bg-amber-200', count: 3, critical: 0 },
    MEP_ELC: { label: '۲ تعارض', sublabel: 'عادی', color: 'bg-amber-100 text-amber-900 hover:bg-amber-200', count: 2, critical: 0 },
    FAC_STR: { label: '✓ بدون تداخل', sublabel: '۰ مورد', color: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100', count: 0, critical: 0 },
    ARC_MEP: { label: '۴ تعارض', sublabel: 'متوسط', color: 'bg-amber-200 text-amber-950 hover:bg-amber-300', count: 4, critical: 0 }
  },
  'floors-1-9': {
    STR_MEP: { label: '۳ تعارض', sublabel: '۱ بحرانی', color: 'bg-amber-400/90 text-amber-950 hover:bg-amber-400', count: 3, critical: 1 },
    STR_ARC: { label: '۲ تعارض', sublabel: 'عادی', color: 'bg-amber-100 text-amber-900 hover:bg-amber-200', count: 2, critical: 0 },
    MEP_ELC: { label: '۱ تعارض', sublabel: 'خفیف', color: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100', count: 1, critical: 0 },
    FAC_STR: { label: '✓ مصوب', sublabel: '۰ مورد', color: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100', count: 0, critical: 0 },
    ARC_MEP: { label: '✓ بدون تداخل', sublabel: '۰ مورد', color: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100', count: 0, critical: 0 }
  },
  lobby: {
    STR_MEP: { label: '✓ بدون تداخل', sublabel: '۰ مورد', color: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100', count: 0, critical: 0 },
    STR_ARC: { label: '۱ تعارض', sublabel: 'عادی', color: 'bg-amber-100 text-amber-900 hover:bg-amber-200', count: 1, critical: 0 },
    MEP_ELC: { label: '✓ بدون تداخل', sublabel: '۰ مورد', color: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100', count: 0, critical: 0 },
    FAC_STR: { label: '۲ تعارض', sublabel: '۱ بحرانی', color: 'bg-rose-500 text-white hover:bg-rose-600', count: 2, critical: 1 },
    ARC_MEP: { label: '✓ بدون تداخل', sublabel: '۰ مورد', color: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100', count: 0, critical: 0 }
  },
  basements: {
    STR_MEP: { label: '۴ تعارض', sublabel: 'موتورخانه', color: 'bg-amber-400/90 text-amber-950 hover:bg-amber-400', count: 4, critical: 1 },
    STR_ARC: { label: '✓ حل شده', sublabel: '۰ مورد باز', color: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100', count: 1, critical: 0 },
    MEP_ELC: { label: '✓ مصوب', sublabel: '۰ مورد', color: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100', count: 0, critical: 0 },
    FAC_STR: { label: '✓ بدون تداخل', sublabel: '۰ مورد', color: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100', count: 0, critical: 0 },
    ARC_MEP: { label: '✓ بدون تداخل', sublabel: '۰ مورد', color: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100', count: 0, critical: 0 }
  }
};

export const ClashDetectionView: React.FC<ClashDetectionViewProps> = ({ onTriggerToast, initialFilters }) => {
  // Main sub-section state: Coordination Dashboard vs Full Clash Register
  const [activeSubTab, setActiveSubTab] = useState<'coordination-dashboard' | 'clash-register'>('coordination-dashboard');

  // Currently focused clash for 3D viewer & dossier
  const [selectedClash, setSelectedClash] = useState<ClashItem>(CLASHES[0]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalClash, setModalClash] = useState<ClashItem | null>(null);

  // Filters for Clash Register
  const [searchQuery, setSearchQuery] = useState('');
  const [floorLevelFilter, setFloorLevelFilter] = useState<string>('all');
  const [disciplinePairFilter, setDisciplinePairFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Track if a filter was automatically triggered from the heatmap matrix
  const [matrixFilterBadge, setMatrixFilterBadge] = useState<{
    floorTitle: string;
    colTitle: string;
  } | null>(null);

  // Apply preset filters passed from other views (e.g. dashboard histogram)
  useEffect(() => {
    if (!initialFilters) return;
    if (initialFilters.severity) setSeverityFilter(initialFilters.severity);
    if (initialFilters.status) setStatusFilter(initialFilters.status);
    setFloorLevelFilter('all');
    setDisciplinePairFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
    setMatrixFilterBadge(
      initialFilters.label ? { floorTitle: initialFilters.label, colTitle: 'هیستوگرام تعارضات' } : null
    );
    setActiveSubTab('clash-register');
    onTriggerToast(
      'فیلتر خودکار اعمال شد',
      initialFilters.label
        ? `نمایش تعارضات مطابق: ${initialFilters.label}`
        : 'نمایش تعارضات مطابق فیلتر انتخاب‌شده.',
      'info'
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle clicking ANY cell in the heatmap matrix
  const handleMatrixCellClick = (
    floorId: string,
    pairId: string,
    floorTitle: string,
    colTitle: string
  ) => {
    // 1. Set the filters corresponding to the clicked cell
    setFloorLevelFilter(floorId);
    setDisciplinePairFilter(pairId);
    setSeverityFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchQuery('');

    // 2. Set the active matrix banner
    setMatrixFilterBadge({ floorTitle, colTitle });

    // 3. Switch automatically to the Clash Register sub-section
    setActiveSubTab('clash-register');

    // 4. Trigger Toast notification
    onTriggerToast(
      'فیلتر خودکار از ماتریس حرارتی اعمال شد',
      `انتقال به لیست تعارضات: ${floorTitle} • ${colTitle}`,
      'info'
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFloorLevelFilter('all');
    setDisciplinePairFilter('all');
    setSeverityFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
    setMatrixFilterBadge(null);
    onTriggerToast('فیلترها بازنشانی شدند', 'اکنون تمام تعارضات پروژه باران ۵ نمایش داده می‌شوند.', 'info');
  };

  // Filtered clashes calculation
  const filteredClashes = useMemo(() => {
    return CLASHES.filter((c) => {
      // 1. Floor Level Filter
      if (floorLevelFilter !== 'all' && c.floorLevel !== floorLevelFilter) {
        return false;
      }

      // 2. Discipline Pair Filter
      if (disciplinePairFilter !== 'all' && c.disciplinePair !== disciplinePairFilter) {
        return false;
      }

      // 3. Severity Filter
      if (severityFilter !== 'all' && c.severity !== severityFilter) {
        return false;
      }

      // 4. Status Filter
      if (statusFilter !== 'all' && c.status !== statusFilter) {
        return false;
      }

      // 5. Type Filter
      if (typeFilter !== 'all' && c.type !== typeFilter) {
        return false;
      }

      // 6. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = c.code.toLowerCase().includes(q);
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchElem1 = c.element1.toLowerCase().includes(q) || c.element1Id.includes(q);
        const matchElem2 = c.element2.toLowerCase().includes(q) || c.element2Id.includes(q);
        const matchLoc = c.location.toLowerCase().includes(q) || c.zone.toLowerCase().includes(q);
        const matchNote = c.coordinatorNote.toLowerCase().includes(q);
        const matchAssigned = (c.assignedTo || '').toLowerCase().includes(q);
        const matchCoords = c.coordinates.toLowerCase().includes(q);

        if (
          !matchCode &&
          !matchTitle &&
          !matchDesc &&
          !matchElem1 &&
          !matchElem2 &&
          !matchLoc &&
          !matchNote &&
          !matchAssigned &&
          !matchCoords
        ) {
          return false;
        }
      }

      return true;
    });
  }, [floorLevelFilter, disciplinePairFilter, severityFilter, statusFilter, typeFilter, searchQuery]);

  // Open Clash in 3D Viewer
  const handleViewIn3D = (clash: ClashItem) => {
    setSelectedClash(clash);
    setActiveSubTab('coordination-dashboard');
    onTriggerToast('انتقال به نمایشگر سه‌بعدی', `دوربین روی تداخل ${clash.code} متمرکز شد.`, 'info');
  };

  // Open Detailed Dossier Modal
  const handleOpenDetailModal = (clash: ClashItem) => {
    setModalClash(clash);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8" dir="rtl">
      {/* 1. Header Card with Sub-Navigation Tabs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">
                سامانه هماهنگی BIM و کلش‌گیری هوشمند (BIM Clash Coordination)
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-[#00716B] text-xs font-bold border border-[#00716B]/20">
                مدل هماهنگ CDE • نسخه ۳.۴
              </span>
            </div>
            <p className="text-xs text-slate-500">
              پروژه باران ۵ (برج آلفا) • دیسیپلین‌های سازه، معماری، مکانیک، برق و نما • استاندارد ISO 19650 و BCF 3.0
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center flex-wrap">
            <button
              onClick={() => onTriggerToast('خروجی BCF 3.0', 'گزارش تعارضات با فرمت استاندارد BCF 3.0 صادر شد.', 'success')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#00716B] font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">table_view</span>
              <span>خروجی BCF / اکسل</span>
            </button>
            <button
              onClick={() => onTriggerToast('دریافت گزارش PDF', 'گزارش تجمیعی کلش‌گیری در قالب PDF تولید شد.', 'success')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00716B] hover:bg-[#005e59] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">picture_as_pdf</span>
              <span>دریافت PDF</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            BIM SUB-NAVIGATION TABS (User Requested Dedicated Sub-Section)
            ========================================================= */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 flex-wrap">
          <button
            onClick={() => setActiveSubTab('coordination-dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'coordination-dashboard'
                ? 'bg-[#00716B] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">view_in_ar</span>
            <span>داشبورد هماهنگی و ناظر سه‌بعدی BIM</span>
          </button>

          <button
            onClick={() => setActiveSubTab('clash-register')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              activeSubTab === 'clash-register'
                ? 'bg-[#00716B] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">format_list_bulleted</span>
            <span>لیست کامل تمام تعارضات و کلش‌ها (Clash Register)</span>
            <span
              className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'clash-register'
                  ? 'bg-white text-[#00716B]'
                  : 'bg-[#00716B]/15 text-[#00716B]'
              }`}
            >
              {filteredClashes.length} مورد
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================
          VIEW 1: COORDINATION DASHBOARD & 3D EXPLORER
          ========================================================= */}
      {activeSubTab === 'coordination-dashboard' && (
        <>
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">کل تعارضات شناسایی‌شده</span>
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  <span className="material-symbols-outlined text-lg">rule_folder</span>
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800 leading-none">۶۰</span>
                <span className="text-xs text-slate-500">مورد ثبت‌شده در CDE</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-[#00716B] font-bold">تجمعی از ابتدای فاز ۳</span>
                <button
                  onClick={() => setActiveSubTab('clash-register')}
                  className="text-[#00716B] hover:underline font-bold"
                >
                  مشاهده همه ←
                </button>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">تعارضات رفع‌شده (Resolved)</span>
                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#00716B]">
                  <span className="material-symbols-outlined text-lg">task_alt</span>
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#00716B] leading-none">۴۸</span>
                <span className="text-xs text-[#00716B] font-bold">مورد برطرف‌شده</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>نرخ موفقیت رفع تعارض: ۸۰٪</span>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">تعارضات باز و فعال (Active)</span>
                <span className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                  <span className="material-symbols-outlined text-lg">report_problem</span>
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800 leading-none">۱۲</span>
                <span className="text-xs text-rose-600 font-bold">نیاز به اقدام فوری</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
                  ۳ مورد بحرانی (Critical)
                </span>
                <button
                  onClick={() => {
                    setSeverityFilter('critical');
                    setActiveSubTab('clash-register');
                  }}
                  className="text-rose-700 hover:underline font-bold"
                >
                  فیلتر بحرانی‌ها
                </button>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">آزمون کلش فعال در سیستم</span>
                <span className="w-8 h-8 rounded-lg bg-[#00716B]/10 flex items-center justify-center text-[#00716B]">
                  <span className="material-symbols-outlined text-lg">verified</span>
                </span>
              </div>
              <div className="mt-4">
                <div className="text-sm font-bold text-slate-800">آزمون شماره ۱۶ (بچ B)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">تاسیسات طبقات ۲۰ الی ۲۵ با اسکلت بتنی</div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-[#00716B] font-bold">تأییدیه مدیر هماهنگی BIM</span>
                <span className="text-slate-400">زون شرقی</span>
              </div>
            </div>
          </div>

          {/* Middle Row: Heatmap Matrix (7 cols) + Coordination Histogram (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Heatmap Matrix (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 leading-tight">
                    ماتریس حرارتی شدت تعارضات دیسیپلین‌ها و زون‌ها
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    کلیک روی هر سلول، فیلترهای آن را به‌طور خودکار روی لیست کامل تعارضات اعمال می‌کند
                  </p>
                </div>
                <span className="text-[11px] text-[#00716B] bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200 font-bold">
                  کلیک‌پذیر برای فیلتر هوشمند
                </span>
              </div>

              {/* Matrix Grid Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 font-bold">
                      <th className="py-2 px-2 text-right text-slate-400 w-28">زون / تراز طبقات</th>
                      {MATRIX_COLS.map((col) => (
                        <th key={col.id} className="py-2 px-1 text-center font-bold">
                          {col.title}<br />
                          <span className="text-[10px] text-slate-400 font-normal font-mono">{col.subtitle}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {MATRIX_ROWS.map((row) => (
                      <tr key={row.id}>
                        <td className="py-2 px-2 font-bold text-slate-700 whitespace-nowrap">
                          <div className="leading-tight text-xs font-bold">{row.title}</div>
                          <div className="text-[10px] text-slate-400">{row.subtitle}</div>
                        </td>
                        {MATRIX_COLS.map((col) => {
                          const cell = MATRIX_CELL_DATA[row.id]?.[col.id] || {
                            label: '✓ بدون تداخل',
                            sublabel: '۰ مورد',
                            color: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
                            count: 0,
                            critical: 0
                          };

                          return (
                            <td key={col.id} className="p-1">
                              <div
                                onClick={() => handleMatrixCellClick(row.id, col.id, row.title, col.title)}
                                className={`rounded-xl p-2 text-center transition-all cursor-pointer shadow-2xs hover:scale-102 hover:shadow-md ${cell.color}`}
                                title={`کلیک کنید تا تعارضات ${row.title} در رشته ${col.title} فیلتر شوند`}
                              >
                                <div className="font-bold text-xs">{cell.label}</div>
                                <div className="text-[10px] opacity-90">{cell.sublabel}</div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Color Scale Legend */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700">راهنمای شدت:</span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></span>
                    <span>سبز (۰: پاک)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span>
                    <span>زرد (۱-۳: جزئی)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-amber-400 border border-amber-500"></span>
                    <span>نارنجی (۴-۷: متوسط)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-rose-600"></span>
                    <span>قرمز (۸+: بحرانی)</span>
                  </span>
                </div>

                <button
                  onClick={() => setActiveSubTab('clash-register')}
                  className="text-[#00716B] font-bold hover:underline flex items-center gap-1"
                >
                  <span>مشاهده لیست کامل تمام تعارضات</span>
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                </button>
              </div>
            </div>

            {/* 8-Week Trend Histogram (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-[#00716B]/10 text-[#00716B] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-xl">insights</span>
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">
                      روند ۸ هفته‌ای حل تعارضات (هیستوگرام)
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">نرخ پیشرفت بازگشایی و اصلاح مدل‌ها</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#00716B] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  -۷۳٪ روند نزولی مطلوب
                </span>
              </div>

              {/* 8-Week Bars */}
              <div className="grid grid-cols-8 gap-1.5 pt-3 pb-2 items-end h-32 border-b border-slate-200">
                {[
                  { label: 'هـ۱', val: 52, h: '88%' },
                  { label: 'هـ۲', val: 48, h: '80%' },
                  { label: 'هـ۳', val: 43, h: '72%' },
                  { label: 'هـ۴', val: 36, h: '60%' },
                  { label: 'هـ۵', val: 31, h: '52%' },
                  { label: 'هـ۶', val: 25, h: '42%' },
                  { label: 'هـ۷', val: 19, h: '32%' },
                  { label: 'جاری', val: 12, h: '22%', isCurrent: true }
                ].map((col, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('open');
                      setSeverityFilter('all');
                      setFloorLevelFilter('all');
                      setDisciplinePairFilter('all');
                      setTypeFilter('all');
                      setMatrixFilterBadge({ floorTitle: `هفته ${col.label}`, colTitle: 'تعارضات حل‌نشده پایان هفته' });
                      setActiveSubTab('clash-register');
                      onTriggerToast(
                        'فیلتر خودکار از هیستوگرام اعمال شد',
                        `نمایش ${col.val} تعارض حل‌نشده در پایان هفته ${col.label}`,
                        'info'
                      );
                    }}
                    className="flex flex-col items-center gap-1 h-full justify-end group cursor-pointer"
                    title={`مشاهده ${col.val} تعارض حل‌نشده هفته ${col.label}`}
                  >
                    <span className={`text-[10px] font-bold font-mono ${col.isCurrent ? 'text-[#00716B]' : 'text-slate-500'}`}>
                      {col.val}
                    </span>
                    <div
                      className={`w-full rounded-t transition-all ${
                        col.isCurrent
                          ? 'bg-[#00716B] shadow-xs group-hover:bg-[#00988f]'
                          : 'bg-slate-200 group-hover:bg-[#00716B]/40'
                      }`}
                      style={{ height: col.h }}
                    ></div>
                    <span className={`text-[9px] font-mono mt-0.5 ${col.isCurrent ? 'font-bold text-[#00716B]' : 'text-slate-400'}`}>
                      {col.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#00716B]">ads_click</span>
                  روی هر ستون کلیک کنید تا لیست تعارضات همان هفته نمایش داده شود
                </span>
                <span className="text-emerald-700 font-bold">سرعت بهینه رفع تعارض</span>
              </div>
            </div>
          </div>

          {/* Interactive 3D Clash Inspector */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00716B] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-2xl">view_in_ar</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
                      ناظر سه‌بعدی و عارضه‌یابی تعاملی (Interactive 3D Clash Explorer)
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#00716B]/10 text-[#00716B] font-bold text-xs border border-[#00716B]/20 font-mono">
                      {selectedClash.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    محیط تعاملی عارضه‌یابی فضایی المان‌های BIM • ناوبری سه‌بعدی، اندازه‌گیری فاصله و ثبت دستورات اصلاحی
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleOpenDetailModal(selectedClash)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">description</span>
                <span>مشاهده شناسنامه کامل تعارض</span>
              </button>
            </div>

            {/* 3D Viewport & Side Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
              {/* Viewport Canvas (9 Cols) */}
              <div className="lg:col-span-9 relative bg-slate-950 overflow-hidden flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-slate-200">
                <img
                  alt="3D Clash Model Viewport"
                  className="absolute inset-0 w-full h-full object-cover opacity-85 select-none pointer-events-none"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeMVFlij6ktVChjWvlbJq0Rg6jqAJijAAEgJuMat253j9qA90C1PPQ8BlHu8NYIj2mJ3Cg3osNtiOQ6Wd6q9tuw3yGfsRHqyOp5mH_Eqma5hI6a14sGOjQ8UfXSzi-G3dbiWbD7ir8kK3fBH-AhqG9hzRsNpSWF57h84A7de3c5jVW5mIOZ5pOUgexUeeC2J4rxq-IH1EfgjrefDM0V7fJK4nn6r6hU_cJWsXQGjA0MtdDUSazq8Qc"
                />

                {/* Floating Camera Tools */}
                <div className="absolute left-4 top-4 z-20 flex flex-col gap-1.5 bg-slate-900/85 backdrop-blur p-1.5 rounded-xl border border-slate-700/60 shadow-lg text-slate-300">
                  <button
                    onClick={() => onTriggerToast('چرخش مداری (Orbit)', 'ابزار چرخش ۳D فعال است.', 'info')}
                    className="p-2 rounded-lg bg-[#00716B] text-white hover:bg-[#005652] transition-colors"
                    title="چرخش مداری"
                  >
                    <span className="material-symbols-outlined text-lg">3d_rotation</span>
                  </button>
                  <button
                    onClick={() => onTriggerToast('جابجایی صحنه (Pan)', 'ابزار جابجایی صفحه فعال شد.', 'info')}
                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
                    title="جابجایی صفحه"
                  >
                    <span className="material-symbols-outlined text-lg">pan_tool</span>
                  </button>
                  <button
                    onClick={() => onTriggerToast('برش مقطعی (Section Box)', 'جعبه برش سه‌بعدی فعال شد.', 'info')}
                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
                    title="برش مقطعی"
                  >
                    <span className="material-symbols-outlined text-lg">content_cut</span>
                  </button>
                  <button
                    onClick={() => onTriggerToast('نمایش Wireframe', 'المان‌های پوششی به حالت نیمه‌شفاف تغییر یافتند.', 'info')}
                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
                    title="اشباح سازه"
                  >
                    <span className="material-symbols-outlined text-lg">opacity</span>
                  </button>
                  <div className="w-full h-px bg-slate-700 my-0.5"></div>
                  <button
                    onClick={() => onTriggerToast('فوکوس روی نقطه تداخل', `دوربین روی ${selectedClash.code} متمرکز شد.`, 'info')}
                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
                    title="بزرگنمایی روی نقطه تداخل"
                  >
                    <span className="material-symbols-outlined text-lg">center_focus_strong</span>
                  </button>
                </div>

                {/* Floating Top HUD Card */}
                <div className="relative z-10 m-4 mr-4 ml-16 bg-slate-900/85 backdrop-blur p-3.5 rounded-xl border border-slate-700 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${
                          selectedClash.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : selectedClash.severity === 'medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                        {selectedClash.type} ({selectedClash.severityLabel})
                      </span>
                      <span className="text-xs text-slate-200 font-bold">{selectedClash.title}</span>
                      <span className="font-mono text-[11px] text-[#80d5ce] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {selectedClash.code}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        المان ۱: <strong className="text-white font-mono">{selectedClash.element1}</strong> (ID: {selectedClash.element1Id})
                      </span>
                      <span className="text-slate-500">|</span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        المان ۲: <strong className="text-white font-mono">{selectedClash.element2}</strong> (ID: {selectedClash.element2Id})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 text-right flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-400">تداخل حجمی</span>
                      <span className="text-xs font-bold text-rose-400 font-mono" dir="ltr">
                        {selectedClash.penetration}
                      </span>
                    </div>
                    <div className="bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 text-right flex flex-col gap-0.5 font-mono text-[10px] text-slate-300" dir="ltr">
                      <span className="text-[9px] text-[#80d5ce] font-sans text-right">مختصات برخورد:</span>
                      <span>{selectedClash.coordinates}</span>
                    </div>
                  </div>
                </div>

                {/* Floating Bottom HUD: Coordinator Note */}
                <div className="relative z-10 m-4 bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-slate-700 text-white shadow-2xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1">
                    <span className="material-symbols-outlined text-[#80d5ce] text-xl shrink-0 mt-0.5">lightbulb</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-[#80d5ce]">توصیه فنی هماهنگ‌کننده BIM (BIM Coordinator Note):</span>
                      <p className="text-xs text-slate-200 leading-relaxed text-justify">{selectedClash.coordinatorNote}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <button
                      onClick={() => handleOpenDetailModal(selectedClash)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">info</span>
                      <span>شناسنامه فنی</span>
                    </button>
                    <button
                      onClick={() =>
                        onTriggerToast('تأیید رفع تداخل ثبت شد', `وضعیت ${selectedClash.code} به «حل‌شده» تغییر یافت.`, 'success')
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-[#00716B] hover:bg-[#005652] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">done_all</span>
                      <span>تأیید رفع تداخل</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Side Clash List Drawer (3 Cols) */}
              <div className="lg:col-span-3 bg-slate-50/50 flex flex-col justify-between">
                <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <span className="material-symbols-outlined text-base text-[#00716B]">format_list_bulleted</span>
                    <span>فهرست تعارضات دیسیپلین‌ها</span>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('clash-register')}
                    className="text-[11px] text-[#00716B] font-bold hover:underline"
                  >
                    نمایش کامل ({CLASHES.length})
                  </button>
                </div>

                {/* Scrollable list */}
                <div className="flex-1 p-2.5 flex flex-col gap-2 overflow-y-auto max-h-[460px]">
                  {CLASHES.slice(0, 8).map((clash) => {
                    const isSelected = clash.id === selectedClash.id;
                    return (
                      <div
                        key={clash.id}
                        onClick={() => setSelectedClash(clash)}
                        className={`p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-white border-2 border-[#00716B] shadow-2xs'
                            : 'bg-white border border-slate-200 hover:border-[#00716B]/60 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-[#00716B] text-white' : 'text-slate-500 font-mono'}`}>
                            {isSelected ? 'انتخاب‌شده در نما' : `${clash.discipline1} vs ${clash.discipline2}`}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              clash.severity === 'critical'
                                ? 'text-rose-600 bg-rose-50 border border-rose-200'
                                : clash.severity === 'medium'
                                ? 'text-amber-700 bg-amber-50 border border-amber-200'
                                : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                            }`}
                          >
                            {clash.severityLabel}
                          </span>
                        </div>

                        <div className="font-bold text-slate-800 text-xs mt-0.5 leading-snug">
                          {clash.title}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          <span>{clash.location}</span>
                          <span className="font-mono font-semibold text-[#00716B]">{clash.code}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#00716B]">verified_user</span>
                    <span>همگام با Navisworks</span>
                  </span>
                  <button
                    onClick={() => setActiveSubTab('clash-register')}
                    className="px-2.5 py-1.5 rounded-lg bg-[#00716B] text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>مشاهده جدول کلش‌ها</span>
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================
          VIEW 2: FULL CLASH REGISTER & DIRECTORY (User Requested)
          ========================================================= */}
      {activeSubTab === 'clash-register' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 lg:p-6 flex flex-col gap-6">
          {/* Header of Clash Register */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#00716B] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-2xl">table_chart</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    بانک جامع اطلاعات و رجیستر تمام تعارضات (Full Clash Register)
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00716B]/10 text-[#00716B] font-bold text-xs border border-[#00716B]/20 font-mono">
                    {filteredClashes.length} مورد نمایش داده شده
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  فهرست کامل تعارضات با تمام مشخصات فنی، المان‌های متلاقی، شناسه‌های رویت، مختصات کالبدی، عمق نفوذ و راهکار مدیر هماهنگی
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onTriggerToast('خروجی اکسل تحلیلی', 'فایل اکسل کلیه تعارضات با فرمت گزارش هفتگی باران صادر شد.', 'success')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">table_view</span>
                <span>خروجی اکسل تحلیلی</span>
              </button>
              <button
                onClick={() => onTriggerToast('صدور بسته BCF 3.0', 'کلیه تاپیک‌های فیلترشده با فرمت OpenBIM BCF ذخیره گردید.', 'success')}
                className="px-3.5 py-2 rounded-xl bg-[#00716B] hover:bg-[#005e59] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">file_download</span>
                <span>دریافت بسته BCF 3.0</span>
              </button>
            </div>
          </div>

          {/* Automatic Heatmap Matrix Filter Alert Banner */}
          {matrixFilterBadge && (
            <div className="p-4 rounded-2xl bg-teal-50 border-2 border-[#00716B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#00716B] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">filter_alt</span>
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#00716B]">
                      فیلتر خودکار از ماتریس حرارتی اعمال شده است:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-white border border-[#00716B]/30 text-slate-800 font-bold text-xs">
                      {matrixFilterBadge.floorTitle} • {matrixFilterBadge.colTitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    تعارضات مختص این سلول نمایش داده شده‌اند. برای مشاهده تمام تعارضات دکمه حذف فیلتر را بزنید.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearFilters}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                  <span>حذف فیلترها (نمایش همه)</span>
                </button>
                <button
                  onClick={() => setActiveSubTab('coordination-dashboard')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#00716B] hover:bg-[#005e59] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">grid_view</span>
                  <span>بازگشت به ماتریس</span>
                </button>
              </div>
            </div>
          )}

          {/* Search Bar & Multi-Dimensional Filters */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            {/* Search Input */}
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute right-3.5 top-3 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی سریع در کد کلش، عنوان، نام المان، شناسه رویت (ID)، موقعیت، مختصات یا یادداشت مدیر هماهنگی..."
                className="w-full bg-white border border-slate-200 text-xs rounded-xl pr-10 pl-4 py-2.5 text-slate-800 outline-none focus:border-[#00716B] shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
              {/* Filter 1: Floor / Zone */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-500">تراز طبقات / زون:</label>
                <select
                  value={floorLevelFilter}
                  onChange={(e) => {
                    setFloorLevelFilter(e.target.value);
                    if (matrixFilterBadge) setMatrixFilterBadge(null);
                  }}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 outline-none focus:border-[#00716B] cursor-pointer"
                >
                  <option value="all">همه ترازها ({CLASHES.length})</option>
                  <option value="floors-20-25">طبقات ۲۰ تا ۲۵ (برج)</option>
                  <option value="floors-10-19">طبقات ۱۰ تا ۱۹ (میانی)</option>
                  <option value="floors-1-9">طبقات ۱ تا ۹ (پایه)</option>
                  <option value="lobby">همکف و لابی</option>
                  <option value="basements">زیرزمین‌ها (B1-B4)</option>
                </select>
              </div>

              {/* Filter 2: Discipline Pair */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-500">جفت دیسیپلین:</label>
                <select
                  value={disciplinePairFilter}
                  onChange={(e) => {
                    setDisciplinePairFilter(e.target.value);
                    if (matrixFilterBadge) setMatrixFilterBadge(null);
                  }}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 outline-none focus:border-[#00716B] cursor-pointer"
                >
                  <option value="all">همه رشته‌ها</option>
                  <option value="STR_MEP">سازه × مکانیک (STR × MEP)</option>
                  <option value="STR_ARC">سازه × معماری (STR × ARC)</option>
                  <option value="MEP_ELC">مکانیک × برق (MEP × ELC)</option>
                  <option value="FAC_STR">نما × سازه (FAC × STR)</option>
                  <option value="ARC_MEP">معماری × مکانیک (ARC × MEP)</option>
                </select>
              </div>

              {/* Filter 3: Severity */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-500">شدت تعارض:</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 outline-none focus:border-[#00716B] cursor-pointer"
                >
                  <option value="all">همه شدت‌ها</option>
                  <option value="critical">بحرانی (Critical)</option>
                  <option value="medium">متوسط (Medium)</option>
                  <option value="low">خفیف (Low)</option>
                  <option value="resolved">حل‌شده (Resolved)</option>
                </select>
              </div>

              {/* Filter 4: Status */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-500">وضعیت پیگیری:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 outline-none focus:border-[#00716B] cursor-pointer"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="open">حل‌نشده (Open)</option>
                  <option value="pending">در حال بررسی (Pending)</option>
                  <option value="resolved">حل شده (Resolved)</option>
                </select>
              </div>

              {/* Filter 5: Type */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-500">نوع تداخل:</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 outline-none focus:border-[#00716B] cursor-pointer"
                >
                  <option value="all">همه انواع</option>
                  <option value="Hard Clash">تداخل سخت (Hard Clash)</option>
                  <option value="Soft Clearance">حریم نرم (Soft Clearance)</option>
                  <option value="Resolved">حل شده (Resolved)</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button if any filter active */}
            {(floorLevelFilter !== 'all' ||
              disciplinePairFilter !== 'all' ||
              severityFilter !== 'all' ||
              statusFilter !== 'all' ||
              typeFilter !== 'all' ||
              searchQuery) && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500">
                <span>
                  تعداد نتایج فیلتر: <strong className="text-[#00716B] font-bold">{filteredClashes.length}</strong> از مجموع {CLASHES.length} تعارض
                </span>
                <button
                  onClick={handleClearFilters}
                  className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">clear_all</span>
                  <span>پاک کردن تمام فیلترها</span>
                </button>
              </div>
            )}
          </div>

          {/* Full Specifications Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                  <th className="p-3.5 whitespace-nowrap">کد و استاندارد</th>
                  <th className="p-3.5 min-w-[200px]">شرح تعارض فنی</th>
                  <th className="p-3.5 text-center whitespace-nowrap">دیسیپلین‌ها</th>
                  <th className="p-3.5 min-w-[220px]">المان‌های متلاقی و کدهای رویت</th>
                  <th className="p-3.5 whitespace-nowrap">موقعیت و زون</th>
                  <th className="p-3.5 whitespace-nowrap">مختصات فضایی</th>
                  <th className="p-3.5 text-center whitespace-nowrap">نفوذ / فاصله</th>
                  <th className="p-3.5 text-center whitespace-nowrap">شدت</th>
                  <th className="p-3.5 text-center whitespace-nowrap">وضعیت</th>
                  <th className="p-3.5 min-w-[240px]">دستور اصلاحی مدیر هماهنگی</th>
                  <th className="p-3.5 text-center whitespace-nowrap">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {filteredClashes.length > 0 ? (
                  filteredClashes.map((clash) => (
                    <tr
                      key={clash.id}
                      className="hover:bg-teal-50/20 transition-colors group"
                    >
                      {/* 1. Code & Standard */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#00716B] font-mono text-xs">{clash.code}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{clash.type}</span>
                        </div>
                      </td>

                      {/* 2. Title & Description */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 leading-snug">{clash.title}</div>
                        <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">{clash.description}</div>
                      </td>

                      {/* 3. Disciplines */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-[#00716B] border border-teal-200/60 font-mono text-[11px] font-bold inline-block">
                          {clash.discipline1} ✕ {clash.discipline2}
                        </span>
                      </td>

                      {/* 4. Intersecting Elements & Revit IDs */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                            <span className="font-mono text-slate-800 font-bold truncate max-w-[120px]" title={clash.element1}>
                              {clash.element1}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1 rounded">
                              #{clash.element1Id}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                            <span className="font-mono text-slate-800 font-bold truncate max-w-[120px]" title={clash.element2}>
                              {clash.element2}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1 rounded">
                              #{clash.element2Id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 5. Physical Location & Zone */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-medium text-slate-900 text-xs">{clash.location}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{clash.zone}</div>
                      </td>

                      {/* 6. Coordinates */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 block text-left" dir="ltr">
                          {clash.coordinates}
                        </span>
                      </td>

                      {/* 7. Penetration / Clearance */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="font-mono font-bold text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200" dir="ltr">
                          {clash.penetration}
                        </span>
                      </td>

                      {/* 8. Severity */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold inline-block ${
                            clash.severity === 'critical'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : clash.severity === 'medium'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {clash.severityLabel}
                        </span>
                      </td>

                      {/* 9. Status */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            clash.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {clash.statusLabel}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{clash.age}</div>
                      </td>

                      {/* 10. Coordinator Resolution Note */}
                      <td className="p-3.5">
                        <div className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {clash.coordinatorNote}
                        </div>
                      </td>

                      {/* 11. Actions */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleViewIn3D(clash)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#00716B] hover:bg-[#005e59] text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                            title="مشاهده در نمایشگر سه‌بعدی"
                          >
                            <span className="material-symbols-outlined text-sm">view_in_ar</span>
                            <span>۳D</span>
                          </button>
                          <button
                            onClick={() => handleOpenDetailModal(clash)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                            title="مشاهده شناسنامه و پارامترها"
                          >
                            <span className="material-symbols-outlined text-sm">info</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                        <span className="font-bold text-sm">هیچ تعارضی با معیارهای فیلتر انتخابی یافت نشد.</span>
                        <p className="text-xs text-slate-400">
                          لطفاً فیلتر تراز طبقات یا دیسیپلین را تغییر دهید یا دکمه پاک کردن فیلترها را انتخاب کنید.
                        </p>
                        <button
                          onClick={handleClearFilters}
                          className="mt-2 px-4 py-1.5 rounded-xl bg-[#00716B] text-white text-xs font-bold"
                        >
                          نمایش کلیه تعارضات
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Summary Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span>تعداد ردیف‌های فعال: <strong className="text-slate-800">{filteredClashes.length}</strong></span>
              <span>همگام‌سازی: <strong className="text-emerald-700 font-mono">BCF v3.0 REST Server</strong></span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Xone Common Data Environment • Clash Matrix Engine
            </span>
          </div>
        </div>
      )}

      {/* Clash Detailed Technical Dossier Modal */}
      <ClashDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        clash={modalClash}
        onViewIn3D={handleViewIn3D}
        onTriggerToast={onTriggerToast}
      />
    </div>
  );
};
