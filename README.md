
# 🛍️ SecondStyle - Chợ Đồ Cũ Chất Lượng

Nền tảng mua bán quần áo, giày dép, phụ kiện secondhand chất lượng cao với tính năng thương lượng giá trực tiếp.

The original Figma design is available at https://www.figma.com/design/mn63atlUCSB713ra9j0tmy/Second-Hand-Clothing-Marketplace.

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

## 🚀 Cài đặt & Chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cài đặt Database
```bash
# Tạo database
mysql -u root -p
CREATE DATABASE secondhand_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import schema và data
mysql -u root -p secondhand_marketplace < src/backend/database/schema.sql
mysql -u root -p secondhand_marketplace < src/backend/database/sample_data.sql
```

### 3. Cấu hình
Sửa `src/backend/config/database.php` và `src/backend/config/constants.php` với thông tin database của bạn.

### 4. Chạy dự án
```bash
# Terminal 1: Backend
cd src
php -S localhost:8000

# Terminal 2: Frontend
npm run dev
```

Truy cập: http://localhost:5173

### Tài khoản mẫu
- Admin: admin@secondstyle.vn / password123
- Seller: seller1@example.com / password123
- Buyer: buyer1@example.com / password123

## 🛠️ Tech Stack

**Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui  
**Backend:** PHP 7.4+ + MySQL 5.7+ + JWT  
**PWA:** Service Worker + Web App Manifest

## 📁 Cấu trúc chính

```
src/
├── backend/
│   ├── api/negotiations.php      # API thương lượng giá (MỚI)
│   ├── database/schema.sql       # Schema với specifications, negotiations (CẬP NHẬT)
│   └── database/sample_data.sql  # 7 sản phẩm mẫu chi tiết (CẬP NHẬT)
├── components/
│   ├── PriceNegotiation.tsx      # Component thương lượng giá (MỚI)
│   ├── ProductDetail.tsx         # Hiển thị specs, negotiation (CẬP NHẬT)
│   └── CreateListing.tsx         # Form đăng tin đầy đủ (CẬP NHẬT)
```

## 📊 Danh mục sản phẩm

👔 **Quần áo Nam** - Áo thun, Áo sơ mi, Quần jean, Quần kaki, Áo khoác  
👗 **Quần áo Nữ** - Áo thun, Áo sơ mi, Quần jean, Váy, Đầm, Áo khoác  
👟 **Giày dép** - Giày thể thao, Giày công sở, Dép, Boots  
👜 **Phụ kiện** - Túi xách, Mũ nón, Khăn quàng, Đồng hồ, Thắt lưng  

---

Built with ❤️ by SecondStyle Team  