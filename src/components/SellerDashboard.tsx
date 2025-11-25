import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Package, DollarSign, TrendingUp, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function SellerDashboard() {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  // TODO: Replace with API call to fetch seller's statistics
  const stats = [
    {
      title: language === 'vi' ? 'Tổng doanh thu' : 'Total Revenue',
      value: '0₫',
      change: '0%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: language === 'vi' ? 'Sản phẩm đang bán' : 'Active Listings',
      value: '0',
      change: '0',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: language === 'vi' ? 'Đơn hàng mới' : 'New Orders',
      value: '0',
      change: '0',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: language === 'vi' ? 'Tin nhắn chưa đọc' : 'Unread Messages',
      value: '0',
      change: '',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  // TODO: Replace with API call to fetch seller's listings
  const listings: any[] = [];

  // TODO: Replace with API call to fetch seller's orders
  const orders: any[] = [];

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

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`size-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`size-6 ${stat.color}`} />
                </div>
                {stat.change && (
                  <span className="text-sm text-green-600">{stat.change}</span>
                )}
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
                {listings.map((listing) => (
                  <div key={listing.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <img
                      src={listing.image}
                      alt={listing.name}
                      className="size-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="mb-1">{listing.name}</h3>
                          <p className="text-purple-600">{listing.price.toLocaleString('vi-VN')}₫</p>
                        </div>
                        <Badge className={getStatusColor(listing.status)}>
                          {getStatusLabel(listing.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Eye className="size-4" />
                          {listing.views}
                        </span>
                        <span className="flex items-center gap-1">
                          ❤️ {listing.likes}
                        </span>
                        <span>{listing.createdAt}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/products/${listing.id}`}>
                            <Eye className="size-4 mr-2" />
                            {language === 'vi' ? 'Xem' : 'View'}
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="size-4 mr-2" />
                          {language === 'vi' ? 'Sửa' : 'Edit'}
                        </Button>
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
              <CardTitle>{t('orders')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3">{language === 'vi' ? 'Mã đơn' : 'Order ID'}</th>
                      <th className="pb-3">{language === 'vi' ? 'Sản phẩm' : 'Product'}</th>
                      <th className="pb-3">{language === 'vi' ? 'Người mua' : 'Buyer'}</th>
                      <th className="pb-3">{language === 'vi' ? 'Giá' : 'Price'}</th>
                      <th className="pb-3">{language === 'vi' ? 'Trạng thái' : 'Status'}</th>
                      <th className="pb-3">{language === 'vi' ? 'Ngày' : 'Date'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="py-4">
                          <Link to={`/orders/${order.id}`} className="text-purple-600 hover:underline">
                            {order.id}
                          </Link>
                        </td>
                        <td className="py-4">{order.product}</td>
                        <td className="py-4">{order.buyer}</td>
                        <td className="py-4">{order.price.toLocaleString('vi-VN')}₫</td>
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
