import React, { useState } from 'react';
import { WallPosition, SingleWallCustomization, PaintCategory, RoomType, RoomWallPolygon } from '../types';
import {
  Sun,
  Lamp,
  Sparkles,
  CheckCircle2,
  Layers,
  Camera,
  Lock,
  ShieldAlert,
  Image as ImageIcon,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  X,
} from 'lucide-react';
import html2canvas from 'html2canvas';

export type LightingMode = 'DAYLIGHT' | 'WARM_LED' | 'COOL_WHITE';

interface RoomPerspective3DProps {
  roomType: RoomType;
  roomName: string;
  isWallByWallMode: boolean;
  selectedWall: WallPosition;
  onSelectWall: (wall: WallPosition) => void;
  walls: Record<WallPosition, SingleWallCustomization>;
  globalColorHex: string;
  globalPaintCategory: PaintCategory;
  globalPaintName: string;
  lightingMode: LightingMode;
  setLightingMode: (mode: LightingMode) => void;
  isAr: boolean;
  onDownloadSnapshot?: () => void;
  roomImage?: string; // Real room photo selected for this room
  allowedWalls?: WallPosition[]; // List of allowed walls configured by Admin
  roomPolygons?: RoomWallPolygon[]; // Custom drawn polygons created by Admin mapper tool
}

const DEFAULT_ROOM_IMAGES: Record<RoomType, string> = {
  SALON: '/assets/images/interior_living_room_1786033121497.jpg',
  LIVING_ROOM: '/assets/images/interior_living_room_1786033121497.jpg',
  MASTER_BEDROOM: '/assets/images/interior_bedroom_1786033133480.jpg',
  KIDS_BEDROOM: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
  KITCHEN: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  HALL: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
};

const ALL_POSITIONS: WallPosition[] = [
  'MAIN_ACCENT',
  'SIDE_LEFT',
  'SIDE_RIGHT',
  'BACK_WINDOW',
  'CEILING',
  'ARCHES_CORNICE',
  'DOORS_FRAMES',
];

