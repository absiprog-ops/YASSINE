import React, { useState } from 'react';
import { UserProfile, ClientOrder } from '../../types';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  Download,
  Filter,
} from 'lucide-react';

interface ClientsDatabaseTableProps {
  users: UserProfile[];
  orders: ClientOrder[];
  onAddUser: (user: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  onDeleteUser: (userId: string) => void;
  onSelectUserOrders: (userCin: string) => void;
  isAr: boolean;
}

export const ClientsDatabaseTable: React.FC<ClientsDatabaseTableProps> = ({
  users,
  orders,
  onAddUser,
  onDeleteUser,
  onSelectUserOrders,
  isAr,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Client Form State
  const [newClientForm, setNewClientForm] = useState({
    fullName: '',
    cin: '',
    phone: '',
    email: '',
    address: '',
  });

  // Calculate order counts per user CIN
  const getUserOrdersCount = (cin: string) => {
    return orders.filter(
      (o) => o.userCin?.toLowerCase() === cin?.toLowerCase()
    ).length;
  };

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(term) ||
      u.cin?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.address?.toLowerCase().includes(term)
    );
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientForm.fullName || !newClientForm.cin || !newClientForm.phone) {
      alert(isAr ? 'يرجى إدخال الاسم الكامل ورقم البطاقة الوطنية ورقم الهاتف!' : 'Veuillez remplir les champs obligatoires!');
      return;
    }

    onAddUser(newClientForm);
    setNewClientForm({ fullName: '', cin: '', phone: '', email: '', address: '' });
    setShowAddModal(false);
  };

  // Format phone number for WhatsApp URL
  const getWhatsAppUrl = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const formatted = clean.startsWith('0') ? `212${clean.slice(1)}` : clean;
    return `https://wa.me/${formatted}?text=${encodeURIComponent(
      'مرحباً بك من إدارة إقامة Magha Immobilier R+2! بخصوص طلبكم واستفساركم حول الشقق الفاخرة والدهانات:'
    )}`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100 space-y-6 dir-rtl text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950 text-amber-300 rounded-2xl shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>قاعدة البيانات الآمنة للعملاء المسجلين</span>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                {users.length} عميل مسجل
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              سجل تفصيلي مشفر ومحمي لجميع المالكين والزبناء مع أرقام الهويات الوطنية CIN وبيانات التواصل.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer border border-emerald-600"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>إضافة عميل جديد يدوياً</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث باسم العميل، رقم CIN، الهاتف أو البريد الإلكتروني..."
            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-emerald-600 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>نظام مشفر آمن لحماية المعطيات الشخصية</span>
        </div>
      </div>

      {/* CLIENTS TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-900 text-amber-300 font-extrabold border-b border-slate-800 text-[11px]">
            <tr>
              <th className="p-3.5">العميل والاسم الكامل</th>
              <th className="p-3.5">رقم البطاقة الوطنية (CIN)</th>
              <th className="p-3.5">رقم الهاتف والواتساب</th>
              <th className="p-3.5">البريد الإلكتروني</th>
              <th className="p-3.5">العنوان السكني</th>
              <th className="p-3.5">تاريخ التسجيل</th>
              <th className="p-3.5 text-center">طلبات الدهان والشقق</th>
              <th className="p-3.5 text-center">الإجراءات والتواصل</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">
                  لا توجد نتائج مطابقة للبحث.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const ordersCount = getUserOrdersCount(user.cin);

                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* User Name */}
                    <td className="p-3.5 font-black text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-extrabold flex items-center justify-center border border-emerald-300 text-xs">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <span>{user.fullName}</span>
                          <div className="text-[10px] text-slate-400 font-normal">
                            معرف: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* CIN */}
                    <td className="p-3.5">
                      <span className="font-mono font-extrabold text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                        {user.cin}
                      </span>
                    </td>

                    {/* Phone & WhatsApp */}
                    <td className="p-3.5 font-mono font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{user.phone}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                      {user.email || 'غير مدخل'}
                    </td>

                    {/* Address */}
                    <td className="p-3.5 text-slate-600 max-w-[180px] truncate">
                      {user.address || 'غير مدخل'}
                    </td>

                    {/* Registration Date */}
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      {user.createdAt || '2026-08-01'}
                    </td>

                    {/* Orders Count */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => onSelectUserOrders(user.cin)}
                        className={`px-3 py-1 rounded-full font-extrabold text-[11px] transition-all cursor-pointer inline-flex items-center gap-1 ${
                          ordersCount > 0
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        <span>{ordersCount} طلبات</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* WhatsApp Button */}
                        <a
                          href={getWhatsAppUrl(user.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all cursor-pointer shadow-sm"
                          title="تواصل مباشر عبر الواتساب"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        {/* Direct Call Button */}
                        <a
                          href={`tel:${user.phone}`}
                          className="p-1.5 bg-slate-900 hover:bg-emerald-950 text-amber-300 rounded-lg transition-all cursor-pointer shadow-sm"
                          title="اتصال هاتفي مباشر"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت تأكد من حذف بيانات الزبون (${user.fullName})؟`)) {
                              onDeleteUser(user.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          title="حذف من قاعدة البيانات"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal to Add New Client Manually */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl dir-rtl">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-200 pb-2">
              تسجيل بيانات عميل جديد بقاعدة البيانات
            </h3>

            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">الاسم الكامل للزبون:</label>
                <input
                  type="text"
                  required
                  value={newClientForm.fullName}
                  onChange={(e) => setNewClientForm({ ...newClientForm, fullName: e.target.value })}
                  placeholder="مثال: يوسف بنجلون"
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم البطاقة الوطنية (CIN):</label>
                <input
                  type="text"
                  required
                  value={newClientForm.cin}
                  onChange={(e) => setNewClientForm({ ...newClientForm, cin: e.target.value.toUpperCase() })}
                  placeholder="مثال: CD654321"
                  className="w-full px-3 py-2 border rounded-xl font-mono uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الهاتف:</label>
                  <input
                    type="tel"
                    required
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                    placeholder="0661002233"
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                    placeholder="client@example.com"
                    className="w-full px-3 py-2 border rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">العنوان السكني الحالي:</label>
                <input
                  type="text"
                  value={newClientForm.address}
                  onChange={(e) => setNewClientForm({ ...newClientForm, address: e.target.value })}
                  placeholder="العنوان والمدينة..."
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl cursor-pointer shadow-md"
                >
                  حفظ العميل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
