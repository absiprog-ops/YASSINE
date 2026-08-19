import React, { useState } from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  Building2,
  Paintbrush,
  UserCheck,
  ShieldCheck,
  Phone,
  Menu,
  X,
  Sparkles,
  Layers,
  ShoppingBag,
  Palette,
  CheckCircle2,
  Globe,
  Share2,
  Copy,
  Check,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from 'lucide-react';

export const Navbar: React.FC<{
  onOpenAuthModal: () => void;
}> = ({ onOpenAuthModal }) => {
  const {
    siteSettings,
    currentUser,
    activeView,
    setActiveView,
    isAdminMode,
    setIsAdminMode,
    orders,
    language,
    setLanguage,
    t,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topCopied, setTopCopied] = useState(false);

  const shareUrl = siteSettings.websiteShareUrl || (typeof window !== 'undefined' ? window.location.href : 'https://magha-immobilier-r2.ma');

  const handleQuickCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setTopCopied(true);
      setTimeout(() => setTopCopied(false), 2000);
    }
  };

  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;

  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'HOME', label: t('home'), icon: <Building2 className="w-4 h-4" /> },
    { id: 'APARTMENTS', label: t('apartments'), icon: <Layers className="w-4 h-4" /> },
    { id: 'PAINT_STUDIO', label: t('paintCustomizer'), icon: <Paintbrush className="w-4 h-4" /> },
  ];

  if (currentUser) {
    navItems.push({
      id: 'MY_ORDERS',
      label: t('myOrders'),
      icon: <ShoppingBag className="w-4 h-4" />,
    });
  }

  return (
    <header className="sticky top-0 z-40 bg-[var(--dark-emerald,#042f2e)] text-white shadow-xl border-b border-emerald-800/50 transition-colors">
      {/* Top Banner with Contact & Admin quick toggle */}
      <div className="bg-emerald-950/80 px-4 py-1.5 text-xs border-b border-emerald-800/40 text-emerald-100 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span dir="ltr">{siteSettings.contactPhone}</span>
          </span>
          <span className="hidden md:inline-block text-emerald-400/60">•</span>
          <span className="hidden lg:inline-block text-emerald-200">{siteSettings.addressText}</span>

          {/* Social Icons Header Quick Links */}
          <div className="hidden sm:flex items-center gap-1.5 border-r border-emerald-800/60 pr-3 mr-1">
            {siteSettings.facebookUrl && (
              <a href={siteSettings.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-blue-400 transition-colors" title="Facebook">
                <Facebook className="w-3.5 h-3.5" />
              </a>
            )}
            {siteSettings.instagramUrl && (
              <a href={siteSettings.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-rose-400 transition-colors" title="Instagram">
                <Instagram className="w-3.5 h-3.5" />
              </a>
            )}
            {siteSettings.youtubeUrl && (
              <a href={siteSettings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-red-400 transition-colors" title="YouTube">
                <Youtube className="w-3.5 h-3.5" />
              </a>
            )}
            {siteSettings.tiktokUrl && (
              <a href={siteSettings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-amber-300 transition-colors" title="TikTok">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.42V8.9a6.34 6.34 0 1 0 6.34 6.34V9.38a8.16 8.16 0 0 0 4.77 1.52V7.46a4.85 4.85 0 0 1-1-.77z" />
                </svg>
              </a>
            )}
            {siteSettings.linkedinUrl && (
              <a href={siteSettings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-sky-400 transition-colors" title="LinkedIn">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Share Page Button */}
          <button
            onClick={handleQuickCopy}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 transition-all cursor-pointer"
            title="نسخ رابط الصفحة لمشاركته مع الزبناء"
          >
            {topCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3 text-amber-300" />}
            <span>{topCopied ? 'تم نسخ الرابط ✓' : 'مشاركة الصفحة'}</span>
          </button>
          {/* AR / FR Language Switcher */}
          <div className="flex items-center gap-1 bg-emerald-900/90 p-0.5 rounded-lg border border-emerald-700/60 text-xs font-bold">
            <Globe className="w-3.5 h-3.5 text-emerald-300 ml-1 mr-0.5" />
            <button
              onClick={() => setLanguage('ar')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                language === 'ar'
                  ? 'bg-emerald-500 text-white shadow-sm font-black'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              العربية (AR)
            </button>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                language === 'fr'
                  ? 'bg-emerald-500 text-white shadow-sm font-black'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Français (FR)
            </button>
          </div>

          {/* Admin Mode Status Tag - Only visible if logged in as Admin */}
          {isAdminMode && (
            <button
              onClick={() => {
                setActiveView('ADMIN');
              }}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('adminMode')} (نشط)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setActiveView('HOME');
            if (isAdminMode) setIsAdminMode(false);
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-400 shadow-xl group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
            <img
              src={siteSettings.siteLogo || '/assets/images/magha_logo_1786471125430.jpg'}
              alt="MAGHA IMMOBILIER Logo"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/images/magha_logo_1786471125430.jpg';
              }}
              className="w-full h-full object-cover rounded-full bg-white"
            />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-amber-300 font-extrabold tracking-wide">MAGHA IMMOBILIER</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/40 font-bold">
                R+2
              </span>
            </h1>
            <p className="text-xs text-emerald-200/90 line-clamp-1 max-w-xs font-medium">
              {siteSettings.siteSubtitle}
            </p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 bg-emerald-950/60 p-1 rounded-xl border border-emerald-800/40">
          {navItems.map((item) => {
            const isActive = activeView === item.id && !isAdminMode;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'PAINT_STUDIO' && !currentUser) {
                    onOpenAuthModal();
                    return;
                  }
                  setActiveView(item.id);
                  if (isAdminMode) setIsAdminMode(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold'
                    : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          {isAdminMode && (
            <button
              onClick={() => setActiveView('ADMIN')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeView === 'ADMIN'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-amber-300 hover:bg-amber-500/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('adminTitle')}</span>
            </button>
          )}
        </nav>

        {/* Right User Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-emerald-900/50 px-3 py-1.5 rounded-xl border border-emerald-700/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white flex items-center gap-1">
                  <span>{currentUser.fullName}</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-emerald-300 text-[11px]" dir="ltr">
                  CIN: {currentUser.cin}
                </div>
              </div>
              <button
                onClick={onOpenAuthModal}
                className="mx-2 text-xs text-emerald-200 hover:text-white underline cursor-pointer"
              >
                {t('edit')}
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-semibold shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t('registerClient')}</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-emerald-900 text-emerald-100 hover:text-white cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-emerald-800/60 px-4 py-4 space-y-3">
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between p-2 bg-emerald-950 rounded-xl text-xs">
            <span className="text-emerald-200 flex items-center gap-1 font-bold">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Langue / اللغة:</span>
            </span>
            <div className="flex gap-1 font-bold">
              <button
                onClick={() => setLanguage('ar')}
                className={`px-3 py-1 rounded-lg ${
                  language === 'ar' ? 'bg-emerald-500 text-white' : 'text-emerald-300'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1 rounded-lg ${
                  language === 'fr' ? 'bg-emerald-500 text-white' : 'text-emerald-300'
                }`}
              >
                Français
              </button>
            </div>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'PAINT_STUDIO' && !currentUser) {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                  return;
                }
                setActiveView(item.id);
                if (isAdminMode) setIsAdminMode(false);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                activeView === item.id && !isAdminMode
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-emerald-100 bg-emerald-950/40 hover:bg-emerald-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          {isAdminMode && (
            <button
              onClick={() => {
                setActiveView('ADMIN');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-slate-950"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('adminTitle')}</span>
            </button>
          )}

          <div className="pt-2 border-t border-emerald-800/40 flex flex-col gap-2">
            {currentUser ? (
              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-700/40 text-xs text-emerald-100">
                <p className="font-bold text-white text-sm">{currentUser.fullName}</p>
                <p>CIN: {currentUser.cin}</p>
                <p>{currentUser.phone}</p>
                <button
                  onClick={() => {
                    onOpenAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2 text-amber-300 font-medium underline block"
                >
                  {t('edit')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span>{t('registerClient')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
