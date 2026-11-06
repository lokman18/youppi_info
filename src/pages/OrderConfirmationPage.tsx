import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Link, useRouter } from '../router/Router';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Printer, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Calendar,
  CreditCard,
  Banknote
} from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const { formatPrice } = useLanguage();
  const { navigate } = useRouter();

  useEffect(() => {
    const found = orderService.getOrderById(orderId);
    if (found) {
      setOrder(found);
      // Confetti burst on view
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
      });
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Commande introuvable</h2>
        <p className="text-sm text-slate-500">
          La commande avec l'identifiant « {orderId} » n'a pas pu être trouvée.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#0075FF] to-[#0060DF] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-blue-500/25 transition-all"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppTracking = () => {
    const text = encodeURIComponent(
      `Bonjour YOUPPI INFO ! Je souhaite suivre l'état de ma commande N° ${order.orderNumber} passée au nom de ${order.customer.fullName}. Merci !`
    );
    window.open(`https://wa.me/213555123456?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Success Header Banner */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-center sm:text-start flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Commande validée avec succès</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Merci pour votre confiance, {order.customer.fullName} !
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Votre commande N° <strong className="text-white font-mono">{order.orderNumber}</strong> est en cours de préparation par notre équipe technique.
            </p>
          </div>

          <div className="shrink-0 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[140px] relative z-10">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Total de la commande</span>
            <span className="text-lg font-mono font-black text-white">{formatPrice(order.total)}</span>
            <span className="text-[11px] text-emerald-200 block mt-1">
              {order.paymentMethod === 'cod' ? 'À régler à la livraison' : 'Paiement simulé'}
            </span>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {/* Top Info Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Date & Référence
              </span>
              <p className="font-extrabold text-slate-900 font-mono text-sm">{order.orderNumber}</p>
              <p className="text-slate-500">{new Date(order.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Adresse de livraison
              </span>
              <p className="font-bold text-slate-900">{order.customer.wilaya}</p>
              <p className="text-slate-500 leading-relaxed">{order.customer.commune}, {order.customer.address}</p>
              <p className="text-slate-500 font-mono flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" /> {order.customer.phone}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider flex items-center gap-1">
                {order.paymentMethod === 'cod' ? <Banknote className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                Mode de règlement
              </span>
              <p className="font-bold text-slate-900">
                {order.paymentMethod === 'cod' && 'Paiement en espèces à la livraison (COD)'}
                {order.paymentMethod === 'baridimob' && 'BaridiMob / Carte Edahabia CIB (Simulé)'}
                {order.paymentMethod === 'card' && 'Carte Bancaire (Simulé)'}
              </p>
              <p className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                Colis vérifiable avant règlement
              </p>
            </div>
          </div>

          {/* Ordered Products */}
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Contenu de la commande ({order.items.length})
            </h2>

            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.productName}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      SKU: {item.productSku} {item.selectedSpec && `· ${item.selectedSpec}`}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Quantité : <strong className="font-mono">{item.quantity}</strong>
                    </p>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 font-mono text-end">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="p-6 sm:p-8 bg-slate-50/70 space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Sous-total articles</span>
              <span className="font-mono font-bold text-slate-900">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Remise promotionnelle ({order.couponCode || 'PROMO'})</span>
                <span className="font-mono font-bold">- {formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Frais de livraison</span>
              <span className="font-mono font-bold text-slate-900">
                {order.shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase text-[10px]">Offerte</span>
                ) : (
                  formatPrice(order.shippingFee)
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total net à payer</span>
              <span className="font-mono text-xl text-[#0075FF] font-black">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le reçu</span>
            </button>

            <button
              onClick={handleWhatsAppTracking}
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Suivi WhatsApp</span>
            </button>
          </div>

          <Link
            to="/products"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <span>Continuer mes achats</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
