import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../../context/CartContext';
import { useRouter } from '../../router/Router';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    closeCart, 
    items, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    discount, 
    couponCode, 
    applyCoupon, 
    removeCoupon, 
    total,
    shippingFee,
    freeShippingThreshold,
    amountNeededForFreeShipping
  } = useCart();

  const { navigate } = useRouter();
  const { language } = useLanguage();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyCoupon(promoInput);
      setPromoInput('');
    }
  };

  const handleGoToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleGoToCartPage = () => {
    closeCart();
    navigate('/cart');
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0075FF] border border-blue-200 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-tight">
                      Mon Panier
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                      {items.length} {items.length > 1 ? 'articles' : 'article'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="w-9 h-9 rounded-xl hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Fermer le panier"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Tracker */}
              <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-emerald-500/10 px-5 py-3 border-b border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#0075FF]" />
                    {amountNeededForFreeShipping === 0 ? (
                      <span className="text-emerald-700 font-bold">Livraison GRATUITE débloquée ! 🎉</span>
                    ) : (
                      <span>
                        Plus que <strong className="text-[#0075FF] font-mono">{amountNeededForFreeShipping.toLocaleString()} DZD</strong> pour la livraison offerte
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-slate-600 font-mono text-[11px]">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0075FF] to-cyan-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Body: Items list or Empty State */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                      <ShoppingBag className="w-10 h-10 stroke-1" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900">Votre panier est vide</h3>
                      <p className="text-xs text-slate-500 max-w-[240px]">
                        Découvrez nos PC portables testés et composants gamer aux meilleurs prix !
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        closeCart();
                        navigate('/products');
                      }}
                      className="px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Explorer le catalogue
                    </button>
                  </div>
                ) : (
                  items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center"
                    >
                      <img
                        src={item.product.images[0]?.url}
                        alt={item.product.name}
                        className="w-18 h-18 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shrink-0"
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        
                        {(item.selectedColor || item.selectedSpec) && (
                          <div className="flex flex-wrap gap-1 text-[10px] text-slate-500">
                            {item.selectedColor && (
                              <span className="px-1.5 py-0.5 bg-slate-100 rounded-md">
                                {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSpec && (
                              <span className="px-1.5 py-0.5 bg-slate-100 rounded-md">
                                {item.selectedSpec}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="text-xs font-extrabold text-[#DC2626] font-mono">
                          {item.product.priceDzd.toLocaleString()} DZD
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                              aria-label="Diminuer la quantité"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-slate-900 font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                              aria-label="Augmenter la quantité"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-4">
                  {/* Coupon Code Input */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Code promo (ex: YOUPPI10)"
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs uppercase focus:outline-none focus:border-[#DC2626]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Appliquer
                    </button>
                  </form>

                  {couponCode && (
                    <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Code « {couponCode} » actif
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold underline cursor-pointer"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}

                  {/* Calculations */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span className="font-mono font-semibold text-slate-900">{subtotal.toLocaleString()} DZD</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Réduction code promo</span>
                        <span className="font-mono">- {discount.toLocaleString()} DZD</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Livraison estimée</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {shippingFee === 0 ? (
                          <span className="text-emerald-600 font-bold uppercase text-[11px]">Gratuite</span>
                        ) : (
                          `${shippingFee.toLocaleString()} DZD`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total TTC</span>
                      <span className="font-mono text-base text-[#0075FF] font-black">{total.toLocaleString()} DZD</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={handleGoToCheckout}
                      className="w-full py-3.5 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0060DF] hover:to-[#004DB3] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-cyan-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Passer la commande</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleGoToCartPage}
                      className="w-full py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors text-center cursor-pointer"
                    >
                      Voir le panier complet
                    </button>
                  </div>

                  {/* Safe Trust Badges */}
                  <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Garantie test 30j
                    </span>
                    <span>•</span>
                    <span>Paiement à la livraison</span>
                    <span>•</span>
                    <span>58 Wilayas</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
