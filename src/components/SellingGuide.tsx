import { useLanguage } from '../contexts/LanguageContext';
import { Camera, FileText, DollarSign, Package, TrendingUp } from 'lucide-react';

export default function SellingGuide() {
  const { language } = useLanguage();

  const steps = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: language === 'vi' ? 'Chụp Ảnh Chất Lượng' : 'Take Quality Photos',
      desc: language === 'vi' 
        ? 'Chụp ảnh rõ nét, đủ ánh sáng, nhiều góc độ (tối thiểu 3 ảnh). Thể hiện chi tiết và khuyết điểm (nếu có).'
        : 'Take clear, well-lit photos from multiple angles (minimum 3 photos). Show details and flaws (if any).'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: language === 'vi' ? 'Mô Tả Chi Tiết' : 'Detailed Description',
      desc: language === 'vi' 
        ? 'Ghi rõ kích cỡ, chất liệu, màu sắc, tình trạng, lý do bán. Càng chi tiết càng dễ bán.'
        : 'Clearly state size, material, color, condition, reason for selling. More details = easier to sell.'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: language === 'vi' ? 'Định Giá Hợp Lý' : 'Set Reasonable Price',
      desc: language === 'vi' 
        ? 'Tham khảo giá sản phẩm tương tự trên nền tảng. Cho phép thương lượng để tăng cơ hội bán.'
        : 'Research similar product prices on platform. Allow negotiation to increase sale chances.'
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: language === 'vi' ? 'Đóng Gói Cẩn Thận' : 'Pack Carefully',
      desc: language === 'vi' 
        ? 'Đóng gói sạch sẽ, cẩn thận để hàng không bị hư hỏng trong quá trình vận chuyển.'
        : 'Pack clean and carefully to prevent damage during shipping.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: language === 'vi' ? 'Tăng Uy Tín' : 'Build Reputation',
      desc: language === 'vi' 
        ? 'Giao hàng đúng hẹn, trả lời tin nhắn nhanh, thu về nhiều đánh giá tích cực.'
        : 'Deliver on time, reply messages promptly, collect positive reviews.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              {language === 'vi' ? 'Hướng Dẫn Bán Hàng' : 'Selling Guide'}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90">
              {language === 'vi' 
                ? 'Bán hàng hiệu quả trên SecondStyle'
                : 'Sell effectively on SecondStyle'}
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
                    <div className="text-sm font-bold text-pink-600 mb-2">
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
