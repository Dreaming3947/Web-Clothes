import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Heart, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

// Mock products data
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Áo khoác denim vintage',
    price: 450000,
    originalPrice: 1200000,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    condition: 'Like New',
    size: 'M',
    brand: 'Levi\'s',
    category: 'women',
    color: 'Blue',
    seller: { name: 'Nguyen Van A', rating: 4.8 },
  },
  {
    id: '2',
    name: 'Túi xách Louis Vuitton',
    price: 8500000,
    originalPrice: 15000000,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
    condition: 'Used',
    size: 'One Size',
    brand: 'Louis Vuitton',
    category: 'accessories',
    color: 'Brown',
    seller: { name: 'Tran Thi B', rating: 4.9 },
  },
  {
    id: '3',
    name: 'Giày thể thao Nike Air',
    price: 1200000,
    originalPrice: 2800000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    condition: 'Good',
    size: '42',
    brand: 'Nike',
    category: 'shoes',
    color: 'Red',
    seller: { name: 'Le Van C', rating: 4.7 },
  },
  {
    id: '4',
    name: 'Áo sơ mi silk cao cấp',
    price: 350000,
    originalPrice: 900000,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    condition: 'Like New',
    size: 'L',
    brand: 'Zara',
    category: 'men',
    color: 'White',
    seller: { name: 'Pham Thi D', rating: 4.6 },
  },
  {
    id: '5',
    name: 'Váy maxi boho',
    price: 550000,
    originalPrice: 1500000,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    condition: 'Like New',
    size: 'S',
    brand: 'H&M',
    category: 'women',
    color: 'Floral',
    seller: { name: 'Nguyen Thi E', rating: 4.9 },
  },
  {
    id: '6',
    name: 'Áo blazer công sở',
    price: 680000,
    originalPrice: 1800000,
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400',
    condition: 'Good',
    size: 'M',
    brand: 'Mango',
    category: 'women',
    color: 'Black',
    seller: { name: 'Tran Van F', rating: 4.8 },
  },
  {
    id: '7',
    name: 'Quần jeans skinny',
    price: 380000,
    originalPrice: 1000000,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    condition: 'Like New',
    size: '30',
    brand: 'Uniqlo',
    category: 'men',
    color: 'Dark Blue',
    seller: { name: 'Le Thi G', rating: 4.7 },
  },
  {
    id: '8',
    name: 'Áo hoodie streetwear',
    price: 520000,
    originalPrice: 1200000,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    condition: 'Good',
    size: 'XL',
    brand: 'Supreme',
    category: 'men',
    color: 'Gray',
    seller: { name: 'Pham Van H', rating: 4.9 },
  },
];

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const categories = [
    { id: 'women', label: { vi: 'Nữ', en: 'Women' } },
    { id: 'men', label: { vi: 'Nam', en: 'Men' } },
    { id: 'accessories', label: { vi: 'Phụ kiện', en: 'Accessories' } },
    { id: 'shoes', label: { vi: 'Giày dép', en: 'Shoes' } },
  ];

  const brands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Levi\'s', 'Mango'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const conditions = [
    { id: 'new', label: { vi: 'Mới', en: 'New' } },
    { id: 'like-new', label: { vi: 'Như mới', en: 'Like New' } },
    { id: 'good', label: { vi: 'Tốt', en: 'Good' } },
    { id: 'used', label: { vi: 'Đã qua sử dụng', en: 'Used' } },
  ];

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="mb-4">{t('price')}</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={10000000}
          step={100000}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{priceRange[0].toLocaleString('vi-VN')}₫</span>
          <span>{priceRange[1].toLocaleString('vi-VN')}₫</span>
        </div>
      </div>

      {/* Categories */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3>{t('category')}</h3>
          <ChevronDown className="size-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => {
                  setSelectedCategories(
                    checked
                      ? [...selectedCategories, category.id]
                      : selectedCategories.filter((c) => c !== category.id)
                  );
                }}
              />
              <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                {category.label[language]}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Brands */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3>{t('brand')}</h3>
          <ChevronDown className="size-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => {
                  setSelectedBrands(
                    checked
                      ? [...selectedBrands, brand]
                      : selectedBrands.filter((b) => b !== brand)
                  );
                }}
              />
              <Label htmlFor={`brand-${brand}`} className="cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Sizes */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3>{t('size')}</h3>
          <ChevronDown className="size-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSizes.includes(size) ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedSizes(
                    selectedSizes.includes(size)
                      ? selectedSizes.filter((s) => s !== size)
                      : [...selectedSizes, size]
                  );
                }}
              >
                {size}
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Condition */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3>{t('condition')}</h3>
          <ChevronDown className="size-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-3">
          {conditions.map((condition) => (
            <div key={condition.id} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition.id}`}
                checked={selectedConditions.includes(condition.id)}
                onCheckedChange={(checked) => {
                  setSelectedConditions(
                    checked
                      ? [...selectedConditions, condition.id]
                      : selectedConditions.filter((c) => c !== condition.id)
                  );
                }}
              />
              <Label htmlFor={`condition-${condition.id}`} className="cursor-pointer">
                {condition.label[language]}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-2">{t('products')}</h1>
          <p className="text-gray-600">{products.length} {language === 'vi' ? 'sản phẩm' : 'products'}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                {language === 'vi' ? 'Mới nhất' : 'Newest'}
              </SelectItem>
              <SelectItem value="price-asc">
                {language === 'vi' ? 'Giá: Thấp đến cao' : 'Price: Low to High'}
              </SelectItem>
              <SelectItem value="price-desc">
                {language === 'vi' ? 'Giá: Cao đến thấp' : 'Price: High to Low'}
              </SelectItem>
              <SelectItem value="popular">
                {language === 'vi' ? 'Phổ biến' : 'Popular'}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="size-4 mr-2" />
                {t('filter')}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{t('filter')}</SheetTitle>
                <SheetDescription>
                  {language === 'vi' ? 'Lọc sản phẩm theo tiêu chí' : 'Filter products by criteria'}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FilterSection />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg">{t('filter')}</h2>
              <Button variant="ghost" size="sm" onClick={() => {
                setSelectedCategories([]);
                setSelectedBrands([]);
                setSelectedSizes([]);
                setSelectedConditions([]);
                setPriceRange([0, 10000000]);
              }}>
                {language === 'vi' ? 'Xóa' : 'Clear'}
              </Button>
            </div>
            <FilterSection />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.preventDefault();
                        // Add to favorites logic
                      }}
                    >
                      <Heart className="size-4" />
                    </Button>
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 line-clamp-2">{product.name}</h3>
                    <div className="space-y-1 mb-3">
                      <p className="text-purple-600">{product.price.toLocaleString('vi-VN')}₫</p>
                      <p className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString('vi-VN')}₫</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                        {product.condition}
                      </span>
                      <span>Size {product.size}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t flex items-center gap-2 text-xs text-gray-500">
                      <span>{product.seller.name}</span>
                      <span>⭐ {product.seller.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
