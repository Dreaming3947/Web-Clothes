# 🛍️ SecondStyle - Chợ Đồ Cũ Chất Lượng

Nền tảng mua bán quần áo, giày dép, phụ kiện secondhand chất lượng cao với tính năng thương lượng giá trực tiếp.

## ✨ Tính năng chính

### 👥 3 Vai trò người dùng

#### 🛒 Người mua (Buyer)
- Xem danh sách sản phẩm với bộ lọc đa dạng
- Tìm kiếm theo danh mục: Quần áo Nam, Nữ, Giày dép, Phụ kiện
- Xem chi tiết sản phẩm với thông số kỹ thuật đầy đủ
- **Thương lượng giá** trực tiếp với người bán
- Liên hệ người bán qua tin nhắn
- Lưu sản phẩm yêu thích

#### 🏪 Người bán (Seller)
- Đăng tin rao bán với đầy đủ thông tin (min 4 ảnh, giá, thông số kỹ thuật...)
- **Trao đổi thương lượng** với người mua (accept/reject/counter offer)
- Quản lý tin đăng

#### 👨‍💼 Admin
- **Xét duyệt tin rao bán** trước khi hiển thị
- Quản lý người dùng
- Dashboard thống kê

### 🔥 Workflow hoàn chỉnh
```
Người bán đăng tin → Admin phê duyệt → Tin xuất hiện công khai 
→ Người mua xem & thương lượng giá → Người bán phản hồi 
→ Thỏa thuận giá → Hoàn tất giao dịch
```

## 🏆 Tiêu chí đạt được

✅ **Performance** - Code splitting, lazy loading, service worker caching  
✅ **Accessibility** - ARIA labels, keyboard navigation, screen reader support  
✅ **Best Practices** - RESTful API, JWT auth, SQL injection protection  
✅ **SEO** - Meta tags, Open Graph, Schema.org, sitemap.xml, robots.txt  
✅ **PWA** - Service worker, manifest.json, offline support, installable  

## 🛠️ Tech Stack

**Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui  
**Backend:** PHP 7.4+ + MySQL 5.7+ + JWT  
**PWA:** Service Worker + Web App Manifest

## 📊 Danh mục sản phẩm

👔 **Quần áo Nam** - Áo thun, Áo sơ mi, Quần jean, Quần kaki, Áo khoác  
👗 **Quần áo Nữ** - Áo thun, Áo sơ mi, Quần jean, Váy, Đầm, Áo khoác  
👟 **Giày dép** - Giày thể thao, Giày công sở, Dép, Boots  
👜 **Phụ kiện** - Túi xách, Mũ nón, Khăn quàng, Đồng hồ, Thắt lưng  

---

## 📝 Hướng dẫn cài đặt & chạy local

### 1. Yêu cầu hệ thống
- Node.js >= 16
- npm >= 8
- PHP >= 7.4
- MySQL >= 5.7 

### 2. Clone source code
```bash
git clone https://github.com/Dreaming3947/Web-Clothes.git
cd Web-Clothes
```

### 3. Cài đặt dependencies frontend
```bash
npm install
```

### 4. Cài đặt database
- Đảm bảo MySQL đã chạy.
- Tạo database:
```sql
CREATE DATABASE secondhand_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
- Import schema và dữ liệu mẫu:
```bash
mysql -u root -p (mật khẩu) secondhand_marketplace < src/backend/database/secondhand_marketplace.sql

```

### 5. Cấu hình backend (nếu cần)
- Mặc định đã cấu hình cho local:
  - `src/backend/config/database.php`:
    - host: `localhost`
    - db_name: `secondhand_marketplace`
    - username: `root`
    - password:  (mật khẩu)
  - `src/backend/config/constants.php`:
    - BASE_URL: `http://127.0.0.1:8000/backend`
- Nếu bạn đổi thông tin database, hãy sửa lại cho đúng.

  -  Đổi thành key thật để test chức năng thanh toàn bằng momo
  -  MoMo Test Environment Credentials
  -  private $partnerCode = 'YOUR_PARTNER_CODE';
  -  private $accessKey = 'YOUR_ACCESS_KEY';
  -  private $secretKey = 'YOUR_SECRET_KEY';
  -  private $endpoint = 'https://test-payment.momo.vn/v2/gateway/api/create';

### 6. Chạy backend (API)
```bash
cd src
php -S 127.0.0.1:8000
```

### 7. Chạy frontend
Mở tab terminal mới:
```bash
npm run dev
```

### 8. Truy cập website
- Frontend: http://localhost:5173
- API backend: http://127.0.0.1:8000/backend/api

### 9. Tài khoản mẫu
- Admin: admin@secondstyle.vn / password123
- Seller: seller1@example.com / password123
- Buyer: buyer1@example.com / password123

---

Nếu gặp lỗi kết nối database, hãy kiểm tra lại các bước import và cấu hình ở trên.