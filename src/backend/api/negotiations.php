<?php
/**
 * Price Negotiations API
 * Xử lý các API liên quan đến thương lượng giá
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
require_once __DIR__ . '/../config/constants.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validation.php';
require_once __DIR__ . '/../utils/Auth.php';

$database = new Database();
$db = $database->getConnection();
$validator = new Validation();

$method = $_SERVER['REQUEST_METHOD'];

// ============================================
// POST - Tạo đề xuất giá mới
// ============================================
if ($method === 'POST' && !isset($_GET['id'])) {
    $user = Auth::validateToken();
    
    if (!$user || $user['role'] !== 'buyer') {
        Response::unauthorized('Chỉ người mua mới có thể đề xuất giá');
    }

    $data = json_decode(file_get_contents('php://input'), true);

    $errors = [];
    if (empty($data['product_id'])) {
        $errors['product_id'] = 'Vui lòng chọn sản phẩm';
    }
    if (empty($data['offered_price']) || $data['offered_price'] <= 0) {
        $errors['offered_price'] = 'Giá đề xuất không hợp lệ';
    }

    if (!empty($errors)) {
        Response::badRequest('Dữ liệu không hợp lệ', $errors);
    }

    // Kiểm tra sản phẩm
    $stmt = $db->prepare("
        SELECT id, seller_id, price, allow_negotiation, min_acceptable_price, status 
        FROM products 
        WHERE id = ? AND status = 'approved'
    ");
    $stmt->execute([$data['product_id']]);
    $product = $stmt->fetch();

    if (!$product) {
        Response::notFound('Sản phẩm không tồn tại hoặc chưa được duyệt');
    }

    if (!$product['allow_negotiation']) {
        Response::badRequest('Sản phẩm này không cho phép thương lượng giá');
    }

    if ($product['seller_id'] == $user['id']) {
        Response::badRequest('Bạn không thể thương lượng sản phẩm của chính mình');
    }

    // Kiểm tra giá đề xuất có hợp lý không
    if ($data['offered_price'] >= $product['price']) {
        Response::badRequest('Giá đề xuất phải thấp hơn giá bán hiện tại');
    }

    if ($product['min_acceptable_price'] && $data['offered_price'] < $product['min_acceptable_price'] * 0.8) {
        Response::badRequest('Giá đề xuất quá thấp so với mong muốn của người bán');
    }

    // Tạo hoặc lấy message thread
    $stmt = $db->prepare("
        SELECT id FROM message_threads 
        WHERE (user1_id = ? AND user2_id = ?) 
           OR (user1_id = ? AND user2_id = ?)
        AND product_id = ?
        LIMIT 1
    ");
    $stmt->execute([
        $user['id'], $product['seller_id'],
        $product['seller_id'], $user['id'],
        $data['product_id']
    ]);
    $thread = $stmt->fetch();

    if (!$thread) {
        // Tạo thread mới
        $stmt = $db->prepare("
            INSERT INTO message_threads (user1_id, user2_id, product_id)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$user['id'], $product['seller_id'], $data['product_id']]);
        $thread_id = $db->lastInsertId();
    } else {
        $thread_id = $thread['id'];
    }

    // Tạo negotiation
    try {
        $db->beginTransaction();

        $stmt = $db->prepare("
            INSERT INTO price_negotiations 
            (product_id, buyer_id, seller_id, thread_id, offered_price, message, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
        ");
        $stmt->execute([
            $data['product_id'],
            $user['id'],
            $product['seller_id'],
            $thread_id,
            $data['offered_price'],
            $data['message'] ?? null
        ]);
        $negotiation_id = $db->lastInsertId();

        // Thêm tin nhắn vào thread
        $message_text = sprintf(
            "💰 Đề xuất giá: %s₫\n%s",
            number_format($data['offered_price'], 0, ',', '.'),
            $data['message'] ?? ''
        );

        $stmt = $db->prepare("
            INSERT INTO messages 
            (thread_id, sender_id, receiver_id, message, message_type, price_offer)
            VALUES (?, ?, ?, ?, 'price_offer', ?)
        ");
        $stmt->execute([
            $thread_id,
            $user['id'],
            $product['seller_id'],
            $message_text,
            $data['offered_price']
        ]);

        // Cập nhật last_message_at
        $stmt = $db->prepare("UPDATE message_threads SET last_message_at = NOW() WHERE id = ?");
        $stmt->execute([$thread_id]);

        // Tạo notification cho seller
        $stmt = $db->prepare("
            INSERT INTO notifications (user_id, type, title, message, link)
            VALUES (?, 'price_offer', 'Đề xuất giá mới', ?, ?)
        ");
        $stmt->execute([
            $product['seller_id'],
            sprintf('Có người đề xuất giá %s₫ cho sản phẩm của bạn', number_format($data['offered_price'], 0, ',', '.')),
            "/messages/{$thread_id}"
        ]);

        $db->commit();

        Response::created([
            'id' => $negotiation_id,
            'thread_id' => $thread_id
        ], 'Đã gửi đề xuất giá thành công');

    } catch (Exception $e) {
        $db->rollBack();
        Response::error('Không thể tạo đề xuất giá: ' . $e->getMessage());
    }
}

// ============================================
// PUT - Phản hồi đề xuất giá (accept/reject/counter)
// ============================================
if ($method === 'PUT' && isset($_GET['id'])) {
    $user = Auth::validateToken();
    
    if (!$user || $user['role'] !== 'seller') {
        Response::unauthorized('Chỉ người bán mới có thể phản hồi đề xuất');
    }

    $negotiation_id = (int)$_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);

    $action = $data['action'] ?? ''; // 'accept', 'reject', 'counter'

    if (!in_array($action, ['accept', 'reject', 'counter'])) {
        Response::badRequest('Hành động không hợp lệ');
    }

    // Lấy thông tin negotiation
    $stmt = $db->prepare("
        SELECT n.*, p.title as product_title, p.price as product_price
        FROM price_negotiations n
        JOIN products p ON n.product_id = p.id
        WHERE n.id = ? AND n.seller_id = ?
    ");
    $stmt->execute([$negotiation_id, $user['id']]);
    $negotiation = $stmt->fetch();

    if (!$negotiation) {
        Response::notFound('Không tìm thấy đề xuất giá');
    }

    if ($negotiation['status'] !== 'pending') {
        Response::badRequest('Đề xuất này đã được xử lý');
    }

    try {
        $db->beginTransaction();

        if ($action === 'accept') {
            // Chấp nhận giá
            $stmt = $db->prepare("
                UPDATE price_negotiations 
                SET status = 'accepted', responded_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([$negotiation_id]);

            // Cập nhật giá sản phẩm
            $stmt = $db->prepare("
                UPDATE products 
                SET price = ?
                WHERE id = ?
            ");
            $stmt->execute([$negotiation['offered_price'], $negotiation['product_id']]);

            $message = "✅ Người bán đã chấp nhận giá của bạn! Sản phẩm hiện có giá " . 
                       number_format($negotiation['offered_price'], 0, ',', '.') . "₫";

            $notif_msg = 'Đề xuất giá của bạn đã được chấp nhận!';

        } elseif ($action === 'reject') {
            // Từ chối
            $stmt = $db->prepare("
                UPDATE price_negotiations 
                SET status = 'rejected', responded_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([$negotiation_id]);

            $message = "❌ Người bán đã từ chối đề xuất giá của bạn.\n" . 
                       ($data['message'] ?? '');

            $notif_msg = 'Đề xuất giá của bạn đã bị từ chối';

        } else {
            // Counter offer
            if (empty($data['counter_price']) || $data['counter_price'] <= 0) {
                Response::badRequest('Giá phản đề xuất không hợp lệ');
            }

            $stmt = $db->prepare("
                UPDATE price_negotiations 
                SET status = 'counter_offered', 
                    counter_price = ?,
                    counter_message = ?,
                    responded_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([
                $data['counter_price'],
                $data['message'] ?? null,
                $negotiation_id
            ]);

            $message = sprintf(
                "🔄 Người bán đề xuất giá ngược: %s₫\n%s",
                number_format($data['counter_price'], 0, ',', '.'),
                $data['message'] ?? ''
            );

            $notif_msg = sprintf(
                'Người bán đề xuất giá ngược %s₫',
                number_format($data['counter_price'], 0, ',', '.')
            );
        }

        // Thêm tin nhắn
        $stmt = $db->prepare("
            INSERT INTO messages 
            (thread_id, sender_id, receiver_id, message, message_type, price_offer)
            VALUES (?, ?, ?, ?, 'price_offer', ?)
        ");
        $stmt->execute([
            $negotiation['thread_id'],
            $user['id'],
            $negotiation['buyer_id'],
            $message,
            $action === 'counter' ? $data['counter_price'] : $negotiation['offered_price']
        ]);

        // Update thread
        $stmt = $db->prepare("UPDATE message_threads SET last_message_at = NOW() WHERE id = ?");
        $stmt->execute([$negotiation['thread_id']]);

        // Notification
        $stmt = $db->prepare("
            INSERT INTO notifications (user_id, type, title, message, link)
            VALUES (?, 'price_offer_response', 'Phản hồi đề xuất giá', ?, ?)
        ");
        $stmt->execute([
            $negotiation['buyer_id'],
            $notif_msg,
            "/messages/{$negotiation['thread_id']}"
        ]);

        $db->commit();

        Response::success(null, 'Đã phản hồi đề xuất giá thành công');

    } catch (Exception $e) {
        $db->rollBack();
        Response::error('Không thể phản hồi đề xuất giá: ' . $e->getMessage());
    }
}

// ============================================
// GET - Lấy lịch sử thương lượng của sản phẩm
// ============================================
if ($method === 'GET' && isset($_GET['product_id'])) {
    $user = Auth::validateToken();
    
    $product_id = (int)$_GET['product_id'];

    // Lấy negotiations
    $stmt = $db->prepare("
        SELECT n.*,
               u.full_name as buyer_name,
               u.avatar as buyer_avatar
        FROM price_negotiations n
        JOIN users u ON n.buyer_id = u.id
        WHERE n.product_id = ?
          AND (n.buyer_id = ? OR n.seller_id = ?)
        ORDER BY n.created_at DESC
    ");
    $stmt->execute([$product_id, $user['id'], $user['id']]);
    $negotiations = $stmt->fetchAll();

    Response::success($negotiations, 'Lấy lịch sử thương lượng thành công');
}

Response::methodNotAllowed('Method not allowed');
