<?php
/**
 * Constants Configuration
 * Các hằng số cấu hình hệ thống
 */

// Timezone
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Base URLs (local)
define('BASE_URL', 'http://127.0.0.1:8000/backend');
define('API_URL', BASE_URL . '/api');
define('UPLOAD_URL', BASE_URL . '/uploads');

// Paths
define('ROOT_PATH', dirname(__DIR__));
define('UPLOAD_PATH', ROOT_PATH . '/uploads');

// Upload directories
define('PRODUCT_IMAGES_PATH', UPLOAD_PATH . '/products');
define('USER_AVATARS_PATH', UPLOAD_PATH . '/avatars');
define('REVIEW_IMAGES_PATH', UPLOAD_PATH . '/reviews');

// File upload limits
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('MAX_IMAGES_PER_PRODUCT', 6);
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']);

// Pagination
define('PRODUCTS_PER_PAGE', 20);
define('ORDERS_PER_PAGE', 15);
define('MESSAGES_PER_PAGE', 50);

// JWT Secret (Thay đổi trong production)
define('JWT_SECRET', 'your-secret-key-change-this-in-production');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRATION', 7 * 24 * 60 * 60); // 7 days

// Password
define('PASSWORD_MIN_LENGTH', 6);
define('PASSWORD_HASH_ALGO', PASSWORD_BCRYPT);
define('PASSWORD_HASH_COST', 12);

// Email configuration (cho future implementation)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-password');
define('SMTP_FROM_EMAIL', 'noreply@secondstyle.vn');
define('SMTP_FROM_NAME', 'SecondStyle');

// Payment Gateways (Mock - thay bằng credentials thật)
define('VNPAY_TMN_CODE', 'YOUR_TMN_CODE');
define('VNPAY_HASH_SECRET', 'YOUR_HASH_SECRET');
define('VNPAY_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');

define('MOMO_PARTNER_CODE', 'YOUR_PARTNER_CODE');
define('MOMO_ACCESS_KEY', 'YOUR_ACCESS_KEY');
define('MOMO_SECRET_KEY', 'YOUR_SECRET_KEY');
define('MOMO_ENDPOINT', 'https://test-payment.momo.vn/v2/gateway/api/create');

// Status definitions
define('PRODUCT_STATUS', [
    'draft' => 'Nháp',
    'pending' => 'Chờ duyệt',
    'approved' => 'Đã duyệt',
    'rejected' => 'Từ chối',
    'sold' => 'Đã bán',
    'deleted' => 'Đã xóa'
]);

define('ORDER_STATUS', [
    'pending' => 'Chờ xác nhận',
    'confirmed' => 'Đã xác nhận',
    'processing' => 'Đang xử lý',
    'shipping' => 'Đang giao hàng',
    'delivered' => 'Đã giao hàng',
    'completed' => 'Hoàn thành',
    'cancelled' => 'Đã hủy',
    'refunded' => 'Đã hoàn tiền'
]);

define('PRODUCT_CONDITION', [
    'new' => 'Mới',
    'like-new' => 'Như mới',
    'good' => 'Tốt',
    'fair' => 'Khá'
]);

// Error messages
define('ERROR_MESSAGES', [
    'UNAUTHORIZED' => 'Bạn cần đăng nhập để thực hiện hành động này',
    'FORBIDDEN' => 'Bạn không có quyền truy cập',
    'NOT_FOUND' => 'Không tìm thấy dữ liệu',
    'INVALID_INPUT' => 'Dữ liệu đầu vào không hợp lệ',
    'SERVER_ERROR' => 'Lỗi hệ thống, vui lòng thử lại sau',
    'EMAIL_EXISTS' => 'Email đã được sử dụng',
    'INVALID_CREDENTIALS' => 'Email hoặc mật khẩu không đúng',
    'UPLOAD_FAILED' => 'Tải file lên thất bại'
]);

// Success messages
define('SUCCESS_MESSAGES', [
    'CREATED' => 'Tạo mới thành công',
    'UPDATED' => 'Cập nhật thành công',
    'DELETED' => 'Xóa thành công',
    'LOGIN_SUCCESS' => 'Đăng nhập thành công',
    'REGISTER_SUCCESS' => 'Đăng ký thành công',
    'LOGOUT_SUCCESS' => 'Đăng xuất thành công'
]);

// CORS settings
define('ALLOWED_ORIGINS', [
    'https://secondstyle.infinityfree.me'
]);

// Create upload directories if not exists
if (!file_exists(PRODUCT_IMAGES_PATH)) {
    mkdir(PRODUCT_IMAGES_PATH, 0777, true);
}
if (!file_exists(USER_AVATARS_PATH)) {
    mkdir(USER_AVATARS_PATH, 0777, true);
}
if (!file_exists(REVIEW_IMAGES_PATH)) {
    mkdir(REVIEW_IMAGES_PATH, 0777, true);
}
