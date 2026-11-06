import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link, useRouter } from '../router/Router';
import { storeService } from '../services/storeService';
import { openWhatsAppChat } from '../services/whatsappService';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product } from '../types';
import { useToast } from '../context/ToastContext';

import heroWorkstationImg from '../assets/images/hero_laptop_workstation_1792262364586.jpg';

import { 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Cpu, 
  Laptop, 
  Gamepad2, 
  HardDrive, 
  Tv, 
  Keyboard, 
  PlugZap, 
  Briefcase,
  MonitorDot,
  Truck, 
  Zap, 
  Layers, 
  Star, 
  Clock, 
  Copy, 
  Check, 
  Flame, 
  Gift, 
  Send 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [storeVersion, setStoreVersion] = useState(0);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Flash Sale Countdown Timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return storeService.subscribe(() => {
      setStoreVersion(v => v + 1);
    });
  }, []);

  const featuredProducts = useMemo(() => storeService.getProducts({ isFeatured: true }).slice(0, 4), [storeVersion]);
  const latestProducts = useMemo(() => storeService.getProducts({ sortBy: 'newest' }).slice(0, 4), [storeVersion]);
  const categories = storeService.getCategories();

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('YOUPPI10');
    setCopiedCoupon(true);
    showToast({
      type: 'success',
      title: 'Code copié !',
      message: 'Utilisez « YOUPPI10 » au panier pour 10% de remise immédiate.',
    });
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
      showToast({
        type: 'success',
        title: 'Inscription confirmée !',
        message: 'Bienvenue dans le club VIP YOUPPI INFO. Vérifiez votre boîte mail.',
      });
      setNewsletterEmail('');
    }
  };

  const categoryGradients = [
    'from-red-500/15 via-rose-500/10 to-orange-500/10 border-red-200/80 hover:border-red-400',
    'from-blue-500/15 via-indigo-500/10 to-cyan-500/10 border-blue-200/80 hover:border-blue-400',
    'from-purple-500/15 via-violet-500/10 to-pink-500/10 border-purple-200/80 hover:border-purple-400',
    'from-amber-500/15 via-orange-500/10 to-yellow-500/10 border-amber-200/80 hover:border-amber-400',
    'from-emerald-500/15 via-teal-500/10 to-cyan-500/10 border-emerald-200/80 hover:border-emerald-400',
    'from-cyan-500/15 via-sky-500/10 to-blue-500/10 border-cyan-200/80 hover:border-cyan-400',
  ];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="w-5 h-5 text-red-600" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-purple-600" />;
      case 'MonitorDot': return <MonitorDot className="w-5 h-5 text-amber-600" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-600" />;
      case 'Layers': return <Layers className="w-5 h-5 text-cyan-600" />;
      case 'HardDrive': return <HardDrive className="w-5 h-5 text-indigo-600" />;
      case 'Tv': return <Tv className="w-5 h-5 text-rose-600" />;
      case 'Keyboard': return <Keyboard className="w-5 h-5 text-violet-600" />;
      case 'PlugZap': return <PlugZap className="w-5 h-5 text-orange-600" />;
      default: return <Laptop className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 overflow-x-hidden">
      
      {/* 1. Modern High-Impact Hero Section with Animated Vibrant Mesh & Glow */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:pt-16 lg:pb-24 bg-gradient-to-b from-white via-sky-50/30 to-slate-50 border-b border-slate-200/70">
        {/* Animated Background Glowing Orbs - Neon Cyan and Cyber Blue */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#0075FF]/15 to-[#00E5FF]/10 blur-[130px] rounded-full pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-gradient-to-br from-[#00E5FF]/15 to-blue-600/10 blur-[120px] rounded-full pointer-events-none animate-float" />
        <div className="absolute -bottom-10 left-1/3 w-[350px] h-[350px] bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Value Proposition & Animated Typography */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6 text-start"
            >
              {/* Trust Kicker Tag with Animated Pulse */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-md border border-cyan-400/40 rounded-full text-xs font-semibold text-slate-800 shadow-sm shadow-cyan-500/10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse" />
                <span className="text-slate-900 font-bold">{t('hero.testedBadge')}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-600 font-medium">{t('hero.wilayaNotice')}</span>
              </div>

              {/* Dynamic Headline with Cyber Blue & Neon Cyan Gradient */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 leading-[1.12] text-balance">
                Le Meilleur du Hardware PC & Gaming en Algérie{' '}
                <span className="text-gradient-cyan">Testé & Garanti</span>
              </h1>

              {/* Lead Paragraph */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Boutique informatique spécialisée à Alger : ordinateurs portables d’occasion certifiés Grade A, configurations PC Gamer sur mesure et cartes graphiques dernière génération.
              </p>

              {/* Primary Call-to-Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="px-7 py-4 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0060DF] hover:to-[#004DB3] text-white text-sm font-extrabold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-cyan-400/30 transition-all flex items-center gap-2 group cursor-pointer hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Explorer le catalogue</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={() => openWhatsAppChat({ sourcePage: 'hero', lang: language })}
                  className="px-6 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-2xl transition-all shadow-sm flex items-center gap-2.5 cursor-pointer hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Devis Direct WhatsApp</span>
                </button>
              </div>

              {/* Quantitative Proof Strip */}
              <div className="pt-6 border-t border-slate-200/90 grid grid-cols-3 gap-4 text-xs text-slate-500">
                <div className="space-y-1">
                  <span className="text-[#0075FF] font-black block text-base font-mono tabular-nums">100% Testé</span>
                  <span className="text-slate-500 leading-tight block">Banc de test & FurMark</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[#0075FF] font-black block text-base font-mono tabular-nums">Grade A / A+</span>
                  <span className="text-slate-500 leading-tight block">Arrivage direct Europe</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[#0075FF] font-black block text-base font-mono tabular-nums">58 Wilayas</span>
                  <span className="text-slate-500 leading-tight block">Paiement à la livraison</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Animated Showcase Feature Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              {/* Subtle Glowing Aura */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0075FF] via-cyan-400 to-blue-600 rounded-3xl blur-xl opacity-35 group-hover:opacity-60 transition duration-1000 animate-pulse-slow" />

              <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-white shadow-2xl group">
                <img
                  src={heroWorkstationImg}
                  alt="YOUPPI INFO Flagship Laptop Workstation"
                  className="w-full h-[400px] lg:h-[480px] object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                
                {/* Visual Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/90 via-[#0A1128]/35 to-transparent" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-[#0075FF] to-cyan-500 text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-1.5 border border-cyan-300/30">
                    <Flame className="w-3.5 h-3.5 fill-white text-white" />
                    Offre Vedette
                  </span>
                </div>

                {/* Floating Bottom Showcase Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-5 rounded-2xl bg-[#0A1128]/90 backdrop-blur-md border border-cyan-500/40 shadow-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#00E5FF] block">
                      Arrivage Suisse & Allemagne
                    </span>
                    <h4 className="text-sm font-extrabold text-white leading-tight">
                      ThinkPad, EliteBook & PC Gamer RTX
                    </h4>
                    <span className="text-xs text-slate-300 block">
                      Facture & Garantie d'atelier 30 jours
                    </span>
                  </div>
                  <Link
                    to="/products"
                    className="p-3.5 bg-gradient-to-r from-[#0075FF] to-cyan-500 hover:from-cyan-500 hover:to-[#0075FF] text-white rounded-xl transition-all shrink-0 shadow-md shadow-cyan-500/25 hover:scale-105 cursor-pointer"
                    aria-label="Voir le catalogue"
                  >
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. PROMOTIONAL DISCOUNT BANNER: Countdown Timer & Click-to-Copy Coupon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0A1128] via-[#0D1B3E] to-[#0A1128] border border-cyan-500/40 text-white p-6 sm:p-10 shadow-2xl"
        >
          {/* Animated decorative glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-start">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-xs font-bold text-cyan-300">
                <Clock className="w-3.5 h-3.5 animate-spin text-cyan-300" />
                <span>Vente Flash Exceptionnelle · Stocks Limités</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Profitez de <span className="text-[#00E5FF] font-mono">-10% de réduction</span> supplémentaire !
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Valable sur l'ensemble du catalogue : PC portables, cartes graphiques RTX et configurations gaming.
              </p>
            </div>

            {/* Countdown Clocks + Coupon Click-to-Copy */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Countdown Digits */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-cyan-400/30 flex items-center justify-center font-mono font-black text-xl text-white shadow-inner">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-cyan-200 font-bold uppercase mt-1">Heures</span>
                </div>
                <span className="text-xl font-bold text-cyan-400 -mt-4">:</span>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-cyan-400/30 flex items-center justify-center font-mono font-black text-xl text-white shadow-inner">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-cyan-200 font-bold uppercase mt-1">Minutes</span>
                </div>
                <span className="text-xl font-bold text-cyan-400 -mt-4">:</span>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-cyan-400/30 flex items-center justify-center font-mono font-black text-xl text-cyan-300 shadow-inner">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-cyan-200 font-bold uppercase mt-1">Secondes</span>
                </div>
              </div>

              {/* Coupon Box */}
              <button
                onClick={handleCopyCoupon}
                className="px-5 py-3.5 bg-gradient-to-r from-[#0075FF] to-cyan-500 hover:from-cyan-500 hover:to-[#0075FF] rounded-2xl border border-cyan-300/40 text-white flex items-center gap-3 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Cliquer pour copier le code promo"
              >
                <div className="text-start">
                  <span className="text-[10px] uppercase tracking-wider text-cyan-100 block font-bold">Code Promo</span>
                  <span className="text-base font-black font-mono tracking-wider">YOUPPI10</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  {copiedCoupon ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Shop by Category with Vibrant Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#DC2626] mb-1">
              Catégories en Vedette
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explorer par Catégorie
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Trouvez facilement le matériel adapté à vos besoins professionnels ou gaming
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-[#DC2626] hover:text-[#B91C1C] flex items-center gap-1.5 transition-colors group"
          >
            <span>Voir toutes les catégories</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.slice(0, 10).map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className={`p-5 rounded-2xl bg-white border shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-36 ${
                categoryGradients[idx % categoryGradients.length]
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.iconName)}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0075FF] transition-colors line-clamp-1">
                  {language === 'ar' ? cat.nameAr : language === 'en' ? cat.nameEn : cat.nameFr}
                </h4>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  Arrivage certifié
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Hardware & Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#0075FF] mb-1">
              Les Incontournables
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Nos Meilleures Ventes (Best Sellers)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configurations plébiscitées par nos clients et testées sur benchmarks exigeants
            </p>
          </div>
          <Link
            to="/products?sort=featured"
            className="text-xs font-bold text-[#0075FF] hover:text-[#0060DF] flex items-center gap-1.5 transition-colors group"
          >
            <span>Voir toute la sélection</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0075FF] flex items-center justify-center mx-auto">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {language === 'ar' ? 'لا توجد منتجات مميزة معروضة حالياً' : 'Aucun produit vedette pour le moment'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {language === 'ar' ? 'سيتم عرض المنتجات المميزة هنا فور إضافتها إلى المتجر.' : 'Les configurations vedettes apparaîtront ici dès leur enregistrement dans le catalogue.'}
            </p>
          </div>
        )}
      </section>

      {/* 5. Trust & Quality Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-blue-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0075FF] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Garantie 30 Jours en Atelier</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Diagnostic matériel rigoureux, réparation ou remplacement immédiat sans discussion en cas d'anomalie.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Transparence & Tests 100%</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Santé batterie déclarée au pourcent près, micro-rayures documentées et pâte thermique neuve de qualité supérieure.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-blue-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-cyan-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Expédition 58 Wilayas</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Livraison sécurisée avec emballage blindé anti-chocs. Paiement en espèces au déballage du colis.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-green-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Conseillers Experts WhatsApp</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Assistance technique rapide avant et après vente. Photos et vidéos des appareils envoyées sur demande.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Latest Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#0075FF] mb-1">
              Nouveautés Récentes
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Derniers Arrivages en Stock
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Fraîchement arrivés d'Europe et révisés par nos techniciens
            </p>
          </div>
          <Link
            to="/products?sort=newest"
            className="text-xs font-bold text-[#0075FF] hover:text-[#0060DF] flex items-center gap-1.5 transition-colors group"
          >
            <span>Voir toutes les nouveautés</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {latestProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0075FF] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {language === 'ar' ? 'لا توجد منتجات جديدة في المخزون حالياً' : 'Aucun nouvel arrivage pour le moment'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {language === 'ar' ? 'تابعونا لمشاهدة الدفعات والعتاد الجديد عند توفره.' : 'Les nouveaux articles révisés apparaîtront ici dès leur entrée en stock.'}
            </p>
          </div>
        )}
      </section>

      {/* 7. Store Commitments & Service Guarantee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#0075FF]">
            {language === 'ar' ? 'خدماتنا والتزامنا' : 'Nos Engagements'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'ar' ? 'تجربة شراء احترافية ومضمونة' : 'Une Expérience d’Achat Rigoureuse & Transparente'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ar' ? 'نوفر لكم أفضل أجهزة الكمبيوتر وقطع الغيار مع اختبارات شاملة وضمان حقيقي.' : 'Matériel informatique rigoureusement contrôlé en atelier, devis clair et livraison dans toute l’Algérie.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#0075FF] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'ar' ? 'فحص شامل واختبار الإجهاد' : 'Stress Tests Matériels 100%'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar' ? 'كل جهاز يتم اختباره ببرامج Cinebench و FurMark و MemTest للتأكد من سلامة المعالج والكرت والذاكرة.' : 'Chaque machine subit des benchmarks intensifs (Cinebench, FurMark) pour certifier ses performances et températures.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'ar' ? 'توصيل وتغليف مصفّح' : 'Expédition Sécurisée 58 Wilayas'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar' ? 'تغليف احترافي مضاد للصدمات مع خيار الدفع عند الاستلام بعد معاينة الطرد.' : 'Colis protégés avec cales anti-chocs. Paiement en espèces à la livraison avec suivi en temps réel.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-green-100 text-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'ar' ? 'دعم فني سريع عبر واتساب' : 'Conseil & SAV Direct WhatsApp'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar' ? 'فريقنا متاح للإجابة على جميع استفساراتكم التقنية وإرسال صور وفيديوهات حقيقية للأجهزة.' : 'Échangez directement avec un technicien pour choisir le modèle adapté à votre budget et vos logiciels.'}
            </p>
          </div>
        </div>
      </section>

      {/* 8. Newsletter Subscription Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-12 border border-slate-700/60 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl space-y-4 relative z-10">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-cyan-400" />
              Club Privilège YOUPPI INFO
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Soyez prévenu en avant-première des arrivages ThinkPad & PC Gamer
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Inscrivez-vous pour recevoir nos alertes de déstockage, codes promos exclusifs et guides d'optimisation hardware.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="pt-2 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="Votre adresse email (ex: gamer@gmail.com)"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md border border-cyan-400/30 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#0075FF] to-cyan-500 hover:from-cyan-500 hover:to-[#0075FF] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>S'abonner</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <p className="text-[11px] text-slate-400">
              🔒 Zéro spam. Désabonnement en 1 clic à tout moment.
            </p>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
