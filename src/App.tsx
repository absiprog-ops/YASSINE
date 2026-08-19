/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp, AppView } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { R2FacadeDiagram } from './components/R2FacadeDiagram';
import { ApartmentCard } from './components/ApartmentCard';
import { ApartmentModal } from './components/ApartmentModal';
import { PaintCustomizer } from './components/PaintCustomizer';
import { MyOrdersView } from './components/MyOrdersView';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { UserAuthModal } from './components/UserAuthModal';
import { PartnersSection } from './components/PartnersSection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { Footer } from './components/Footer';
import { FloorType, Apartment } from './types';
import {
  Building2,
  Paintbrush,
  Sparkles,
  Layers,
  Filter,
  CheckCircle,
  Search,
  ArrowLeft,
  TreePine,
  Sun,
  ShieldCheck,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    apartments,
    activeView,
    setActiveView,
    isAdminMode,
    currentUser,
    setSelectedApartmentForCustomization,
    selectedApartmentForModal,
    setSelectedApartmentForModal,
    siteSettings,
  } = useApp();

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Floor filter for apartments view
  const [floorFilter, setFloorFilter] = useState<FloorType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredApartments = apartments.filter((apt) => {
    if (floorFilter !== 'ALL' && apt.floor !== floorFilter) return false;
    if (statusFilter !== 'ALL' && apt.status !== statusFilter) return false;
    return true;
  });

  const handleCustomizePaintForApartment = (apt: Apartment) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedApartmentForCustomization(apt);
    setActiveView('PAINT_STUDIO');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--sage-bg,#f0fdf4)] text-slate-800 font-sans flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main Content Router View */}
      <main className="flex-1">
        {/* ADMIN VIEW */}
        {activeView === 'ADMIN' ? (
          isAdminMode ? (
            <AdminDashboard />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-xl border border-amber-200 text-center space-y-4 dir-rtl">
              <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl mx-auto flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                لوحة التحكم مخصصة لإدارة المشروع فقط
              </h3>
              <p className="text-xs text-slate-600">
                يرجى تسجيل الدخول بحساب الإدارة المعتمد للوصول إلى إعدادات وإدارة الشقق والطلبات.
              </p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow"
              >
                تسجيل دخول الإدارة
              </button>
            </div>
          )
        ) : activeView === 'PAINT_STUDIO' ? (
          /* PAINT CUSTOMIZER VIEW */
          <PaintCustomizer onOpenAuthModal={() => setAuthModalOpen(true)} />
        ) : activeView === 'MY_ORDERS' ? (
          /* MY ORDERS / CLIENT PORTAL VIEW */
          <MyOrdersView onOpenAuthModal={() => setAuthModalOpen(true)} />
        ) : activeView === 'APARTMENTS' ? (
          /* ALL APARTMENTS VIEW */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 dir-rtl">
            <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold mb-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>معرض الشقق السكنية R+2</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  شقق إقامة Magha immobilier بالواجهة الأخضر البارد والأبيض
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                  اختر الشقة المناسبة وافتح استوديو الدهانات لتحديد صباغة خيال، عنبرة، أو صباغة زيتية مجاناً.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-emerald-500/30 text-xs">
                <div className="flex items-center gap-1 text-emerald-300 font-bold">
                  <Filter className="w-4 h-4" />
                  <span>التصفية:</span>
                </div>

                <select
                  value={floorFilter}
                  onChange={(e) => setFloorFilter(e.target.value as FloorType | 'ALL')}
                  className="bg-emerald-950 text-white border border-emerald-700 rounded-xl px-3 py-2 font-bold focus:outline-none"
                >
                  <option value="ALL">جميع الطوابق (R+2)</option>
                  <option value="GROUND">الطابق الأرضي (RDC)</option>
                  <option value="FLOOR_1">الطابق الأول (1er Étage)</option>
                  <option value="FLOOR_2">الطابق الثاني (2ème Étage)</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-emerald-950 text-white border border-emerald-700 rounded-xl px-3 py-2 font-bold focus:outline-none"
                >
                  <option value="ALL">جميع الحالات</option>
                  <option value="AVAILABLE">المتاحة للبيع فقط</option>
                  <option value="RESERVED">المحجوزة</option>
                </select>
              </div>
            </div>

            {/* R+2 Facade Diagram */}
            <R2FacadeDiagram
              selectedFloorFilter={floorFilter}
              onSelectFloor={(f) => setFloorFilter(f)}
            />

            {/* Apartments Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg">
                  نتائج الشقق المتاحة ({filteredApartments.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApartments.map((apt) => (
                  <ApartmentCard
                    key={apt.id}
                    apartment={apt}
                    onOpenModal={(selected) => setSelectedApartmentForModal(selected)}
                    onCustomizePaint={(selected) => handleCustomizePaintForApartment(selected)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* HOME LANDING VIEW */
          <div className="space-y-12">
            {/* Hero Section */}
            <Hero onOpenAuthModal={() => setAuthModalOpen(true)} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
              {/* Interactive R+2 Facade Stacker Diagram */}
              <R2FacadeDiagram
                selectedFloorFilter={floorFilter}
                onSelectFloor={(f) => {
                  setFloorFilter(f);
                  setActiveView('APARTMENTS');
                }}
              />

              {/* Featured R+2 Apartments Showcase */}
              <div className="space-y-6 dir-rtl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>شقق الإقامة R+2 المميزة</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      اختر شقتك القادمة بواجهة عصرية خضراء باردة وأبيض
                    </h2>
                  </div>

                  <button
                    onClick={() => setActiveView('APARTMENTS')}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow cursor-pointer transition-all self-start sm:self-auto"
                  >
                    <span>عرض كافة الشقق ({apartments.length})</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apartments.slice(0, 3).map((apt) => (
                    <ApartmentCard
                      key={apt.id}
                      apartment={apt}
                      onOpenModal={(selected) => setSelectedApartmentForModal(selected)}
                      onCustomizePaint={(selected) => handleCustomizePaintForApartment(selected)}
                    />
                  ))}
                </div>
              </div>

              {/* Paint Customizer Highlights Callout Banner */}
              <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-emerald-500/30 dir-rtl flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                    اختر صباغة خيال، العنبرة، أو الصباغة الزيتية لغرف شقتك قبل الاستلام
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    وفرنا لك استوديو تفاعلي مخصص لاختيار نوع ولون الدهانات لكل غرفة (الصالون، غرف النوم، المطبخ) مع إمكانية إرسال التعديلات تلقائياً وحفظها مع الطلب.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (!currentUser) {
                      setAuthModalOpen(true);
                      return;
                    }
                    setActiveView('PAINT_STUDIO');
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-2xl shadow-amber-500/20 cursor-pointer transition-all transform hover:scale-105 shrink-0 flex items-center gap-2"
                >
                  <Paintbrush className="w-5 h-5" />
                  <span>دخول مخصص الصباغة والدهانات</span>
                </button>
              </div>

              {/* Certified Materials & Equipment Partners Section */}
              <PartnersSection />

              {/* Customer Reviews & Service Rating Section */}
              <CustomerReviewsSection />
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <UserAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <ApartmentModal
        apartment={selectedApartmentForModal}
        onClose={() => setSelectedApartmentForModal(null)}
        onCustomizePaint={(apt) => handleCustomizePaintForApartment(apt)}
      />

      {/* Footer */}
      <Footer onOpenAuthModal={() => setAuthModalOpen(true)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
