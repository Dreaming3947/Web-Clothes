import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function ContactSupport() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              {language === 'vi' ? 'Liên Hệ Hỗ Trợ' : 'Contact Support'}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90">
              {language === 'vi' 
                ? 'Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7'
                : 'We are always ready to support you 24/7'}
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 md:p-8 border-2 border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-black">Email</h3>
                </div>
                <p className="text-base md:text-lg text-gray-700 mb-2">
                  <strong>{language === 'vi' ? 'Hỗ trợ chung:' : 'General support:'}</strong> support@secondstyle.vn
                </p>
                <p className="text-base md:text-lg text-gray-700 mb-2">
                  <strong>{language === 'vi' ? 'Báo cáo:' : 'Reports:'}</strong> report@secondstyle.vn
                </p>
                <p className="text-base md:text-lg text-gray-700">
                  <strong>{language === 'vi' ? 'Hợp tác:' : 'Partnership:'}</strong> partner@secondstyle.vn
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 border-2 border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-black">Hotline</h3>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">
                  1900 123 456
                </p>
                <p className="text-base md:text-lg text-gray-700">
                  {language === 'vi' 
                    ? 'Miễn phí từ 8:00 - 22:00 hàng ngày'
                    : 'Free from 8:00 - 22:00 daily'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8 border-2 border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-black">
                    {language === 'vi' ? 'Địa Chỉ' : 'Address'}
                  </h3>
                </div>
                <p className="text-base md:text-lg text-gray-700">
                  {language === 'vi' 
                    ? 'Đại học Giao Thông Vận Tải TP.HCM'
                    : 'University of Transport Ho Chi Minh City'}
                </p>
                <p className="text-base md:text-lg text-gray-700">
                  2 Võ Oanh, Phường 25, Quận Bình Thạnh, TP.HCM
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 md:p-8 border-2 border-yellow-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center text-white">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-black">
                    {language === 'vi' ? 'Giờ Làm Việc' : 'Working Hours'}
                  </h3>
                </div>
                <p className="text-base md:text-lg text-gray-700 mb-2">
                  <strong>{language === 'vi' ? 'Hỗ trợ trực tuyến:' : 'Online support:'}</strong> 24/7
                </p>
                <p className="text-base md:text-lg text-gray-700 mb-2">
                  <strong>{language === 'vi' ? 'Hotline:' : 'Hotline:'}</strong> 8:00 - 22:00
                </p>
                <p className="text-base md:text-lg text-gray-700">
                  <strong>Email:</strong> {language === 'vi' ? 'Phản hồi trong 24h' : 'Response within 24h'}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-10 text-white text-center shadow-xl">
              <MessageCircle className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'vi' ? 'Live Chat' : 'Live Chat'}
              </h2>
              <p className="text-lg md:text-xl mb-6 opacity-90">
                {language === 'vi' 
                  ? 'Chat trực tiếp với đội ngũ hỗ trợ của chúng tôi'
                  : 'Chat directly with our support team'}
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-all shadow-lg">
                {language === 'vi' ? 'Bắt Đầu Chat Ngay' : 'Start Chat Now'}
              </button>
            </div>

            <div className="mt-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 md:p-8 border-2 border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 text-center">
                {language === 'vi' ? 'Kết Nối Với Chúng Tôi' : 'Connect With Us'}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-all shadow-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-all shadow-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Instagram
                </a>
                <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-all shadow-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  Zalo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
