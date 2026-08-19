import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Apartment,
  PaintTypeOption,
  SiteSettings,
  UserProfile,
  ClientOrder,
  OrderStatus,
  RoomType,
  RoomWallPolygon,
  PartnerSponsor,
  ServiceReview,
} from '../types';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_PAINTS_CATALOG,
  INITIAL_APARTMENTS,
  INITIAL_ORDERS,
  INITIAL_USERS,
  INITIAL_PARTNERS,
  INITIAL_REVIEWS,
} from '../data/initialData';
import { Language, translations, Translations } from '../translations';
import {
  db,
  auth,
  googleProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from '../lib/firebase';
import {
  doc,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebaseError';

export type AppView = 'HOME' | 'APARTMENTS' | 'PAINT_STUDIO' | 'MY_ORDERS' | 'ADMIN';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  t: (key: keyof Translations) => string;
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: SiteSettings) => void;
  apartments: Apartment[];
  addApartment: (apt: Apartment) => void;
  updateApartment: (apt: Apartment) => void;
  deleteApartment: (id: string) => void;
  paintsCatalog: PaintTypeOption[];
  updatePaintCatalog: (catalog: PaintTypeOption[]) => void;
  partners: PartnerSponsor[];
  addPartner: (partner: PartnerSponsor) => void;
  updatePartner: (partner: PartnerSponsor) => void;
  deletePartner: (id: string) => void;
  togglePartnerActive: (id: string) => void;
  reviews: ServiceReview[];
  addReview: (review: ServiceReview) => void;
  likeReview: (id: string) => void;
  deleteReview: (id: string) => void;
  toggleReviewApproval: (id: string) => void;
  currentUser: UserProfile | null;
  registerOrLoginUser: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => UserProfile;
  loginAdmin: (email: string, password: string) => boolean;
  loginWithGoogle: () => Promise<UserProfile | null>;
  logoutUser: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  registeredUsers: UserProfile[];
  addRegisteredUser: (user: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  deleteRegisteredUser: (id: string) => void;
  saveApartmentPolygons: (
    apartmentId: string,
    roomType: RoomType,
    polygons: RoomWallPolygon[],
    roomImageUrl?: string
  ) => void;
  orders: ClientOrder[];
  submitOrder: (order: Omit<ClientOrder, 'id' | 'submittedAt' | 'status'>) => ClientOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus, adminNotes?: string) => void;
  deleteOrder: (orderId: string) => void;
  savedApartmentIds: string[];
  toggleSaveApartment: (id: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedApartmentForCustomization: Apartment | null;
  setSelectedApartmentForCustomization: (apt: Apartment | null) => void;
  selectedApartmentForModal: Apartment | null;
  setSelectedApartmentForModal: (apt: Apartment | null) => void;
  firebaseAuthUser: FirebaseUser | null;
  isFirebaseReady: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseAuthUser, setFirebaseAuthUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseReady, setIsFirebaseReady] = useState<boolean>(false);

  // 0. Language
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('r2_app_language');
    return saved === 'fr' || saved === 'ar' ? saved : 'ar';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const t = (key: keyof Translations): string => {
    return translations[language][key] || translations['ar'][key] || String(key);
  };

  useEffect(() => {
    localStorage.setItem('r2_app_language', language);
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  // 1. Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('r2_site_settings');
    if (!saved) return INITIAL_SITE_SETTINGS;
    try {
      const parsed = JSON.parse(saved);
      parsed.siteLogo = INITIAL_SITE_SETTINGS.siteLogo;
      return parsed;
    } catch {
      return INITIAL_SITE_SETTINGS;
    }
  });

  // 2. Apartments
  const [apartments, setApartments] = useState<Apartment[]>(() => {
    const saved = localStorage.getItem('r2_apartments');
    return saved ? JSON.parse(saved) : INITIAL_APARTMENTS;
  });

  // 3. Paint Catalog
  const [paintsCatalog, setPaintsCatalog] = useState<PaintTypeOption[]>(() => {
    const saved = localStorage.getItem('r2_paints_catalog');
    return saved ? JSON.parse(saved) : INITIAL_PAINTS_CATALOG;
  });

  // 3.5 Partners / Sponsors
  const [partners, setPartners] = useState<PartnerSponsor[]>(() => {
    const saved = localStorage.getItem('r2_partners_sponsors');
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });

  // 3.6 Reviews
  const [reviews, setReviews] = useState<ServiceReview[]>(() => {
    const saved = localStorage.getItem('r2_service_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // 4. Current User
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('r2_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // 5. Orders
  const [orders, setOrders] = useState<ClientOrder[]>(() => {
    const saved = localStorage.getItem('r2_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // 6. Registered Clients Database
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('r2_registered_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // 7. Saved Favorites
  const [savedApartmentIds, setSavedApartmentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('r2_saved_apts');
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation & Modals
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<AppView>('HOME');
  const [selectedApartmentForCustomization, setSelectedApartmentForCustomization] = useState<Apartment | null>(null);
  const [selectedApartmentForModal, setSelectedApartmentForModal] = useState<Apartment | null>(null);

  // Sync settings with CSS variables
  useEffect(() => {
    localStorage.setItem('r2_site_settings', JSON.stringify(siteSettings));
    const root = document.documentElement;
    root.style.setProperty('--primary-green', siteSettings.theme.primaryGreen);
    root.style.setProperty('--secondary-green', siteSettings.theme.secondaryGreen);
    root.style.setProperty('--sage-bg', siteSettings.theme.sageLightBg);
    root.style.setProperty('--dark-emerald', siteSettings.theme.darkEmeraldHeader);
    root.style.setProperty('--accent-gold', siteSettings.theme.accentGold);
    root.style.setProperty('--border-radius', `${siteSettings.theme.borderRadiusPx}px`);
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('r2_apartments', JSON.stringify(apartments));
  }, [apartments]);

  useEffect(() => {
    localStorage.setItem('r2_paints_catalog', JSON.stringify(paintsCatalog));
  }, [paintsCatalog]);

  useEffect(() => {
    localStorage.setItem('r2_partners_sponsors', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem('r2_service_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('r2_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('r2_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('r2_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('r2_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('r2_saved_apts', JSON.stringify(savedApartmentIds));
  }, [savedApartmentIds]);

  // FIREBASE REALTIME LISTENERS & SEEDING
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseAuthUser(user);
      setIsFirebaseReady(true);

      if (user && !currentUser) {
        // Auto populate current user from firebase auth
        const userProfile: UserProfile = {
          id: user.uid,
          fullName: user.displayName || 'زبون مميز',
          cin: 'N/A',
          address: 'المغرب',
          phone: user.phoneNumber || '0600000000',
          email: user.email || 'user@example.com',
          role: (user.email === 'contact@maghaimmobilier.com' || user.email === 'contact@maghaimmobillier.com' || user.email === 'ab.yassine1988@gmail.com') ? 'ADMIN' : 'CLIENT',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setCurrentUser(userProfile);
        if (userProfile.role === 'ADMIN') {
          setIsAdminMode(true);
        }
      }
    });

    // Helper to sanitize asset paths for production
    const sanitizeAssetPath = (path?: string, fallback: string = ''): string => {
      if (!path) return fallback;
      if (path.startsWith('/src/assets/')) {
        return path.replace('/src/assets/', '/assets/');
      }
      return path;
    };

    // 1. Site Settings Listener
    const settingsDocRef = doc(db, 'settings', 'config');
    const unsubSettings = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteSettings;
        const contactPhone = (!data.contactPhone || data.contactPhone === '+212 60 44 04 00') ? '+212 660 44 04 00' : data.contactPhone;
        const whatsappNumber = (!data.whatsappNumber || data.whatsappNumber === '+212 60 44 04 00') ? '+212 660 44 04 00' : data.whatsappNumber;
        const addressText = data.addressText ? data.addressText.replace(/الهادئ[،, ]*/g, '').replace(/Magha immobillier/gi, 'Magha immobilier') : INITIAL_SITE_SETTINGS.addressText;
        setSiteSettings({
          ...INITIAL_SITE_SETTINGS,
          ...data,
          contactPhone,
          whatsappNumber,
          addressText,
          siteLogo: sanitizeAssetPath(data.siteLogo, '/assets/images/magha_logo_1786471125430.jpg'),
          heroImage: sanitizeAssetPath(data.heroImage, '/assets/images/r2_building_facade_1786033110102.jpg'),
        });
      } else {
        setSiteSettings(INITIAL_SITE_SETTINGS);
        // Only seed default site settings if logged in as admin
        const currentEmail = auth.currentUser?.email;
        if (currentEmail === 'ab.yassine1988@gmail.com' || currentEmail === 'contact@maghaimmobilier.com' || currentEmail === 'contact@maghaimmobillier.com') {
          setDoc(settingsDocRef, INITIAL_SITE_SETTINGS).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, 'settings/config')
          );
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/config');
    });

    // 2. Apartments Listener
    const apartmentsColRef = collection(db, 'apartments');
    const unsubApartments = onSnapshot(apartmentsColRef, (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map((d) => {
          const apt = d.data() as Apartment;
          return {
            ...apt,
            mainImage: sanitizeAssetPath(apt.mainImage, '/assets/images/r2_building_facade_1786033110102.jpg'),
            galleryImages: (apt.galleryImages || []).map((img) => sanitizeAssetPath(img)),
          };
        });
        setApartments(loaded);
      } else {
        setApartments(INITIAL_APARTMENTS);
        // Only seed initial apartments if authenticated as admin
        const currentEmail = auth.currentUser?.email;
        if (currentEmail === 'ab.yassine1988@gmail.com' || currentEmail === 'contact@maghaimmobilier.com' || currentEmail === 'contact@maghaimmobillier.com') {
          INITIAL_APARTMENTS.forEach((apt) => {
            setDoc(doc(db, 'apartments', apt.id), apt).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `apartments/${apt.id}`)
            );
          });
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'apartments');
    });

    // 3. Paints Catalog Listener
    const paintsColRef = collection(db, 'paintsCatalog');
    const unsubPaints = onSnapshot(paintsColRef, (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map((d) => d.data() as PaintTypeOption);
        setPaintsCatalog(loaded);
      } else {
        setPaintsCatalog(INITIAL_PAINTS_CATALOG);
        // Only seed paints if authenticated as admin
        const currentEmail = auth.currentUser?.email;
        if (currentEmail === 'ab.yassine1988@gmail.com' || currentEmail === 'contact@maghaimmobilier.com' || currentEmail === 'contact@maghaimmobillier.com') {
          INITIAL_PAINTS_CATALOG.forEach((paint) => {
            setDoc(doc(db, 'paintsCatalog', paint.id), paint).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `paintsCatalog/${paint.id}`)
            );
          });
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'paintsCatalog');
    });

    // 4. Partners Listener
    const partnersColRef = collection(db, 'partners');
    const unsubPartners = onSnapshot(partnersColRef, (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map((d) => d.data() as PartnerSponsor);
        setPartners(loaded);
      } else {
        setPartners(INITIAL_PARTNERS);
        const currentEmail = auth.currentUser?.email;
        if (currentEmail === 'ab.yassine1988@gmail.com' || currentEmail === 'contact@maghaimmobilier.com' || currentEmail === 'contact@maghaimmobillier.com') {
          INITIAL_PARTNERS.forEach((p) => {
            setDoc(doc(db, 'partners', p.id), p).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `partners/${p.id}`)
            );
          });
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'partners');
    });

    // 5. Reviews Listener
    const reviewsColRef = collection(db, 'reviews');
    const unsubReviews = onSnapshot(reviewsColRef, (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map((d) => d.data() as ServiceReview);
        setReviews(loaded);
      } else {
        setReviews(INITIAL_REVIEWS);
        const currentEmail = auth.currentUser?.email;
        if (currentEmail === 'ab.yassine1988@gmail.com' || currentEmail === 'contact@maghaimmobilier.com' || currentEmail === 'contact@maghaimmobillier.com') {
          INITIAL_REVIEWS.forEach((r) => {
            setDoc(doc(db, 'reviews', r.id), r).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `reviews/${r.id}`)
            );
          });
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'reviews');
    });

    // 6. Orders Listener
    const ordersColRef = collection(db, 'orders');
    const unsubOrders = onSnapshot(ordersColRef, (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map((d) => d.data() as ClientOrder);
        setOrders(loaded);
      } else {
        setOrders(INITIAL_ORDERS);
        const currentEmail = auth.currentUser?.email;
        if (currentEmail === 'ab.yassine1988@gmail.com' || currentEmail === 'contact@maghaimmobilier.com' || currentEmail === 'contact@maghaimmobillier.com') {
          INITIAL_ORDERS.forEach((o) => {
            setDoc(doc(db, 'orders', o.id), o).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `orders/${o.id}`)
            );
          });
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'orders');
    });

    // 7. Users Listener
    const usersColRef = collection(db, 'users');
    const unsubUsers = onSnapshot(usersColRef, (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map((d) => d.data() as UserProfile);
        setRegisteredUsers(loaded);
      } else {
        setRegisteredUsers(INITIAL_USERS);
        const currentEmail = auth.currentUser?.email;
        if (currentEmail === 'ab.yassine1988@gmail.com' || currentEmail === 'contact@maghaimmobilier.com' || currentEmail === 'contact@maghaimmobillier.com') {
          INITIAL_USERS.forEach((u) => {
            setDoc(doc(db, 'users', u.id), u).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `users/${u.id}`)
            );
          });
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });

    return () => {
      unsubscribeAuth();
      unsubSettings();
      unsubApartments();
      unsubPaints();
      unsubPartners();
      unsubReviews();
      unsubOrders();
      unsubUsers();
    };
  }, []);

  // Actions
  const updateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    setDoc(doc(db, 'settings', 'config'), newSettings).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, 'settings/config')
    );
  };

  const addApartment = (apt: Apartment) => {
    setApartments((prev) => [apt, ...prev]);
    setDoc(doc(db, 'apartments', apt.id), apt).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, `apartments/${apt.id}`)
    );
  };

  const updateApartment = (updated: Apartment) => {
    setApartments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setDoc(doc(db, 'apartments', updated.id), updated).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, `apartments/${updated.id}`)
    );
  };

  const deleteApartment = (id: string) => {
    setApartments((prev) => prev.filter((a) => a.id !== id));
    deleteDoc(doc(db, 'apartments', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `apartments/${id}`)
    );
  };

  const updatePaintCatalog = (catalog: PaintTypeOption[]) => {
    setPaintsCatalog(catalog);
    catalog.forEach((paint) => {
      setDoc(doc(db, 'paintsCatalog', paint.id), paint).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `paintsCatalog/${paint.id}`)
      );
    });
  };

  const addPartner = (partner: PartnerSponsor) => {
    setPartners((prev) => [partner, ...prev]);
    setDoc(doc(db, 'partners', partner.id), partner).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, `partners/${partner.id}`)
    );
  };

  const updatePartner = (updated: PartnerSponsor) => {
    setPartners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setDoc(doc(db, 'partners', updated.id), updated).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, `partners/${updated.id}`)
    );
  };

  const deletePartner = (id: string) => {
    setPartners((prev) => prev.filter((p) => p.id !== id));
    deleteDoc(doc(db, 'partners', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `partners/${id}`)
    );
  };

  const togglePartnerActive = (id: string) => {
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, isActive: !p.isActive };
          setDoc(doc(db, 'partners', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `partners/${id}`)
          );
          return updated;
        }
        return p;
      })
    );
  };

  const addReview = (newReview: ServiceReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setDoc(doc(db, 'reviews', newReview.id), newReview).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, `reviews/${newReview.id}`)
    );
  };

  const likeReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, likesCount: (r.likesCount || 0) + 1 };
          setDoc(doc(db, 'reviews', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `reviews/${id}`)
          );
          return updated;
        }
        return r;
      })
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    deleteDoc(doc(db, 'reviews', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `reviews/${id}`)
    );
  };

  const toggleReviewApproval = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, isApproved: !r.isApproved };
          setDoc(doc(db, 'reviews', id), updated).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `reviews/${id}`)
          );
          return updated;
        }
        return r;
      })
    );
  };

  const addRegisteredUser = (userData: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const newUser: UserProfile = {
      ...userData,
      id: `usr-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRegisteredUsers((prev) => [newUser, ...prev]);
    setDoc(doc(db, 'users', newUser.id), newUser).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, `users/${newUser.id}`)
    );
  };

  const deleteRegisteredUser = (id: string) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== id));
    deleteDoc(doc(db, 'users', id)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `users/${id}`)
    );
  };

  const saveApartmentPolygons = (
    apartmentId: string,
    roomType: RoomType,
    polygons: RoomWallPolygon[],
    roomImageUrl?: string
  ) => {
    setApartments((prev) =>
      prev.map((apt) => {
        if (apt.id !== apartmentId) return apt;

        const updatedRoomPolygons = {
          ...(apt.roomPolygons || {}),
          [roomType]: polygons,
        };

        const updatedRoomImages = roomImageUrl
          ? { ...(apt.roomImages || {}), [roomType]: roomImageUrl }
          : apt.roomImages;

        const updatedApt = {
          ...apt,
          roomPolygons: updatedRoomPolygons,
          roomImages: updatedRoomImages,
        };

        setDoc(doc(db, 'apartments', apartmentId), updatedApt).catch((err) =>
          handleFirestoreError(err, OperationType.WRITE, `apartments/${apartmentId}`)
        );

        return updatedApt;
      })
    );
  };

  const registerOrLoginUser = (profileData: Omit<UserProfile, 'id' | 'createdAt'>): UserProfile => {
    const user: UserProfile = {
      ...profileData,
      role: profileData.role || 'CLIENT',
      id: currentUser?.id || auth.currentUser?.uid || `usr-${Date.now().toString().slice(-6)}`,
      createdAt: currentUser?.createdAt || new Date().toISOString().split('T')[0],
    };
    setCurrentUser(user);

    setRegisteredUsers((prev) => {
      if (prev.some((u) => u.cin.toLowerCase() === user.cin.toLowerCase())) {
        return prev;
      }
      return [user, ...prev];
    });

    if (auth.currentUser) {
      setDoc(doc(db, 'users', user.id), user).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `users/${user.id}`)
      );
    }

    return user;
  };

  const loginWithGoogle = async (): Promise<UserProfile | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const gUser = result.user;
      const isAdminEmail = gUser.email === 'contact@maghaimmobilier.com' || gUser.email === 'contact@maghaimmobillier.com' || gUser.email === 'ab.yassine1988@gmail.com';

      const userProfile: UserProfile = {
        id: gUser.uid,
        fullName: gUser.displayName || 'زبون Google',
        cin: 'N/A',
        address: 'المغرب',
        phone: gUser.phoneNumber || '0600000000',
        email: gUser.email || '',
        role: isAdminEmail ? 'ADMIN' : 'CLIENT',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setCurrentUser(userProfile);
      if (isAdminEmail) {
        setIsAdminMode(true);
        setActiveView('ADMIN');
      }

      await setDoc(doc(db, 'users', userProfile.id), userProfile).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `users/${userProfile.id}`)
      );

      return userProfile;
    } catch (error) {
      console.error('Google login error:', error);
      return null;
    }
  };

  const loginAdmin = (emailInput: string, passwordInput: string): boolean => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (
      (cleanEmail === 'contact@maghaimmobilier.com' || cleanEmail === 'contact@magha-immobilier-r2.ma' || cleanEmail === 'contact@maghaimmobillier.com' || cleanEmail === 'contact@magha-immobillier-r2.ma' || cleanEmail === 'ab.yassine1988@gmail.com') &&
      cleanPassword === 'Hellobimo@59'
    ) {
      const adminProfile: UserProfile = {
        id: 'admin-001',
        fullName: 'مدير إقامة Magha Immobilier',
        cin: 'ADM01',
        address: 'مقر إقامة Magha R+2',
        phone: siteSettings.contactPhone || '+212 660 44 04 00',
        email: 'contact@maghaimmobilier.com',
        role: 'ADMIN',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCurrentUser(adminProfile);
      setIsAdminMode(true);
      setActiveView('ADMIN');

      if (auth.currentUser) {
        setDoc(doc(db, 'users', adminProfile.id), adminProfile).catch((err) =>
          handleFirestoreError(err, OperationType.WRITE, `users/${adminProfile.id}`)
        );
      }

      return true;
    }
    return false;
  };

  const logoutUser = () => {
    firebaseSignOut(auth).catch((err) => console.error('Sign out error', err));
    setCurrentUser(null);
    setIsAdminMode(false);
    if (activeView === 'ADMIN' || activeView === 'PAINT_STUDIO') {
      setActiveView('HOME');
    }
  };

  const updateUserProfile = (profileData: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...profileData };
    setCurrentUser(updated);
    if (auth.currentUser) {
      setDoc(doc(db, 'users', updated.id), updated).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, `users/${updated.id}`)
      );
    }
  };

  const submitOrder = (orderData: Omit<ClientOrder, 'id' | 'submittedAt' | 'status'>): ClientOrder => {
    const newOrder: ClientOrder = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'PENDING',
    };
    setOrders((prev) => [newOrder, ...prev]);
    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, `orders/${newOrder.id}`)
    );
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, adminNotes?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, status, ...(adminNotes !== undefined ? { adminNotes } : {}) };
          setDoc(doc(db, 'orders', orderId), updated).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`)
          );
          return updated;
        }
        return o;
      })
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    deleteDoc(doc(db, 'orders', orderId)).catch((err) =>
      handleFirestoreError(err, OperationType.DELETE, `orders/${orderId}`)
    );
  };

  const toggleSaveApartment = (id: string) => {
    setSavedApartmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        dir,
        t,
        siteSettings,
        updateSiteSettings,
        apartments,
        addApartment,
        updateApartment,
        deleteApartment,
        paintsCatalog,
        updatePaintCatalog,
        partners,
        addPartner,
        updatePartner,
        deletePartner,
        togglePartnerActive,
        reviews,
        addReview,
        likeReview,
        deleteReview,
        toggleReviewApproval,
        currentUser,
        registerOrLoginUser,
        loginAdmin,
        loginWithGoogle,
        logoutUser,
        updateUserProfile,
        registeredUsers,
        addRegisteredUser,
        deleteRegisteredUser,
        saveApartmentPolygons,
        orders,
        submitOrder,
        updateOrderStatus,
        deleteOrder,
        savedApartmentIds,
        toggleSaveApartment,
        isAdminMode,
        setIsAdminMode,
        activeView,
        setActiveView,
        selectedApartmentForCustomization,
        setSelectedApartmentForCustomization,
        selectedApartmentForModal,
        setSelectedApartmentForModal,
        firebaseAuthUser,
        isFirebaseReady,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
