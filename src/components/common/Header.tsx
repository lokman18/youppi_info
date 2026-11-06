import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useRouter } from '../../router/Router';
import { openWhatsAppChat } from '../../services/whatsappService';
import { 
  Menu, 
  X, 
  MessageCircle, 
  Search, 
  Globe, 
  ChevronDown, 
  ShoppingBag, 
  Heart, 
  User, 
  LogOut, 
  SlidersHorizontal,
  Flame,
  ShieldCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { pathname, navigate } = useRouter();
  const { itemsCount, openCart, badgeAnimate } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: t('nav.home'), exact: true },
    { to: '/products', label: 'Boutique' },
    { to: '/categories/laptops', label: t('nav.laptops') },
    { to: '/categories/gaming-pc', label: t('nav.gamingPc') },
    { to: '/categories/gpus', label: t('nav.components') },
    { to: '/offers', label: t('nav.offers'), highlight: true },
    { to: '/about', label: 'À Propos' },
    { to: '/contact', label: 'Contact' },
  ];

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-md' 
          : 'bg-white/85 backdrop-blur-sm border-b border-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-18">
          
          {/* Zone 1: Brand Wordmark with Official Cyber Hexagon Logo */}
          <Link to="/" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group cursor-pointer">
            <div className="relative w-12 h-12 rounded-2xl bg-[#0A1128] border border-blue-500/30 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-400/40 group-hover:border-blue-400/60 transition-all flex items-center justify-center overflow-hidden">
              <img 
                src="/logo-emblem-transparent.png" 
                alt="YOUPPI INFO Logo" 
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-[#0075FF] transition-colors flex items-center">
                YOUPPI<span className="text-[#0075FF] ms-1">INFO</span>
              </span>
              <span className="text-[10px] font-bold text-blue-500 tracking-wider uppercase -mt-0.5 hidden sm:block font-mono">
                Hardware & Gaming DZ
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-600">
            {navLinks.map((link) => {
              const active = link.exact ? pathname === link.to : pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1.5 px-1 relative ${
                    active 
                      ? 'text-[#0075FF] font-bold after:absolute after:bottom-0 after:left-1 after:right-1 after:h-[2px] after:bg-[#0075FF] after:rounded-full' 
                      : 'text-slate-600 hover:text-slate-900'
                  } ${link.highlight && !active ? 'text-[#0075FF] font-bold' : ''}`}
                >
                  {link.label}
                  {link.highlight && (
                    <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Interactive Action Strip */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Rechercher un produit"
              title="Rechercher"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Link with Live Counter Badge */}
            <Link
              to="/wishlist"
              className="p-2 text-slate-600 hover:text-[#0075FF] rounded-xl hover:bg-sky-50 transition-colors relative cursor-pointer"
              aria-label="Mes favoris"
              title="Mes favoris"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-[#0075FF] fill-[#0075FF]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0075FF] text-white rounded-full text-[10px] font-bold flex items-center justify-center font-mono shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger with Bounce Animation */}
            <button
              onClick={openCart}
              className={`p-2 text-slate-700 hover:text-[#0075FF] rounded-xl hover:bg-sky-50 transition-all relative cursor-pointer ${
                badgeAnimate ? 'scale-110' : ''
              }`}
              aria-label="Panier d'achats"
              title="Mon panier"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemsCount > 0 && (
                <motion.span 
                  key={itemsCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#0075FF] text-white rounded-full text-[10px] font-bold flex items-center justify-center font-mono shadow-sm"
                >
                  {itemsCount}
                </motion.span>
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#0075FF]" />
                <span className="uppercase tracking-wider">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div 
                  className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs"
                  onClick={() => setLangMenuOpen(false)}
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code as any)}
                      className={`w-full text-start px-3.5 py-2 flex items-center gap-2 transition-colors cursor-pointer ${
                        language === l.code
                          ? 'text-[#0075FF] bg-sky-50 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Account Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Menu utilisateur"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0075FF] flex items-center justify-center font-bold text-xs font-mono border border-blue-200">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div 
                      className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/wishlist"
                        className="w-full text-start px-3.5 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50"
                      >
                        <Heart className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mes Favoris ({wishlistCount})</span>
                      </Link>

                      <Link
                        to="/cart"
                        className="w-full text-start px-3.5 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mon Panier ({itemsCount})</span>
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="w-full text-start px-3.5 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 font-bold"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#0075FF]" />
                          <span>Administration</span>
                        </Link>
                      )}

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={logout}
                          className="w-full text-start px-3.5 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Connexion</span>
                </Link>
              )}
            </div>

            {/* Direct WhatsApp CTA */}
            <button
              onClick={() => openWhatsAppChat({ sourcePage: pathname, lang: language })}
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#0075FF] hover:bg-[#0060DF] active:bg-[#004DB3] rounded-xl shadow-md shadow-blue-500/25 hover:shadow-cyan-400/30 transition-all whitespace-nowrap cursor-pointer hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Devis WhatsApp</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="py-3 border-t border-slate-100">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#DC2626] rounded-xl ps-10 pe-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                Rechercher
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation with Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl overflow-hidden"
          >
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const active = link.exact ? pathname === link.to : pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      active 
                        ? 'bg-red-50 text-[#DC2626]' 
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Mon Panier</span>
                <span className="font-mono text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                  {itemsCount}
                </span>
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Mes Favoris</span>
                <span className="font-mono text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              </Link>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openWhatsAppChat({ sourcePage: pathname, lang: language });
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#DC2626] rounded-xl shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('nav.whatsappDirect')}</span>
              </button>

              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#0075FF]" />
                <span>Portail Équipe (Admin & Stock)</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
