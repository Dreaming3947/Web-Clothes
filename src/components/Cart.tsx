import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';

export default function Cart() {
  const { language, t } = useLanguage();
  const { items, removeItem, updateQuantity, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shippingFee = 30000;
  const finalTotal = total + shippingFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center size-24 bg-gray-100 rounded-full mb-6">
            <ShoppingBag className="size-12 text-gray-400" />
          </div>
          <h2 className="text-2xl mb-4">
            {language === 'vi' ? 'Giỏ hàng trống' : 'Your cart is empty'}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === 'vi' 
              ? 'Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm'
              : 'Add items to your cart to continue shopping'}
          </p>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Link to="/products">
              {language === 'vi' ? 'Tiếp tục mua sắm' : 'Continue Shopping'}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">{t('cart')}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link to={`/products/${item.productId}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-24 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.productId}`}>
                      <h3 className="mb-2 hover:text-purple-600">{item.name}</h3>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg text-purple-600">{item.price.toLocaleString('vi-VN')}₫</p>
                      
                      {/* Quantity Display - Fixed at 1 for secondhand items */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {language === 'vi' ? 'Số lượng:' : 'Quantity:'} {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl mb-6">{t('orderSummary')}</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'vi' ? 'Tạm tính' : 'Subtotal'}
                  </span>
                  <span>{total.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between">
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                size="lg"
                onClick={handleCheckout}
              >
                {t('checkout')}
              </Button>

              <Button variant="outline" className="w-full mt-3" asChild>
                <Link to="/products">
                  {language === 'vi' ? 'Tiếp tục mua sắm' : 'Continue Shopping'}
                </Link>
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span>{language === 'vi' ? 'Thanh toán an toàn' : 'Secure Payment'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    🚚
                  </div>
                  <span>{language === 'vi' ? 'Giao hàng nhanh chóng' : 'Fast Delivery'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    ↩️
                  </div>
                  <span>{language === 'vi' ? 'Đổi trả dễ dàng' : 'Easy Returns'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
