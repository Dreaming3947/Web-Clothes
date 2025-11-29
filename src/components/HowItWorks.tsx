import { useLanguage } from '../contexts/LanguageContext';
import { ShoppingBag, Store, Shield, TrendingUp } from 'lucide-react';

export default function HowItWorks() {
  const { language } = useLanguage();

  const steps = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: language === 'vi' ? 'Đăng Ký Tài Khoản' : 'Sign Up',
      desc: language === 'vi' 
        ? 'Tạo tài khoản miễn phí chỉ với vài bước đơn giản. Xác thực email và hoàn tất hồ sơ của bạn.'
        : 'Create a free account in just a few simple steps. Verify your email and complete your profile.'
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: language === 'vi' ? 'Đăng Sản Phẩm / Tìm Kiếm' : 'List Products / Search',
      desc: language === 'vi' 
        ? 'Người bán đăng sản phẩm với hình ảnh chi tiết. Người mua tìm kiếm và lọc sản phẩm yêu thích.'
        : 'Sellers list products with detailed images. Buyers search and filter favorite items.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: language === 'vi' ? 'Giao Dịch An Toàn' : 'Safe Transaction',
      desc: language === 'vi' 
        ? 'Chat trực tiếp, thương lượng giá. Thanh toán qua MoMo hoặc COD an toàn, minh bạch.'
        : 'Direct chat, price negotiation. Safe payment via MoMo or COD, transparent and secure.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: language === 'vi' ? 'Hoàn Tất & Đánh Giá' : 'Complete & Review',
      desc: language === 'vi' 
        ? 'Nhận hàng, xác nhận và đánh giá. Xây dựng uy tín cho cộng đồng SecondStyle.'
        : 'Receive items, confirm and review. Build reputation for SecondStyle community.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              {language === 'vi' ? 'Cách Thức Hoạt Động' : 'How It Works'}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90">
              {language === 'vi' 
                ? 'Hướng dẫn chi tiết cách sử dụng nền tảng SecondStyle'
                : 'Detailed guide on how to use the SecondStyle platform'}
            </p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
              {steps.map((step, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 hover:border-purple-300 transition-all shadow-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-purple-600 mb-2">
                        {language === 'vi' ? 'BƯỚC' : 'STEP'} {index + 1}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-black mb-3">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed pl-18">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? 'Dành Cho Người Mua' : 'For Buyers'}
              </h2>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Tìm kiếm sản phẩm theo danh mục, giá, kích cỡ, màu sắc' : 'Search products by category, price, size, color'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Xem hình ảnh chi tiết và mô tả sản phẩm' : 'View detailed images and product descriptions'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Chat trực tiếp với người bán để đàm phán giá' : 'Chat directly with sellers to negotiate prices'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Thêm vào giỏ hàng và thanh toán an toàn' : 'Add to cart and checkout securely'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Theo dõi đơn hàng và nhận thông báo cập nhật' : 'Track orders and receive update notifications'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? 'Dành Cho Người Bán' : 'For Sellers'}
              </h2>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Đăng sản phẩm với hình ảnh rõ nét (tối thiểu 3 ảnh)' : 'List products with clear images (minimum 3 photos)'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Mô tả chi tiết: kích cỡ, tình trạng, chất liệu' : 'Detailed description: size, condition, material'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Đặt giá hợp lý và cho phép thương lượng' : 'Set reasonable prices and allow negotiation'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Trả lời tin nhắn nhanh chóng từ người mua' : 'Reply to buyer messages promptly'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Đóng gói cẩn thận và giao hàng đúng hẹn' : 'Pack carefully and deliver on time'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
