# Backend API - Hệ Thống Mua Bán Đồ Cũ

Backend API được xây dựng bằng **PHP thuần** với kiến trúc RESTful API.

## 📋 Yêu Cầu Hệ Thống

- PHP >= 7.4
- MySQL >= 5.7
- Apache/Nginx với mod_rewrite
- Extension: PDO, PDO_MySQL, GD, JSON

## 🚀 Cài Đặt

### 1. Tạo Database

```bash
# Import database schema
mysql -u root -p < database/schema.sql
```

### 2. Cấu Hình Database

Chỉnh sửa file `config/database.php`:

```php
private $host = "localhost";
private $db_name = "secondhand_marketplace";
private $username = "root";
private $password = "your_password";
```

### 3. Cấu Hình Constants

Chỉnh sửa file `config/constants.php`:

```php
define('BASE_URL', 'http://localhost/secondhand-marketplace');
define('JWT_SECRET', 'your-secret-key-change-this-in-production');
```

### 4. Phân Quyền Thư Mục

```bash
chmod -R 755 backend/uploads
```

## 📚 API Endpoints

### Base URL
```
http://localhost/secondhand-marketplace/backend/api
```

---

## 🔐 Authentication APIs

### 1. Đăng Ký

**Endpoint:** `POST /auth.php?action=register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "Nguyễn Văn A",
  "phone": "0123456789",
  "role": "seller"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "Nguyễn Văn A",
      "role": "seller"
    }
  }
}
```

### 2. Đăng Nhập

**Endpoint:** `POST /auth.php?action=login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "Nguyễn Văn A",
      "phone": "0123456789",
      "avatar": null,
      "role": "seller"
    }
  }
}
```

### 3. Lấy Thông Tin User Hiện Tại

**Endpoint:** `GET /auth.php?action=me`

**Headers:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "Nguyễn Văn A",
      "phone": "0123456789",
      "avatar": null,
      "role": "seller"
    },
    "statistics": {
      "total_products": 5,
      "sold_products": 2,
      "total_purchases": 3,
      "total_favorites": 10,
      "avg_rating": 4.5,
      "total_reviews": 8
    }
  }
}
```

### 4. Đổi Mật Khẩu

**Endpoint:** `POST /auth.php?action=change-password`

**Headers:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**Request Body:**
```json
{
  "current_password": "old_password",
  "new_password": "new_password"
}
```

### 5. Quên Mật Khẩu

**Endpoint:** `POST /auth.php?action=forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### 6. Reset Mật Khẩu

**Endpoint:** `POST /auth.php?action=reset-password`

**Request Body:**
```json
{
  "token": "reset_token_here",
  "password": "new_password"
}
```

---

## 🛍️ Products APIs

### 1. Lấy Danh Sách Sản Phẩm

**Endpoint:** `GET /products.php`

**Query Parameters:**
- `page` (int): Trang hiện tại (default: 1)
- `limit` (int): Số sản phẩm mỗi trang (default: 20)
- `search` (string): Tìm kiếm theo tiêu đề/mô tả
- `category_id` (int): Lọc theo danh mục
- `min_price` (float): Giá tối thiểu
- `max_price` (float): Giá tối đa
- `condition` (string|array): Tình trạng (new, like-new, good, fair)
- `size` (string|array): Kích cỡ
- `brand` (string): Thương hiệu
- `location_city` (string): Thành phố
- `seller_id` (int): ID người bán
- `is_featured` (bool): Sản phẩm nổi bật
- `sort` (string): Sắp xếp (newest, price_asc, price_desc, popular)

**Example:**
```
GET /products.php?page=1&limit=20&category_id=1&min_price=100000&max_price=500000&sort=price_asc
```

**Response:**
```json
{
  "success": true,
  "message": "Lấy danh sách sản phẩm thành công",
  "data": [
    {
      "id": 1,
      "title": "Áo thun Uniqlo trắng cổ tròn - Size M",
      "price": 85000,
      "condition": "like-new",
      "primary_image": "http://localhost/.../product_123.jpg",
      "seller_name": "Nguyễn Văn A",
      "category_name": "Áo thun",
      "location_city": "TP.HCM"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

### 2. Lấy Chi Tiết Sản Phẩm

**Endpoint:** `GET /products.php?id={product_id}`

**Query Parameters:**
- `increment_view` (bool): Tăng lượt xem (default: false)

**Response:**
```json
{
  "success": true,
  "message": "Lấy thông tin sản phẩm thành công",
  "data": {
    "id": 1,
    "title": "Áo thun Uniqlo trắng cổ tròn - Size M",
    "description": "Áo thun Uniqlo màu trắng...",
    "price": 85000,
    "condition": "like-new",
    "size": "M",
    "brand": "Uniqlo",
    "location_city": "TP.HCM",
    "location_district": "Quận 1",
    "seller_name": "Nguyễn Văn A",
    "seller_phone": "0123456789",
    "category_name": "Áo thun",
    "images": [
      "http://localhost/.../product_123.jpg",
      "http://localhost/.../product_124.jpg"
    ],
    "tags": ["uniqlo", "cotton", "basic"],
    "views_count": 234,
    "favorites_count": 45,
    "created_at": "2025-10-25 10:30:00"
  }
}
```

### 3. Tạo Sản Phẩm Mới

**Endpoint:** `POST /products.php`

**Headers:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Áo thun Uniqlo trắng cổ tròn - Size M",
  "description": "Áo thun Uniqlo màu trắng, chất liệu cotton 100%...",
  "price": 85000,
  "category_id": 1,
  "condition": "like-new",
  "size": "M",
  "brand": "Uniqlo",
  "color": "Trắng",
  "material": "Cotton",
  "location_city": "TP.HCM",
  "location_district": "Quận 1",
  "tags": ["uniqlo", "cotton", "basic"],
  "shipping_methods": ["standard", "express"],
  "payment_methods": ["cod", "bank_transfer", "momo"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo mới thành công",
  "data": {
    "id": 123
  }
}
```

