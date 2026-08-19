import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Printer,
  Calendar,
  Building,
  CreditCard,
  Paintbrush,
  Layers,
} from 'lucide-react';

export const MyOrdersView: React.FC<{
  onOpenAuthModal: () => void;
}> = ({ onOpenAuthModal }) => {
  const { currentUser, orders, siteSettings, setActiveView } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-xl border border-emerald-100 text-center space-y-4 text-slate-800 dir-rtl">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
          <UserCheck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold">يرجى تسچيل معلوماتك الشخصية</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          قم بإدخال بياناتك (الاسم الكامل، رقم البطاقة الوطنية CIN، رقم الهاتف والعنوان) لتتمكن من استعراض طلباتك ومتابعة حالة تخصيص الدهانات.
        </p>
        <button
          onClick={onOpenAuthModal}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer"
        >
          أدخل بيانات الزبون الآن
        </button>
      </div>
    );
  }

  const userOrders = orders.filter((o) => o.userId === currentUser.id || o.userCin === currentUser.cin);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>قيد المراجعة والمعاينة</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>تم التأكيد والموافقة</span>
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 border border-teal-300 text-xs font-bold px-3 py-1 rounded-full">
            <Phone className="w-3.5 h-3.5 text-teal-600" />
            <span>تم الاتصال بالزبون</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold px-3 py-1 rounded-full">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 dir-rtl text-slate-800">
      {/* Client Profile Card */}
      <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white p-6 rounded-3xl shadow-xl border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-black shadow-lg">
            {currentUser.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{currentUser.fullName}</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                CIN: {currentUser.cin}
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/90 mt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentUser.phone}</span>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentUser.email}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentUser.address}</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenAuthModal}
          className="px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold border border-emerald-600/50 cursor-pointer self-start md:self-auto"
        >
          تعديل الملف الشخصي
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <span>سجل الطلبات وتخصيصات الدهانات المسجلة ({userOrders.length})</span>
          </h3>

          <button
            onClick={() => setActiveView('PAINT_STUDIO')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Paintbrush className="w-4 h-4 text-emerald-300" />
            <span>طلب تخصيص جديد</span>
          </button>
        </div>

        {userOrders.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <p className="text-xs text-slate-500">لا يوجد طلبات مسجلة حتى الآن في حسابك.</p>
            <button
              onClick={() => setActiveView('PAINT_STUDIO')}
              className="px-5 py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-xs"
            >
              افتح مخصص الصباغة والدهانات
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-extrabold bg-slate-900 text-emerald-300 px-3 py-1 rounded-lg">
                      {ord.id}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      شقة: {ord.apartmentCode} - {ord.apartmentTitle} ({ord.floorNameAr})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {ord.submittedAt}
                    </span>
                    {getStatusBadge(ord.status)}
                  </div>
                </div>

                {/* Customizations Table */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                    <Paintbrush className="w-3.5 h-3.5 text-emerald-600" />
                    <span>اختيارات الدهانات والصباغة المحددة لكل غرفة:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {ord.roomCustomizations.map((rc, idx) => (
                      <div key={idx} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/80 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-3 h-3 rounded-full border border-slate-400 shrink-0"
                              style={{ backgroundColor: rc.colorHex }}
                            />
                            <span>{rc.roomNameAr}</span>
                          </div>
                          {rc.isWallByWallMode && (
                            <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                              مُخصص جدار بحائط
                            </span>
                          )}
                        </div>

                        {rc.isWallByWallMode && rc.walls ? (
                          <div className="text-[10px] space-y-1 pt-1 border-t border-emerald-200/60 text-slate-700">
                            {Object.values(rc.walls).map((w: any) => (
                              <div key={w.wallPosition} className="flex items-center justify-between">
                                <span className="font-medium text-slate-800">{w.wallNameAr}:</span>
                                <span className="font-mono text-emerald-800">
                                  {w.paintCategoryNameAr.split(' ')[0]} ({w.colorNameAr})
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-600">
                            {rc.paintCategoryNameAr} • {rc.colorNameAr}
                          </p>
                        )}

                        <p className="text-[10px] text-emerald-800 font-bold pt-1 border-t border-emerald-100/60">
                          المساحة: {rc.estimatedAreaSqm} م² • التكلفة: {rc.totalRoomCost.toLocaleString()} درهم
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin Notes if any */}
                {ord.adminNotes && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <span className="font-bold">ملاحظات الإدارة: </span>
                    <span>{ord.adminNotes}</span>
                  </div>
                )}

                {/* Bottom Order Price & Print */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-slate-500">المجموع الكلي التقديري: </span>
                    <span className="font-extrabold text-sm text-emerald-800">
                      {ord.grandTotal.toLocaleString()} {siteSettings.currencySymbol}
                    </span>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>طباعة العقد والطلب</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
