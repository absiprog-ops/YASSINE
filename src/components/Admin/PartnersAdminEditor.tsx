import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PartnerSponsor, PartnerSponsorCategory } from '../../types';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  Zap,
  Paintbrush,
  Wrench,
  Building2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';

export const PartnersAdminEditor: React.FC = () => {
  const { partners, addPartner, updatePartner, deletePartner, togglePartnerActive } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerSponsor | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PartnerSponsorCategory>('ELECTRICITY');
  const [categoryLabelAr, setCategoryLabelAr] = useState('تجهيزات وكهرباء');
  const [logoUrl, setLogoUrl] = useState('');
  const [badgeTextAr, setBadgeTextAr] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [phoneContact, setPhoneContact] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingPartner(null);
    setName('');
    setCategory('ELECTRICITY');
    setCategoryLabelAr('تجهيزات وكهرباء');
    setLogoUrl('');
    setBadgeTextAr('');
    setDescriptionAr('');
    setWebsiteUrl('');
    setPhoneContact('');
    setIsFeatured(false);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (partner: PartnerSponsor) => {
    setEditingPartner(partner);
    setName(partner.name);
    setCategory(partner.category);
    setCategoryLabelAr(partner.categoryLabelAr || 'تجهيزات ومواد');
    setLogoUrl(partner.logoUrl || '');
    setBadgeTextAr(partner.badgeTextAr || '');
    setDescriptionAr(partner.descriptionAr || '');
    setWebsiteUrl(partner.websiteUrl || '');
    setPhoneContact(partner.phoneContact || '');
    setIsFeatured(partner.isFeatured);
    setIsActive(partner.isActive);
    setIsModalOpen(true);
  };

  const handleCategoryChange = (cat: PartnerSponsorCategory) => {
    setCategory(cat);
    switch (cat) {
      case 'ELECTRICITY':
        setCategoryLabelAr('تجهيزات وكهرباء');
        break;
      case 'PAINT':
        setCategoryLabelAr('دهانات وديكورات');
        break;
      case 'PLUMBING_BUILD':
        setCategoryLabelAr('مواد البناء وPVC/PPR');
        break;
      default:
        setCategoryLabelAr('موردون وتجهيزات');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFeedback('يرجى إدخال اسم الشركة الموردة أو العلامة.');
      return;
    }

    const partnerData: PartnerSponsor = {
      id: editingPartner ? editingPartner.id : `partner-${Date.now()}`,
      name: name.trim(),
      category,
      categoryLabelAr: categoryLabelAr.trim() || 'تجهيزات ومواد',
      logoUrl: logoUrl.trim() || undefined,
      badgeTextAr: badgeTextAr.trim() || undefined,
      descriptionAr: descriptionAr.trim() || 'مزود معتمد لمواد البناء والتجهيزات في إقامة Magha R+2.',
      websiteUrl: websiteUrl.trim() || undefined,
      phoneContact: phoneContact.trim() || undefined,
      isFeatured,
      isActive,
    };

    if (editingPartner) {
      updatePartner(partnerData);
      setFeedback(`تم تحديث بيانات الشركة الشريكة "${name}" بنجاح!`);
    } else {
      addPartner(partnerData);
      setFeedback(`تمت إضافة الشركة الشريكة "${name}" بنجاح!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (id: string, partnerName: string) => {
    if (window.confirm(`هل أنت تأكد من إزالة الشركة الشريكة "${partnerName}"؟`)) {
      deletePartner(id);
      setFeedback(`تم حذف الشركة "${partnerName}" من قائمة الشركاء.`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="space-y-6 dir-rtl">
      {/* Section Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white p-6 rounded-3xl shadow-xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>لوحة تحكم الشركاء والسبونسورز</span>
          </div>
          <h2 className="text-xl font-black text-white">
            إدارة الموردين وشركات الكهرباء، الدهانات، وPVC/PPR
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            يمكنك إضافة، تعديل، إخفاء، أو استبدال شعارات ومعلومات الشركات الشريكة (مثل INGELEC, LAP, Colorado, Cimamaroc, Bricoma...).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة شركة شريكة جديدة</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Partners List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((p) => (
          <div
            key={p.id}
            className={`bg-white border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between relative transition-all ${
              !p.isActive ? 'opacity-60 bg-slate-50 border-slate-200' : 'hover:border-emerald-300 hover:shadow-md border-slate-200'
            }`}
          >
            <div className="space-y-3">
              {/* Header row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                    {p.logoUrl ? (
                      <img src={p.logoUrl} alt={p.name} className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                      <span>{p.name}</span>
                      {p.isFeatured && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded font-bold">
                          مميز
                        </span>
                      )}
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {p.categoryLabelAr}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => togglePartnerActive(p.id)}
                  title={p.isActive ? 'إخفاء عن الزوار' : 'إظهار للزوار'}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    p.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  {p.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {p.badgeTextAr && (
                <div className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                  {p.badgeTextAr}
                </div>
              )}

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {p.descriptionAr}
              </p>
            </div>

            {/* Card Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 font-mono">
                {p.isActive ? 'نشط في الموقع' : 'مخفي من العرض'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                  <span>تعديل</span>
                </button>

                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all cursor-pointer"
                  title="حذف الشركة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden text-slate-800 dir-rtl">
            <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-800/80 rounded-xl border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {editingPartner ? `تعديل بيانيات الشركة: ${editingPartner.name}` : 'إضافة شركة شريكة جديدة'}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    أدخل معلومات المورد أو الماركة التجارية لعرضها في قسم الشركاء
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Partner Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم الشركة / العلامة التجاري <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: INGELEC, COLORADO, CIMAMAROC"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white font-bold"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تخصص ونوع النشاط <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as PartnerSponsorCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white font-bold"
                >
                  <option value="ELECTRICITY">تجهيزات وكهرباء (INGELEC, LAP...)</option>
                  <option value="PAINT">دهانات وديكورات (Colorado, Khayal, Fayrouze...)</option>
                  <option value="PLUMBING_BUILD">مواد البناء وPVC/PPR (Cimamaroc, Bricoma, Lafarge...)</option>
                  <option value="HARDWARE_OTHER">موردون ومعدات أخرى</option>
                </select>
              </div>

              {/* Badge Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان شارة الميزة (مثال: الشريك المعتمد في الكهرباء)
                </label>
                <input
                  type="text"
                  value={badgeTextAr}
                  onChange={(e) => setBadgeTextAr(e.target.value)}
                  placeholder="مثال: المورد الحصري لأنابيب PVC المقاومة"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  وصف مختصر للمواد والمعدات الموردة للإقامة <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="اكتب نبذة عن جودة المواد والتجهيزات المقدمة من طرف هذه الشركة..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رابط موقع الشركة (اختياري)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://www.ingelec.ma"
                    dir="ltr"
                    className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white font-mono text-right"
                  />
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رابط صورة الشعار / Logo (اختياري)
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white font-mono"
                />
              </div>

              {/* Checkboxes for Featured & Active */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="text-xs font-bold text-slate-800">وضع كشركة مميزة</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span className="text-xs font-bold text-slate-800">إظهار للزوار بالموقع</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingPartner ? 'حفظ التغييرات' : 'إضافة الشركة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
