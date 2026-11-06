import { Order } from '../types';

const STORAGE_KEY_ORDERS = 'youppi_orders_v1';

export const orderService = {
  getOrders(): Order[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  getOrderById(id: string): Order | null {
    const orders = this.getOrders();
    return orders.find(o => o.id === id || o.orderNumber === id) || null;
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const orderNumber = `YP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now().toString(36),
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save order to localStorage', e);
    }

    return newOrder;
  }
};
