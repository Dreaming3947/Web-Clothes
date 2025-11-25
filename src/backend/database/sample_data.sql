-- =============================================
-- SAMPLE DATA - Dữ liệu mẫu để test
-- =============================================

USE secondhand_marketplace;

-- =============================================
-- Insert Categories
-- =============================================
INSERT INTO categories (name, slug, description, icon, parent_id, display_order, status) VALUES
-- Danh mục cha
('Quần áo Nam', 'quan-ao-nam', 'Thời trang nam các loại', '👔', NULL, 1, 'active'),
('Quần áo Nữ', 'quan-ao-nu', 'Thời trang nữ các loại', '👗', NULL, 2, 'active'),
('Giày dép', 'giay-dep', 'Giày dép nam nữ', '👟', NULL, 3, 'active'),
('Phụ kiện', 'phu-kien', 'Phụ kiện thời trang', '👜', NULL, 4, 'active'),

-- Danh mục con - Quần áo Nam
('Áo thun Nam', 'ao-thun-nam', 'Áo thun, polo nam', '👕', 1, 5, 'active'),
('Áo sơ mi Nam', 'ao-so-mi-nam', 'Áo sơ mi công sở, casual nam', '👔', 1, 6, 'active'),
('Quần jean Nam', 'quan-jean-nam', 'Quần jean nam các kiểu', '👖', 1, 7, 'active'),
('Quần kaki Nam', 'quan-kaki-nam', 'Quần kaki, tây nam', '👔', 1, 8, 'active'),
('Áo khoác Nam', 'ao-khoac-nam', 'Áo khoác, jacket nam', '🧥', 1, 9, 'active'),

-- Danh mục con - Quần áo Nữ
('Áo thun Nữ', 'ao-thun-nu', 'Áo thun, crop top nữ', '👚', 2, 10, 'active'),
('Áo sơ mi Nữ', 'ao-so-mi-nu', 'Áo sơ mi, kiểu nữ', '👚', 2, 11, 'active'),
('Quần jean Nữ', 'quan-jean-nu', 'Quần jean nữ các kiểu', '👖', 2, 12, 'active'),
('Váy', 'vay', 'Váy midi, maxi, ngắn', '👗', 2, 13, 'active'),
('Đầm', 'dam', 'Đầm dự tiệc, công sở', '💃', 2, 14, 'active'),
('Áo khoác Nữ', 'ao-khoac-nu', 'Áo khoác, cardigan nữ', '🧥', 2, 15, 'active'),

-- Danh mục con - Giày dép
('Giày thể thao', 'giay-the-thao', 'Sneakers, giày chạy bộ', '👟', 3, 16, 'active'),
('Giày công sở', 'giay-cong-so', 'Giày tây, giày cao gót', '👞', 3, 17, 'active'),
('Dép', 'dep', 'Dép sandal, dép lê', '🩴', 3, 18, 'active'),
('Boots', 'boots', 'Giày boot nam nữ', '🥾', 3, 19, 'active'),

