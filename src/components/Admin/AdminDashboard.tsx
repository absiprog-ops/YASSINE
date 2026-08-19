import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WallPolygonMapper } from './WallPolygonMapper';
import { ClientsDatabaseTable } from './ClientsDatabaseTable';
import { ClientCustomizationsHistory } from './ClientCustomizationsHistory';
import { PaintCatalogAdminEditor } from './PaintCatalogAdminEditor';
import { PartnersAdminEditor } from './PartnersAdminEditor';
import { GoogleSheetsSync } from './GoogleSheetsSync';
import { ImageUploader } from './ImageUploader';
import {
  Apartment,
  OrderStatus,
  SiteSettings,
  PaintTypeOption,
  FloorType,
  ApartmentStatus,
  RoomType,
  WallPosition,
} from '../../types';
import {
  ShieldCheck,
  Palette,
  Building2,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Sparkles,
  Layers,
  FileText,
  DollarSign,
  Image as ImageIcon,
  Lock,
  CheckSquare,
  Edit3,
  Square,
  Eye,
  Check,
  CheckCircle2,
  ListChecks,
  PlusCircle,
  X,
  Star,
  PenTool,
  Users,
  FileSpreadsheet,
  Download,
  Upload,
  Database,
  Globe,
  Share2,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from 'lucide-react';

const ROOM_DEFINITIONS: { type: RoomType; nameAr: string }[] = [
  { type: 'SALON', nameAr: 'الصالون المغربي الملكي' },
  { type: 'LIVING_ROOM', nameAr: 'صالة الاستقبال والمعيشة' },
  { type: 'MASTER_BEDROOM', nameAr: 'غرفة النوم الرئيسية' },
  { type: 'KIDS_BEDROOM', nameAr: 'غرفة الأطفال والشباب' },
  { type: 'KITCHEN', nameAr: 'المطبخ العصري' },
  { type: 'HALL', nameAr: 'الباب الرئيسي والممرات' },
];

const WALL_DEFINITIONS: { pos: WallPosition; nameAr: string }[] = [
  { pos: 'MAIN_ACCENT', nameAr: 'الحائط الرئيسي للديكور' },
  { pos: 'SIDE_LEFT', nameAr: 'الجدار الأيسر' },
  { pos: 'SIDE_RIGHT', nameAr: 'الجدار الأيمن' },
  { pos: 'BACK_WINDOW', nameAr: 'حائط النافذة والمدخل' },
  { pos: 'CEILING', nameAr: 'السقف والديكور الجبسي' },
  { pos: 'ARCHES_CORNICE', nameAr: 'الأقواس والكرانيش المغربية' },
  { pos: 'DOORS_FRAMES', nameAr: 'الأبواب وإطارات الألومنيوم' },
];

const ALL_WALL_POSITIONS: WallPosition[] = [
  'MAIN_ACCENT',
  'SIDE_LEFT',
  'SIDE_RIGHT',
  'BACK_WINDOW',
  'CEILING',
  'ARCHES_CORNICE',
  'DOORS_FRAMES',
];

export const AdminDashboard: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    apartments,
    addApartment,
    updateApartment,
    deleteApartment,
    orders,
    updateOrderStatus,
    deleteOrder,
    paintsCatalog,
    updatePaintCatalog,
    registeredUsers,
    addRegisteredUser,
    deleteRegisteredUser,
    saveApartmentPolygons,
    reviews,
    deleteReview,
    toggleReviewApproval,
    partners,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'ORDERS' | 'MAPPER' | 'CLIENTS' | 'CUSTOMIZATIONS' | 'APARTMENTS' | 'SETTINGS' | 'PAINTS' | 'PARTNERS' | 'REVIEWS' | 'SHEETS'
  >('MAPPER');

  // Filter state for Client History when clicked from Clients table
  const [historyCinFilter, setHistoryCinFilter] = useState<string>('');

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // New Apartment Form Modal State
  const [showAddAptModal, setShowAddAptModal] = useState(false);

  // Admin Apartment Photos & Allowed Walls Editing Modal State
  const [editingPhotosApt, setEditingPhotosApt] = useState<Apartment | null>(null);
  const [saveAptToast, setSaveAptToast] = useState(false);

  const [newAptForm, setNewAptForm] = useState({
    code: 'R2-APT-09',
    title: 'شقة فاخرة جديدة في إقامة Magha immobilier',
    floor: 'GROUND' as FloorType,
    floorNameAr: 'الطابق الأرضي (RDC)',
    status: 'AVAILABLE' as ApartmentStatus,
    areaSqm: 95,
    bedroomsCount: 3,
    bathroomsCount: 2,
    price: 850000,
    facadeOrientation: 'واجهة أفقية مشمسة',
    mainImage: '/assets/images/r2_building_facade_1786033110102.jpg',
    descriptionAr: 'شقة سكنية راقية مجهزة بالكامل مع إمكانية اختيار صباغة خيال أو عنبرة بكل الغرف.',
  });

  // Handle Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(settingsForm);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2000);
  };

  // Full Data Backup & Restore Functions
  const handleExportAllData = () => {
    const fullBackup = {
      version: '1.0',
      appName: 'Magha Immobilier R+2',
      exportDate: new Date().toISOString(),
      siteSettings,
      apartments,
      paintsCatalog,
      partners,
      reviews,
      orders,
      registeredUsers,
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `magha_immobilier_full_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackupJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.siteSettings) localStorage.setItem('r2_site_settings', JSON.stringify(data.siteSettings));
        if (data.apartments) localStorage.setItem('r2_apartments', JSON.stringify(data.apartments));
        if (data.paintsCatalog) localStorage.setItem('r2_paints_catalog', JSON.stringify(data.paintsCatalog));
        if (data.partners) localStorage.setItem('r2_partners_sponsors', JSON.stringify(data.partners));
        if (data.reviews) localStorage.setItem('r2_service_reviews', JSON.stringify(data.reviews));
        if (data.orders) localStorage.setItem('r2_orders', JSON.stringify(data.orders));
        if (data.registeredUsers) localStorage.setItem('r2_registered_users', JSON.stringify(data.registeredUsers));
        alert('تم استرجاع جميع بيانات الإدارة بنجاح! سيتم تحديث الصفحة الآن لتطبيق التغييرات.');
        window.location.reload();
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية. يرجى التأكد من اختيار ملف JSON صحيح.');
      }
    };
    reader.readAsText(file);
  };

  // Feature Input State
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newAptFeatures, setNewAptFeatures] = useState<string[]>([
    'احجز شقتك وعش تجربة جديدة في  تحديد شكل الفينيسيو لشقة احلامك',
    'مطبخ مجهز وأرضيات رخامية',
    'مرآب للسيارة ومصعد هيدروليكي',
  ]);
  const [newAptFeatureText, setNewAptFeatureText] = useState('');

  const COMMON_FEATURE_PRESETS = [
    'تراس خاص علوي 45م² مجهز بالماء والكهرباء',
    'حديقة خاصة مع مدخل مستقل 35م²',
    'مطبخ عصري مجهز بفرن وشواية ورخام ممتاز',
    'أرضيات رخامية ناصعة وباب مصفح أمان',
    'مصعد هيدروليكي ومرآب مخصص للسيارة',
    'نوافذ ألومنيوم شوكو مع زجاج مضاعف العزل',
    'تجهيزات كهربائية Ingelec عالية الأمان',
    'أنابيب سباكة PPR وPVC مقاومة للضغط الحراري',
    'إمكانية اختيار صباغة خيال أو عنبرة أو زيتية',
    'تكييف هواء مجوف في الصالون وغرف النوم',
    'حمام رئيسي بعصري مع دوش إيطالي',
  ];

  const addFeatureToEditingApt = (featureToAdd: string) => {
    if (!editingPhotosApt || !featureToAdd.trim()) return;
    const currentList = editingPhotosApt.featuresList || [];
    if (currentList.includes(featureToAdd.trim())) return;
    setEditingPhotosApt({
      ...editingPhotosApt,
      featuresList: [...currentList, featureToAdd.trim()],
    });
    setNewFeatureText('');
  };

  const removeFeatureFromEditingApt = (index: number) => {
    if (!editingPhotosApt) return;
    const currentList = [...(editingPhotosApt.featuresList || [])];
    currentList.splice(index, 1);
    setEditingPhotosApt({
      ...editingPhotosApt,
      featuresList: currentList,
    });
  };

  const addFeatureToNewApt = (featureToAdd: string) => {
    if (!featureToAdd.trim()) return;
    if (newAptFeatures.includes(featureToAdd.trim())) return;
    setNewAptFeatures([...newAptFeatures, featureToAdd.trim()]);
    setNewAptFeatureText('');
  };

  const removeFeatureFromNewApt = (index: number) => {
    const updated = [...newAptFeatures];
    updated.splice(index, 1);
    setNewAptFeatures(updated);
  };

  // Handle Create Apartment
  const handleCreateApartment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Apartment = {
      ...newAptForm,
      id: `apt-${Date.now()}`,
      galleryImages: [newAptForm.mainImage],
      floorPlanImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      featuresList: newAptFeatures.length > 0 ? newAptFeatures : [
        'احجز شقتك وعش تجربة جديدة في  تحديد شكل الفينيسيو لشقة احلامك',
        'مطبخ مجهز وأرضيات رخامية',
        'مرآب للسيارة ومصعد',
      ],
      roomImages: {
        SALON: '/assets/images/interior_living_room_1786033121497.jpg',
        LIVING_ROOM: '/assets/images/interior_living_room_1786033121497.jpg',
        MASTER_BEDROOM: '/assets/images/interior_bedroom_1786033133480.jpg',
      },
      allowedWallsPerRoom: {
        SALON: ALL_WALL_POSITIONS,
        LIVING_ROOM: ALL_WALL_POSITIONS,
        MASTER_BEDROOM: ALL_WALL_POSITIONS,
        KIDS_BEDROOM: ALL_WALL_POSITIONS,
        KITCHEN: ALL_WALL_POSITIONS,
        HALL: ALL_WALL_POSITIONS,
      },
    };
    addApartment(newApt);
    setShowAddAptModal(false);
  };

  // Handle Save Apartment Photos & Wall Permissions
  const handleSaveApartmentPhotosAndWalls = () => {
    if (editingPhotosApt) {
      updateApartment(editingPhotosApt);
      setSaveAptToast(true);
      setTimeout(() => {
        setSaveAptToast(false);
        setEditingPhotosApt(null);
      }, 1500);
    }
  };

  // Helper to toggle wall permission for an apartment room
  const toggleWallPermission = (room: RoomType, wall: WallPosition) => {
    if (!editingPhotosApt) return;
    const currentAllowedObj = editingPhotosApt.allowedWallsPerRoom || {};
    const roomAllowed = currentAllowedObj[room] || ALL_WALL_POSITIONS;

    let updatedRoomAllowed: WallPosition[];
    if (roomAllowed.includes(wall)) {
      updatedRoomAllowed = roomAllowed.filter((w) => w !== wall);
    } else {
      updatedRoomAllowed = [...roomAllowed, wall];
    }

    setEditingPhotosApt({
      ...editingPhotosApt,
      allowedWallsPerRoom: {
        ...currentAllowedObj,
        [room]: updatedRoomAllowed,
      },
    });
  };

  // Helper to allow/lock all walls for a room
  const setAllWallsForRoom = (room: RoomType, allowAll: boolean) => {
    if (!editingPhotosApt) return;
    const currentAllowedObj = editingPhotosApt.allowedWallsPerRoom || {};
    setEditingPhotosApt({
      ...editingPhotosApt,
      allowedWallsPerRoom: {
        ...currentAllowedObj,
        [room]: allowAll ? ALL_WALL_POSITIONS : [],
      },
    });
  };

  // Preset Color Palettes
  const COLOR_PALETTES = [
    {
      name: 'أخضر بارد زمردي (افتراضي)',
      primary: '#0f766e',
      secondary: '#14b8a6',
      sageBg: '#f0fdf4',
      darkHeader: '#042f2e',
    },
    {
      name: 'أخضر نعناعي ملكي',
      primary: '#059669',
      secondary: '#34d399',
      sageBg: '#ecfdf5',
      darkHeader: '#064e3b',
    },
    {
      name: 'أزرق كحلي أطلسي',
      primary: '#0284c7',
      secondary: '#38bdf8',
      sageBg: '#f0f9ff',
      darkHeader: '#0c4a6e',
    },
    {
      name: 'زيتوني هادئ راقي',
      primary: '#2d6a4f',
      secondary: '#52b788',
      sageBg: '#f4fbf7',
      darkHeader: '#1b4332',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 dir-rtl text-slate-800">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-900 text-slate-950 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-950 text-amber-400 rounded-2xl shadow">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              لوحة تحكم إقامة R+2 (الآدمن)
            </h2>
            <p className="text-xs font-semibold text-slate-900">
              تحكم كامل في ألوان الواجهة، صور الشقق والغرف، الجدران المتاحة للطلاء، والطلبات.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/90 text-white px-4 py-2 rounded-xl text-xs font-bold font-mono">
          <span>الحالة: متصل بالكامل</span>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('MAPPER')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'MAPPER'
              ? 'bg-amber-500 text-slate-950 shadow-lg scale-105 border border-amber-400'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PenTool className="w-4 h-4 text-emerald-950" />
          <span>أداة رسم وتخطيط الجدران (Polygon Mapper)</span>
        </button>

        <button
          onClick={() => setActiveTab('CLIENTS')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'CLIENTS'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-amber-300" />
          <span>قاعدة البيانات الآمنة للعملاء ({registeredUsers.length})</span>
        </button>

        <button
          onClick={() => {
            setHistoryCinFilter('');
            setActiveTab('CUSTOMIZATIONS');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'CUSTOMIZATIONS'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-300" />
          <span>سجل تصاميم وخيارات العملاء ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ORDERS'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>الطلبات الواردة ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('APARTMENTS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'APARTMENTS'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>إدارة الشقق والصور ({apartments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PAINTS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'PAINTS'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>كتالوج الدهانات</span>
        </button>

        <button
          onClick={() => setActiveTab('PARTNERS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'PARTNERS'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>الموردون والشركاء (Ingelec, Colorado, Bricoma...)</span>
        </button>

        <button
          onClick={() => setActiveTab('REVIEWS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'REVIEWS'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>إدارة تقييمات وتعليقات الخدمة ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'SETTINGS'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>إعدادات الواجهة</span>
        </button>

        <button
          onClick={() => setActiveTab('SHEETS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'SHEETS'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
          <span>تزامن Google Sheets</span>
        </button>
      </div>

      {/* TAB 0: SMART WALL POLYGON MAPPER */}
      {activeTab === 'MAPPER' && (
        <WallPolygonMapper
          apartments={apartments}
          onSaveApartmentPolygons={(aptId, roomType, polys, roomImgUrl) => {
            saveApartmentPolygons(aptId, roomType, polys, roomImgUrl);
          }}
          isAr={true}
        />
      )}

      {/* TAB 0.1: SECURE CLIENTS DATABASE TABLE */}
      {activeTab === 'CLIENTS' && (
        <ClientsDatabaseTable
          users={registeredUsers}
          orders={orders}
          onAddUser={addRegisteredUser}
          onDeleteUser={deleteRegisteredUser}
          onSelectUserOrders={(cin) => {
            setHistoryCinFilter(cin);
            setActiveTab('CUSTOMIZATIONS');
          }}
          isAr={true}
        />
      )}

      {/* TAB 0.2: CLIENT CUSTOMIZATION & PAINTING HISTORY TABLE */}
      {activeTab === 'CUSTOMIZATIONS' && (
        <ClientCustomizationsHistory
          orders={orders}
          siteSettings={siteSettings}
          onUpdateOrderStatus={updateOrderStatus}
          onDeleteOrder={deleteOrder}
          initialFilterCin={historyCinFilter}
          isAr={true}
        />
      )}

      {/* TAB 1: CLIENT ORDERS MANAGEMENT */}
      {activeTab === 'ORDERS' && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                سجل طلبات الشراء وتخصيصات الدهانات المستلمة تلقائياً
              </h3>
              <p className="text-xs text-slate-500">
                استعرض بيانات الزبون (الاسم، رقم البطاقة الوطنية CIN، الهاتف) والتعديلات التي اختارها لكل غرفة.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('SHEETS')}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>تزامن مع Google Sheets</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              لا يوجد طلبات مسجلة حتى الآن.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 shadow-sm"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black bg-emerald-950 text-amber-300 px-3 py-1 rounded-lg">
                        {ord.id}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">
                          الزبون: {ord.userFullName}
                        </h4>
                        <p className="text-xs text-emerald-800 font-mono font-bold">
                          رقم البطاقة الوطنية (CIN): {ord.userCin}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{ord.submittedAt}</span>
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          updateOrderStatus(ord.id, e.target.value as OrderStatus)
                        }
                        className="bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none"
                      >
                        <option value="PENDING">قيد المراجعة (PENDING)</option>
                        <option value="CONTACTED">تم الاتصال بالزبون (CONTACTED)</option>
                        <option value="APPROVED">تم التأكيد والموافقة (APPROVED)</option>
                        <option value="REJECTED">ملغى (REJECTED)</option>
                      </select>

                      <button
                        onClick={() => deleteOrder(ord.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="حذف الطلب"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Client Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block">رقم الهاتف:</span>
                      <span className="font-bold text-slate-800" dir="ltr">
                        {ord.userPhone}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">البريد الإلكتروني:</span>
                      <span className="font-bold text-slate-800">{ord.userEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">العنوان السكني:</span>
                      <span className="font-bold text-slate-800">{ord.userAddress}</span>
                    </div>
                  </div>

                  {/* Selected Apartment & Customizations Table */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-emerald-900">
                      الشقة المختارة: {ord.apartmentCode} - {ord.apartmentTitle} ({ord.floorNameAr})
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {ord.roomCustomizations.map((rc, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                          <div className="font-bold text-slate-900 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <div
                                className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0"
                                style={{ backgroundColor: rc.colorHex }}
                              />
                              <span>{rc.roomNameAr}</span>
                            </div>
                            {rc.isWallByWallMode && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                                تفصيل جدار بحائط
                              </span>
                            )}
                          </div>

                          {rc.isWallByWallMode && rc.walls ? (
                            <div className="text-[10px] space-y-1 pt-1 border-t border-slate-200 text-slate-700">
                              {(Object.values(rc.walls) as any[]).map((w) => (
                                <div key={w.wallPosition} className="flex items-center justify-between">
                                  <span className="font-medium text-slate-800">{w.wallNameAr}:</span>
                                  <span className="font-mono text-emerald-800">
                                    {w.paintCategoryNameAr?.split(' ')[0]} ({w.colorNameAr})
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-600">
                              {rc.paintCategoryNameAr} • {rc.colorNameAr}
                            </p>
                          )}

                          <p className="text-[10px] text-emerald-800 font-bold pt-1 border-t border-slate-100">
                            التكلفة: {rc.totalRoomCost.toLocaleString()} درهم
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Price Bar */}
                  <div className="p-3 bg-emerald-950 text-white rounded-xl text-xs flex justify-between font-bold">
                    <span>سعر الشقة الأصلي: {ord.totalApartmentPrice.toLocaleString()} درهم</span>
                    <span>تخصيص الصباغة: +{ord.totalCustomizationPrice.toLocaleString()} درهم</span>
                    <span className="text-amber-400 font-black">
                      المجموع الكلي: {ord.grandTotal.toLocaleString()} {siteSettings.currencySymbol}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SITE BRANDING & COLOR THEME PICKER */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-100 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                تغيير إعدادات وألوان واجهة الموقع
              </h3>
              <p className="text-xs text-slate-500">
                يمكن للآدمن تعديل درجات الألوان الخضراء، نص الهيدر، أرقام التواصل والعنوان وتنعكس فوراً على الموقع.
              </p>
            </div>

            {settingsSavedToast && (
              <div className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-bold animate-fade-in flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> تم تطبيق وحفظ الإعدادات!
              </div>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Quick Color Palette Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                نماذج جاهزة لألوان الواجهة (أخضر بارد / نعناعي / كحلي):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {COLOR_PALETTES.map((pal, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSettingsForm((prev) => ({
                        ...prev,
                        theme: {
                          ...prev.theme,
                          primaryGreen: pal.primary,
                          secondaryGreen: pal.secondary,
                          sageLightBg: pal.sageBg,
                          darkEmeraldHeader: pal.darkHeader,
                        },
                      }));
                    }}
                    className="p-3 rounded-xl border border-slate-200 text-right hover:border-emerald-500 transition-all cursor-pointer space-y-2 bg-slate-50"
                  >
                    <div className="font-bold text-xs text-slate-800">{pal.name}</div>
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: pal.primary }} />
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: pal.secondary }} />
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: pal.sageBg }} />
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: pal.darkHeader }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Pickers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اللون الأخضر الرئيسي (Primary Green):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settingsForm.theme.primaryGreen}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, primaryGreen: e.target.value },
                      }))
                    }
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settingsForm.theme.primaryGreen}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, primaryGreen: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اللون النعناعي الفاتح (Secondary Green):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settingsForm.theme.secondaryGreen}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, secondaryGreen: e.target.value },
                      }))
                    }
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settingsForm.theme.secondaryGreen}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, secondaryGreen: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  خلفية الصفحة (Sage Light):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settingsForm.theme.sageLightBg}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, sageLightBg: e.target.value },
                      }))
                    }
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settingsForm.theme.sageLightBg}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, sageLightBg: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  لون الهيدر الأخضر الفاخر (Dark Emerald):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settingsForm.theme.darkEmeraldHeader}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, darkEmeraldHeader: e.target.value },
                      }))
                    }
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settingsForm.theme.darkEmeraldHeader}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, darkEmeraldHeader: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>

              {/* Social Media & Client Share Links */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-emerald-950 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-700" />
                    <span>روابط مواقع التواصل الاجتماعي ومشاركة الصفحة (Social Media & Share Links):</span>
                  </h5>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    قابلة للتعديل والمشاركة فوراً
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  أدخل روابط صفحات الشركة على وسائل التواصل الاجتماعي ليتمكن الزبناء من متابعة جديد المشروع ومشاركة رابط الموقع مع معارفهم.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      <span>رابط صفحة فيسبوك (Facebook):</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/your-page"
                      value={settingsForm.facebookUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                      dir="ltr"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-rose-600" />
                      <span>رابط حساب إنستغرام (Instagram):</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/your-profile"
                      value={settingsForm.instagramUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                      dir="ltr"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-red-600" />
                      <span>رابط قناة يوتيوب (YouTube):</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/@your-channel"
                      value={settingsForm.youtubeUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                      dir="ltr"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 inline-flex items-center justify-center bg-black text-white rounded-full text-[9px] font-black">t</span>
                      <span>رابط حساب تيك توك (TikTok):</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://tiktok.com/@your-account"
                      value={settingsForm.tiktokUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                      dir="ltr"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-sky-700" />
                      <span>رابط لينكد إن (LinkedIn):</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/company/your-company"
                      value={settingsForm.linkedinUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                      dir="ltr"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>رابط الموقع الرسمي المخصص للمشاركة:</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://magha-immobilier-r2.ma"
                      value={settingsForm.websiteShareUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, websiteShareUrl: e.target.value })}
                      dir="ltr"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-emerald-900"
                    />
                  </div>
                </div>
              </div>

              {/* 6. DATA PERSISTENCE & FULL SYSTEM BACKUP */}
              <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl border border-amber-400/30 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-400/20 border border-amber-400/30 text-amber-300 rounded-xl">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>حفظ الأمان والنسخ الاحتياطي للبيانات (Data Protection & Backup)</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">
                          محفوض دائمًا
                        </span>
                      </h5>
                      <p className="text-xs text-slate-300 mt-0.5">
                        يتم حفظ جميع التغييرات والمعلومات التي يدخلها الأدمن تلقائياً في ذاكرة المتصفح. يمكنك أيضاً تنزيل ملف أمان احتياطي (JSON) أو استرجاعه في أي وقت.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>تنزيل نسخة احتياطية كاملة (Export JSON):</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      قم بتنزيل كافة معلومات الشقق والأثمنة والطلبات وقائمة الدهانات والشركاء والتقييمات كملف موحد لحفظه بأمان خارج الموقع.
                    </p>
                    <button
                      type="button"
                      onClick={handleExportAllData}
                      className="w-full mt-1 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>تنزيل ملف النسخة الاحتياطية (.json)</span>
                    </button>
                  </div>

                  <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>استرجاع البيانات من ملف (Import JSON):</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      قم برفع ملف نسخة احتياطية سابقة لـ (.json) لاستعادة كافة المعطيات والمعلومات المسجلة بسهولة وبضغطة زر واحدة.
                    </p>
                    <label className="w-full mt-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-500 cursor-pointer transition-all">
                      <Upload className="w-4 h-4 text-emerald-300" />
                      <span>رفع ملف استرجاع البيانات (.json)</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportBackupJSON}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-300" />
              <span>حفظ وتطبيق إعدادات الواجهة والبيانات الآن</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB: GOOGLE SHEETS SYNC */}
      {activeTab === 'SHEETS' && <GoogleSheetsSync />}

      {/* TAB 3: APARTMENTS & PHOTOS & WALL PERMISSIONS MANAGEMENT */}
      {activeTab === 'APARTMENTS' && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-100 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">إدارة وتعديل شقق الإقامة وصورها والجدران المسموحة للطلاء</h3>
              <p className="text-xs text-slate-500">
                أضف شقة جديدة، أو قم بتغيير صور الشقة وصور الغرف الحقيقية وتحديد أي الجدران يسمح للزبون بتلوينها.
              </p>
            </div>

            <button
              onClick={() => setShowAddAptModal(true)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة شقة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {apartments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="relative h-36 rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={apt.mainImage}
                      alt={apt.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 font-mono text-xs font-black bg-slate-950/80 text-amber-300 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-slate-800">
                      {apt.code}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mb-1">
                      {apt.floorNameAr}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{apt.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      المساحة: {apt.areaSqm}م² • الغرف: {apt.bedroomsCount} غرف • الحمامات: {apt.bathroomsCount}
                    </p>

                    {/* Features Badges Preview */}
                    {apt.featuresList && apt.featuresList.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-600 block">المميزات والتجهيزات:</span>
                        <div className="flex flex-wrap gap-1">
                          {apt.featuresList.slice(0, 3).map((feat, fIdx) => (
                            <span
                              key={fIdx}
                              className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate max-w-[140px]">{feat}</span>
                            </span>
                          ))}
                          {apt.featuresList.length > 3 && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-bold">
                              +{apt.featuresList.length - 3} المزيد
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900">
                      {apt.price.toLocaleString()} {siteSettings.currencySymbol}
                    </span>

                    <button
                      onClick={() => deleteApartment(apt.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="حذف الشقة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* ADMIN EDIT ALL INFO, FEATURES, PHOTOS AND WALLS BUTTON */}
                  <button
                    onClick={() => setEditingPhotosApt(apt)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer border border-slate-800"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                    <span>تعديل المعلومات والمميزات والصور</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to Add New Apartment */}
          {showAddAptModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl dir-rtl">
                <h3 className="font-bold text-base text-slate-900">إضافة شقة R+2 جديدة</h3>

                <form onSubmit={handleCreateApartment} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">رمز الشقة:</label>
                    <input
                      type="text"
                      value={newAptForm.code}
                      onChange={(e) => setNewAptForm({ ...newAptForm, code: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">عنوان الشقة:</label>
                    <input
                      type="text"
                      value={newAptForm.title}
                      onChange={(e) => setNewAptForm({ ...newAptForm, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div>
                    <ImageUploader
                      value={newAptForm.mainImage}
                      onChange={(url) => setNewAptForm({ ...newAptForm, mainImage: url })}
                      label="صورة الشقة الرئيسية:"
                      description="ارفع صورة واجهة الشقة أو الصالون الرئيسي"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">الطابق:</label>
                      <select
                        value={newAptForm.floor}
                        onChange={(e) => {
                          const val = e.target.value as FloorType;
                          let name = 'الطابق الأرضي (RDC)';
                          if (val === 'FLOOR_1') name = 'الطابق الأول (1er Étage)';
                          if (val === 'FLOOR_2') name = 'الطابق الثاني (2ème Étage)';
                          setNewAptForm({ ...newAptForm, floor: val, floorNameAr: name });
                        }}
                        className="w-full px-3 py-2 border rounded-xl"
                      >
                        <option value="GROUND">الطابق الأرضي (RDC)</option>
                        <option value="FLOOR_1">الطابق الأول (1er Étage)</option>
                        <option value="FLOOR_2">الطابق الثاني (2ème Étage)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">السعر (درهم):</label>
                      <input
                        type="number"
                        value={newAptForm.price}
                        onChange={(e) =>
                          setNewAptForm({ ...newAptForm, price: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  {/* Features and Equipment in New Apartment */}
                  <div className="space-y-2 border-t border-slate-200 pt-2">
                    <label className="block font-bold text-slate-700">مميزات وتجهيزات الشقة:</label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="أدخل ميزة جديدة..."
                        value={newAptFeatureText}
                        onChange={(e) => setNewAptFeatureText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addFeatureToNewApt(newAptFeatureText);
                          }
                        }}
                        className="flex-1 px-3 py-1.5 border rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => addFeatureToNewApt(newAptFeatureText)}
                        className="px-3 py-1.5 bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                      >
                        إضافة
                      </button>
                    </div>

                    {/* Added Features list */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {newAptFeatures.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="text-[11px] bg-emerald-50 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{feat}</span>
                          <button
                            type="button"
                            onClick={() => removeFeatureFromNewApt(fIdx)}
                            className="text-rose-600 hover:bg-rose-100 rounded-full p-0.5 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddAptModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
                    >
                      حفظ الشقة
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ADMIN EDIT APARTMENT DETAILS, PRICES, PHOTOS AND WALL PERMISSIONS MODAL */}
          {editingPhotosApt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
              <div className="bg-white rounded-3xl p-6 max-w-4xl w-full my-8 space-y-6 shadow-2xl border border-emerald-200 dir-rtl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-950 text-amber-300 rounded-xl">
                      <Edit3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">
                        تعديل جميع معلومات، أثمنة، وصور الشقة ({editingPhotosApt.code})
                      </h3>
                      <p className="text-xs text-slate-500">
                        تعديل السعر، الحالة، الوصف الكامل، الصور، والجدران المتاحة للطلاء
                      </p>
                    </div>
                  </div>

                  {saveAptToast && (
                    <div className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 animate-bounce">
                      <Check className="w-4 h-4" /> تم الحفظ بنجاح!
                    </div>
                  )}
                </div>

                {/* 0. BASIC INFORMATION & PRICING EDIT */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>0. تعديل الثمن والمعلومات الأساسية للشقة (Price & Apartment Specs):</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">كود الشقة الأصلي:</label>
                      <input
                        type="text"
                        value={editingPhotosApt.code}
                        onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, code: e.target.value })}
                        className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">عنوان الشقة:</label>
                      <input
                        type="text"
                        value={editingPhotosApt.title}
                        onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border rounded-xl font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-emerald-800 mb-1">ثمن الشقة (درهم DH):</label>
                      <input
                        type="number"
                        value={editingPhotosApt.price}
                        onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-emerald-400 rounded-xl font-mono text-emerald-900 font-black text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">حالة الشقة (Status):</label>
                      <select
                        value={editingPhotosApt.status}
                        onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, status: e.target.value as ApartmentStatus })}
                        className="w-full px-3 py-2 bg-white border rounded-xl font-bold text-slate-800"
                      >
                        <option value="AVAILABLE">متاحة للبيع (AVAILABLE)</option>
                        <option value="RESERVED">محجوزة (RESERVED)</option>
                        <option value="SOLD">تم بيعها (SOLD)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">المساحة الإجمالية (م²):</label>
                      <input
                        type="number"
                        value={editingPhotosApt.areaSqm}
                        onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, areaSqm: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border rounded-xl font-mono text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">عدد غرف النوم والحمامات:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="غرف"
                          value={editingPhotosApt.bedroomsCount}
                          onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, bedroomsCount: Number(e.target.value) })}
                          className="w-full px-2 py-2 bg-white border rounded-xl font-mono text-center"
                        />
                        <input
                          type="number"
                          placeholder="حمامات"
                          value={editingPhotosApt.bathroomsCount}
                          onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, bathroomsCount: Number(e.target.value) })}
                          className="w-full px-2 py-2 bg-white border rounded-xl font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs">واجهة وتوجيه الشقة:</label>
                    <input
                      type="text"
                      value={editingPhotosApt.facadeOrientation}
                      onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, facadeOrientation: e.target.value })}
                      className="w-full px-3 py-2 bg-white border rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs">الوصف الكامل والتفصيلي للشقة:</label>
                    <textarea
                      rows={3}
                      value={editingPhotosApt.descriptionAr}
                      onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, descriptionAr: e.target.value })}
                      className="w-full px-3 py-2 bg-white border rounded-xl text-xs leading-relaxed text-slate-800"
                    />
                  </div>
                </div>

                {/* 0.5. APARTMENT FEATURES & AMENITIES EDIT */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-emerald-600" />
                      <span>0.5. مميزات وتجهيزات الشقة والمساحات الخاصة (Features & Equipment):</span>
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">
                      تعديل قائمة التجهيزات المجانية المتاحة مع الشقة
                    </span>
                  </div>

                  {/* Add Custom Feature Input */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="أدخل تجهيزاً أو ميزة جديدة..."
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addFeatureToEditingApt(newFeatureText);
                          }
                        }}
                        className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => addFeatureToEditingApt(newFeatureText)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all shadow"
                      >
                        <PlusCircle className="w-4 h-4 text-amber-300" />
                        <span>إضافة ميزة</span>
                      </button>
                    </div>

                    {/* Quick Preset Badges */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 block">
                        اقتراحات سريعة لتجهيزات الشقق بالإقامة (اضغط للإضافة المباشرة):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {COMMON_FEATURE_PRESETS.map((preset, idx) => {
                          const isAlreadyAdded = (editingPhotosApt.featuresList || []).includes(preset);
                          return (
                            <button
                              type="button"
                              key={idx}
                              disabled={isAlreadyAdded}
                              onClick={() => addFeatureToEditingApt(preset)}
                              className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all flex items-center gap-1 cursor-pointer ${
                                isAlreadyAdded
                                  ? 'bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                                  : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border-slate-300 hover:border-emerald-400 shadow-sm'
                              }`}
                            >
                              <span>+</span>
                              <span>{preset}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Features List */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <span className="text-xs font-extrabold text-slate-800 block">
                        قائمة المميزات والتجهيزات الحالية للشقة ({(editingPhotosApt.featuresList || []).length}):
                      </span>

                      {(!editingPhotosApt.featuresList || editingPhotosApt.featuresList.length === 0) ? (
                        <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-medium">
                          لا توجد مميزات مضافة حالياً لهذه الشقة. استخدم المربع أعلاه أو الاقتراحات لإضافة التجهيزات.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {editingPhotosApt.featuresList.map((feat, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 bg-white rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between gap-2 text-xs font-bold text-slate-800"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{feat}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFeatureFromEditingApt(idx)}
                                className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                title="حذف الميزة"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Special Areas & Balcony/Terrace/Garden Editor */}
                    <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
                        <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!editingPhotosApt.hasGarden}
                            onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, hasGarden: e.target.checked })}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>حديقة خاصة (RDC)</span>
                        </label>
                        {editingPhotosApt.hasGarden && (
                          <div className="flex items-center gap-1 pt-1">
                            <span className="text-[11px] text-slate-600">المساحة:</span>
                            <input
                              type="number"
                              value={editingPhotosApt.gardenAreaSqm || 0}
                              onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, gardenAreaSqm: Number(e.target.value) })}
                              className="w-20 px-2 py-1 border rounded-lg font-mono text-center text-xs"
                            />
                            <span className="text-[11px] text-slate-600">م²</span>
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
                        <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!editingPhotosApt.hasTerrace}
                            onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, hasTerrace: e.target.checked })}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>تراس خاص بالسطح</span>
                        </label>
                        {editingPhotosApt.hasTerrace && (
                          <div className="flex items-center gap-1 pt-1">
                            <span className="text-[11px] text-slate-600">المساحة:</span>
                            <input
                              type="number"
                              value={editingPhotosApt.terraceAreaSqm || 0}
                              onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, terraceAreaSqm: Number(e.target.value) })}
                              className="w-20 px-2 py-1 border rounded-lg font-mono text-center text-xs"
                            />
                            <span className="text-[11px] text-slate-600">م²</span>
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center">
                        <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!editingPhotosApt.hasBalcony}
                            onChange={(e) => setEditingPhotosApt({ ...editingPhotosApt, hasBalcony: e.target.checked })}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>تحتوي على شرفة/بالكون</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1. MAIN APARTMENT PHOTOS CONTROL */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>1. الصور العامة للشقة والمعرض والبلان:</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <ImageUploader
                        value={editingPhotosApt.mainImage || ''}
                        onChange={(url) => setEditingPhotosApt({ ...editingPhotosApt, mainImage: url })}
                        label="الصورة الرئيسية للشقة:"
                        description="صورة واجهة الشقة أو الواجهة الخارجية"
                      />
                    </div>

                    <div>
                      <ImageUploader
                        value={editingPhotosApt.floorPlanImage || ''}
                        onChange={(url) => setEditingPhotosApt({ ...editingPhotosApt, floorPlanImage: url })}
                        label="صورة المخطط الهندسي (Plan):"
                        description="صورة كروكي أو تصميم الشقة الهندسية"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. REAL ROOM PHOTOS FOR VISUALIZER */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>2. رفع أو تغيير الصور الحقيقية لغرف الشقة (المحاكي ثلاثي الأبعاد):</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {ROOM_DEFINITIONS.map((room) => {
                      const roomImg =
                        editingPhotosApt.roomImages?.[room.type] ||
                        editingPhotosApt.galleryImages?.[0] ||
                        editingPhotosApt.mainImage ||
                        '';

                      return (
                        <div key={room.type} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                          <div className="font-bold text-slate-800 flex items-center justify-between">
                            <span>{room.nameAr}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{room.type}</span>
                          </div>

                          <ImageUploader
                            value={editingPhotosApt.roomImages?.[room.type] || ''}
                            onChange={(url) => {
                              const currentRoomImgs = editingPhotosApt.roomImages || {};
                              setEditingPhotosApt({
                                ...editingPhotosApt,
                                roomImages: {
                                  ...currentRoomImgs,
                                  [room.type]: url,
                                },
                              });
                            }}
                            compact
                          />

                          <div className="text-[10px] text-slate-500 leading-tight">
                            ستظهر هذه الصورة مباشرة للزبون في المحاكي ثلاثي الأبعاد عند اختيار {room.nameAr}.
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. WALL PAINTING PERMISSIONS PER ROOM */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-500" />
                      <span>3. تحديد الجدران التي يُسمح للزبون بتغيير لونها في المحاكي (تراخيص الآدمن):</span>
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {ROOM_DEFINITIONS.map((room) => {
                      const allowedWallsForThisRoom =
                        editingPhotosApt.allowedWallsPerRoom?.[room.type] || ALL_WALL_POSITIONS;

                      return (
                        <div key={room.type} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-600" />
                              <span>{room.nameAr}</span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px]">
                              <button
                                type="button"
                                onClick={() => setAllWallsForRoom(room.type, true)}
                                className="px-2.5 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold rounded-md cursor-pointer transition-all"
                              >
                                السماح بجميع الجدران (7/7)
                              </button>
                              <button
                                type="button"
                                onClick={() => setAllWallsForRoom(room.type, false)}
                                className="px-2.5 py-1 bg-rose-100 text-rose-800 hover:bg-rose-200 font-bold rounded-md cursor-pointer transition-all"
                              >
                                قفل جميع الجدران (0/7)
                              </button>
                            </div>
                          </div>

                          {/* Wall Checkbox Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            {WALL_DEFINITIONS.map((w) => {
                              const isChecked = allowedWallsForThisRoom.includes(w.pos);
                              return (
                                <button
                                  type="button"
                                  key={w.pos}
                                  onClick={() => toggleWallPermission(room.type, w.pos)}
                                  className={`p-2 rounded-lg border text-right font-bold transition-all cursor-pointer flex items-center justify-between gap-1 ${
                                    isChecked
                                      ? 'bg-emerald-50 text-emerald-950 border-emerald-400 shadow-sm'
                                      : 'bg-slate-100 text-slate-400 border-slate-200 line-through opacity-70'
                                  }`}
                                >
                                  <span className="text-[11px]">{w.nameAr}</span>
                                  {isChecked ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Modal Footer Controls */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditingPhotosApt(null)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    إلغاء
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveApartmentPhotosAndWalls}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>حفظ جميع الصور والترخيصات الآن</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PAINTS CATALOG MANAGER */}
      {activeTab === 'PAINTS' && (
        <PaintCatalogAdminEditor
          paintsCatalog={paintsCatalog}
          onSaveCatalog={updatePaintCatalog}
        />
      )}

      {/* TAB 5: PARTNERS & SPONSORS MANAGER */}
      {activeTab === 'PARTNERS' && <PartnersAdminEditor />}

      {/* TAB 6: CUSTOMER REVIEWS & MODERATION MANAGER */}
      {activeTab === 'REVIEWS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 dir-rtl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                <span>إدارة تقييمات وتعليقات الخدمة ({reviews.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                التحكم في التقييمات الظاهرة للعملاء بالصفحة الرئيسية وتفعيل أو إخفاء التعليقات.
              </p>
            </div>
            <div className="bg-amber-50 text-amber-900 border border-amber-200 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Votre avis compte pour nous</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-900 text-amber-300 font-bold">
                <tr>
                  <th className="p-3">الاسم والصفة</th>
                  <th className="p-3">التقييم</th>
                  <th className="p-3">التصنيف</th>
                  <th className="p-3">التعليق والرأي</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">زبون مؤكد</th>
                  <th className="p-3">الحالة / الموافقة</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold">
                      <div className="text-slate-900">{rev.userName}</div>
                      <div className="text-[11px] text-slate-500">{rev.userRoleOrApt}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-1 rounded-md text-[11px] font-bold">
                        {rev.serviceCategory}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs leading-relaxed text-slate-700 font-medium">
                      &ldquo;{rev.comment}&rdquo;
                    </td>
                    <td className="p-3 text-[11px] font-mono text-slate-500">{rev.date}</td>
                    <td className="p-3">
                      {rev.isVerifiedBuyer ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          نعم (مشتري)
                        </span>
                      ) : (
                        <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                          زائر
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleReviewApproval(rev.id)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                          rev.isApproved !== false
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {rev.isApproved !== false ? 'منشور بالنظام ✓' : 'مخفي ✕'}
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"
                        title="حذف التقييم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
