import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Apartment,
  RoomType,
  PaintCategory,
  RoomCustomization,
  ColorSwatch,
  PaintTypeOption,
  WallPosition,
  SingleWallCustomization,
  SheenLevel,
} from '../types';
import {
  Paintbrush,
  Palette,
  CheckCircle,
  Building2,
  Sparkles,
  Download,
  Send,
  UserCheck,
  Info,
  CheckCircle2,
  RefreshCw,
  FileText,
  Printer,
  Shield,
  Layers,
  Wand2,
  Sun,
  Lamp,
  Maximize2,
} from 'lucide-react';
import { RoomPerspective3D, LightingMode } from './RoomPerspective3D';
import html2canvas from 'html2canvas';

export const PaintCustomizer: React.FC<{
  onOpenAuthModal: () => void;
}> = ({ onOpenAuthModal }) => {
  const {
    apartments,
    paintsCatalog,
    currentUser,
    selectedApartmentForCustomization,
    setSelectedApartmentForCustomization,
    submitOrder,
    setActiveView,
    siteSettings,
    language,
    t,
  } = useApp();

  const isAr = language === 'ar';

  // Selected apartment
  const [activeApartment, setActiveApartment] = useState<Apartment | null>(
    selectedApartmentForCustomization || apartments[0] || null
  );

  useEffect(() => {
    if (selectedApartmentForCustomization) {
      setActiveApartment(selectedApartmentForCustomization);
    }
  }, [selectedApartmentForCustomization]);

  // Available Rooms definitions
  const ROOM_DEFINITIONS: { type: RoomType; nameAr: string; nameFr: string; defaultArea: number }[] = [
    { type: 'SALON', nameAr: 'الصالون المغربي (الضيوف)', nameFr: 'Salon Marocain Principal', defaultArea: 32 },
    { type: 'LIVING_ROOM', nameAr: 'غرفة المعيشة (الصالة)', nameFr: 'Séjour / Living Room', defaultArea: 24 },
    { type: 'MASTER_BEDROOM', nameAr: 'غرفة النوم الرئيسية', nameFr: 'Chambre Coucher Royale', defaultArea: 22 },
    { type: 'KIDS_BEDROOM', nameAr: 'غرفة الأطفال والضيوف', nameFr: 'Chambre Enfants / Invités', defaultArea: 18 },
    { type: 'KITCHEN', nameAr: 'المطبخ العصري', nameFr: 'Cuisine Moderne', defaultArea: 14 },
    { type: 'HALL', nameAr: 'البهو والمدخل الرئيسي', nameFr: 'Hall d\'Entrée', defaultArea: 12 },
  ];

  const [activeRoomType, setActiveRoomType] = useState<RoomType>('SALON');
  const [selectedWallPosition, setSelectedWallPosition] = useState<WallPosition>('MAIN_ACCENT');
  const [lightingMode, setLightingMode] = useState<LightingMode>('DAYLIGHT');

  // Helper to construct initial walls map for a room
  const buildInitialWallsForRoom = (
    roomType: RoomType,
    area: number,
    primaryPaint: PaintTypeOption,
    secondaryPaint: PaintTypeOption
  ): Record<WallPosition, SingleWallCustomization> => {
    const mainSwatch = primaryPaint.swatches[0] || { id: 'd1', nameAr: 'أخضر بارد زمردي', nameFr: 'Vert Glacé', hex: '#0d5c52' };
    const secSwatch = secondaryPaint.swatches[0] || { id: 'd2', nameAr: 'أبيض كريمي ناعم', nameFr: 'Ivoire Crème', hex: '#fafaf9' };

    const wallAreas: Record<WallPosition, number> = {
      MAIN_ACCENT: Math.round(area * 0.30),
      SIDE_LEFT: Math.round(area * 0.20),
      SIDE_RIGHT: Math.round(area * 0.20),
      BACK_WINDOW: Math.round(area * 0.18),
      CEILING: Math.round(area * 0.25),
      ARCHES_CORNICE: Math.round(area * 0.12),
      DOORS_FRAMES: Math.round(area * 0.10),
    };

    return {
      MAIN_ACCENT: {
        wallPosition: 'MAIN_ACCENT',
        wallNameAr: 'الحائط الرئيسي للديكور',
        wallNameFr: 'Mur Principal Accent',
        paintCategory: primaryPaint.category,
        paintCategoryNameAr: primaryPaint.nameAr,
        colorNameAr: mainSwatch.nameAr,
        colorHex: mainSwatch.hex,
        pricePerSqm: primaryPaint.pricePerSqm,
        estimatedAreaSqm: wallAreas.MAIN_ACCENT,
        sheenLevel: 'METALLIC',
      },
      SIDE_LEFT: {
        wallPosition: 'SIDE_LEFT',
        wallNameAr: 'الجدار الأيسر',
        wallNameFr: 'Mur Gauche',
        paintCategory: secondaryPaint.category,
        paintCategoryNameAr: secondaryPaint.nameAr,
        colorNameAr: secSwatch.nameAr,
        colorHex: secSwatch.hex,
        pricePerSqm: secondaryPaint.pricePerSqm,
        estimatedAreaSqm: wallAreas.SIDE_LEFT,
        sheenLevel: 'SATIN',
      },
      SIDE_RIGHT: {
        wallPosition: 'SIDE_RIGHT',
        wallNameAr: 'الجدار الأيمن',
        wallNameFr: 'Mur Droit',
        paintCategory: secondaryPaint.category,
        paintCategoryNameAr: secondaryPaint.nameAr,
        colorNameAr: secSwatch.nameAr,
        colorHex: secSwatch.hex,
        pricePerSqm: secondaryPaint.pricePerSqm,
        estimatedAreaSqm: wallAreas.SIDE_RIGHT,
        sheenLevel: 'SATIN',
      },
      BACK_WINDOW: {
        wallPosition: 'BACK_WINDOW',
        wallNameAr: 'حائط النافذة والمدخل',
        wallNameFr: 'Mur Fenêtre / Entrée',
        paintCategory: secondaryPaint.category,
        paintCategoryNameAr: secondaryPaint.nameAr,
        colorNameAr: secSwatch.nameAr,
        colorHex: secSwatch.hex,
        pricePerSqm: secondaryPaint.pricePerSqm,
        estimatedAreaSqm: wallAreas.BACK_WINDOW,
        sheenLevel: 'SATIN',
      },
      CEILING: {
        wallPosition: 'CEILING',
        wallNameAr: 'السقف والديكور الجبسي',
        wallNameFr: 'Plafond & Corniche',
        paintCategory: 'MATT',
        paintCategoryNameAr: 'صباغة مات مطفأة ناعمة',
        colorNameAr: 'أبيض ثلجي ناصع',
        colorHex: '#ffffff',
        pricePerSqm: 75,
        estimatedAreaSqm: wallAreas.CEILING,
        sheenLevel: 'MATT',
      },
      ARCHES_CORNICE: {
        wallPosition: 'ARCHES_CORNICE',
        wallNameAr: 'الأقواس والكرانيش المغربية',
        wallNameFr: 'Arches & Corniches',
        paintCategory: 'AMBRA',
        paintCategoryNameAr: 'دهانات العنبرة الرخامية',
        colorNameAr: 'رخامي بيج ملكي',
        colorHex: '#fef3c7',
        pricePerSqm: 140,
        estimatedAreaSqm: wallAreas.ARCHES_CORNICE,
        sheenLevel: 'VELVET',
      },
      DOORS_FRAMES: {
        wallPosition: 'DOORS_FRAMES',
        wallNameAr: 'الأبواب وإطارات الألومنيوم',
        wallNameFr: 'Portes & Cadres',
        paintCategory: 'HIGH_GLOSS',
        paintCategoryNameAr: 'صباغة لاك لامعة جداً',
        colorNameAr: 'أبيض لامع عاجي',
        colorHex: '#ffffff',
        pricePerSqm: 100,
        estimatedAreaSqm: wallAreas.DOORS_FRAMES,
        sheenLevel: 'HIGH_GLOSS',
      },
    };
  };

  // Map storing customization state for each room
  const [roomChoices, setRoomChoices] = useState<Record<RoomType, RoomCustomization>>(() => {
    const initial: Partial<Record<RoomType, RoomCustomization>> = {};
    const khayalPaint = paintsCatalog.find((p) => p.category === 'KHAYAL') || paintsCatalog[0];
    const ambraPaint = paintsCatalog.find((p) => p.category === 'AMBRA') || paintsCatalog[1];
    const oilPaint = paintsCatalog.find((p) => p.category === 'OIL_PAINT') || paintsCatalog[2];

    ROOM_DEFINITIONS.forEach((room) => {
      let chosenPrimary = khayalPaint;
      let chosenSecondary = oilPaint;
      if (room.type === 'MASTER_BEDROOM') {
        chosenPrimary = ambraPaint;
        chosenSecondary = khayalPaint;
      }
      if (room.type === 'KITCHEN') {
        chosenPrimary = oilPaint;
        chosenSecondary = oilPaint;
      }

      const swatch = chosenPrimary.swatches[0] || {
        id: 'def',
        nameAr: 'أخضر بارد زمردي',
        hex: '#0d5c52',
      };

      const wallsMap = buildInitialWallsForRoom(room.type, room.defaultArea, chosenPrimary, chosenSecondary);

      initial[room.type] = {
        roomType: room.type,
        roomNameAr: room.nameAr,
        paintCategory: chosenPrimary.category,
        paintCategoryNameAr: chosenPrimary.nameAr,
        colorNameAr: swatch.nameAr,
        colorHex: swatch.hex,
        pricePerSqm: chosenPrimary.pricePerSqm,
        estimatedAreaSqm: room.defaultArea,
        totalRoomCost: room.defaultArea * chosenPrimary.pricePerSqm,
        isWallByWallMode: true, // Default to professional wall-by-wall mode!
        walls: wallsMap,
      };
    });
    return initial as Record<RoomType, RoomCustomization>;
  });

  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Active room custom data
  const currentRoomCustom = roomChoices[activeRoomType];
  const activeWallsMap = currentRoomCustom.walls || buildInitialWallsForRoom(activeRoomType, currentRoomCustom.estimatedAreaSqm, paintsCatalog[0], paintsCatalog[1]);
  const activeWallData = activeWallsMap[selectedWallPosition];

  // Recalculate room total cost helper
  const calculateRoomCost = (custom: RoomCustomization): number => {
    if (custom.isWallByWallMode && custom.walls) {
      return Object.values(custom.walls).reduce(
        (sum, w) => sum + w.estimatedAreaSqm * w.pricePerSqm,
        0
      );
    }
    return custom.estimatedAreaSqm * custom.pricePerSqm;
  };

  // Toggle Mode (Unified vs Wall-by-Wall)
  const handleToggleWallByWallMode = (isWallMode: boolean) => {
    setRoomChoices((prev) => {
      const room = prev[activeRoomType];
      const updated = {
        ...room,
        isWallByWallMode: isWallMode,
      };
      updated.totalRoomCost = calculateRoomCost(updated);
      return {
        ...prev,
        [activeRoomType]: updated,
      };
    });
  };

  // Handle Paint Category Selection (Global or per wall)
  const handleSelectPaintCategory = (paintOpt: PaintTypeOption) => {
    const firstSwatch = paintOpt.swatches[0];

    setRoomChoices((prev) => {
      const room = prev[activeRoomType];

      if (room.isWallByWallMode && room.walls) {
        // Update ONLY the selected wall
        const updatedWalls = {
          ...room.walls,
          [selectedWallPosition]: {
            ...room.walls[selectedWallPosition],
            paintCategory: paintOpt.category,
            paintCategoryNameAr: paintOpt.nameAr,
            colorNameAr: firstSwatch?.nameAr || 'لون عادي',
            colorHex: firstSwatch?.hex || '#ffffff',
            pricePerSqm: paintOpt.pricePerSqm,
          },
        };
        const updatedRoom = {
          ...room,
          walls: updatedWalls,
        };
        updatedRoom.totalRoomCost = calculateRoomCost(updatedRoom);
        return { ...prev, [activeRoomType]: updatedRoom };
      } else {
        // Unified Mode: Update all walls & global state
        const updatedRoom = {
          ...room,
          paintCategory: paintOpt.category,
          paintCategoryNameAr: paintOpt.nameAr,
          colorNameAr: firstSwatch?.nameAr || 'لون عادي',
          colorHex: firstSwatch?.hex || '#ffffff',
          pricePerSqm: paintOpt.pricePerSqm,
        };
        updatedRoom.totalRoomCost = calculateRoomCost(updatedRoom);
        return { ...prev, [activeRoomType]: updatedRoom };
      }
    });
  };

  // Handle Color Swatch Selection (Global or per wall)
  const handleSelectColorSwatch = (swatch: ColorSwatch) => {
    setRoomChoices((prev) => {
      const room = prev[activeRoomType];

      if (room.isWallByWallMode && room.walls) {
        const updatedWalls = {
          ...room.walls,
          [selectedWallPosition]: {
            ...room.walls[selectedWallPosition],
            colorNameAr: swatch.nameAr,
            colorHex: swatch.hex,
          },
        };
        return {
          ...prev,
          [activeRoomType]: { ...room, walls: updatedWalls },
        };
      } else {
        return {
          ...prev,
          [activeRoomType]: {
            ...room,
            colorNameAr: swatch.nameAr,
            colorHex: swatch.hex,
          },
        };
      }
    });
  };

  // Handle Custom Hex / Color Wheel Picker Selection
  const handleSelectCustomHexColor = (hex: string, customNameAr?: string) => {
    const name = customNameAr || `مخصص (${hex.toUpperCase()})`;
    setRoomChoices((prev) => {
      const room = prev[activeRoomType];

      if (room.isWallByWallMode && room.walls) {
        const updatedWalls = {
          ...room.walls,
          [selectedWallPosition]: {
            ...room.walls[selectedWallPosition],
            colorNameAr: name,
            colorHex: hex,
          },
        };
        return {
          ...prev,
          [activeRoomType]: { ...room, walls: updatedWalls },
        };
      } else {
        return {
          ...prev,
          [activeRoomType]: {
            ...room,
            colorNameAr: name,
            colorHex: hex,
          },
        };
      }
    });
  };

  // Brightness / Shade adjust helper
  const adjustHexBrightness = (hex: string, percent: number): string => {
    let num = parseInt(hex.replace('#', ''), 16);
    if (isNaN(num)) return hex;
    let r = (num >> 16) + Math.round(255 * (percent / 100));
    let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
    let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const handleAdjustColorLightness = (deltaPercent: number) => {
    const currentHex = currentRoomCustom.isWallByWallMode ? activeWallData.colorHex : currentRoomCustom.colorHex;
    const newHex = adjustHexBrightness(currentHex, deltaPercent);
    handleSelectCustomHexColor(newHex, isAr ? 'تدرج مخصص' : 'Nuance Personnalisée');
  };

  const [isExportingImage, setIsExportingImage] = useState(false);

  const handleDownloadApartmentDesignImage = async () => {
    setIsExportingImage(true);
    try {
      const element = document.getElementById('paint-customizer-studio-container');
      if (element) {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
        });
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `apartment-paint-design-${activeApartment?.code || 'custom'}.png`;
        link.click();
      }
    } catch (err) {
      console.error('Error exporting apartment design:', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  // Handle Sheen Level Change
  const handleSelectSheenLevel = (sheen: SheenLevel) => {
    if (!currentRoomCustom.isWallByWallMode || !currentRoomCustom.walls) return;
    setRoomChoices((prev) => {
      const room = prev[activeRoomType];
      if (!room.walls) return prev;
      const updatedWalls = {
        ...room.walls,
        [selectedWallPosition]: {
          ...room.walls[selectedWallPosition],
          sheenLevel: sheen,
        },
      };
      return {
        ...prev,
        [activeRoomType]: { ...room, walls: updatedWalls },
      };
    });
  };

  // Designer Color Scheme Presets
  const applyDesignerPreset = (presetKey: 'EMERALD_ROYAL' | 'IVORY_AMBRA' | 'COOL_MINT' | 'DESERT_SAND' | 'ARCOL_FAYROUZ') => {
    const arcol = paintsCatalog.find((p) => p.category === 'ARCOL_LUMIERE_FAYROUZ') || paintsCatalog[0];
    const khayal = paintsCatalog.find((p) => p.category === 'KHAYAL') || paintsCatalog[0];
    const ambra = paintsCatalog.find((p) => p.category === 'AMBRA') || paintsCatalog[1];
    const velvet = paintsCatalog.find((p) => p.category === 'VELVET') || paintsCatalog[3] || paintsCatalog[0];

    setRoomChoices((prev) => {
      const room = prev[activeRoomType];
      if (!room.walls) return prev;

      let newWalls = { ...room.walls };

      if (presetKey === 'ARCOL_FAYROUZ') {
        newWalls.MAIN_ACCENT = {
          ...newWalls.MAIN_ACCENT,
          paintCategory: 'ARCOL_LUMIERE_FAYROUZ',
          paintCategoryNameAr: arcol.nameAr,
          colorNameAr: 'تركواز فيروز الخلاب',
          colorHex: '#0d9488',
          pricePerSqm: arcol.pricePerSqm,
          sheenLevel: 'SATIN',
        };
        newWalls.SIDE_LEFT = { ...newWalls.SIDE_LEFT, colorNameAr: 'أزرق فيروز السماوي', colorHex: '#38bdf8', sheenLevel: 'SATIN' };
        newWalls.SIDE_RIGHT = { ...newWalls.SIDE_RIGHT, colorNameAr: 'نعناعي منعش فيروز', colorHex: '#a7f3d0', sheenLevel: 'SATIN' };
        newWalls.BACK_WINDOW = { ...newWalls.BACK_WINDOW, colorNameAr: 'رمادي لؤلؤي أركول', colorHex: '#e2e8f0', sheenLevel: 'SATIN' };
        newWalls.CEILING = { ...newWalls.CEILING, colorNameAr: 'أبيض فيروز الناصع', colorHex: '#ffffff', sheenLevel: 'MATT' };
      } else if (presetKey === 'EMERALD_ROYAL') {
        newWalls.MAIN_ACCENT = {
          ...newWalls.MAIN_ACCENT,
          paintCategory: 'KHAYAL',
          paintCategoryNameAr: khayal.nameAr,
          colorNameAr: 'أخضر بارد زمردي',
          colorHex: '#0d5c52',
          pricePerSqm: khayal.pricePerSqm,
          sheenLevel: 'METALLIC',
        };
        newWalls.SIDE_LEFT = { ...newWalls.SIDE_LEFT, colorNameAr: 'أبيض لؤلؤي', colorHex: '#f8fafc', sheenLevel: 'SATIN' };
        newWalls.SIDE_RIGHT = { ...newWalls.SIDE_RIGHT, colorNameAr: 'أبيض لؤلؤي', colorHex: '#f8fafc', sheenLevel: 'SATIN' };
        newWalls.BACK_WINDOW = { ...newWalls.BACK_WINDOW, colorNameAr: 'نعناعي هادئ', colorHex: '#a7f3d0', sheenLevel: 'SATIN' };
        newWalls.CEILING = { ...newWalls.CEILING, colorNameAr: 'أبيض نصوع ناصع', colorHex: '#ffffff', sheenLevel: 'MATT' };
      } else if (presetKey === 'IVORY_AMBRA') {
        newWalls.MAIN_ACCENT = {
          ...newWalls.MAIN_ACCENT,
          paintCategory: 'AMBRA',
          paintCategoryNameAr: ambra.nameAr,
          colorNameAr: 'أبيض كريمي عالي اللمعان',
          colorHex: '#fafaf9',
          pricePerSqm: ambra.pricePerSqm,
          sheenLevel: 'HIGH_GLOSS',
        };
        newWalls.SIDE_LEFT = { ...newWalls.SIDE_LEFT, colorNameAr: 'بيج الملكي R+2', colorHex: '#fef3c7', sheenLevel: 'SATIN' };
        newWalls.SIDE_RIGHT = { ...newWalls.SIDE_RIGHT, colorNameAr: 'بيج الملكي R+2', colorHex: '#fef3c7', sheenLevel: 'SATIN' };
        newWalls.BACK_WINDOW = { ...newWalls.BACK_WINDOW, colorNameAr: 'رمادي رخامي حديث', colorHex: '#cbd5e1', sheenLevel: 'SATIN' };
        newWalls.CEILING = { ...newWalls.CEILING, colorNameAr: 'عاجي حليبي', colorHex: '#fffbeb', sheenLevel: 'MATT' };
      } else if (presetKey === 'COOL_MINT') {
        newWalls.MAIN_ACCENT = {
          ...newWalls.MAIN_ACCENT,
          paintCategory: 'VELVET',
          paintCategoryNameAr: velvet.nameAr,
          colorNameAr: 'أخضر زيتوني بارد',
          colorHex: '#2d6a4f',
          pricePerSqm: velvet.pricePerSqm,
          sheenLevel: 'VELVET',
        };
        newWalls.SIDE_LEFT = { ...newWalls.SIDE_LEFT, colorNameAr: 'نعناعي هادئ', colorHex: '#a7f3d0', sheenLevel: 'SATIN' };
        newWalls.SIDE_RIGHT = { ...newWalls.SIDE_RIGHT, colorNameAr: 'نعناعي هادئ', colorHex: '#a7f3d0', sheenLevel: 'SATIN' };
        newWalls.BACK_WINDOW = { ...newWalls.BACK_WINDOW, colorNameAr: 'رمادي ثلجي', colorHex: '#e2e8f0', sheenLevel: 'SATIN' };
        newWalls.CEILING = { ...newWalls.CEILING, colorNameAr: 'أبيض نصوع ناصع', colorHex: '#ffffff', sheenLevel: 'MATT' };
      } else if (presetKey === 'DESERT_SAND') {
        newWalls.MAIN_ACCENT = {
          ...newWalls.MAIN_ACCENT,
          paintCategory: 'KHAYAL',
          paintCategoryNameAr: khayal.nameAr,
          colorNameAr: 'عاجي ذهبي ناعم',
          colorHex: '#fef3c7',
          pricePerSqm: khayal.pricePerSqm,
          sheenLevel: 'METALLIC',
        };
        newWalls.SIDE_LEFT = { ...newWalls.SIDE_LEFT, colorNameAr: 'رمادي دافئ', colorHex: '#94a3b8', sheenLevel: 'SATIN' };
        newWalls.SIDE_RIGHT = { ...newWalls.SIDE_RIGHT, colorNameAr: 'رمادي دافئ', colorHex: '#94a3b8', sheenLevel: 'SATIN' };
        newWalls.BACK_WINDOW = { ...newWalls.BACK_WINDOW, colorNameAr: 'عاجي حليبي', colorHex: '#fffbeb', sheenLevel: 'SATIN' };
        newWalls.CEILING = { ...newWalls.CEILING, colorNameAr: 'أبيض نصوع ناصع', colorHex: '#ffffff', sheenLevel: 'MATT' };
      }

      const updatedRoom = {
        ...room,
        walls: newWalls,
      };
      updatedRoom.totalRoomCost = calculateRoomCost(updatedRoom);

      return {
        ...prev,
        [activeRoomType]: updatedRoom,
      };
    });
  };

  // Grand Total Calculation
  const roomCustomizationsList = Object.values(roomChoices) as RoomCustomization[];
  const totalCustomizationCost = roomCustomizationsList.reduce(
    (sum, item) => sum + item.totalRoomCost,
    0
  );

  const apartmentBasePrice = activeApartment ? activeApartment.price : 850000;
  const grandTotal = apartmentBasePrice + totalCustomizationCost;

  // Submit Order to Admin
  const handleSendCustomizationToAdmin = () => {
    setSubmissionSuccessMsg(null);

    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    if (!activeApartment) {
      alert(isAr ? 'يرجى اختيار الشقة المراد تخصيص صباغتها أولاً.' : 'Veuillez sélectionner un appartement.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = submitOrder({
        userId: currentUser.id,
        userFullName: currentUser.fullName,
        userCin: currentUser.cin,
        userPhone: currentUser.phone,
        userEmail: currentUser.email,
        userAddress: currentUser.address,
        apartmentId: activeApartment.id,
        apartmentCode: activeApartment.code,
        apartmentTitle: activeApartment.title,
        floor: activeApartment.floor,
        floorNameAr: activeApartment.floorNameAr,
        roomCustomizations: Object.values(roomChoices),
        totalApartmentPrice: activeApartment.price,
        totalCustomizationPrice: totalCustomizationCost,
        grandTotal: grandTotal,
      });

      setIsSubmitting(false);
      setSubmissionSuccessMsg(
        isAr
          ? `تم تسجيل وإرسال طلب التخصيص بنجاح إلى الإدارة تحت رقم [${order.id}]. يمكنك متابعة حالة الطلب في صفحة طلباتك.`
          : `Votre commande de personnalisation [${order.id}] a été transmise avec succès à l'administration.`
      );
    }, 1000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const currentPaintCat = currentRoomCustom.isWallByWallMode
    ? activeWallData.paintCategory
    : currentRoomCustom.paintCategory;

  return (
    <div id="paint-customizer-studio-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 bg-slate-50/50 rounded-3xl">
      {/* Auth Gate Warning Banner for Guest Visitors */}
      {!currentUser && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 dir-rtl text-slate-800 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold shrink-0 mt-0.5">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-amber-950">
                ميزة تخصيص الصباغة مخصصة للزبناء المسجلين فقط
              </h3>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                يمكنك معاينة استوديو الألوان، ولكن لتأكيد وحفظ شقتك وإرسال خيارات الدهانات إلى الإدارة، يتوجب عليك فتح حساب زبون أو تسجيل الدخول ببطاقتك الوطنية.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAuthModal}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>تسجيل الدخول / فتح ملف زبون</span>
          </button>
        </div>
      )}
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isAr ? 'مكتبة دهانات خيال والعنبرة والستوكو الاحترافية R+2' : 'Nuancier Peintures Haute Finition R+2'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isAr ? 'استوديو تخصيص صباغة ودهانات الغرف (حائط بحائط)' : 'Studio Sur-Mesure Peinture de Murs'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            {isAr
              ? 'حدد نوع الفينيسيون واللون لكل جدار في الغرفة (الحائط الرئيسي، الجوانب، حائط النافذة، والسقف) مع معاينة تفاعلية ثلاثية الأبعاد لحفظ الطلب وإرساله للآدمن.'
              : 'Choisissez le type de peinture et la couleur pour chaque mur séparément (Mur principal accent, côtés, plafond) avec simulation interactive en temps réel.'}
          </p>
        </div>

        {/* Selected Apartment Picker */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-emerald-500/40 min-w-[260px] space-y-2">
          <label className="block text-xs font-bold text-emerald-300">
            {isAr ? 'الشقة المحددة للتخصيص:' : 'Appartement à personnaliser:'}
          </label>
          <select
            value={activeApartment?.id || ''}
            onChange={(e) => {
              const apt = apartments.find((a) => a.id === e.target.value) || null;
              setActiveApartment(apt);
              setSelectedApartmentForCustomization(apt);
            }}
            className="w-full bg-emerald-950 text-white border border-emerald-700 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {apartments.map((apt) => (
              <option key={apt.id} value={apt.id}>
                {apt.code} - {apt.title} ({apt.price.toLocaleString()} {siteSettings.currencySymbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submission Status Alert */}
      {submissionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 rounded-2xl text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <span>{submissionSuccessMsg}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('MY_ORDERS')}
              className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer"
            >
              {isAr ? 'عرض طلباتي والتتبع' : 'Voir Mes Commandes'}
            </button>
            <button
              onClick={handlePrintReport}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'طباعة التقرير' : 'Imprimer'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Room Tabs, Mode Switcher, Paint Catalog, Swatches, Sheen & Presets */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-xl border border-emerald-100 space-y-6">
          {/* 1. Room Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? '1. اختر الغرفة المراد تحديد دهانات جدرانها:' : '1. Choisissez la pièce:'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ROOM_DEFINITIONS.map((room) => {
                const isActive = activeRoomType === room.type;
                const choices = roomChoices[room.type];
                return (
                  <button
                    key={room.type}
                    onClick={() => setActiveRoomType(room.type)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-md font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{isAr ? room.nameAr : room.nameFr}</div>
                    <div className="text-[10px] opacity-80 mt-1 line-clamp-1">
                      {choices?.isWallByWallMode
                        ? isAr
                          ? 'تخصيص جدار بحائط'
                          : 'Mode Sur-Mesure'
                        : choices?.paintCategoryNameAr.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Customization Mode Switcher (Unified vs Wall-by-Wall) */}
          <div className="p-3.5 bg-slate-900 rounded-2xl text-white flex items-center justify-between gap-3 border border-slate-800">
            <div>
              <span className="font-extrabold text-xs text-amber-300 block">
                {isAr ? 'وضع التخصيص للجدران:' : 'Mode de Peinture:'}
              </span>
              <span className="text-[11px] text-slate-300 block">
                {currentRoomCustom.isWallByWallMode
                  ? isAr
                    ? 'وضع احترافي: يمكنك تلوين كل جدار بشكل مستقل'
                    : 'Sur-mesure: Peindre chaque mur séparément'
                  : isAr
                  ? 'وضع سريع: تطبيق طلاء موحد على كل الغرفة'
                  : 'Général: Couleur uniforme sur toute la pièce'}
              </span>
            </div>

            <div className="flex bg-slate-800 p-1 rounded-xl gap-1 shrink-0">
              <button
                onClick={() => handleToggleWallByWallMode(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !currentRoomCustom.isWallByWallMode
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'موحد' : 'Uniforme'}
              </button>
              <button
                onClick={() => handleToggleWallByWallMode(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentRoomCustom.isWallByWallMode
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'حائط بحائط' : 'Mur par Mur'}
              </button>
            </div>
          </div>

          {/* 3. Wall Position Selection (if Wall-by-Wall Mode active) */}
          {currentRoomCustom.isWallByWallMode && (
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
              <label className="block text-xs font-bold text-emerald-950 flex items-center justify-between">
                <span>{isAr ? '2. اختر الحائط المراد دهانه:' : '2. Sélectionnez le mur à peindre:'}</span>
                <span className="text-emerald-700 font-mono text-[11px]">
                  {activeWallData.estimatedAreaSqm} m²
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['MAIN_ACCENT', 'SIDE_LEFT', 'SIDE_RIGHT', 'BACK_WINDOW', 'CEILING'] as WallPosition[]).map(
                  (pos) => {
                    const isSelected = selectedWallPosition === pos;
                    const wallData = activeWallsMap[pos];
                    return (
                      <button
                        key={pos}
                        onClick={() => setSelectedWallPosition(pos)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white border-amber-400 font-extrabold shadow-lg ring-2 ring-amber-400/50'
                            : 'bg-white text-slate-800 border-emerald-200 hover:bg-emerald-100/50'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full mx-auto mb-1 border border-black/20"
                          style={{ backgroundColor: wallData.colorHex }}
                        />
                        <div className="text-[11px] font-bold line-clamp-1">
                          {isAr ? wallData.wallNameAr.split(' ')[0] : wallData.wallNameFr.split(' ')[0]}
                        </div>
                        <div className="text-[9px] text-emerald-600 dark:text-emerald-300 font-mono">
                          {wallData.colorNameAr.split(' ')[0]}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* 4. Designer Curated Color Schemes Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-amber-500" />
                <span>{isAr ? '3. تنسيقات ألوان جاهزة من مهندسي الديكور (1-انقرة):' : '3. Palettes Pré-Conçues Par Décorateurs:'}</span>
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                onClick={() => applyDesignerPreset('ARCOL_FAYROUZ')}
                className="p-2.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-950 transition-all text-xs font-bold text-center cursor-pointer shadow-sm ring-2 ring-sky-300/50"
              >
                <div className="flex justify-center gap-1 mb-1">
                  <span className="w-3 h-3 rounded-full bg-[#0d9488]" />
                  <span className="w-3 h-3 rounded-full bg-[#38bdf8]" />
                  <span className="w-3 h-3 rounded-full bg-[#fde047]" />
                </div>
                <span>{isAr ? 'أركول فيروز 2026' : 'Arcol Fayrouz'}</span>
              </button>

              <button
                onClick={() => applyDesignerPreset('EMERALD_ROYAL')}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-950 transition-all text-xs font-bold text-center cursor-pointer shadow-sm"
              >
                <div className="flex justify-center gap-1 mb-1">
                  <span className="w-3 h-3 rounded-full bg-[#0d5c52]" />
                  <span className="w-3 h-3 rounded-full bg-[#f8fafc]" />
                  <span className="w-3 h-3 rounded-full bg-[#a7f3d0]" />
                </div>
                <span>{isAr ? 'الزمردي الملكي R+2' : 'Émeraude Royal'}</span>
              </button>

              <button
                onClick={() => applyDesignerPreset('IVORY_AMBRA')}
                className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/80 hover:bg-amber-100 text-amber-950 transition-all text-xs font-bold text-center cursor-pointer shadow-sm"
              >
                <div className="flex justify-center gap-1 mb-1">
                  <span className="w-3 h-3 rounded-full bg-[#fafaf9]" />
                  <span className="w-3 h-3 rounded-full bg-[#fef3c7]" />
                  <span className="w-3 h-3 rounded-full bg-[#cbd5e1]" />
                </div>
                <span>{isAr ? 'العنبرة العاجية' : 'Ivoire Ambra'}</span>
              </button>

              <button
                onClick={() => applyDesignerPreset('COOL_MINT')}
                className="p-2.5 rounded-xl border border-teal-200 bg-teal-50/80 hover:bg-teal-100 text-teal-950 transition-all text-xs font-bold text-center cursor-pointer shadow-sm"
              >
                <div className="flex justify-center gap-1 mb-1">
                  <span className="w-3 h-3 rounded-full bg-[#2d6a4f]" />
                  <span className="w-3 h-3 rounded-full bg-[#a7f3d0]" />
                  <span className="w-3 h-3 rounded-full bg-[#e2e8f0]" />
                </div>
                <span>{isAr ? 'النعناعي البارد' : 'Menthe Glacée'}</span>
              </button>

              <button
                onClick={() => applyDesignerPreset('DESERT_SAND')}
                className="p-2.5 rounded-xl border border-orange-200 bg-orange-50/80 hover:bg-orange-100 text-orange-950 transition-all text-xs font-bold text-center cursor-pointer shadow-sm"
              >
                <div className="flex justify-center gap-1 mb-1">
                  <span className="w-3 h-3 rounded-full bg-[#fef3c7]" />
                  <span className="w-3 h-3 rounded-full bg-[#94a3b8]" />
                  <span className="w-3 h-3 rounded-full bg-[#fffbeb]" />
                </div>
                <span>{isAr ? 'الرمال الصحراوية' : 'Sable Chaud'}</span>
              </button>
            </div>
          </div>

          {/* 5. Paint Type Selection (Catalog) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Paintbrush className="w-4 h-4 text-emerald-600" />
                <span>
                  4. اختر نوع دهانات الفينيسيون والمواصفات الهندسية لـ{' '}
                  {currentRoomCustom.isWallByWallMode
                    ? `(${activeWallData.wallNameAr})`
                    : `(${currentRoomCustom.roomNameAr})`}
                  :
                </span>
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paintsCatalog.map((paint) => {
                const isSelected = currentPaintCat === paint.category;
                const estimatedArea = currentRoomCustom.isWallByWallMode ? activeWallData.estimatedAreaSqm : currentRoomCustom.estimatedAreaSqm;
                const coverage = paint.coverageRateSqmPerLiter || 10;
                const coats = paint.recommendedCoats || 2;
                const estimatedLiters = Math.ceil((estimatedArea / coverage) * coats);

                return (
                  <div
                    key={paint.id}
                    onClick={() => handleSelectPaintCategory(paint)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-600 shadow-md ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-xs text-slate-900 leading-tight">
                          {isAr ? paint.nameAr : paint.nameFr}
                        </span>
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-[11px] bg-emerald-800 text-white font-extrabold px-2 py-0.5 rounded-full">
                            {paint.pricePerSqm} DH/m²
                          </span>
                          {paint.pricePerLiter && (
                            <span className="text-[9px] text-emerald-700 font-bold mt-0.5">
                              {paint.pricePerLiter} DH/اللتر
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {isAr ? paint.descriptionAr : paint.nameFr}
                      </p>
                    </div>

                    {/* Engineering Specs Grid */}
                    <div className="grid grid-cols-3 gap-1 bg-slate-50 p-2 rounded-xl text-[10px] text-slate-700 border border-slate-100 font-medium">
                      <div>
                        <span className="block text-slate-400 text-[9px]">{isAr ? 'التغطية:' : 'Couverture:'}</span>
                        <span className="font-bold text-emerald-800">{coverage} m²/L</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 text-[9px]">{isAr ? 'الطبقات:' : 'Couches:'}</span>
                        <span className="font-bold text-slate-900">{coats} couche</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 text-[9px]">{isAr ? 'اللترات التقديرية:' : 'Litrage estimé:'}</span>
                        <span className="font-bold text-amber-700">~{estimatedLiters} L</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-100/60 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-bold text-[10px] bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        {paint.washabilityGrade || paint.badgeText}
                      </span>
                      {isSelected && (
                        <span className="text-emerald-700 font-extrabold flex items-center gap-1 text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {isAr ? 'مختار' : 'Sélectionné'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. Color Swatches Palette & Custom Color Picker */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-600" />
                <span>5. اختر درجة اللون أو حدد لوناً مخصصاً:</span>
              </span>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {isAr ? 'اللون الحالي:' : 'Couleur:'}{' '}
                {currentRoomCustom.isWallByWallMode
                  ? activeWallData.colorNameAr
                  : currentRoomCustom.colorNameAr}
              </span>
            </label>

            {/* Curated Swatches Grid */}
            {(() => {
              const activeCat = currentRoomCustom.isWallByWallMode
                ? activeWallData.paintCategory
                : currentRoomCustom.paintCategory;
              const activePaintOpt = paintsCatalog.find((p) => p.category === activeCat);
              const swatches = activePaintOpt?.swatches || [];

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {swatches.map((swatch) => {
                    const currentHex = currentRoomCustom.isWallByWallMode
                      ? activeWallData.colorHex
                      : currentRoomCustom.colorHex;
                    const isSelected = currentHex.toLowerCase() === swatch.hex.toLowerCase();

                    return (
                      <button
                        key={swatch.id}
                        onClick={() => handleSelectColorSwatch(swatch)}
                        className={`p-2.5 rounded-xl border-2 flex items-center gap-2 transition-all cursor-pointer text-right ${
                          isSelected
                            ? 'bg-slate-900 text-white border-emerald-500 shadow-lg ring-2 ring-emerald-400'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full shadow-inner border border-white/50 shrink-0"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <div className="text-[11px] font-bold line-clamp-1">
                          {isAr ? swatch.nameAr : swatch.nameFr}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            {/* Custom Color Wheel & Hex Picker Bar */}
            <div className="p-3 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl text-white space-y-3 border border-emerald-700/60 shadow-inner">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>{isAr ? 'عجلة الألوان الحرة لمنتقي الألوان المخصص (Custom Color Picker):' : 'Sélecteur de Couleur Personnalisé:'}</span>
                </span>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                  {currentRoomCustom.isWallByWallMode ? activeWallData.colorHex : currentRoomCustom.colorHex}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* HTML Color Input Picker */}
                <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700">
                  <input
                    type="color"
                    value={currentRoomCustom.isWallByWallMode ? activeWallData.colorHex : currentRoomCustom.colorHex}
                    onChange={(e) => handleSelectCustomHexColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    title="عجلة الألوان الحرة"
                  />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {currentRoomCustom.isWallByWallMode ? activeWallData.colorHex : currentRoomCustom.colorHex}
                  </span>
                </div>

                {/* Color Brightness / Gradation Tone Slider Buttons */}
                <div className="flex-1 flex flex-wrap items-center gap-1">
                  <button
                    onClick={() => handleAdjustColorLightness(20)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 text-[10px] font-bold border border-slate-700 cursor-pointer transition-all"
                    title="تدرج ناصع فاتح جداً"
                  >
                    ☀️ {isAr ? 'ناصع +20%' : 'Très Clair'}
                  </button>

                  <button
                    onClick={() => handleAdjustColorLightness(10)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-700 cursor-pointer transition-all"
                    title="تدرج متوسط إيجابي"
                  >
                    ⛅ {isAr ? 'فاتح +10%' : 'Clair'}
                  </button>

                  <button
                    onClick={() => handleAdjustColorLightness(-10)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-bold border border-slate-700 cursor-pointer transition-all"
                    title="تدرج داكن متوسط"
                  >
                    🌙 {isAr ? 'داكن -10%' : 'Foncé'}
                  </button>

                  <button
                    onClick={() => handleAdjustColorLightness(-20)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[10px] font-bold border border-slate-700 cursor-pointer transition-all"
                    title="تدرج داكن عميق"
                  >
                    🌑 {isAr ? 'عميق -20%' : 'Très Foncé'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Sheen & Finishing Level Selector */}
          {currentRoomCustom.isWallByWallMode && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>6. درجة اللمعان والفينيسيون لـ ({activeWallData.wallNameAr}):</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'MATT', ar: 'مات مغسول (Mat)', fr: 'Mat Lavable' },
                  { id: 'SATIN', ar: 'ساتيني مخملي (Satin)', fr: 'Satiné Velouté' },
                  { id: 'HIGH_GLOSS', ar: 'عالي اللمعان (Gloss)', fr: 'Haute Brillance' },
                  { id: 'METALLIC', ar: 'ميتاليك برّاق (Silk)', fr: 'Satiné Métallique' },
                ].map((sheen) => {
                  const isSelected = activeWallData.sheenLevel === sheen.id;
                  return (
                    <button
                      key={sheen.id}
                      onClick={() => handleSelectSheenLevel(sheen.id as SheenLevel)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isAr ? sheen.ar : sheen.fr}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 3D Interactive Room Visualizer & Polygon Painting */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Room Perspective 3D & Polygon Box */}
          <RoomPerspective3D
            roomType={activeRoomType}
            roomName={isAr ? currentRoomCustom.roomNameAr : activeRoomType}
            isWallByWallMode={!!currentRoomCustom.isWallByWallMode}
            selectedWall={selectedWallPosition}
            onSelectWall={(wall) => setSelectedWallPosition(wall)}
            walls={activeWallsMap}
            globalColorHex={currentRoomCustom.colorHex}
            globalPaintCategory={currentRoomCustom.paintCategory}
            globalPaintName={currentRoomCustom.paintCategoryNameAr}
            lightingMode={lightingMode}
            setLightingMode={setLightingMode}
            isAr={isAr}
            roomImage={
              activeApartment?.roomImages?.[activeRoomType] ||
              activeApartment?.galleryImages?.[0] ||
              activeApartment?.mainImage
            }
            allowedWalls={activeApartment?.allowedWallsPerRoom?.[activeRoomType]}
            roomPolygons={activeApartment?.roomPolygons?.[activeRoomType]}
          />

          {/* Wall-by-Wall Breakdown Summary Box */}
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-emerald-100 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>{isAr ? 'جدول الصباغة والتكلفة التفصيلية:' : 'Récapitulatif des Murs:'}</span>
              <span className="text-emerald-700 text-xs font-extrabold">
                {roomCustomizationsList.length} {isAr ? 'غرف' : 'Pièces'}
              </span>
            </h4>

            {/* Active Room Wall-by-Wall Details */}
            {currentRoomCustom.isWallByWallMode && (
              <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-2 border border-slate-800">
                <div className="font-bold text-amber-300 flex items-center justify-between border-b border-slate-800 pb-1">
                  <span>تفاصيل جدران {currentRoomCustom.roomNameAr}:</span>
                  <span className="font-mono text-emerald-400">
                    {currentRoomCustom.totalRoomCost.toLocaleString()} DH
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-200">
                  {(Object.values(activeWallsMap) as SingleWallCustomization[]).map((w) => (
                    <div key={w.wallPosition} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/40 shrink-0"
                          style={{ backgroundColor: w.colorHex }}
                        />
                        <span className="font-semibold">{isAr ? w.wallNameAr : w.wallNameFr}:</span>
                      </div>
                      <div className="text-slate-300">
                        {w.paintCategoryNameAr.split(' ')[0]} ({w.colorNameAr}) • {w.estimatedAreaSqm}m²
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Room List Breakdown */}
            <div className="space-y-2 text-xs max-h-48 overflow-y-auto pr-1">
              {roomCustomizationsList.map((rc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between gap-2 text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-slate-300"
                      style={{ backgroundColor: rc.colorHex }}
                    />
                    <div>
                      <div className="font-bold text-slate-900">{rc.roomNameAr}</div>
                      <div className="text-[10px] text-slate-500">
                        {rc.isWallByWallMode
                          ? isAr
                            ? 'تخصيص احترافي (مُفصل)'
                            : 'Murs sur-mesure'
                          : `${rc.paintCategoryNameAr.split(' ')[0]} - ${rc.colorNameAr}`}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-emerald-800 text-left">
                    {rc.totalRoomCost.toLocaleString()} {siteSettings.currencySymbol}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Box */}
            <div className="p-4 bg-emerald-950 text-white rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-emerald-200">
                <span>{isAr ? `سعر الشقة الأصلي (${activeApartment?.code}):` : `Prix Appartement (${activeApartment?.code}):`}</span>
                <span className="font-bold">
                  {apartmentBasePrice.toLocaleString()} {siteSettings.currencySymbol}
                </span>
              </div>
              <div className="flex justify-between text-emerald-200">
                <span>{isAr ? 'تكلفة تخصيص الدهانات والتجهيز:' : 'Coût Personnalisation Peinture:'}</span>
                <span className="font-bold text-amber-300">
                  +{totalCustomizationCost.toLocaleString()} {siteSettings.currencySymbol}
                </span>
              </div>
              <div className="pt-2 border-t border-emerald-800 flex justify-between text-sm font-black text-white">
                <span>{isAr ? 'المجموع الكلي التقديري:' : 'Montant Total Estimation:'}</span>
                <span className="text-amber-400">
                  {grandTotal.toLocaleString()} {siteSettings.currencySymbol}
                </span>
              </div>
            </div>

            {/* Buyer Credentials Alert */}
            {!currentUser ? (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? 'يرجى أدخال معلوماتك الشخصية أولاً' : 'Identification Client Requise'}</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  {isAr
                    ? 'لتتمكن من إرسال التعديلات تلقائياً للآدمن وحجز الشقة، يرجى ملء بياناتك (الاسم، رقم البطاقة الوطنية CIN، الهاتف، العنوان).'
                    : 'Pour enregistrer vos choix et transmettre la commande à la direction, veuillez renseigner votre nom, CIN et téléphone.'}
                </p>
                <button
                  onClick={onOpenAuthModal}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-all cursor-pointer"
                >
                  {isAr ? 'أدخل بياناتك الآن' : 'S\'identifier maintenant'}
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between text-emerald-900">
                <div>
                  <span className="font-bold block">{currentUser.fullName}</span>
                  <span className="text-[11px] text-emerald-700">
                    CIN: {currentUser.cin} • {currentUser.phone}
                  </span>
                </div>
                <button
                  onClick={onOpenAuthModal}
                  className="text-xs text-emerald-800 underline font-semibold cursor-pointer"
                >
                  {isAr ? 'تغيير' : 'Modifier'}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleSendCustomizationToAdmin}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl font-extrabold text-xs shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-amber-300" />
                )}
                <span>{isAr ? 'إرسال التعديلات تلقائياً للآدمن وتسجيل الطلب' : 'Valider et transmettre la commande à l\'administration'}</span>
              </button>

              <button
                onClick={handleDownloadApartmentDesignImage}
                disabled={isExportingImage}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExportingImage ? (isAr ? 'جاري استخراج صورة الشقة...' : 'Exportation PNG...') : (isAr ? 'تحميل صورة الشقة بالغرفة المخصصة (PNG)' : 'Télécharger l\'Image de l\'Appartement (PNG)')}</span>
              </button>

              <button
                onClick={handlePrintReport}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-600" />
                <span>{isAr ? 'تحميل / طباعة تقرير اختيار الدهانات (PDF)' : 'Imprimer le Cahier des Charges Peintures (PDF)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