-- Danh mục con - Phụ kiện
('Túi xách', 'tui-xach', 'Túi xách, balo, ví', '👜', 4, 20, 'active'),
('Mũ nón', 'mu-non', 'Mũ lưỡi trai, nón', '🧢', 4, 21, 'active'),
('Khăn quàng', 'khan-quang', 'Khăn quàng cổ, khăn choàng', '🧣', 4, 22, 'active'),
('Đồng hồ', 'dong-ho', 'Đồng hồ đeo tay', '⌚', 4, 23, 'active'),
('Thắt lưng', 'that-lung', 'Thắt lưng da, vải', '🎀', 4, 24, 'active');

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
INSERT INTO products (seller_id, category_id, title, slug, description, specifications, price, original_price, `condition`, condition_detail, size, brand, color, material, location_city, location_district, status, allow_negotiation, min_acceptable_price, views_count, favorites_count, approved_at, approved_by) VALUES
-- Quần áo Nam
(2, 5, 'Áo thun Uniqlo trắng cổ tròn - Size M', 'ao-thun-uniqlo-trang-co-tron-size-m', 
'Áo thun Uniqlo màu trắng cổ tròn, chất liệu cotton 100% cao cấp từ Nhật Bản. Mặc rất mát, thoáng khí và thấm hút mồ hôi tốt. Form áo vừa vặn, không quá rộng hay bó sát. Đã qua sử dụng 3-4 lần, giặt máy không bị phai màu, không giãn cổ, không xù lông. Hiện tại vẫn còn rất mới, giặt sạch sẽ, ủi phẳng phiu, sẵn sàng để mặc ngay.', 
'{"Chất liệu": "100% Cotton", "Xuất xứ": "Nhật Bản", "Độ dày": "Vừa phải", "Co giãn": "Có", "Kiểu cổ": "Cổ tròn", "Kiểu tay": "Tay ngắn", "Độ dài": "60cm", "Rộng vai": "42cm"}',
85000, 299000, 'like-new', 
'Còn 95% mới. Không có vết bẩn, rách, hoặc hư hỏng. Cổ áo và bo tay vẫn giữ form tốt. Màu trắng không bị ố vàng.',
'M', 'Uniqlo', 'Trắng', 'Cotton', 'TP.HCM', 'Quận 1', 'approved', 1, 70000, 234, 45, NOW(), 1),

(2, 7, 'Quần jean Levi\'s 511 Slim Fit - Size 30', 'quan-jean-levis-511-slim-fit-size-30', 
'Quần jean Levi\'s 511 chính hãng từ Mỹ, màu xanh đậm indigo cổ điển, form slim fit ôm vừa vặn rất đẹp dáng. Chất denim cao cấp 98% cotton + 2% elastane nên vừa bền vừa co giãn thoải mái khi mặc. Thiết kế 5 túi cổ điển với logo Levi\'s tab đỏ chính hãng. Đã mặc khoảng 10 lần, vẫn giữ màu rất tốt, không bị bạc màu hay rách. Giặt đúng cách theo hướng dẫn nên vẫn còn rất đẹp.',
'{"Chất liệu": "98% Cotton, 2% Elastane", "Xuất xứ": "USA", "Độ dày": "Denim trung bình", "Co giảm": "Có (2% Elastane)", "Kiểu dáng": "Slim Fit", "Chiều dài": "Full length", "Màu": "Indigo Dark Wash", "Vòng eo": "76cm (size 30)"}',
450000, 1890000, 'like-new', 
'Còn 90-95% mới. Đường may chắc chắn, không chỉ thừa. Logo và nút khuy còn nguyên. Màu xanh đậm đẹp, không bạc màu. Không có vết rách hoặc hư hỏng.',
'30', 'Levi\'s', 'Xanh denim đậm', 'Denim', 'TP.HCM', 'Quận 3', 'approved', 1, 400000, 567, 89, NOW(), 1),

-- Quần áo Nữ
(3, 13, 'Váy hoa vintage phong cách Hàn Quốc', 'vay-hoa-vintage-phong-cach-han-quoc', 
'Váy hoa midi vintage siêu xinh xắn, phong cách Hàn Quốc rất hot hiện nay. Chất liệu voan mềm mại, nhẹ nhàng, thoáng mát, phù hợp mặc mùa hè. Họa tiết hoa nhí dễ thương, màu pastel nhã nhặn, dễ phối đồ. Thiết kế dáng chữ A xòe nhẹ, vòng eo thun co giãn thoải mái. Freesize phù hợp từ 45-55kg, chiều cao từ 1m55-1m65.',
'{"Chất liệu": "Voan poly", "Xuất xứ": "Quảng Châu", "Độ dày": "Mỏng, thoáng mát", "Co giãn": "Có (phần eo)", "Kiểu dáng": "Chữ A xòe", "Chiều dài": "Midi (dưới gối)", "Họa tiết": "Hoa nhí", "Size": "Freesize (45-55kg)"}',
150000, 350000, 'good', 
'Còn khoảng 80-85% mới. Đã mặc nhiều lần nhưng vẫn đẹp. Có vài vết xước nhỏ ở lớp voan bên ngoài (không rõ lắm). Màu sắc vẫn tươi, không phai. Thun eo vẫn co giãn tốt.',
'Freesize', 'No Brand', 'Hoa pastel', 'Voan', 'TP.HCM', 'Quận 7', 'approved', 1, 120000, 432, 67, NOW(), 1),

