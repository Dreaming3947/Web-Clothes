import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

export default function Profile() {
  const { language, t } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(language === 'vi' ? 'Kích thước ảnh tối đa 5MB' : 'Image size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(language === 'vi' ? 'Vui lòng chọn file ảnh' : 'Please select an image file');
        return;
      }

      try {
        // Upload to server
        const uploadFormData = new FormData();
        uploadFormData.append('avatar', file);

        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/backend/api/upload.php?type=avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: uploadFormData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Upload failed');
        }

        // Update avatar URL
        setFormData({ ...formData, avatar: result.data.url });
        toast.success(language === 'vi' ? 'Ảnh đã được tải lên. Nhấn Lưu để cập nhật.' : 'Image uploaded. Click Save to update.');
      } catch (error: any) {
        toast.error(error.message || (language === 'vi' ? 'Upload thất bại' : 'Upload failed'));
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast.success(language === 'vi' ? 'Cập nhật thành công!' : 'Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || (language === 'vi' ? 'Cập nhật thất bại' : 'Update failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(language === 'vi' ? 'Mật khẩu không khớp' : 'Passwords do not match');
      return;
    }

    // Mock password change
    toast.success(language === 'vi' ? 'Đổi mật khẩu thành công!' : 'Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">{t('profile')}</h1>

      <Tabs defaultValue="profile" className="max-w-4xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">
            {language === 'vi' ? 'Thông tin' : 'Profile'}
          </TabsTrigger>
          <TabsTrigger value="password">
            {language === 'vi' ? 'Mật khẩu' : 'Password'}
          </TabsTrigger>
          <TabsTrigger value="settings">
            {language === 'vi' ? 'Cài đặt' : 'Settings'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'vi' ? 'Thông tin cá nhân' : 'Personal Information'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="size-24 cursor-pointer" onClick={handleAvatarClick}>
                    <AvatarImage src={formData.avatar} />
                    <AvatarFallback className="text-2xl">{formData.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleAvatarClick}>
                      <Camera className="size-4 mr-2" />
                      {language === 'vi' ? 'Đổi ảnh' : 'Change Photo'}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      {language === 'vi' ? 'JPG, PNG tối đa 5MB' : 'JPG, PNG max 5MB'}
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      {language === 'vi' ? 'Họ và tên' : 'Full Name'}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">
                      {language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>
                      {language === 'vi' ? 'Vai trò' : 'Role'}
                    </Label>
                    <Input value={user?.role} disabled />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                  disabled={loading}
                >
                  {loading ? (language === 'vi' ? 'Đang lưu...' : 'Saving...') : (language === 'vi' ? 'Lưu thay đổi' : 'Save Changes')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'vi' ? 'Đổi mật khẩu' : 'Change Password'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <Label htmlFor="currentPassword">
                    {language === 'vi' ? 'Mật khẩu hiện tại' : 'Current Password'}
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">
                    {language === 'vi' ? 'Mật khẩu mới' : 'New Password'}
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmNewPassword">
                    {language === 'vi' ? 'Xác nhận mật khẩu mới' : 'Confirm New Password'}
                  </Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  {language === 'vi' ? 'Đổi mật khẩu' : 'Change Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'vi' ? 'Cài đặt tài khoản' : 'Account Settings'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1">{language === 'vi' ? 'Thông báo email' : 'Email Notifications'}</h3>
                    <p className="text-sm text-gray-600">
                      {language === 'vi' ? 'Nhận thông báo về đơn hàng qua email' : 'Receive order notifications via email'}
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1">{language === 'vi' ? 'Tin nhắn marketing' : 'Marketing Messages'}</h3>
                    <p className="text-sm text-gray-600">
                      {language === 'vi' ? 'Nhận tin khuyến mãi và ưu đãi' : 'Receive promotions and offers'}
                    </p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1">{language === 'vi' ? 'Hiển thị công khai' : 'Public Profile'}</h3>
                    <p className="text-sm text-gray-600">
                      {language === 'vi' ? 'Cho phép người khác xem hồ sơ của bạn' : 'Allow others to view your profile'}
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-red-600 mb-2">{language === 'vi' ? 'Xóa tài khoản' : 'Delete Account'}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {language === 'vi' 
                    ? 'Xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn'
                    : 'Permanently delete your account and all your data'}
                </p>
                <Button variant="destructive">
                  {language === 'vi' ? 'Xóa tài khoản' : 'Delete Account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
