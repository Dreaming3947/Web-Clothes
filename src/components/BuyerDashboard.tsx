import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, Star, MapPin, Clock, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

const API_URL = 'http://127.0.0.1:8000/backend/api';

export default function BuyerDashboard() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuyerData();
  }, []);

  const fetchBuyerData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch orders
      const ordersRes = await fetch(`${API_URL}/orders.php?type=buyer`, { headers });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const ordersList = ordersData.data || ordersData.message || [];
        setOrders(ordersList);
      }

      // Fetch favorites
      const favoritesRes = await fetch(`${API_URL}/products.php?action=favorites`, { headers });
      if (favoritesRes.ok) {
        const favoritesData = await favoritesRes.json();
        console.log('Favorites API response:', favoritesData);
        const favoritesList = favoritesData.data || [];
        console.log('Favorites list length:', favoritesList.length);
        // Map favorites to display format
        const mappedFavorites = favoritesList.map((fav: any) => ({
          id: fav.id,
          name: fav.title,
          image: fav.images?.[0] || fav.primary_image || 'https://via.placeholder.com/400',
          price: parseFloat(fav.price),
          originalPrice: parseFloat(fav.original_price || fav.price),
          condition: fav.condition
        }));
        setFavorites(mappedFavorites);
      }

    } catch (error) {
      console.error('Error fetching buyer data:', error);
      toast.error(language === 'vi' ? 'Lỗi tải dữ liệu' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipping':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { vi: string; en: string }> = {
      delivered: { vi: 'Đã giao', en: 'Delivered' },
      shipping: { vi: 'Đang giao', en: 'Shipping' },
      processing: { vi: 'Đang xử lý', en: 'Processing' },
      cancelled: { vi: 'Đã hủy', en: 'Cancelled' },
    };
    return labels[status]?.[language] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return '✓';
      case 'shipping':
        return '🚚';
      case 'processing':
        return '📦';
      default:
        return '•';
    }
  };

  const handleRemoveFavorite = async (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products.php?id=${productId}&action=favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        // Remove from local state
        setFavorites(favorites.filter(f => f.id !== productId));
        toast.success(language === 'vi' ? 'Đã xóa khỏi yêu thích' : 'Removed from favorites');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error(language === 'vi' ? 'Lỗi khi xóa yêu thích' : 'Error removing from favorites');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">
        {language === 'vi' ? 'Đơn hàng của tôi' : 'My Orders'}
      </h1>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">{language === 'vi' ? 'Đang tải...' : 'Loading...'}</p>
        </div>
      ) : (
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">
              <Package className="size-4 mr-2" />
              {t('myOrders')}
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="size-4 mr-2" />
              {t('favorites')}
            </TabsTrigger>
          </TabsList>

        <TabsContent value="orders" className="mt-6">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <ShoppingBag className="size-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">
                    {language === 'vi' ? 'Bạn chưa có đơn hàng nào' : 'You have no orders yet'}
                  </p>
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Link to="/products">
                      {language === 'vi' ? 'Khám phá sản phẩm' : 'Explore Products'}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-purple-600 mb-1">
                        {order.order_code}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'vi' ? 'Đặt ngày' : 'Ordered on'} {new Date(order.created_at).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'vi' ? 'Người bán' : 'Seller'}: {order.seller_name}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      <span className="mr-1">{getStatusIcon(order.status)}</span>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items && order.items.map((item: any) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'}
                          alt={item.title || item.product_name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="mb-1">{item.title || item.product_name}</h3>
                          <p className="text-sm text-gray-600">
                            {language === 'vi' ? 'Số lượng' : 'Quantity'}: {item.quantity}
                          </p>
                          <p className="text-purple-600">{parseFloat(item.product_price).toLocaleString('vi-VN')}₫</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">{language === 'vi' ? 'Tổng tiền' : 'Total'}:</span>
                      <span className="text-xl font-semibold text-purple-600">
                        {parseFloat(order.final_amount).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {order.status === 'delivered' && (
                      <>
                        <Button variant="outline" size="sm">
                          <Star className="size-4 mr-2" />
                          {language === 'vi' ? 'Đánh giá' : 'Review'}
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/messages">
                        {language === 'vi' ? 'Liên hệ người bán' : 'Contact Seller'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          {favorites.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Heart className="size-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">
                    {language === 'vi' ? 'Chưa có sản phẩm yêu thích' : 'No favorite products yet'}
                  </p>
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Link to="/products">
                      {language === 'vi' ? 'Tìm sản phẩm yêu thích' : 'Find Favorite Products'}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <Link key={item.id} to={`/products/${item.id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      onClick={(e) => handleRemoveFavorite(item.id, e)}
                    >
                      <Heart className="size-4 fill-red-500 text-red-500" />
                    </Button>
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 line-clamp-2">{item.name}</h3>
                    <div className="space-y-1 mb-3">
                      <p className="text-purple-600">{item.price.toLocaleString('vi-VN')}₫</p>
                      <p className="text-sm text-gray-500 line-through">
                        {item.originalPrice.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                        {item.condition}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      )}
    </div>
  );
}
