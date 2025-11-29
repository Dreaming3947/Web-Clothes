import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

const API_URL = 'http://127.0.0.1:8000/backend/api';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  sellerId: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity' | 'id'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from server when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/cart.php`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        const cartItems = (result.data || result.message || []).map((item: any) => ({
          id: item.id.toString(),
          productId: item.product_id.toString(),
          name: item.name,
          price: parseFloat(item.price),
          image: item.image || '',
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          sellerId: item.seller_id.toString()
        }));
        setItems(cartItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<CartItem, 'quantity' | 'id'>) => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/cart.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: parseInt(item.productId),
          quantity: 1,
          size: item.size,
          color: item.color
        })
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart from server
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add item');
      }
    } catch (error: any) {
      console.error('Error adding item:', error);
      alert(error.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  const removeItem = async (id: string) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/cart.php?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/cart.php?id=${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      });

      if (response.ok) {
        setItems(prev =>
          prev.map(item => (item.id === id ? { ...item, quantity } : item))
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!user) {
      console.log('No user, skipping clearCart');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Clearing cart for user:', user.id);
      
      const response = await fetch(`${API_URL}/cart.php`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      console.log('Clear cart response:', result);

      if (response.ok && result.success) {
        setItems([]);
        console.log('Cart cleared successfully');
      } else {
        // Nếu backend báo lỗi nhưng có thể cart đã được xóa rồi (bởi callback)
        // Thì fetch lại để sync
        console.warn('Clear cart response not success, refetching cart:', result.message);
        await fetchCart();
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Nếu có lỗi, thử fetch lại để sync với backend
      try {
        await fetchCart();
      } catch (fetchError) {
        console.error('Failed to refetch cart:', fetchError);
      }
      throw error; // Re-throw để caller biết có lỗi
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
