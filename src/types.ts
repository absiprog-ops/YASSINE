export type FloorType = 'GROUND' | 'FLOOR_1' | 'FLOOR_2';

export type ApartmentStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD';

export type PaintCategory = 
  | 'ARCOL_LUMIERE_FAYROUZ'
  | 'KHAYAL' 
  | 'AMBRA' 
  | 'OIL_PAINT' 
  | 'VELVET' 
  | 'MATT' 
  | 'HIGH_GLOSS' 
  | 'SATIN' 
  | 'WASHABLE_SATIN' 
  | 'ANTI_HUMIDITY' 
  | 'STUCCO_MARMI'
  | 'METALLIC'
  | 'VELVET_SILK';

export type RoomType = 'SALON' | 'LIVING_ROOM' | 'MASTER_BEDROOM' | 'KIDS_BEDROOM' | 'KITCHEN' | 'HALL';

export interface ColorSwatch {
  id: string;
  nameAr: string;
  nameFr: string;
  hex: string;
  texturePattern?: string; // CSS radial/linear gradient or texture preview
}

export interface PaintTypeOption {
  id: string;
  category: PaintCategory;
  nameAr: string;
  nameFr: string;
  descriptionAr: string;
  pricePerLiter: number; // in local currency (DH/Liter)
  pricePerSqm: number; // in local currency (DH/m²)
  coverageRateSqmPerLiter: number; // e.g. 10 m²/L
  recommendedCoats: number; // e.g. 2 layers
  dryingTimeHours: number; // e.g. 4 hours
  washabilityGrade: string; // e.g. "قابل للغسيل 100%"
  antiHumidityWarrantyYears: number; // e.g. 5 or 10 years
  badgeText: string;
  swatches: ColorSwatch[];
  textureCss: string; // inline CSS texture effect preview
  recommendedRooms: (RoomType | WallPosition | string)[];
}

export interface Point2D {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface RoomWallPolygon {
  id: string;
  wallPosition: WallPosition;
  labelAr: string;
  labelFr: string;
  points: Point2D[];
}

export interface Apartment {
  id: string;
  code: string; // e.g., APT-RDC-01, APT-F1-02
  title: string;
  floor: FloorType;
  floorNameAr: string;
  status: ApartmentStatus;
  areaSqm: number; // e.g., 92 m²
  bedroomsCount: number;
  bathroomsCount: number;
  hasGarden?: boolean; // RDC Ground floor private garden
  gardenAreaSqm?: number;
  hasBalcony?: boolean;
  hasTerrace?: boolean; // 2nd Floor private roof/terrace
  terraceAreaSqm?: number;
  price: number;
  facadeOrientation: string; // e.g., واجهة أفقية مشمسة (Sud-Est)
  mainImage: string;
  galleryImages: string[];
  floorPlanImage: string;
  descriptionAr: string;
  featuresList: string[];
  roomImages?: Partial<Record<RoomType, string>>;
  allowedWallsPerRoom?: Partial<Record<RoomType, WallPosition[]>>;
  roomPolygons?: Partial<Record<RoomType, RoomWallPolygon[]>>;
}

export interface UserProfile {
  id: string;
  fullName: string;
  cin: string; // Moroccan ID format (1 or 2 letters + 5 or 6 digits)
  address: string;
  phone: string;
  email: string;
  role?: 'CLIENT' | 'ADMIN';
  createdAt: string;
}

export type WallPosition = 
  | 'MAIN_ACCENT' 
  | 'SIDE_LEFT' 
  | 'SIDE_RIGHT' 
  | 'BACK_WINDOW' 
  | 'CEILING' 
  | 'ARCHES_CORNICE' 
  | 'DOORS_FRAMES';

export type SheenLevel = 'MATT' | 'SATIN' | 'HIGH_GLOSS' | 'METALLIC' | 'VELVET';

export interface SingleWallCustomization {
  wallPosition: WallPosition;
  wallNameAr: string;
  wallNameFr: string;
  paintCategory: PaintCategory;
  paintCategoryNameAr: string;
  colorNameAr: string;
  colorHex: string;
  pricePerSqm: number;
  estimatedAreaSqm: number;
  sheenLevel: SheenLevel;
  notes?: string;
}

export interface RoomCustomization {
  roomType: RoomType;
  roomNameAr: string;
  paintCategory: PaintCategory;
  paintCategoryNameAr: string;
  colorNameAr: string;
  colorHex: string;
  pricePerSqm: number;
  estimatedAreaSqm: number;
  totalRoomCost: number;
  notes?: string;
  isWallByWallMode?: boolean;
  walls?: Record<WallPosition, SingleWallCustomization>;
}

export type OrderStatus = 'PENDING' | 'REVIEWED' | 'APPROVED' | 'CONTACTED' | 'REJECTED';

export interface ClientOrder {
  id: string;
  userId: string;
  userFullName: string;
  userCin: string;
  userPhone: string;
  userEmail: string;
  userAddress: string;
  apartmentId: string;
  apartmentCode: string;
  apartmentTitle: string;
  floor: FloorType;
  floorNameAr: string;
  roomCustomizations: RoomCustomization[];
  totalApartmentPrice: number;
  totalCustomizationPrice: number;
  grandTotal: number;
  status: OrderStatus;
  submittedAt: string;
  adminNotes?: string;
}

export interface ThemeConfig {
  primaryGreen: string; // Main accent e.g. #0f766e
  secondaryGreen: string; // Bright green e.g. #14b8a6
  sageLightBg: string; // Background tint e.g. #f0fdf4
  darkEmeraldHeader: string; // Deep green header #042f2e
  whiteBg: string; // #ffffff
  accentGold: string; // Warm gold highlight #d97706
  borderRadiusPx: number; // Default border radius e.g. 12
}

export interface SiteSettings {
  siteTitle: string;
  siteSubtitle: string;
  siteLogo?: string;
  contactPhone: string;
  whatsappNumber: string;
  emailAddress: string;
  addressText: string;
  currencySymbol: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  residenceFeaturesTitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  facadeTitle: string;
  facadeSubtitle: string;
  paintStudioTitle: string;
  paintStudioSubtitle: string;
  footerDesc: string;
  aiAdvisorTitle: string;
  aiAdvisorSubtitle: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  linkedinUrl?: string;
  websiteShareUrl?: string;
  theme: ThemeConfig;
}

export type PartnerSponsorCategory = 'ELECTRICITY' | 'PAINT' | 'PLUMBING_BUILD' | 'HARDWARE_OTHER';

export interface PartnerSponsor {
  id: string;
  name: string;
  category: PartnerSponsorCategory;
  categoryLabelAr: string;
  logoUrl?: string;
  badgeTextAr?: string;
  descriptionAr: string;
  websiteUrl?: string;
  phoneContact?: string;
  isFeatured: boolean;
  isActive: boolean;
}

export type ServiceReviewCategory = 'FINISHING' | 'BUILDING_QUALITY' | 'CUSTOMIZATION' | 'CUSTOMER_SERVICE' | 'GENERAL';

export interface ServiceReview {
  id: string;
  userName: string;
  userRoleOrApt?: string;
  rating: number; // 1 to 5
  serviceCategory: ServiceReviewCategory;
  comment: string;
  date: string;
  isVerifiedBuyer?: boolean;
  likesCount: number;
  isApproved: boolean;
}