### 4. Upload Hình Ảnh Sản Phẩm

**Endpoint:** `POST /products.php?id={product_id}&action=upload-images`

**Headers:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: multipart/form-data
```

**Form Data:**
```
images[]: file1.jpg
images[]: file2.jpg
images[]: file3.jpg
```

**Response:**
```json
{
  "success": true,
  "message": "Upload hình ảnh thành công",
  "data": {
    "images": [
      "http://localhost/.../product_123.jpg",
      "http://localhost/.../product_124.jpg"
    ]
  }
}
```

### 5. Cập Nhật Sản Phẩm

**Endpoint:** `PUT /products.php?id={product_id}`

**Headers:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated title",
  "price": 90000,
  "description": "Updated description"
}
```

### 6. Xóa Sản Phẩm

**Endpoint:** `DELETE /products.php?id={product_id}`

**Headers:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### 7. Toggle Yêu Thích

**Endpoint:** `POST /products.php?id={product_id}&action=favorite`

**Headers:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**Response:**
```json
{
  "success": true,
  "message": "Đã thêm vào yêu thích",
  "data": {
    "favorited": true
  }
}
```

### 8. Lấy Danh Sách Yêu Thích

**Endpoint:** `GET /products.php?action=favorites&page=1&limit=20`

**Headers:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### 9. Duyệt Sản Phẩm (Admin)

**Endpoint:** `POST /products.php?id={product_id}&action=approve`

**Headers:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### 10. Từ Chối Sản Phẩm (Admin)

**Endpoint:** `POST /products.php?id={product_id}&action=reject`

**Headers:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Hình ảnh không rõ ràng"
}
```

---

## 🔧 Error Handling

Tất cả API đều trả về format:

**Success Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": "Error detail"
  }
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## 📝 Testing với cURL

### Test Đăng Ký
```bash
curl -X POST http://localhost/secondhand-marketplace/backend/api/auth.php?action=register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "role": "seller"
  }'
```

### Test Đăng Nhập
```bash
curl -X POST http://localhost/secondhand-marketplace/backend/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Lấy Sản Phẩm
```bash
curl http://localhost/secondhand-marketplace/backend/api/products.php?page=1&limit=10
```

### Test Tạo Sản Phẩm
```bash
curl -X POST http://localhost/secondhand-marketplace/backend/api/products.php \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Product",
    "description": "Test Description",
    "price": 100000,
    "category_id": 1,
    "condition": "like-new",
    "location_city": "TP.HCM"
  }'
```

---

## 🔒 Security

- Tất cả password được hash bằng bcrypt
- JWT token expire sau 7 ngày
- SQL Injection protection với PDO prepared statements
- XSS protection với htmlspecialchars
- CSRF protection (cần implement thêm)
- Rate limiting (cần implement thêm)

---

## 📁 Cấu Trúc Thư Mục

```
backend/
├── api/
│   ├── auth.php          # Authentication APIs
│   ├── products.php      # Products APIs
│   ├── orders.php        # Orders APIs (TODO)
│   ├── messages.php      # Messages APIs (TODO)
│   └── users.php         # Users APIs (TODO)
├── config/
│   ├── database.php      # Database connection
│   └── constants.php     # Constants và cấu hình
├── models/
│   ├── User.php          # User model
│   ├── Product.php       # Product model
│   └── Order.php         # Order model (TODO)
├── utils/
│   ├── Auth.php          # JWT authentication
│   ├── Response.php      # Response helpers
│   ├── Validation.php    # Validation helpers
│   └── Upload.php        # Upload helpers
├── uploads/
│   ├── products/         # Product images
│   ├── avatars/          # User avatars
│   └── reviews/          # Review images
└── database/
    └── schema.sql        # Database schema
```

---

## 📞 Support

Nếu gặp vấn đề, vui lòng tạo issue hoặc liên hệ support@secondstyle.vn
