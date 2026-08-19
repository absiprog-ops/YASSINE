export type Language = 'ar' | 'fr';

export interface Translations {
  // Navigation & Header
  siteName: string;
  home: string;
  apartments: string;
  paintCustomizer: string;
  myOrders: string;
  adminMode: string;
  clientArea: string;
  registerClient: string;
  myAccount: string;
  logout: string;
  aiAdvisor: string;
  languageName: string;

  // Hero Section
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  exploreApartments: string;
  openPaintStudio: string;
  groundFloorBadge: string;
  firstFloorBadge: string;
  secondFloorBadge: string;
  residenceFeatures: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;

  // R+2 Facade Stacker
  facadeTitle: string;
  facadeSubtitle: string;
  allFloors: string;
  groundFloorShort: string;
  firstFloorShort: string;
  secondFloorShort: string;
  unitsAvailable: string;
  selectFloorToView: string;

  // Apartment Card & Modal
  viewDetails: string;
  customizePaintsBtn: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  price: string;
  currency: string;
  statusAvailable: string;
  statusReserved: string;
  statusSold: string;
  facadeSun: string;
  features: string;
  floorPlan: string;
  gallery: string;
  bookAndCustomize: string;

  // Paint Customizer
  paintStudioTitle: string;
  paintStudioSubtitle: string;
  step1SelectApartment: string;
  step2SelectRoom: string;
  step3SelectPaintType: string;
  step4SelectColor: string;
  step5ReviewAndSubmit: string;
  freeFinishingOffer: string;
  estimatedFinishingCost: string;
  paintKhayalDesc: string;
  paintAmbraDesc: string;
  paintOilDesc: string;
  paintVelvetDesc: string;
  pricePerSqm: string;
  submitCustomizationOrder: string;
  noApartmentSelectedWarning: string;
  selectApartmentFirst: string;
  selectedApartment: string;
  totalApartmentPrice: string;
  totalPaintPrice: string;
  grandTotal: string;

  // Client Orders & Portal
  myOrdersTitle: string;
  myOrdersSubtitle: string;
  noOrdersYet: string;
  orderNumber: string;
  orderDate: string;
  clientInfo: string;
  fullName: string;
  cinNumber: string;
  phone: string;
  email: string;
  address: string;
  orderStatusPending: string;
  orderStatusContacted: string;
  orderStatusApproved: string;
  orderStatusRejected: string;
  customizationDetails: string;

  // Auth Modal
  registerTitle: string;
  registerSubtitle: string;
  saveInformation: string;
  confirmIdentity: string;

  // Admin Dashboard
  adminTitle: string;
  adminSubtitle: string;
  ordersTab: string;
  settingsTab: string;
  apartmentsTab: string;
  paintsTab: string;
  saveSettings: string;
  addApartment: string;
  addNewApartment: string;
  saveApartment: string;
  cancel: string;
  delete: string;
  edit: string;

  // AI Assistant
  aiAdvisorTitle: string;
  aiAdvisorSubtitle: string;
  aiGreeting: string;
  aiPlaceholder: string;
  send: string;

  // Footer
  footerDesc: string;
  whatsappContact: string;
  quickLinks: string;
  contactInfo: string;
  allRightsReserved: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    // Navigation & Header
    siteName: 'إقامة Magha immobilier R+2',
    home: 'الرئيسية',
    apartments: 'الشقق المتاحة',
    paintCustomizer: 'استوديو الصباغة',
    myOrders: 'طلباتي وتخصيصاتي',
    adminMode: 'لوحة الآدمن',
    clientArea: 'فضاء الزبون',
    registerClient: 'تسجيل زبون جديد',
    myAccount: 'حسابي',
    logout: 'تسجيل الخروج',
    aiAdvisor: 'مستشار Magha immobilier الذكي',
    languageName: 'العربية',

