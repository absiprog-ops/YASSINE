import React, { useState } from 'react';
import { ClientOrder, OrderStatus, SiteSettings } from '../../types';
import {
  FileSpreadsheet,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Printer,
  ChevronDown,
  ChevronUp,
  Palette,
  Home,
  Layers,
  DollarSign,
  FileText,
  UserCheck,
  Send,
  Trash2,
} from 'lucide-react';

interface ClientCustomizationsHistoryProps {
  orders: ClientOrder[];
  siteSettings: SiteSettings;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, adminNotes?: string) => void;
  onDeleteOrder: (orderId: string) => void;
  initialFilterCin?: string;
  isAr: boolean;
}

export const ClientCustomizationsHistory: React.FC<ClientCustomizationsHistoryProps> = ({
  orders,
  siteSettings,
  onUpdateOrderStatus,
  onDeleteOrder,
  initialFilterCin = '',
  isAr,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilterCin);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Quote Invoice Modal
  const [printingOrder, setPrintingOrder] = useState<ClientOrder | null>(null);

  // Admin note editing
  const [adminNoteInput, setAdminNoteInput] = useState<{ [orderId: string]: string }>({});

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userCin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userPhone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.apartmentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-black rounded-lg text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>طلب معتمد ومقبول</span>
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="px-2.5 py-1 bg-sky-100 text-sky-900 border border-sky-300 font-black rounded-lg text-[11px] flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>تم الاتصال بالعميل</span>
          </span>
        );
      case 'REVIEWED':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-black rounded-lg text-[11px] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>قيد الدراسة والمعاينة</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-900 border border-rose-300 font-black rounded-lg text-[11px] flex items-center gap-1">
            <span>طلب ملغى</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-300 font-black rounded-lg text-[11px] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>جديد بانتظار المراجعة</span>
          </span>
        );
    }
  };

  // Generate WhatsApp formatted quote message
  const getWhatsAppQuoteUrl = (order: ClientOrder) => {
    const cleanPhone = order.userPhone.replace(/[^0-9]/g, '');
    const phoneFormatted = cleanPhone.startsWith('0') ? `212${cleanPhone.slice(1)}` : cleanPhone;

    let msg = `السلام عليكم ورحمة الله السيد(ة) *${order.userFullName}* (CIN: ${order.userCin})\n`;
    msg += `مرفق مع هذا عرض السعر النهائي والتقديري لخيارات تشطيب الدهانات لشقتكم *${order.apartmentCode}* إقامة Magha Immobilier R+2:\n\n`;

    order.roomCustomizations.forEach((room) => {
      msg += `• *${room.roomNameAr}*: دهان ${room.paintCategoryNameAr} (اللون: ${room.colorNameAr}) - المساحة: ${room.estimatedAreaSqm}م² = ${room.totalRoomCost.toLocaleString()} درهم\n`;
    });

    msg += `\n*مجموع تكلفة تشطيب الدهانات والديكور:* ${order.totalCustomizationPrice.toLocaleString()} ${siteSettings.currencySymbol}\n`;
    msg += `*المجموع الإجمالي النهائي مع الشقة:* ${order.grandTotal.toLocaleString()} ${siteSettings.currencySymbol}\n\n`;
    msg += `نتشرف بزيارتكم في مكتب المبيعات أو الاتصال بنا لتأكيد موعد البدء.`;

    return `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100 space-y-6 dir-rtl text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950 text-amber-300 rounded-2xl shadow-md">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>سجل تصاميم وتخصيصات الدهانات والأثاث للعملاء</span>
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300">
                {orders.length} طلب ومواصفة
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              مراجعة تفصيلية لغرف كل عميل، أنواع الدهانات المعتمدة (خيال، عنبرة)، المساحات وحساب الكميات باللترات والعروض المعتمدة.
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث باسم الزبون، رقم CIN، رمز الشقة أو رقم الطلب..."
            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-emerald-600 shadow-sm"
          />
        </div>

        <div className="md:col-span-5 flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold text-slate-700 shrink-0">حالة الطلب:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 shadow-sm"
          >
            <option value="ALL">جميع الحالات ({orders.length})</option>
            <option value="PENDING">جديد قيد الانتظار</option>
            <option value="REVIEWED">قيد الدراسة والمراجعة</option>
            <option value="APPROVED">مقبول ومعتمد</option>
            <option value="CONTACTED">تم الاتصال</option>
            <option value="REJECTED">ملغى</option>
          </select>
        </div>
      </div>

      {/* ORDERS LOG LIST */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            لا توجد سجلات تصاميم مطابقة.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            // Total estimated surface area & liters
            const totalSqm = order.roomCustomizations.reduce((acc, r) => acc + (r.estimatedAreaSqm || 0), 0);
            const totalLitersEst = (totalSqm / 10).toFixed(1); // Avg 10m²/L

            return (
              <div
                key={order.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all space-y-0"
              >
                {/* Order Summary Header Row */}
                <div className="p-4 bg-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="p-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span>{order.id}</span>
                    </button>

                    <div>
                      <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        <span>{order.userFullName}</span>
                        <span className="font-mono text-xs bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded font-black border border-emerald-300">
                          {order.userCin}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3">
                        <span>هاتف: <span className="font-mono font-bold text-slate-700">{order.userPhone}</span></span>
                        <span>• تاريخ التقديم: <span className="font-mono">{order.submittedAt}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-left dir-ltr">
                      <div className="text-xs font-mono font-black text-emerald-900">
                        {order.grandTotal.toLocaleString()} {siteSettings.currencySymbol}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        الشقة {order.apartmentCode} ({order.roomCustomizations.length} غرف)
                      </div>
                    </div>

                    <div>{getStatusBadge(order.status)}</div>

                    <div className="flex items-center gap-1.5 border-r border-slate-200 pr-2">
                      {/* WhatsApp Quote */}
                      <a
                        href={getWhatsAppQuoteUrl(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                        title="إرسال عرض سعر تفصيلي عبر الواتساب"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">إرسال العرض</span>
                      </a>

                      {/* Print Quote Invoice */}
                      <button
                        onClick={() => setPrintingOrder(order)}
                        className="p-1.5 bg-slate-900 hover:bg-emerald-950 text-amber-300 rounded-xl transition-all cursor-pointer shadow-sm"
                        title="طباعة وتحميل وثيقة عرض السعر الرسمي"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm('هل أنت تأكد من حذف هذا السجل والطلب؟')) {
                            onDeleteOrder(order.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                        title="حذف الطلب"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* EXPANDED DETAILS PANEL */}
                {isExpanded && (
                  <div className="p-4 bg-slate-50 space-y-4 text-xs border-t border-slate-200">
                    {/* Apartment & Contact Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 font-bold block">الشقة المحددة:</span>
                        <span className="font-extrabold text-slate-900">
                          {order.apartmentTitle} ({order.apartmentCode})
                        </span>
                        <div className="text-[11px] text-emerald-800 font-bold mt-0.5">
                          سعر الشقة الأساسي: {order.totalApartmentPrice.toLocaleString()} {siteSettings.currencySymbol}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 font-bold block">العنوان والتواصل:</span>
                        <span className="font-bold text-slate-800">{order.userAddress}</span>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {order.userEmail}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 font-bold block">حساب الكميات والتقدير:</span>
                        <span className="font-extrabold text-slate-900">
                          إجمالي المساحة: {totalSqm} م²
                        </span>
                        <div className="text-[11px] text-amber-800 font-bold mt-0.5">
                          كمية الصباغة التقديرية: ~{totalLitersEst} لتر
                        </div>
                      </div>
                    </div>

                    {/* Room by Room Paint & Decor Customization Breakdown */}
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-emerald-600" />
                        <span>تفاصيل الغرف والدهانات المعتمدة من العميل:</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {order.roomCustomizations.map((room, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 shadow-sm"
                          >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: room.colorHex }} />
                                <span>{room.roomNameAr}</span>
                              </span>

                              <span className="font-mono font-bold text-emerald-900 text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {room.totalRoomCost.toLocaleString()} {siteSettings.currencySymbol}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                              <div>
                                <span className="font-bold text-slate-800">نوع الصباغة:</span>{' '}
                                <span className="text-emerald-900 font-bold">{room.paintCategoryNameAr}</span>
                              </div>

                              <div>
                                <span className="font-bold text-slate-800">اللون المختار:</span>{' '}
                                <span className="font-bold">{room.colorNameAr}</span>
                              </div>

                              <div>
                                <span className="font-bold text-slate-800">سعر المتر:</span>{' '}
                                <span className="font-mono">{room.pricePerSqm} DH/m²</span>
                              </div>

                              <div>
                                <span className="font-bold text-slate-800">المساحة:</span>{' '}
                                <span className="font-mono font-bold">{room.estimatedAreaSqm} م²</span>
                              </div>
                            </div>

                            {room.notes && (
                              <div className="p-2 bg-amber-50 rounded-lg text-[10px] text-amber-900 font-bold border border-amber-200">
                                ملاحظات الزبون: {room.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Status & Admin Notes Control Bar */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">تغيير حالة الطلب:</span>
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus, order.adminNotes)}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-xs"
                        >
                          <option value="PENDING">جديد قيد الانتظار</option>
                          <option value="REVIEWED">قيد الدراسة والمراجعة</option>
                          <option value="APPROVED">مقبول ومعتمد</option>
                          <option value="CONTACTED">تم الاتصال</option>
                          <option value="REJECTED">ملغى</option>
                        </select>
                      </div>

                      <div className="flex-1 min-w-[240px] flex items-center gap-2">
                        <input
                          type="text"
                          defaultValue={order.adminNotes || ''}
                          placeholder="إضافة ملاحظة إدارية خاصة بطلب الزبون..."
                          onChange={(e) =>
                            setAdminNoteInput({ ...adminNoteInput, [order.id]: e.target.value })
                          }
                          className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const note = adminNoteInput[order.id] ?? order.adminNotes;
                            onUpdateOrderStatus(order.id, order.status, note);
                            alert('تم حفظ ملاحظات الأدمن بنجاح!');
                          }}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shrink-0 cursor-pointer"
                        >
                          حفظ الملاحظة
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* PRINTABLE QUOTE INVOICE MODAL */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full space-y-6 shadow-2xl border border-emerald-200 dir-rtl my-8">
            {/* Printable Document Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h2 className="text-xl font-black text-emerald-950">إقامة Magha Immobilier R+2</h2>
                <p className="text-xs font-bold text-slate-600">شقق سكنية فاخرة وخيارات تشطيب راقية</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{siteSettings.addressText}</p>
              </div>

              <div className="text-left font-mono">
                <div className="text-base font-black text-amber-800">عرض سعر رسمي QUOTATION</div>
                <div className="text-xs font-bold text-slate-700">رقم الوثيقة: {printingOrder.id}</div>
                <div className="text-[10px] text-slate-400">{printingOrder.submittedAt}</div>
              </div>
            </div>

            {/* Client & Apartment Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-400 block text-[10px]">بيانات الزبون:</span>
                <div className="font-black text-slate-900 text-sm">{printingOrder.userFullName}</div>
                <div className="font-mono text-slate-700">CIN: {printingOrder.userCin}</div>
                <div className="font-mono text-slate-700">الهاتف: {printingOrder.userPhone}</div>
                <div className="text-slate-600">{printingOrder.userAddress}</div>
              </div>

              <div>
                <span className="font-bold text-slate-400 block text-[10px]">تفاصيل الشقة والنموذج:</span>
                <div className="font-black text-emerald-900 text-sm">{printingOrder.apartmentTitle}</div>
                <div className="font-bold text-slate-800">رمز الشقة: {printingOrder.apartmentCode}</div>
                <div className="text-slate-600">{printingOrder.floorNameAr}</div>
              </div>
            </div>

            {/* Customization Details Table */}
            <div className="space-y-2">
              <h4 className="font-black text-xs text-slate-900">جدول تفاصيل التشطيب والتسعير بالدرهم المغربي:</h4>
              <table className="w-full text-right text-xs border border-slate-300">
                <thead className="bg-slate-900 text-amber-300 font-black">
                  <tr>
                    <th className="p-2 border">الغرفة</th>
                    <th className="p-2 border">نوع الصباغة والديكور</th>
                    <th className="p-2 border">اللون</th>
                    <th className="p-2 border">المساحة م²</th>
                    <th className="p-2 border">المجموع (DH)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {printingOrder.roomCustomizations.map((r, i) => (
                    <tr key={i}>
                      <td className="p-2 border font-bold">{r.roomNameAr}</td>
                      <td className="p-2 border">{r.paintCategoryNameAr}</td>
                      <td className="p-2 border font-bold">{r.colorNameAr}</td>
                      <td className="p-2 border font-mono">{r.estimatedAreaSqm} م²</td>
                      <td className="p-2 border font-mono font-bold">{r.totalRoomCost.toLocaleString()} DH</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Box */}
            <div className="p-4 bg-emerald-950 text-white rounded-2xl space-y-1.5 text-xs font-bold">
              <div className="flex justify-between">
                <span>سعر الشقة الفاخرة الأساسي:</span>
                <span className="font-mono">{printingOrder.totalApartmentPrice.toLocaleString()} {siteSettings.currencySymbol}</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>مجموع تكلفة خيارات الدهانات والديكور:</span>
                <span className="font-mono">{printingOrder.totalCustomizationPrice.toLocaleString()} {siteSettings.currencySymbol}</span>
              </div>
              <div className="flex justify-between text-base font-black border-t border-emerald-800 pt-2 text-amber-400">
                <span>المجموع الإجمالي الشامل:</span>
                <span className="font-mono">{printingOrder.grandTotal.toLocaleString()} {siteSettings.currencySymbol}</span>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPrintingOrder(null)}
                className="px-5 py-2.5 bg-slate-100 text-slate-800 rounded-xl font-bold text-xs cursor-pointer"
              >
                إغلاق
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>طباعة الوثيقة الرسمية</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
