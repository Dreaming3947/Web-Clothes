import { Users, Package, DollarSign, TrendingUp, Eye, Edit, Trash2, Ban } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function AdminDashboard() {
  const { language, t } = useLanguage();

  const stats = [
    {
      title: language === 'vi' ? 'Tổng người dùng' : 'Total Users',
      value: '2,543',
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: language === 'vi' ? 'Tổng sản phẩm' : 'Total Products',
      value: '8,234',
      change: '+8.2%',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: language === 'vi' ? 'Doanh thu tháng' : 'Monthly Revenue',
      value: '456M₫',
      change: '+15.3%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: language === 'vi' ? 'Đơn hàng' : 'Total Orders',
      value: '1,234',
      change: '+10.1%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const users = [
    {
      id: '1',
      name: 'Nguyen Van A',
      email: 'nguyenvana@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      role: 'seller',
      status: 'active',
      joinedDate: '2024-01-15',
      totalSales: 45,
    },
    {
      id: '2',
      name: 'Tran Thi B',
      email: 'tranthib@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      role: 'buyer',
      status: 'active',
      joinedDate: '2024-02-20',
      totalSales: 0,
    },
    {
      id: '3',
      name: 'Le Van C',
      email: 'levanc@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      role: 'seller',
      status: 'suspended',
      joinedDate: '2024-03-10',
      totalSales: 23,
    },
  ];

  const products = [
    {
      id: '1',
      name: 'Áo khoác denim vintage',
      seller: 'Nguyen Van A',
      price: 450000,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200',
      status: 'approved',
      views: 234,
      createdAt: '2024-11-15',
    },
    {
      id: '2',
      name: 'Túi xách Louis Vuitton',
      seller: 'Tran Thi B',
      price: 8500000,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200',
      status: 'pending',
      views: 45,
      createdAt: '2024-11-20',
    },
    {
      id: '3',
      name: 'Giày thể thao Nike Air',
      seller: 'Le Van C',
      price: 1200000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
      status: 'rejected',
      views: 12,
      createdAt: '2024-11-18',
    },
  ];

  const recentOrders = [
    {
      id: 'ORD001',
      buyer: 'Nguyen Van A',
      seller: 'Tran Thi B',
      product: 'Áo khoác denim',
      amount: 450000,
      status: 'completed',
      date: '2024-11-20',
    },
    {
      id: 'ORD002',
      buyer: 'Le Van C',
      seller: 'Pham Thi D',
      product: 'Giày Nike',
      amount: 1200000,
      status: 'processing',
      date: '2024-11-20',
    },
    {
      id: 'ORD003',
      buyer: 'Tran Van E',
      seller: 'Nguyen Thi F',
      product: 'Túi xách LV',
      amount: 8500000,
      status: 'shipping',
      date: '2024-11-19',
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
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`size-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`size-6 ${stat.color}`} />
                </div>
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
              <p className="text-2xl mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
                {users.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Avatar className="size-16">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3>{user.name}</h3>
                        <Badge variant="secondary" className="capitalize">
                          {user.role}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusLabel(user.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{language === 'vi' ? 'Tham gia' : 'Joined'}: {user.joinedDate}</span>
                        {user.totalSales > 0 && (
                          <span>{language === 'vi' ? 'Đã bán' : 'Sales'}: {user.totalSales}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="size-4 mr-2" />
                        {language === 'vi' ? 'Xem' : 'View'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="size-4 mr-2" />
                        {language === 'vi' ? 'Sửa' : 'Edit'}
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Ban className="size-4 mr-2" />
                        {user.status === 'suspended' ? (language === 'vi' ? 'Mở khóa' : 'Unban') : (language === 'vi' ? 'Khóa' : 'Ban')}
                      </Button>
                    </div>
                  </div>
                ))}
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
                {products.map((product) => (
                  <div key={product.id} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-600">
                            {language === 'vi' ? 'Người bán' : 'Seller'}: {product.seller}
                          </p>
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
                        <span>{product.createdAt}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="size-4 mr-2" />
                          {language === 'vi' ? 'Xem' : 'View'}
                        </Button>
                        {product.status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              ✓ {language === 'vi' ? 'Duyệt' : 'Approve'}
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              ✗ {language === 'vi' ? 'Từ chối' : 'Reject'}
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="size-4 mr-2" />
                          {language === 'vi' ? 'Xóa' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="py-4 text-purple-600">{order.id}</td>
                        <td className="py-4">{order.buyer}</td>
                        <td className="py-4">{order.seller}</td>
                        <td className="py-4">{order.product}</td>
                        <td className="py-4">{order.amount.toLocaleString('vi-VN')}₫</td>
                        <td className="py-4">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </td>
                        <td className="py-4">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
