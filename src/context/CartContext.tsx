import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CartItem } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSpec?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemsCount: number;
  subtotal: number;
  discount: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  shippingFee: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  badgeAnimate: boolean;
}

const CART_STORAGE_KEY = 'youppi_cart_v1';
const COUPON_STORAGE_KEY = 'youppi_coupon_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>(() => {
    try {
      return localStorage.getItem(COUPON_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [badgeAnimate, setBadgeAnimate] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (couponCode) {
        localStorage.setItem(COUPON_STORAGE_KEY, couponCode);
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [couponCode]);

  const triggerBadgeAnimation = useCallback(() => {
    setBadgeAnimate(true);
    setTimeout(() => setBadgeAnimate(false), 700);
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1, selectedColor?: string, selectedSpec?: string) => {
    const variantId = `${product.id}_${selectedColor || 'default'}_${selectedSpec || 'default'}`;

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === variantId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        const maxStock = product.stockQuantity || 99;
        updated[existingIndex].quantity = Math.min(newQty, maxStock);
        return updated;
      } else {
        const newItem: CartItem = {
          id: variantId,
          productId: product.id,
          product,
          quantity: Math.min(quantity, product.stockQuantity || 99),
          selectedColor,
          selectedSpec,
          addedAt: new Date().toISOString(),
        };
        return [...prevItems, newItem];
      }
    });

    triggerBadgeAnimation();
    showToast({
      type: 'success',
      title: 'Ajouté au panier !',
      message: `${product.name} (x${quantity})`,
    });
  }, [triggerBadgeAnimation, showToast]);

  const removeFromCart = useCallback((cartItemId: string) => {
    setItems(prev => prev.filter(item => item.id !== cartItemId));
    showToast({
      type: 'info',
      title: 'Article retiré du panier',
    });
  }, [showToast]);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          const maxStock = item.product.stockQuantity || 99;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode('');
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.product.priceDzd * item.quantity, 0);
  }, [items]);

  const itemsCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const freeShippingThreshold = 50000; // 50,000 DZD for free shipping
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const baseShippingFee = subtotal > 0 ? (subtotal >= freeShippingThreshold ? 0 : 900) : 0;

  const discount = useMemo(() => {
    if (!couponCode) return 0;
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === 'YOUPPI10') {
      return Math.round(subtotal * 0.1); // 10% off
    }
    if (cleanCode === 'GAMER20' && subtotal >= 100000) {
      return Math.round(subtotal * 0.2); // 20% off
    }
    if (cleanCode === 'WELCOME5') {
      return Math.round(subtotal * 0.05); // 5% off
    }
    return 0;
  }, [couponCode, subtotal]);

  const applyCoupon = useCallback((code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'YOUPPI10' || (clean === 'GAMER20' && subtotal >= 100000) || clean === 'WELCOME5') {
      setCouponCode(clean);
      showToast({
        type: 'success',
        title: 'Code promo appliqué !',
        message: clean === 'YOUPPI10' ? '-10% sur toute votre commande' : '-5% de réduction bienvenue',
      });
      return true;
    } else {
      showToast({
        type: 'error',
        title: 'Code promo invalide',
        message: 'Veuillez vérifier le code saisi (ex: YOUPPI10)',
      });
      return false;
    }
  }, [subtotal, showToast]);

  const removeCoupon = useCallback(() => {
    setCouponCode('');
    showToast({
      type: 'info',
      title: 'Code promo retiré',
    });
  }, [showToast]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + baseShippingFee);
  }, [subtotal, discount, baseShippingFee]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemsCount,
        subtotal,
        discount,
        couponCode,
        applyCoupon,
        removeCoupon,
        shippingFee: baseShippingFee,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        total,
        isCartOpen,
        openCart,
        closeCart,
        badgeAnimate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
