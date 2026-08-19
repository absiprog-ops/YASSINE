import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Globe,
  Sun,
  Car,
  Search,
  ExternalLink,
  PhoneCall,
  Sparkles,
  X,
} from 'lucide-react';

export const Footer: React.FC<{
  onOpenAuthModal: () => void;
}> = ({ onOpenAuthModal }) => {
  const { siteSettings, setActiveView } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);

  const shareUrl = siteSettings.websiteShareUrl || (typeof window !== 'undefined' ? window.location.href : 'https://magha-immobilier-r2.ma');
  const shareTitle = siteSettings.siteTitle || 'إقامة Magha immobilier R+2';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${siteSettings.siteTitle} - ${siteSettings.siteSubtitle}`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <footer className="bg-[var(--dark-emerald,#042f2e)] text-emerald-100 border-t border-emerald-800/60 dir-rtl pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info & Social Media Links */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-400 shadow-xl shrink-0 overflow-hidden">
                <img
                  src={siteSettings.siteLogo || "/assets/images/magha_logo_1786471125430.jpg"}
                  alt="MAGHA IMMOBILIER Logo"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/images/magha_logo_1786471125430.jpg';
                  }}
                  className="w-full h-full object-cover rounded-full bg-white"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-amber-300">MAGHA IMMOBILIER</h3>
                <span className="text-xs text-emerald-300 font-bold">R+2 Residence Architecture</span>
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-md">
              {siteSettings.siteSubtitle} - مع توفير مكتبة دهانات حرة (خيال، عنبرة، صباغة زيتية) وتطبيق التعديلات مجاناً قبل تسليم مفاتيح الشقة.
            </p>

            {/* Social Media Company Profiles */}
            <div className="pt-2 space-y-2">
              <h5 className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>صفحاتنا الرسمية على شبكات التواصل الاجتماعي:</span>
              </h5>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Facebook */}
                {siteSettings.facebookUrl && (
                  <a
                    href={siteSettings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-600/90 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-105"
                    title="صفحة فيسبوك الرسمية"
                  >
                    <Facebook className="w-4 h-4" />
                    <span className="hidden sm:inline">فيسبوك</span>
                  </a>
                )}

                {/* Instagram */}
                {siteSettings.instagramUrl && (
                  <a
                    href={siteSettings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-105"
                    title="حساب انستغرام الرسمي"
                  >
                    <Instagram className="w-4 h-4" />
                    <span className="hidden sm:inline">إنستغرام</span>
                  </a>
                )}

                {/* YouTube */}
                {siteSettings.youtubeUrl && (
                  <a
                    href={siteSettings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-105"
                    title="قناة يوتيوب الرسمية"
                  >
                    <Youtube className="w-4 h-4" />
                    <span className="hidden sm:inline">يوتيوب</span>
                  </a>
                )}

                {/* TikTok */}
                {siteSettings.tiktokUrl && (
                  <a
                    href={siteSettings.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-900 border border-slate-700 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-105"
                    title="حساب تيك توك الرسمي"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.42V8.9a6.34 6.34 0 1 0 6.34 6.34V9.38a8.16 8.16 0 0 0 4.77 1.52V7.46a4.85 4.85 0 0 1-1-.77z" />
                    </svg>
                    <span className="hidden sm:inline">تيك توك</span>
                  </a>
                )}

                {/* LinkedIn */}
                {siteSettings.linkedinUrl && (
                  <a
                    href={siteSettings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-sky-700/90 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-105"
                    title="صفحة لينكد إن الرسمية"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="hidden sm:inline">لينكد إن</span>
                  </a>
                )}

                {/* WhatsApp Direct */}
                <a
                  href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-105"
                  title="تواصل مباشر واتساب"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>الواتساب</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-sm">روابط سريعة</h4>
            <ul className="space-y-2 text-xs text-emerald-200/90">
              <li>
                <button
                  onClick={() => setActiveView('HOME')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('APARTMENTS')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  شقق R+2 المتاحة
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('PAINT_STUDIO')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  مخصص الصباغة والدهانات
                </button>
              </li>
              <li>
                <button onClick={onOpenAuthModal} className="hover:text-white transition-colors cursor-pointer">
                  تسجيل معلومات الزبون
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & Client Sharing Tool */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-bold text-white text-sm">معلومات الاتصال بالمعرض</h4>
            <div className="space-y-2 text-xs text-emerald-200/90">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span dir="ltr">{siteSettings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{siteSettings.emailAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{siteSettings.addressText}</span>
              </div>
            </div>

            {/* SHARE PAGE WITH CLIENTS BOX */}
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-700/70 rounded-2xl space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>مشاركة صفحتنا للزبناء (Share Page):</span>
                </span>
                {copiedLink && (
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black animate-fadeIn">
                    تم نسخ الرابط! ✓
                  </span>
                )}
              </div>

              <p className="text-[11px] text-emerald-200/80">
                شارك رابط الإقامة ومحاكي الصباغة مباشرة مع معارفك وزبنائك:
              </p>

              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'تم النسخ' : 'نسخ رابط الصفحة'}</span>
                </button>

                <button
                  onClick={handleNativeShare}
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer border border-emerald-500"
                  title="مشاركة عبر التطبيقات"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>مشاركة</span>
                </button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `تعرف على مشروع شقق ${siteSettings.siteTitle} واستمتع بتجربة تحديد الفينيسيو والطلاء مجاناً:\n${shareUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md"
                  title="مشاركة مباشرة عبر الواتساب"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساب</span>
                </a>
              </div>
            </div>

            {/* QUICK CONTACT & LOCAL WEATHER / TRAFFIC GOOGLE SEARCH UPDATES */}
            <div className="p-3.5 bg-gradient-to-br from-emerald-900/90 via-teal-950/90 to-slate-950/90 border border-emerald-500/40 rounded-2xl space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between text-xs font-extrabold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>تواصل سريع ومعلومات الموقع (Quick Contact & Live Info):</span>
                </span>
                <span className="text-[9px] bg-emerald-800/80 text-emerald-200 border border-emerald-600/50 px-2 py-0.5 rounded-full font-bold">
                  Google Search
                </span>
              </div>

              <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                تواصل فوراً مع مكتب المبيعات أو استكشف حالة الطقس وحركة الطرق حول موقع المشروع عبر Google Search:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Quick Call Button */}
                <a
                  href={`tel:${siteSettings.contactPhone}`}
                  className="px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.02]"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>اتصال مباشر بالمبيعات</span>
                </a>

                {/* Weather Search via Google */}
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(`طقس وحالة الجو ${siteSettings.addressText}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-emerald-800/80 hover:bg-emerald-700/80 text-amber-200 border border-emerald-600/60 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                  title="استعلام مباشر عن حالة الطقس عبر Google Search"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>طقس موقع المشروع</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400 opacity-70" />
                </a>

                {/* Traffic Search via Google */}
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(`حركة المرور والطرق ${siteSettings.addressText}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-teal-800/80 hover:bg-teal-700/80 text-teal-100 border border-teal-600/60 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] sm:col-span-2"
                  title="استعلام مباشر عن حركة سير الطرقات والملاحة عبر Google Search"
                >
                  <Car className="w-3.5 h-3.5 text-amber-300" />
                  <span>متابعة حركة المرور والطرق بالموقع (Google Search)</span>
                  <ExternalLink className="w-3 h-3 text-teal-300 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-emerald-800/40 text-center text-xs text-emerald-300/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>جميع الحقوق محفوظة © {new Date().getFullYear()} - {siteSettings.siteTitle}</div>
          <div className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>تصميم واستوديو تخصيص الدهانات R+2</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