    // Hero Section
    heroBadge: 'مشروع عقاري عصري فاخر R+2',
    heroTitle: 'شقق فاخرة R+2 بواجهة خضراء باردة وبيضاء راقية',
    heroSubtitle:
      'اكتشف هدوء السكن العالي الجودة مع إمكانية اختيار نوع ولون الصباغة (خيال، عنبرة، صباغة زيتية) مجاناً قبل الاستلام.',
    exploreApartments: 'استكشف شقق الإقامة',
    openPaintStudio: 'احجز شقتك وعش تجربة جديدة في  تحديد شكل الفينيسيو لشقة احلامك',
    groundFloorBadge: 'الطابق الأرضي (RDC)',
    firstFloorBadge: 'الطابق الأول (1er Étage)',
    secondFloorBadge: 'الطابق الثاني (2ème Étage)',
    residenceFeatures: 'مميزات إقامة Magha immobilier R+2',
    feature1Title: 'تشطيب وصباغة حسب الذوق',
    feature1Desc: 'نضمن لك اختيار نوع الدهانات (خيال، عنبرة) ولونها مجاناً لكل غرفة قبل استلام المفاتيح.',
    feature2Title: 'واجهة باردة خضراء وبيضاء',
    feature2Desc: 'تصميم معماري مستدام يعكس الفخامة مع عزل حراري وصوتي ممتازة.',
    feature3Title: 'مساحات متنوعة وحدائق وتراس',
    feature3Desc: 'شقق أرضية بحديقة خاصة، وشقق بالطوابق بتراس وبلكونات مشمسة.',

    // R+2 Facade Stacker
    facadeTitle: 'المخطط الهندسي التفاعلي لإقامة R+2',
    facadeSubtitle: 'اضغط على أي طابق لاستعراض الشقق المتاحة ونسبة الجاهزية',
    allFloors: 'جميع الطوابق (R+2)',
    groundFloorShort: 'الطابق الأرضي RDC',
    firstFloorShort: 'الطابق 1',
    secondFloorShort: 'الطابق 2',
    unitsAvailable: 'شقق متاحة',
    selectFloorToView: 'انقر لتصفية الشقق حسب الطابق',

    // Apartment Card & Modal
    viewDetails: 'عرض التفاصيل والبطاقة',
    customizePaintsBtn: 'تخصيص الصباغة لهذه الشقة',
    bedrooms: 'غرف النوم',
    bathrooms: 'الحمامات',
    area: 'المساحة',
    price: 'السعر',
    currency: 'درهم',
    statusAvailable: 'متاحة للبيع',
    statusReserved: 'محجوزة',
    statusSold: 'مباعة',
    facadeSun: 'التوجيه والواجهة',
    features: 'مميزات الشقة',
    floorPlan: 'التصميم الهندسي',
    gallery: 'معرض الصور',
    bookAndCustomize: 'حجز وتخصيص الصباغة',

    // Paint Customizer
    paintStudioTitle: 'احجز شقتك وعش تجربة جديدة في  تحديد شكل الفينيسيو لشقة احلامك',
    paintStudioSubtitle: 'اختر الشقة ثم صمم نوع ولون الدهانات لكل غرفة على حدة.',
    step1SelectApartment: '1. اختر الشقة',
    step2SelectRoom: '2. اختر الغرفة',
    step3SelectPaintType: '3. اختر نوع الصباغة',
    step4SelectColor: '4. اختر اللون',
    step5ReviewAndSubmit: '5. تأكيد الطلب',
    freeFinishingOffer: 'عرض تشطيب مجاني مع كل شقة',
    estimatedFinishingCost: 'التكلفة التقديرية للتخصيص',
    paintKhayalDesc: 'صباغة ديكورية براقة بلمسة مخملية أنيقة.',
    paintAmbraDesc: 'تأثير الرخام المصقول الفاخر للمداخل والصالونات.',
    paintOilDesc: 'صباغة زيتية مقاومة للرطوبة وسهلة التنظيف.',
    paintVelvetDesc: 'ملمس ناعم كالحرير وألوان دافئة لغرف النوم.',
    pricePerSqm: 'درهم / م²',
    submitCustomizationOrder: 'إرسال طلب التخصيص وإرفاقه بالشقة',
    noApartmentSelectedWarning: 'يرجى اختيار الشقة المراد تخصيص صباغتها أولاً.',
    selectApartmentFirst: 'اختر شقة للبدء',
    selectedApartment: 'الشقة المختارة',
    totalApartmentPrice: 'سعر الشقة الأصلي',
    totalPaintPrice: 'تكلفة الصباغة المخصصة',
    grandTotal: 'المجموع الكلي التقديري',

