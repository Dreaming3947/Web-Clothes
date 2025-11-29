import { useState } from 'react';
import { Trash2, CreditCard, Truck, MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

const API_URL = 'http://127.0.0.1:8000/backend/api';

export function CheckoutPage() {
  const { user } = useAuth();
  const { items: cart, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    note: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = shippingMethod === 'express' ? 50000 : 25000;
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    if (!user) {
      toast.error('Vui lòng đăng nhập để đặt hàng');
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        items: cart.map(item => ({
          product_id: parseInt(item.productId),
          seller_id: item.sellerId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        shipping_name: shippingAddress.fullName,
        shipping_phone: shippingAddress.phone,
        shipping_address: shippingAddress.address,
        shipping_city: shippingAddress.city,
        shipping_district: shippingAddress.district,
        shipping_note: shippingAddress.note,
        shipping_fee: shippingFee,
        discount_amount: 0
      };

      const response = await fetch(`${API_URL}/orders.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Clear cart after successful order
        try {
          await clearCart();
          console.log('Cart cleared after order creation');
        } catch (clearError) {
          console.error('Failed to clear cart after order:', clearError);
          // Continue anyway, cart can be cleared manually
        }
        
        // Navigate to payment result page with success status
        const orderCode = result.data?.[0]?.order_code || 'N/A';
        navigate(`/payment-result?resultCode=0&orderId=${orderCode}&message=Order placed successfully`);
      } else {
        toast.error(result.message || 'Đặt hàng thất bại');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-md mx-auto p-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Tiếp tục mua sắm
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'cart') {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl mb-8">Giỏ hàng ({cart.length} sản phẩm)</h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-4">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="mb-2">{item.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && (
                          <>
                            <span>•</span>
                            <span>Màu: {item.color}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xl text-blue-600">
                          {item.price.toLocaleString('vi-VN')}₫
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">SL: {item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h3 className="mb-4">Tổng quan đơn hàng</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span>Tổng cộng</span>
                    <span className="text-2xl text-blue-600">
                      {total.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 mb-3"
                  size="lg"
                  onClick={() => setStep('checkout')}
                >
                  Tiến hành thanh toán
                </Button>

                <Button variant="outline" className="w-full">
                  Tiếp tục mua sắm
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl mb-8">Thanh toán</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3>Địa chỉ giao hàng</h3>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                      }
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, phone: e.target.value })
                      }
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, address: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Tỉnh/Thành phố</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, city: e.target.value })
                      }
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">Quận/Huyện</Label>
                    <Input
                      id="district"
                      value={shippingAddress.district}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, district: e.target.value })
                      }
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                  <Input
                    id="note"
                    placeholder="Ghi chú cho người bán..."
                    value={shippingAddress.note}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, note: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Shipping Method */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3>Phương thức vận chuyển</h3>
              </div>

              <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-blue-600">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="standard" />
                      <div>
                        <p>Giao hàng tiêu chuẩn</p>
                        <p className="text-sm text-gray-600">3-5 ngày</p>
                      </div>
                    </div>
                    <span>25,000₫</span>
                  </label>

                  <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-blue-600">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="express" />
                      <div>
                        <p>Giao hàng nhanh</p>
                        <p className="text-sm text-gray-600">1-2 ngày</p>
                      </div>
                    </div>
                    <span>50,000₫</span>
                  </label>
                </div>
              </RadioGroup>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3>Phương thức thanh toán</h3>
              </div>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-blue-600">
                    <RadioGroupItem value="cod" />
                    <div>
                      <p>Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-blue-600">
                    <RadioGroupItem value="bank" />
                    <div>
                      <p>Chuyển khoản ngân hàng</p>
                      <p className="text-sm text-gray-600">Chuyển khoản qua ngân hàng</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-blue-600">
                    <RadioGroupItem value="momo" />
                    <div>
                      <p>Ví MoMo</p>
                      <p className="text-sm text-gray-600">Thanh toán qua ví điện tử MoMo</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-blue-600">
                    <RadioGroupItem value="vnpay" />
                    <div>
                      <p>VNPay</p>
                      <p className="text-sm text-gray-600">Thanh toán qua cổng VNPay</p>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h3 className="mb-4">Đơn hàng của bạn</h3>

              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm line-clamp-2 mb-1">{item.name}</p>
                      <p className="text-sm text-gray-600">SL: {item.quantity}</p>
                    </div>
                    <div className="text-sm">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee.toLocaleString('vi-VN')}₫</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span>Tổng cộng</span>
                  <span className="text-2xl text-blue-600">
                    {total.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 mb-3"
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep('cart')}
              >
                Quay lại giỏ hàng
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
