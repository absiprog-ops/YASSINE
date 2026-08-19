import React from 'react';
import { useApp } from '../context/AppContext';
import { Apartment } from '../types';
import {
  Building2,
  BedDouble,
  Bath,
  Maximize,
  TreePine,
  Sun,
  Paintbrush,
  Heart,
  Eye,
  CheckCircle,
  Clock,
  Ban,
  Compass,
} from 'lucide-react';

export const ApartmentCard: React.FC<{
  apartment: Apartment;
  onOpenModal: (apt: Apartment) => void;
  onCustomizePaint: (apt: Apartment) => void;
}> = ({ apartment, onOpenModal, onCustomizePaint }) => {
  const { savedApartmentIds, toggleSaveApartment, siteSettings, t, language } = useApp();

  const isSaved = savedApartmentIds.includes(apartment.id);
  const isAr = language === 'ar';

  const getStatusBadge = () => {
    switch (apartment.status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{t('statusAvailable')}</span>
          </span>
        );
      case 'RESERVED':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>{t('statusReserved')}</span>
          </span>
        );
      case 'SOLD':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            <Ban className="w-3.5 h-3.5" />
            <span>{t('statusSold')}</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-emerald-100 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between text-slate-800 group">
      <div>
        {/* Card Header Image */}
        <div className="relative h-52 overflow-hidden bg-slate-900">
          <img
            src={apartment.mainImage || '/assets/images/r2_building_facade_1786033110102.jpg'}
            alt={apartment.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/images/r2_building_facade_1786033110102.jpg';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-slate-900/90 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2.5 py-1 rounded-lg">
                {apartment.code}
              </span>
              <span className="bg-emerald-950/80 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                {isAr ? apartment.floorNameAr : apartment.floorNameFr}
              </span>
            </div>

            <button
              onClick={() => toggleSaveApartment(apartment.id)}
              className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                isSaved
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-slate-900/60 text-white hover:bg-slate-900'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom Overlay Info */}
          <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
            {getStatusBadge()}

            {apartment.hasGarden && (
              <span className="bg-emerald-900/90 text-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/40">
                <TreePine className="w-3 h-3 text-emerald-400" />
                <span>{isAr ? `حديقة ${apartment.gardenAreaSqm}م²` : `Jardin ${apartment.gardenAreaSqm}m²`}</span>
              </span>
            )}

            {apartment.hasTerrace && (
              <span className="bg-amber-950/90 text-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-500/40">
                <Sun className="w-3 h-3 text-amber-400" />
                <span>{isAr ? `تراس ${apartment.terraceAreaSqm}م²` : `Terrasse ${apartment.terraceAreaSqm}m²`}</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {apartment.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {isAr ? apartment.descriptionAr : apartment.descriptionFr}
          </p>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 font-semibold">
              <Maximize className="w-4 h-4 text-emerald-600" />
              <span>{apartment.areaSqm} m²</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold">
              <BedDouble className="w-4 h-4 text-emerald-600" />
              <span>{apartment.bedroomsCount} {t('bedrooms')}</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold">
              <Bath className="w-4 h-4 text-emerald-600" />
              <span>{apartment.bathroomsCount} {t('bathrooms')}</span>
            </div>
          </div>

          {/* Orientation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Compass className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="line-clamp-1">{apartment.facadeOrientation}</span>
          </div>
        </div>
      </div>

      {/* Card Footer Price & CTAs */}
      <div className="p-5 pt-0 space-y-3">
        <div className="flex items-baseline justify-between bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
          <span className="text-xs font-semibold text-slate-600">{isAr ? 'السعر الإجمالي:' : 'Prix total:'}</span>
          <div>
            <span className="text-lg font-black text-emerald-800">
              {apartment.price.toLocaleString('fr-FR')}
            </span>
            <span className="text-xs font-bold text-emerald-700 mx-1">
              {siteSettings.currencySymbol}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenModal(apartment)}
            className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>{t('viewDetails')}</span>
          </button>

          <button
            onClick={() => onCustomizePaint(apartment)}
            className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
          >
            <Paintbrush className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t('customizePaintsBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
