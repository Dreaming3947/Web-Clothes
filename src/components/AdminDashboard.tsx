import { useState, useEffect } from 'react';
import { Users, Package, DollarSign, TrendingUp, Eye, Edit, Trash2, Ban, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const API_URL = 'http://127.0.0.1:8000/backend/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  avatar?: string;
  role: string;
  status: string;
  created_at: string;
  total_sales?: number;
}

interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  images: string[];
  status: string;
  views: number;
  created_at: string;
  seller_name?: string;
}

interface Order {
  id: number;
  order_code: string;
  buyer_name: string;
  seller_name: string;
  product_title: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Stats {
  total_users: number;
  total_products: number;
  total_orders: number;
  monthly_revenue: number;
  total_revenue: number;
}

export default function AdminDashboard() {
  const { language, t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
    monthly_revenue: 0,
    total_revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch users
      const usersRes = await fetch(`${API_URL}/admin.php?action=users`, { headers });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        console.log('Users response:', usersData);
        setUsers(usersData.data || []);
      }

      // Fetch products
      const productsRes = await fetch(`${API_URL}/admin.php?action=products`, { headers });
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        console.log('Products response:', productsData);
        setProducts(productsData.data || []);
      }

      // Fetch orders
      const ordersRes = await fetch(`${API_URL}/admin.php?action=orders`, { headers });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        console.log('Orders response:', ordersData);
        setOrders(ordersData.data || []);
      }

      // Fetch stats
      const statsRes = await fetch(`${API_URL}/admin.php?action=stats`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log('Stats response:', statsData);
        setStats(statsData.data || stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: number, action: 'ban' | 'unban' | 'delete') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin.php?action=user-action`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, action })
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleProductAction = async (productId: number, action: 'approve' | 'reject' | 'delete') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin.php?action=product-action`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId, action })
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const statsDisplay = [
    {
      title: language === 'vi' ? 'Tổng người dùng' : 'Total Users',
      value: stats.total_users.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: language === 'vi' ? 'Tổng sản phẩm' : 'Total Products',
      value: stats.total_products.toLocaleString(),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: language === 'vi' ? 'Tổng doanh thu' : 'Total Revenue',
      value: stats.total_revenue.toLocaleString('vi-VN') + '₫',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: language === 'vi' ? 'Doanh thu tháng' : 'Monthly Revenue',
      value: stats.monthly_revenue.toLocaleString('vi-VN') + '₫',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: language === 'vi' ? 'Tổng đơn hàng' : 'Total Orders',
      value: stats.total_orders.toLocaleString(),
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'shipping':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { vi: string; en: string }> = {
      active: { vi: 'Hoạt động', en: 'Active' },
      suspended: { vi: 'Bị khóa', en: 'Suspended' },
      approved: { vi: 'Đã duyệt', en: 'Approved' },
      pending: { vi: 'Chờ duyệt', en: 'Pending' },
      rejected: { vi: 'Từ chối', en: 'Rejected' },
      completed: { vi: 'Hoàn thành', en: 'Completed' },
      processing: { vi: 'Đang xử lý', en: 'Processing' },
      shipping: { vi: 'Đang giao', en: 'Shipping' },
    };
    return labels[status]?.[language] || status;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">{t('adminDashboard')}</h1>

      {/* Stats */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">{language === 'vi' ? 'Đang tải...' : 'Loading...'}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
      )}

      {/* Tabs */}
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">{t('users')}</TabsTrigger>
          <TabsTrigger value="products">{t('products')}</TabsTrigger>
          <TabsTrigger value="orders">{t('orders')}</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'vi' ? 'Quản lý người dùng' : 'User Management'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    {language === 'vi' ? 'Không có người dùng nào' : 'No users found'}
                  </p>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Avatar className="size-16">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3>{user.full_name}</h3>
                          <Badge variant="secondary" className="capitalize">
                            {user.role}
                          </Badge>
                          <Badge className={getStatusColor(user.status)}>
                            {getStatusLabel(user.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{language === 'vi' ? 'Tham gia' : 'Joined'}: {new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                          {user.total_sales && user.total_sales > 0 && (
                            <span>{language === 'vi' ? 'Đã bán' : 'Sales'}: {user.total_sales}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleUserAction(user.id, user.status === 'suspended' ? 'unban' : 'ban')}
                        >
                          <Ban className="size-4 mr-2" />
                          {user.status === 'suspended' ? (language === 'vi' ? 'Mở khóa' : 'Unban') : (language === 'vi' ? 'Khóa' : 'Ban')}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'vi' ? 'Quản lý sản phẩm' : 'Product Management'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    {language === 'vi' ? 'Không có sản phẩm nào' : 'No products found'}
                  </p>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="flex gap-4 p-4 border rounded-lg">
                      <img
                        src={product.images[0] || '/placeholder.jpg'}
                        alt={product.title}
                        className="size-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="mb-1">{product.title}</h3>
                            {product.seller_name && (
                              <p className="text-sm text-gray-600">
                                {language === 'vi' ? 'Người bán' : 'Seller'}: {product.seller_name}
                              </p>
                            )}
                          </div>
                          <Badge className={getStatusColor(product.status)}>
                            {getStatusLabel(product.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="text-purple-600">{product.price.toLocaleString('vi-VN')}₫</span>
                          <span className="flex items-center gap-1">
                            <Eye className="size-4" />
                            {product.views}
                          </span>
                          <span>{new Date(product.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex gap-2">
                          {product.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => window.open(`/products/${product.id}`, '_blank')}
                              >
                                <Eye className="size-4 mr-1" />
                                {language === 'vi' ? 'Xem trước' : 'Preview'}
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleProductAction(product.id, 'approve')}
                              >
                                ✓ {language === 'vi' ? 'Duyệt' : 'Approve'}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600"
                                onClick={() => handleProductAction(product.id, 'reject')}
                              >
                                ✗ {language === 'vi' ? 'Từ chối' : 'Reject'}
                              </Button>
                            </>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleProductAction(product.id, 'delete')}
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
              <CardTitle>{language === 'vi' ? 'Quản lý đơn hàng' : 'Order Management'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {orders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    {language === 'vi' ? 'Không có đơn hàng nào' : 'No orders found'}
                  </p>
                ) : (
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="pb-3">{language === 'vi' ? 'Mã đơn' : 'Order ID'}</th>
                        <th className="pb-3">{language === 'vi' ? 'Người mua' : 'Buyer'}</th>
                        <th className="pb-3">{language === 'vi' ? 'Người bán' : 'Seller'}</th>
                        <th className="pb-3">{language === 'vi' ? 'Sản phẩm' : 'Product'}</th>
                        <th className="pb-3">{language === 'vi' ? 'Số tiền' : 'Amount'}</th>
                        <th className="pb-3">{language === 'vi' ? 'Trạng thái' : 'Status'}</th>
                        <th className="pb-3">{language === 'vi' ? 'Ngày' : 'Date'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b last:border-0">
                          <td className="py-4 text-purple-600">{order.order_code}</td>
                          <td className="py-4">{order.buyer_name}</td>
                          <td className="py-4">{order.seller_name}</td>
                          <td className="py-4">{order.product_title}</td>
                          <td className="py-4">{order.total_amount.toLocaleString('vi-VN')}₫</td>
                          <td className="py-4">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </td>
                          <td className="py-4">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