(2, 11, 'Áo sơ mi trắng công sở nữ - Size S', 'ao-so-mi-trang-cong-so-nu-size-s', 
'Áo sơ mi trắng form fitted sang trọng, rất thích hợp cho môi trường công sở chuyên nghiệp. Chất liệu kate mịn màng, không nhăn, không cần ủi nhiều. Thiết kế cổ vest thanh lịch, tay dài có manshit, eo ôm vừa vặn tôn dáng. Màu trắng tinh khôi, dễ phối với vest, chân váy hoặc quần tây. Đã mặc đi làm khoảng 5-6 lần, giặt ủi cẩn thận nên vẫn còn rất mới.',
'{"Chất liệu": "Kate cao cấp", "Xuất xứ": "Việt Nam", "Độ dày": "Vừa phải", "Co giãn": "Không", "Kiểu cổ": "Cổ vest", "Kiểu tay": "Tay dài có manshit", "Kiểu dáng": "Fitted, ôm eo", "Chiều dài áo": "58cm"}',
120000, 280000, 'like-new', 
'Còn 90% mới. Màu trắng tinh, không ố vàng. Cổ áo và manshit vẫn cứng đẹp. Không có vết bẩn, vết ố hay hư hỏng. Các đường may chắc chắn.',
'S', 'Thời Trang Việt', 'Trắng', 'Kate', 'TP.HCM', 'Quận 1', 'approved', 1, 100000, 189, 23, NOW(), 1),

(3, 15, 'Áo khoác jean nữ Zara - Size L', 'ao-khoac-jean-nu-zara-size-l', 
'Áo khoác jean Zara hàng chính hãng từ Tây Ban Nha, màu xanh nhạt wash vintage rất trendy. Thiết kế basic oversize, form rộng thoải mái, dễ phối đồ từ style casual đến streetwear. Chất jean dày dặn, bền chắc, giữ form tốt. Có 2 túi ngực, 2 túi hông tiện dụng. Đã mặc một mùa đông, vẫn giữ màu và form rất đẹp, không bị phai màu, không rách.',
'{"Chất liệu": "100% Cotton Denim", "Xuất xứ": "Tây Ban Nha (Zara)", "Độ dày": "Denim dày", "Co giãn": "Không", "Kiểu dáng": "Oversize", "Màu": "Light Blue Wash", "Số túi": "4 túi (2 ngực, 2 hông)", "Chiều dài": "65cm"}',
280000, 799000, 'good', 
'Còn 85% mới. Màu xanh nhạt đẹp, không bị phai nhiều. Có vài dấu hiệu sử dụng nhẹ như nhăn tự nhiên ở khuỷu tay. Nút và khuy còn nguyên, đường may chắc chắn.',
'L', 'Zara', 'Xanh nhạt', 'Denim', 'TP.HCM', 'Quận 10', 'approved', 1, 250000, 678, 124, NOW(), 1),

