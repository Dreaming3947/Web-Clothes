import { useState } from 'react';
import { Upload, X, Save, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { toast } from 'sonner@2.0.3';
import type { User } from '../App';

type PostProductProps = {
  user: User | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export function PostProduct({ user, onSuccess, onCancel }: PostProductProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    size: '',
    brand: '',
    location: '',
    tags: '',
  });
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 6));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (images.length === 0) {
      toast.error('Vui lòng tải lên ít nhất 1 hình ảnh');
      return;
    }

    toast.success('Đăng tin thành công! Tin của bạn đang chờ duyệt.');
    onSuccess();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Đăng tin bán sản phẩm</h1>
            <p className="text-gray-600">
              Điền đầy đủ thông tin để sản phẩm của bạn tiếp cận được nhiều người mua hơn
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        step > s ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl">Thông tin cơ bản</h2>

              <div>
                <Label htmlFor="title">
                  Tiêu đề sản phẩm <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="VD: Áo thun Uniqlo trắng cổ tròn - Size M"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.title.length}/100 ký tự
                </p>
              </div>

              <div>
                <Label htmlFor="description">
                  Mô tả chi tiết <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết về sản phẩm: chất liệu, tình trạng, lý do bán..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length}/1000 ký tự
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category">
                    Danh mục <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Áo thun">Áo thun</SelectItem>
                      <SelectItem value="Áo sơ mi">Áo sơ mi</SelectItem>
                      <SelectItem value="Quần jean">Quần jean</SelectItem>
                      <SelectItem value="Váy">Váy</SelectItem>
                      <SelectItem value="Áo khoác">Áo khoác</SelectItem>
                      <SelectItem value="Đầm">Đầm</SelectItem>
                      <SelectItem value="Quần short">Quần short</SelectItem>
                      <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition">
                    Tình trạng <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Chọn tình trạng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Mới (chưa qua sử dụng)</SelectItem>
                      <SelectItem value="like-new">Như mới</SelectItem>
                      <SelectItem value="good">Tốt</SelectItem>
                      <SelectItem value="fair">Khá</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onCancel}>
                  Hủy
                </Button>
                <Button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700">
                  Tiếp theo
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl">Thông tin chi tiết</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="price">
                    Giá bán (VNĐ) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="VD: 150000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="size">Kích cỡ</Label>
                  <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Chọn size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="XL">XL</SelectItem>
                      <SelectItem value="XXL">XXL</SelectItem>
                      <SelectItem value="Freesize">Freesize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="brand">Thương hiệu</Label>
                  <Input
                    id="brand"
                    placeholder="VD: Uniqlo, Zara, H&M..."
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="location">
                    Địa điểm <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="VD: Quận 1, TP.HCM"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                <Input
                  id="tags"
                  placeholder="VD: vintage, korean-style, summer"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Quay lại
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onCancel}>
                    Hủy
                  </Button>
                  <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700">
                    Tiếp theo
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl mb-2">Hình ảnh sản phẩm</h2>
                <p className="text-gray-600 text-sm">
                  Tải lên tối đa 6 hình ảnh. Hình ảnh đầu tiên sẽ là ảnh đại diện.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    {index === 0 && (
                      <Badge className="absolute bottom-2 left-2 bg-blue-600">
                        Ảnh chính
                      </Badge>
                    )}
                  </div>
                ))}

                {images.length < 6 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Tải ảnh lên</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Quay lại
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onCancel}>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu nháp
                  </Button>
                  <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                    <Eye className="w-4 h-4 mr-2" />
                    Đăng tin
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
