import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PartnerSponsorCategory } from '../types';
import { Zap, Paintbrush, Wrench, Building2, ExternalLink, ShieldCheck, Sparkles, Phone, CheckCircle2 } from 'lucide-react';

export const PartnersSection: React.FC = () => {
  const { partners, isAdminMode, setActiveView } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filter active partners only for normal visitors, or all for admin
  const visiblePartners = partners.filter((p) => (isAdminMode ? true : p.isActive));

  const categories: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'ALL', label: 'جميع الموردين والشركاء', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'ELECTRICITY', label: 'الكهرباء والتجهيزات (INGELEC, LAP...)', icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { id: 'PAINT', label: 'الدهانات والديكور (Colorado, Khayal...)', icon: <Paintbrush className="w-4 h-4 text-emerald-600" /> },
    { id: 'PLUMBING_BUILD', label: 'مواد البناء وPVC/PPR (Cimamaroc, Lafarge...)', icon: <Wrench className="w-4 h-4 text-teal-600" /> },
  ];

  const filteredPartners = visiblePartners.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    return p.category === selectedCategory;
  });

  const getCategoryBadgeColor = (cat: PartnerSponsorCategory) => {
    switch (cat) {
      case 'ELECTRICITY':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'PAINT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PLUMBING_BUILD':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getCategoryIcon = (cat: PartnerSponsorCategory) => {
    switch (cat) {
      case 'ELECTRICITY':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'PAINT':
        return <Paintbrush className="w-5 h-5 text-emerald-600" />;
      case 'PLUMBING_BUILD':
        return <Wrench className="w-5 h-5 text-teal-600" />;
      default:
        return <Building2 className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <section id="partners-sponsors-section" className="py-12 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl my-8 border border-slate-800 shadow-2xl overflow-hidden dir-rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>علامات وموردون معتمدون في البناء والتجهيز</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              شركاؤنا ومورّدو التجهيزات والدهانات لإقامة Magha Immobilier
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              نضمن لزبنائنا أعلى معايير الجودة باستعمال معدات إلكترونية ومواد بناء ودهانات ذات جودة عالية من كبرى الشركات المعتمدة بالمغرب.
            </p>
          </div>

          {isAdminMode && (
            <button
              onClick={() => setActiveView('ADMIN')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>إدارة وتعديل الشركاء من لوحة التحكم</span>
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-950/50 scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className={`group bg-slate-800/60 hover:bg-slate-800/90 border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between shadow-lg relative overflow-hidden ${
                partner.isFeatured ? 'border-amber-500/40 bg-gradient-to-br from-slate-800/90 via-slate-800/50 to-slate-900' : 'border-slate-700/80'
              }`}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                {/* Header row with logo / icon and category badge */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white p-2 flex items-center justify-center border border-slate-200 shadow-md shrink-0">
                      {partner.logoUrl ? (
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        getCategoryIcon(partner.category)
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2 group-hover:text-emerald-300 transition-colors">
                        <span>{partner.name}</span>
                        {partner.isFeatured && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded font-bold">
                            مميز
                          </span>
                        )}
                      </h3>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${getCategoryBadgeColor(partner.category)}`}>
                        {partner.categoryLabelAr}
                      </span>
                    </div>
                  </div>

                  {!partner.isActive && isAdminMode && (
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-bold">
                      مخفي
                    </span>
                  )}
                </div>

                {/* Badge Tag */}
                {partner.badgeTextAr && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{partner.badgeTextAr}</span>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {partner.descriptionAr}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>معتمد في إقامة Magha R+2</span>
                </span>

                {partner.websiteUrl && (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition-all"
                  >
                    <span>موقع الشركة</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredPartners.length === 0 && (
          <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-700 space-y-2">
            <Building2 className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-slate-300">لا يوجد شركاء متوفرين في هذه الفئة حالياً</p>
          </div>
        )}
      </div>
    </section>
  );
};
