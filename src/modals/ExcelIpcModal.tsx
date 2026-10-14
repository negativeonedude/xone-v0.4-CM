import React, { useState } from 'react';
import { IpcCertificate, IpcItem } from '../types';
import { useDissolve } from '../hooks/useDissolve';

interface ExcelIpcModalProps {
  isOpen: boolean;
  onClose: () => void;
  ipcData?: IpcCertificate;
  onApprove?: (id: string, note: string) => void;
  onRevision?: (id: string, note: string) => void;
  onTriggerToast: (title: string, desc: string, type?: 'success' | 'error' | 'info') => void;
}

export const ExcelIpcModal: React.FC<ExcelIpcModalProps> = ({
  isOpen,
  onClose,
  ipcData,
  onApprove,
  onRevision,
  onTriggerToast
}) => {
  const [activeSheet, setActiveSheet] = useState<'boq' | 'summary' | 'deductions' | 'signatures'>('boq');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string; val: string }>({
    row: 1,
    col: 'C',
    val: 'بتن‌ریزی با بتن آماده عیار ۴۰۰ در شمع‌ها و فونداسیون'
  });
  const [searchFilter, setSearchFilter] = useState('');
  const [managerNote, setManagerNote] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [verifiedRows, setVerifiedRows] = useState<Record<string, boolean>>({
    'ipc-1': true,
    'ipc-2': true,
    'ipc-3': true
  });

  const { visible, closing } = useDissolve(isOpen);

  if (!visible) return null;

  // Fallback default IPC if not supplied
  const data: IpcCertificate = ipcData || {
    id: 'ipc-alpha-05',
    docCode: 'ALF-QS-PAY-2025-XLSX-005.xlsx',
    title: 'صورت‌وضعیت کارکرد موقت شماره ۵ - اسکلت بتنی و سفت‌کاری برج آلفا',
    period: '۱ تا ۳۰ بهمن ۱۴۰۳ (دوره ۱ ماهه)',
    contractor: 'شرکت مهندسی عمران‌سازان پایدار (پیمانکار عمومی)',
    consultant: 'مهندسین مشاور سازه‌پردازان پایا (مشاور نظارت)',
    submissionDate: '۱۵ اسفند ۱۴۰۳',
    grossAmount: 18450200000,
    prevGrossAmount: 106349800000,
    totalGrossAmount: 124800000000,
    insuranceDeduction: 922510000, // 5%
    retentionDeduction: 1845020000, // 10%
    advanceRepayment: 0,
    netPayable: 15682670000,
    status: 'pending',
    statusLabel: 'در انتظار بررسی و تایید مدیر طراحی',
    items: [
      {
        id: 'ipc-1',
        itemNo: '070201',
        description: 'بتن‌ریزی با بتن آماده استاندارد عیار ۴۰۰ کیلوگرم سیمان در دال‌ها و دیوارهای برشی',
        unit: 'مترمکعب',
        unitRate: 18500000,
        prevQty: 210,
        currentQty: 185,
        totalQty: 395,
        totalAmount: 3422500000,
        bimStatus: 'matched',
        bimNote: 'انطباق ۱۰۰٪ با حجم احجام رویت هسته مرکزی طبقه ۱۸ تا ۲۲'
      },
      {
        id: 'ipc-2',
        itemNo: '070402',
        description: 'تهیه، برش، خم، حمل و کار گذاشتن میلگرد آجدار فولادی A3 با قطر ۱۶ تا ۲۵ میلی‌متر',
        unit: 'کیلوگرم',
        unitRate: 465000,
        prevQty: 18200,
        currentQty: 12400,
        totalQty: 30600,
        totalAmount: 5766000000,
        bimStatus: 'matched',
        bimNote: 'بر اساس شیت‌های آرماتوربندی فاز ۲ (Rev 03)'
      },
      {
        id: 'ipc-3',
        itemNo: '080101',
        description: 'قالب‌بندی فلزی مدولار سطوح شاقولی و دیوارهای برشی حائل به همراه پشت‌بند و داربست',
        unit: 'مترمربع',
        unitRate: 3850000,
        prevQty: 640,
        currentQty: 450,
        totalQty: 1090,
        totalAmount: 1732500000,
        bimStatus: 'verified',
        bimNote: 'صورت‌جلسه کارگاهی شماره ۴۲ به پیوست مدرک'
      },
      {
        id: 'ipc-4',
        itemNo: '090203',
        description: 'عملیات پیش‌تنیدگی کابل‌های استرند با غلاف‌گذاری و گروت‌ریزی در دال‌های مجوف',
        unit: 'متر طول',
        unitRate: 12200000,
        prevQty: 110,
        currentQty: 95,
        totalQty: 205,
        totalAmount: 1159000000,
        bimStatus: 'matched',
        bimNote: 'تاییدیه نماینده مهندسین مشاور سازه‌بنیان'
      },
      {
        id: 'ipc-5',
        itemNo: '100305',
        description: 'تهیه و نصب اتصالات وال‌پست فولادی گالوانیزه نوین و مهار لرزه‌ای دیوارهای پیرامونی',
        unit: 'شاخه',
        unitRate: 8700000,
        prevQty: 180,
        currentQty: 140,
        totalQty: 320,
        totalAmount: 1218000000,
        bimStatus: 'discrepancy',
        bimNote: '۲.۴ متر اضافه متراژ نسبت به مدل CDE کسر گردید'
      },
      {
        id: 'ipc-6',
        itemNo: '140102',
        description: 'لوله‌کشی فلزی بدون درز سیستم اطفای حریق تر و اسپرینکلر لابی و فضاهای خدماتی',
        unit: 'متر',
        unitRate: 4900000,
        prevQty: 240,
        currentQty: 160,
        totalQty: 400,
        totalAmount: 784000000,
        bimStatus: 'verified',
        bimNote: 'مطابق نقشه شفت شرقی (ALF-MEP-SHF-R2025)'
      },
      {
        id: 'ipc-7',
        itemNo: '210101',
        description: 'اضافه بهای حمل و پمپاژ بتن با پمپ دکل در ارتفاع بالاتر از تراز +۷۰ متر',
        unit: 'مترمکعب',
        unitRate: 4150000,
        prevQty: 210,
        currentQty: 185,
        totalQty: 395,
        totalAmount: 767750000,
        bimStatus: 'matched',
        bimNote: 'طبق محاسبه تراز ارتفاعی مدل BIM'
      }
    ]
  };

  const filteredItems = data.items.filter((item) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      item.itemNo.toLowerCase().includes(q) ||
      item.description.includes(q) ||
      (item.bimNote && item.bimNote.includes(q))
    );
  });

  const toggleRowVerified = (id: string) => {
    setVerifiedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(data.id, managerNote);
    }
    onTriggerToast(
      'تایید صورت‌وضعیت مالی توسط مدیر طراحی',
      `صورت‌وضعیت «${data.docCode}» به مبلغ مصوب ۱۵,۶۸۲,۶۷۰,۰۰۰ ریال تایید و جهت پرداخت به مدیریت مالی ارسال شد.`,
      'success'
    );
    onClose();
  };

  const handleRevision = () => {
    if (onRevision) {
      onRevision(data.id, managerNote);
    }
    onTriggerToast(
      'درخواست بازبینی و اصلاح مقادیر',
      `صورت‌وضعیت به همراه یادداشت اصلاحی مدیر طراحی به پیمانکار ارجاع داده شد.`,
      'info'
    );
    onClose();
  };

  const formatRials = (num: number) => {
    return num.toLocaleString('fa-IR') + ' ریال';
  };

  return (
    <div
      className={`fixed inset-0 z-[145] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto ${closing ? 'animate-backdrop-dissolve-out' : 'animate-backdrop-dissolve'}`}
      data-lenis-prevent
      dir="rtl"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden ${closing ? 'animate-modal-dissolve-out' : 'animate-modal-dissolve'} transition-all duration-200 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl max-h-[92vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================
            1. EXCEL APPLICATION WINDOW TOP BAR (GREEN EXCEL RIBBON)
            ========================================================= */}
        <div className="bg-[#107C41] text-white px-4 py-2.5 flex items-center justify-between select-none shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center font-bold text-white text-base shadow-2xs">
              <span className="material-symbols-outlined text-xl">table_chart</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-wide">
                  پیش‌نمایش قالب اکسل صورت‌وضعیت مالی (CDE Excel IPC Viewer)
                </span>
                <span className="px-2 py-0.2 bg-white/20 text-white rounded text-[11px] font-mono font-bold">
                  .XLSX
                </span>
                <span className="px-2 py-0.2 bg-amber-400 text-slate-900 rounded-full text-[10px] font-bold">
                  در انتظار تایید مدیر طراحی
                </span>
              </div>
              <span className="text-[11px] text-white/80 font-mono" dir="ltr">
                {data.docCode} • WBS: 1042-PH1-STR-CONCRETE-IPC05
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onTriggerToast('دریافت فایل اصلی', `در حال دانلود فایل خام «${data.docCode}» با فرمول‌های محاسباتی اکسل...`, 'success');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors"
              title="دانلود فایل اکسل"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>دریافت فایل XLSX</span>
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={isFullscreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه'}
            >
              <span className="material-symbols-outlined text-base">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-600 text-white transition-colors"
              title="بستن (ESC)"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            2. DESIGN MANAGER SUMMARY BANNER & FINANCIAL KPI HUD
            ========================================================= */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {/* Meta Col 1 */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[11px] mb-1">مشخصات سند و پیمانکار:</span>
              <div className="font-bold text-slate-800 truncate">{data.title}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">{data.contractor}</div>
              <div className="text-slate-400 text-[10px] mt-0.5">دوره: {data.period}</div>
            </div>

            {/* Meta Col 2: Gross Amount */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[11px] mb-1">ناخالص کارکرد این دوره:</span>
              <div className="font-bold text-base text-slate-900 font-mono">
                {formatRials(data.grossAmount)}
              </div>
              <span className="text-slate-500 text-[11px]">
                تجمعی کل: {formatRials(data.totalGrossAmount)}
              </span>
            </div>

            {/* Meta Col 3: Deductions */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 block text-[11px] mb-1">کسورات قانونی (بیمه ۵٪ + حسن انجام کار ۱۰٪):</span>
              <div className="font-bold text-sm text-rose-600 font-mono">
                - {formatRials(data.insuranceDeduction + data.retentionDeduction)}
              </div>
              <span className="text-[10px] text-slate-400">بیمه: {formatRials(data.insuranceDeduction)}</span>
            </div>

            {/* Meta Col 4: Approved Net Payable */}
            <div className="bg-emerald-50/90 border border-emerald-300 p-3 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-emerald-800 font-bold text-[11px]">خالص مصوب قابل پرداخت:</span>
                <span className="material-symbols-outlined text-emerald-600 text-sm">verified</span>
              </div>
              <div className="font-bold text-lg text-emerald-900 font-mono">
                {formatRials(data.netPayable)}
              </div>
              <span className="text-[10px] text-emerald-700">
                ۹۷.۶٪ انطباق حجم با مدل رویت CDE
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            3. EXCEL FORMULA BAR & SHEET TABS
            ========================================================= */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0">
          {/* Formula Bar */}
          <div className="flex items-center gap-2 flex-1 max-w-2xl bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-mono">
            <span className="text-slate-400 font-bold text-[11px] border-l border-slate-300 pl-2">
              {selectedCell.col}{selectedCell.row}
            </span>
            <span className="text-slate-400 italic font-sans text-xs">fx</span>
            <span className="text-slate-800 text-xs truncate">
              {selectedCell.row === 1
                ? '=SUM(G2:G8) * 0.90'
                : selectedCell.val || '=VLOOKUP(B' + selectedCell.row + ', CDE_RVT_QTO, 4, FALSE)'}
            </span>
          </div>

          {/* Quick Search inside sheet */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute right-2.5 top-1.5 text-slate-400 text-sm">
                search
              </span>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="جستجو در اقلام صورت‌وضعیت..."
                className="bg-slate-50 border border-slate-200 rounded-lg pr-7 pl-2 py-1 text-xs outline-none focus:border-[#107C41] w-48"
              />
            </div>

            {/* Sheets Switcher Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveSheet('boq')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  activeSheet === 'boq'
                    ? 'bg-white text-[#107C41] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                شیت ۱: ریز متره و مقادیر
              </button>
              <button
                onClick={() => setActiveSheet('summary')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  activeSheet === 'summary'
                    ? 'bg-white text-[#107C41] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                شیت ۲: خلاصه مالی
              </button>
              <button
                onClick={() => setActiveSheet('deductions')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  activeSheet === 'deductions'
                    ? 'bg-white text-[#107C41] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                شیت ۳: کسورات و ضمانت
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            4. SPREADSHEET GRID (EXCEL SHEET CONTENT)
            ========================================================= */}
        <div className="flex-1 overflow-auto bg-slate-100 p-3">
          {activeSheet === 'boq' && (
            <div className="bg-white border border-slate-300 rounded-xl shadow-xs overflow-hidden">
              <table className="w-full text-xs text-right border-collapse">
                {/* Excel Column Letters Header */}
                <thead>
                  <tr className="bg-slate-100 text-slate-500 font-mono text-[11px] border-b border-slate-300 select-none">
                    <th className="w-10 py-1.5 text-center border-l border-slate-200 bg-slate-200/60">#</th>
                    <th className="py-1.5 px-2 border-l border-slate-200 w-12 text-center">A</th>
                    <th className="py-1.5 px-3 border-l border-slate-200 w-24">B (شماره ردیف)</th>
                    <th className="py-1.5 px-3 border-l border-slate-200">C (شرح عملیات طبق فهرست بها)</th>
                    <th className="py-1.5 px-2 border-l border-slate-200 w-16 text-center">D (واحد)</th>
                    <th className="py-1.5 px-3 border-l border-slate-200 w-28 text-left">E (بهای واحد - ریال)</th>
                    <th className="py-1.5 px-2 border-l border-slate-200 w-20 text-center">F (مقدار دوره قبل)</th>
                    <th className="py-1.5 px-2 border-l border-slate-200 w-20 text-center">G (دوره جاری)</th>
                    <th className="py-1.5 px-2 border-l border-slate-200 w-20 text-center">H (جمع تجمعی)</th>
                    <th className="py-1.5 px-3 border-l border-slate-200 w-32 text-left">I (مبلغ دوره - ریال)</th>
                    <th className="py-1.5 px-3 w-40">J (تطابق CDE-BIM)</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 font-sans">
                  {filteredItems.map((item, index) => {
                    const isSelected = selectedCell.row === index + 1;
                    const isVerified = verifiedRows[item.id];
                    return (
                      <tr
                        key={item.id}
                        onClick={() =>
                          setSelectedCell({ row: index + 1, col: 'C', val: item.description })
                        }
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-teal-50/80 ring-1 ring-inset ring-[#107C41]' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        {/* Row Number (Excel Left index) */}
                        <td className="py-2 text-center text-slate-400 font-mono text-[11px] bg-slate-50 border-l border-slate-200 select-none">
                          {index + 1}
                        </td>

                        {/* Checkbox for Design Manager Verification */}
                        <td
                          className="py-2 px-2 text-center border-l border-slate-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowVerified(item.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={!!isVerified}
                            onChange={() => toggleRowVerified(item.id)}
                            className="w-4 h-4 rounded text-[#107C41] cursor-pointer"
                            title="تایید ردیف توسط مدیر طراحی"
                          />
                        </td>

                        {/* Item Code */}
                        <td className="py-2 px-3 font-mono font-bold text-slate-800 border-l border-slate-200">
                          {item.itemNo}
                        </td>

                        {/* Description */}
                        <td className="py-2 px-3 text-slate-900 border-l border-slate-200 leading-relaxed">
                          <div className="font-medium">{item.description}</div>
                          {item.bimNote && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-[13px] text-teal-600">view_in_ar</span>
                              <span>{item.bimNote}</span>
                            </div>
                          )}
                        </td>

                        {/* Unit */}
                        <td className="py-2 px-2 text-center text-slate-600 border-l border-slate-200 font-medium">
                          {item.unit}
                        </td>

                        {/* Unit Rate */}
                        <td className="py-2 px-3 text-left font-mono text-slate-700 border-l border-slate-200" dir="ltr">
                          {item.unitRate.toLocaleString('fa-IR')}
                        </td>

                        {/* Prev Qty */}
                        <td className="py-2 px-2 text-center font-mono text-slate-500 border-l border-slate-200">
                          {item.prevQty.toLocaleString('fa-IR')}
                        </td>

                        {/* Current Qty */}
                        <td className="py-2 px-2 text-center font-mono font-bold text-[#107C41] border-l border-slate-200 bg-emerald-50/40">
                          {item.currentQty.toLocaleString('fa-IR')}
                        </td>

                        {/* Total Qty */}
                        <td className="py-2 px-2 text-center font-mono font-semibold text-slate-800 border-l border-slate-200">
                          {item.totalQty.toLocaleString('fa-IR')}
                        </td>

                        {/* Total Amount */}
                        <td className="py-2 px-3 text-left font-mono font-bold text-slate-900 border-l border-slate-200" dir="ltr">
                          {item.totalAmount.toLocaleString('fa-IR')}
                        </td>

                        {/* BIM Status Badge */}
                        <td className="py-2 px-3">
                          {item.bimStatus === 'matched' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                              <span className="material-symbols-outlined text-[12px]">check_circle</span>
                              منطبق با BIM
                            </span>
                          )}
                          {item.bimStatus === 'verified' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-300">
                              <span className="material-symbols-outlined text-[12px]">verified</span>
                              تایید میدانی
                            </span>
                          )}
                          {item.bimStatus === 'discrepancy' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                              <span className="material-symbols-outlined text-[12px]">warning</span>
                              کسر ۲.۴ متر
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Table Footer Totals */}
                <tfoot>
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td colSpan={9} className="py-2.5 px-4 text-left border-l border-slate-200">
                      جمع کل ناخالص کارکرد دوره جاری (ریال):
                    </td>
                    <td className="py-2.5 px-3 text-left font-mono text-sm text-[#107C41] border-l border-slate-200" dir="ltr">
                      {data.grossAmount.toLocaleString('fa-IR')}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-slate-500">
                      {verifiedRows ? Object.keys(verifiedRows).length : 0} ردیف بازبینی شد
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {activeSheet === 'summary' && (
            <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs max-w-3xl mx-auto space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-base font-bold text-slate-900">
                  خلاصه مالی و گواهی پرداخت موقت (Payment Summary Certificate)
                </h4>
                <p className="text-xs text-slate-500">
                  خلاصه صورت وضعیت کارکرد شماره ۵ بر اساس ضرایب پیمان و تعدیل معتبر
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">۱. مبلغ کل کارکرد ناخالص از ابتدای پیمان تا این دوره:</span>
                  <span className="font-mono font-bold text-slate-900">{formatRials(data.totalGrossAmount)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">۲. کارکرد ناخالص دوره‌های پیشین (تا صورت‌وضعیت ۴):</span>
                  <span className="font-mono text-slate-700">{formatRials(data.prevGrossAmount)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200 bg-slate-50 px-2 rounded">
                  <span className="font-bold text-slate-900">۳. مبلغ کارکرد ناخالص این دوره (۱ منهای ۲):</span>
                  <span className="font-mono font-bold text-[#107C41] text-sm">{formatRials(data.grossAmount)}</span>
                </div>

                <div className="pt-2 text-slate-500 font-bold">کسورات قانونی و قراردادی:</div>
                <div className="flex justify-between py-1.5 text-slate-600 pr-4">
                  <span>- سپرده بیمه سهم پیمانکار (۵٪ کارکرد ناخالص):</span>
                  <span className="font-mono text-rose-600">- {formatRials(data.insuranceDeduction)}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-600 pr-4">
                  <span>- سپرده حسن انجام کار (۱۰٪ کارکرد ناخالص):</span>
                  <span className="font-mono text-rose-600">- {formatRials(data.retentionDeduction)}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-600 pr-4">
                  <span>- استهلاک پیش‌پرداخت دوره:</span>
                  <span className="font-mono text-slate-500">۰ ریال (مستهلک شده در دوره‌های ۱ تا ۳)</span>
                </div>

                <div className="flex justify-between py-3 border-t-2 border-emerald-500 bg-emerald-50/70 p-3 rounded-xl mt-4">
                  <span className="font-bold text-emerald-900 text-sm">مبلغ خالص قابل پرداخت پس از تایید مدیر طراحی:</span>
                  <span className="font-mono font-bold text-emerald-900 text-base">{formatRials(data.netPayable)}</span>
                </div>
              </div>
            </div>
          )}

          {activeSheet === 'deductions' && (
            <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs max-w-3xl mx-auto space-y-4 text-xs">
              <h4 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                جدول محاسبه کسورات قانونی و ضمانت‌نامه‌های معتبر پیمان
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800 mb-2">ضمانت‌نامه حسن انجام تعهدات:</div>
                  <div className="space-y-1 text-slate-600">
                    <div>شماره ضمانت‌نامه: BG-TEJ-4029-881</div>
                    <div>بانک عامل: تجارت شعبه مرکزی</div>
                    <div>مبلغ: ۵۰ میلیارد ریال</div>
                    <div className="text-emerald-700 font-bold">وضعیت: معتبر تا پایان شهریور ۱۴۰۴</div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800 mb-2">سپرده‌های مکسوره تجمعی:</div>
                  <div className="space-y-1 text-slate-600">
                    <div>مجموع سپرده بیمه نزد کارفرما: ۶,۲۴۰,۰۰۰,۰۰۰ ریال</div>
                    <div>مجموع حسن انجام کار (۱۰٪): ۱۲,۴۸۰,۰۰۰,۰۰۰ ریال</div>
                    <div>مفاصاحساب مرحله‌ای تأمین اجتماعی: استعلام شد (بدون بدهی)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================
            5. DESIGN MANAGER REVIEW ACTION BAR & DIGITAL SIGNATURE
            ========================================================= */}
        <div className="bg-white border-t border-slate-200 p-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-xl">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              یادداشت و دستور فنی مدیر طراحی CDE (ثبت در گردش کار رسمی ISO):
            </label>
            <input
              type="text"
              value={managerNote}
              onChange={(e) => setManagerNote(e.target.value)}
              placeholder="مثال: احجام بر اساس مدل رویت فاز ۲ تایید شد. مبلغ خالص مصوب ۱۵.۶۸ میلیارد ریال به امور مالی ابلاغ گردد..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#107C41]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRevision}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">edit_note</span>
              <span>درخواست اصلاح و کسر مقادیر</span>
            </button>

            <button
              onClick={handleApprove}
              className="px-5 py-2 rounded-xl bg-[#107C41] hover:bg-[#0c6334] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">task_alt</span>
              <span>تایید صورت‌وضعیت و ابلاغ مالی</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
