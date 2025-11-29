import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Filter, SlidersHorizontal, Heart, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
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

const API_URL = 'http://127.0.0.1:8000/backend/api';

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories.php?hierarchical=true`);
        const result = await response.json();
        if (result.success && result.data) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${API_URL}/products.php?action=brands`);
        const result = await response.json();
        if (result.success && result.data) {
          setBrands(result.data);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [sortBy, priceRange, selectedCategories, selectedBrands, selectedSizes, selectedConditions]);

  const handleFavoriteToggle = async (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error(language === 'vi' ? 'Vui lòng đăng nhập để thêm vào yêu thích' : 'Please login to add to favorites');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products.php?id=${productId}&action=favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const newFavorites = new Set(favorites);
        if (data.data.favorited) {
          newFavorites.add(productId);
        } else {
          newFavorites.delete(productId);
        }
        setFavorites(newFavorites);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(language === 'vi' ? 'Lỗi khi thêm vào yêu thích' : 'Error adding to favorites');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      
      // Price range
      if (priceRange[0] > 0) {
        params.append('min_price', priceRange[0].toString());
      }
      if (priceRange[1] < 10000000) {
        params.append('max_price', priceRange[1].toString());
      }
      
      // Categories - need to map to category_id
      // Note: This requires knowing the category IDs from database
      // For now, we'll use category names if API supports it
      if (selectedCategories.length > 0) {
        selectedCategories.forEach(cat => {
          params.append('category[]', cat);
        });
      }
      
      // Brands
      if (selectedBrands.length > 0) {
        selectedBrands.forEach(brand => {
          params.append('brand[]', brand);
        });
      }
      
      // Sizes
      if (selectedSizes.length > 0) {
        selectedSizes.forEach(size => {
          params.append('size[]', size);
        });
      }
      
      // Conditions
      if (selectedConditions.length > 0) {
        selectedConditions.forEach(condition => {
          params.append('condition[]', condition);
        });
      }
      
      // Sort
      if (sortBy) {
        params.append('sort', sortBy);
      }
      
      const queryString = params.toString();
      const url = queryString ? `${API_URL}/products.php?${queryString}` : `${API_URL}/products.php`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Filter out sold products (safety check)
        const availableProducts = data.data.filter((p: any) => p.status !== 'sold' && p.status !== 'deleted');
        setProducts(availableProducts);
        
        // Initialize favorites from product data
        const initialFavorites = new Set<number>();
        availableProducts.forEach((p: any) => {
          // Handle both boolean and numeric values (0/1 from SQL)
          if (p.is_favorited === true || p.is_favorited === 1 || p.is_favorited === '1') {
            initialFavorites.add(p.id);
          }
        });
        setFavorites(initialFavorites);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Static filter options
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const conditions = [
    { id: 'new', label: { vi: 'Mới 100%', en: 'Brand New' } },
    { id: 'like-new', label: { vi: 'Như mới (95-99%)', en: 'Like New (95-99%)' } },
    { id: 'good', label: { vi: 'Tốt (80-94%)', en: 'Good (80-94%)' } },
    { id: 'fair', label: { vi: 'Khá (60-79%)', en: 'Fair (60-79%)' } },
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
        <CollapsibleContent className="mt-4 space-y-2">
          {categories.map((parentCategory) => (
            <div key={parentCategory.id} className="space-y-2">
              {/* Parent Category */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${parentCategory.slug}`}
                  checked={selectedCategories.includes(parentCategory.slug)}
                  onCheckedChange={(checked) => {
                    setSelectedCategories(
                      checked
                        ? [...selectedCategories, parentCategory.slug]
                        : selectedCategories.filter((c) => c !== parentCategory.slug)
                    );
                  }}
                />
                <Label htmlFor={`category-${parentCategory.slug}`} className="cursor-pointer font-medium">
                  {parentCategory.icon ? `${parentCategory.icon} ` : ''}{parentCategory.name}
                </Label>
              </div>
              
              {/* Child Categories */}
              {parentCategory.children && parentCategory.children.length > 0 && (
                <div className="ml-6 space-y-2">
                  {parentCategory.children.map((childCategory: any) => (
                    <div key={childCategory.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${childCategory.slug}`}
                        checked={selectedCategories.includes(childCategory.slug)}
                        onCheckedChange={(checked) => {
                          setSelectedCategories(
                            checked
                              ? [...selectedCategories, childCategory.slug]
                              : selectedCategories.filter((c) => c !== childCategory.slug)
                          );
                        }}
                      />
                      <Label htmlFor={`category-${childCategory.slug}`} className="cursor-pointer text-sm text-gray-600">
                        {childCategory.icon ? `${childCategory.icon} ` : ''}{childCategory.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
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
            {products.map((product) => {
              // Get first image or use placeholder
              const imageUrl = product.images && product.images.length > 0 
                ? product.images[0] 
                : 'https://via.placeholder.com/400x400?text=No+Image';
              
              // Map condition to display text
              const conditionText: { [key: string]: { vi: string; en: string } } = {
                'new': { vi: 'Mới', en: 'New' },
                'like-new': { vi: 'Như mới', en: 'Like New' },
                'good': { vi: 'Tốt', en: 'Good' },
                'fair': { vi: 'Khá', en: 'Fair' }
              };
              
              // Calculate discount percentage if original_price exists
              const discountPercent = product.original_price 
                ? Math.round((1 - product.price / product.original_price) * 100)
                : 0;

              return (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                        onClick={(e) => handleFavoriteToggle(product.id, e)}
                      >
                        <Heart className={`size-4 ${favorites.has(product.id) || product.is_favorited ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      {discountPercent > 0 && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                            -{discountPercent}%
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 line-clamp-2">{product.title}</h3>
                      <div className="space-y-1 mb-3">
                        <p className="text-purple-600 font-semibold">{parseInt(product.price).toLocaleString('vi-VN')}₫</p>
                        {product.original_price && (
                          <p className="text-sm text-gray-500 line-through">{parseInt(product.original_price).toLocaleString('vi-VN')}₫</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          {conditionText[product.condition]?.[language] || product.condition}
                        </span>
                        {product.size && <span>Size {product.size}</span>}
                      </div>
                      {product.seller_name && (
                        <div className="mt-2 pt-2 border-t flex items-center gap-2 text-xs text-gray-500">
                          <span>{product.seller_name}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