    // Client Orders & Portal
    myOrdersTitle: 'فضاء الزبون والطلبات المسجلة',
    myOrdersSubtitle: 'استعرض تفاصيل الشقق المحجوزة وتفضيلات الصباغة التي اخترتها.',
    noOrdersYet: 'لا توجد طلبات مسجلة باسمك بعد. يمكنك تخصيص شقتك وإرسال الطلب.',
    orderNumber: 'رقم الطلب',
    orderDate: 'تاريخ الطلب',
    clientInfo: 'معلومات الزبون',
    fullName: 'الاسم الكامل',
    cinNumber: 'رقم البطاقة الوطنية (CIN)',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    address: 'العنوان السكني',
    orderStatusPending: 'قيد المراجعة',
    orderStatusContacted: 'تم الاتصال بالزبون',
    orderStatusApproved: 'تم التأكيد والموافقة',
    orderStatusRejected: 'ملغى',
    customizationDetails: 'تفاصيل الصباغة المختارة للغرف',

    // Auth Modal
    registerTitle: 'تسجيل وتوثيق معلومات الزبون',
    registerSubtitle: 'أدخل معلوماتك الشخصية لحفظ طلب الشقة وتأكيد تفضيلات الصباغة.',
    saveInformation: 'حفظ وتأكيد البيانات',
    confirmIdentity: 'التحقق من رقم البطاقة الوطنية CIN',

    // Admin Dashboard
    adminTitle: 'لوحة تحكم إقامة Magha immobilier R+2',
    adminSubtitle: 'إدارة ألوان الواجهة، إعدادات الموقع، الشقق والطلبات.',
    ordersTab: 'الطلبات والتخصيصات',
    settingsTab: 'إعدادات وألوان الموقع',
    apartmentsTab: 'إدارة شقق R+2',
    paintsTab: 'مكتبة الدهانات والأسعار',
    saveSettings: 'حفظ إعدادات الواجهة',
    addApartment: 'إضافة شقة جديد',
    addNewApartment: 'إضافة شقة R+2 جديدة',
    saveApartment: 'حفظ الشقة',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',

    // AI Assistant
    aiAdvisorTitle: 'مستشار Magha immobilier العقاري R+2',
    aiAdvisorSubtitle: 'مساعدك الذكي لاختيار الشقة والدهانات',
    aiGreeting:
      'مرحباً بك! أنا مستشار إقامة Magha immobilier الذكي R+2. كيف يمكنني مساعدتك اليوم؟ يمكنني مساعدتك في اختيار الشقة المناسبة حسب الميزانية وعدد الغرف، أو تقديم نصائح حول دهانات خيال والعنبرة والصباغة الزيتية لكل غرفة.',
    aiPlaceholder: 'اسأل المستشار عن الشقق أو الدهانات (خيال، عنبرة)...',
    send: 'إرسال',

