import React, { useState, useRef } from 'react';
import { ImageUploader } from './ImageUploader';
import {
  Apartment,
  RoomType,
  WallPosition,
  RoomWallPolygon,
  Point2D,
  PaintCategory,
} from '../../types';
import {
  PenTool,
  Save,
  RotateCcw,
  Trash2,
  Check,
  Plus,
  Layers,
  Sparkles,
  Eye,
  Lock,
  Upload,
  Info,
  Palette,
  CheckCircle2,
} from 'lucide-react';

interface WallPolygonMapperProps {
  apartments: Apartment[];
  onSaveApartmentPolygons: (
    apartmentId: string,
    roomType: RoomType,
    polygons: RoomWallPolygon[],
    roomImageUrl?: string
  ) => void;
  isAr: boolean;
}

const ROOM_OPTIONS: { type: RoomType; labelAr: string; labelFr: string }[] = [
  { type: 'SALON', labelAr: 'الصالون المغربي الرئيسي', labelFr: 'Salon Marocain Principal' },
  { type: 'MASTER_BEDROOM', labelAr: 'غرفة النوم الرئيسية', labelFr: 'Chambre Principale' },
  { type: 'LIVING_ROOM', labelAr: 'غرفة المعيشة / السيجور', labelFr: 'Séjour / Living Room' },
  { type: 'KIDS_BEDROOM', labelAr: 'غرفة الأطفال', labelFr: 'Chambre Enfants' },
  { type: 'KITCHEN', labelAr: 'المطبخ العصري', labelFr: 'Cuisine Moderne' },
  { type: 'HALL', labelAr: 'البهو والمدخل الرئيسي', labelFr: 'Hall / Entrée' },
];

const WALL_POSITIONS_OPTIONS: { pos: WallPosition; labelAr: string; labelFr: string }[] = [
  { pos: 'MAIN_ACCENT', labelAr: 'الجدار الرئيسي للديكور (Accent Wall)', labelFr: 'Mur Principal Accent' },
  { pos: 'SIDE_LEFT', labelAr: 'الجدار الأيسر', labelFr: 'Mur Gauche' },
  { pos: 'SIDE_RIGHT', labelAr: 'الجدار الأيمن', labelFr: 'Mur Droit' },
  { pos: 'BACK_WINDOW', labelAr: 'حائط النافذة والمدخل', labelFr: 'Mur Fenêtre / Entrée' },
  { pos: 'CEILING', labelAr: 'السقف والديكور الجبسي', labelFr: 'Plafond & Corniche' },
  { pos: 'ARCHES_CORNICE', labelAr: 'الأقواس والكرانيش المغربية', labelFr: 'Arches & Corniches' },
  { pos: 'DOORS_FRAMES', labelAr: 'الأبواب وإطارات الألومنيوم', labelFr: 'Portes & Cadres' },
];

const SAMPLE_PREVIEW_COLORS = [
  { name: 'خيال زمردي', hex: '#0d5c52' },
  { name: 'عنبرة كريمية', hex: '#fafaf9' },
  { name: 'خيال ذهبي', hex: '#d97706' },
  { name: 'أزرق ملكي', hex: '#1e3a8a' },
  { name: 'رمادي لؤلؤي', hex: '#e2e8f0' },
  { name: 'رمادي وردي', hex: '#be123c' },
];

