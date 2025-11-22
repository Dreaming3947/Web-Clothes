-- =============================================
-- SAMPLE DATA - Dữ liệu mẫu để test
-- =============================================

USE secondhand_marketplace;

-- =============================================
-- Insert Categories
-- =============================================
INSERT INTO categories (name, slug, description, icon, display_order, status) VALUES
('Áo thun', 'ao-thun', 'Áo thun nam nữ các loại', '👕', 1, 'active'),
('Áo sơ mi', 'ao-so-mi', 'Áo sơ mi công sở, casual', '👔', 2, 'active'),
('Quần jean', 'quan-jean', 'Quần jean nam nữ', '👖', 3, 'active'),
('Váy', 'vay', 'Váy các loại', '👗', 4, 'active'),
('Áo khoác', 'ao-khoac', 'Áo khoác, jacket', '🧥', 5, 'active'),
('Đầm', 'dam', 'Đầm dự tiệc, đầm công sở', '💃', 6, 'active'),
('Quần short', 'quan-short', 'Quần short thể thao, casual', '🩳', 7, 'active'),
('Phụ kiện', 'phu-kien', 'Túi xách, mũ, khăn...', '👜', 8, 'active');

-- =============================================
-- Insert Users (password cho tất cả: password123)
-- =============================================
INSERT INTO users (email, password_hash, full_name, phone, role, status, email_verified) VALUES
('admin@secondstyle.vn', '$2y$12$LQv3c1yycEn.h8yO3W5Y8OeYIrvGJK5CqGJvX7TqPq5S5V5Vfv5K6', 'Admin System', '0901234567', 'admin', 'active', 1),
('seller1@example.com', '$2y$12$LQv3c1yycEn.h8yO3W5Y8OeYIrvGJK5CqGJvX7TqPq5S5V5Vfv5K6', 'Nguyễn Văn A', '0912345678', 'seller', 'active', 1),
('seller2@example.com', '$2y$12$LQv3c1yycEn.h8yO3W5Y8OeYIrvGJK5CqGJvX7TqPq5S5V5Vfv5K6', 'Trần Thị B', '0923456789', 'seller', 'active', 1),
('buyer1@example.com', '$2y$12$LQv3c1yycEn.h8yO3W5Y8OeYIrvGJK5CqGJvX7TqPq5S5V5Vfv5K6', 'Lê Văn C', '0934567890', 'buyer', 'active', 1),
('buyer2@example.com', '$2y$12$LQv3c1yycEn.h8yO3W5Y8OeYIrvGJK5CqGJvX7TqPq5S5V5Vfv5K6', 'Phạm Thị D', '0945678901', 'buyer', 'active', 1);

-- =============================================
-- Insert Products
-- =============================================
INSERT INTO products (seller_id, category_id, title, slug, description, price, `condition`, size, brand, location_city, location_district, status, views_count, favorites_count, approved_at, approved_by) VALUES
(2, 1, 'Áo thun Uniqlo trắng cổ tròn - Size M', 'ao-thun-uniqlo-trang-co-tron-size-m', 'Áo thun Uniqlo màu trắng, chất liệu cotton 100%, mặc rất mát và thoáng. Đã qua sử dụng nhưng vẫn còn rất mới, không phai màu, không giãn cổ. Giặt sạch sẽ, sẵn sàng để mặc.', 85000, 'like-new', 'M', 'Uniqlo', 'TP.HCM', 'Quận 1', 'approved', 234, 45, NOW(), 1),
(2, 3, 'Quần jean Levi\'s 511 Slim Fit - Size 30', 'quan-jean-levis-511-slim-fit-size-30', 'Quần jean Levi\'s 511 chính hãng, màu xanh đậm, form slim fit ôm vừa vặn. Chất denim cao cấp, bền đẹp. Đã mặc vài lần, còn rất mới, không bạc màu hay rách.', 450000, 'like-new', '30', 'Levi\'s', 'TP.HCM', 'Quận 3', 'approved', 567, 89, NOW(), 1),
(3, 4, 'Váy hoa vintage phong cách Hàn Quốc', 'vay-hoa-vintage-phong-cach-han-quoc', 'Váy hoa midi vintage siêu xinh, phong cách Hàn Quốc. Chất liệu voan mềm mại, họa tiết hoa nhí dễ thương. Freesize phù hợp từ 45-52kg.', 150000, 'good', 'Freesize', NULL, 'TP.HCM', 'Quận 7', 'approved', 432, 67, NOW(), 1),
(2, 2, 'Áo sơ mi trắng công sở - Size S', 'ao-so-mi-trang-cong-so-size-s', 'Áo sơ mi trắng form fitted, chất liệu kate mịn, không nhăn. Rất thích hợp đi làm văn phòng. Giặt ủi sạch sẽ, còn rất mới.', 120000, 'like-new', 'S', NULL, 'TP.HCM', 'Quận 1', 'approved', 189, 23, NOW(), 1),
(3, 5, 'Áo khoác jean Zara - Size L', 'ao-khoac-jean-zara-size-l', 'Áo khoác jean Zara màu xanh nhạt, thiết kế basic dễ phối đồ. Chất jean dày dặn, form oversize trendy. Còn rất đẹp, không bị phai màu.', 280000, 'good', 'L', 'Zara', 'TP.HCM', 'Quận 10', 'approved', 678, 124, NOW(), 1);

-- =============================================
-- Insert Product Images
-- =============================================
INSERT INTO product_images (product_id, image_url, display_order, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 0, 1),
(1, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800', 1, 0),
(2, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 0, 1),
(2, 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800', 1, 0),
(3, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 0, 1),
(4, 'https://images.unsplash.com/photo-1603251579431-8041402bdeda?w=800', 0, 1),
(5, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', 0, 1);

-- =============================================
-- Insert Product Tags
-- =============================================
INSERT INTO product_tags (product_id, tag) VALUES
(1, 'uniqlo'),
(1, 'cotton'),
(1, 'basic'),
(2, 'levis'),
(2, 'denim'),
(2, 'slim-fit'),
(3, 'vintage'),
(3, 'korean-style'),
(3, 'floral'),
(4, 'office'),
(4, 'formal'),
(5, 'zara'),
(5, 'denim-jacket'),
(5, 'oversized');

-- =============================================
-- Insert Settings
-- =============================================
INSERT INTO settings (setting_key, setting_value, description) VALUES
('site_name', 'SecondStyle', 'Tên website'),
('site_description', 'Chợ đồ cũ - Mua bán quần áo second-hand uy tín', 'Mô tả website'),
('admin_email', 'admin@secondstyle.vn', 'Email admin'),
('products_require_approval', '1', 'Sản phẩm cần duyệt (1=yes, 0=no)'),
('max_images_per_product', '6', 'Số lượng ảnh tối đa cho 1 sản phẩm'),
('commission_rate', '5', 'Tỷ lệ hoa hồng (%)'),
('featured_product_price', '50000', 'Giá để sản phẩm nổi bật (VNĐ)');

-- =============================================
-- Note: Password cho tất cả users test là: password123
-- =============================================
