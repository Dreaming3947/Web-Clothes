import { useLanguage } from '../contexts/LanguageContext';
import { HelpCircle } from 'lucide-react';

export default function FAQ() {
  const { language } = useLanguage();

  const faqs = [
    {
      q: language === 'vi' ? 'Làm sao để đăng ký tài khoản?' : 'How to register an account?',
      a: language === 'vi' 
        ? 'Nhấn vào nút "Đăng Ký" ở góc trên phải, điền thông tin email, mật khẩu và xác thực qua email.'
        : 'Click "Sign Up" button in top right corner, fill in email, password and verify via email.'
    },
    {
      q: language === 'vi' ? 'Tôi có thể thanh toán bằng cách nào?' : 'What payment methods are available?',
      a: language === 'vi' 
        ? 'Hiện tại hỗ trợ thanh toán qua MoMo và COD (thanh toán khi nhận hàng).'
        : 'Currently supports MoMo payment and COD (Cash on Delivery).'
    },
    {
      q: language === 'vi' ? 'Phí đăng bán sản phẩm là bao nhiêu?' : 'What is the listing fee?',
      a: language === 'vi' 
        ? 'Hoàn toàn MIỄN PHÍ đăng bán sản phẩm. Chúng tôi chỉ thu phí hoa hồng 5% khi giao dịch thành công.'
        : 'Completely FREE to list products. We only charge 5% commission on successful transactions.'
    },
    {
      q: language === 'vi' ? 'Làm sao để chat với người bán/người mua?' : 'How to chat with seller/buyer?',
      a: language === 'vi' 
        ? 'Nhấn vào nút "Chat" trên trang sản phẩm hoặc trong danh sách tin nhắn. Bạn cần đăng nhập để sử dụng tính năng này.'
        : 'Click "Chat" button on product page or in message list. You need to login to use this feature.'
    },
    {
      q: language === 'vi' ? 'Tôi muốn hoàn trả hàng, phải làm gì?' : 'I want to return items, what should I do?',
      a: language === 'vi' 
        ? 'Liên hệ người bán trong vòng 3 ngày kể từ khi nhận hàng, nêu rõ lý do và gửi kèm hình ảnh chứng minh.'
        : 'Contact seller within 3 days of receiving items, state reason clearly and attach proof photos.'
    },
    {
      q: language === 'vi' ? 'Làm sao để báo cáo vi phạm?' : 'How to report violations?',
      a: language === 'vi' 
        ? 'Nhấn vào nút "Báo cáo" trên sản phẩm hoặc tài khoản vi phạm, chọn lý do và gửi. Chúng tôi sẽ xử lý trong 24-48 giờ.'
        : 'Click "Report" button on violating product or account, select reason and submit. We will process within 24-48 hours.'
    },
    {
      q: language === 'vi' ? 'Tôi quên mật khẩu, phải làm sao?' : 'I forgot my password, what to do?',
      a: language === 'vi' 
        ? 'Nhấn "Quên mật khẩu" trên trang đăng nhập, nhập email đã đăng ký và làm theo hướng dẫn trong email.'
        : 'Click "Forgot Password" on login page, enter registered email and follow instructions in email.'
    },
    {
      q: language === 'vi' ? 'Sản phẩm có được bảo hành không?' : 'Are products covered under warranty?',
      a: language === 'vi' 
        ? 'Sản phẩm secondhand thường không có bảo hành. Vui lòng kiểm tra kỹ trước khi mua và trao đổi với người bán.'
        : 'Secondhand products usually have no warranty. Please inspect carefully before buying and discuss with seller.'
    },
    {
      q: language === 'vi' ? 'Làm sao để tăng cơ hội bán hàng?' : 'How to increase selling chances?',
      a: language === 'vi' 
        ? 'Chụp ảnh đẹp, mô tả chi tiết, định giá hợp lý, trả lời tin nhắn nhanh và duy trì đánh giá tích cực.'
        : 'Take good photos, detailed description, reasonable pricing, quick replies and maintain positive reviews.'
    },
    {
      q: language === 'vi' ? 'Tôi có thể xóa tài khoản không?' : 'Can I delete my account?',
      a: language === 'vi' 
        ? 'Có, liên hệ support@secondstyle.vn với tiêu đề "Xóa tài khoản" kèm email đã đăng ký. Tài khoản sẽ bị xóa vĩnh viễn sau 7 ngày.'
        : 'Yes, contact support@secondstyle.vn with subject "Delete Account" and registered email. Account will be permanently deleted after 7 days.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              {language === 'vi' ? 'Câu Hỏi Thường Gặp' : 'Frequently Asked Questions'}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90">
              {language === 'vi' 
                ? 'Câu trả lời cho những thắc mắc phổ biến'
                : 'Answers to common questions'}
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 hover:border-purple-300 transition-all shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-black mb-3">{faq.q}</h3>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
              {language === 'vi' ? 'Vẫn Còn Thắc Mắc?' : 'Still Have Questions?'}
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              {language === 'vi' 
                ? 'Liên hệ với chúng tôi, chúng tôi luôn sẵn sàng hỗ trợ!'
                : 'Contact us, we are always ready to help!'}
            </p>
            <a
              href="/help/contact"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
            >
              {language === 'vi' ? 'Liên Hệ Hỗ Trợ' : 'Contact Support'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
