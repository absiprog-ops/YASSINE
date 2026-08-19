import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserCheck, Shield, Check, AlertCircle, Phone, Mail, MapPin, CreditCard, Lock, Key } from 'lucide-react';

export const UserAuthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser, registerOrLoginUser, loginAdmin, loginWithGoogle, logoutUser } = useApp();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [authTab, setAuthTab] = useState<'CLIENT' | 'ADMIN'>('CLIENT');

  // Client form fields
  const [fullName, setFullName] = useState('');
  const [cin, setCin] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Admin form fields
  const [adminEmail, setAdminEmail] = useState('contact@maghaimmobilier.com');
  const [adminPassword, setAdminPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'ADMIN') {
        setAuthTab('ADMIN');
        setAdminEmail(currentUser.email || 'contact@maghaimmobilier.com');
      } else {
        setAuthTab('CLIENT');
      }
      setFullName(currentUser.fullName || '');
      setCin(currentUser.cin || '');
      setAddress(currentUser.address || '');
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
    } else {
      setFullName('');
      setCin('');
      setAddress('');
      setPhone('');
      setEmail('');
      setAdminPassword('');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const validateCin = (value: string): boolean => {
    // 1 or 2 Latin letters followed by 4 to 8 digits (e.g., AB123456, C12345, BK78910)
    const cinRegex = /^[A-Za-z]{1,2}[0-9]{4,8}$/;
    return cinRegex.test(value.trim());
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('يرجى إدخال الاسم الكامل (الاسم والنسب).');
      return;
    }

    const cleanCin = cin.trim().toUpperCase();
    if (!validateCin(cleanCin)) {
      setErrorMsg('رقم البطاقة الوطنية غير صحيح. يجب أن يتكون من حرف أو حرفين لاتينيين متبوعين بأرقام (مثال: AB123456 أو C12345).');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('يرجى إدخال رقم الهاتف للتواصل معك.');
      return;
    }

    if (!address.trim()) {
      setErrorMsg('يرجى إدخال العنوان السكني.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }

    // Check if user accidentally entered admin email in client form
    if (email.trim().toLowerCase() === 'contact@maghaimmobilier.com' || email.trim().toLowerCase() === 'contact@maghaimmobillier.com') {
      setAuthTab('ADMIN');
      setErrorMsg('هذا البريد مخصص لإدارة المشروع. يرجى إدخال كلمة السر الخاصة بالإدارة للدخول.');
      return;
    }

    registerOrLoginUser({
      fullName: fullName.trim(),
      cin: cleanCin,
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      role: 'CLIENT',
    });

    setSuccessMsg('تم حفظ وتوثيق معلومات الزبون بنجاح!');
    setTimeout(() => {
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!adminEmail.trim()) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني الخاص بالإدارة.');
      return;
    }

    if (!adminPassword.trim()) {
      setErrorMsg('يرجى إدخال كلمة السر الخاصة بالإدارة.');
      return;
    }

    const success = loginAdmin(adminEmail, adminPassword);
    if (success) {
      setSuccessMsg('تم تسجيل الدخول بنجاح بصفتك مدير النظام!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1000);
    } else {
      setErrorMsg('البريد الإلكتروني أو كلمة السر غير صحيحة للإدارة.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 max-w-lg w-full overflow-hidden text-slate-800 dir-rtl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/60 rounded-xl border border-emerald-500/30">
              {authTab === 'ADMIN' ? (
                <Shield className="w-6 h-6 text-amber-300" />
              ) : (
                <UserCheck className="w-6 h-6 text-emerald-300" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {authTab === 'ADMIN'
                  ? 'تسجيل دخول الإدارة (Admin Login)'
                  : currentUser
                  ? 'تعديل معلومات الزبون'
                  : 'تسجيل دخول الزبون / فتح ملف الشراء'}
              </h3>
              <p className="text-xs text-emerald-200">
                {authTab === 'ADMIN'
                  ? 'بوابة الدخول الخاصة بطاقم إدارة إقامة Magha R+2'
                  : 'أدخل معلوماتك الشخصية لتخصيص الدهانات وتلقي ملفات الحجز'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setAuthTab('CLIENT');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all border-b-2 cursor-pointer ${
              authTab === 'CLIENT'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>بوابة الزبناء (Client)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthTab('ADMIN');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all border-b-2 cursor-pointer ${
              authTab === 'ADMIN'
                ? 'border-amber-500 text-amber-900 bg-amber-50/60 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-600" />
            <span>دخول الإدارة (Admin)</span>
          </button>
        </div>

        {/* Feedback Messages */}
        <div className="p-4 pb-0">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-bold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* CLIENT FORM */}
        {authTab === 'CLIENT' ? (
          <form onSubmit={handleClientSubmit} className="p-6 space-y-4">
            {/* Google Sign In Button */}
            <div className="pb-2 border-b border-slate-100">
              <button
                type="button"
                disabled={isGoogleLoading}
                onClick={async () => {
                  setErrorMsg(null);
                  setIsGoogleLoading(true);
                  const res = await loginWithGoogle();
                  setIsGoogleLoading(false);
                  if (res) {
                    setSuccessMsg('تم تسجيل الدخول بواسطة حساب Google وحفظ الحساب بنجاح!');
                    setTimeout(() => {
                      if (onSuccess) onSuccess();
                      onClose();
                    }, 1000);
                  } else {
                    setErrorMsg('تعذر تسجيل الدخول بـ Google. يرجى إعادة المحاولة.');
                  }
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isGoogleLoading ? 'جاري الاتصال بـ Google...' : 'تسجيل الدخول السريع بـ Google (Firebase Auth)'}</span>
              </button>
              <div className="relative my-3 text-center">
                <span className="bg-white px-2 text-[10px] text-slate-400 font-bold relative z-10">أو أدخل بياناتك يدويّاً</span>
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              </div>
            </div>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الاسم الكامل (الاسم والنسب) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: حمزة الإدريسي"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
            </div>

            {/* CIN / National ID */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  رقم البطاقة التعريف الوطنية (CIN) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                  مثال: AB123456
                </span>
              </div>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  required
                  value={cin}
                  onChange={(e) => setCin(e.target.value.toUpperCase())}
                  placeholder="أدخل رقم البطاقة الوطنية (حرفين + أرقام)"
                  className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all uppercase"
                />
              </div>
            </div>

            {/* Phone & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 61 22 33 44"
                    dir="ltr"
                    className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  البريد الإلكتروني <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-right"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                العنوان السكني الحالي <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: شارع الحسن الثاني، الدار البيضاء"
                  className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    onClose();
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                >
                  تسجيل الخروج
                </button>
              )}

              <div className="flex items-center gap-2 mr-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-lg shadow-emerald-900/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-emerald-300" />
                  <span>{currentUser ? 'حفظ التحديثات' : 'تأكيد وحفظ المعلومات'}</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* ADMIN FORM */
          <form onSubmit={handleAdminSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-950">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>تسجيل دخول مسؤول النظام (Admin Access)</span>
              </p>
              <p className="text-[11px] text-amber-800">
                أدخل البريد الإلكتروني وكلمة السر المخصصة لإدارة مشروع إقامة Magha R+2 للوصول إلى لوحة التحكم.
              </p>
            </div>

            {/* Admin Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                البريد الإلكتروني للإدارة <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="contact@maghaimmobilier.com"
                  dir="ltr"
                  className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-right font-mono"
                />
              </div>
            </div>

            {/* Admin Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                كلمة السر <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-right"
                />
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              {currentUser?.role === 'ADMIN' && (
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    onClose();
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                >
                  خروج من الإدارة
                </button>
              )}

              <div className="flex items-center gap-2 mr-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl shadow-lg shadow-amber-900/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Key className="w-4 h-4 text-amber-200" />
                  <span>دخول لوحة تحكم الإدارة</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

