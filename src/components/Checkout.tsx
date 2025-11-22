import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Banknote, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

export default function Checkout() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
  });

  const shippingFee = 30000;
  const finalTotal = total + shippingFee;

  const paymentMethods = [
    {
      id: 'vnpay',
      name: 'VNPay',
      icon: '💳',
      description: language === 'vi' ? 'Thanh toán qua VNPay' : 'Pay with VNPay',
    },
    {
      id: 'momo',
      name: 'MoMo',
      icon: '📱',
      description: language === 'vi' ? 'Ví điện tử MoMo' : 'MoMo E-Wallet',
    },
    {
      id: 'cod',
      name: 'COD',
      icon: '💵',
      description: language === 'vi' ? 'Thanh toán khi nhận hàng' : 'Cash on Delivery',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate shipping info
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      toast.error(language === 'vi' ? 'Vui lòng điền đầy đủ thông tin' : 'Please fill in all required fields');
      return;
    }

    // Mock order creation
    toast.success(language === 'vi' ? 'Đặt hàng thành công!' : 'Order placed successfully!');
    clearCart();
    navigate('/buyer-dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">{t('checkout')}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t('shippingAddress')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">
                      {language === 'vi' ? 'Họ và tên' : 'Full Name'} *
                    </Label>
                    <Input
                      id="fullName"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      {language === 'vi' ? 'Số điện thoại' : 'Phone Number'} *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">
                    {language === 'vi' ? 'Địa chỉ' : 'Address'} *
                  </Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    placeholder={language === 'vi' ? 'Số nhà, tên đường' : 'House number, street'}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">
                      {language === 'vi' ? 'Tỉnh/Thành phố' : 'City'}
                    </Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">
                      {language === 'vi' ? 'Quận/Huyện' : 'District'}
                    </Label>
                    <Input
                      id="district"
                      value={shippingInfo.district}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ward">
                      {language === 'vi' ? 'Phường/Xã' : 'Ward'}
                    </Label>
                    <Input
                      id="ward"
                      value={shippingInfo.ward}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, ward: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="note">
                    {language === 'vi' ? 'Ghi chú (không bắt buộc)' : 'Note (optional)'}
                  </Label>
                  <Input
                    id="note"
                    value={shippingInfo.note}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, note: e.target.value })}
                    placeholder={language === 'vi' ? 'Ghi chú cho người bán' : 'Note for seller'}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>{t('paymentMethod')}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? 'border-purple-600 bg-purple-50'
                            : 'hover:border-gray-400'
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex items-center gap-3 cursor-pointer flex-1">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <p>{method.name}</p>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t('orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.size && `Size: ${item.size}`} × {item.quantity}
                        </p>
                        <p className="text-sm text-purple-600">
                          {item.price.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Price Breakdown */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {language === 'vi' ? 'Tạm tính' : 'Subtotal'}
                    </span>
                    <span>{total.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {language === 'vi' ? 'Phí vận chuyển' : 'Shipping'}
                    </span>
                    <span>{shippingFee.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span>{language === 'vi' ? 'Tổng cộng' : 'Total'}</span>
                    <span className="text-purple-600">{finalTotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  size="lg"
                >
                  {language === 'vi' ? 'Đặt hàng' : 'Place Order'}
                  <ChevronRight className="ml-2 size-5" />
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  {language === 'vi'
                    ? 'Bằng cách đặt hàng, bạn đồng ý với Điều khoản sử dụng của chúng tôi'
                    : 'By placing an order, you agree to our Terms of Service'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
