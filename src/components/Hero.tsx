import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Building,
  Paintbrush,
  TreePine,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Key,
} from 'lucide-react';

export const Hero: React.FC<{ onOpenAuthModal?: () => void }> = ({ onOpenAuthModal }) => {
  const { siteSettings, currentUser, setActiveView, t, language } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-900 text-white pt-8 pb-16">
      {/* Background Subtle Emerald Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {siteSettings.heroTitle || t('heroTitle')}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
              {siteSettings.heroSubtitle || siteSettings.heroDescription || t('heroSubtitle')}
            </p>

            {/* 4 Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-emerald-900/40 border border-emerald-700/50 rounded-xl backdrop-blur-sm">
                <Building className="w-5 h-5 text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-white">
                  {language === 'ar' ? 'إقامة R+2 هادئة' : 'Résidence R+2 Calme'}
                </div>
                <div className="text-[11px] text-emerald-300/80">
                  {language === 'ar' ? '3 طوابق سكنية فقط' : 'Seulement 3 niveaux'}
                </div>
              </div>

              <div className="p-3 bg-emerald-900/40 border border-emerald-700/50 rounded-xl backdrop-blur-sm">
                <Paintbrush className="w-5 h-5 text-emerald-300 mb-1" />
                <div className="text-xs font-bold text-white">
                  {language === 'ar' ? 'مكتبة دهانات' : 'Nuancier Peintures'}
                </div>
                <div className="text-[11px] text-emerald-300/80">
                  Khayal, Ambra, Huile
                </div>
              </div>

              <div className="p-3 bg-emerald-900/40 border border-emerald-700/50 rounded-xl backdrop-blur-sm">
                <TreePine className="w-5 h-5 text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-white">
                  {language === 'ar' ? 'حدائق وتراسات' : 'Jardins & Terrasses'}
                </div>
                <div className="text-[11px] text-emerald-300/80">RDC & 2ème Étage</div>
              </div>

              <div className="p-3 bg-emerald-900/40 border border-emerald-700/50 rounded-xl backdrop-blur-sm">
                <Key className="w-5 h-5 text-amber-400 mb-1" />
                <div className="text-xs font-bold text-white">
                  {language === 'ar' ? 'تسليم وتوثيق' : 'Livraison Garantie'}
                </div>
                <div className="text-[11px] text-emerald-300/80">
                  {language === 'ar' ? 'حفظ الطلب تلقائياً' : 'Suivi personnalisé'}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveView('APARTMENTS')}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>{t('exploreApartments')}</span>
                {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  if (!currentUser && onOpenAuthModal) {
                    onOpenAuthModal();
                    return;
                  }
                  setActiveView('PAINT_STUDIO');
                }}
                className="px-6 py-3.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-600/60 rounded-xl font-bold text-sm backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Paintbrush className="w-4 h-4 text-emerald-300" />
                <span>{t('openPaintStudio')}</span>
              </button>
            </div>
          </div>

          {/* Facade Image Card Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/30 group">
              <img
                src={siteSettings.heroImage || '/assets/images/r2_building_facade_1786033110102.jpg'}
                alt="R+2 Facade"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/images/r2_building_facade_1786033110102.jpg';
                }}
                className="w-full h-[380px] sm:h-[420px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Floating Architectural Badge */}
              <div className="absolute bottom-4 right-4 left-4 p-4 bg-slate-900/85 backdrop-blur-md rounded-xl border border-emerald-500/40 text-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    {language === 'ar' ? 'نقدم لكم ميزات خاصة نحن السباقين في توفيرها لكم' : 'Prestations exclusives à votre service'}
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                    R+2 Architecture
                  </span>
                </div>
                <p className="text-xs text-slate-200">
                  {language === 'ar'
                    ? 'تصميم متناغم يدمج المساحات الخضراء والتهوية الطبيعية لكل شقة'
                    : 'Design harmonieux alliant verdure et luminosité naturelle pour chaque appartement'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
