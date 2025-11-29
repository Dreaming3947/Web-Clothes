import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Heart, 
  Target, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  Smartphone,
  Bot,
  Truck,
  Recycle,
  Shield,
  Lightbulb,
  Link as LinkIcon
} from 'lucide-react';

export function About() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const teamMembers = [
    { name: 'Phạm Văn Phi Long', role: 'Team Leader', avatar: 'L' },
    { name: 'Nguyễn Văn Trí Toàn', role: 'Developer', avatar: 'T' },
    { name: 'Trần Thị Yến Vy', role: 'Developer', avatar: 'V' },
    { name: 'Phạm Nguyễn Tường Vy', role: 'Developer', avatar: 'V' },
    { name: 'Huỳnh Lê Ngọc Diễm', role: 'Developer', avatar: 'D' }
  ];

  const coreValues = [
    {
      icon: <Recycle className="w-8 h-8" />,
      title: language === 'vi' ? 'Bền Vững' : 'Sustainable',
      desc: language === 'vi' 
        ? 'Sử dụng lại quần áo, giảm tác động môi trường' 
        : 'Reuse clothes, reduce environmental impact'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: language === 'vi' ? 'Tin Cậy' : 'Trustworthy',
      desc: language === 'vi' 
        ? 'Minh bạch, an toàn trong mọi giao dịch' 
        : 'Transparent and safe in all transactions'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: language === 'vi' ? 'Sáng Tạo' : 'Creative',
      desc: language === 'vi' 
        ? 'Cải tiến không ngừng, nâng cao trải nghiệm' 
        : 'Continuous improvement, enhanced experience'
    },
    {
      icon: <LinkIcon className="w-8 h-8" />,
      title: language === 'vi' ? 'Kết Nối' : 'Connected',
      desc: language === 'vi' 
        ? 'Giao tiếp dễ dàng giữa người mua và bán' 
        : 'Easy communication between buyers and sellers'
    }
  ];

  const futurePlans = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: language === 'vi' ? 'Ứng Dụng Mobile' : 'Mobile App',
      items: language === 'vi' 
        ? ['App trên iOS & Android', 'Thông báo đẩy', 'Quét QR nhanh chóng']
        : ['iOS & Android apps', 'Push notifications', 'Quick QR scanning']
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: language === 'vi' ? 'Tích Hợp AI' : 'AI Integration',
      items: language === 'vi' 
        ? ['Gợi ý theo phong cách', 'Nhận diện size & màu', 'Gợi ý outfit mix-match']
        : ['Style recommendations', 'Size & color recognition', 'Outfit suggestions']
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: language === 'vi' ? 'Vận Chuyển Nâng Cao' : 'Enhanced Shipping',
      items: language === 'vi' 
        ? ['Kết nối GHN, GHTK', 'Theo dõi real-time', 'Nhiều đơn vị vận chuyển']
        : ['GHN, GHTK integration', 'Real-time tracking', 'Multiple carriers']
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: language === 'vi' ? 'Mở Rộng' : 'Expansion',
      items: language === 'vi' 
        ? ['Phụ kiện & giày dép', 'Thời trang vintage', 'Cộng đồng Fashion Recycle']
        : ['Accessories & shoes', 'Vintage fashion', 'Fashion Recycle community']
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 mb-4 md:mb-6">
              <p className="text-sm md:text-base font-medium">
                {language === 'vi' ? '🌱 Thời Trang Bền Vững' : '🌱 Sustainable Fashion'}
              </p>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-4 md:mb-6 tracking-tight drop-shadow-lg leading-tight">
              SecondStyle
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-4 md:mb-6 font-light tracking-wide px-2">
              {language === 'vi' 
                ? 'Nền Tảng Mua Bán Quần Áo Secondhand' 
                : 'Secondhand Fashion Marketplace'}
            </p>
            <p className="text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed max-w-2xl lg:max-w-3xl mx-auto opacity-90 font-light px-4">
              {language === 'vi' 
                ? 'Hệ thống thương mại điện tử giúp mua bán – tái sử dụng – trao đổi quần áo cũ theo cách an toàn, minh bạch và thân thiện với môi trường.'
                : 'E-commerce system for buying, selling, and exchanging secondhand clothes in a safe, transparent, and eco-friendly way.'}
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl md:rounded-3xl p-6 md:p-10 text-white shadow-xl">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold mb-3 md:mb-4 tracking-tight">
                {language === 'vi' ? 'Tầm Nhìn' : 'Vision'}
              </h3>
              <p className="text-lg md:text-xl leading-relaxed opacity-95">
                {language === 'vi' 
                  ? 'Trở thành nền tảng mua bán quần áo cũ dành cho sinh viên hàng đầu Việt Nam, hướng đến một tương lai nơi thời trang secondhand không chỉ là lựa chọn tiết kiệm mà còn là phong cách sống văn minh, thời thượng và thân thiện với môi trường.'
                  : 'Become Vietnam\'s leading secondhand fashion platform for students, where secondhand fashion is not just an economical choice but a civilized, trendy, and eco-friendly lifestyle.'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl md:rounded-3xl p-6 md:p-10 text-black shadow-xl">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                <Target className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold mb-3 md:mb-4 tracking-tight">
                {language === 'vi' ? 'Sứ Mệnh' : 'Mission'}
              </h3>
              <ul className="space-y-2 md:space-y-3 text-base md:text-lg leading-relaxed opacity-95">
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>{language === 'vi' ? 'Tạo môi trường giao dịch minh bạch, an toàn' : 'Create transparent, safe trading environment'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>{language === 'vi' ? 'Trao cơ hội làm mới bản thân với chi phí thấp' : 'Provide affordable fashion renewal opportunities'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>{language === 'vi' ? 'Hướng đến zero waste trong thời trang' : 'Aim for zero waste in fashion'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>{language === 'vi' ? 'Xây dựng cộng đồng tin cậy – sáng tạo' : 'Build trusted, creative community'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
                <Heart className="w-4 h-4" />
                <span className="text-sm md:text-base font-semibold uppercase tracking-wide">
                  {language === 'vi' ? 'Câu Chuyện' : 'Our Story'}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-4 md:mb-6 tracking-tight leading-tight px-4">
                {language === 'vi' ? 'Tại Sao SecondStyle?' : 'Why SecondStyle?'}
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                  <Target className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-black mb-3 md:mb-4 tracking-tight">
                  {language === 'vi' ? 'Vấn Đề' : 'The Problem'}
                </h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-normal mb-4">
                  {language === 'vi' 
                    ? 'Nhiều sinh viên mua sắm quá mức nhưng không sử dụng hết quần áo. Số khác muốn sở hữu đồ chất lượng nhưng ngân sách hạn chế.' 
                    : 'Many students overbuy clothes they don\'t use. Others want quality items but have limited budgets.'}
                </p>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed italic">
                  {language === 'vi'
                    ? '"Làm thế nào để một chiếc áo, chiếc quần vẫn còn tốt có thể tiếp tục được sử dụng, thay vì bị bỏ phí?"'
                    : '"How can clothes that are still good continue to be used instead of being wasted?"'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-xl text-white">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                  <Lightbulb className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 tracking-tight">
                  {language === 'vi' ? 'Giải Pháp' : 'The Solution'}
                </h3>
                <p className="text-lg md:text-xl leading-relaxed opacity-95 font-normal">
                  {language === 'vi' 
                    ? 'SecondStyle kết nối hai nhu cầu này – tạo vòng tuần hoàn thời trang bền vững, tiết kiệm chi phí và giảm rác thải.' 
                    : 'SecondStyle connects these needs – creating a sustainable fashion cycle, saving money and reducing waste.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full mb-4">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm md:text-base font-semibold uppercase tracking-wide">
                {language === 'vi' ? 'Tính Năng' : 'Features'}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-3 md:mb-4 tracking-tight leading-tight px-4">
              {language === 'vi' ? 'Tính Năng Nổi Bật' : 'Key Features'}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light px-4">
              {language === 'vi' 
                ? 'Trải nghiệm mua sắm toàn diện cho người mua, người bán và quản trị viên'
                : 'Complete shopping experience for buyers, sellers and administrators'}
            </p>
          </div>

          {/* Buyer Features */}
          <div className="max-w-6xl mx-auto mb-12 md:mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl md:rounded-3xl p-6 md:p-8 border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                  {language === 'vi' ? 'Người Mua (Buyer)' : 'For Buyers'}
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {[
                  { text: language === 'vi' ? 'Tìm kiếm & lọc sản phẩm nhanh' : 'Fast product search & filter' },
                  { text: language === 'vi' ? 'Chi tiết sản phẩm rõ ràng' : 'Clear product details' },
                  { text: language === 'vi' ? 'Giỏ hàng & thanh toán tiện lợi' : 'Easy cart & checkout' },
                  { text: language === 'vi' ? 'Chat trực tiếp người bán' : 'Direct seller chat' },
                  { text: language === 'vi' ? 'Thương lượng giá linh hoạt' : 'Flexible price negotiation' },
                  { text: language === 'vi' ? 'Theo dõi đơn hàng' : 'Order tracking' },
                  { text: language === 'vi' ? 'Đánh giá & phản hồi' : 'Reviews & feedback' },
                  { text: language === 'vi' ? 'Quản lý lịch sử mua hàng' : 'Purchase history' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700 text-base md:text-lg">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seller Features */}
          <div className="max-w-6xl mx-auto mb-12 md:mb-16">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl md:rounded-3xl p-6 md:p-8 border-2 border-purple-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  </svg>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                  {language === 'vi' ? 'Người Bán (Seller)' : 'For Sellers'}
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {[
                  { text: language === 'vi' ? 'Đăng sản phẩm nhanh chóng' : 'Quick product listing' },
                  { text: language === 'vi' ? 'Quản lý kho chuyên nghiệp' : 'Professional inventory' },
                  { text: language === 'vi' ? 'Thống kê doanh thu' : 'Revenue statistics' },
                  { text: language === 'vi' ? 'Trả lời tin nhắn nhanh' : 'Quick message reply' },
                  { text: language === 'vi' ? 'Cài đặt giá tối thiểu' : 'Set minimum price' },
                  { text: language === 'vi' ? 'Quản lý đơn hàng' : 'Order management' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700 text-base md:text-lg">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Features */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl md:rounded-3xl p-6 md:p-8 border-2 border-green-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                  {language === 'vi' ? 'Quản Trị Viên (Admin)' : 'For Administrators'}
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {[
                  { text: language === 'vi' ? 'Quản lý hệ thống toàn diện' : 'Comprehensive system management' },
                  { text: language === 'vi' ? 'Duyệt/khóa tài khoản' : 'Account approval/blocking' },
                  { text: language === 'vi' ? 'Kiểm duyệt sản phẩm' : 'Product moderation' },
                  { text: language === 'vi' ? 'Theo dõi đơn hàng toàn nền tảng' : 'Platform-wide order tracking' },
                  { text: language === 'vi' ? 'Thống kê realtime' : 'Real-time statistics' },
                  { text: language === 'vi' ? 'Xử lý báo cáo vi phạm' : 'Handle violation reports' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700 text-base md:text-lg">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
                <Recycle className="w-4 h-4" />
                <span className="text-sm md:text-base font-semibold uppercase tracking-wide">
                  {language === 'vi' ? 'Giá Trị' : 'Values'}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-3 md:mb-4 tracking-tight leading-tight px-4">
              {language === 'vi' ? 'Điều Chúng Tôi Tin Tưởng' : 'What We Believe In'}
            </h2>
          </div>

          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="text-center group px-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  {value.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-black mb-2 md:mb-3 tracking-tight">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg md:text-xl font-normal">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Plans */}
      <div className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full mb-4">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm md:text-base font-semibold uppercase tracking-wide">
                  {language === 'vi' ? 'Tương Lai' : 'Future'}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-3 md:mb-4 tracking-tight leading-tight px-4">
                {language === 'vi' ? 'Kế Hoạch Phát Triển' : 'Development Roadmap'}
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light px-4">
              {language === 'vi' 
                ? 'Định hướng mở rộng và nâng cấp nền tảng trong tương lai'
                : 'Future expansion and platform upgrade directions'}
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {futurePlans.map((plan, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl md:rounded-2xl p-6 md:p-7 lg:p-8 border-2 border-gray-100 hover:border-purple-300 transition-all hover:shadow-lg group">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center text-white mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  {plan.icon}
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-black mb-4 md:mb-5 tracking-tight leading-snug">{plan.title}</h3>
                <ul className="space-y-3 md:space-y-4 pl-2">
                  {plan.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 font-normal">
                      <span className="text-purple-600 mt-1 flex-shrink-0 text-lg">•</span>
                      <span className="leading-relaxed text-base md:text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
                <Users className="w-4 h-4" />
                <span className="text-sm md:text-base font-semibold uppercase tracking-wide">
                  {language === 'vi' ? 'Đội Ngũ' : 'Team'}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-3 md:mb-4 tracking-tight leading-tight px-4">
                {language === 'vi' ? 'Nhóm Thực Hiện' : 'Our Team'}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 font-light px-4">
                {language === 'vi' ? 'Nhóm 11 - Lớp Lập Trình Web' : 'Group 11 - Web Programming Class'}
              </p>
            </div>

            <div className="flex flex-col items-center mb-8 md:mb-12">
              {/* Leader */}
              <div className="text-center mb-6 md:mb-8">
                <div className="relative mb-3 md:mb-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-900 rounded-xl md:rounded-2xl flex items-center justify-center text-black mx-auto shadow-lg ring-4 ring-purple-500">
                    <span className="text-4xl md:text-5xl font-black">{teamMembers[0].avatar}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                    <svg className="w-4 h-4 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black tracking-tight leading-snug px-1">{teamMembers[0].name}</h3>
                <p className="text-purple-600 font-semibold text-sm md:text-base mt-1 px-1">{teamMembers[0].role}</p>
              </div>

              {/* Other Members */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl">
                {teamMembers.slice(1).map((member, index) => (
                  <div key={index} className="text-center">
                    <div className="relative mb-3 md:mb-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-900 rounded-xl md:rounded-2xl flex items-center justify-center text-black mx-auto shadow-lg ring-4 ring-purple-400">
                        <span className="text-3xl md:text-4xl font-black">{member.avatar}</span>
                      </div>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-black tracking-tight leading-snug px-1">{member.name}</h3>
                    <p className="text-gray-600 font-normal text-sm md:text-base mt-1 px-1">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl md:rounded-3xl p-5 md:p-8 border-2 border-purple-100">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6 text-center md:text-left">
                <div>
                  <p className="text-gray-700 mb-2 leading-relaxed text-base md:text-lg">
                    <span className="font-bold text-black">{language === 'vi' ? 'Giảng viên:' : 'Instructor:'}</span> Trần Thịnh Mạnh Đức
                  </p>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    <span className="font-bold text-black">{language === 'vi' ? 'Năm học:' : 'Year:'}</span> 2024 - 2025
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 mb-2 leading-relaxed text-base md:text-lg">
                    <span className="font-bold text-black">{language === 'vi' ? 'Trường:' : 'University:'}</span> ĐH Giao Thông Vận Tải TP.HCM
                  </p>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    <span className="font-bold text-black">{language === 'vi' ? 'Địa chỉ:' : 'Address:'}</span> 2 Võ Oanh, Q.2, TP.HCM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-sm md:text-base font-semibold uppercase tracking-wide">
                {language === 'vi' ? 'Công Nghệ' : 'Technology'}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-3 md:mb-4 tracking-tight leading-tight px-4">
              {language === 'vi' ? 'Công Nghệ Sử Dụng' : 'Tech Stack'}
            </h2>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl md:rounded-3xl p-5 md:p-8 border-2 border-blue-100 text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg md:rounded-xl flex items-center justify-center text-white mb-4 md:mb-6 mx-auto">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6 tracking-tight">Frontend</h3>
              <ul className="space-y-2 md:space-y-3 text-gray-700 font-normal text-base md:text-lg">
                <li className="flex items-center gap-2 justify-center">
                  <span className="text-blue-600">⚛️</span>
                  <span>React 18 + TypeScript</span>
                </li>
                <li className="flex items-center gap-2 justify-center">
                  <span className="text-blue-600">🎨</span>
                  <span>Tailwind CSS</span>
                </li>
                <li className="flex items-center gap-2 justify-center">
                  <span className="text-blue-600">🧩</span>
                  <span>Radix UI</span>
                </li>
                <li className="flex items-center gap-2 justify-center">
                  <span className="text-blue-600">🌐</span>
                  <span>i18n Support</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl md:rounded-3xl p-5 md:p-8 border-2 border-purple-100 text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center text-white mb-4 md:mb-6 mx-auto">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6 tracking-tight">Backend</h3>
              <ul className="space-y-2 md:space-y-3 text-gray-700 font-normal text-base md:text-lg">
                <li className="flex items-center gap-2 justify-center">
                  <span className="text-purple-600">🐘</span>
                  <span>PHP 8.5</span>
                </li>
                <li className="flex items-center gap-2 justify-center">
                  <span className="text-purple-600">🗄️</span>
                  <span>MySQL Database</span>
                </li>
                <li className="flex items-center gap-2 justify-center">
                  <span className="text-purple-600">🔐</span>
                  <span>JWT Authentication</span>
                </li>
                <li className="flex items-center gap-2 justify-center">
                  <span className="text-purple-600">📁</span>
                  <span>RESTful API</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl md:rounded-3xl p-5 md:p-8 border-2 border-green-100 text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg md:rounded-xl flex items-center justify-center text-white mb-4 md:mb-6 mx-auto">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6 tracking-tight">{language === 'vi' ? 'Công Cụ' : 'Tools'}</h3>
              <ul className="space-y-2 md:space-y-3 text-gray-700 font-normal text-base md:text-lg">
                <li className="flex items-center gap-2 justify-center">
                  <span className="text-green-600">📦</span>
                  <span>Vite</span>
                </li>
                <li className="flex items-center gap-2 justify-center">
                  <span className="text-green-600">🎯</span>
                  <span>Git/GitHub</span>
                </li>
                <li className="flex items-center gap-2 justify-center">
                  <span className="text-green-600">💳</span>
                  <span>MoMo Payment</span>
                </li>
                <li className="flex items-center gap-2 justify-center">
                  <span className="text-green-600">🖥️</span>
                  <span>VS Code</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6 tracking-tight leading-tight drop-shadow-lg px-4">
            {language === 'vi' ? 'Bắt Đầu Hành Trình Của Bạn' : 'Start Your Journey'}
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-light px-4">
            {language === 'vi' 
              ? 'Tham gia cộng đồng thời trang bền vững ngay hôm nay'
              : 'Join the sustainable fashion community today'}
          </p>
          <div className="flex gap-3 md:gap-4 justify-center flex-wrap px-4">
            {!user && (
              <a href="/register" className="bg-white text-purple-700 px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                {language === 'vi' ? 'Đăng Ký Miễn Phí' : 'Sign Up Free'}
              </a>
            )}
            <a href="/products" className="bg-purple-700 text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-purple-800 transition-all border-2 border-white/40 shadow-xl">
              {language === 'vi' ? 'Xem Sản Phẩm' : 'View Products'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
