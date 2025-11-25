import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, MessageCircle, Shield, Package, RefreshCw, Star, ChevronLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import PriceNegotiation from './PriceNegotiation';

const API_URL = 'http://127.0.0.1:8000/backend/api';

export default function ProductDetail() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products.php?id=${id}`);
      const data = await response.json();
      
      if (data.success) {
        // Map condition to label
        const conditionMap = {
          'new': { vi: 'Mới', en: 'New' },
          'like-new': { vi: 'Như mới', en: 'Like New' },
          'good': { vi: 'Tốt', en: 'Good' },
          'fair': { vi: 'Khá', en: 'Fair' },
          'used': { vi: 'Đã sử dụng', en: 'Used' },
          'damaged': { vi: 'Hư hỏng', en: 'Damaged' },
          'repaired': { vi: 'Đã sửa chữa', en: 'Repaired' }
        };

        // Map API fields to component fields
        const mappedProduct = {
          ...data.data,
          name: data.data.title,
          originalPrice: data.data.original_price || data.data.price,
          image: data.data.images?.[0] || '',
          category: data.data.category_name || '',
          conditionLabel: conditionMap[data.data.condition]?.[language] || data.data.condition,
          conditionDetail: data.data.condition_detail || '',
          minAcceptablePrice: data.data.min_acceptable_price || data.data.price * 0.8,
          allowNegotiation: data.data.allow_negotiation !== false,
          specifications: data.data.specifications || {},
          reviews: [], // TODO: Fetch reviews from API
          seller: {
            id: data.data.seller_id,
            name: data.data.seller_name,
            avatar: data.data.seller_avatar,
            rating: 4.8, // TODO: Get from reviews
            totalSales: 150, // TODO: Get from orders
            responseRate: 95, // TODO: Get from messages
          }
        };
        setProduct(mappedProduct);
      } else {
        toast.error(language === 'vi' ? 'Không tìm thấy sản phẩm' : 'Product not found');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error(language === 'vi' ? 'Lỗi tải sản phẩm' : 'Error loading product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{language === 'vi' ? 'Đang tải...' : 'Loading...'}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{language === 'vi' ? 'Không tìm thấy sản phẩm' : 'Product not found'}</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      sellerId: product.seller.id,
    });

    toast.success(language === 'vi' ? 'Đã thêm vào giỏ hàng' : 'Added to cart');
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    handleAddToCart();
    navigate('/checkout');
  };

  const handleContactSeller = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          other_user_id: product.seller.id,
          product_id: product.id,
          message: `Xin chào, tôi quan tâm đến sản phẩm "${product.name}"`,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Server error:', text);
        toast.error('Lỗi server: ' + response.status);
        return;
      }

      const data = await response.json();
      if (data.success) {
        navigate('/messages');
      } else {
        toast.error(data.message || 'Không thể tạo tin nhắn');
      }
    } catch (error) {
      console.error('Error creating message thread:', error);
      toast.error('Không thể tạo tin nhắn');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-purple-600">{t('home')}</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-purple-600">{t('products')}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ChevronLeft className="size-4 mr-2" />
        {language === 'vi' ? 'Quay lại' : 'Back'}
      </Button>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index ? 'border-purple-600' : 'border-transparent'
                }`}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.brand}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="size-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="size-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl text-purple-600">{product.price.toLocaleString('vi-VN')}₫</span>
            <span className="text-xl text-gray-500 line-through">{product.originalPrice.toLocaleString('vi-VN')}₫</span>
            <Badge variant="destructive">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </Badge>
          </div>

          {/* Condition */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-600">{t('condition')}:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="size-3 mr-1" />
                {product.conditionLabel}
              </Badge>
            </div>
            {product.conditionDetail && (
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {product.conditionDetail}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              size="lg"
              variant="outline"
              onClick={handleAddToCart}
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              {t('addToCart')}
            </Button>
            <Button
              size="lg"
              onClick={handleBuyNow}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {t('buyNow')}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleContactSeller}
            >
              <MessageCircle className="size-4 mr-2" />
              {t('contactSeller')}
            </Button>
            <PriceNegotiation
              productId={product.id}
              currentPrice={product.price}
              minAcceptablePrice={product.minAcceptablePrice}
              sellerId={product.seller.id}
              allowNegotiation={product.allowNegotiation}
            />
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <Shield className="size-8 mx-auto mb-2 text-purple-600" />
              <p className="text-xs text-gray-600">
                {language === 'vi' ? 'Bảo vệ người mua' : 'Buyer Protection'}
              </p>
            </div>
            <div className="text-center">
              <Package className="size-8 mx-auto mb-2 text-purple-600" />
              <p className="text-xs text-gray-600">
                {language === 'vi' ? 'Đóng gói cẩn thận' : 'Careful Packaging'}
              </p>
            </div>
            <div className="text-center">
              <RefreshCw className="size-8 mx-auto mb-2 text-purple-600" />
              <p className="text-xs text-gray-600">
                {language === 'vi' ? 'Đổi trả dễ dàng' : 'Easy Returns'}
              </p>
            </div>
          </div>

          {/* Seller Info */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="mb-4">{language === 'vi' ? 'Thông tin người bán' : 'Seller Information'}</h3>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="size-16">
                  <AvatarImage src={product.seller.avatar} />
                  <AvatarFallback>{product.seller.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="mb-1">{product.seller.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.seller.rating} ({product.seller.totalSales} {language === 'vi' ? 'đánh giá' : 'reviews'})</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">{language === 'vi' ? 'Đã bán' : 'Sales'}</p>
                  <p>{product.seller.totalSales}</p>
                </div>
                <div>
                  <p className="text-gray-600">{language === 'vi' ? 'Tỉ lệ phản hồi' : 'Response Rate'}</p>
                  <p>{product.seller.responseRate}%</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to={`/seller/${product.seller.id}`}>
                  {language === 'vi' ? 'Xem shop' : 'View Shop'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="description">{t('description')}</TabsTrigger>
          <TabsTrigger value="specifications">
            {language === 'vi' ? 'Thông số' : 'Specifications'}
          </TabsTrigger>
          <TabsTrigger value="reviews">{t('reviews')} ({product.reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="whitespace-pre-line">{product.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex border-b pb-3 last:border-0">
                    <span className="w-1/3 text-gray-600">{key}</span>
                    <span className="w-2/3">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback>{review.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4>{review.user}</h4>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div>
        <h2 className="text-2xl mb-6">{language === 'vi' ? 'Sản phẩm tương tự' : 'Similar Products'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Link key={i} to={`/products/${i}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${1551028719 + i}-00167b16eac5?w=400`}
                    alt={`Product ${i}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 line-clamp-2">{language === 'vi' ? `Sản phẩm ${i}` : `Product ${i}`}</h3>
                  <p className="text-purple-600">450,000₫</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
