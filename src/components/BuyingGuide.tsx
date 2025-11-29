import { useLanguage } from '../contexts/LanguageContext';
import { Search, ShoppingCart, MessageCircle, CreditCard, Star } from 'lucide-react';

export default function BuyingGuide() {
  const { language } = useLanguage();

  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: language === 'vi' ? 'Tìm Kiếm Sản Phẩm' : 'Search Products',
      desc: language === 'vi' 
        ? 'Sử dụng thanh tìm kiếm hoặc lọc theo danh mục, giá, kích cỡ để tìm sản phẩm phù hợp.'
        : 'Use search bar or filter by category, price, size to find suitable products.'
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: language === 'vi' ? 'Chat Với Người Bán' : 'Chat With Seller',
      desc: language === 'vi' 
        ? 'Nhắn tin trực tiếp để hỏi thêm thông tin, thương lượng giá và xem thêm hình ảnh.'
        : 'Message directly to ask for more info, negotiate price and request more photos.'
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: language === 'vi' ? 'Thêm Vào Giỏ Hàng' : 'Add To Cart',
      desc: language === 'vi' 
        ? 'Thêm sản phẩm vào giỏ hàng và kiểm tra lại trước khi thanh toán.'
        : 'Add products to cart and review before checkout.'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: language === 'vi' ? 'Thanh Toán' : 'Payment',
      desc: language === 'vi' 
        ? 'Chọn phương thức thanh toán (MoMo hoặc COD) và hoàn tất đơn hàng.'
        : 'Choose payment method (MoMo or COD) and complete order.'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: language === 'vi' ? 'Nhận Hàng & Đánh Giá' : 'Receive & Review',
      desc: language === 'vi' 
        ? 'Kiểm tra hàng khi nhận, xác nhận và để lại đánh giá cho người bán.'
        : 'Inspect upon receipt, confirm and leave review for seller.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              {language === 'vi' ? 'Hướng Dẫn Mua Hàng' : 'Buying Guide'}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90">
              {language === 'vi' 
                ? 'Mua sắm thông minh trên SecondStyle'
                : 'Shop smart on SecondStyle'}
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-10">
            {steps.map((step, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 md:p-8 border-2 border-gray-100 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-purple-600 mb-2">
                      {language === 'vi' ? 'BƯỚC' : 'STEP'} {index + 1}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-black mb-3">{step.title}</h3>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