-- Giày dép
(2, 16, 'Giày thể thao Nike Air Force 1 trắng - Size 42', 'giay-nike-air-force-1-trang-size-42',
'Giày Nike Air Force 1 Low chính hãng, màu trắng full white cổ điển - mẫu giày iconic của Nike. Chất liệu da thật cao cấp, mềm mại và bền bỉ. Đế giày Air cushioning êm ái, chống sốc tốt. Logo Swoosh thêu nổi sang trọng. Giày đã đi khoảng 2-3 tháng, vẫn còn rất đẹp và sạch sẽ. Da không bị nứt nẻ, đế không bị mòn nhiều.',
'{"Chất liệu": "Da thật cao cấp", "Xuất xứ": "Vietnam (Nike authorized)", "Công nghệ": "Air cushioning", "Màu": "Triple White", "Loại đế": "Rubber sole", "Chiều cao cổ": "Low top", "Trọng lượng": "~400g/chiếc", "Code sản phẩm": "315122-111"}',
1200000, 2890000, 'like-new',
'Còn 90% mới. Da còn mịn màng, sạch sẽ. Có vài nếp nhăn nhẹ ở mũi giày (tự nhiên khi đi). Đế còn rất tốt, ít mòn. Logo và chữ in còn rõ nét.',
'42', 'Nike', 'Trắng', 'Da thật', 'TP.HCM', 'Quận 5', 'approved', 1, 1100000, 892, 156, NOW(), 1),

-- Phụ kiện
(3, 20, 'Túi xách Charles & Keith màu đen', 'tui-xach-charles-keith-mau-den',
'Túi xách Charles & Keith chính hãng từ Singapore, màu đen basic dễ phối đồ. Chất liệu da PU cao cấp, bóng đẹp, không bong tróc. Thiết kế dáng chữ nhật thanh lịch, kích thước vừa phải, đựng được laptop 13 inch, sách vở, mỹ phẩm. Có dây đeo vai dài có thể tháo rời, đeo vai hoặc xách tay đều đẹp. Bên trong có 1 ngăn chính + 2 ngăn nhỏ tiện dụng.',
'{"Chất liệu": "Da PU cao cấp", "Xuất xứ": "Singapore (C&K)", "Kích thước": "30cm x 25cm x 12cm", "Trọng lượng": "~500g", "Số ngăn": "1 ngăn chính + 2 ngăn phụ", "Phụ kiện": "Dây đeo vai (có thể tháo)", "Kiểu khóa": "Khóa nam châm + khóa kéo", "Màu": "Đen"}',
680000, 1590000, 'like-new',
'Còn 92% mới. Da vẫn bóng đẹp, không trầy xước nhiều. Khóa kéo và khóa nam châm hoạt động tốt. Lót bên trong sạch sẽ. Có vài vết nhăn nhẹ ở góc túi (tự nhiên khi sử dụng).',
'One size', 'Charles & Keith', 'Đen', 'Da PU', 'Hà Nội', 'Quận Hoàn Kiếm', 'approved', 1, 600000, 543, 98, NOW(), 1);

-- =============================================
-- Insert Product Images (min 4 images per product)
-- =============================================
INSERT INTO product_images (product_id, image_url, display_order, is_primary) VALUES
-- Product 1: Áo thun Uniqlo
(1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 0, 1),
(1, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800', 1, 0),
(1, 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800', 2, 0),
(1, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', 3, 0),

-- Product 2: Quần jean Levi's
(2, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 0, 1),
(2, 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800', 1, 0),
(2, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', 2, 0),
(2, 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800', 3, 0),

-- Product 3: Váy hoa vintage
(3, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 0, 1),
(3, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800', 1, 0),
(3, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 2, 0),
(3, 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800', 3, 0),

-- Product 4: Áo sơ mi trắng
(4, 'https://images.unsplash.com/photo-1603251579431-8041402bdeda?w=800', 0, 1),
(4, 'https://images.unsplash.com/photo-1624206112431-517f8af0b3cc?w=800', 1, 0),
(4, 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=800', 2, 0),
(4, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 3, 0),

-- Product 5: Áo khoác jean Zara
(5, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', 0, 1),
(5, 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800', 1, 0),
(5, 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=800', 2, 0),
(5, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 3, 0),

-- Product 6: Giày Nike Air Force 1
(6, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 0, 1),
(6, 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800', 1, 0),
(6, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', 2, 0),
(6, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800', 3, 0),

-- Product 7: Túi xách Charles & Keith
(7, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', 0, 1),
(7, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800', 1, 0),
(7, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', 2, 0),
(7, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800', 3, 0);

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
