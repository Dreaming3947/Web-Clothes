import { useState } from 'react';
import { DollarSign, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

interface PriceNegotiationProps {
  productId: string;
  currentPrice: number;
  minAcceptablePrice?: number;
  sellerId: string;
  allowNegotiation?: boolean;
}

export default function PriceNegotiation({
  productId,
  currentPrice,
  minAcceptablePrice,
  sellerId,
  allowNegotiation = true,
}: PriceNegotiationProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offeredPrice, setOfferedPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmitOffer = async () => {
    const price = parseFloat(offeredPrice);

    if (!price || price <= 0) {
      toast.error(language === 'vi' ? 'Vui lòng nhập giá hợp lệ' : 'Please enter a valid price');
      return;
    }

    if (price >= currentPrice) {
      toast.error(
        language === 'vi'
          ? 'Giá đề xuất phải thấp hơn giá hiện tại'
          : 'Offered price must be lower than current price'
      );
      return;
    }

    if (minAcceptablePrice && price < minAcceptablePrice * 0.8) {
      toast.error(
        language === 'vi'
          ? 'Giá đề xuất quá thấp so với mong muốn của người bán'
          : 'Offered price is too low'
      );
      return;
    }

    setLoading(true);

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        language === 'vi'
          ? '✅ Đã gửi đề xuất giá! Người bán sẽ phản hồi sớm.'
          : '✅ Price offer sent! Seller will respond soon.'
      );

      setOpen(false);
      setOfferedPrice('');
      setMessage('');
    } catch (error) {
      toast.error(
        language === 'vi' ? 'Không thể gửi đề xuất' : 'Failed to send offer'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!allowNegotiation) {
    return null;
  }

  if (!user || user.role !== 'buyer') {
    return null;
  }

  if (user.id === sellerId) {
    return null;
  }

  const discountPercentage = offeredPrice
    ? Math.round(((currentPrice - parseFloat(offeredPrice)) / currentPrice) * 100)
    : 0;

  const suggestedPrices = [
    Math.round(currentPrice * 0.9), // -10%
    Math.round(currentPrice * 0.85), // -15%
    Math.round(currentPrice * 0.8), // -20%
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
        >
          <DollarSign className="size-4 mr-2" />
          {language === 'vi' ? 'Thương lượng giá' : 'Negotiate Price'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'vi' ? '💰 Đề xuất giá của bạn' : '💰 Make an Offer'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {language === 'vi' ? 'Giá hiện tại' : 'Current Price'}
              </span>
              <span className="text-lg font-semibold">
                {currentPrice.toLocaleString('vi-VN')}₫
              </span>
            </div>
            {minAcceptablePrice && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {language === 'vi' ? 'Giá tối thiểu gợi ý' : 'Suggested Min'}
                </span>
                <span className="text-green-600">
                  ~{Math.round(minAcceptablePrice).toLocaleString('vi-VN')}₫
                </span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="offered-price">
              {language === 'vi' ? 'Giá bạn muốn trả (₫)' : 'Your Offer (₫)'}
            </Label>
            <Input
              id="offered-price"
              type="number"
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(e.target.value)}
              placeholder={language === 'vi' ? 'VD: 350000' : 'e.g., 350000'}
              min="0"
              step="1000"
            />
            {offeredPrice && discountPercentage > 0 && (
              <p className="text-sm text-green-600 mt-1">
                {language === 'vi' ? 'Tiết kiệm' : 'Save'} {discountPercentage}% (
                {(currentPrice - parseFloat(offeredPrice)).toLocaleString('vi-VN')}₫)
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">
              {language === 'vi' ? 'Gợi ý giá' : 'Suggested Prices'}
            </Label>
            <div className="flex gap-2">
              {suggestedPrices.map((price, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setOfferedPrice(price.toString())}
                  className="flex-1"
                >
                  <span className="text-xs">-{10 + index * 5}%</span>
                  <br />
                  <span className="text-xs">{(price / 1000).toFixed(0)}k</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="message">
              {language === 'vi' ? 'Lời nhắn (tùy chọn)' : 'Message (optional)'}
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                language === 'vi'
                  ? 'VD: Tôi rất thích sản phẩm này, mong bạn xem xét giá của tôi...'
                  : 'e.g., I really love this item, hope you can consider my offer...'
              }
              rows={3}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <MessageCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                {language === 'vi'
                  ? 'Người bán sẽ nhận được thông báo và có thể chấp nhận, từ chối hoặc đề xuất giá khác.'
                  : 'Seller will be notified and can accept, reject, or counter your offer.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1"
            disabled={loading}
          >
            {language === 'vi' ? 'Hủy' : 'Cancel'}
          </Button>
          <Button
            onClick={handleSubmitOffer}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
            disabled={loading}
          >
            <Send className="size-4 mr-2" />
            {loading
              ? language === 'vi'
                ? 'Đang gửi...'
                : 'Sending...'
              : language === 'vi'
              ? 'Gửi đề xuất'
              : 'Send Offer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
