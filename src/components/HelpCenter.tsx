import { useLanguage } from '../contexts/LanguageContext';
import { HelpCircle, Book, MessageCircle, Phone } from 'lucide-react';

export default function HelpCenter() {
  const { language } = useLanguage();

  const categories = [
    {
      icon: <Book className="w-8 h-8" />,
      title: language === 'vi' ? 'Hướng Dẫn Mua Hàng' : 'Buying Guide',
      link: '/help/buying-guide'
    },
    {
      icon: <Book className="w-8 h-8" />,
      title: language === 'vi' ? 'Hướng Dẫn Bán Hàng' : 'Selling Guide',
      link: '/help/selling-guide'
    },
    {
      icon: <HelpCircle className="w-8 h-8" />,
      title: language === 'vi' ? 'Câu Hỏi Thường Gặp' : 'FAQ',
      link: '/help/faq'
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: language === 'vi' ? 'Liên Hệ Hỗ Trợ' : 'Contact Support',
      link: '/help/contact'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              {language === 'vi' ? 'Trung Tâm Trợ Giúp' : 'Help Center'}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90">
              {language === 'vi' 
                ? 'Tìm câu trả lời cho mọi thắc mắc của bạn'
                : 'Find answers to all your questions'}
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            {categories.map((cat, index) => (
              <a
                key={index}
                href={cat.link}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 md:p-8 border-2 border-gray-100 hover:border-purple-300 transition-all hover:shadow-lg group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-black">{cat.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Help */}
      <div className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">
              {language === 'vi' ? 'Hỗ Trợ Nhanh' : 'Quick Support'}
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 md:p-8 rounded-2xl border-2 border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-black">
                  {language === 'vi' ? 'Liên Hệ Trực Tiếp' : 'Direct Contact'}
                </h3>
              </div>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li><strong>Email:</strong> support@secondstyle.vn</li>
                <li><strong>Hotline:</strong> 1900 123 456</li>
                <li><strong>{language === 'vi' ? 'Giờ làm việc' : 'Working hours'}:</strong> {language === 'vi' ? '8:00 - 22:00 hàng ngày' : '8:00 - 22:00 daily'}</li>
                <li><strong>Live Chat:</strong> {language === 'vi' ? 'Góc dưới phải màn hình' : 'Bottom right corner of screen'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