export const WallPolygonMapper: React.FC<WallPolygonMapperProps> = ({
  apartments,
  onSaveApartmentPolygons,
  isAr,
}) => {
  const [selectedAptId, setSelectedAptId] = useState<string>(apartments[0]?.id || '');
  const [selectedRoom, setSelectedRoom] = useState<RoomType>('SALON');
  const [activeWallPos, setActiveWallPos] = useState<WallPosition>('MAIN_ACCENT');
  const [wallCustomLabel, setWallCustomLabel] = useState<string>('الجدار الرئيسي للديكور');

  // Active apartment object
  const activeApt = apartments.find((a) => a.id === selectedAptId) || apartments[0];

  // Room Image URL (can be edited by admin)
  const [currentRoomImage, setCurrentRoomImage] = useState<string>(
    activeApt?.roomImages?.[selectedRoom] || activeApt?.mainImage || ''
  );

  // Saved polygons for the active room
  const [polygons, setPolygons] = useState<RoomWallPolygon[]>(
    activeApt?.roomPolygons?.[selectedRoom] || []
  );

  // Drawing state for the polygon currently being created
  const [currentPoints, setCurrentPoints] = useState<Point2D[]>([]);

  // Preview test paint color hex
  const [testPaintColor, setTestPaintColor] = useState<string>('#0d5c52');

  // Save Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state when selected apartment or room changes
  React.useEffect(() => {
    if (activeApt) {
      const roomImg = activeApt.roomImages?.[selectedRoom] || activeApt.mainImage;
      setCurrentRoomImage(roomImg);
      setPolygons(activeApt.roomPolygons?.[selectedRoom] || []);
      setCurrentPoints([]);
    }
  }, [selectedAptId, selectedRoom, activeApt]);

  // Click on image canvas to add a new vertex point
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;

    // Convert to relative percentage (0 - 100)
    const xPct = Math.min(100, Math.max(0, (xPx / rect.width) * 100));
    const yPct = Math.min(100, Math.max(0, (yPx / rect.height) * 100));

    setCurrentPoints((prev) => [...prev, { x: Number(xPct.toFixed(2)), y: Number(yPct.toFixed(2)) }]);
  };

  // Undo last point
  const handleUndoPoint = () => {
    setCurrentPoints((prev) => prev.slice(0, -1));
  };

  // Clear current drawing
  const handleClearDrawing = () => {
    setCurrentPoints([]);
  };

  // Complete and save active polygon
  const handleCompletePolygon = () => {
    if (currentPoints.length < 3) {
      alert(isAr ? 'يرجى النقر على 3 نقاط على الأقل لرسم شكل الجدار!' : 'Veuillez cliquer sur au moins 3 points pour former un polygone!');
      return;
    }

    const wallDef = WALL_POSITIONS_OPTIONS.find((w) => w.pos === activeWallPos);
    const newPoly: RoomWallPolygon = {
      id: `poly-${Date.now()}`,
      wallPosition: activeWallPos,
      labelAr: wallCustomLabel || wallDef?.labelAr || activeWallPos,
      labelFr: wallDef?.labelFr || activeWallPos,
      points: [...currentPoints],
    };

    setPolygons((prev) => [...prev, newPoly]);
    setCurrentPoints([]);

    // Auto switch next wall position
    const currentIndex = WALL_POSITIONS_OPTIONS.findIndex((w) => w.pos === activeWallPos);
    if (currentIndex < WALL_POSITIONS_OPTIONS.length - 1) {
      const nextWall = WALL_POSITIONS_OPTIONS[currentIndex + 1];
      setActiveWallPos(nextWall.pos);
      setWallCustomLabel(nextWall.labelAr);
    }
  };

  // Delete a polygon
  const handleDeletePolygon = (polyId: string) => {
    setPolygons((prev) => prev.filter((p) => p.id !== polyId));
  };

  // Save all polygons to apartment
  const handleSaveAll = () => {
    if (!activeApt) return;
    onSaveApartmentPolygons(activeApt.id, selectedRoom, polygons, currentRoomImage);
    setToastMessage(isAr ? 'تم حفظ ونشر جميع الجدران بنجاح!' : 'Polygones enregistrés et publiés!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // AI Auto-Detect Wall Polygons Handler
  const [isDetectingWalls, setIsDetectingWalls] = useState(false);

  const handleAiAutoDetectWalls = async () => {
    try {
      setIsDetectingWalls(true);
      setToastMessage(isAr ? 'جاري تحليل صورة الغرفة وتحديد حدود الجدران والسقف بالذكاء الاصطناعي...' : 'Analyse de l\'image et détection IA des murs...');

      const response = await fetch('/api/detect-walls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: currentRoomImage,
          roomType: selectedRoom,
        }),
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.polygons)) {
        const generatedPolygons: RoomWallPolygon[] = data.polygons.map((p: any, idx: number) => ({
          id: `ai-poly-${Date.now()}-${idx}`,
          wallPosition: p.wallPosition as WallPosition,
          labelAr: p.labelAr || p.wallPosition,
          labelFr: p.labelFr || p.wallPosition,
          points: p.points,
        }));

        setPolygons(generatedPolygons);
        setToastMessage(isAr ? 'تم تحديد جميع مضلعات وجدران الغرفة تلقائياً بواسطة الذكاء الاصطناعي بنجاح!' : 'Détection automatique IA des murs réussie!');
      } else {
        alert(isAr ? 'تعذر التحديد التلقائي، يمكنك اختيار النقاط يدوياً.' : 'Impossible d\'effectuer la détection IA.');
      }
    } catch (err) {
      console.error('Auto detect error:', err);
      alert(isAr ? 'حدث خطأ أثناء الاتصال بالخدمة الذكية للتحليل.' : 'Erreur de détection IA.');
    } finally {
      setIsDetectingWalls(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100 space-y-6 dir-rtl text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950 text-amber-300 rounded-2xl shadow-md">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>أداة رسم وتخطيط جدران الغرف التفاعلية الذكية</span>
              <span className="text-xs font-extrabold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300">
                Interactive Polygon Mapper
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              قم باختيار الشقة والغرفة، وانقر على الصورة لرسم نقاط الجدار بدقة عالية ليتمكن الزبناء من تلوين تلك المناطق فوراً.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAiAutoDetectWalls}
            disabled={isDetectingWalls}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 hover:from-emerald-600 hover:to-amber-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer border border-amber-300/50 hover:scale-105"
          >
            <Sparkles className={`w-4 h-4 text-amber-300 ${isDetectingWalls ? 'animate-spin' : ''}`} />
            <span>{isDetectingWalls ? 'جاري التحليل بالذكاء الاصطناعي...' : 'تحديد الجدران تلقائياً بالذكاء الاصطناعي (AI Auto-Detect)'}</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer border border-emerald-700"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>حفظ ونشر التخطيط فوراً</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-extrabold rounded-xl flex items-center justify-between gap-2 shadow-md animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
        {/* Apartment Selector */}
        <div>
          <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>اختيار الشقة:</span>
          </label>

          <select
            value={selectedAptId}
            onChange={(e) => setSelectedAptId(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 shadow-sm focus:outline-emerald-600"
          >
            {apartments.map((apt) => (
              <option key={apt.id} value={apt.id}>
                {apt.code} - {apt.title} ({apt.floorNameAr})
              </option>
            ))}
          </select>
        </div>

        {/* Room Selector */}
        <div>
          <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>اختيار الغرفة للتخطيط:</span>
          </label>

          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value as RoomType)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 shadow-sm focus:outline-emerald-600"
          >
            {ROOM_OPTIONS.map((r) => (
              <option key={r.type} value={r.type}>
                {r.labelAr}
              </option>
            ))}
          </select>
        </div>

        {/* Room Image Uploader */}
        <div>
          <ImageUploader
            value={currentRoomImage}
            onChange={(url) => setCurrentRoomImage(url)}
            label="رفع أو تعديل صورة الغرفة:"
            compact
          />
        </div>
      </div>

      {/* WORKSPACE & CANVAS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT/MAIN CANVAS AREA (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs bg-slate-900 text-amber-300 p-3 rounded-2xl font-bold border border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>انقر مباشرة على الصورة لرسم رؤوس ونقاط الجدار (Vertices)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUndoPoint}
                disabled={currentPoints.length === 0}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all disabled:opacity-40 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تراجع</span>
              </button>

              <button
                type="button"
                onClick={handleClearDrawing}
                disabled={currentPoints.length === 0}
                className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all disabled:opacity-40 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح</span>
              </button>

              <button
                type="button"
                onClick={handleCompletePolygon}
                disabled={currentPoints.length < 3}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all disabled:opacity-40 cursor-pointer shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>إغلاق وحفظ الجدار ({currentPoints.length} نقاط)</span>
              </button>
            </div>
          </div>

          {/* INTERACTIVE DRAWING CANVAS CONTAINER */}
          <div
            ref={containerRef}
            onClick={handleCanvasClick}
            className="relative aspect-square h-[620px] max-w-full mx-auto rounded-2xl overflow-hidden border-4 border-slate-800 bg-slate-950 shadow-2xl cursor-crosshair select-none group"
          >
            {/* Background Room Photo */}
            <img
              src={currentRoomImage}
              alt="Room Canvas"
              className="w-full h-full object-cover pointer-events-none select-none"
            />

            {/* SVG OVERLAY FOR DRAWN POLYGONS AND ACTIVE DRAWING */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* 1. SAVED POLYGONS */}
              {polygons.map((poly) => {
                const pointsStr = poly.points.map((p) => `${p.x},${p.y}`).join(' ');
                const avgX = poly.points.reduce((acc, p) => acc + p.x, 0) / poly.points.length;
                const avgY = poly.points.reduce((acc, p) => acc + p.y, 0) / poly.points.length;

                return (
                  <g key={poly.id}>
                    <polygon
                      points={pointsStr}
                      fill={testPaintColor}
                      fillOpacity={0.65}
                      style={{ mixBlendMode: 'multiply' }}
                      stroke="#10b981"
                      strokeWidth={1}
                    />

                    {/* Polygon Label Pin */}
                    <foreignObject
                      x={Math.max(2, Math.min(80, avgX - 8))}
                      y={Math.max(2, Math.min(85, avgY - 4))}
                      width="30"
                      height="12"
                      className="overflow-visible"
                    >
                      <div className="px-2 py-0.5 rounded-md bg-slate-950/85 text-emerald-300 font-extrabold text-[10px] border border-emerald-400 shadow-lg text-center backdrop-blur-md">
                        {poly.labelAr}
                      </div>
                    </foreignObject>
                  </g>
                );
              })}

              {/* 2. CURRENT ACTIVE POLYGON DRAWING */}
              {currentPoints.length > 0 && (
                <g>
                  {/* Active Polygon Fill */}
                  {currentPoints.length >= 3 && (
                    <polygon
                      points={currentPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                      fill="#fbbf24"
                      fillOpacity={0.35}
                      stroke="#fbbf24"
                      strokeWidth={1.5}
                      strokeDasharray="2,2"
                    />
                  )}

                  {/* Lines between active points */}
                  <polyline
                    points={currentPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                  />

                  {/* Nodes & Handle Circles */}
                  {currentPoints.map((p, idx) => (
                    <g key={idx}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={1.8}
                        fill="#fbbf24"
                        stroke="#000000"
                        strokeWidth={0.5}
                        className="animate-pulse"
                      />
                      <text
                        x={p.x + 1}
                        y={p.y - 1}
                        fill="#ffffff"
                        fontSize="3"
                        fontWeight="bold"
                        className="drop-shadow-md select-none"
                      >
                        {idx + 1}
                      </text>
                    </g>
                  ))}
                </g>
              )}
            </svg>

            {/* Instruction Overlay when empty */}
            {currentPoints.length === 0 && polygons.length === 0 && (
              <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center text-white pointer-events-auto">
                <div className="p-3 bg-emerald-600/90 text-amber-300 rounded-full mb-3 shadow-xl animate-bounce">
                  <Sparkles className="w-8 h-8 text-amber-300" />
                </div>
                <h4 className="font-black text-base text-amber-300 mb-1">بدء رسم وتخطيط جدران الغرفة الذكي</h4>
                <p className="text-xs text-slate-200 mb-4 max-w-md leading-relaxed font-medium">
                  انقر بأي مكان على الصورة لرسم النقاط يدوياً، أو استخدم خاصية التحديد التلقائي بالذكاء الاصطناعي بنقرة واحدة!
                </p>
                <button
                  type="button"
                  onClick={handleAiAutoDetectWalls}
                  disabled={isDetectingWalls}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-2xl transition-all cursor-pointer border border-amber-300/50 hover:scale-105"
                >
                  <Sparkles className={`w-4 h-4 text-amber-200 ${isDetectingWalls ? 'animate-spin' : ''}`} />
                  <span>{isDetectingWalls ? 'جاري التحليل...' : 'تحديد الجدران تلقائياً بالذكاء الاصطناعي'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CONTROL & SAVED POLYGONS PANEL (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Wall Position Form */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <PenTool className="w-4 h-4 text-emerald-600" />
              <span>1. إعدادات الجدار المراد رسمه:</span>
            </h4>

            <div>
              <label className="block font-bold text-slate-700 mb-1">نوع وموقع الجدار:</label>
              <select
                value={activeWallPos}
                onChange={(e) => {
                  const val = e.target.value as WallPosition;
                  setActiveWallPos(val);
                  const wallDef = WALL_POSITIONS_OPTIONS.find((w) => w.pos === val);
                  if (wallDef) setWallCustomLabel(wallDef.labelAr);
                }}
                className="w-full px-3 py-2 bg-white border rounded-xl font-bold text-slate-800"
              >
                {WALL_POSITIONS_OPTIONS.map((w) => (
                  <option key={w.pos} value={w.pos}>
                    {w.labelAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم الجدار باللغة العربية:</label>
              <input
                type="text"
                value={wallCustomLabel}
                onChange={(e) => setWallCustomLabel(e.target.value)}
                placeholder="مثال: جدار الصالون الرئيسي خلف السدري"
                className="w-full px-3 py-2 bg-white border rounded-xl font-bold text-slate-800"
              />
            </div>

            {/* Test Paint Color Picker */}
            <div className="pt-2 border-t border-slate-200">
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>اختبار محاكاة لون الدهان:</span>
                <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {testPaintColor}
                </span>
              </label>

              <div className="flex items-center gap-2">
                {SAMPLE_PREVIEW_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setTestPaintColor(c.hex)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      testPaintColor === c.hex ? 'scale-125 border-emerald-600 shadow-md ring-2 ring-emerald-300' : 'border-slate-300 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* List of Defined Room Polygons */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>2. الجدران المحددة للغرفة ({polygons.length}):</span>
              </h4>

              <span className="text-[10px] text-slate-500 font-mono">
                {selectedRoom}
              </span>
            </div>

            {polygons.length === 0 ? (
              <div className="p-4 bg-white rounded-xl text-center text-slate-400 text-xs border border-dashed border-slate-300">
                لم يتم رسم أي مضلع لهذه الغرفة بعد.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {polygons.map((poly, idx) => (
                  <div
                    key={poly.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <span>{poly.labelAr}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        {poly.wallPosition} • {poly.points.length} رؤوس نقاط
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeletePolygon(poly.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all"
                      title="حذف هذا الجدار"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
