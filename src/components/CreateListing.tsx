import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

export default function CreateListing() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    brand: '',
    condition: '',
    size: '',
    color: '',
    material: '',
    price: '',
    originalPrice: '',
  });

  const categories = [
    { id: 'women', label: { vi: 'Thời trang Nữ', en: "Women's Fashion" } },
    { id: 'men', label: { vi: 'Thời trang Nam', en: "Men's Fashion" } },
    { id: 'accessories', label: { vi: 'Phụ kiện', en: 'Accessories' } },
    { id: 'shoes', label: { vi: 'Giày dép', en: 'Shoes' } },
  ];

  const conditions = [
    { id: 'new', label: { vi: 'Mới 100%', en: 'Brand New' } },
    { id: 'like-new', label: { vi: 'Như mới (95-99%)', en: 'Like New (95-99%)' } },
    { id: 'good', label: { vi: 'Tốt (80-94%)', en: 'Good (80-94%)' } },
    { id: 'fair', label: { vi: 'Khá (60-79%)', en: 'Fair (60-79%)' } },
    { id: 'used', label: { vi: 'Đã qua sử dụng', en: 'Used' } },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Mock image upload - in production, upload to server/cloud storage
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error(language === 'vi' ? 'Vui lòng thêm ít nhất 1 ảnh' : 'Please add at least 1 image');
      return;
    }

    setLoading(true);

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success(language === 'vi' ? 'Đăng tin thành công!' : 'Listing created successfully!');
      navigate('/seller-dashboard');
    } catch (error: any) {
      toast.error(error.message || (language === 'vi' ? 'Đăng tin thất bại' : 'Failed to create listing'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mb-2">
          {language === 'vi' ? 'Đăng tin bán hàng' : 'Create New Listing'}
        </h1>
        <p className="text-gray-600 mb-8">
          {language === 'vi' 
            ? 'Điền đầy đủ thông tin để tăng cơ hội bán hàng'
            : 'Fill in complete information to increase sales opportunities'}
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
                  <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-600 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                    <Upload className="size-8 text-gray-400" />
                    <span className="text-xs text-gray-500 text-center px-2">
                      {language === 'vi' ? 'Thêm ảnh' : 'Add Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
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
                  <Label htmlFor="category">
                    {language === 'vi' ? 'Danh mục' : 'Category'} *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'vi' ? 'Chọn danh mục' : 'Select category'} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label[language]}
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
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="condition">
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

                <div>
                  <Label htmlFor="size">Size *</Label>
                  <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'vi' ? 'Chọn size' : 'Select size'} />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              {language === 'vi' ? 'Hủy' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
              disabled={loading}
            >
              {loading ? (language === 'vi' ? 'Đang đăng...' : 'Posting...') : (language === 'vi' ? 'Đăng tin' : 'Post Listing')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
