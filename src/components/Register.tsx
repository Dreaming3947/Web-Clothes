import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';

export default function Register() {
  const { language, t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(language === 'vi' ? 'Mật khẩu không khớp' : 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      toast.success(language === 'vi' ? 'Đăng ký thành công!' : 'Registration successful!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || (language === 'vi' ? 'Đăng ký thất bại' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">{t('register')}</h1>
          <p className="text-gray-600">
            {language === 'vi' ? 'Tạo tài khoản mới' : 'Create a new account'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('register')}</CardTitle>
            <CardDescription>
              {language === 'vi' 
                ? 'Đăng ký để bắt đầu mua bán thời trang'
                : 'Sign up to start buying and selling fashion'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">
                  {language === 'vi' ? 'Họ và tên' : 'Full Name'}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={language === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
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
                  placeholder="your@email.com"
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
                  placeholder="0123456789"
                />
              </div>

              <div>
                <Label htmlFor="password">
                  {language === 'vi' ? 'Mật khẩu' : 'Password'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">
                  {language === 'vi' ? 'Xác nhận mật khẩu' : 'Confirm Password'}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" required />
                <label>
                  {language === 'vi' ? (
                    <>
                      Tôi đồng ý với{' '}
                      <Link to="/terms" className="text-purple-600 hover:underline">
                        Điều khoản sử dụng
                      </Link>{' '}
                      và{' '}
                      <Link to="/privacy" className="text-purple-600 hover:underline">
                        Chính sách bảo mật
                      </Link>
                    </>
                  ) : (
                    <>
                      I agree to the{' '}
                      <Link to="/terms" className="text-purple-600 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-purple-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </>
                  )}
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                disabled={loading}
              >
                {loading ? (language === 'vi' ? 'Đang đăng ký...' : 'Registering...') : t('register')}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">
                {language === 'vi' ? 'Đã có tài khoản?' : 'Already have an account?'}
              </span>{' '}
              <Link to="/login" className="text-purple-600 hover:underline">
                {t('login')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
