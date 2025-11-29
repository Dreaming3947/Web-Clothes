<?php
/**
 * Cart API
 * Xử lý các API liên quan đến giỏ hàng
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Auth.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$currentUser = Auth::requireAuth();

// ============================================
// GET - Lấy giỏ hàng của user
// ============================================
if ($method === 'GET') {
    $query = "SELECT 
                ci.id,
                ci.product_id,
                ci.quantity,
                ci.size,
                ci.color,
                p.title as name,
                p.price,
                p.seller_id,
                (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) as image,
                p.status as product_status
              FROM cart_items ci
              INNER JOIN products p ON ci.product_id = p.id
              WHERE ci.user_id = :user_id
              ORDER BY ci.created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $currentUser['user_id']);
    $stmt->execute();

    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Filter out products that are no longer available
    $validItems = array_filter($items, function($item) {
        return in_array($item['product_status'], ['approved', 'pending']);
    });

    Response::success('Lấy giỏ hàng thành công', array_values($validItems));
}

// ============================================
// POST - Thêm sản phẩm vào giỏ hàng
// ============================================
else if ($method === 'POST') {
    $request = json_decode(file_get_contents('php://input'), true);

    if (!isset($request['product_id'])) {
        Response::error('Thiếu thông tin sản phẩm', null, 400);
    }

    $productId = (int)$request['product_id'];
    $quantity = isset($request['quantity']) ? (int)$request['quantity'] : 1;
    $size = $request['size'] ?? null;
    $color = $request['color'] ?? null;

    // Check if product exists and is available
    $checkQuery = "SELECT id, seller_id, status FROM products WHERE id = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $productId);
    $checkStmt->execute();
    $product = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        Response::notFound('Không tìm thấy sản phẩm');
    }

    if ($product['status'] === 'sold') {
        Response::error('Sản phẩm đã được bán', null, 400);
    }

    if ($product['seller_id'] == $currentUser['user_id']) {
        Response::error('Không thể thêm sản phẩm của chính bạn vào giỏ hàng', null, 400);
    }

    // Check if item already exists in cart
    $query = "SELECT id, quantity FROM cart_items 
              WHERE user_id = :user_id AND product_id = :product_id";
    
    // Add size condition if provided
    if ($size !== null) {
        $query .= " AND size = :size";
    } else {
        $query .= " AND size IS NULL";
    }
    
    // Add color condition if provided
    if ($color !== null) {
        $query .= " AND color = :color";
    } else {
        $query .= " AND color IS NULL";
    }
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $currentUser['user_id']);
    $stmt->bindParam(':product_id', $productId);
    
    if ($size !== null) {
        $stmt->bindParam(':size', $size);
    }
    if ($color !== null) {
        $stmt->bindParam(':color', $color);
    }
    
    $stmt->execute();

    $existingItem = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingItem) {
        // Update quantity
        $newQuantity = $existingItem['quantity'] + $quantity;
        $updateQuery = "UPDATE cart_items SET quantity = :quantity, updated_at = NOW() WHERE id = :id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':quantity', $newQuantity);
        $updateStmt->bindParam(':id', $existingItem['id']);
        $updateStmt->execute();

        Response::success('Đã cập nhật số lượng trong giỏ hàng', ['id' => $existingItem['id']]);
    } else {
        // Insert new item
        $insertQuery = "INSERT INTO cart_items (user_id, product_id, quantity, size, color) 
                        VALUES (:user_id, :product_id, :quantity, :size, :color)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(':user_id', $currentUser['user_id']);
        $insertStmt->bindParam(':product_id', $productId);
        $insertStmt->bindParam(':quantity', $quantity);
        $insertStmt->bindParam(':size', $size);
        $insertStmt->bindParam(':color', $color);
        $insertStmt->execute();

        Response::success('Đã thêm vào giỏ hàng', ['id' => $db->lastInsertId()], 201);
    }
}

// ============================================
// PUT - Cập nhật số lượng
// ============================================
else if ($method === 'PUT' && isset($_GET['id'])) {
    $cartItemId = (int)$_GET['id'];
    $request = json_decode(file_get_contents('php://input'), true);

    if (!isset($request['quantity'])) {
        Response::error('Thiếu thông tin số lượng', null, 400);
    }

    $quantity = (int)$request['quantity'];

    if ($quantity <= 0) {
        Response::error('Số lượng phải lớn hơn 0', null, 400);
    }

    // Check ownership
    $checkQuery = "SELECT id FROM cart_items WHERE id = :id AND user_id = :user_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $cartItemId);
    $checkStmt->bindParam(':user_id', $currentUser['user_id']);
    $checkStmt->execute();

    if (!$checkStmt->fetch()) {
        Response::notFound('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    // Update quantity
    $updateQuery = "UPDATE cart_items SET quantity = :quantity, updated_at = NOW() WHERE id = :id";
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->bindParam(':quantity', $quantity);
    $updateStmt->bindParam(':id', $cartItemId);
    
    if ($updateStmt->execute()) {
        Response::success('Đã cập nhật số lượng');
    } else {
        Response::serverError();
    }
}

// ============================================
// DELETE - Xóa sản phẩm khỏi giỏ hàng
// ============================================
else if ($method === 'DELETE' && isset($_GET['id'])) {
    $cartItemId = (int)$_GET['id'];

    // Check ownership
    $checkQuery = "SELECT id FROM cart_items WHERE id = :id AND user_id = :user_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $cartItemId);
    $checkStmt->bindParam(':user_id', $currentUser['user_id']);
    $checkStmt->execute();

    if (!$checkStmt->fetch()) {
        Response::notFound('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    // Delete item
    $deleteQuery = "DELETE FROM cart_items WHERE id = :id";
    $deleteStmt = $db->prepare($deleteQuery);
    $deleteStmt->bindParam(':id', $cartItemId);
    
    if ($deleteStmt->execute()) {
        Response::success('Đã xóa khỏi giỏ hàng');
    } else {
        Response::serverError();
    }
}

// ============================================
// DELETE - Xóa toàn bộ giỏ hàng
// ============================================
else if ($method === 'DELETE' && !isset($_GET['id'])) {
    $deleteQuery = "DELETE FROM cart_items WHERE user_id = :user_id";
    $deleteStmt = $db->prepare($deleteQuery);
    $deleteStmt->bindParam(':user_id', $currentUser['user_id']);
    
    if ($deleteStmt->execute()) {
        Response::success('Đã xóa toàn bộ giỏ hàng');
    } else {
        Response::serverError();
    }
}

else {
    Response::error('Method not allowed', null, 405);
}
