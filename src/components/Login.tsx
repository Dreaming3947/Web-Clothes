import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';

export default function Login() {
  const { language, t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success(language === 'vi' ? 'Đăng nhập thành công!' : 'Login successful!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || (language === 'vi' ? 'Đăng nhập thất bại' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">{t('login')}</h1>
          <p className="text-gray-600">
            {language === 'vi' ? 'Chào mừng trở lại!' : 'Welcome back!'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('login')}</CardTitle>
            <CardDescription>
              {language === 'vi' 
                ? 'Đăng nhập để tiếp tục mua sắm'
                : 'Login to continue shopping'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span>{language === 'vi' ? 'Ghi nhớ đăng nhập' : 'Remember me'}</span>
                </label>
                <Link to="/forgot-password" className="text-purple-600 hover:underline">
                  {language === 'vi' ? 'Quên mật khẩu?' : 'Forgot password?'}
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                disabled={loading}
              >
                {loading ? (language === 'vi' ? 'Đang đăng nhập...' : 'Logging in...') : t('login')}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {language === 'vi' ? 'Hoặc' : 'Or'}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">
                  {language === 'vi' ? 'Chưa có tài khoản?' : "Don't have an account?"}
                </span>{' '}
                <Link to="/register" className="text-purple-600 hover:underline">
                  {t('register')}
                </Link>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm mb-2">
                {language === 'vi' ? '🎯 Tài khoản demo:' : '🎯 Demo accounts:'}
              </p>
              <div className="text-xs space-y-1 text-gray-700">
                <p>Admin: admin@example.com / admin123</p>
                <p>Seller: seller@example.com / seller123</p>
                <p>Buyer: buyer@example.com / buyer123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
