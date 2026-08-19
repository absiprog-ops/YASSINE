import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Apartment } from '../types';
import {
  X,
  Building2,
  BedDouble,
  Bath,
  Maximize,
  TreePine,
  Sun,
  Compass,
  Paintbrush,
  CheckCircle2,
  MapPin,
  Heart,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const ApartmentModal: React.FC<{
  apartment: Apartment | null;
  onClose: () => void;
  onCustomizePaint: (apt: Apartment) => void;
}> = ({ apartment, onClose, onCustomizePaint }) => {
  const { siteSettings, savedApartmentIds, toggleSaveApartment } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!apartment) return null;

  const isSaved = savedApartmentIds.includes(apartment.id);
  const gallery = [apartment.mainImage, ...apartment.galleryImages];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 max-w-3xl w-full max-h-[90vh] overflow-y-auto text-slate-800 dir-rtl my-8">
        {/* Header Bar */}
        <div className="bg-emerald-950 text-white p-4 sticky top-0 z-20 flex items-center justify-between border-b border-emerald-800/80">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              {apartment.code}
            </span>
            <h3 className="font-bold text-sm sm:text-base line-clamp-1">{apartment.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveApartment(apartment.id)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isSaved ? 'bg-rose-500 text-white' : 'bg-emerald-900 text-emerald-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gallery Carousel */}
        <div className="relative h-64 sm:h-80 bg-slate-900">
          <img
            src={gallery[activeImageIndex]}
            alt={apartment.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-300"
          />

          {gallery.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Thumbnails */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-2">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'border-emerald-400 scale-105' : 'border-white/50 opacity-70'
                }`}
              >
                <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Price & Primary Details Box */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 block">السعر الإجمالي للشقة:</span>
              <div className="text-2xl font-black text-emerald-950">
                {apartment.price.toLocaleString('fr-FR')}{' '}
                <span className="text-sm font-bold text-emerald-700">{siteSettings.currencySymbol}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white rounded-xl border border-emerald-200 text-xs font-bold text-slate-700">
                الطابق: {apartment.floorNameAr}
              </div>
              <div className="px-3 py-1.5 bg-white rounded-xl border border-emerald-200 text-xs font-bold text-slate-700">
                المساحة: {apartment.areaSqm} م²
              </div>
            </div>
          </div>

          {/* Overview Description */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">وصف الشقة والموقع:</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{apartment.descriptionAr}</p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-1">غرف النوم:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <BedDouble className="w-4 h-4 text-emerald-600" />
                {apartment.bedroomsCount} غرف
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-1">الحمامات:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Bath className="w-4 h-4 text-emerald-600" />
                {apartment.bathroomsCount} حمام
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-1">الواجهة والإتجاه:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Compass className="w-4 h-4 text-emerald-600" />
                {apartment.facadeOrientation}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-1">مساحات إضافية:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                {apartment.hasGarden && `حديقة ${apartment.gardenAreaSqm}م²`}
                {apartment.hasTerrace && `تراس ${apartment.terraceAreaSqm}م²`}
                {apartment.hasBalcony && 'بالكون زجاجي'}
                {!apartment.hasGarden && !apartment.hasTerrace && !apartment.hasBalcony && 'نوافذ ألومنيوم كبيرة'}
              </span>
            </div>
          </div>

          {/* Features Checklist */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-2">مميزات الشقة وتجهيزاتها:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {apartment.featuresList.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-emerald-50/40 rounded-lg text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Paint Customization Notice */}
          <div className="p-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h5 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                <Paintbrush className="w-4 h-4 text-amber-300" />
                <span>برنامج تخصيص دهانات الشقة (خيال / عنبرة / زيتية)</span>
              </h5>
              <p className="text-xs text-emerald-100">
                يمكنك اختيار نوع ولون الصباغة لكل غرفة (الصالون، غرف النوم، المطبخ) وإرسال التعديلات تلقائياً وحفظها مع الطلب.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onCustomizePaint(apartment);
              }}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs shrink-0 shadow-lg cursor-pointer transition-all"
            >
              احجز شقتك وعش تجربة جديدة في  تحديد شكل الفينيسيو لشقة احلامك
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
