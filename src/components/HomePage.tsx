import { Link } from 'react-router-dom';
import { ArrowRight, Shirt, Watch, Gem, TrendingUp, Shield, Recycle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export default function HomePage() {
  const { language } = useLanguage();

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

  const featuredProducts = [
    {
      id: '1',
      name: 'Áo khoác denim vintage',
      price: 450000,
      originalPrice: 1200000,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      condition: { vi: 'Như mới', en: 'Like New' },
      size: 'M',
    },
    {
      id: '2',
      name: 'Túi xách Louis Vuitton',
      price: 8500000,
      originalPrice: 15000000,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
      condition: { vi: 'Đã qua sử dụng', en: 'Used' },
      size: 'One Size',
    },
    {
      id: '3',
      name: 'Giày thể thao Nike Air',
      price: 1200000,
      originalPrice: 2800000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      condition: { vi: 'Tốt', en: 'Good' },
      size: '42',
    },
    {
      id: '4',
      name: 'Áo sơ mi silk cao cấp',
      price: 350000,
      originalPrice: 900000,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
      condition: { vi: 'Như mới', en: 'Like New' },
      size: 'L',
    },
    {
      id: '5',
      name: 'Váy maxi boho',
      price: 550000,
      originalPrice: 1500000,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      condition: { vi: 'Như mới', en: 'Like New' },
      size: 'S',
    },
    {
      id: '6',
      name: 'Áo blazer công sở',
      price: 680000,
      originalPrice: 1800000,
      image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400',
      condition: { vi: 'Tốt', en: 'Good' },
      size: 'M',
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
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
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
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 line-clamp-2 text-sm">{product.name}</h3>
                    <div className="space-y-1">
                      <p className="text-purple-600">{product.price.toLocaleString('vi-VN')}₫</p>
                      <p className="text-xs text-gray-500 line-through">{product.originalPrice.toLocaleString('vi-VN')}₫</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        {product.condition[language]}
                      </span>
                      <span className="text-xs text-gray-500">Size {product.size}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
