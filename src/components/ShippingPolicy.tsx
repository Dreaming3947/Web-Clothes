import { useLanguage } from '../contexts/LanguageContext';
import { Truck, MapPin, Phone } from 'lucide-react';

export default function ShippingPolicy() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              {language === 'vi' ? 'Chính Sách Vận Chuyển' : 'Shipping Policy'}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90">
              {language === 'vi' 
                ? 'Thông tin chi tiết về giao hàng và phí vận chuyển'
                : 'Detailed information about delivery and shipping costs'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                {language === 'vi' ? 'Phương Thức Vận Chuyển' : 'Shipping Methods'}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                      <Truck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-black">
                      {language === 'vi' ? 'Giao Hàng Nhanh' : 'Express Delivery'}
                    </h3>
                  </div>
                  <ul className="space-y-2 text-base text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{language === 'vi' ? 'Thời gian: 1-2 ngày' : 'Time: 1-2 days'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{language === 'vi' ? 'Phí: 30,000đ - 50,000đ' : 'Fee: 30,000đ - 50,000đ'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{language === 'vi' ? 'Áp dụng: nội thành TP.HCM, Hà Nội' : 'Apply: HCM, Hanoi city'}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-black">
                      {language === 'vi' ? 'Giao Hàng Tiêu Chuẩn' : 'Standard Delivery'}
                    </h3>
                  </div>
                  <ul className="space-y-2 text-base text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      <span>{language === 'vi' ? 'Thời gian: 3-5 ngày' : 'Time: 3-5 days'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      <span>{language === 'vi' ? 'Phí: 20,000đ - 40,000đ' : 'Fee: 20,000đ - 40,000đ'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      <span>{language === 'vi' ? 'Áp dụng: toàn quốc' : 'Apply: nationwide'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? 'Quy Định Vận Chuyển' : 'Shipping Regulations'}
              </h2>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Người bán chịu trách nhiệm đóng gói cẩn thận, đảm bảo sản phẩm không bị hư hỏng' : 'Sellers are responsible for careful packaging to ensure products are not damaged'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Phí vận chuyển do người mua hoặc người bán thanh toán (tùy thỏa thuận)' : 'Shipping fees paid by buyer or seller (by agreement)'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Thời gian vận chuyển được tính từ khi người bán xác nhận giao hàng' : 'Shipping time counted from when seller confirms delivery'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Người mua có thể theo dõi đơn hàng qua mã vận đơn' : 'Buyers can track orders via tracking number'}</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? 'Trường Hợp Đặc Biệt' : 'Special Cases'}
              </h2>
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-black mb-3">
                  {language === 'vi' ? '⚠️ Hàng Bị Thất Lạc' : '⚠️ Lost Items'}
                </h3>
                <p className="text-base text-gray-700 mb-3">
                  {language === 'vi' 
                    ? 'Nếu hàng bị thất lạc trong quá trình vận chuyển:'
                    : 'If items are lost during shipping:'}
                </p>
                <ul className="space-y-2 text-base text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">1.</span>
                    <span>{language === 'vi' ? 'Liên hệ đơn vị vận chuyển để tra cứu' : 'Contact shipping company to inquire'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">2.</span>
                    <span>{language === 'vi' ? 'Báo cáo với SecondStyle qua email hoặc hotline' : 'Report to SecondStyle via email or hotline'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">3.</span>
                    <span>{language === 'vi' ? 'Được hoàn tiền sau khi xác minh' : 'Refund after verification'}</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? 'Giao Hàng COD (Thanh Toán Khi Nhận Hàng)' : 'COD Delivery (Cash On Delivery)'}
              </h2>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{language === 'vi' ? 'Người mua kiểm tra hàng trước khi thanh toán' : 'Buyer checks items before payment'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{language === 'vi' ? 'Thanh toán bằng tiền mặt cho shipper' : 'Pay cash to shipper'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{language === 'vi' ? 'Phí COD: 10,000đ - 15,000đ' : 'COD fee: 10,000đ - 15,000đ'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{language === 'vi' ? 'Không chấp nhận COD cho đơn hàng trên 5 triệu đồng' : 'COD not accepted for orders over 5 million VND'}</span>
                </li>
              </ul>
            </section>

            <section className="mb-10 bg-gradient-to-r from-purple-50 to-pink-50 p-6 md:p-8 rounded-2xl border-2 border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-black">
                  {language === 'vi' ? 'Hỗ Trợ Vận Chuyển' : 'Shipping Support'}
                </h2>
              </div>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-3">
                {language === 'vi' 
                  ? 'Cần hỗ trợ về vận chuyển? Liên hệ ngay:'
                  : 'Need shipping support? Contact us:'}
              </p>
              <ul className="space-y-2 text-base md:text-lg text-gray-700">
                <li><strong>Email:</strong> shipping@secondstyle.vn</li>
                <li><strong>Hotline:</strong> 1900 123 456</li>
                <li><strong>{language === 'vi' ? 'Giờ làm việc' : 'Working hours'}:</strong> {language === 'vi' ? '8:00 - 22:00 hàng ngày' : '8:00 - 22:00 daily'}</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
