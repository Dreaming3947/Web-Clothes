-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th10 29, 2025 lúc 01:19 AM
-- Phiên bản máy phục vụ: 8.0.44
-- Phiên bản PHP: 8.5.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `secondhand_marketplace`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_id` int DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`, `parent_id`, `display_order`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Quần áo Nam', 'quan-ao-nam', 'Thời trang nam các loại', '👔', NULL, 1, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(2, 'Quần áo Nữ', 'quan-ao-nu', 'Thời trang nữ các loại', '👗', NULL, 2, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(3, 'Giày dép', 'giay-dep', 'Giày dép nam nữ', '👟', NULL, 3, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(4, 'Phụ kiện', 'phu-kien', 'Phụ kiện thời trang', '👜', NULL, 4, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(5, 'Áo thun Nam', 'ao-thun-nam', 'Áo thun, polo nam', '👕', 1, 5, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(6, 'Áo sơ mi Nam', 'ao-so-mi-nam', 'Áo sơ mi công sở, casual nam', '👔', 1, 6, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(7, 'Quần jean Nam', 'quan-jean-nam', 'Quần jean nam các kiểu', '👖', 1, 7, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(8, 'Quần kaki Nam', 'quan-kaki-nam', 'Quần kaki, tây nam', '👔', 1, 8, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(9, 'Áo khoác Nam', 'ao-khoac-nam', 'Áo khoác, jacket nam', '🧥', 1, 9, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(10, 'Áo thun Nữ', 'ao-thun-nu', 'Áo thun, crop top nữ', '👚', 2, 10, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(11, 'Áo sơ mi Nữ', 'ao-so-mi-nu', 'Áo sơ mi, kiểu nữ', '👚', 2, 11, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(12, 'Quần jean Nữ', 'quan-jean-nu', 'Quần jean nữ các kiểu', '👖', 2, 12, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(13, 'Váy', 'vay', 'Váy midi, maxi, ngắn', '👗', 2, 13, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(14, 'Đầm', 'dam', 'Đầm dự tiệc, công sở', '💃', 2, 14, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(15, 'Áo khoác Nữ', 'ao-khoac-nu', 'Áo khoác, cardigan nữ', '🧥', 2, 15, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(16, 'Giày thể thao', 'giay-the-thao', 'Sneakers, giày chạy bộ', '👟', 3, 16, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(17, 'Giày công sở', 'giay-cong-so', 'Giày tây, giày cao gót', '👞', 3, 17, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(18, 'Dép', 'dep', 'Dép sandal, dép lê', '🩴', 3, 18, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(19, 'Boots', 'boots', 'Giày boot nam nữ', '🥾', 3, 19, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(20, 'Túi xách', 'tui-xach', 'Túi xách, balo, ví', '👜', 4, 20, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(21, 'Mũ nón', 'mu-non', 'Mũ lưỡi trai, nón', '🧢', 4, 21, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(22, 'Khăn quàng', 'khan-quang', 'Khăn quàng cổ, khăn choàng', '🧣', 4, 22, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(23, 'Đồng hồ', 'dong-ho', 'Đồng hồ đeo tay', '⌚', 4, 23, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(24, 'Thắt lưng', 'that-lung', 'Thắt lưng da, vải', '🎀', 4, 24, 'active', '2025-11-25 08:22:54', '2025-11-25 08:22:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `favorites`
--

CREATE TABLE `favorites` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(16, 6, 12, '2025-11-28 22:23:50');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `thread_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_type` enum('text','price_offer','image','system') COLLATE utf8mb4_unicode_ci DEFAULT 'text',
  `price_offer` decimal(15,2) DEFAULT NULL COMMENT 'Giá đề xuất nếu là tin nhắn thương lượng',
  `attachments` json DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `messages`
--

INSERT INTO `messages` (`id`, `thread_id`, `sender_id`, `receiver_id`, `message`, `message_type`, `price_offer`, `attachments`, `is_read`, `read_at`, `created_at`) VALUES
(1, 1, 6, 3, 'Xin chào, tôi quan tâm đến sản phẩm \"Túi xách Charles & Keith màu đen\"', 'text', NULL, NULL, 0, NULL, '2025-11-25 12:29:00'),
(2, 2, 1, 7, 'Xin chào, tôi quan tâm đến sản phẩm \"Luna\"', 'text', NULL, NULL, 1, '2025-11-29 07:13:30', '2025-11-28 14:21:09'),
(3, 3, 7, 2, 'Xin chào, tôi quan tâm đến sản phẩm \"Áo thun Uniqlo trắng cổ tròn - Size M\"', 'text', NULL, NULL, 0, NULL, '2025-11-28 15:11:49'),
(4, 4, 6, 7, 'Xin chào, tôi quan tâm đến sản phẩm \"Túi Đeo Chéo Nữ Louis Vuitton LV Pochette Métis East West M46914 Màu Kem\"', 'text', NULL, NULL, 1, '2025-11-29 07:13:19', '2025-11-29 00:07:04'),
(5, 4, 6, 7, 'Xin chào, tôi quan tâm đến sản phẩm \"Túi Đeo Chéo Nữ Louis Vuitton LV Pochette Métis East West M46914 Màu Kem\"', 'text', NULL, NULL, 1, '2025-11-29 07:13:19', '2025-11-29 00:10:45'),
(6, 4, 6, 7, 'Xin chào, tôi quan tâm đến sản phẩm \"Túi Đeo Chéo Nữ Louis Vuitton LV Pochette Métis East West M46914 Màu Kem\"', 'text', NULL, NULL, 1, '2025-11-29 07:13:19', '2025-11-29 00:11:34'),
(7, 4, 6, 7, 'cho hỏi giá cả thế nào', 'text', NULL, NULL, 1, '2025-11-29 07:13:19', '2025-11-29 00:13:01'),
(8, 4, 7, 6, '78 tr đó bạn', 'text', NULL, NULL, 1, '2025-11-29 07:16:43', '2025-11-29 00:15:44'),
(9, 4, 7, 6, 'bạn muốn mình giảm giá không', 'text', NULL, NULL, 1, '2025-11-29 07:16:43', '2025-11-29 00:15:59'),
(10, 4, 7, 6, 'mình có thể giảm thêm 10% cho bạn đó', 'text', NULL, NULL, 1, '2025-11-29 07:16:43', '2025-11-29 00:16:19'),
(11, 4, 6, 7, 'nếu được thế thì tốt quá', 'text', NULL, NULL, 1, '2025-11-29 07:23:23', '2025-11-29 00:16:54'),
(12, 4, 6, 7, 'sẽ tốt hơn nếu giảm còn 50%', 'text', NULL, NULL, 1, '2025-11-29 07:23:23', '2025-11-29 00:17:17'),
(13, 4, 6, 7, 'được thế thì mình mua liền', 'text', NULL, NULL, 1, '2025-11-29 07:23:23', '2025-11-29 00:17:27'),
(14, 4, 7, 6, 'ok chốt đơn', 'text', NULL, NULL, 0, NULL, '2025-11-29 00:23:32'),
(15, 4, 7, 6, 'cảm ơn rất nhiều vì đă lựa chọn sản phẩm của mình', 'text', NULL, NULL, 0, NULL, '2025-11-29 00:25:36'),
(16, 4, 7, 6, 'Đơn hàng sẽ được giao sớm nhất có thể\'', 'text', NULL, NULL, 0, NULL, '2025-11-29 00:26:08'),
(17, 4, 7, 6, 'Mong bạn sẽ mua sản phẩm của mình trong tương lai', 'text', NULL, NULL, 0, NULL, '2025-11-29 00:28:08');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `message_threads`
--

