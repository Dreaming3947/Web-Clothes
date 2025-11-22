import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface Translations {
  [key: string]: {
    vi: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { vi: 'Trang chủ', en: 'Home' },
  products: { vi: 'Sản phẩm', en: 'Products' },
  cart: { vi: 'Giỏ hàng', en: 'Cart' },
  messages: { vi: 'Tin nhắn', en: 'Messages' },
  login: { vi: 'Đăng nhập', en: 'Login' },
  register: { vi: 'Đăng ký', en: 'Register' },
  logout: { vi: 'Đăng xuất', en: 'Logout' },
  profile: { vi: 'Tài khoản', en: 'Profile' },
  
  // Common
  search: { vi: 'Tìm kiếm', en: 'Search' },
  filter: { vi: 'Lọc', en: 'Filter' },
  sort: { vi: 'Sắp xếp', en: 'Sort' },
  price: { vi: 'Giá', en: 'Price' },
  category: { vi: 'Danh mục', en: 'Category' },
  brand: { vi: 'Thương hiệu', en: 'Brand' },
  size: { vi: 'Size', en: 'Size' },
  color: { vi: 'Màu sắc', en: 'Color' },
  condition: { vi: 'Tình trạng', en: 'Condition' },
  
  // Product
  addToCart: { vi: 'Thêm vào giỏ', en: 'Add to Cart' },
  buyNow: { vi: 'Mua ngay', en: 'Buy Now' },
  contactSeller: { vi: 'Liên hệ người bán', en: 'Contact Seller' },
  productDetails: { vi: 'Chi tiết sản phẩm', en: 'Product Details' },
  description: { vi: 'Mô tả', en: 'Description' },
  reviews: { vi: 'Đánh giá', en: 'Reviews' },
  
  // Seller
  createListing: { vi: 'Đăng tin', en: 'Create Listing' },
  sellerDashboard: { vi: 'Dashboard người bán', en: 'Seller Dashboard' },
  myListings: { vi: 'Tin đăng của tôi', en: 'My Listings' },
  orders: { vi: 'Đơn hàng', en: 'Orders' },
  
  // Buyer
  buyerDashboard: { vi: 'Dashboard người mua', en: 'Buyer Dashboard' },
  myOrders: { vi: 'Đơn hàng của tôi', en: 'My Orders' },
  favorites: { vi: 'Yêu thích', en: 'Favorites' },
  
  // Admin
  adminDashboard: { vi: 'Quản trị', en: 'Admin Dashboard' },
  users: { vi: 'Người dùng', en: 'Users' },
  statistics: { vi: 'Thống kê', en: 'Statistics' },
  
  // Checkout
  checkout: { vi: 'Thanh toán', en: 'Checkout' },
  paymentMethod: { vi: 'Phương thức thanh toán', en: 'Payment Method' },
  shippingAddress: { vi: 'Địa chỉ giao hàng', en: 'Shipping Address' },
  orderSummary: { vi: 'Tóm tắt đơn hàng', en: 'Order Summary' },
  
  // Messages
  sendMessage: { vi: 'Gửi tin nhắn', en: 'Send Message' },
  conversations: { vi: 'Cuộc trò chuyện', en: 'Conversations' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
