import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shirt, Watch, Gem, TrendingUp, Shield, Recycle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const API_URL = 'http://127.0.0.1:8000/backend/api';

export default function HomePage() {
  const { language } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products.php?limit=6`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setFeaturedProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      id: 'women',
      name: { vi: 'Thời trang Nữ', en: "Women's Fashion" },
      image: 'https://images.unsplash.com/photo-1622080159621-bfceab50b3e3?w=400',
      count: '1,234',
    },
    {
      id: 'men',
      name: { vi: 'Thời trang Nam', en: "Men's Fashion" },
      image: 'https://images.unsplash.com/photo-1599012307530-d163bd04ecab?w=400',
      count: '856',
    },
    {
      id: 'accessories',
      name: { vi: 'Phụ kiện', en: 'Accessories' },
      image: 'https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=400',
      count: '643',
    },
    {
      id: 'shoes',
      name: { vi: 'Giày dép', en: 'Shoes' },
      image: 'https://images.unsplash.com/photo-1534639077088-d702bcf685e7?w=400',
      count: '521',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: { vi: 'Bảo vệ người mua', en: 'Buyer Protection' },
      description: { vi: 'Đảm bảo hoàn tiền 100% nếu sản phẩm không đúng mô tả', en: '100% money back guarantee if item not as described' },
    },
    {
      icon: Recycle,
      title: { vi: 'Thân thiện môi trường', en: 'Eco-Friendly' },
      description: { vi: 'Tham gia tái chế thời trang, bảo vệ môi trường', en: 'Join fashion recycling, protect the environment' },
    },
    {
      icon: TrendingUp,
      title: { vi: 'Giá tốt nhất', en: 'Best Prices' },
      description: { vi: 'Tiết kiệm đến 70% so với giá mua mới', en: 'Save up to 70% compared to buying new' },
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl mb-6">
              {language === 'vi' 
                ? 'Thời trang bền vững, phong cách riêng bạn' 
                : 'Sustainable Fashion, Your Style'}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              {language === 'vi'
                ? 'Mua bán quần áo cũ chất lượng cao. Tiết kiệm tiền, bảo vệ môi trường.'
                : 'Buy and sell quality pre-owned clothing. Save money, protect the environment.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                <Link to="/products">
                  {language === 'vi' ? 'Khám phá ngay' : 'Shop Now'}
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button size="lg" className="bg-white/20 text-white hover:bg-white hover:text-purple-600 border-2 border-white backdrop-blur-sm" asChild>
                <Link to="/create-listing">
                  {language === 'vi' ? 'Bán đồ của bạn' : 'Sell Your Items'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">
              {language === 'vi' ? 'Khám phá danh mục' : 'Explore Categories'}
            </h2>
            <p className="text-gray-600">
              {language === 'vi' 
                ? 'Tìm kiếm sản phẩm theo danh mục yêu thích'
                : 'Find products by your favorite category'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative overflow-hidden rounded-xl aspect-square"
              >
                <img
                  src={category.image}
                  alt={category.name[language]}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-lg md:text-xl mb-1">{category.name[language]}</h3>
                  <p className="text-white/80 text-sm">{category.count} {language === 'vi' ? 'sản phẩm' : 'items'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl mb-2">
                {language === 'vi' ? 'Sản phẩm nổi bật' : 'Featured Products'}
              </h2>
              <p className="text-gray-600">
                {language === 'vi' ? 'Những sản phẩm được yêu thích nhất' : 'Most loved items'}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products">
                {language === 'vi' ? 'Xem tất cả' : 'View All'}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {featuredProducts.map((product) => {
              // Get first image or use placeholder
              const imageUrl = product.images && product.images.length > 0 
                ? product.images[0] 
                : 'https://via.placeholder.com/400x400?text=No+Image';
              
              // Map condition to display text
              const conditionText: { [key: string]: { vi: string; en: string } } = {
                'new': { vi: 'Mới', en: 'New' },
                'like-new': { vi: 'Như mới', en: 'Like New' },
                'good': { vi: 'Tốt', en: 'Good' },
                'fair': { vi: 'Khá', en: 'Fair' }
              };

              return (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 line-clamp-2 text-sm">{product.title}</h3>
                      <div className="space-y-1">
                        <p className="text-purple-600 font-semibold">{parseInt(product.price).toLocaleString('vi-VN')}₫</p>
                        {product.original_price && (
                          <p className="text-xs text-gray-500 line-through">{parseInt(product.original_price).toLocaleString('vi-VN')}₫</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                          {conditionText[product.condition]?.[language] || product.condition}
                        </span>
                        {product.size && <span className="text-xs text-gray-500">Size {product.size}</span>}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">
              {language === 'vi' ? 'Tại sao chọn chúng tôi' : 'Why Choose Us'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center size-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                  <feature.icon className="size-8" />
                </div>
                <h3 className="text-xl mb-2">{feature.title[language]}</h3>
                <p className="text-gray-600">{feature.description[language]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">
            {language === 'vi' 
              ? 'Sẵn sàng bắt đầu?' 
              : 'Ready to Get Started?'}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {language === 'vi'
              ? 'Đăng ký ngay để mua bán thời trang bền vững'
              : 'Sign up now to buy and sell sustainable fashion'}
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
            <Link to="/register">
              {language === 'vi' ? 'Đăng ký miễn phí' : 'Sign Up Free'}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
