import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

const API_URL = 'http://127.0.0.1:8000/backend/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent_id?: number;
  children?: Category[];
}

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    conditionDetail: '',
    category: '',
    brand: '',
    condition: '',
    size: '',
    color: '',
    material: '',
    price: '',
    originalPrice: '',
    allowNegotiation: true,
    minAcceptablePrice: '',
    specifications: {} as Record<string, string>,
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories.php`);
        const result = await response.json();
        
        if (response.ok && result.success) {
          setCategories(result.data || []);
        } else {
          toast.error(language === 'vi' ? 'Không thể tải danh mục' : 'Failed to load categories');
          setCategories([]);
        }
      } catch (error) {
        toast.error(language === 'vi' ? 'Lỗi khi tải danh mục' : 'Error loading categories');
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [language]);

  const conditions = [
    { id: 'new', label: { vi: 'Mới 100%', en: 'Brand New' } },
    { id: 'like-new', label: { vi: 'Như mới (95-99%)', en: 'Like New (95-99%)' } },
    { id: 'good', label: { vi: 'Tốt (80-94%)', en: 'Good (80-94%)' } },
    { id: 'fair', label: { vi: 'Khá (60-79%)', en: 'Fair (60-79%)' } },
    { id: 'used', label: { vi: 'Đã qua sử dụng', en: 'Used' } },
  ];

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products.php?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const result = await response.json();
      const product = result.data || result.message;

      if (!product) {
        throw new Error('Product not found');
      }

      setFormData({
        title: product.title || '',
        description: product.description || '',
        conditionDetail: product.condition_detail || '',
        category: product.category_id?.toString() || '',
        brand: product.brand || '',
        condition: product.condition || '',
        size: product.size || '',
        color: product.color || '',
        material: product.material || '',
        price: product.price?.toString() || '',
        originalPrice: product.original_price?.toString() || '',
        allowNegotiation: product.allow_negotiation !== 0,
        minAcceptablePrice: product.min_acceptable_price?.toString() || '',
        specifications: product.specifications || {},
      });

      setImages(product.images || []);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      toast.error(error.message || (language === 'vi' ? 'Lỗi tải sản phẩm' : 'Error loading product'));
      navigate('/seller-dashboard');
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    if (images.length + files.length > 5) {
      toast.error(language === 'vi' ? 'Tối đa 5 ảnh' : 'Maximum 5 images');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images[]', file);
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/upload.php?type=product`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      setImages([...images, ...result.data.urls].slice(0, 5));
      toast.success(language === 'vi' ? `Đã tải lên ${result.data.count} ảnh` : `Uploaded ${result.data.count} images`);
    } catch (error: any) {
      toast.error(error.message || (language === 'vi' ? 'Upload thất bại' : 'Upload failed'));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    if (!specKey.trim() || !specValue.trim()) {
      toast.error(language === 'vi' ? 'Vui lòng nhập đầy đủ tên và giá trị thông số' : 'Please enter both specification name and value');
      return;
    }

    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [specKey.trim()]: specValue.trim()
      }
    });
    setSpecKey('');
    setSpecValue('');
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  // Check if category requires size (only for clothing, not accessories or shoes)
  const shouldShowSize = () => {
    if (!formData.category) return false;
    const selectedCategory = categories.find(cat => cat.id.toString() === formData.category);
    if (!selectedCategory) return false;
    
    // Show size for clothing categories (Quần áo Nam, Quần áo Nữ) and their children
    // Hide for accessories (Phụ kiện) and shoes (Giày dép)
    const clothingSlugs = ['quan-ao-nam', 'quan-ao-nu'];
    const excludeSlugs = ['phu-kien', 'giay-dep'];
    
    // Check if it's a clothing parent category
    if (clothingSlugs.includes(selectedCategory.slug)) return true;
    
    // Check if it's excluded category
    if (excludeSlugs.includes(selectedCategory.slug)) return false;
    
    // For child categories, check their parent
    if (selectedCategory.parent_id) {
      const parentCategory = categories.find(cat => cat.id === selectedCategory.parent_id);
      if (parentCategory && clothingSlugs.includes(parentCategory.slug)) return true;
    }
    
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error(language === 'vi' ? 'Vui lòng thêm ít nhất 1 ảnh' : 'Please add at least 1 image');
      return;
    }

    if (!formData.category) {
      toast.error(language === 'vi' ? 'Vui lòng chọn danh mục' : 'Please select a category');
      return;
    }

    if (shouldShowSize() && !formData.size) {
      toast.error(language === 'vi' ? 'Vui lòng chọn kích cỡ' : 'Please select a size');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/products.php?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          condition: formData.condition,
          condition_detail: formData.conditionDetail,
          category_id: parseInt(formData.category),
          brand: formData.brand,
          size: formData.size,
          color: formData.color,
          material: formData.material,
          price: parseFloat(formData.price),
          original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
          allow_negotiation: formData.allowNegotiation,
          min_acceptable_price: formData.minAcceptablePrice ? parseFloat(formData.minAcceptablePrice) : null,
          specifications: formData.specifications,
          images: images,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update product');
      }

      toast.success(language === 'vi' ? 'Cập nhật sản phẩm thành công!' : 'Product updated successfully!');
      navigate('/seller-dashboard');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || (language === 'vi' ? 'Cập nhật thất bại' : 'Failed to update product'));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">{language === 'vi' ? 'Đang tải...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mb-2">
          {language === 'vi' ? 'Chỉnh sửa sản phẩm' : 'Edit Product'}
        </h1>
        <p className="text-gray-600 mb-8">
          {language === 'vi' 
            ? 'Cập nhật thông tin sản phẩm của bạn'
            : 'Update your product information'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'vi' ? 'Hình ảnh sản phẩm' : 'Product Images'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                    <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className={`aspect-square rounded-lg border-2 border-dashed ${uploading ? 'border-purple-600 bg-purple-50' : 'border-gray-300 hover:border-purple-600'} cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors`}>
                    <Upload className={`size-8 ${uploading ? 'text-purple-600 animate-pulse' : 'text-gray-400'}`} />
                    <span className="text-xs text-gray-500 text-center px-2">
                      {uploading 
                        ? (language === 'vi' ? 'Đang tải...' : 'Uploading...') 
                        : (language === 'vi' ? 'Thêm ảnh' : 'Add Image')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                {language === 'vi' 
                  ? 'Tối đa 5 ảnh. Ảnh đầu tiên sẽ là ảnh đại diện.'
                  : 'Maximum 5 images. First image will be the main image.'}
              </p>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'vi' ? 'Thông tin cơ bản' : 'Basic Information'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">
                  {language === 'vi' ? 'Tên sản phẩm' : 'Product Title'} *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={language === 'vi' ? 'VD: Áo khoác denim vintage' : 'e.g., Vintage denim jacket'}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">
                  {language === 'vi' ? 'Mô tả chi tiết' : 'Detailed Description'} *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={language === 'vi' 
                    ? 'Mô tả chi tiết về sản phẩm, tình trạng, chất liệu...'
                    : 'Detailed description of product, condition, material...'}
                  rows={5}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    {language === 'vi' ? 'Danh mục' : 'Category'} *
                  </Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    disabled={loadingCategories}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'vi' ? 'Chọn danh mục' : 'Select category'} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.icon && `${cat.icon} `}{cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="brand">
                    {language === 'vi' ? 'Thương hiệu' : 'Brand'}
                  </Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder={language === 'vi' ? 'VD: Zara, H&M' : 'e.g., Zara, H&M'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'vi' ? 'Chi tiết sản phẩm' : 'Product Details'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    {language === 'vi' ? 'Tình trạng' : 'Condition'} *
                  </Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'vi' ? 'Chọn tình trạng' : 'Select condition'} />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((cond) => (
                        <SelectItem key={cond.id} value={cond.id}>
                          {cond.label[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {shouldShowSize() && (
                  <div>
                    <Label>
                      {language === 'vi' ? 'Kích cỡ' : 'Size'} *
                    </Label>
                    <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'vi' ? 'Chọn kích cỡ' : 'Select size'} />
                      </SelectTrigger>
                      <SelectContent>
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Freesize'].map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="color">
                    {language === 'vi' ? 'Màu sắc' : 'Color'}
                  </Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder={language === 'vi' ? 'VD: Đen, Trắng' : 'e.g., Black, White'}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="conditionDetail">
                  {language === 'vi' ? 'Mô tả tình trạng sản phẩm' : 'Condition Details'}
                </Label>
                <Textarea
                  id="conditionDetail"
                  value={formData.conditionDetail}
                  onChange={(e) => setFormData({ ...formData, conditionDetail: e.target.value })}
                  placeholder={language === 'vi' 
                    ? 'Mô tả chi tiết về tình trạng: vết bẩn, vết xước, độ mới, lỗi nhỏ (nếu có)...'
                    : 'Detailed condition description: stains, scratches, newness, minor defects (if any)...'}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="material">
                  {language === 'vi' ? 'Chất liệu' : 'Material'}
                </Label>
                <Input
                  id="material"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder={language === 'vi' ? 'VD: Cotton, Polyester' : 'e.g., Cotton, Polyester'}
                />
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'vi' ? 'Thông số kỹ thuật' : 'Specifications'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="specKey">
                    {language === 'vi' ? 'Tên thông số' : 'Specification Name'}
                  </Label>
                  <Input
                    id="specKey"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    placeholder={language === 'vi' ? 'VD: Kích thước, Xuất xứ' : 'e.g., Size, Origin'}
                  />
                </div>
                <div>
                  <Label htmlFor="specValue">
                    {language === 'vi' ? 'Giá trị' : 'Value'}
                  </Label>
                  <Input
                    id="specValue"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    placeholder={language === 'vi' ? 'VD: L, Việt Nam' : 'e.g., L, Vietnam'}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={addSpecification}
                    className="w-full"
                    variant="outline"
                  >
                    {language === 'vi' ? '+ Thêm' : '+ Add'}
                  </Button>
                </div>
              </div>

              {Object.keys(formData.specifications).length > 0 && (
                <div className="space-y-2">
                  <Label>{language === 'vi' ? 'Các thông số đã thêm:' : 'Added specifications:'}</Label>
                  <div className="space-y-2">
                    {Object.entries(formData.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium">{key}:</span>{' '}
                          <span className="text-gray-700">{value}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSpecification(key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500">
                {language === 'vi'
                  ? 'VD: Kích thước - L, Xuất xứ - Việt Nam, Chất liệu - Cotton 100%'
                  : 'e.g., Size - L, Origin - Vietnam, Material - 100% Cotton'}
              </p>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'vi' ? 'Giá bán' : 'Pricing'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">
                    {language === 'vi' ? 'Giá bán (₫)' : 'Selling Price (₫)'} *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="450000"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="originalPrice">
                    {language === 'vi' ? 'Giá gốc (₫)' : 'Original Price (₫)'}
                  </Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="1200000"
                    min="0"
                  />
                </div>
              </div>

              {formData.price && formData.originalPrice && Number(formData.price) < Number(formData.originalPrice) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    {language === 'vi' ? '💰 Tiết kiệm' : '💰 Save'}{' '}
                    <span className="font-semibold">
                      {Math.round((1 - Number(formData.price) / Number(formData.originalPrice)) * 100)}%
                    </span>{' '}
                    ({(Number(formData.originalPrice) - Number(formData.price)).toLocaleString('vi-VN')}₫)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/seller-dashboard')}
              className="flex-1"
            >
              {language === 'vi' ? 'Hủy' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
              disabled={loading}
            >
              {loading ? (language === 'vi' ? 'Đang cập nhật...' : 'Updating...') : (language === 'vi' ? 'Cập nhật' : 'Update')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