CREATE TABLE `message_threads` (
  `id` int NOT NULL,
  `user1_id` int NOT NULL,
  `user2_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `last_message_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `message_threads`
--

INSERT INTO `message_threads` (`id`, `user1_id`, `user2_id`, `product_id`, `last_message_at`, `created_at`) VALUES
(1, 6, 3, 7, '2025-11-25 12:29:00', '2025-11-25 12:29:00'),
(2, 1, 7, 8, '2025-11-28 14:21:09', '2025-11-28 14:21:09'),
(3, 7, 2, 1, '2025-11-28 15:11:49', '2025-11-28 15:11:49'),
(4, 6, 7, 12, '2025-11-29 00:28:08', '2025-11-29 00:07:04');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `momo_payments`
--

CREATE TABLE `momo_payments` (
  `id` int NOT NULL,
  `order_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `request_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trans_id` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `extra_data` text COLLATE utf8mb4_unicode_ci,
  `response_data` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','completed','failed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `momo_payments`
--

INSERT INTO `momo_payments` (`id`, `order_id`, `request_id`, `trans_id`, `amount`, `extra_data`, `response_data`, `status`, `created_at`, `updated_at`) VALUES
(1, '1764348281_6929d17955cb7', '1764348281', NULL, 78120000.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":8,\"name\":\"Luna\",\"price\":90000,\"quantity\":1,\"seller_id\":7},{\"product_id\":12,\"name\":\"T\\u00fai \\u0110eo Ch\\u00e9o N\\u1eef Louis Vuitton LV Pochette M\\u00e9tis East West M46914 M\\u00e0u Kem\",\"price\":78000000,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 16:44:41', NULL),
(2, '1764348293_6929d18516fd1', '1764348293', NULL, 78120000.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":8,\"name\":\"Luna\",\"price\":90000,\"quantity\":1,\"seller_id\":7},{\"product_id\":12,\"name\":\"T\\u00fai \\u0110eo Ch\\u00e9o N\\u1eef Louis Vuitton LV Pochette M\\u00e9tis East West M46914 M\\u00e0u Kem\",\"price\":78000000,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 16:44:53', NULL),
(3, '1764348376_6929d1d84a4bc', '1764348376', NULL, 78120000.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":8,\"name\":\"Luna\",\"price\":90000,\"quantity\":1,\"seller_id\":7},{\"product_id\":12,\"name\":\"T\\u00fai \\u0110eo Ch\\u00e9o N\\u1eef Louis Vuitton LV Pochette M\\u00e9tis East West M46914 M\\u00e0u Kem\",\"price\":78000000,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 16:46:16', NULL),
(4, '1764348433_6929d21112bd0', '1764348433', NULL, 78120000.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":8,\"name\":\"Luna\",\"price\":90000,\"quantity\":1,\"seller_id\":7},{\"product_id\":12,\"name\":\"T\\u00fai \\u0110eo Ch\\u00e9o N\\u1eef Louis Vuitton LV Pochette M\\u00e9tis East West M46914 M\\u00e0u Kem\",\"price\":78000000,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 16:47:13', NULL),
(5, '1764348514_6929d2620b407', '1764348514', NULL, 78120000.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":8,\"name\":\"Luna\",\"price\":90000,\"quantity\":1,\"seller_id\":7},{\"product_id\":12,\"name\":\"T\\u00fai \\u0110eo Ch\\u00e9o N\\u1eef Louis Vuitton LV Pochette M\\u00e9tis East West M46914 M\\u00e0u Kem\",\"price\":78000000,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 16:48:34', NULL),
(6, '1764348563_6929d29328fb3', '1764348563', NULL, 78120000.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":8,\"name\":\"Luna\",\"price\":90000,\"quantity\":1,\"seller_id\":7},{\"product_id\":12,\"name\":\"T\\u00fai \\u0110eo Ch\\u00e9o N\\u1eef Louis Vuitton LV Pochette M\\u00e9tis East West M46914 M\\u00e0u Kem\",\"price\":78000000,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 16:49:23', NULL),
(7, '1764348618_6929d2ca2e7b1', '1764348618', NULL, 810000.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":3,\"name\":\"V\\u00e1y hoa vintage phong c\\u00e1ch H\\u00e0n Qu\\u1ed1c\",\"price\":150000,\"quantity\":4,\"seller_id\":3},{\"product_id\":8,\"name\":\"Luna\",\"price\":90000,\"quantity\":2,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 16:50:18', NULL),
(8, '1764348749_6929d34d84ed5', '1764348749', NULL, 810000.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":3,\"name\":\"V\\u00e1y hoa vintage phong c\\u00e1ch H\\u00e0n Qu\\u1ed1c\",\"price\":150000,\"quantity\":4,\"seller_id\":3},{\"product_id\":8,\"name\":\"Luna\",\"price\":90000,\"quantity\":2,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 16:52:29', NULL),
(9, '1764348880_6929d3d07d5e6', '1764348880', NULL, 810000.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":3,\"name\":\"V\\u00e1y hoa vintage phong c\\u00e1ch H\\u00e0n Qu\\u1ed1c\",\"price\":150000,\"quantity\":4,\"seller_id\":3},{\"product_id\":8,\"name\":\"Luna\",\"price\":90000,\"quantity\":2,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 16:54:40', NULL),
(10, '1764349047_6929d477cb819', '1764349047', NULL, 31000.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":8,\"name\":\"Luna\",\"price\":1000,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 16:57:27', NULL),
(11, '1764349726_6929d71e1f815', '1764349726', NULL, 31000.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":8,\"name\":\"Luna\",\"price\":1000,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"dsadasda\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 17:08:46', NULL),
(12, '1764363723_692a0dcb43f15', '1764363723', NULL, 31000.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":8,\"name\":\"Luna\",\"price\":1000,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 21:02:03', NULL),
(13, '1764364454_692a10a640c5c', '1764364454', NULL, 918788.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":14,\"name\":\"sadsa\",\"price\":233233,\"quantity\":1,\"seller_id\":7},{\"product_id\":13,\"name\":\"saasa\",\"price\":655555,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 21:14:14', NULL),
(14, '1764364523_692a10ebd7a97', '1764364523', NULL, 918788.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":14,\"name\":\"sadsa\",\"price\":233233,\"quantity\":1,\"seller_id\":7},{\"product_id\":13,\"name\":\"saasa\",\"price\":655555,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 21:15:23', NULL),
(15, '1764364749_692a11cd46f87', '1764364749', NULL, 918788.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":14,\"name\":\"sadsa\",\"price\":233233,\"quantity\":1,\"seller_id\":7},{\"product_id\":13,\"name\":\"saasa\",\"price\":655555,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 21:19:09', NULL),
(16, '1764365083_692a131b938f3', '1764365083', NULL, 918788.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":14,\"name\":\"sadsa\",\"price\":233233,\"quantity\":1,\"seller_id\":7},{\"product_id\":13,\"name\":\"saasa\",\"price\":655555,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 21:24:43', NULL),
(17, '1764365392_692a145041ce4', '1764365392', NULL, 38788.00, '{\"user_id\":6,\"order_items\":[{\"product_id\":13,\"name\":\"saasa\",\"price\":6555,\"quantity\":1,\"seller_id\":7},{\"product_id\":14,\"name\":\"sadsa\",\"price\":2233,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 21:29:52', NULL),
(18, '1764365665_692a15613675a', '1764365665', NULL, 38788.00, '{\"user_id\":6,\"order_id\":null,\"order_code\":null,\"order_items\":[{\"product_id\":13,\"name\":\"saasa\",\"price\":6555,\"quantity\":1,\"seller_id\":7},{\"product_id\":14,\"name\":\"sadsa\",\"price\":2233,\"quantity\":1,\"seller_id\":7}],\"shipping_info\":{\"fullName\":\"Nguy\\u1ec5n V\\u0103n A\",\"phone\":\"2313232\",\"address\":\"123 Nowhere\",\"city\":\"Ohio\",\"district\":\"Texas\",\"note\":\"Giao nhanh ch\\u00f3ng l\\u00ean\"}}', NULL, 'pending', '2025-11-28 21:34:25', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `order_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `buyer_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `shipping_fee` decimal(15,2) DEFAULT '0.00',
  `discount_amount` decimal(15,2) DEFAULT '0.00',
  `final_amount` decimal(15,2) NOT NULL,
  `status` enum('pending','confirmed','processing','shipping','delivered','completed','cancelled','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_method` enum('cod','bank_transfer','momo','vnpay','zalopay') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` enum('unpaid','paid','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'unpaid',
  `shipping_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_note` text COLLATE utf8mb4_unicode_ci,
  `tracking_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `cancellation_reason` text COLLATE utf8mb4_unicode_ci,
  `cancelled_by` int DEFAULT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `buyer_id`, `seller_id`, `total_amount`, `shipping_fee`, `discount_amount`, `final_amount`, `status`, `payment_method`, `payment_status`, `shipping_method`, `shipping_name`, `shipping_phone`, `shipping_address`, `shipping_city`, `shipping_district`, `shipping_note`, `tracking_number`, `notes`, `cancellation_reason`, `cancelled_by`, `cancelled_at`, `completed_at`, `created_at`, `updated_at`) VALUES
(1, 'ORD20251129D3168A', 6, 7, 1000.00, 30000.00, 0.00, 31000.00, 'pending', 'cod', 'unpaid', 'standard', 'Nguyễn Văn A', '2313232', '123 Nowhere', 'Ohio', 'Texas', 'Giao nhanh chóng lên', NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 21:08:13', '2025-11-28 21:08:13'),
(2, 'ORD2025112912ADDD', 6, 7, 8788.00, 30000.00, 0.00, 38788.00, 'pending', 'momo', 'paid', 'standard', 'Nguyễn Văn A', '2313232', '123 Nowhere', 'Ohio', 'Texas', 'Giao nhanh chóng lên', NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 21:34:25', '2025-11-28 21:34:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_price` decimal(15,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `subtotal` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_price`, `quantity`, `subtotal`, `created_at`) VALUES
(1, 1, 8, 'Luna', 1000.00, 1, 1000.00, '2025-11-28 21:08:13'),
(2, 2, 13, 'saasa', 6555.00, 1, 6555.00, '2025-11-28 21:34:25'),
(3, 2, 14, 'sadsa', 2233.00, 1, 2233.00, '2025-11-28 21:34:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `price_negotiations`
--

CREATE TABLE `price_negotiations` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `buyer_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `thread_id` int NOT NULL,
  `offered_price` decimal(15,2) NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','accepted','rejected','counter_offered') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `counter_price` decimal(15,2) DEFAULT NULL COMMENT 'Giá phản đề xuất của người bán',
  `counter_message` text COLLATE utf8mb4_unicode_ci,
  `responded_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `seller_id` int NOT NULL,
  `category_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `specifications` json DEFAULT NULL COMMENT 'Thông số kỹ thuật: {"Chất liệu": "Cotton", "Xuất xứ": "Việt Nam", ...}',
  `price` decimal(15,2) NOT NULL,
  `original_price` decimal(15,2) DEFAULT NULL,
  `condition` enum('new','like-new','good','fair','used','damaged','repaired') COLLATE utf8mb4_unicode_ci NOT NULL,
  `condition_detail` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả chi tiết tình trạng sản phẩm',
  `size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `material` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_address` text COLLATE utf8mb4_unicode_ci,
  `status` enum('draft','pending','approved','rejected','sold','deleted') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `allow_negotiation` tinyint(1) DEFAULT '1' COMMENT 'Cho phép thương lượng giá',
  `min_acceptable_price` decimal(15,2) DEFAULT NULL COMMENT 'Giá thấp nhất người bán chấp nhận',
  `views_count` int DEFAULT '0',
  `favorites_count` int DEFAULT '0',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_promoted` tinyint(1) DEFAULT '0',
  `promoted_until` datetime DEFAULT NULL,
  `shipping_methods` json DEFAULT NULL,
  `payment_methods` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `approved_at` datetime DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `sold_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `seller_id`, `category_id`, `title`, `slug`, `description`, `specifications`, `price`, `original_price`, `condition`, `condition_detail`, `size`, `brand`, `color`, `material`, `location_city`, `location_district`, `location_address`, `status`, `rejection_reason`, `allow_negotiation`, `min_acceptable_price`, `views_count`, `favorites_count`, `is_featured`, `is_promoted`, `promoted_until`, `shipping_methods`, `payment_methods`, `created_at`, `updated_at`, `approved_at`, `approved_by`, `sold_at`) VALUES
(1, 2, 5, 'Áo thun Uniqlo trắng cổ tròn - Size M', 'ao-thun-uniqlo-trang-co-tron-size-m', 'Áo thun Uniqlo màu trắng cổ tròn, chất liệu cotton 100% cao cấp từ Nhật Bản. Mặc rất mát, thoáng khí và thấm hút mồ hôi tốt. Form áo vừa vặn, không quá rộng hay bó sát. Đã qua sử dụng 3-4 lần, giặt máy không bị phai màu, không giãn cổ, không xù lông. Hiện tại vẫn còn rất mới, giặt sạch sẽ, ủi phẳng phiu, sẵn sàng để mặc ngay.', '{\"Co giãn\": \"Có\", \"Kiểu tay\": \"Tay ngắn\", \"Rộng vai\": \"42cm\", \"Độ dài\": \"60cm\", \"Độ dày\": \"Vừa phải\", \"Kiểu cổ\": \"Cổ tròn\", \"Xuất xứ\": \"Nhật Bản\", \"Chất liệu\": \"100% Cotton\"}', 85000.00, 299000.00, 'like-new', 'Còn 95% mới. Không có vết bẩn, rách, hoặc hư hỏng. Cổ áo và bo tay vẫn giữ form tốt. Màu trắng không bị ố vàng.', 'M', 'Uniqlo', 'Trắng', 'Cotton', 'TP.HCM', 'Quận 1', NULL, 'approved', NULL, 1, 70000.00, 234, 45, 0, 0, NULL, NULL, NULL, '2025-11-25 08:22:54', '2025-11-25 08:22:54', '2025-11-25 15:22:54', 1, NULL),
(2, 2, 7, 'Quần jean Levi\'s 511 Slim Fit - Size 30', 'quan-jean-levis-511-slim-fit-size-30', 'Quần jean Levi\'s 511 chính hãng từ Mỹ, màu xanh đậm indigo cổ điển, form slim fit ôm vừa vặn rất đẹp dáng. Chất denim cao cấp 98% cotton + 2% elastane nên vừa bền vừa co giãn thoải mái khi mặc. Thiết kế 5 túi cổ điển với logo Levi\'s tab đỏ chính hãng. Đã mặc khoảng 10 lần, vẫn giữ màu rất tốt, không bị bạc màu hay rách. Giặt đúng cách theo hướng dẫn nên vẫn còn rất đẹp.', '{\"Màu\": \"Indigo Dark Wash\", \"Vòng eo\": \"76cm (size 30)\", \"Co giảm\": \"Có (2% Elastane)\", \"Độ dày\": \"Denim trung bình\", \"Xuất xứ\": \"USA\", \"Chiều dài\": \"Full length\", \"Kiểu dáng\": \"Slim Fit\", \"Chất liệu\": \"98% Cotton, 2% Elastane\"}', 450000.00, 1890000.00, 'like-new', 'Còn 90-95% mới. Đường may chắc chắn, không chỉ thừa. Logo và nút khuy còn nguyên. Màu xanh đậm đẹp, không bạc màu. Không có vết rách hoặc hư hỏng.', '30', 'Levi\'s', 'Xanh denim đậm', 'Denim', 'TP.HCM', 'Quận 3', NULL, 'approved', NULL, 1, 400000.00, 567, 89, 0, 0, NULL, NULL, NULL, '2025-11-25 08:22:54', '2025-11-25 08:22:54', '2025-11-25 15:22:54', 1, NULL),
(3, 3, 13, 'Váy hoa vintage phong cách Hàn Quốc', 'vay-hoa-vintage-phong-cach-han-quoc', 'Váy hoa midi vintage siêu xinh xắn, phong cách Hàn Quốc rất hot hiện nay. Chất liệu voan mềm mại, nhẹ nhàng, thoáng mát, phù hợp mặc mùa hè. Họa tiết hoa nhí dễ thương, màu pastel nhã nhặn, dễ phối đồ. Thiết kế dáng chữ A xòe nhẹ, vòng eo thun co giãn thoải mái. Freesize phù hợp từ 45-55kg, chiều cao từ 1m55-1m65.', '{\"Size\": \"Freesize (45-55kg)\", \"Co giãn\": \"Có (phần eo)\", \"Độ dày\": \"Mỏng, thoáng mát\", \"Xuất xứ\": \"Quảng Châu\", \"Chiều dài\": \"Midi (dưới gối)\", \"Họa tiết\": \"Hoa nhí\", \"Kiểu dáng\": \"Chữ A xòe\", \"Chất liệu\": \"Voan poly\"}', 150000.00, 350000.00, 'good', 'Còn khoảng 80-85% mới. Đã mặc nhiều lần nhưng vẫn đẹp. Có vài vết xước nhỏ ở lớp voan bên ngoài (không rõ lắm). Màu sắc vẫn tươi, không phai. Thun eo vẫn co giãn tốt.', 'Freesize', 'No Brand', 'Hoa pastel', 'Voan', 'TP.HCM', 'Quận 7', NULL, 'approved', NULL, 1, 120000.00, 432, 67, 0, 0, NULL, NULL, NULL, '2025-11-25 08:22:54', '2025-11-25 08:22:54', '2025-11-25 15:22:54', 1, NULL),
(4, 2, 11, 'Áo sơ mi trắng công sở nữ - Size S', 'ao-so-mi-trang-cong-so-nu-size-s', 'Áo sơ mi trắng form fitted sang trọng, rất thích hợp cho môi trường công sở chuyên nghiệp. Chất liệu kate mịn màng, không nhăn, không cần ủi nhiều. Thiết kế cổ vest thanh lịch, tay dài có manshit, eo ôm vừa vặn tôn dáng. Màu trắng tinh khôi, dễ phối với vest, chân váy hoặc quần tây. Đã mặc đi làm khoảng 5-6 lần, giặt ủi cẩn thận nên vẫn còn rất mới.', '{\"Co giãn\": \"Không\", \"Kiểu tay\": \"Tay dài có manshit\", \"Độ dày\": \"Vừa phải\", \"Kiểu cổ\": \"Cổ vest\", \"Xuất xứ\": \"Việt Nam\", \"Kiểu dáng\": \"Fitted, ôm eo\", \"Chất liệu\": \"Kate cao cấp\", \"Chiều dài áo\": \"58cm\"}', 120000.00, 280000.00, 'like-new', 'Còn 90% mới. Màu trắng tinh, không ố vàng. Cổ áo và manshit vẫn cứng đẹp. Không có vết bẩn, vết ố hay hư hỏng. Các đường may chắc chắn.', 'S', 'Thời Trang Việt', 'Trắng', 'Kate', 'TP.HCM', 'Quận 1', NULL, 'approved', NULL, 1, 100000.00, 189, 23, 0, 0, NULL, NULL, NULL, '2025-11-25 08:22:54', '2025-11-25 08:22:54', '2025-11-25 15:22:54', 1, NULL),
(5, 3, 15, 'Áo khoác jean nữ Zara - Size L', 'ao-khoac-jean-nu-zara-size-l', 'Áo khoác jean Zara hàng chính hãng từ Tây Ban Nha, màu xanh nhạt wash vintage rất trendy. Thiết kế basic oversize, form rộng thoải mái, dễ phối đồ từ style casual đến streetwear. Chất jean dày dặn, bền chắc, giữ form tốt. Có 2 túi ngực, 2 túi hông tiện dụng. Đã mặc một mùa đông, vẫn giữ màu và form rất đẹp, không bị phai màu, không rách.', '{\"Màu\": \"Light Blue Wash\", \"Co giãn\": \"Không\", \"Số túi\": \"4 túi (2 ngực, 2 hông)\", \"Độ dày\": \"Denim dày\", \"Xuất xứ\": \"Tây Ban Nha (Zara)\", \"Chiều dài\": \"65cm\", \"Kiểu dáng\": \"Oversize\", \"Chất liệu\": \"100% Cotton Denim\"}', 280000.00, 799000.00, 'good', 'Còn 85% mới. Màu xanh nhạt đẹp, không bị phai nhiều. Có vài dấu hiệu sử dụng nhẹ như nhăn tự nhiên ở khuỷu tay. Nút và khuy còn nguyên, đường may chắc chắn.', 'L', 'Zara', 'Xanh nhạt', 'Denim', 'TP.HCM', 'Quận 10', NULL, 'approved', NULL, 1, 250000.00, 678, 124, 0, 0, NULL, NULL, NULL, '2025-11-25 08:22:54', '2025-11-25 08:22:54', '2025-11-25 15:22:54', 1, NULL),
(6, 2, 16, 'Giày thể thao Nike Air Force 1 trắng - Size 42', 'giay-nike-air-force-1-trang-size-42', 'Giày Nike Air Force 1 Low chính hãng, màu trắng full white cổ điển - mẫu giày iconic của Nike. Chất liệu da thật cao cấp, mềm mại và bền bỉ. Đế giày Air cushioning êm ái, chống sốc tốt. Logo Swoosh thêu nổi sang trọng. Giày đã đi khoảng 2-3 tháng, vẫn còn rất đẹp và sạch sẽ. Da không bị nứt nẻ, đế không bị mòn nhiều.', '{\"Màu\": \"Triple White\", \"Xuất xứ\": \"Vietnam (Nike authorized)\", \"Công nghệ\": \"Air cushioning\", \"Loại đế\": \"Rubber sole\", \"Chất liệu\": \"Da thật cao cấp\", \"Chiều cao cổ\": \"Low top\", \"Trọng lượng\": \"~400g/chiếc\", \"Code sản phẩm\": \"315122-111\"}', 1200000.00, 2890000.00, 'like-new', 'Còn 90% mới. Da còn mịn màng, sạch sẽ. Có vài nếp nhăn nhẹ ở mũi giày (tự nhiên khi đi). Đế còn rất tốt, ít mòn. Logo và chữ in còn rõ nét.', '42', 'Nike', 'Trắng', 'Da thật', 'TP.HCM', 'Quận 5', NULL, 'approved', NULL, 1, 1100000.00, 892, 156, 0, 0, NULL, NULL, NULL, '2025-11-25 08:22:54', '2025-11-25 08:22:54', '2025-11-25 15:22:54', 1, NULL),
(7, 3, 20, 'Túi xách Charles & Keith màu đen', 'tui-xach-charles-keith-mau-den', 'Túi xách Charles & Keith chính hãng từ Singapore, màu đen basic dễ phối đồ. Chất liệu da PU cao cấp, bóng đẹp, không bong tróc. Thiết kế dáng chữ nhật thanh lịch, kích thước vừa phải, đựng được laptop 13 inch, sách vở, mỹ phẩm. Có dây đeo vai dài có thể tháo rời, đeo vai hoặc xách tay đều đẹp. Bên trong có 1 ngăn chính + 2 ngăn nhỏ tiện dụng.', '{\"Màu\": \"Đen\", \"Số ngăn\": \"1 ngăn chính + 2 ngăn phụ\", \"Xuất xứ\": \"Singapore (C&K)\", \"Kiểu khóa\": \"Khóa nam châm + khóa kéo\", \"Phụ kiện\": \"Dây đeo vai (có thể tháo)\", \"Chất liệu\": \"Da PU cao cấp\", \"Kích thước\": \"30cm x 25cm x 12cm\", \"Trọng lượng\": \"~500g\"}', 680000.00, 1590000.00, 'like-new', 'Còn 92% mới. Da vẫn bóng đẹp, không trầy xước nhiều. Khóa kéo và khóa nam châm hoạt động tốt. Lót bên trong sạch sẽ. Có vài vết nhăn nhẹ ở góc túi (tự nhiên khi sử dụng).', 'One size', 'Charles & Keith', 'Đen', 'Da PU', 'Hà Nội', 'Quận Hoàn Kiếm', NULL, 'approved', NULL, 1, 600000.00, 543, 98, 0, 0, NULL, NULL, NULL, '2025-11-25 08:22:54', '2025-11-25 08:22:54', '2025-11-25 15:22:54', 1, NULL),
(8, 7, 1, 'Luna', 'luna', 'Bla bla bla', '[]', 1000.00, 120000.00, 'new', '', '', 'Y&amp;amp;Y', 'Trắng', 'Cotton', 'TP.HCM', '', NULL, 'sold', NULL, 1, NULL, 0, 0, 0, 0, NULL, '[]', '[]', '2025-11-28 10:42:43', '2025-11-28 21:08:13', NULL, NULL, '2025-11-29 04:08:13'),
(9, 7, 1, 'Luna', 'luna-1', 'sasads asdadsa asdasdasdasd asdadsadsadas', NULL, 990000.00, NULL, 'new', NULL, '', 'Y&amp;Y', 'Trắng', 'Cotton', 'TP.HCM', '', NULL, 'deleted', NULL, 1, NULL, 0, 0, 0, 0, NULL, '[]', '[]', '2025-11-28 10:44:41', '2025-11-28 15:00:29', NULL, NULL, NULL),
(10, 7, 2, 'Luna', 'luna-2', 'adsadsada dsaasda adsadasd adad ad adaasdda sadas', NULL, 9990000.00, NULL, 'like-new', NULL, '', 'Y&amp;Y', 'Trắng', 'Cotton', 'TP.HCM', '', NULL, 'deleted', NULL, 1, NULL, 0, 0, 0, 0, NULL, '[]', '[]', '2025-11-28 10:47:13', '2025-11-28 14:59:48', NULL, NULL, NULL),
(11, 7, 4, 'Louis Vuitton Túi Đeo Chéo Nữ Louis Vuitton LV Pochette Métis East West M46914 Màu Kem', 'louis-vuitton-tui-eo-cheo-nu-louis-vuitton-lv-pochette-metis-east-west-m46914-mau-kem', 'Túi Đeo Chéo Nữ Louis Vuitton LV Pochette Métis East West M46914 Màu Kem là chiếc túi hiệu đến từ thương hiệu Louis Vuitton nổi tiếng. Túi mang kiểu dáng nhỏ nhắn, sang trọng với chất liệu cao cấp, được nhiều tín đồ yêu thích và săn đón.', NULL, 78000000.00, NULL, 'new', NULL, '', 'Louis Vuitton', 'Kem', 'Da cao cấp', 'TP.HCM', '', NULL, 'deleted', NULL, 1, NULL, 0, 0, 0, 0, NULL, '[]', '[]', '2025-11-28 15:03:26', '2025-11-28 20:38:41', NULL, NULL, NULL),
(12, 7, 20, 'Túi Đeo Chéo Nữ Louis Vuitton LV Pochette Métis East West M46914 Màu Kem', 'tui-eo-cheo-nu-louis-vuitton-lv-pochette-metis-east-west-m46914-mau-kem', 'Mô Tả Túi Đeo Chéo Nữ Louis Vuitton LV Pochette Métis East West M46914 Màu Kem\nTúi Đeo Chéo Nữ Louis Vuitton LV Pochette Métis East West M46914 Màu Kem được làm từ chất liệu da cao cấp siêu mềm mại, có độ bền cao trong quá trình sử dụng. Form túi chuẩn đẹp với mọi chi tiết tỉ mỉ, sắc nét. Sản phẩm là sự hòa trộn hoàn hảo giữa sự sang trọng, đẳng cấp trong chất liệu cùng sự tinh tế, đơn giản trong thiết kế. \n \nThiết kế túi kiểu dáng nhỏ nhắn với quai cấm phía trên bằng da đi kèm quai xách dạng chuỗi có thể tháo rời đi kèm dây đeo bằng da có thể điều chỉnh. Điểm nhấn phủ họa tiết logo LV đặc trưng và khóa kim loại tone màu vàng chạm nổi logo tạo nên nét hiện đại, bóng bẩy thể hiện đặc trưng đầy ấn tượng.   \n\nTúi có nắp gập đóng mở bên trong gồm hai ngăn chính lớn, ngăn khóa zip chính giữ, ngăn khóa phía sau với không gian khá rộng rãi, tiện lợi đựng những đồ dùng cá nhân cần thiết khi đi ra ngoài như: điện thoại, ví, son, thẻ...\n\nTúi Louis Vuitton LV Pochette Métis East West M46914 sở hữu gam màu hiện đại, thiết kế sang trọng, xinh xắn và hợp xu hướng, chắc hẳn sẽ là một món phụ kiện thời trang và vô cùng tiện lợi và sành điệu sử dụng hàng ngày, đi làm hay đi chơi.', '{\"Màu sắc\": \"Kem\", \"Phân loại\": \"Túi đeo chéo\", \"Chất liệu\": \"Da cao cấp\", \"Giới tính:\": \"Nữ\", \"Chiều cao (cm)\": \"13.5cm\", \"Chiều dài (cm)\": \"21.5cm\", \"Chiều rộng (cm)\": \"6cm\", \"Xuất xứ thương hiệu\": \"Pháp\"}', 78000000.00, 80000000.00, 'new', 'Sản phẩm chưa được sử dụng lần nào. Không có bất cứ chi tiết hư hỏng nào.', '', 'Louis Vuitton', 'Kem', 'Da cao cấp', 'TP.HCM', '', NULL, 'approved', NULL, 1, NULL, 0, 0, 0, 0, NULL, '[]', '[]', '2025-11-28 15:16:36', '2025-11-29 00:39:34', NULL, NULL, NULL),
(13, 7, 1, 'saasa', 'saasa', 'asass', '{\"sdada\": \"dasdsa\"}', 6555.00, 56565656.00, 'new', 'dsasd', '', 'aasas', 'dsda', 'dsadsd', 'TP.HCM', '', NULL, 'sold', NULL, 1, NULL, 0, 0, 0, 0, NULL, '[]', '[]', '2025-11-28 20:51:51', '2025-11-28 21:34:25', NULL, NULL, '2025-11-29 04:34:25'),
(14, 7, 1, 'sadsa', 'sadsa', 'dsads', '{\"dsd\": \"dsd\"}', 2233.00, 3233323.00, 'new', 'sdd', '', 'sdad', 'sd', 'dsds', 'TP.HCM', '', NULL, 'sold', NULL, 1, NULL, 0, 0, 0, 0, NULL, '[]', '[]', '2025-11-28 21:12:56', '2025-11-28 21:34:25', NULL, NULL, '2025-11-29 04:34:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_images`
--

CREATE TABLE `product_images` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `thumbnail_url`, `display_order`, `is_primary`, `created_at`) VALUES
(1, 1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', NULL, 0, 1, '2025-11-25 08:22:54'),
(2, 1, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800', NULL, 1, 0, '2025-11-25 08:22:54'),
(3, 1, 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800', NULL, 2, 0, '2025-11-25 08:22:54'),
(4, 1, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', NULL, 3, 0, '2025-11-25 08:22:54'),
(5, 2, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', NULL, 0, 1, '2025-11-25 08:22:54'),
(6, 2, 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800', NULL, 1, 0, '2025-11-25 08:22:54'),
(7, 2, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', NULL, 2, 0, '2025-11-25 08:22:54'),
(8, 2, 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800', NULL, 3, 0, '2025-11-25 08:22:54'),
(9, 3, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', NULL, 0, 1, '2025-11-25 08:22:54'),
(10, 3, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800', NULL, 1, 0, '2025-11-25 08:22:54'),
(11, 3, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', NULL, 2, 0, '2025-11-25 08:22:54'),
(12, 3, 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800', NULL, 3, 0, '2025-11-25 08:22:54'),
(13, 4, 'https://images.unsplash.com/photo-1603251579431-8041402bdeda?w=800', NULL, 0, 1, '2025-11-25 08:22:54'),
(14, 4, 'https://images.unsplash.com/photo-1624206112431-517f8af0b3cc?w=800', NULL, 1, 0, '2025-11-25 08:22:54'),
(15, 4, 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=800', NULL, 2, 0, '2025-11-25 08:22:54'),
(16, 4, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', NULL, 3, 0, '2025-11-25 08:22:54'),
(17, 5, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', NULL, 0, 1, '2025-11-25 08:22:54'),
(18, 5, 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800', NULL, 1, 0, '2025-11-25 08:22:54'),
(19, 5, 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=800', NULL, 2, 0, '2025-11-25 08:22:54'),
(20, 5, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', NULL, 3, 0, '2025-11-25 08:22:54'),
(21, 6, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', NULL, 0, 1, '2025-11-25 08:22:54'),
(22, 6, 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800', NULL, 1, 0, '2025-11-25 08:22:54'),
(23, 6, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', NULL, 2, 0, '2025-11-25 08:22:54'),
(24, 6, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800', NULL, 3, 0, '2025-11-25 08:22:54'),
(25, 7, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', NULL, 0, 1, '2025-11-25 08:22:54'),
(26, 7, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800', NULL, 1, 0, '2025-11-25 08:22:54'),
(27, 7, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', NULL, 2, 0, '2025-11-25 08:22:54'),
(28, 7, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800', NULL, 3, 0, '2025-11-25 08:22:54'),
(33, 9, '/uploads/products/product_1764326641_69297cf1b47aa_1764326641.webp', NULL, 0, 1, '2025-11-28 10:44:41'),
(34, 9, '/uploads/products/product_1764326644_69297cf4ad442_1764326644.jpg', NULL, 1, 0, '2025-11-28 10:44:41'),
(35, 9, '/uploads/products/product_1764326648_69297cf865a6d_1764326648.jpg', NULL, 2, 0, '2025-11-28 10:44:41'),
(36, 9, '/uploads/products/product_1764326651_69297cfb2aaba_1764326651.jpg', NULL, 3, 0, '2025-11-28 10:44:41'),
(37, 9, '/uploads/products/product_1764326655_69297cff41b33_1764326655.png', NULL, 4, 0, '2025-11-28 10:44:41'),
(38, 10, '/uploads/products/product_1764326795_69297d8b5cbf3_1764326795.jpg', NULL, 0, 1, '2025-11-28 10:47:13'),
(39, 10, '/uploads/products/product_1764326798_69297d8e1f16e_1764326798.jpg', NULL, 1, 0, '2025-11-28 10:47:13'),
(40, 10, '/uploads/products/product_1764326801_69297d914ad4a_1764326801.jpg', NULL, 2, 0, '2025-11-28 10:47:13'),
(41, 10, '/uploads/products/product_1764326803_69297d93b66e2_1764326803.webp', NULL, 3, 0, '2025-11-28 10:47:13'),
(42, 11, '/uploads/products/product_1764342090_6929b94a6c9e2_1764342090.png', NULL, 0, 1, '2025-11-28 15:03:26'),
(43, 11, '/uploads/products/product_1764342098_6929b9524997a_1764342098.png', NULL, 1, 0, '2025-11-28 15:03:26'),
(44, 11, '/uploads/products/product_1764342106_6929b95a3acab_1764342106.png', NULL, 2, 0, '2025-11-28 15:03:26'),
(45, 11, '/uploads/products/product_1764342111_6929b95ff1099_1764342111.png', NULL, 3, 0, '2025-11-28 15:03:26'),
(46, 11, '/uploads/products/product_1764342117_6929b9654af83_1764342117.png', NULL, 4, 0, '2025-11-28 15:03:26'),
(57, 8, '/uploads/products/product_1764326459_69297c3b9666b_1764326459.jpg', NULL, 0, 1, '2025-11-28 16:56:49'),
(58, 8, '/uploads/products/product_1764326462_69297c3ea12c9_1764326462.jpg', NULL, 1, 0, '2025-11-28 16:56:49'),
(59, 8, '/uploads/products/product_1764326467_69297c437d088_1764326467.jpg', NULL, 2, 0, '2025-11-28 16:56:49'),
(60, 8, '/uploads/products/product_1764326470_69297c4641351_1764326470.webp', NULL, 3, 0, '2025-11-28 16:56:49'),
(64, 13, '/uploads/products/product_1764363088_692a0b50bc880_1764363088.jpg', NULL, 0, 1, '2025-11-28 21:27:30'),
(65, 14, '/uploads/products/product_1764364280_692a0ff84699e_1764364280.jpg', NULL, 0, 1, '2025-11-28 21:27:34'),
(83, 12, '/uploads/products/product_1764342793_6929bc09619de_1764342793.png', NULL, 0, 1, '2025-11-29 00:39:34'),
(84, 12, '/uploads/products/product_1764342797_6929bc0d7ba5f_1764342797.png', NULL, 1, 0, '2025-11-29 00:39:34'),
(85, 12, '/uploads/products/product_1764342809_6929bc195a1d8_1764342809.png', NULL, 2, 0, '2025-11-29 00:39:34'),
(86, 12, '/uploads/products/product_1764342816_6929bc2031e83_1764342816.png', NULL, 3, 0, '2025-11-29 00:39:34'),
(87, 12, '/uploads/products/product_1764342821_6929bc25dd8a4_1764342821.png', NULL, 4, 0, '2025-11-29 00:39:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_tags`
--

CREATE TABLE `product_tags` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `tag` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_tags`
--

INSERT INTO `product_tags` (`id`, `product_id`, `tag`, `created_at`) VALUES
(1, 1, 'uniqlo', '2025-11-25 08:22:54'),
(2, 1, 'cotton', '2025-11-25 08:22:54'),
(3, 1, 'basic', '2025-11-25 08:22:54'),
(4, 2, 'levis', '2025-11-25 08:22:54'),
(5, 2, 'denim', '2025-11-25 08:22:54'),
(6, 2, 'slim-fit', '2025-11-25 08:22:54'),
(7, 3, 'vintage', '2025-11-25 08:22:54'),
(8, 3, 'korean-style', '2025-11-25 08:22:54'),
(9, 3, 'floral', '2025-11-25 08:22:54'),
(10, 4, 'office', '2025-11-25 08:22:54'),
(11, 4, 'formal', '2025-11-25 08:22:54'),
(12, 5, 'zara', '2025-11-25 08:22:54'),
(13, 5, 'denim-jacket', '2025-11-25 08:22:54'),
(14, 5, 'oversized', '2025-11-25 08:22:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_views`
--

CREATE TABLE `product_views` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `product_id` int NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `viewed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `is_revoked` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reports`
--

CREATE TABLE `reports` (
  `id` int NOT NULL,
  `reporter_id` int NOT NULL,
  `reported_type` enum('product','user','review') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reported_id` int NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `evidence_images` json DEFAULT NULL,
  `status` enum('pending','investigating','resolved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `resolution` text COLLATE utf8mb4_unicode_ci,
  `resolved_by` int DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `reviewer_id` int NOT NULL,
  `reviewed_user_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `images` json DEFAULT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `session_logs`
--

CREATE TABLE `session_logs` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `action` enum('login','logout','refresh','expired','revoked') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `device_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `success` tinyint(1) DEFAULT '1',
  `error_message` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `settings`
--

CREATE TABLE `settings` (
  `id` int NOT NULL,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `settings`
--

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `description`, `updated_at`) VALUES
(1, 'site_name', 'SecondStyle', 'Tên website', '2025-11-25 08:22:54'),
(2, 'site_description', 'Chợ đồ cũ - Mua bán quần áo second-hand uy tín', 'Mô tả website', '2025-11-25 08:22:54'),
(3, 'admin_email', 'admin@secondstyle.vn', 'Email admin', '2025-11-25 08:22:54'),
(4, 'products_require_approval', '1', 'Sản phẩm cần duyệt (1=yes, 0=no)', '2025-11-25 08:22:54'),
(5, 'max_images_per_product', '6', 'Số lượng ảnh tối đa cho 1 sản phẩm', '2025-11-25 08:22:54'),
(6, 'commission_rate', '5', 'Tỷ lệ hoa hồng (%)', '2025-11-25 08:22:54'),
(7, 'featured_product_price', '50000', 'Giá để sản phẩm nổi bật (VNĐ)', '2025-11-25 08:22:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `transaction_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_gateway` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('pending','success','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `gateway_response` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('buyer','seller','admin','moderator') COLLATE utf8mb4_unicode_ci DEFAULT 'buyer',
  `status` enum('active','suspended','deleted') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `email_verified` tinyint(1) DEFAULT '0',
  `phone_verified` tinyint(1) DEFAULT '0',
  `verification_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_password_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_password_expires` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `avatar`, `address`, `city`, `district`, `role`, `status`, `email_verified`, `phone_verified`, `verification_token`, `reset_password_token`, `reset_password_expires`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin@secondstyle.vn', '$2y$12$O/XE6SC6m.n3sqcnBk9fbOS2uBm7t0eyjNhDsy4NPvbhyhrilK9Fy', 'Admin System', '0901234567', NULL, NULL, NULL, NULL, 'admin', 'active', 1, 0, NULL, NULL, NULL, '2025-11-29 05:59:13', '2025-11-25 08:22:54', '2025-11-28 22:59:13'),
(2, 'seller1@example.com', '$2y$12$LQv3c1yycEn.h8yO3W5Y8OeYIrvGJK5CqGJvX7TqPq5S5V5Vfv5K6', 'Nguyễn Văn A', '0912345678', NULL, NULL, NULL, NULL, 'seller', 'active', 1, 0, NULL, NULL, NULL, NULL, '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(3, 'seller2@example.com', '$2y$12$LQv3c1yycEn.h8yO3W5Y8OeYIrvGJK5CqGJvX7TqPq5S5V5Vfv5K6', 'Trần Thị B', '0923456789', NULL, NULL, NULL, NULL, 'seller', 'active', 1, 0, NULL, NULL, NULL, NULL, '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(4, 'buyer1@example.com', '$2y$12$LQv3c1yycEn.h8yO3W5Y8OeYIrvGJK5CqGJvX7TqPq5S5V5Vfv5K6', 'Lê Văn C', '0934567890', NULL, NULL, NULL, NULL, 'buyer', 'active', 1, 0, NULL, NULL, NULL, NULL, '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(5, 'buyer2@example.com', '$2y$12$LQv3c1yycEn.h8yO3W5Y8OeYIrvGJK5CqGJvX7TqPq5S5V5Vfv5K6', 'Phạm Thị D', '0945678901', NULL, NULL, NULL, NULL, 'buyer', 'active', 1, 0, NULL, NULL, NULL, NULL, '2025-11-25 08:22:54', '2025-11-25 08:22:54'),
(6, 'nguyena@gmail.com', '$2y$12$K7n/jsgInN9Duyo1EZzv4ughx6T4Fb.SrXyda0c5Ph0JzcfzsgdHK', 'Nguyễn Văn A', '2313232', '/uploads/avatars/avatar_6_69259bdf83e3d_1764072415.jpg', NULL, NULL, NULL, 'buyer', 'active', 0, 0, '4dc0a8e16490c06891e317e86c842ab4911a2f32da5709843e6b24e9eabfa985', NULL, NULL, '2025-11-29 07:16:41', '2025-11-25 09:04:07', '2025-11-29 00:16:41'),
(7, 'nguyenvane@gmail.com', '$2y$12$jTh4c6FOZTBmmCAPLDIhouPv7YVsXz7VFqgRF113yJzH3iSzPTetO', 'Nguyễn Văn E', '123456781', '/uploads/avatars/avatar_7_692975ac85e47_1764324780.png', NULL, NULL, NULL, 'seller', 'active', 0, 0, '0c0c8239be7061d6fb60cc39747f36490f4296850f0e60399f80995c94c6978e', NULL, NULL, '2025-11-29 07:23:21', '2025-11-28 10:12:39', '2025-11-29 00:23:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `session_token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_type` enum('desktop','mobile','tablet') COLLATE utf8mb4_unicode_ci DEFAULT 'desktop',
  `browser` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_activity` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_created` (`created_at`);

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart_item` (`user_id`,`product_id`,`size`,`color`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_status` (`status`);

--
-- Chỉ mục cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_favorite` (`user_id`,`product_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Chỉ mục cho bảng `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_thread` (`thread_id`),
  ADD KEY `idx_sender` (`sender_id`),
  ADD KEY `idx_receiver` (`receiver_id`),
  ADD KEY `idx_created` (`created_at`);

--
-- Chỉ mục cho bảng `message_threads`
--
ALTER TABLE `message_threads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_thread` (`user1_id`,`user2_id`,`product_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_user1` (`user1_id`),
  ADD KEY `idx_user2` (`user2_id`);

--
-- Chỉ mục cho bảng `momo_payments`
--
ALTER TABLE `momo_payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_is_read` (`is_read`),
  ADD KEY `idx_created` (`created_at`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_code` (`order_code`),
  ADD KEY `cancelled_by` (`cancelled_by`),
  ADD KEY `idx_buyer` (`buyer_id`),
  ADD KEY `idx_seller` (`seller_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_order_code` (`order_code`),
  ADD KEY `idx_created` (`created_at`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order` (`order_id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Chỉ mục cho bảng `price_negotiations`
--
ALTER TABLE `price_negotiations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `thread_id` (`thread_id`),
  ADD KEY `idx_product` (`product_id`),
  ADD KEY `idx_buyer` (`buyer_id`),
  ADD KEY `idx_seller` (`seller_id`),
  ADD KEY `idx_status` (`status`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `idx_seller` (`seller_id`),
  ADD KEY `idx_category` (`category_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_price` (`price`),
  ADD KEY `idx_created` (`created_at`);
ALTER TABLE `products` ADD FULLTEXT KEY `idx_search` (`title`,`description`);

--
-- Chỉ mục cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Chỉ mục cho bảng `product_tags`
--
ALTER TABLE `product_tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product` (`product_id`),
  ADD KEY `idx_tag` (`tag`);

--
-- Chỉ mục cho bảng `product_views`
--
ALTER TABLE `product_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_product` (`product_id`),
  ADD KEY `idx_viewed` (`viewed_at`);

--
-- Chỉ mục cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_expires_at` (`expires_at`);

--
-- Chỉ mục cho bảng `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `resolved_by` (`resolved_by`),
  ADD KEY `idx_reporter` (`reporter_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_reported` (`reported_type`,`reported_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `idx_product` (`product_id`),
  ADD KEY `idx_reviewer` (`reviewer_id`),
  ADD KEY `idx_reviewed_user` (`reviewed_user_id`);

--
-- Chỉ mục cho bảng `session_logs`
--
ALTER TABLE `session_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Chỉ mục cho bảng `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Chỉ mục cho bảng `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_code` (`transaction_code`),
  ADD KEY `idx_order` (`order_id`),
  ADD KEY `idx_transaction_code` (`transaction_code`),
  ADD KEY `idx_status` (`status`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_role` (`role`);

--
-- Chỉ mục cho bảng `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_session_token` (`session_token`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `message_threads`
--
ALTER TABLE `message_threads`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `momo_payments`
--
ALTER TABLE `momo_payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `price_negotiations`
--
ALTER TABLE `price_negotiations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT cho bảng `product_tags`
--
ALTER TABLE `product_tags`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `product_views`
--
ALTER TABLE `product_views`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `session_logs`
--
ALTER TABLE `session_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `message_threads` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `message_threads`
--
ALTER TABLE `message_threads`
  ADD CONSTRAINT `message_threads_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_threads_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_threads_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`cancelled_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT;

--
-- Ràng buộc cho bảng `price_negotiations`
--
ALTER TABLE `price_negotiations`
  ADD CONSTRAINT `price_negotiations_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `price_negotiations_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `price_negotiations_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `price_negotiations_ibfk_4` FOREIGN KEY (`thread_id`) REFERENCES `message_threads` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `product_tags`
--
ALTER TABLE `product_tags`
  ADD CONSTRAINT `product_tags_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `product_views`
--
ALTER TABLE `product_views`
  ADD CONSTRAINT `product_views_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `product_views_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`reviewed_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `session_logs`
--
ALTER TABLE `session_logs`
  ADD CONSTRAINT `session_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
