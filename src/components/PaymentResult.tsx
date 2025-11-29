import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    // Get parameters from MoMo redirect
    const resultCode = searchParams.get('resultCode');
    const orderId = searchParams.get('orderId');
    const message = searchParams.get('message');

    console.log('Payment Result:', { resultCode, orderId, message });

    // ResultCode = 0 means success
    if (resultCode === '0') {
      setStatus('success');
      
      // Clear cart state in frontend to sync with backend
      // (Backend already cleared via MoMo callback or order creation)
      clearCart().catch(err => {
        console.log('Cart already cleared by backend:', err);
      });
    } else {
      setStatus('failed');
    }
  }, [searchParams, clearCart]);

  const handleContinue = () => {
    if (status === 'success') {
      navigate('/buyer-dashboard');
    } else {
      navigate('/checkout');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="size-12 animate-spin text-purple-600" />
              <p className="text-gray-600">
                {language === 'vi' ? 'Đang xử lý thanh toán...' : 'Processing payment...'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {language === 'vi' ? 'Kết quả thanh toán' : 'Payment Result'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6">
            {status === 'success' ? (
              <>
                <CheckCircle className="size-20 text-green-500" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    {language === 'vi' ? 'Thanh toán thành công!' : 'Payment Successful!'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'vi'
                      ? 'Đơn hàng của bạn đã được xác nhận. Cảm ơn bạn đã mua hàng!'
                      : 'Your order has been confirmed. Thank you for your purchase!'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {language === 'vi'
                      ? 'Mã đơn hàng: ' + searchParams.get('orderId')
                      : 'Order ID: ' + searchParams.get('orderId')}
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="size-20 text-red-500" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-red-700 mb-2">
                    {language === 'vi' ? 'Thanh toán thất bại' : 'Payment Failed'}
                  </h3>
                  <p className="text-gray-600">
                    {searchParams.get('message') ||
                      (language === 'vi'
                        ? 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'
                        : 'An error occurred during payment. Please try again.')}
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/')}
              >
                {language === 'vi' ? 'Về trang chủ' : 'Go Home'}
              </Button>
              <Button
                className="flex-1"
                onClick={handleContinue}
              >
                {status === 'success'
                  ? language === 'vi'
                    ? 'Xem đơn hàng'
                    : 'View Orders'
                  : language === 'vi'
                  ? 'Thử lại'
                  : 'Try Again'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
