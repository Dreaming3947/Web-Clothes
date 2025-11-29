import { useLanguage } from '../contexts/LanguageContext';

export default function TermsOfService() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              {language === 'vi' ? 'Điều Khoản Sử Dụng' : 'Terms of Service'}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90">
              {language === 'vi' 
                ? 'Cập nhật lần cuối: Tháng 11, 2025'
                : 'Last updated: November, 2025'}
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
                {language === 'vi' ? '1. Chấp Nhận Điều Khoản' : '1. Acceptance of Terms'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                {language === 'vi' 
                  ? 'Khi sử dụng nền tảng SecondStyle, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này. Nếu không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.'
                  : 'By using the SecondStyle platform, you agree to comply with the terms and conditions outlined in this document. If you do not agree, please do not use our services.'}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? '2. Tài Khoản Người Dùng' : '2. User Accounts'}
              </h2>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Bạn phải từ 16 tuổi trở lên để đăng ký tài khoản' : 'You must be 16 years or older to register an account'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Thông tin đăng ký phải chính xác và đầy đủ' : 'Registration information must be accurate and complete'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Bảo mật mật khẩu và chịu tr책nhiệm cho mọi hoạt động dưới tài khoản' : 'Secure your password and be responsible for all activities under your account'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Không chia sẻ tài khoản cho người khác' : 'Do not share your account with others'}</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? '3. Quy Định Giao Dịch' : '3. Transaction Rules'}
              </h2>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Sản phẩm đăng bán phải là hàng thật, không vi phạm bản quyền' : 'Products listed must be genuine and not infringe copyrights'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Hình ảnh và mô tả phải chính xác, trung thực' : 'Images and descriptions must be accurate and honest'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Không bán hàng giả, hàng cấm, hàng nguy hiểm' : 'No counterfeit, prohibited, or dangerous goods'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Giao dịch phải tuân thủ pháp luật Việt Nam' : 'Transactions must comply with Vietnamese law'}</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? '4. Hành Vi Bị Cấm' : '4. Prohibited Conduct'}
              </h2>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>{language === 'vi' ? 'Lừa đảo, gian lận trong giao dịch' : 'Fraud or deception in transactions'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>{language === 'vi' ? 'Spam, quấy rối người dùng khác' : 'Spam or harass other users'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>{language === 'vi' ? 'Sử dụng công nghệ tự động để truy cập hệ thống' : 'Use automated technology to access the system'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>{language === 'vi' ? 'Đăng nội dung vi phạm pháp luật, đạo đức' : 'Post content that violates law or ethics'}</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? '5. Quyền Và Trách Nhiệm Của SecondStyle' : '5. Rights and Responsibilities of SecondStyle'}
              </h2>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Chúng tôi có quyền xóa nội dung vi phạm mà không cần thông báo trước' : 'We have the right to remove violating content without prior notice'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Có thể tạm khóa hoặc xóa tài khoản vi phạm nghiêm trọng' : 'May suspend or delete accounts for serious violations'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Không chịu trách nhiệm về tranh chấp giữa người mua và người bán' : 'Not responsible for disputes between buyers and sellers'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Cung cấp nền tảng kết nối, không trực tiếp tham gia giao dịch' : 'Provide connecting platform, not directly involved in transactions'}</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? '6. Sửa Đổi Điều Khoản' : '6. Modification of Terms'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                {language === 'vi' 
                  ? 'SecondStyle có quyền sửa đổi các điều khoản này bất cứ lúc nào. Chúng tôi sẽ thông báo qua email hoặc trên nền tảng về bất kỳ thay đổi quan trọng nào. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận điều khoản mới.'
                  : 'SecondStyle reserves the right to modify these terms at any time. We will notify via email or on the platform about any significant changes. Continued use of the service after changes means you accept the new terms.'}
              </p>
            </section>

            <section className="mb-10 bg-gradient-to-r from-purple-50 to-pink-50 p-6 md:p-8 rounded-2xl border-2 border-purple-100">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? '7. Liên Hệ' : '7. Contact'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-3">
                {language === 'vi' 
                  ? 'Nếu có thắc mắc về điều khoản sử dụng, vui lòng liên hệ:'
                  : 'If you have questions about the terms of service, please contact:'}
              </p>
              <ul className="space-y-2 text-base md:text-lg text-gray-700">
                <li><strong>Email:</strong> support@secondstyle.vn</li>
                <li><strong>Hotline:</strong> 1900 123 456</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
