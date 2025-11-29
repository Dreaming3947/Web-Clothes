import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="text-white mt-16 border-t" 
      style={{
        background: 'linear-gradient(to bottom right, #581c87, #7e22ce, #4c1d95)',
        borderTopColor: '#a855f7'
      }}
    >
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 className="text-white text-base font-bold mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-cyan-400" />
              {language === 'vi' ? 'Về SecondStyle' : 'About SecondStyle'}
            </h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {language === 'vi' 
                ? 'Nền tảng mua bán quần áo cũ uy tín, an toàn và tiện lợi. Hàng ngàn sản phẩm chất lượng với giá tốt nhất.'
                : 'Trusted, safe and convenient secondhand clothing marketplace. Thousands of quality products at the best prices.'}
            </p>
            <div className="flex gap-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 bg-blue-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-300">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 bg-blue-800 rounded-full flex items-center justify-center hover:bg-cyan-500 transition-all duration-300">
                <Twitter className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-base font-bold mb-3">
              {language === 'vi' ? 'Liên kết nhanh' : 'Quick Links'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-gray-300 hover:text-pink-400 transition-colors">
                {language === 'vi' ? 'Về chúng tôi' : 'About Us'}
              </a></li>
              <li><a href="/how-it-works" className="text-gray-300 hover:text-pink-400 transition-colors">
                {language === 'vi' ? 'Cách thức hoạt động' : 'How It Works'}
              </a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-pink-400 transition-colors">
                {language === 'vi' ? 'Điều khoản sử dụng' : 'Terms of Service'}
              </a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-pink-400 transition-colors">
                {language === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy'}
              </a></li>
              <li><a href="/shipping" className="text-gray-300 hover:text-pink-400 transition-colors">
                {language === 'vi' ? 'Chính sách vận chuyển' : 'Shipping Policy'}
              </a></li>
              <li><a href="/returns" className="text-gray-300 hover:text-pink-400 transition-colors">
                {language === 'vi' ? 'Chính sách hoàn trả' : 'Return Policy'}
              </a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-base font-bold mb-3">
              {language === 'vi' ? 'Hỗ trợ khách hàng' : 'Customer Support'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/help" className="text-gray-300 hover:text-cyan-400 transition-colors">
                {language === 'vi' ? 'Trung tâm trợ giúp' : 'Help Center'}
              </a></li>
              <li><a href="/help/buying-guide" className="text-gray-300 hover:text-cyan-400 transition-colors">
                {language === 'vi' ? 'Hướng dẫn mua hàng' : 'Buyer Guide'}
              </a></li>
              <li><a href="/help/selling-guide" className="text-gray-300 hover:text-cyan-400 transition-colors">
                {language === 'vi' ? 'Hướng dẫn bán hàng' : 'Seller Guide'}
              </a></li>
              <li><a href="/help/faq" className="text-gray-300 hover:text-cyan-400 transition-colors">
                {language === 'vi' ? 'Câu hỏi thường gặp' : 'FAQ'}
              </a></li>
              <li><a href="/report" className="text-gray-300 hover:text-cyan-400 transition-colors">
                {language === 'vi' ? 'Báo cáo vi phạm' : 'Report Violation'}
              </a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors">
                {language === 'vi' ? 'Liên hệ hỗ trợ' : 'Contact Support'}
              </a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-white text-base font-bold mb-3">
              {language === 'vi' ? 'Liên hệ' : 'Contact'}
            </h3>
            <ul className="space-y-2.5 text-sm mb-5">
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400" />
                <span className="leading-tight">2 Võ Oanh, phường Thạnh Mỹ Tây, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 shrink-0 text-cyan-400" />
                <a href="tel:1900123456" className="hover:text-cyan-400 transition-colors">1900 123 456</a>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 shrink-0 text-cyan-400" />
                <a href="mailto:support@secondstyle.vn" className="hover:text-cyan-400 transition-colors">support@secondstyle.vn</a>
              </li>
            </ul>

            <h4 className="text-white text-sm font-semibold mb-2">
              {language === 'vi' ? 'Đăng ký nhận tin' : 'Newsletter'}
            </h4>
            <div className="flex gap-2">
              <Input
                placeholder={language === 'vi' ? 'Email của bạn' : 'Your email'}
                className="bg-blue-800 border-blue-600 text-white placeholder:text-blue-200 focus:border-cyan-400 text-sm h-9"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shrink-0 text-sm h-9 px-4">
                {language === 'vi' ? 'Gửi' : 'Send'}
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-purple-700 mt-10 pt-6 text-center">
          <p className="text-gray-300 text-sm">
            &copy; {currentYear} SecondStyle. {language === 'vi' ? 'Bản quyền thuộc về' : 'All rights reserved by'} 
            <span className="text-purple-400 font-bold"> Nhóm 11 - UTH</span>
          </p>
          <p className="text-gray-300 text-xs mt-2 flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 inline text-purple-400 animate-pulse" /> in Vietnam
          </p>
          <p className="text-gray-300 text-xs mt-2 flex items-center justify-center gap-1">
            <a
              href="https://github.com/Dreaming3947/Web-Clothes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 underline flex items-center gap-1"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="inline-block"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
              <span>GitHub</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
