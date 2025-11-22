import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, MessageCircle, Shield, Package, RefreshCw, Star, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

export default function ProductDetail() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');

  // Mock product data
  const product = {
    id: id || '1',
    name: 'Áo khoác denim vintage cao cấp',
    price: 450000,
    originalPrice: 1200000,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=800',
    ],
    condition: 'Like New',
    brand: 'Levi\'s',
    category: 'Women',
    availableSizes: ['S', 'M', 'L'],
    color: 'Blue',
    material: 'Cotton Denim',
    description: language === 'vi'
      ? 'Áo khoác denim vintage của Levi\'s, tình trạng như mới. Chất liệu cotton cao cấp, bền đẹp. Phù hợp cho mùa thu đông. Sản phẩm đã được giặt sạch và khử trùng.'
      : 'Vintage Levi\'s denim jacket in like-new condition. Premium cotton material, durable and beautiful. Perfect for fall and winter. Item has been cleaned and sanitized.',
    seller: {
      id: '1',
      name: 'Nguyen Van A',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      rating: 4.8,
      totalSales: 156,
      responseRate: 98,
      joinedDate: '2023-01-15',
    },
    specifications: {
      [language === 'vi' ? 'Thương hiệu' : 'Brand']: 'Levi\'s',
      [language === 'vi' ? 'Chất liệu' : 'Material']: 'Cotton Denim',
      [language === 'vi' ? 'Màu sắc' : 'Color']: language === 'vi' ? 'Xanh denim' : 'Denim Blue',
      [language === 'vi' ? 'Tình trạng' : 'Condition']: 'Like New (95%)',
      [language === 'vi' ? 'Xuất xứ' : 'Origin']: language === 'vi' ? 'Mỹ' : 'USA',
    },
    reviews: [
      {
        id: '1',
        user: 'Tran Thi B',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        rating: 5,
        comment: language === 'vi' 
          ? 'Sản phẩm rất đẹp, chất lượng tốt. Người bán nhiệt tình!'
          : 'Great product, good quality. Seller is very helpful!',
        date: '2024-11-15',
      },
      {
        id: '2',
        user: 'Le Van C',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        rating: 5,
        comment: language === 'vi'
          ? 'Giao hàng nhanh, sản phẩm đúng mô tả. Sẽ ủng hộ shop tiếp!'
          : 'Fast delivery, product as described. Will support again!',
        date: '2024-11-10',
      },
    ],
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error(language === 'vi' ? 'Vui lòng chọn size' : 'Please select a size');
      return;
    }

    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      sellerId: product.seller.id,
    });

    toast.success(language === 'vi' ? 'Đã thêm vào giỏ hàng' : 'Added to cart');
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      toast.error(language === 'vi' ? 'Vui lòng chọn size' : 'Please select a size');
      return;
    }

    handleAddToCart();
    navigate('/checkout');
  };

  const handleContactSeller = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/messages');
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
          <div className="flex items-center gap-2 mb-6">
            <span className="text-gray-600">{t('condition')}:</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {product.condition}
            </Badge>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block mb-3">{t('size')}</label>
            <div className="flex gap-3">
              {product.availableSizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  onClick={() => setSelectedSize(size)}
                  className="w-16"
                >
                  {size}
                </Button>
              ))}
            </div>
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

          <Button
            variant="outline"
            className="w-full"
            onClick={handleContactSeller}
          >
            <MessageCircle className="size-4 mr-2" />
            {t('contactSeller')}
          </Button>

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
