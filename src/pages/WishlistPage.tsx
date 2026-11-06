import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from '../router/Router';
import { ProductCard } from '../components/common/ProductCard';
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const handleAddAllToCart = () => {
    wishlist.forEach(item => {
      if (item.stockQuantity > 0 && item.status === 'available') {
        addToCart(item, 1);
      }
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-sm max-w-md mx-auto space-y-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-blue-50 text-[#0075FF] mx-auto flex items-center justify-center shadow-inner">
            <Heart className="w-12 h-12 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Votre liste de favoris est vide
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Enregistrez vos produits coup de cœur en cliquant sur l'icône cœur pour les retrouver facilement plus tard !
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0066E0] hover:to-[#004EC2] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/35 transition-all"
            >
              <span>Explorer nos PC & Composants</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à la boutique</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-[#0075FF] fill-[#0075FF]" />
            <span>Mes Favoris ({wishlist.length})</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddAllToCart}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tout ajouter au panier</span>
          </button>

          <button
            onClick={clearWishlist}
            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            aria-label="Vider les favoris"
            title="Vider la liste"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Wishlist Products */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {wishlist.map(product => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
