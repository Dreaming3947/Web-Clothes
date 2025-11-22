import { Heart, Eye, MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import type { Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

type ProductCardProps = {
  product: Product;
  onView: () => void;
  onAddToCart?: () => void;
};

const conditionLabels = {
  'new': 'Mới',
  'like-new': 'Như mới',
  'good': 'Tốt',
  'fair': 'Khá',
};

const conditionColors = {
  'new': 'bg-green-100 text-green-700',
  'like-new': 'bg-blue-100 text-blue-700',
  'good': 'bg-yellow-100 text-yellow-700',
  'fair': 'bg-orange-100 text-orange-700',
};

export function ProductCard({ product, onView, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
      <div className="relative" onClick={onView}>
        <ImageWithFallback
          src={product.images[0]}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.status === 'sold' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge className="bg-red-600 text-white">Đã bán</Badge>
          </div>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart className="w-4 h-4" />
        </Button>
        <Badge className={`absolute top-2 left-2 ${conditionColors[product.condition]}`}>
          {conditionLabels[product.condition]}
        </Badge>
      </div>

      <div className="p-4" onClick={onView}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="line-clamp-2 flex-1">{product.title}</h3>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{product.location}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl text-blue-600">
            {product.price.toLocaleString('vi-VN')}₫
          </div>
          {product.brand && (
            <Badge variant="outline" className="text-xs">
              {product.brand}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {product.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {product.favorites}
            </span>
          </div>
          <span className="text-xs">
            {new Date(product.createdAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>
    </Card>
  );
}
