import React from 'react';
import { useApp } from '../context/AppContext';
import { FloorType } from '../types';
import { Layers, TreePine, Sun, Shield, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export const R2FacadeDiagram: React.FC<{
  selectedFloorFilter: FloorType | 'ALL';
  onSelectFloor: (floor: FloorType | 'ALL') => void;
}> = ({ selectedFloorFilter, onSelectFloor }) => {
  const { apartments, t, language } = useApp();

  const getFloorCount = (f: FloorType) => apartments.filter((a) => a.floor === f).length;
  const isAr = language === 'ar';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-100/80 text-slate-800 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('facadeTitle')}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {isAr ? 'نقدم لكم ميزات خاصة نحن السباقين في توفيرها لكم' : 'Caractéristiques et prestations exclusives'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('facadeSubtitle')}
          </p>
        </div>

        <button
          onClick={() => onSelectFloor('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedFloorFilter === 'ALL'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {isAr ? `عرض جميع الشقق (${apartments.length})` : `Voir tout (${apartments.length})`}
        </button>
      </div>

      {/* Building Stack Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Architectural Visual Stack */}
        <div className="lg:col-span-7 bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 p-6 rounded-2xl border border-emerald-900/60 text-white shadow-inner flex flex-col justify-between space-y-3">
          
          {/* Roof Terrace Level */}
          <div className="bg-slate-800/80 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between text-xs backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-amber-300">
                  {isAr ? 'السطح والتراس الملكي العلوي' : 'Toit Terrasse Privatif'}
                </span>
                <span className="text-[10px] text-slate-300 block">
                  {isAr ? 'إطلالة بانورامية 360 درجة' : 'Vue panoramique à 360°'}
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
              {isAr ? 'خاص بالطابق الثاني' : 'Révservé au 2ème Étage'}
            </span>
          </div>

          {/* Floor 2 Card */}
          <div
            onClick={() => onSelectFloor('FLOOR_2')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
              selectedFloorFilter === 'FLOOR_2'
                ? 'bg-emerald-800/80 border-emerald-400 shadow-lg shadow-emerald-900/50'
                : 'bg-slate-900/90 border-emerald-800/50 hover:border-emerald-500 hover:bg-emerald-950/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm shadow">
                2
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>{isAr ? 'الطابق الثاني (2ème Étage + Terrasse)' : '2ème Étage (+ Terrasse)'}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    {isAr ? 'بنتهاوس' : 'Penthouse'}
                  </span>
                </h4>
                <p className="text-xs text-emerald-200/80">
                  {isAr ? 'شقق ملكية مع تراس خاص علوي وهدوء تام' : 'Appartements d\'exception avec toit terrasse privatif'}
                </p>
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-300 block">
                {getFloorCount('FLOOR_2')} {t('unitsAvailable')}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                {isAr ? 'تصفح' : 'Voir'} {isAr ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </span>
            </div>
          </div>

          {/* Floor 1 Card */}
          <div
            onClick={() => onSelectFloor('FLOOR_1')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
              selectedFloorFilter === 'FLOOR_1'
                ? 'bg-emerald-800/80 border-emerald-400 shadow-lg shadow-emerald-900/50'
                : 'bg-slate-900/90 border-emerald-800/50 hover:border-emerald-500 hover:bg-emerald-950/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-sm shadow">
                1
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>{isAr ? 'الطابق الأول (1er Étage)' : '1er Étage'}</span>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded">
                    {isAr ? 'شرف بالكون' : 'Balcons'}
                  </span>
                </h4>
                <p className="text-xs text-emerald-200/80">
                  {isAr ? 'شقق عائلية واسعة مع بالكونات زجاجية مطلة على الواجهة' : 'Grands appartements familiaux avec balcons vitrés'}
                </p>
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-teal-300 block">
                {getFloorCount('FLOOR_1')} {t('unitsAvailable')}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                {isAr ? 'تصفح' : 'Voir'} {isAr ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </span>
            </div>
          </div>

          {/* Ground Floor RDC Card */}
          <div
            onClick={() => onSelectFloor('GROUND')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
              selectedFloorFilter === 'GROUND'
                ? 'bg-emerald-800/80 border-emerald-400 shadow-lg shadow-emerald-900/50'
                : 'bg-slate-900/90 border-emerald-800/50 hover:border-emerald-500 hover:bg-emerald-950/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow">
                RDC
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>{isAr ? 'الطابق الأرضي (Rez-de-chaussée RDC)' : 'Rez-de-Chaussée (RDC)'}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    {isAr ? 'حديقة خاصة' : 'Jardin Privé'}
                  </span>
                </h4>
                <p className="text-xs text-emerald-200/80">
                  {isAr ? 'شقق فخمة محاطة بحدائق خاصة ومدخل مباشر' : 'Appartements de luxe avec jardins privatifs et accès direct'}
                </p>
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-300 block">
                {getFloorCount('GROUND')} {t('unitsAvailable')}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                {isAr ? 'تصفح' : 'Voir'} {isAr ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </span>
            </div>
          </div>

          {/* Basement Parking */}
          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <TreePine className="w-4 h-4 text-emerald-500" />
            <span>{isAr ? 'مرآب السيارات المغطى والآمن أسفل الإقامة R+2' : 'Garage souterrain sécurisé sous la résidence R+2'}</span>
          </div>

        </div>

        {/* Feature Overview Column */}
        <div className="lg:col-span-5 bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'مميزات الواجهة والمشروع' : 'Caractéristiques de la Façade'}</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>
                  <strong>{isAr ? 'طلاء بارد باللون الأخضر النعناعي والأبيض:' : 'Peinture Éco-Fraîche Vert & Blanc:'}</strong>{' '}
                  {isAr ? 'مقاوم لأشعة الشمس والحرارة ويحافظ على رونقه طوال السنة.' : 'Haute résistance thermique et esthétique duralbe.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>
                  <strong>{isAr ? 'شقق محدودة (R+2):' : 'Copropriété Intimiste (R+2):'}</strong>{' '}
                  {isAr ? 'تضمن لك الخصوصية العالية والهدوء التام بعيداً عن صخب العمارات المرتفعة.' : 'Tranquillité garantie loin de la densité des grands immeubles.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>
                  <strong>{isAr ? 'تخصيص الصباغة لكل غرفة مجاناً:' : 'Peinture sur-mesure offerte:'}</strong>{' '}
                  {isAr ? 'يمكنك اختيار خيال، عنبرة، أو صباغة زيتية قبل تسليم المفاتيح.' : 'Finition Khayal, Ambra ou Huile personnalisée par pièce.'}
                </span>
              </li>
            </ul>
          </div>

          <div className="p-3.5 bg-white border border-emerald-200 rounded-xl text-xs space-y-1">
            <div className="font-bold text-emerald-900">
              {isAr ? 'هل تحتاج مساعدة في اختيار الطابق؟' : 'Besoin d\'aide pour choisir votre étage?'}
            </div>
            <p className="text-slate-600">
              {isAr
                ? 'تواصل مع فريق المبيعات لمعاينة الشقق المتاحة ميدانياً وتحديد المساحة والواجهة المناسبة لعائلتك.'
                : 'Contactez notre conseiller commercial pour planifier une visite du showroom.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
