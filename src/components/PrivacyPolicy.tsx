import { useLanguage } from '../contexts/LanguageContext';

export default function PrivacyPolicy() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              {language === 'vi' ? 'Chính Sách Bảo Mật' : 'Privacy Policy'}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90">
              {language === 'vi' 
                ? 'Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn'
                : 'We are committed to protecting your personal information'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? '1. Thông Tin Chúng Tôi Thu Thập' : '1. Information We Collect'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                {language === 'vi' 
                  ? 'Khi bạn sử dụng SecondStyle, chúng tôi có thể thu thập các thông tin sau:'
                  : 'When you use SecondStyle, we may collect the following information:'}
              </p>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Thông tin cá nhân: họ tên, email, số điện thoại, địa chỉ' : 'Personal information: name, email, phone number, address'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Thông tin giao dịch: lịch sử mua bán, phương thức thanh toán' : 'Transaction information: purchase history, payment methods'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Dữ liệu kỹ thuật: IP, trình duyệt, thiết bị, cookies' : 'Technical data: IP, browser, device, cookies'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Nội dung do bạn tạo: tin nhắn, đánh giá, hình ảnh sản phẩm' : 'User-generated content: messages, reviews, product images'}</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? '2. Mục Đích Sử Dụng Thông Tin' : '2. Purpose of Using Information'}
              </h2>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Cung cấp và cải thiện dịch vụ của chúng tôi' : 'Provide and improve our services'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Xử lý giao dịch và thanh toán' : 'Process transactions and payments'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Gửi thông báo về đơn hàng, cập nhật hệ thống' : 'Send notifications about orders, system updates'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Phân tích và cá nhân hóa trải nghiệm người dùng' : 'Analyze and personalize user experience'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Phát hiện và ngăn chặn gian lận, lạm dụng' : 'Detect and prevent fraud, abuse'}</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? '3. Chia Sẻ Thông Tin' : '3. Information Sharing'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                {language === 'vi' 
                  ? 'Chúng tôi không bán thông tin cá nhân của bạn. Tuy nhiên, chúng tôi có thể chia sẻ với:'
                  : 'We do not sell your personal information. However, we may share with:'}
              </p>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Đối tác vận chuyển để giao hàng' : 'Shipping partners for delivery'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Nhà cung cấp thanh toán (MoMo) để xử lý giao dịch' : 'Payment providers (MoMo) to process transactions'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Cơ quan pháp luật khi có yêu cầu hợp pháp' : 'Law enforcement when legally required'}</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? '4. Bảo Mật Thông Tin' : '4. Information Security'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                {language === 'vi' 
                  ? 'Chúng tôi sử dụng các biện pháp bảo mật kỹ thuật và tổ chức để bảo vệ thông tin của bạn khỏi truy cập trái phép, mất mát hoặc tiết lộ. Bao gồm: mã hóa SSL/TLS, tường lửa, xác thực hai yếu tố, và kiểm soát truy cập nghiêm ngặt.'
                  : 'We use technical and organizational security measures to protect your information from unauthorized access, loss, or disclosure. Including: SSL/TLS encryption, firewalls, two-factor authentication, and strict access controls.'}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? '5. Quyền Của Bạn' : '5. Your Rights'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                {language === 'vi' 
                  ? 'Bạn có các quyền sau đối với thông tin cá nhân:'
                  : 'You have the following rights regarding your personal information:'}
              </p>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Truy cập và xem thông tin cá nhân' : 'Access and view personal information'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Yêu cầu sửa đổi thông tin không chính xác' : 'Request correction of inaccurate information'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Xóa tài khoản và dữ liệu liên quan' : 'Delete account and related data'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Từ chối nhận email marketing' : 'Opt-out of marketing emails'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Yêu cầu sao lưu dữ liệu cá nhân' : 'Request personal data backup'}</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? '6. Cookies' : '6. Cookies'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                {language === 'vi' 
                  ? 'Chúng tôi sử dụng cookies để cải thiện trải nghiệm người dùng, phân tích lưu lượng truy cập và cá nhân hóa nội dung. Bạn có thể tắt cookies trong cài đặt trình duyệt, nhưng điều này có thể ảnh hưởng đến một số tính năng của trang web.'
                  : 'We use cookies to improve user experience, analyze traffic, and personalize content. You can disable cookies in browser settings, but this may affect some website features.'}
              </p>
            </section>

            <section className="mb-10 bg-gradient-to-r from-purple-50 to-pink-50 p-6 md:p-8 rounded-2xl border-2 border-purple-100">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? '7. Liên Hệ' : '7. Contact'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-3">
                {language === 'vi' 
                  ? 'Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:'
                  : 'If you have questions about the privacy policy, please contact:'}
              </p>
              <ul className="space-y-2 text-base md:text-lg text-gray-700">
                <li><strong>Email:</strong> privacy@secondstyle.vn</li>
                <li><strong>Hotline:</strong> 1900 123 456</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
