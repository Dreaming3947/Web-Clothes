import { Link } from 'react-router-dom';
import { Package, Heart, Star, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function BuyerDashboard() {
  const { language, t } = useLanguage();

  const orders = [
    {
      id: 'ORD001',
      product: {
        name: 'Áo khoác denim vintage',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200',
        price: 450000,
        size: 'M',
      },
      seller: 'Nguyen Van A',
      status: 'delivered',
      orderDate: '2024-11-15',
      deliveryDate: '2024-11-18',
    },
    {
      id: 'ORD002',
      product: {
        name: 'Giày thể thao Nike Air',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
        price: 1200000,
        size: '42',
      },
      seller: 'Tran Thi B',
      status: 'shipping',
      orderDate: '2024-11-18',
      deliveryDate: '2024-11-22',
    },
    {
      id: 'ORD003',
      product: {
        name: 'Túi xách Louis Vuitton',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200',
        price: 8500000,
        size: 'One Size',
      },
      seller: 'Le Van C',
      status: 'processing',
      orderDate: '2024-11-20',
      deliveryDate: '2024-11-25',
    },
  ];

  const favorites = [
    {
      id: '1',
      name: 'Váy maxi boho',
      price: 550000,
      originalPrice: 1500000,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      condition: 'Like New',
      seller: 'Nguyen Thi E',
    },
    {
      id: '2',
      name: 'Áo blazer công sở',
      price: 680000,
      originalPrice: 1800000,
      image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400',
      condition: 'Good',
      seller: 'Tran Van F',
    },
    {
      id: '3',
      name: 'Quần jeans skinny',
      price: 380000,
      originalPrice: 1000000,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      condition: 'Like New',
      seller: 'Le Thi G',
    },
    {
      id: '4',
      name: 'Áo hoodie streetwear',
      price: 520000,
      originalPrice: 1200000,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      condition: 'Good',
      seller: 'Pham Van H',
    },
  ];

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">{t('buyerDashboard')}</h1>

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
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Link to={`/orders/${order.id}`} className="text-purple-600 hover:underline mb-1">
                        {order.id}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {language === 'vi' ? 'Đặt ngày' : 'Ordered on'} {order.orderDate}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      <span className="mr-1">{getStatusIcon(order.status)}</span>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <Link to={`/products/${order.product.name}`}>
                      <img
                        src={order.product.image}
                        alt={order.product.name}
                        className="size-24 rounded-lg object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/products/${order.product.name}`} className="hover:text-purple-600">
                        <h3 className="mb-1">{order.product.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'vi' ? 'Người bán' : 'Seller'}: {order.seller}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">Size: {order.product.size}</p>
                      <p className="text-purple-600">{order.product.price.toLocaleString('vi-VN')}₫</p>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Clock className="size-4" />
                      <span>
                        {language === 'vi' ? 'Dự kiến giao' : 'Expected delivery'}: {order.deliveryDate}
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
                        <Button variant="outline" size="sm">
                          {language === 'vi' ? 'Mua lại' : 'Buy Again'}
                        </Button>
                      </>
                    )}
                    {order.status === 'shipping' && (
                      <Button variant="outline" size="sm">
                        <MapPin className="size-4 mr-2" />
                        {language === 'vi' ? 'Theo dõi đơn hàng' : 'Track Order'}
                      </Button>
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
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
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
                      onClick={(e) => {
                        e.preventDefault();
                        // Remove from favorites logic
                      }}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
