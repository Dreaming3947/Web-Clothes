import { useLanguage } from '../contexts/LanguageContext';
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react';

export default function ReturnPolicy() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              {language === 'vi' ? 'Chính Sách Hoàn Trả' : 'Return Policy'}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90">
              {language === 'vi' 
                ? 'Quy định đổi trả hàng và hoàn tiền'
                : 'Regulations on returns and refunds'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? 'Điều Kiện Hoàn Trả' : 'Return Conditions'}
              </h2>
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <h3 className="text-xl font-bold text-black">
                    {language === 'vi' ? 'Được Chấp Nhận Hoàn Trả' : 'Returns Accepted'}
                  </h3>
                </div>
                <ul className="space-y-3 text-base md:text-lg text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>{language === 'vi' ? 'Sản phẩm không đúng mô tả (màu sắc, kích cỡ, chất liệu)' : 'Product not as described (color, size, material)'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>{language === 'vi' ? 'Hàng bị lỗi, hư hỏng khi nhận' : 'Defective or damaged upon receipt'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>{language === 'vi' ? 'Giao sai sản phẩm' : 'Wrong product delivered'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>{language === 'vi' ? 'Trong vòng 3 ngày kể từ khi nhận hàng' : 'Within 3 days of receiving goods'}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <h3 className="text-xl font-bold text-black">
                    {language === 'vi' ? 'Không Được Hoàn Trả' : 'Returns Not Accepted'}
                  </h3>
                </div>
                <ul className="space-y-3 text-base md:text-lg text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>{language === 'vi' ? 'Đã qua 3 ngày kể từ khi nhận hàng' : 'More than 3 days after receiving'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>{language === 'vi' ? 'Sản phẩm đã qua sử dụng, giặt, có mùi lạ' : 'Used, washed, or has odor'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>{language === 'vi' ? 'Không còn nguyên tem, nhãn mác' : 'Missing original tags or labels'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>{language === 'vi' ? 'Lý do chủ quan (không thích, không vừa)' : 'Subjective reasons (don\'t like, doesn\'t fit)'}</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? 'Quy Trình Hoàn Trả' : 'Return Process'}
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      {language === 'vi' ? 'Liên Hệ Người Bán' : 'Contact Seller'}
                    </h3>
                    <p className="text-base md:text-lg text-gray-700">
                      {language === 'vi' 
                        ? 'Nhắn tin cho người bán qua hệ thống chat, nêu rõ lý do hoàn trả và đính kèm hình ảnh chứng minh.'
                        : 'Message the seller via chat system, clearly state return reason and attach proof photos.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      {language === 'vi' ? 'Đợi Xác Nhận' : 'Wait for Confirmation'}
                    </h3>
                    <p className="text-base md:text-lg text-gray-700">
                      {language === 'vi' 
                        ? 'Người bán xem xét và phản hồi trong vòng 24 giờ. Nếu chấp nhận, bạn sẽ nhận được hướng dẫn gửi trả hàng.'
                        : 'Seller reviews and responds within 24 hours. If accepted, you will receive return shipping instructions.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      {language === 'vi' ? 'Gửi Trả Hàng' : 'Ship Return'}
                    </h3>
                    <p className="text-base md:text-lg text-gray-700">
                      {language === 'vi' 
                        ? 'Đóng gói cẩn thận và gửi hàng về địa chỉ người bán. Lưu lại mã vận đơn để tra cứu.'
                        : 'Pack carefully and ship to seller\'s address. Keep tracking number for reference.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      {language === 'vi' ? 'Nhận Hoàn Tiền' : 'Receive Refund'}
                    </h3>
                    <p className="text-base md:text-lg text-gray-700">
                      {language === 'vi' 
                        ? 'Sau khi người bán nhận và kiểm tra hàng, tiền sẽ được hoàn lại trong 3-5 ngày làm việc.'
                        : 'After seller receives and inspects goods, refund will be processed within 3-5 business days.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? 'Phí Hoàn Trả' : 'Return Fees'}
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <ul className="space-y-3 text-base md:text-lg text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{language === 'vi' ? 'Lỗi từ người bán: người bán chịu phí vận chuyển 2 chiều' : 'Seller\'s fault: seller pays shipping both ways'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{language === 'vi' ? 'Lỗi từ người mua: người mua chịu phí vận chuyển' : 'Buyer\'s fault: buyer pays shipping fees'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{language === 'vi' ? 'Tranh chấp: SecondStyle làm trung gian giải quyết' : 'Dispute: SecondStyle mediates resolution'}</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-10 bg-gradient-to-r from-purple-50 to-pink-50 p-6 md:p-8 rounded-2xl border-2 border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <RotateCcw className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-black">
                  {language === 'vi' ? 'Hỗ Trợ Hoàn Trả' : 'Return Support'}
                </h2>
              </div>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-3">
                {language === 'vi' 
                  ? 'Gặp vấn đề với hoàn trả? Liên hệ ngay:'
                  : 'Having issues with returns? Contact us:'}
              </p>
              <ul className="space-y-2 text-base md:text-lg text-gray-700">
                <li><strong>Email:</strong> returns@secondstyle.vn</li>
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
