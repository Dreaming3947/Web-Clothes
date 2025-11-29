<?php
/**
 * Orders API
 * Xử lý các API liên quan đến đơn hàng
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
require_once __DIR__ . '/../utils/Validation.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$currentUser = Auth::requireAuth();

// ============================================
// GET - Lấy danh sách đơn hàng
// ============================================
if ($method === 'GET' && !isset($_GET['id'])) {
    $userId = $currentUser['user_id'];
    $role = $currentUser['role'];
    
    // Build query based on role
    if ($role === 'admin') {
        $query = "SELECT o.*, 
                         buyer.full_name as buyer_name, buyer.phone as buyer_phone,
                         seller.full_name as seller_name
                  FROM orders o
                  LEFT JOIN users buyer ON o.buyer_id = buyer.id
                  LEFT JOIN users seller ON o.seller_id = seller.id
                  ORDER BY o.created_at DESC";
        $stmt = $db->prepare($query);
    } else {
        // Filter by buyer or seller
        $filterType = $_GET['type'] ?? 'buyer'; // 'buyer' or 'seller'
        
        if ($filterType === 'seller') {
            $query = "SELECT o.*, 
                             buyer.full_name as buyer_name, buyer.phone as buyer_phone
                      FROM orders o
                      LEFT JOIN users buyer ON o.buyer_id = buyer.id
                      WHERE o.seller_id = :user_id
                      ORDER BY o.created_at DESC";
        } else {
            $query = "SELECT o.*, 
                             seller.full_name as seller_name, seller.phone as seller_phone
                      FROM orders o
                      LEFT JOIN users seller ON o.seller_id = seller.id
                      WHERE o.buyer_id = :user_id
                      ORDER BY o.created_at DESC";
        }
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
    }
    
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get order items for each order
    foreach ($orders as &$order) {
        $itemsQuery = "SELECT oi.*, p.title, p.status as product_status,
                              (SELECT image_url FROM product_images WHERE product_id = oi.product_id ORDER BY is_primary DESC LIMIT 1) as image
                       FROM order_items oi
                       LEFT JOIN products p ON oi.product_id = p.id
                       WHERE oi.order_id = :order_id";
        $itemsStmt = $db->prepare($itemsQuery);
        $itemsStmt->bindParam(':order_id', $order['id']);
        $itemsStmt->execute();
        $order['items'] = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    Response::success('Lấy danh sách đơn hàng thành công', $orders);
}

// ============================================
// GET - Lấy chi tiết đơn hàng
// ============================================
else if ($method === 'GET' && isset($_GET['id'])) {
    $orderId = (int)$_GET['id'];
    
    $query = "SELECT o.*, 
                     buyer.full_name as buyer_name, buyer.phone as buyer_phone, buyer.email as buyer_email,
                     seller.full_name as seller_name, seller.phone as seller_phone, seller.email as seller_email
              FROM orders o
              LEFT JOIN users buyer ON o.buyer_id = buyer.id
              LEFT JOIN users seller ON o.seller_id = seller.id
              WHERE o.id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $orderId);
    $stmt->execute();
    
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        Response::notFound('Không tìm thấy đơn hàng');
    }
    
    // Check permission
    $userId = $currentUser['user_id'];
    $role = $currentUser['role'];
    if ($role !== 'admin' && $order['buyer_id'] != $userId && $order['seller_id'] != $userId) {
        Response::forbidden('Bạn không có quyền xem đơn hàng này');
    }
    
    // Get order items
    $itemsQuery = "SELECT oi.*, p.title, p.status as product_status,
                          (SELECT image_url FROM product_images WHERE product_id = oi.product_id ORDER BY is_primary DESC LIMIT 1) as image
                   FROM order_items oi
                   LEFT JOIN products p ON oi.product_id = p.id
                   WHERE oi.order_id = :order_id";
    $itemsStmt = $db->prepare($itemsQuery);
    $itemsStmt->bindParam(':order_id', $orderId);
    $itemsStmt->execute();
    $order['items'] = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    Response::success('Lấy chi tiết đơn hàng thành công', $order);
}

// ============================================
// POST - Tạo đơn hàng mới
// ============================================
else if ($method === 'POST') {
    $request = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($request['items']) || empty($request['items'])) {
        Response::error('Giỏ hàng trống', null, 400);
    }
    
    if (!isset($request['shipping_name']) || !isset($request['shipping_phone']) || !isset($request['shipping_address'])) {
        Response::error('Thiếu thông tin giao hàng', null, 400);
    }
    
    try {
        $db->beginTransaction();
        
        $buyerId = $currentUser['user_id'];
        $items = $request['items'];
        
        // Group items by seller
        $ordersBySeller = [];
        foreach ($items as $item) {
            $sellerId = $item['seller_id'];
            if (!isset($ordersBySeller[$sellerId])) {
                $ordersBySeller[$sellerId] = [];
            }
            $ordersBySeller[$sellerId][] = $item;
        }
        
        $createdOrders = [];
        
        // Create separate order for each seller
        foreach ($ordersBySeller as $sellerId => $sellerItems) {
            // Calculate totals
            $totalAmount = 0;
            foreach ($sellerItems as $item) {
                $totalAmount += $item['price'] * $item['quantity'];
            }
            
            $shippingFee = $request['shipping_fee'] ?? 30000;
            $discountAmount = $request['discount_amount'] ?? 0;
            $finalAmount = $totalAmount + $shippingFee - $discountAmount;
            
            // Generate order code
            $orderCode = 'ORD' . date('Ymd') . strtoupper(substr(uniqid(), -6));
            
            // Insert order
            $orderQuery = "INSERT INTO orders 
                          (order_code, buyer_id, seller_id, total_amount, shipping_fee, discount_amount, final_amount,
                           payment_method, payment_status, shipping_method, shipping_name, shipping_phone, 
                           shipping_address, shipping_city, shipping_district, shipping_note, status)
                          VALUES 
                          (:order_code, :buyer_id, :seller_id, :total_amount, :shipping_fee, :discount_amount, :final_amount,
                           :payment_method, :payment_status, :shipping_method, :shipping_name, :shipping_phone,
                           :shipping_address, :shipping_city, :shipping_district, :shipping_note, :status)";
            
            $orderStmt = $db->prepare($orderQuery);
            $orderStmt->bindParam(':order_code', $orderCode);
            $orderStmt->bindParam(':buyer_id', $buyerId);
            $orderStmt->bindParam(':seller_id', $sellerId);
            $orderStmt->bindParam(':total_amount', $totalAmount);
            $orderStmt->bindParam(':shipping_fee', $shippingFee);
            $orderStmt->bindParam(':discount_amount', $discountAmount);
            $orderStmt->bindParam(':final_amount', $finalAmount);
            
            $paymentMethod = $request['payment_method'] ?? 'cod';
            $orderStmt->bindParam(':payment_method', $paymentMethod);
            
            $paymentStatus = ($paymentMethod === 'cod') ? 'unpaid' : 'paid';
            $orderStmt->bindParam(':payment_status', $paymentStatus);
            
            $shippingMethod = $request['shipping_method'] ?? 'standard';
            $orderStmt->bindParam(':shipping_method', $shippingMethod);
            $orderStmt->bindParam(':shipping_name', $request['shipping_name']);
            $orderStmt->bindParam(':shipping_phone', $request['shipping_phone']);
            $orderStmt->bindParam(':shipping_address', $request['shipping_address']);
            
            $shippingCity = $request['shipping_city'] ?? '';
            $orderStmt->bindParam(':shipping_city', $shippingCity);
            
            $shippingDistrict = $request['shipping_district'] ?? '';
            $orderStmt->bindParam(':shipping_district', $shippingDistrict);
            
            $shippingNote = $request['shipping_note'] ?? '';
            $orderStmt->bindParam(':shipping_note', $shippingNote);
            
            $status = 'pending';
            $orderStmt->bindParam(':status', $status);
            
            $orderStmt->execute();
            $orderId = $db->lastInsertId();
            
            // Insert order items
            $itemQuery = "INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
                         VALUES (:order_id, :product_id, :product_name, :product_price, :quantity, :subtotal)";
            $itemStmt = $db->prepare($itemQuery);
            
            foreach ($sellerItems as $item) {
                $subtotal = $item['price'] * $item['quantity'];
                
                $itemStmt->bindParam(':order_id', $orderId);
                $itemStmt->bindParam(':product_id', $item['product_id']);
                $itemStmt->bindParam(':product_name', $item['name']);
                $itemStmt->bindParam(':product_price', $item['price']);
                $itemStmt->bindParam(':quantity', $item['quantity']);
                $itemStmt->bindParam(':subtotal', $subtotal);
                $itemStmt->execute();
                
                // Update product status to sold if quantity is 1 (second-hand items)
                $updateProduct = "UPDATE products SET status = 'sold', sold_at = NOW() WHERE id = :product_id";
                $updateStmt = $db->prepare($updateProduct);
                $updateStmt->bindParam(':product_id', $item['product_id']);
                $updateStmt->execute();
            }
            
            $createdOrders[] = [
                'id' => $orderId,
                'order_code' => $orderCode,
                'seller_id' => $sellerId,
                'total' => $finalAmount
            ];
        }
        
        // Clear cart after successful order
        $clearCart = "DELETE FROM cart_items WHERE user_id = :user_id";
        $clearStmt = $db->prepare($clearCart);
        $clearStmt->bindParam(':user_id', $buyerId);
        $clearStmt->execute();
        
        $db->commit();
        
        Response::success('Đặt hàng thành công', [
            'orders' => $createdOrders
        ], 201);
        
    } catch (Exception $e) {
        $db->rollBack();
        error_log('Order creation error: ' . $e->getMessage());
        Response::error('Không thể tạo đơn hàng: ' . $e->getMessage(), null, 500);
    }
}

// ============================================
// PUT - Cập nhật trạng thái đơn hàng
// ============================================
else if ($method === 'PUT' && isset($_GET['id'])) {
    $orderId = (int)$_GET['id'];
    $request = json_decode(file_get_contents('php://input'), true);
    
    // Get order
    $query = "SELECT * FROM orders WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $orderId);
    $stmt->execute();
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        Response::notFound('Không tìm thấy đơn hàng');
    }
    
    // Check permission
    $userId = $currentUser['user_id'];
    $role = $currentUser['role'];
    if ($role !== 'admin' && $order['seller_id'] != $userId) {
        Response::forbidden('Bạn không có quyền cập nhật đơn hàng này');
    }
    
    // Update order
    if (isset($request['status'])) {
        $updateQuery = "UPDATE orders SET status = :status, updated_at = NOW() WHERE id = :id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':status', $request['status']);
        $updateStmt->bindParam(':id', $orderId);
        $updateStmt->execute();
    }
    
    Response::success('Cập nhật đơn hàng thành công');
}

else {
    Response::error('Method not allowed', null, 405);
}