export const RoomPerspective3D: React.FC<RoomPerspective3DProps> = ({
  roomType,
  roomName,
  isWallByWallMode,
  selectedWall,
  onSelectWall,
  walls,
  globalColorHex,
  globalPaintCategory,
  globalPaintName,
  lightingMode,
  setLightingMode,
  isAr,
  roomImage,
  allowedWalls = ALL_POSITIONS,
  roomPolygons,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [lockNoticeMsg, setLockNoticeMsg] = useState<string | null>(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  const activeImage = roomImage || DEFAULT_ROOM_IMAGES[roomType] || DEFAULT_ROOM_IMAGES.SALON;

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById('room-perspective-3d-box');
      if (element) {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#020617',
          logging: false,
        });
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `real-room-paint-design-${roomType.toLowerCase()}.png`;
        link.click();
      }
    } catch (err) {
      console.error('Error downloading real room image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const isWallAllowed = (pos: WallPosition) => {
    return allowedWalls.includes(pos);
  };

  const handleWallClick = (pos: WallPosition) => {
    if (!isWallAllowed(pos)) {
      setLockNoticeMsg(
        isAr
          ? 'عفواً، هذا الجدار محدد كغير متاح للطلاء بقرار من إدارة المشروع لهذا النموذج من الشقق.'
          : 'Désolé, ce mur n\'est pas modifiable selon les règles de la gestion.'
      );
      setTimeout(() => setLockNoticeMsg(null), 4000);
      return;
    }
    if (isWallByWallMode) {
      onSelectWall(pos);
    }
  };

  const getWallData = (wallKey: WallPosition): SingleWallCustomization => {
    if (walls && walls[wallKey]) {
      return walls[wallKey];
    }
    return {
      wallPosition: wallKey,
      wallNameAr: wallKey,
      wallNameFr: wallKey,
      paintCategory: globalPaintCategory,
      paintCategoryNameAr: globalPaintName,
      colorNameAr: 'لون كلاسيكي',
      colorHex: globalColorHex || '#0d5c52',
      pricePerSqm: 100,
      estimatedAreaSqm: 10,
      sheenLevel: 'SATIN',
    };
  };

  // Get rich blend color overlay style for real photo blending
  const getWallOverlayStyle = (wallKey: WallPosition) => {
    const wall = getWallData(wallKey);
    const colorHex = isWallByWallMode ? wall.colorHex : globalColorHex;
    const allowed = isWallAllowed(wallKey);

    if (!allowed) {
      return {
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        mixBlendMode: 'normal' as const,
        opacity: 0.85,
      };
    }

    return {
      backgroundColor: colorHex,
      mixBlendMode: 'multiply' as const, // Blends color seamlessly into real room photo highlights and shadows
      opacity: 0.78,
    };
  };

  // Lighting filter overlay
  const getLightingFilter = () => {
    switch (lightingMode) {
      case 'WARM_LED':
        return 'sepia(0.35) saturate(1.3) hue-rotate(-10deg) brightness(1.05)';
      case 'COOL_WHITE':
        return 'brightness(1.15) contrast(1.1) saturate(0.95)';
      default:
        return 'none';
    }
  };

  const wallLabels: Record<
    WallPosition,
    { ar: string; fr: string; shortAr: string; shortFr: string }
  > = {
    MAIN_ACCENT: { ar: 'الحائط الرئيسي للديكور', fr: 'Mur Principal Accent', shortAr: 'الرئيسي', shortFr: 'Principal' },
    SIDE_LEFT: { ar: 'الجدار الأيسر', fr: 'Mur Gauche', shortAr: 'الأيسر', shortFr: 'Gauche' },
    SIDE_RIGHT: { ar: 'الجدار الأيمن', fr: 'Mur Droit', shortAr: 'الأيمن', shortFr: 'Droit' },
    BACK_WINDOW: { ar: 'حائط النافذة والمدخل', fr: 'Mur Fenêtre / Entrée', shortAr: 'النافذة', shortFr: 'Fenêtre' },
    CEILING: { ar: 'السقف والديكور الجبسي', fr: 'Plafond & Corniche', shortAr: 'السقف', shortFr: 'Plafond' },
    ARCHES_CORNICE: { ar: 'الأقواس والكرانيش المغربية', fr: 'Arches & Corniches', shortAr: 'الأقواس', shortFr: 'Arches' },
    DOORS_FRAMES: { ar: 'الأبواب وإطارات الألومنيوم', fr: 'Portes & Cadres', shortAr: 'الأبواب', shortFr: 'Portes' },
  };

  const mainAccentData = getWallData('MAIN_ACCENT');
  const ceilingData = getWallData('CEILING');
  const archesData = getWallData('ARCHES_CORNICE');
  const doorsData = getWallData('DOORS_FRAMES');
  const leftWallData = getWallData('SIDE_LEFT');
  const rightWallData = getWallData('SIDE_RIGHT');
  const windowWallData = getWallData('BACK_WINDOW');

  return (
    <div id="room-perspective-3d-box" className="bg-slate-950 rounded-3xl p-5 shadow-2xl border border-emerald-800/80 text-white space-y-4 relative overflow-hidden">
      {/* Visualizer Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <h3 className="font-extrabold text-sm text-emerald-200 flex items-center gap-2">
            <span>{isAr ? 'المحاكي الهندسي على الصورة الحقيقية' : 'Simulateur Sur Photo Réelle'}</span>
            <span className="text-xs bg-emerald-900/90 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-600/50">
              {roomName}
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Modal Button */}
          <button
            onClick={() => {
              setZoomScale(1);
              setIsZoomModalOpen(true);
            }}
            className="px-3 py-1 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-emerald-500/50"
            title={isAr ? 'تكبير صورة الغرفة بملء الشاشة HD' : 'Agrandir en Plein Écran HD'}
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
            <span>{isAr ? 'تكبير الصورة' : 'Agrandir HD'}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            title="تحميل صورة الغرفة بتصميم الدهانات المختار"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>
              {isDownloading
                ? isAr
                  ? 'جاري التحميل...'
                  : 'Téléchargement...'
                : isAr
                ? 'تحميل الصورة HD'
                : 'Télécharger HD'}
            </span>
          </button>

          {/* Lighting Selector */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 text-[11px]">
            <button
              onClick={() => setLightingMode('DAYLIGHT')}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 font-bold cursor-pointer transition-all ${
                lightingMode === 'DAYLIGHT'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="نور النهار الطبيعي"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{isAr ? 'نهار' : 'Jour'}</span>
            </button>

            <button
              onClick={() => setLightingMode('WARM_LED')}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 font-bold cursor-pointer transition-all ${
                lightingMode === 'WARM_LED'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="إضاءة LED دافئة 3000K"
            >
              <Lamp className="w-3.5 h-3.5" />
              <span>{isAr ? 'دافئ' : 'Warm'}</span>
            </button>

            <button
              onClick={() => setLightingMode('COOL_WHITE')}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 font-bold cursor-pointer transition-all ${
                lightingMode === 'COOL_WHITE'
                  ? 'bg-emerald-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="إضاءة بيضاء ناصعة 6000K"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'أبيض' : 'Froid'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lock Warning Toast */}
      {lockNoticeMsg && (
        <div className="p-3 bg-amber-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg animate-bounce">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{lockNoticeMsg}</span>
        </div>
      )}

      {/* REAL PHOTO PERSPECTIVE CANVAS STAGE */}
      <div className="relative aspect-square h-[620px] max-w-full mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-900 shadow-2xl group flex flex-col justify-between p-2.5 select-none transition-all">
        {/* BASE LAYER: Real Room Photo */}
        <img
          src={activeImage}
          alt={roomName}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 pointer-events-none"
          style={{
            filter: getLightingFilter(),
          }}
        />

        {/* Lighting Atmosphere Color Tint Overlay */}
        <div
          className="absolute inset-0 transition-all duration-700 pointer-events-none z-10"
          style={{
            backgroundColor:
              lightingMode === 'WARM_LED'
                ? 'rgba(251, 191, 36, 0.12)'
                : lightingMode === 'COOL_WHITE'
                ? 'rgba(16, 185, 129, 0.08)'
                : 'transparent',
            mixBlendMode: 'soft-light',
          }}
        />

        {/* CUSTOM DRAWN SVG POLYGONS traced by Admin or DEFAULT PERSPECTIVE OVERLAYS */}
        {roomPolygons && roomPolygons.length > 0 ? (
          <div className="absolute inset-0 z-20 pointer-events-auto">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {roomPolygons.map((poly) => {
                const wallData = getWallData(poly.wallPosition);
                const colorHex = isWallByWallMode ? wallData.colorHex : globalColorHex;
                const isAllowed = isWallAllowed(poly.wallPosition);
                const isSelected = isWallByWallMode && selectedWall === poly.wallPosition;
                const pointsStr = poly.points.map((p) => `${p.x},${p.y}`).join(' ');

                return (
                  <g key={poly.id} className="cursor-pointer">
                    <polygon
                      points={pointsStr}
                      fill={isAllowed ? colorHex : '#0f172a'}
                      fillOpacity={isAllowed ? (isSelected ? 0.88 : 0.75) : 0.65}
                      style={{
                        mixBlendMode: isAllowed ? 'multiply' : 'normal',
                      }}
                      stroke="none"
                      strokeWidth={0}
                      onClick={() => handleWallClick(poly.wallPosition)}
                      className="transition-all duration-300 hover:fill-opacity-95"
                    >
                      <title>{poly.labelAr || wallLabels[poly.wallPosition]?.shortAr || poly.wallPosition}</title>
                    </polygon>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          <>
            {/* PERSPECTIVE OVERLAY 1: Ceiling & Gypsum Frieze */}
            <div
              onClick={() => handleWallClick('CEILING')}
              className={`h-14 rounded-t-xl transition-all duration-300 border-b-2 relative cursor-pointer z-20 ${
                !isWallAllowed('CEILING')
                  ? 'border-slate-600/80 bg-slate-950/80 cursor-not-allowed'
                  : isWallByWallMode && selectedWall === 'CEILING'
                  ? 'border-white/80 shadow-2xl scale-[1.01]'
                  : 'border-white/30 hover:brightness-125'
              }`}
              style={getWallOverlayStyle('CEILING')}
              title={isAr ? wallLabels.CEILING.ar : wallLabels.CEILING.fr}
            />

            {/* PERSPECTIVE OVERLAY 2: Moroccan Arches & Cornice Strip */}
            <div
              onClick={() => handleWallClick('ARCHES_CORNICE')}
              className={`my-1 h-10 rounded-lg transition-all duration-300 border-2 relative cursor-pointer z-20 shadow-inner ${
                !isWallAllowed('ARCHES_CORNICE')
                  ? 'border-slate-700/80 bg-slate-950/80 cursor-not-allowed'
                  : isWallByWallMode && selectedWall === 'ARCHES_CORNICE'
                  ? 'border-white/80 shadow-2xl scale-[1.01]'
                  : 'border-white/30 hover:brightness-125'
              }`}
              style={getWallOverlayStyle('ARCHES_CORNICE')}
              title={isAr ? wallLabels.ARCHES_CORNICE.ar : wallLabels.ARCHES_CORNICE.fr}
            />

            {/* PERSPECTIVE OVERLAY 3: Main Walls (Left Wall, Main Accent Wall, Right Wall) */}
            <div className="flex-1 my-1 grid grid-cols-12 gap-1.5 relative z-20">
              {/* Left Wall */}
              <div
                onClick={() => handleWallClick('SIDE_LEFT')}
                className={`col-span-3 rounded-l-xl transition-all duration-300 border-r-2 cursor-pointer relative ${
                  !isWallAllowed('SIDE_LEFT')
                    ? 'border-slate-700 bg-slate-950/80 cursor-not-allowed'
                    : isWallByWallMode && selectedWall === 'SIDE_LEFT'
                    ? 'border-white/80 shadow-2xl scale-[1.02]'
                    : 'border-white/30 hover:brightness-125'
                }`}
                style={getWallOverlayStyle('SIDE_LEFT')}
                title={isAr ? wallLabels.SIDE_LEFT.ar : wallLabels.SIDE_LEFT.fr}
              />

              {/* Main Focus Accent Wall */}
              <div
                onClick={() => handleWallClick('MAIN_ACCENT')}
                className={`col-span-6 rounded-xl transition-all duration-300 border-2 cursor-pointer relative shadow-2xl ${
                  !isWallAllowed('MAIN_ACCENT')
                    ? 'border-slate-700 bg-slate-950/80 cursor-not-allowed'
                    : isWallByWallMode && selectedWall === 'MAIN_ACCENT'
                    ? 'border-white/80 shadow-2xl scale-[1.02]'
                    : 'border-white/40 hover:brightness-125'
                }`}
                style={getWallOverlayStyle('MAIN_ACCENT')}
                title={isAr ? wallLabels.MAIN_ACCENT.ar : wallLabels.MAIN_ACCENT.fr}
              />

              {/* Right Wall */}
              <div
                onClick={() => handleWallClick('SIDE_RIGHT')}
                className={`col-span-3 rounded-r-xl transition-all duration-300 border-l-2 cursor-pointer relative ${
                  !isWallAllowed('SIDE_RIGHT')
                    ? 'border-slate-700 bg-slate-950/80 cursor-not-allowed'
                    : isWallByWallMode && selectedWall === 'SIDE_RIGHT'
                    ? 'border-white/80 shadow-2xl scale-[1.02]'
                    : 'border-white/30 hover:brightness-125'
                }`}
                style={getWallOverlayStyle('SIDE_RIGHT')}
                title={isAr ? wallLabels.SIDE_RIGHT.ar : wallLabels.SIDE_RIGHT.fr}
              />
            </div>

            {/* PERSPECTIVE OVERLAY 4: Bottom Doors & Window Wall */}
            <div className="grid grid-cols-12 gap-1.5 mt-1 relative z-20">
              {/* Doors & Frames */}
              <div
                onClick={() => handleWallClick('DOORS_FRAMES')}
                className={`col-span-4 h-11 rounded-b-xl transition-all duration-300 border-t-2 cursor-pointer relative ${
                  !isWallAllowed('DOORS_FRAMES')
                    ? 'border-slate-700 bg-slate-950/80 cursor-not-allowed'
                    : isWallByWallMode && selectedWall === 'DOORS_FRAMES'
                    ? 'border-white/80 shadow-2xl scale-[1.01]'
                    : 'border-white/20 hover:brightness-125'
                }`}
                style={getWallOverlayStyle('DOORS_FRAMES')}
                title={isAr ? wallLabels.DOORS_FRAMES.ar : wallLabels.DOORS_FRAMES.fr}
              />

              {/* Window / Entrance Wall */}
              <div
                onClick={() => handleWallClick('BACK_WINDOW')}
                className={`col-span-8 h-11 rounded-b-xl transition-all duration-300 border-t-2 cursor-pointer relative ${
                  !isWallAllowed('BACK_WINDOW')
                    ? 'border-slate-700 bg-slate-950/80 cursor-not-allowed'
                    : isWallByWallMode && selectedWall === 'BACK_WINDOW'
                    ? 'border-white/80 shadow-2xl scale-[1.01]'
                    : 'border-white/20 hover:brightness-125'
                }`}
                style={getWallOverlayStyle('BACK_WINDOW')}
                title={isAr ? wallLabels.BACK_WINDOW.ar : wallLabels.BACK_WINDOW.fr}
              />
            </div>
          </>
        )}
      </div>

      {/* Surface Selection Navigation Tags Ribbon */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 text-xs">
        <span className="text-slate-400 font-bold flex items-center gap-1 text-[11px]">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isAr ? 'انقر مباشرة على أي حائط في الصورة لتلوينه:' : 'Cliquez sur un mur pour le peindre:'}</span>
        </span>

        <div className="flex flex-wrap gap-1.5">
          {ALL_POSITIONS.map((pos) => {
            const isSelected = selectedWall === pos;
            const allowed = isWallAllowed(pos);
            const wallData = getWallData(pos);
            return (
              <button
                key={pos}
                onClick={() => handleWallClick(pos)}
                disabled={!isWallByWallMode}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  !allowed
                    ? 'bg-slate-900 text-slate-500 border-slate-800 hover:border-amber-500/50'
                    : isSelected && isWallByWallMode
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-extrabold scale-105'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-emerald-600'
                } ${!isWallByWallMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {!allowed ? (
                  <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                ) : (
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/50 shrink-0"
                    style={{ backgroundColor: wallData.colorHex }}
                  />
                )}
                <span>{isAr ? wallLabels[pos].shortAr : wallLabels[pos].shortFr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FULL-SCREEN HD INTERACTIVE ROOM IMAGE ZOOM MODAL */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-white animate-fadeIn">
          {/* Modal Top Toolbar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 z-30 bg-slate-950/80 px-4 py-2 rounded-2xl">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <div>
                <h3 className="font-extrabold text-base text-emerald-300">
                  {isAr ? 'معاينة صورة الغرفة عالية الدقة (HD Zoom)' : 'Agrandissement Photo Haute Définition'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr
                    ? `غرفة ${roomName} - استعراض تفصيلي للجدران بالصباغة المختارة`
                    : `Pièce ${roomName} - Vue agrandie des textures et couleurs`}
                </p>
              </div>
            </div>

            {/* Scale Controls & Close */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
                <button
                  onClick={() => setZoomScale((prev) => Math.min(2.5, prev + 0.25))}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-emerald-400 cursor-pointer"
                  title="تكبير"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs px-2 text-slate-300">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={() => setZoomScale((prev) => Math.max(1, prev - 0.25))}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-amber-400 cursor-pointer"
                  title="تصغير"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomScale(1)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-bold cursor-pointer"
                >
                  إعادة الضبط
                </button>
              </div>

              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg cursor-pointer transition-all"
                title="إغلاق المعاينة المكبرة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Central Large Image Viewer */}
          <div className="flex-1 my-4 relative rounded-3xl overflow-auto border-2 border-emerald-500/50 bg-slate-900/90 shadow-2xl flex items-center justify-center p-2">
            <div
              className="relative w-full h-full min-h-[500px] transition-transform duration-300 flex items-center justify-center"
              style={{ transform: `scale(${zoomScale})` }}
            >
              {/* BASE ROOM IMAGE */}
              <img
                src={activeImage}
                alt={roomName}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl pointer-events-none"
                style={{ filter: getLightingFilter() }}
              />

              {/* OVERLAY POLYGONS IN ZOOM VIEW */}
              {roomPolygons && roomPolygons.length > 0 && (
                <div className="absolute inset-0 z-20 pointer-events-auto">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {roomPolygons.map((poly) => {
                      const wallData = getWallData(poly.wallPosition);
                      const colorHex = isWallByWallMode ? wallData.colorHex : globalColorHex;
                      const isAllowed = isWallAllowed(poly.wallPosition);
                      const isSelected = isWallByWallMode && selectedWall === poly.wallPosition;
                      const pointsStr = poly.points.map((p) => `${p.x},${p.y}`).join(' ');

                      return (
                        <polygon
                          key={poly.id}
                          points={pointsStr}
                          fill={isAllowed ? colorHex : '#0f172a'}
                          fillOpacity={isAllowed ? (isSelected ? 0.88 : 0.75) : 0.65}
                          style={{ mixBlendMode: isAllowed ? 'multiply' : 'normal' }}
                          stroke="none"
                          strokeWidth={0}
                          onClick={() => handleWallClick(poly.wallPosition)}
                          className="cursor-pointer transition-all hover:fill-opacity-95"
                        >
                          <title>{poly.labelAr || poly.wallPosition}</title>
                        </polygon>
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Modal Bottom Wall Selector Pills */}
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-center gap-2 z-30">
            <span className="text-xs font-bold text-emerald-300 ml-2">
              تحديد الجدار في المعاينة المكبرة:
            </span>
            {ALL_POSITIONS.map((pos) => {
              const isSelected = selectedWall === pos;
              const allowed = isWallAllowed(pos);
              const wallData = getWallData(pos);

              return (
                <button
                  key={pos}
                  onClick={() => handleWallClick(pos)}
                  disabled={!isWallByWallMode}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all cursor-pointer ${
                    !allowed
                      ? 'bg-slate-950 text-slate-500 border-slate-800'
                      : isSelected && isWallByWallMode
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-105'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/60 shrink-0"
                    style={{ backgroundColor: wallData.colorHex }}
                  />
                  <span>{isAr ? wallLabels[pos].ar : wallLabels[pos].fr}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
