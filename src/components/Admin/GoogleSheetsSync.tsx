import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  signInWithGoogle,
  logoutGoogle,
  initGoogleAuth,
  createGoogleSpreadsheet,
  getCachedToken,
} from '../../lib/googleSheets';
import { User } from 'firebase/auth';
import {
  FileSpreadsheet,
  LogOut,
  Download,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Building2,
  Palette,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react';

export const GoogleSheetsSync: React.FC = () => {
  const { orders, apartments, paintsCatalog, reviews, siteSettings } = useApp();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [createdSheetUrl, setCreatedSheetUrl] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'orders' | 'apartments' | 'paints' | 'reviews' | null;
    title: string;
    description: string;
  }>({ isOpen: false, type: null, title: '', description: '' });

  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { user, token } = await signInWithGoogle();
      setCurrentUser(user);
      setAccessToken(token);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء تسجيل الدخول بحساب Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setAccessToken(null);
    setSuccessMsg(null);
    setCreatedSheetUrl(null);
  };

  const requestExportConfirm = (type: 'orders' | 'apartments' | 'paints' | 'reviews') => {
    if (!accessToken) {
      setErrorMsg('يرجى تسجيل الدخول باستخدام حساب Google أولاً لتصدير البيانات إلى Google Sheets');
      return;
    }

    let title = '';
    let description = '';

    if (type === 'orders') {
      title = 'تصدير طلبات الشقق إلى Google Sheets';
      description = `سيتم إنشاء جدول بيانات جديد في Google Drive الخاص بك وتحميل (${orders.length}) من الطلبات والحجوزات المسجلة. هل تريد المتابعة؟`;
    } else if (type === 'apartments') {
      title = 'تصدير قائمة الشقق إلى Google Sheets';
      description = `سيتم إنشاء جدول بيانات جديد يحتوي على معلومات (${apartments.length}) شقة بالأسعار والتفاصيل. هل تريد المتابعة؟`;
    } else if (type === 'paints') {
      title = 'تصدير كتالوج الدهانات والصباغة إلى Google Sheets';
      description = `سيتم إنشاء جدول جديد يحتوي على (${paintsCatalog.length}) نوعاً من الدهانات والألوان المتوفرة في الكتالوج. هل تريد المتابعة؟`;
    } else if (type === 'reviews') {
      title = 'تصدير تقييمات الزبناء إلى Google Sheets';
      description = `سيتم إنشاء جدول بيانات بجميع مراجعات وتوصيات الزبناء (${reviews.length}). هل تريد المتابعة؟`;
    }

    setConfirmDialog({ isOpen: true, type, title, description });
  };

  const executeExport = async () => {
    if (!accessToken || !confirmDialog.type) return;

    const token = accessToken || getCachedToken();
    if (!token) {
      setErrorMsg('انتهت جلسة الوصول. يرجى تسجيل الدخول مجدداً.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setCreatedSheetUrl(null);

    const type = confirmDialog.type;
    setConfirmDialog({ isOpen: false, type: null, title: '', description: '' });

    try {
      let sheetTitle = '';
      let headers: string[] = [];
      let rows: (string | number)[][] = [];

      const dateStr = new Date().toISOString().slice(0, 10);

      if (type === 'orders') {
        sheetTitle = `${siteSettings.siteTitle} - طلبات وحجوزات الشقق (${dateStr})`;
        headers = [
          'رقم الطلب',
          'تاريخ الطلب',
          'اسم الزبون',
          'رقم الهاتف',
          'البريد الإلكتروني',
          'الشقة المحددة',
          'الطابق والنوع',
          'السعر الإجمالي (درهم)',
          'حالة الطلب',
          'تفضيلات الصباغة المختارة',
          'ملاحظات إضافية',
        ];
        rows = orders.map((o) => [
          o.id,
          new Date(o.createdAt).toLocaleDateString('ar-MA'),
          o.clientName,
          o.clientPhone,
          o.clientEmail || '-',
          o.apartmentTitle,
          o.apartmentFloor,
          o.totalPrice,
          o.status === 'PENDING' ? 'قيد المراجعة' : o.status === 'CONFIRMED' ? 'مؤكد' : 'ملغي',
          o.selectedPaints
            ? Object.entries(o.selectedPaints)
                .map(([room, paint]: [string, any]) => `${room}: ${paint?.nameAr || paint?.nameFr || ''} (${paint?.colorName || paint?.colorHex || ''})`)
                .join(' | ')
            : 'بدون ألوان خاصة',
          o.notes || '-',
        ]);
      } else if (type === 'apartments') {
        sheetTitle = `${siteSettings.siteTitle} - قائمة الشقق والأسعار (${dateStr})`;
        headers = [
          'معرف الشقة',
          'عنوان الشقة',
          'العمارة / المجمع',
          'الطابق',
          'المساحة (م²)',
          'عدد الغرف',
          'السعر الإجمالي (درهم)',
          'الحالة الحالية',
          'المميزات',
        ];
        rows = apartments.map((a) => [
          a.id,
          a.title,
          a.buildingName,
          a.floor,
          a.areaM2,
          a.roomsCount,
          a.priceTotal,
          a.status === 'AVAILABLE' ? 'متوفرة' : a.status === 'RESERVED' ? 'محجوزة' : 'مباعة',
          a.features ? a.features.join(' - ') : '-',
        ]);
      } else if (type === 'paints') {
        sheetTitle = `${siteSettings.siteTitle} - كتالوج الدهانات والصباغة (${dateStr})`;
        headers = ['كود الدهان', 'اسم الصباغة بالعربية', 'الاسم بالفرنسية', 'الفئة', 'اللون التوضيحي', 'الوصف'];
        rows = paintsCatalog.map((p) => [
          p.id,
          p.nameAr,
          p.nameFr,
          p.category,
          p.colorHex,
          p.descriptionAr || '-',
        ]);
      } else if (type === 'reviews') {
        sheetTitle = `${siteSettings.siteTitle} - تقييمات وملاحظات الزبناء (${dateStr})`;
        headers = ['معرف التقييم', 'اسم الزبون', 'المدينة', 'التقييم (من 5)', 'التعليق والإنطباع', 'حالة النشر'];
        rows = reviews.map((r) => [
          r.id,
          r.clientName,
          r.city || '-',
          r.rating,
          r.comment,
          r.approved ? 'منشور' : 'قيد المراجعة',
        ]);
      }

      const result = await createGoogleSpreadsheet(sheetTitle, headers, rows, token);
      setCreatedSheetUrl(result.spreadsheetUrl);
      setSuccessMsg(`تم تصدير (${rows.length}) سجل بنجاح إلى جدول البيانات الجديد على Google Sheets!`);
    } catch (err: any) {
      console.error('Spreadsheet export failed:', err);
      setErrorMsg(err.message || 'حدث خطأ أثناء الاتصال بـ Google Sheets API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm space-y-6 dir-rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-md">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <span>تزامن وتصدير البيانات إلى Google Sheets</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                رسمي ومعتمد
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              قم بربط حساب Google الخاص بالشركة لتصدير ومشاركة كافة طلبات الشقق وكتالوج الصباغة مباشرة في جداول بيانات Google Sheets.
            </p>
          </div>
        </div>

        {/* Auth Status & Action */}
        <div>
          {currentUser ? (
            <div className="flex items-center gap-3 p-2 bg-emerald-50 border border-emerald-200 rounded-2xl">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="" className="w-8 h-8 rounded-full border border-emerald-400" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                  {currentUser.displayName?.[0] || 'G'}
                </div>
              )}
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">{currentUser.displayName || 'مستخدم Google'}</p>
                <p className="text-[10px] text-slate-500 font-mono" dir="ltr">{currentUser.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 hover:bg-emerald-200 text-emerald-900 rounded-xl transition-all cursor-pointer"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>تسجيل الدخول بحساب Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          {createdSheetUrl && (
            <a
              href={createdSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow transition-all mt-1"
            >
              <ExternalLink className="w-4 h-4" />
              <span>فتح جدول البيانات مباشرة في Google Sheets</span>
            </a>
          )}
        </div>
      )}

      {/* Export Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {/* Export Orders */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-amber-500/10 text-amber-700 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              {orders.length} طلب
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">جدول الحجوزات والطلبات</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">تصدير جميع طلبات الزبناء واختيارات الصباغة لجدول شيت جديد.</p>
          </div>
          <button
            onClick={() => requestExportConfirm('orders')}
            disabled={isLoading}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>تصدير الطلبات كـ Sheet</span>
          </button>
        </div>

        {/* Export Apartments */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-500/10 text-blue-700 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {apartments.length} شقة
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">جدول الشقق والأسعار</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">تصدير المساحات والطوابق والأسعار لمشاركتها مع فريق المبيعات.</p>
          </div>
          <button
            onClick={() => requestExportConfirm('apartments')}
            disabled={isLoading}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>تصدير الشقق كـ Sheet</span>
          </button>
        </div>

        {/* Export Paints Catalog */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-500/10 text-purple-700 rounded-xl">
              <Palette className="w-5 h-5" />
            </div>
            <span className="text-xs font-black bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
              {paintsCatalog.length} دهان
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">جدول كتالوج الصباغة</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">تصدير جميع أنواع وأكواد الصباغة الحرة المتوفرة بالمعرض.</p>
          </div>
          <button
            onClick={() => requestExportConfirm('paints')}
            disabled={isLoading}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>تصدير الدهانات كـ Sheet</span>
          </button>
        </div>

        {/* Export Reviews */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-rose-500/10 text-rose-700 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-black bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
              {reviews.length} تقييم
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">جدول آراء وتقييمات الزبناء</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">تصدير كل توصيات وتعليقات الزبناء المسجلة بالموقع.</p>
          </div>
          <button
            onClick={() => requestExportConfirm('reviews')}
            disabled={isLoading}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>تصدير المراجعات كـ Sheet</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 dir-rtl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">{confirmDialog.title}</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{confirmDialog.description}</p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>سيطلب التطبيق موافقتك وإنشاء الملف مباشرة داخل مجلد Google Drive الخاص بك.</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={executeExport}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                تأكيد الإنشاء والتصدير الآن
              </button>
              <button
                onClick={() => setConfirmDialog({ isOpen: false, type: null, title: '', description: '' })}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