    // Footer
    footerDesc:
      'إقامة عقارية عصرية ذات طوابق R+2 مع توفير مكتبة دهانات حرة (خيال، عنبرة، صباغة زيتية) وتطبيق التعديلات مجاناً قبل تسليم مفاتيح الشقة.',
    whatsappContact: 'تواصل مباشر عبر الواتساب (WhatsApp)',
    quickLinks: 'روابط سريعة',
    contactInfo: 'معلومات الاتصال بالمعرض',
    allRightsReserved: 'جميع الحقوق محفوظة',
  },

  fr: {
    // Navigation & Header
    siteName: 'Résidence Magha immobilier R+2',
    home: 'Accueil',
    apartments: 'Appartements R+2',
    paintCustomizer: 'Studio Peinture',
    myOrders: 'Mes Commandes',
    adminMode: 'Mode Admin',
    clientArea: 'Espace Client',
    registerClient: 'Nouveau Client',
    myAccount: 'Mon Compte',
    logout: 'Déconnexion',
    aiAdvisor: 'Conseiller IA Magha',
    languageName: 'Français',

    // Hero Section
    heroBadge: 'Résidence de Luxe R+2 Moderne',
    heroTitle: 'Appartements R+2 d\'Exception à Façade Vert Frais et Blanc Épuré',
    heroSubtitle:
      'Découvrez la sérénité d\'un cadre de vie haut de gamme avec personnalisation offerte de la peinture (Khayal, Ambra, peinture à l\'huile) avant la remise des clés.',
    exploreApartments: 'Explorer les Appartements',
    openPaintStudio: 'Réserve ton appartement et vis une nouvelle expérience',
    groundFloorBadge: 'Rez-de-Chaussée (RDC)',
    firstFloorBadge: '1er Étage',
    secondFloorBadge: '2ème Étage',
    residenceFeatures: 'Avantages de la Résidence Magha immobilier R+2',
    feature1Title: 'Peinture sur Mesure Offerte',
    feature1Desc: 'Sélectionnez gratuitement le type de finition (Khayal, Ambra) et la couleur de chaque pièce avant la remise des clés.',
    feature2Title: 'Façade Éco-Fraîche Vert & Blanc',
    feature2Desc: 'Architecture contemporaine et durable offrant une isolation thermique et acoustique optimale.',
    feature3Title: 'Jardins Privatifs & Terrasses',
    feature3Desc: 'Appartements en RDC avec jardin privé, et appartements aux étages avec balcons et terrasses ensoleillées.',

    // R+2 Facade Stacker
    facadeTitle: 'Maquette Interactive de la Résidence R+2',
    facadeSubtitle: 'Cliquez sur un étage pour filtrer les appartements disponibles et suivre l\'avancement.',
    allFloors: 'Tous les Étages (R+2)',
    groundFloorShort: 'Étage RDC',
    firstFloorShort: '1er Étage',
    secondFloorShort: '2ème Étage',
    unitsAvailable: 'unités disponibles',
    selectFloorToView: 'Cliquer pour filtrer par étage',

    // Apartment Card & Modal
    viewDetails: 'Fiche Détaillée',
    customizePaintsBtn: 'Personnaliser la Peinture',
    bedrooms: 'Chambres',
    bathrooms: 'Salles de bain',
    area: 'Surface',
    price: 'Prix',
    currency: 'DH',
    statusAvailable: 'Disponible',
    statusReserved: 'Réservé',
    statusSold: 'Vendu',
    facadeSun: 'Orientation & Façade',
    features: 'Équipements & Prestations',
    floorPlan: 'Plan de Masse',
    gallery: 'Galerie Photos',
    bookAndCustomize: 'Réserver & Personnaliser',

    // Paint Customizer
    paintStudioTitle: 'Studio de Personnalisation des Peintures & Finitions',
    paintStudioSubtitle: 'Sélectionnez votre appartement puis choisissez la finition et la couleur idéale pour chaque pièce.',
    step1SelectApartment: '1. Choisir l\'Appartement',
    step2SelectRoom: '2. Choisir la Pièce',
    step3SelectPaintType: '3. Type de Peinture',
    step4SelectColor: '4. Choisir la Teinte',
    step5ReviewAndSubmit: '5. Valider la Sélection',
    freeFinishingOffer: 'Offre de Finition Gratuite Incluses',
    estimatedFinishingCost: 'Estimation des Travaux de Finition',
    paintKhayalDesc: 'Finition décorative effet velours avec de délicats reflets nacrés.',
    paintAmbraDesc: 'Effet marbre poli somptueux idéal pour les salons et entrées.',
    paintOilDesc: 'Peinture à l\'huile satinée, lavable et résistante à l\'humidité.',
    paintVelvetDesc: 'Texture soyeuse aux tons chaleureux pour les chambres.',
    pricePerSqm: 'DH / m²',
    submitCustomizationOrder: 'Valider et Attribuer à la Réservation',
    noApartmentSelectedWarning: 'Veuillez sélectionner un appartement avant de personnaliser la peinture.',
    selectApartmentFirst: 'Sélectionner un Appartement',
    selectedApartment: 'Appartement Sélectionné',
    totalApartmentPrice: 'Prix de l\'Appartement',
    totalPaintPrice: 'Coût des Finitions Peinture',
    grandTotal: 'Montant Total Estimé',

    // Client Orders & Portal
    myOrdersTitle: 'Espace Client & Commandes Enregistrées',
    myOrdersSubtitle: 'Consultez les détails de votre réservation et la fiche de personnalisation de vos peintures.',
    noOrdersYet: 'Aucune commande enregistrée à votre nom pour le moment.',
    orderNumber: 'N° de Commande',
    orderDate: 'Date',
    clientInfo: 'Informations Client',
    fullName: 'Nom & Prénom',
    cinNumber: 'N° CIN (Carte d\'Identité)',
    phone: 'Téléphone',
    email: 'Adresse Email',
    address: 'Adresse de Résidence',
    orderStatusPending: 'En cours d\'examen',
    orderStatusContacted: 'Client Contacté',
    orderStatusApproved: 'Confirmé & Approuvé',
    orderStatusRejected: 'Annulé',
    customizationDetails: 'Détail des Peintures Choisies par Pièce',

    // Auth Modal
    registerTitle: 'Identification & Fiche Client',
    registerSubtitle: 'Renseignez vos coordonnées pour enregistrer votre réservation et vos choix de décoration.',
    saveInformation: 'Enregistrer mes Coordonnées',
    confirmIdentity: 'Vérification de la Carte CIN',

    // Admin Dashboard
    adminTitle: 'Tableau de Bord Résidence Magha immobilier R+2',
    adminSubtitle: 'Gestion globale des appartements, thèmes de couleur, tarifs et commandes clients.',
    ordersTab: 'Commandes & Finitions',
    settingsTab: 'Couleurs & Configuration',
    apartmentsTab: 'Gestion Appartements R+2',
    paintsTab: 'Catalogue Peintures & Tarifs',
    saveSettings: 'Sauvegarder la Configuration',
    addApartment: 'Ajouter un Appartement',
    addNewApartment: 'Créer un Nouvel Appartement R+2',
    saveApartment: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',

    // AI Assistant
    aiAdvisorTitle: 'Conseiller IA Magha immobilier R+2',
    aiAdvisorSubtitle: 'Votre assistant virtuel pour le choix d\'appartement et de décoration',
    aiGreeting:
      'Bonjour! Je suis le conseiller virtuel de la Résidence Magha immobilier R+2. Comment puis-je vous aider aujourd\'hui? Je peux vous guider dans le choix de votre appartement ou vous conseiller sur nos peintures décoratives (Khayal, Ambra, etc.).',
    aiPlaceholder: 'Posez votre question sur les appartements ou les peintures...',
    send: 'Envoyer',

    // Footer
    footerDesc:
      'Résidence immobilière R+2 d\'exception avec service exclusif de personnalisation des peintures offert avant la livraison.',
    whatsappContact: 'Contact Direct via WhatsApp',
    quickLinks: 'Liens Rapides',
    contactInfo: 'Coordonnées du Showroom',
    allRightsReserved: 'Tous droits réservés',
  },
};
