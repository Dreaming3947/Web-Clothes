import { useLanguage } from '../contexts/LanguageContext';
import { AlertTriangle, Flag, Shield } from 'lucide-react';

export default function ReportViolation() {
  const { language } = useLanguage();

  const violationTypes = [
    {
      title: language === 'vi' ? 'Hàng Giả, Hàng Nhái' : 'Counterfeit Goods',
      desc: language === 'vi' ? 'Sản phẩm giả mạo nhãn hiệu, vi phạm bản quyền' : 'Fake branded products, copyright infringement'
    },
    {
      title: language === 'vi' ? 'Mô Tả Sai Lệch' : 'Misleading Description',
      desc: language === 'vi' ? 'Hình ảnh, thông tin không đúng với sản phẩm thực tế' : 'Images, information not matching actual product'
    },
    {
      title: language === 'vi' ? 'Lừa Đảo' : 'Fraud',
      desc: language === 'vi' ? 'Nhận tiền không giao hàng, giao hàng khác mô tả' : 'Taking money without delivery, delivering different items'
    },
    {
      title: language === 'vi' ? 'Ngôn Từ Không Phù Hợp' : 'Inappropriate Language',
      desc: language === 'vi' ? 'Chửi bới, phân biệt đối xử, quấy rối' : 'Cursing, discrimination, harassment'
    },
    {
      title: language === 'vi' ? 'Spam' : 'Spam',
      desc: language === 'vi' ? 'Đăng bài trùng lặp, quảng cáo không liên quan' : 'Duplicate posts, irrelevant advertising'
    },
    {
      title: language === 'vi' ? 'Hàng Cấm' : 'Prohibited Items',
      desc: language === 'vi' ? 'Vũ khí, chất cấm, hàng nguy hiểm' : 'Weapons, banned substances, dangerous goods'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              {language === 'vi' ? 'Báo Cáo Vi Phạm' : 'Report Violation'}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90">
              {language === 'vi' 
                ? 'Giúp chúng tôi duy trì cộng đồng an toàn và lành mạnh'
                : 'Help us maintain a safe and healthy community'}
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <section className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 text-center">
                {language === 'vi' ? 'Các Loại Vi Phạm' : 'Types of Violations'}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {violationTypes.map((type, index) => (
                  <div key={index} className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-100">
                    <div className="flex items-start gap-3 mb-2">
                      <Flag className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      <h3 className="text-xl font-bold text-black">{type.title}</h3>
                    </div>
                    <p className="text-base text-gray-700 ml-9">{type.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                {language === 'vi' ? 'Cách Báo Cáo' : 'How to Report'}
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      {language === 'vi' ? 'Tìm Nút "Báo Cáo"' : 'Find "Report" Button'}
                    </h3>
                    <p className="text-base md:text-lg text-gray-700">
                      {language === 'vi' 
                        ? 'Trên trang sản phẩm, hồ sơ người dùng hoặc trong tin nhắn, nhấn vào biểu tượng 3 chấm (...) và chọn "Báo cáo".'
                        : 'On product page, user profile or in messages, click the 3-dot icon (...) and select "Report".'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      {language === 'vi' ? 'Chọn Loại Vi Phạm' : 'Select Violation Type'}
                    </h3>
                    <p className="text-base md:text-lg text-gray-700">
                      {language === 'vi' 
                        ? 'Chọn loại vi phạm phù hợp nhất từ danh sách và mô tả chi tiết vấn đề.'
                        : 'Select the most appropriate violation type from the list and describe the issue in detail.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      {language === 'vi' ? 'Cung Cấp Bằng Chứng' : 'Provide Evidence'}
                    </h3>
                    <p className="text-base md:text-lg text-gray-700">
                      {language === 'vi' 
                        ? 'Đính kèm ảnh chụp màn hình, tin nhắn, hình ảnh để hỗ trợ báo cáo của bạn.'
                        : 'Attach screenshots, messages, photos to support your report.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      {language === 'vi' ? 'Gửi Báo Cáo' : 'Submit Report'}
                    </h3>
                    <p className="text-base md:text-lg text-gray-700">
                      {language === 'vi' 
                        ? 'Nhấn "Gửi" và chờ đợi. Chúng tôi sẽ xử lý trong vòng 24-48 giờ và thông báo kết quả qua email.'
                        : 'Click "Submit" and wait. We will process within 24-48 hours and notify you via email.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-yellow-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-black">
                  {language === 'vi' ? 'Lưu Ý Quan Trọng' : 'Important Notes'}
                </h2>
              </div>
              <ul className="space-y-3 text-base md:text-lg text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Báo cáo sai sự thật có thể dẫn đến khóa tài khoản' : 'False reports may result in account suspension'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Thông tin người báo cáo được bảo mật tuyệt đối' : 'Reporter information is kept strictly confidential'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Các báo cáo sẽ được xem xét kỹ lưỡng trước khi xử lý' : 'Reports will be carefully reviewed before action'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>{language === 'vi' ? 'Bạn có thể theo dõi trạng thái báo cáo trong "Tài khoản > Báo cáo của tôi"' : 'Track report status in "Account > My Reports"'}</span>
                </li>
              </ul>
            </section>

            <section className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 md:p-8 rounded-2xl border-2 border-purple-100">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                {language === 'vi' ? 'Liên Hệ Khẩn Cấp' : 'Emergency Contact'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 mb-3">
                {language === 'vi' 
                  ? 'Trường hợp khẩn cấp hoặc vi phạm nghiêm trọng:'
                  : 'For emergencies or serious violations:'}
              </p>
              <ul className="space-y-2 text-base md:text-lg text-gray-700">
                <li><strong>Email:</strong> report@secondstyle.vn</li>
                <li><strong>Hotline:</strong> 1900 123 456</li>
                <li><strong>{language === 'vi' ? 'Thời gian phản hồi' : 'Response time'}:</strong> {language === 'vi' ? '24-48 giờ' : '24-48 hours'}</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
