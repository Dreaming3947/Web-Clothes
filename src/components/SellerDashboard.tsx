import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Package, DollarSign, TrendingUp, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

const API_URL = 'http://127.0.0.1:8000/backend/api';

export default function SellerDashboard() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total_revenue: 0,
    active_listings: 0,
    new_orders: 0,
    unread_messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is seller
    if (!user || user.role !== 'seller') {
      toast.error(language === 'vi' ? 'Chỉ người bán mới truy cập được trang này' : 'Only sellers can access this page');
      navigate('/');
      return;
    }
    fetchSellerData();
  }, [user, navigate, language]);

  const fetchSellerData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch seller's products
      const productsRes = await fetch(`${API_URL}/products.php?seller_id=${user?.id}`, { headers });
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        const products = productsData.data || productsData.message || [];
        setListings(products);
        
        // Calculate stats
        const activeCount = products.filter((p: any) => p.status === 'approved' || p.status === 'pending').length;
        setStats(prev => ({ ...prev, active_listings: activeCount }));
      }

      // Fetch seller's orders
      const ordersRes = await fetch(`${API_URL}/orders.php?type=seller`, { headers });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const ordersList = ordersData.data || ordersData.message || [];
        setOrders(ordersList);
        
        // Calculate total revenue from all orders
        const totalRevenue = ordersList.reduce((sum: number, order: any) => {
          return sum + parseFloat(order.final_amount || order.total_amount || 0);
        }, 0);
        
        // Count new orders (pending status)
        const newOrdersCount = ordersList.filter((o: any) => o.status === 'pending').length;
        
        setStats(prev => ({ 
          ...prev, 
          total_revenue: totalRevenue,
          new_orders: newOrdersCount
        }));
      }

      // TODO: Fetch unread messages count when API is ready
      
    } catch (error) {
      console.error('Error fetching seller data:', error);
      toast.error(language === 'vi' ? 'Lỗi tải dữ liệu' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm(language === 'vi' ? 'Bạn có chắc muốn xóa sản phẩm này?' : 'Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products.php?id=${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success(language === 'vi' ? 'Đã xóa sản phẩm' : 'Product deleted');
        fetchSellerData();
      } else {
        toast.error(language === 'vi' ? 'Lỗi xóa sản phẩm' : 'Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(language === 'vi' ? 'Lỗi xóa sản phẩm' : 'Error deleting product');
    }
  };

  const statsDisplay = [
    {
      title: language === 'vi' ? 'Tổng doanh thu' : 'Total Revenue',
      value: stats.total_revenue.toLocaleString('vi-VN') + '₫',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: language === 'vi' ? 'Sản phẩm đang bán' : 'Active Listings',
      value: stats.active_listings.toString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: language === 'vi' ? 'Đơn hàng mới' : 'New Orders',
      value: stats.new_orders.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: language === 'vi' ? 'Tin nhắn chưa đọc' : 'Unread Messages',
      value: stats.unread_messages.toString(),
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { vi: string; en: string }> = {
      active: { vi: 'Đang bán', en: 'Active' },
      sold: { vi: 'Đã bán', en: 'Sold' },
      pending: { vi: 'Chờ duyệt', en: 'Pending' },
      processing: { vi: 'Đang xử lý', en: 'Processing' },
      completed: { vi: 'Hoàn thành', en: 'Completed' },
    };
    return labels[status]?.[language] || status;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">{t('sellerDashboard')}</h1>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600" asChild>
          <Link to="/create-listing">
            <Plus className="size-5 mr-2" />
            {t('createListing')}
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">{language === 'vi' ? 'Đang tải...' : 'Loading...'}</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsDisplay.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`size-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`size-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

      {/* Tabs */}
      <Tabs defaultValue="listings">
        <TabsList>
          <TabsTrigger value="listings">{t('myListings')}</TabsTrigger>
          <TabsTrigger value="orders">{t('orders')}</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('myListings')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listings.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="size-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">
                      {language === 'vi' ? 'Bạn chưa có sản phẩm nào' : 'You have no listings yet'}
                    </p>
                    <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
                      <Link to="/create-listing">
                        <Plus className="size-5 mr-2" />
                        {language === 'vi' ? 'Đăng tin bán' : 'Create Listing'}
                      </Link>
                    </Button>
                  </div>
                ) : (
                  listings.map((listing) => (
                    <div key={listing.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <img
                        src={listing.images?.[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'}
                        alt={listing.title}
                        className="size-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="mb-1">{listing.title}</h3>
                            <p className="text-purple-600">{listing.price.toLocaleString('vi-VN')}₫</p>
                          </div>
                          <Badge className={getStatusColor(listing.status)}>
                            {getStatusLabel(listing.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Eye className="size-4" />
                            {listing.views_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            ❤️ {listing.favorites_count || 0}
                          </span>
                          <span>{new Date(listing.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/products/${listing.id}`}>
                              <Eye className="size-4 mr-2" />
                              {language === 'vi' ? 'Xem' : 'View'}
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/edit-listing/${listing.id}`}>
                              <Edit className="size-4 mr-2" />
                              {language === 'vi' ? 'Sửa' : 'Edit'}
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteProduct(listing.id)}
                          >
                            <Trash2 className="size-4 mr-2" />
                            {language === 'vi' ? 'Xóa' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'vi' ? 'Đơn hàng' : 'Orders'}</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="size-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    {language === 'vi' ? 'Chưa có đơn hàng nào' : 'No orders yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-sm text-gray-600">
                            {language === 'vi' ? 'Mã đơn:' : 'Order Code:'} 
                          </span>
                          <span className="font-semibold ml-2">{order.order_code}</span>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2 mb-3">
                        {order.items && order.items.map((item: any) => (
                          <div key={item.id} className="flex gap-3 text-sm">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'}
                              alt={item.product_name}
                              className="w-12 h-12 rounded object-cover flex-shrink-0"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.product_name || item.title}</p>
                              <p className="text-gray-600">
                                {language === 'vi' ? 'SL:' : 'Qty:'} {item.quantity} × {parseFloat(item.product_price).toLocaleString('vi-VN')}₫
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Buyer Info */}
                      <div className="text-sm text-gray-600 mb-3">
                        <p>
                          <span className="font-medium">{language === 'vi' ? 'Người mua:' : 'Buyer:'}</span> {order.buyer_name}
                        </p>
                        <p>
                          <span className="font-medium">{language === 'vi' ? 'SĐT:' : 'Phone:'}</span> {order.buyer_phone}
                        </p>
                        <p>
                          <span className="font-medium">{language === 'vi' ? 'Địa chỉ:' : 'Address:'}</span> {order.shipping_address}
                        </p>
                      </div>

                      {/* Order Total */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="text-lg font-semibold text-purple-600">
                          {parseFloat(order.final_amount).toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </>
      )}
    </div>
  );
}
