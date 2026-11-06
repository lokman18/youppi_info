import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Link, useRouter } from '../router/Router';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Tag, 
  ArrowLeft 
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    discount, 
    couponCode, 
    applyCoupon, 
    removeCoupon, 
    shippingFee, 
    freeShippingThreshold, 
    amountNeededForFreeShipping, 
    total 
  } = useCart();

  const { formatPrice } = useLanguage();
  const { navigate } = useRouter();
  const [promoCodeInput, setPromoCodeInput] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCodeInput.trim()) {
      applyCoupon(promoCodeInput);
      setPromoCodeInput('');
    }
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-sm max-w-md mx-auto space-y-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-blue-50 text-[#0075FF] mx-auto flex items-center justify-center shadow-inner">
            <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Votre panier est vide
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Vous n'avez pas encore ajouté de matériel informatique à votre sélection. Explorez nos meilleures offres !
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0066E0] hover:to-[#004EC2] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/35 transition-all"
            >
              <span>Découvrir nos produits</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb & Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continuer mes achats</span>
        </Link>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Vider le panier</span>
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-8">
        Mon Panier d'Achats ({items.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert Box */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-emerald-500/10 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0075FF]" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700">Félicitations ! Vous bénéficiez de la livraison offerte ! 🎉</span>
                ) : (
                  <span>
                    Ajoutez encore <strong className="text-[#0075FF] font-mono">{formatPrice(amountNeededForFreeShipping)}</strong> pour débloquer la livraison gratuite
                  </span>
                )}
              </span>
              <span className="font-bold font-mono text-slate-700 text-xs">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200/90 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#0075FF] via-cyan-400 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items Cards */}
          <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 shadow-xs overflow-hidden">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-100 border border-slate-200/80 shrink-0"
                    />

                    <div className="space-y-1 min-w-0">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {item.product.brand} · <span className="font-mono">{item.product.sku}</span>
                      </div>
                      
                      <Link 
                        to={`/products/${item.product.slug}`}
                        className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#0075FF] transition-colors line-clamp-1 block"
                      >
                        {item.product.name}
                      </Link>

                      {(item.selectedColor || item.selectedSpec) && (
                        <div className="flex flex-wrap gap-1.5 text-xs text-slate-500 pt-0.5">
                          {item.selectedColor && (
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md font-medium text-[11px]">
                              {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSpec && (
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md font-medium text-[11px]">
                              {item.selectedSpec}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="text-sm font-extrabold text-[#0075FF] font-mono tabular-nums sm:hidden pt-1">
                        {formatPrice(item.product.priceDzd)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Unit Price (Desktop) */}
                    <div className="text-end hidden sm:block">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Prix unitaire</span>
                      <span className="text-sm font-extrabold text-slate-900 font-mono tabular-nums">
                        {formatPrice(item.product.priceDzd)}
                      </span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50/80 shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs font-bold text-slate-900 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total for item */}
                    <div className="text-end min-w-[90px]">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block hidden sm:block">Total</span>
                      <span className="text-sm sm:text-base font-extrabold text-[#0075FF] font-mono tabular-nums">
                        {formatPrice(item.product.priceDzd * item.quantity)}
                      </span>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                      aria-label="Supprimer l'article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900">
              Récapitulatif de commande
            </h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Code Promo ou Réduction
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code promo (ex: YOUPPI10)"
                  value={promoCodeInput}
                  onChange={e => setPromoCodeInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase focus:outline-none focus:border-[#0075FF] font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Appliquer
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Astuce : Essayez le code promo <strong className="text-slate-700">YOUPPI10</strong> pour 10% de réduction !
              </p>
            </form>

            {couponCode && (
              <div className="flex items-center justify-between px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
                <span className="flex items-center gap-1.5 font-bold">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  Code « {couponCode} » appliqué
                </span>
                <button
                  onClick={removeCoupon}
                  className="text-emerald-700 hover:text-emerald-900 underline text-xs cursor-pointer"
                >
                  Retirer
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Sous-total articles</span>
                <span className="font-mono font-bold text-slate-900">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Remise code promo</span>
                  <span className="font-mono font-bold">- {formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Frais de livraison estimés</span>
                <span className="font-mono font-bold text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 uppercase font-black text-[11px]">Gratuite (58 Wilayas)</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-4 border-t border-slate-200">
                <span>Total estimé TTC</span>
                <span className="font-mono text-xl text-[#0075FF] font-black">{formatPrice(total)}</span>
              </div>
            </div>

            {/* CTA to Checkout */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0066E0] hover:to-[#004EC2] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-cyan-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Passer à la Caisse</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Reassurance Badges */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Test & Garantie 30j</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Livraison 58 Wilayas</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Remplacement garanti</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Paiement à la livraison</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
