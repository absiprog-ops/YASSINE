import React, { useState, useEffect } from 'react';
import { PaintTypeOption, ColorSwatch, PaintCategory } from '../../types';
import {
  Palette,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Sparkles,
  RefreshCw,
  DollarSign,
  ShieldCheck,
  Droplets,
  X,
  Edit3,
  Layers,
} from 'lucide-react';

interface PaintCatalogAdminEditorProps {
  paintsCatalog: PaintTypeOption[];
  onSaveCatalog: (catalog: PaintTypeOption[]) => void;
}

export const PaintCatalogAdminEditor: React.FC<PaintCatalogAdminEditorProps> = ({
  paintsCatalog,
  onSaveCatalog,
}) => {
  const [editableCatalog, setEditableCatalog] = useState<PaintTypeOption[]>(paintsCatalog);
  const [saveToast, setSaveToast] = useState(false);
  const [activeEditingPaintId, setActiveEditingPaintId] = useState<string | null>(null);

  // New Swatch Modal State
  const [showAddSwatchModalForPaintId, setShowAddSwatchModalForPaintId] = useState<string | null>(null);
  const [newSwatch, setNewSwatch] = useState<{ nameAr: string; nameFr: string; hex: string }>({
    nameAr: '',
    nameFr: '',
    hex: '#10b981',
  });

  // New Paint Category Modal State
  const [showAddPaintModal, setShowAddPaintModal] = useState(false);
  const [newPaintForm, setNewPaintForm] = useState<{
    category: string;
    nameAr: string;
    nameFr: string;
    descriptionAr: string;
    pricePerLiter: number;
    pricePerSqm: number;
    badgeText: string;
    washabilityGrade: string;
    antiHumidityWarrantyYears: number;
  }>({
    category: 'CUSTOM_DECOR',
    nameAr: 'طلاء ديكوري حديث',
    nameFr: 'Peinture Décorative Moderne',
    descriptionAr: 'طلاء عصري ذو لمسة جمالية فائقة مخصص للجدران والأسقف.',
    pricePerLiter: 100,
    pricePerSqm: 110,
    badgeText: 'لمسة معاصرة',
    washabilityGrade: 'قابل للغسيل بالماء',
    antiHumidityWarrantyYears: 5,
  });

  // Keep local state synced if props change from outside
  useEffect(() => {
    setEditableCatalog(paintsCatalog);
  }, [paintsCatalog]);

  // Handle Save
  const handleSaveAll = () => {
    onSaveCatalog(editableCatalog);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Helper to update a field on a paint type
  const handleUpdatePaintField = (
    id: string,
    field: keyof PaintTypeOption,
    value: any
  ) => {
    setEditableCatalog((prev) =>
      prev.map((paint) => (paint.id === id ? { ...paint, [field]: value } : paint))
    );
  };

  // Helper to update a swatch in a paint type
  const handleUpdateSwatch = (
    paintId: string,
    swatchId: string,
    field: keyof ColorSwatch,
    value: string
  ) => {
    setEditableCatalog((prev) =>
      prev.map((paint) => {
        if (paint.id !== paintId) return paint;
        return {
          ...paint,
          swatches: paint.swatches.map((sw) =>
            sw.id === swatchId ? { ...sw, [field]: value } : sw
          ),
        };
      })
    );
  };

  // Delete a swatch
  const handleDeleteSwatch = (paintId: string, swatchId: string) => {
    setEditableCatalog((prev) =>
      prev.map((paint) => {
        if (paint.id !== paintId) return paint;
        return {
          ...paint,
          swatches: paint.swatches.filter((sw) => sw.id !== swatchId),
        };
      })
    );
  };

  // Add new swatch to a paint
  const handleAddSwatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddSwatchModalForPaintId || !newSwatch.nameAr.trim()) return;

    const swatchToAdd: ColorSwatch = {
      id: `sw-${Date.now()}`,
      nameAr: newSwatch.nameAr.trim(),
      nameFr: newSwatch.nameFr.trim() || newSwatch.nameAr.trim(),
      hex: newSwatch.hex,
    };

    setEditableCatalog((prev) =>
      prev.map((paint) => {
        if (paint.id !== showAddSwatchModalForPaintId) return paint;
        return {
          ...paint,
          swatches: [...paint.swatches, swatchToAdd],
        };
      })
    );

    setShowAddSwatchModalForPaintId(null);
    setNewSwatch({ nameAr: '', nameFr: '', hex: '#10b981' });
  };

  // Delete an entire paint category
  const handleDeletePaintType = (paintId: string) => {
    if (window.confirm('هل أنت تأكد من حذف نوع الصباغة هذا نهائياً من المكتبة؟')) {
      setEditableCatalog((prev) => prev.filter((p) => p.id !== paintId));
    }
  };

  // Create new paint type
  const handleCreateNewPaintType = (e: React.FormEvent) => {
    e.preventDefault();
    const newPaintOption: PaintTypeOption = {
      id: `paint-${Date.now()}`,
      category: newPaintForm.category as PaintCategory,
      nameAr: newPaintForm.nameAr,
      nameFr: newPaintForm.nameFr,
      descriptionAr: newPaintForm.descriptionAr,
      pricePerLiter: Number(newPaintForm.pricePerLiter),
      pricePerSqm: Number(newPaintForm.pricePerSqm),
      coverageRateSqmPerLiter: 10,
      recommendedCoats: 2,
      dryingTimeHours: 4,
      washabilityGrade: newPaintForm.washabilityGrade,
      antiHumidityWarrantyYears: Number(newPaintForm.antiHumidityWarrantyYears),
      badgeText: newPaintForm.badgeText,
      textureCss: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(16,185,129,0.3) 100%)',
      recommendedRooms: ['SALON', 'LIVING_ROOM', 'MASTER_BEDROOM'],
      swatches: [
        { id: `sw-1-${Date.now()}`, nameAr: 'أبيض ناصع', nameFr: 'Blanc Pur', hex: '#ffffff' },
        { id: `sw-2-${Date.now()}`, nameAr: 'نعناعي الملكي', nameFr: "Vert Menthe", hex: '#a7f3d0' },
      ],
    };

    setEditableCatalog((prev) => [...prev, newPaintOption]);
    setShowAddPaintModal(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100 space-y-6 text-slate-900">
      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white font-black px-6 py-3 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-amber-300" />
          <span>تم حفظ جميع إعدادات وأسعار مكتبة الدهانات بنجاح!</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              لوحة التحكم الشاملة في مكتبة الدهانات وأسعار الصباغات
            </h3>
          </div>
          <p className="text-xs text-slate-500 mr-11">
            إدارة كاملة لأنواع الدهانات (خيال، عنبرة، ستوكو، لاك، زيتية، حرير) وتعديل أسعار المتر المربع وتخصيص درجات الألوان بكل سهولة.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddPaintModal(true)}
            className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-2xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-700" />
            <span>إضافة نوع دهان جديد</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>حفظ جميع التغييرات</span>
          </button>
        </div>
      </div>

      {/* Paints Catalog List Grid */}
      <div className="space-y-6">
        {editableCatalog.map((paint) => {
          const isExpanded = activeEditingPaintId === paint.id;

          return (
            <div
              key={paint.id}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'border-emerald-500 bg-emerald-50/20 shadow-xl ring-2 ring-emerald-400/30'
                  : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Paint Card Top Summary Row */}
              <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-3 min-w-[240px]">
                  {/* Texture swatch preview */}
                  <div
                    className="w-11 h-11 rounded-2xl border border-slate-200 shadow-inner shrink-0"
                    style={{ background: paint.textureCss || '#0d5c52' }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base text-slate-900">{paint.nameAr}</h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                        {paint.badgeText || paint.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">{paint.nameFr}</p>
                  </div>
                </div>

                {/* Quick Price Inputs */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-600">السعر / م²:</span>
                    <input
                      type="number"
                      value={paint.pricePerSqm}
                      onChange={(e) =>
                        handleUpdatePaintField(paint.id, 'pricePerSqm', Number(e.target.value))
                      }
                      className="w-16 px-2 py-0.5 bg-white border border-slate-300 rounded-lg text-xs font-extrabold text-emerald-900 text-center"
                    />
                    <span className="text-xs font-bold text-slate-700">درهم</span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-600">السعر / لتر:</span>
                    <input
                      type="number"
                      value={paint.pricePerLiter}
                      onChange={(e) =>
                        handleUpdatePaintField(paint.id, 'pricePerLiter', Number(e.target.value))
                      }
                      className="w-16 px-2 py-0.5 bg-white border border-slate-300 rounded-lg text-xs font-extrabold text-slate-900 text-center"
                    />
                    <span className="text-xs font-bold text-slate-700">درهم</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveEditingPaintId(isExpanded ? null : paint.id)
                    }
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      isExpanded
                        ? 'bg-emerald-700 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isExpanded ? 'إغلاق التعديل' : 'تعديل الإعدادات والألوان'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePaintType(paint.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl cursor-pointer transition-all"
                    title="حذف هذا النوع من الصباغة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Swatches Horizontal Bar preview */}
              <div className="px-5 py-3 bg-slate-50 flex items-center justify-between border-b border-slate-200/60">
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  <span className="text-xs font-extrabold text-slate-500 shrink-0">
                    درجات الألوان المتوفرة ({paint.swatches.length}):
                  </span>
                  {paint.swatches.map((sw) => (
                    <div
                      key={sw.id}
                      className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-xs shadow-2xs shrink-0"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-inner"
                        style={{ backgroundColor: sw.hex }}
                      />
                      <span className="font-bold text-slate-800 text-[11px]">{sw.nameAr}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddSwatchModalForPaintId(paint.id)}
                  className="px-3 py-1 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة لون جديد</span>
                </button>
              </div>

              {/* Expanded Detailed Settings Drawer */}
              {isExpanded && (
                <div className="p-6 space-y-6 bg-white animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">الاسم بالعربية:</label>
                      <input
                        type="text"
                        value={paint.nameAr}
                        onChange={(e) =>
                          handleUpdatePaintField(paint.id, 'nameAr', e.target.value)
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">الاسم بالفرنسية:</label>
                      <input
                        type="text"
                        value={paint.nameFr}
                        onChange={(e) =>
                          handleUpdatePaintField(paint.id, 'nameFr', e.target.value)
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">شارة العرض (Badge):</label>
                      <input
                        type="text"
                        value={paint.badgeText}
                        onChange={(e) =>
                          handleUpdatePaintField(paint.id, 'badgeText', e.target.value)
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-800"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block font-bold text-slate-700 mb-1">الوصف التفصيلي:</label>
                      <textarea
                        rows={2}
                        value={paint.descriptionAr}
                        onChange={(e) =>
                          handleUpdatePaintField(paint.id, 'descriptionAr', e.target.value)
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">درجة القابلية للغسيل:</label>
                      <input
                        type="text"
                        value={paint.washabilityGrade}
                        onChange={(e) =>
                          handleUpdatePaintField(paint.id, 'washabilityGrade', e.target.value)
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">سنوات الضمان ضد الرطوبة:</label>
                      <input
                        type="number"
                        value={paint.antiHumidityWarrantyYears}
                        onChange={(e) =>
                          handleUpdatePaintField(
                            paint.id,
                            'antiHumidityWarrantyYears',
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">معدل التغطية (م²/لتر):</label>
                      <input
                        type="number"
                        value={paint.coverageRateSqmPerLiter}
                        onChange={(e) =>
                          handleUpdatePaintField(
                            paint.id,
                            'coverageRateSqmPerLiter',
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Swatches Detailed Grid Editor */}
                  <div className="border-t border-slate-200 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-emerald-600" />
                        <span>إدارة ألوان ودرجات هذا النوع ({paint.swatches.length} ألوان):</span>
                      </h5>

                      <button
                        type="button"
                        onClick={() => setShowAddSwatchModalForPaintId(paint.id)}
                        className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-300/80 hover:bg-amber-100 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة لون جديد</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {paint.swatches.map((sw) => (
                        <div
                          key={sw.id}
                          className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative group"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={sw.hex}
                              onChange={(e) =>
                                handleUpdateSwatch(paint.id, sw.id, 'hex', e.target.value)
                              }
                              className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer shadow-inner shrink-0"
                            />
                            <div className="flex-1 space-y-1">
                              <input
                                type="text"
                                value={sw.nameAr}
                                onChange={(e) =>
                                  handleUpdateSwatch(paint.id, sw.id, 'nameAr', e.target.value)
                                }
                                placeholder="اسم اللون بالعربية"
                                className="w-full px-2 py-0.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                              />
                              <input
                                type="text"
                                value={sw.nameFr}
                                onChange={(e) =>
                                  handleUpdateSwatch(paint.id, sw.id, 'nameFr', e.target.value)
                                }
                                placeholder="Nom du couleur"
                                className="w-full px-2 py-0.5 bg-white border border-slate-300 rounded-lg text-[11px] font-mono text-slate-600"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteSwatch(paint.id, sw.id)}
                              className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition-all"
                              title="حذف هذا اللون"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: Add New Color Swatch */}
      {showAddSwatchModalForPaintId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-emerald-200 space-y-4 text-right animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>إضافة درجات لون جديدة</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddSwatchModalForPaintId(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSwatchSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم اللون (بالعربية):</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: زمردي ملكي دافئ"
                  value={newSwatch.nameAr}
                  onChange={(e) => setNewSwatch({ ...newSwatch, nameAr: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم اللون (بالفرنسية):</label>
                <input
                  type="text"
                  placeholder="مثال: Émeraude Impéraul Chaud"
                  value={newSwatch.nameFr}
                  onChange={(e) => setNewSwatch({ ...newSwatch, nameFr: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اختيار رمز اللون (HEX Code):</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newSwatch.hex}
                    onChange={(e) => setNewSwatch({ ...newSwatch, hex: e.target.value })}
                    className="w-12 h-10 rounded-xl border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newSwatch.hex}
                    onChange={(e) => setNewSwatch({ ...newSwatch, hex: e.target.value })}
                    className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-800 text-center uppercase"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSwatchModalForPaintId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>إضافة اللون للمكتبة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Entire New Paint Type Option */}
      {showAddPaintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-emerald-200 space-y-4 text-right animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-700" />
                <span>إضافة نوع دهان جديد لمكتبة المشروع</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddPaintModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewPaintType} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الاسم بالعربية:</label>
                  <input
                    type="text"
                    required
                    value={newPaintForm.nameAr}
                    onChange={(e) => setNewPaintForm({ ...newPaintForm, nameAr: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الاسم بالفرنسية:</label>
                  <input
                    type="text"
                    required
                    value={newPaintForm.nameFr}
                    onChange={(e) => setNewPaintForm({ ...newPaintForm, nameFr: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر للمتر المربع (درهم/م²):</label>
                  <input
                    type="number"
                    required
                    value={newPaintForm.pricePerSqm}
                    onChange={(e) =>
                      setNewPaintForm({ ...newPaintForm, pricePerSqm: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-emerald-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر للتر (درهم/لتر):</label>
                  <input
                    type="number"
                    required
                    value={newPaintForm.pricePerLiter}
                    onChange={(e) =>
                      setNewPaintForm({ ...newPaintForm, pricePerLiter: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الوصف:</label>
                <textarea
                  rows={2}
                  value={newPaintForm.descriptionAr}
                  onChange={(e) =>
                    setNewPaintForm({ ...newPaintForm, descriptionAr: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">شارة العرض (Badge):</label>
                  <input
                    type="text"
                    value={newPaintForm.badgeText}
                    onChange={(e) =>
                      setNewPaintForm({ ...newPaintForm, badgeText: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">سنوات الضمان:</label>
                  <input
                    type="number"
                    value={newPaintForm.antiHumidityWarrantyYears}
                    onChange={(e) =>
                      setNewPaintForm({
                        ...newPaintForm,
                        antiHumidityWarrantyYears: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPaintModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>إضافة النوع إلى المكتبة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
