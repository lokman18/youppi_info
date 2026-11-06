import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useRouter, Link } from '../router/Router';
import { orderService } from '../services/orderService';
import { OrderItem } from '../types';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Building2, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  HelpCircle,
  Package
} from 'lucide-react';

const WILAYAS = [
  '01 - Adrar', '02 - Chlef', '03 - Laghouat', '04 - Oum El Bouaghi', '05 - Batna',
  '06 - Béjaïa', '07 - Biskra', '08 - Béchar', '09 - Blida', '10 - Bouira',
  '11 - Tamanrasset', '12 - Tébessa', '13 - Tlemcen', '14 - Tiaret', '15 - Tizi Ouzou',
  '16 - Alger', '17 - Djelfa', '18 - Djidjelli (Jijel)', '19 - Sétif', '20 - Saïda',
  '21 - Skikda', '22 - Sidi Bel Abbès', '23 - Annaba', '24 - Guelma', '25 - Constantine',
  '26 - Médéa', '27 - Mostaganem', '28 - M\'Sila', '29 - Mascara', '30 - Ouargla',
  '31 - Oran', '32 - El Bayadh', '33 - Illizi', '34 - Bordj Bou Arreridj', '35 - Boumerdès',
  '36 - El Tarf', '37 - Tindouf', '38 - Tissemsilt', '39 - El Oued', '40 - Khenchela',
  '41 - Souk Ahras', '42 - Tipaza', '43 - Mila', '44 - Aïn Defla', '45 - Naâma',
  '46 - Aïn Témouchent', '47 - Ghardaïa', '48 - Relizane', '49 - El M\'Ghair', '50 - El Meniaa',
  '51 - Ouled Djellal', '52 - Bordj Baji Mokhtar', '53 - Béni Abbès', '54 - Timimoun',
  '55 - Touggourt', '56 - Djanet', '57 - In Salah', '58 - In Guezzam'
];

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, discount, couponCode, shippingFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useLanguage();
  const { navigate } = useRouter();

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [wilaya, setWilaya] = useState(user?.wilaya || '16 - Alger');
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [deliveryType, setDeliveryType] = useState<'home' | 'desk'>('home');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'baridimob' | 'card'>('cod');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect to cart
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Votre panier est actuellement vide</h2>
        <p className="text-sm text-slate-500">Ajoutez au moins un article avant de passer à la caisse.</p>
        <Link
          to="/products"
          className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#0075FF] to-[#0060DF] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-blue-500/25 transition-all"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Le nom complet est obligatoire.';
    if (!phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est obligatoire pour la livraison.';
    } else if (!/^(05|06|07)[0-9]{8}$/.test(phone.replace(/[\s.-]/g, ''))) {
      newErrors.phone = 'Numéro invalide (ex: 0550 12 34 56 ou 0770 12 34 56).';
    }
    if (!email.trim() || !email.includes('@')) {
      newErrors.email = 'Veuillez saisir une adresse email valide.';
    }
    if (!wilaya) newErrors.wilaya = 'Veuillez choisir votre wilaya.';
    if (!commune.trim()) newErrors.commune = 'Veuillez indiquer votre commune/ville.';
    if (deliveryType === 'home' && !address.trim()) {
      newErrors.address = 'L’adresse précise est requise pour la livraison à domicile.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Build order items
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        productSku: item.product.sku,
        image: item.product.images[0]?.url || '',
        price: item.product.priceDzd,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSpec: item.selectedSpec,
      }));

      // Simulate order registration
      await new Promise(r => setTimeout(r, 900));

      const createdOrder = orderService.createOrder({
        customer: {
          fullName,
          phone,
          email,
          wilaya,
          commune,
          address: deliveryType === 'home' ? address : `Bureau de retrait Stop Desk - ${wilaya}`,
          deliveryType,
          notes,
        },
        items: orderItems,
        subtotal,
        shippingFee,
        discount,
        couponCode: couponCode || undefined,
        total,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'confirmed',
      });

      // Confetti effect!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      clearCart();
      navigate(`/order-confirmation/${createdOrder.id}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Return link */}
      <div className="mb-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au panier</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Finalisation de votre commande
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Remplissez vos coordonnées pour recevoir votre colis sous 24 à 48 heures.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Checkout Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Client Info */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0075FF] font-extrabold text-xs flex items-center justify-center font-mono">
                1
              </div>
              <h2 className="text-base font-extrabold text-slate-900">
                Informations du destinataire
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Nom et prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Ex: Karim Brahimi"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white transition-colors ${
                    errors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-[#0075FF]'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-red-500 font-medium">{errors.fullName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Numéro de téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0550 12 34 56"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white transition-colors font-mono ${
                    errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-[#0075FF]'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-red-500 font-medium">{errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Adresse email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre.email@domaine.com"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white transition-colors ${
                    errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-[#0075FF]'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Destination */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0075FF] font-extrabold text-xs flex items-center justify-center font-mono">
                2
              </div>
              <h2 className="text-base font-extrabold text-slate-900">
                Lieu & Mode de livraison
              </h2>
            </div>

            {/* Delivery mode selection tabs */}
            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setDeliveryType('home')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 ${
                  deliveryType === 'home'
                    ? 'border-[#0075FF] bg-blue-50/40 text-slate-900 ring-1 ring-[#0075FF]'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className={`w-4 h-4 ${deliveryType === 'home' ? 'text-[#0075FF]' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">À Domicile</span>
                  </div>
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'home'}
                    onChange={() => setDeliveryType('home')}
                    className="accent-[#0075FF]"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Livraison par coursier jusqu'à votre porte (24-48h).
                </p>
              </label>

              <label
                onClick={() => setDeliveryType('desk')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 ${
                  deliveryType === 'desk'
                    ? 'border-[#0075FF] bg-blue-50/40 text-slate-900 ring-1 ring-[#0075FF]'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className={`w-4 h-4 ${deliveryType === 'desk' ? 'text-[#0075FF]' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">Stop Desk (Agence)</span>
                  </div>
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'desk'}
                    onChange={() => setDeliveryType('desk')}
                    className="accent-[#0075FF]"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Récupérez votre colis directement dans le bureau de transport.
                </p>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Wilaya de destination <span className="text-red-500">*</span>
                </label>
                <select
                  value={wilaya}
                  onChange={e => setWilaya(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0075FF] focus:bg-white"
                >
                  {WILAYAS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Commune / Ville <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={commune}
                  onChange={e => setCommune(e.target.value)}
                  placeholder="Ex: Bab El Oued, Hydra, Bir Mourad Raïs..."
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white transition-colors ${
                    errors.commune ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-[#0075FF]'
                  }`}
                />
                {errors.commune && <p className="text-[11px] text-red-500 font-medium">{errors.commune}</p>}
              </div>

              {deliveryType === 'home' && (
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">
                    Adresse complète de livraison <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Numéro de bâtiment, rue, quartier..."
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white transition-colors ${
                      errors.address ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-[#0075FF]'
                    }`}
                  />
                  {errors.address && <p className="text-[11px] text-red-500 font-medium">{errors.address}</p>}
                </div>
              )}

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Instructions ou remarques pour le livreur (Optionnel)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ex: Appelez 30 minutes avant de passer, après 16h..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0075FF] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0075FF] font-extrabold text-xs flex items-center justify-center font-mono">
                3
              </div>
              <h2 className="text-base font-extrabold text-slate-900">
                Mode de règlement
              </h2>
            </div>

            <div className="space-y-3">
              {/* Option 1: Cash on delivery */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-[#0075FF] bg-blue-50/40 text-slate-900 ring-1 ring-[#0075FF]'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Paiement en espèces à la livraison (Recommandé)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Vous ne payez qu'après avoir reçu et vérifié votre colis auprès du livreur.
                    </p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-[#0075FF] shrink-0"
                />
              </label>

              {/* Option 2: BaridiMob / Edahabia CIB mock gateway */}
              <label
                onClick={() => setPaymentMethod('baridimob')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'baridimob'
                    ? 'border-[#0075FF] bg-blue-50/40 text-slate-900 ring-1 ring-[#0075FF]'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900">
                        BaridiMob / Carte Edahabia & CIB
                      </h3>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        Simulation sécurisée
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Virement instantané via RIP BaridiMob. Zéro frais supplémentaires.
                    </p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'baridimob'}
                  onChange={() => setPaymentMethod('baridimob')}
                  className="accent-[#0075FF] shrink-0"
                />
              </label>

              {/* Option 3: Card */}
              <label
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'card'
                    ? 'border-[#0075FF] bg-blue-50/40 text-slate-900 ring-1 ring-[#0075FF]'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Carte Bancaire Visa / Mastercard
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Paiement en ligne crypté SSL 256 bits (environnement démonstration).
                    </p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="accent-[#0075FF] shrink-0"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900">
              Articles commandés ({items.length})
            </h2>

            {/* Items mini list */}
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.id} className="py-3 flex items-center gap-3 first:pt-0 last:pb-0">
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Qté: {item.quantity} × <span className="font-mono">{formatPrice(item.product.priceDzd)}</span>
                    </p>
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 font-mono">
                    {formatPrice(item.product.priceDzd * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-mono font-bold text-slate-900">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Remise promo ({couponCode})</span>
                  <span className="font-mono font-bold">- {formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Frais de livraison ({wilaya})</span>
                <span className="font-mono font-bold text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[11px]">Gratuit</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total à régler</span>
                <span className="font-mono text-xl text-[#0075FF] font-black">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSubmitting
                  ? 'bg-slate-400 cursor-wait'
                  : 'bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0066E0] hover:to-[#004EC2] shadow-blue-500/25 hover:shadow-cyan-500/35 transform hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validation en cours...</span>
                </div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmer la Commande ({formatPrice(total)})</span>
                </>
              )}
            </button>

            {/* Guarantees */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Paiement 100% Sécurisé & Garanti</span>
              </div>
              <p className="leading-relaxed">
                Tous nos produits bénéficient d'une garantie test de 30 jours et d'une facture officielle délivrée par YOUPPI INFO.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
