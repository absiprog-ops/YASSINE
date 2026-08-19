import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Award,
  PlusCircle,
  CheckCircle2,
  Filter,
  User,
  X,
  Send,
  Building,
  Sparkles,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { ServiceReviewCategory, ServiceReview } from '../types';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews, addReview, likeReview, language, t } = useApp();
  const isAr = language === 'ar';

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // New Review Form State
  const [formRating, setFormRating] = useState<number>(5);
  const [formHoverRating, setFormHoverRating] = useState<number>(0);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formCategory, setFormCategory] = useState<ServiceReviewCategory>('FINISHING');
  const [formComment, setFormComment] = useState('');
  const [formIsBuyer, setFormIsBuyer] = useState(true);
  const [formSuccessMessage, setFormSuccessMessage] = useState(false);

  // Filter approved reviews
  const approvedReviews = reviews.filter((r) => r.isApproved !== false);

  const filteredReviews =
    activeCategoryFilter === 'ALL'
      ? approvedReviews
      : approvedReviews.filter((r) => r.serviceCategory === activeCategoryFilter);

  // Average Rating
  const totalReviewsCount = approvedReviews.length;
  const avgRating =
    totalReviewsCount > 0
      ? (approvedReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviewsCount).toFixed(1)
      : '5.0';

  const categoryLabels: Record<ServiceReviewCategory, { ar: string; fr: string }> = {
    FINISHING: { ar: 'الفينيسيو والتشطيبات', fr: 'Finition & Qualité' },
    BUILDING_QUALITY: { ar: 'جودة البناء والعزل', fr: 'Qualité de construction' },
    CUSTOMIZATION: { ar: 'تخصيص الصباغة', fr: 'Personnalisation peinture' },
    CUSTOMER_SERVICE: { ar: 'خدمة واستقبال العملاء', fr: 'Service client' },
    GENERAL: { ar: 'انطباع عام', fr: 'Impression générale' },
  };

  const handleLike = (id: string) => {
    if (likedMap[id]) return;
    likeReview(id);
    setLikedMap((prev) => ({ ...prev, [id]: true }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    const newRev: ServiceReview = {
      id: `rev-${Date.now()}`,
      userName: formName.trim(),
      userRoleOrApt: formRole.trim() || (isAr ? 'زائر أو مشتري بالإقامة' : 'Visiteur / Client'),
      rating: formRating,
      serviceCategory: formCategory,
      comment: formComment.trim(),
      date: new Date().toLocaleDateString(isAr ? 'ar-MA' : 'fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      isVerifiedBuyer: formIsBuyer,
      likesCount: 1,
      isApproved: true,
    };

    addReview(newRev);
    setFormSuccessMessage(true);
    setTimeout(() => {
      setFormSuccessMessage(false);
      setIsModalOpen(false);
      setFormName('');
      setFormRole('');
      setFormComment('');
      setFormRating(5);
    }, 1800);
  };

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden dir-rtl" id="reviews-section">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-amber-400/30 text-amber-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>عرض تعليقات لتقييم الخدمات</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            تقييمات زبنائنا وآرائهم في جودة السكن والخدمات
          </h2>

          <p className="text-lg sm:text-xl font-bold italic text-amber-300/90 tracking-wide">
            &ldquo;Votre avis compte pour nous…&rdquo;
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-2xl mx-auto">
            نحرص في <strong className="text-white">Magha Immobilier R+2</strong> على الاستماع الدائم لآراء القاطنين والمهتمين لضمان أفضل معايير التشطيب والعزل والراحة المعمارية.
          </p>
        </div>

        {/* STATS & AVERAGE OVERVIEW BAR */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-l border-slate-700/80 pb-4 md:pb-0 md:pl-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400 font-mono">{avgRating}</span>
                <span className="text-sm font-bold text-slate-400">/ 5.0</span>
              </div>
              <p className="text-xs font-bold text-slate-300 mt-0.5">معدل التقييم العام للخدمات</p>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-l border-slate-700/80 pb-4 md:pb-0 md:pl-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <span className="text-2xl font-bold text-emerald-400 font-mono">{totalReviewsCount} تقييمات</span>
              <p className="text-xs font-medium text-slate-300 mt-1">
                تجارب حقيقية لمقتني الشقق وزوار الإقامة
              </p>
              <span className="text-[11px] text-emerald-300/80 flex items-center gap-1 mt-1 font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                مشترون مؤكدون للإقامة
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center md:items-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-slate-950" />
              <span>شاركونا رأيكم وتقييمكم للخدمة</span>
            </button>
            <span className="text-[11px] text-slate-400 mt-2 font-medium">
              Votre avis nous يساعدنا في التطوير والتحسين
            </span>
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCategoryFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategoryFilter === 'ALL'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>جميع التقييمات ({approvedReviews.length})</span>
          </button>

          {(Object.keys(categoryLabels) as ServiceReviewCategory[]).map((catKey) => {
            const count = approvedReviews.filter((r) => r.serviceCategory === catKey).length;
            return (
              <button
                key={catKey}
                onClick={() => setActiveCategoryFilter(catKey)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategoryFilter === catKey
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <span>{categoryLabels[catKey].ar}</span>
                <span className="mr-1 opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* REVIEWS GRID */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-slate-800/50 rounded-2xl border border-slate-700">
              <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300">لا توجد تعليقات مضافة حالياً في هذا التصنيف.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                كن أول من يضيف تقييماً
              </button>
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/40 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {/* Top Header: Avatar & Name + Verified Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0 border border-emerald-300/30">
                        {rev.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                            {rev.userName}
                          </h4>
                          {rev.isVerifiedBuyer && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold"
                              title="مشتري مؤكد بالإقامة"
                            >
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              <span>زبون مؤكد</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{rev.userRoleOrApt}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">{rev.date}</span>
                  </div>

                  {/* Rating Stars & Category Tag */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-b border-slate-700/60 py-2.5">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starIndex) => (
                        <Star
                          key={starIndex}
                          className={`w-4 h-4 ${
                            starIndex <= rev.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-amber-300 mr-1.5">{rev.rating}.0</span>
                    </div>

                    <span className="text-[11px] font-bold bg-slate-900/80 text-amber-300 border border-amber-400/20 px-2.5 py-1 rounded-lg">
                      {categoryLabels[rev.serviceCategory]?.ar || 'تقييم الخدمة'}
                    </span>
                  </div>

                  {/* Comment Content */}
                  <p className="mt-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <HeartHandshake className="w-4 h-4 text-amber-400" />
                    <span>Magha Immobilier R+2</span>
                  </div>

                  <button
                    onClick={() => handleLike(rev.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      likedMap[rev.id]
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300 border border-slate-600'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${likedMap[rev.id] ? 'fill-emerald-400' : ''}`} />
                    <span>مفيد ({rev.likesCount || 0})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SUBMIT REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md dir-rtl animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative text-white">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="font-bold text-base text-white">
                  شاركنا رأيك وتقييمك لخدمات الإقامة
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitReview} className="p-6 space-y-4 text-xs">
              {formSuccessMessage ? (
                <div className="py-8 text-center space-y-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="font-bold text-base text-emerald-300">شكراً جزيلاً لتقييمك ومشاركتك!</h4>
                  <p className="text-slate-300 text-xs">تمت إضافة تقييمك بنجاح. Votre avis compte énormément pour nous !</p>
                </div>
              ) : (
                <>
                  {/* Star Selection */}
                  <div className="space-y-1.5 text-center bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
                    <label className="block font-bold text-slate-200">حدد تقييمك العام (1 إلى 5 نجوم):</label>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setFormRating(starVal)}
                          onMouseEnter={() => setFormHoverRating(starVal)}
                          onMouseLeave={() => setFormHoverRating(0)}
                          className="p-1 transition-transform transform hover:scale-125 cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              starVal <= (formHoverRating || formRating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-amber-300 font-bold block pt-1">
                      {formRating === 5 && 'ممتاز جودة عالية جداً ⭐⭐⭐⭐⭐'}
                      {formRating === 4 && 'جيد جداً ⭐⭐⭐⭐'}
                      {formRating === 3 && 'متوسط ⭐⭐⭐'}
                      {formRating < 3 && 'يحتاج تحسين ⭐⭐'}
                    </span>
                  </div>

                  {/* Name & Apartment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">الاسم الكامل *:</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: يوسف العلمي"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:border-amber-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">الصفة أو الشقة (اختياري):</label>
                      <input
                        type="text"
                        placeholder="مثال: مشتري شقة بالطابق الأول"
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">مجال التقييم الأساسي:</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as ServiceReviewCategory)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:border-amber-400 outline-none cursor-pointer"
                    >
                      {(Object.keys(categoryLabels) as ServiceReviewCategory[]).map((catKey) => (
                        <option key={catKey} value={catKey}>
                          {categoryLabels[catKey].ar} ({categoryLabels[catKey].fr})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Comment Area */}
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">رأيك وتعليقك بالتفصيل *:</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="اكتب ملاحظاتك وتجربتك مع تجهيزات الشقة أو الفينيسيو أو الاستقبال..."
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:border-amber-400 outline-none"
                    />
                  </div>

                  {/* Is Verified Checkbox */}
                  <div className="flex items-center gap-2 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
                    <input
                      type="checkbox"
                      id="isBuyerChk"
                      checked={formIsBuyer}
                      onChange={(e) => setFormIsBuyer(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                    />
                    <label htmlFor="isBuyerChk" className="text-xs font-bold text-slate-200 cursor-pointer">
                      أنا مشتري أو زائر سبق له الاطلاع على الإقامة
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20"
                    >
                      <Send className="w-4 h-4" />
                      <span>إرسال التقييم الآن</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
