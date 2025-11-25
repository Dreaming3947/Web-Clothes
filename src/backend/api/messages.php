<?php
/**
 * Messages API
 * Xử lý các API liên quan đến tin nhắn
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
require_once __DIR__ . '/../utils/Auth.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// ============================================
// GET - Lấy danh sách threads
// ============================================
if ($method === 'GET' && !isset($_GET['thread_id'])) {
    $currentUser = Auth::requireAuth();
    $userId = $currentUser['user_id'];

    $query = "SELECT 
                mt.id,
                mt.product_id,
                mt.last_message_at,
                IF(mt.user1_id = ?, mt.user2_id, mt.user1_id) as other_user_id,
                IF(mt.user1_id = ?, u2.full_name, u1.full_name) as other_user_name,
                IF(mt.user1_id = ?, u2.avatar, u1.avatar) as other_user_avatar,
                (SELECT message FROM messages WHERE thread_id = mt.id ORDER BY created_at DESC LIMIT 1) as last_message,
                (SELECT COUNT(*) FROM messages WHERE thread_id = mt.id AND receiver_id = ? AND is_read = FALSE) as unread_count,
                p.title as product_title,
                p.price as product_price,
                (SELECT url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as product_image
              FROM message_threads mt
              LEFT JOIN users u1 ON mt.user1_id = u1.id
              LEFT JOIN users u2 ON mt.user2_id = u2.id
              LEFT JOIN products p ON mt.product_id = p.id
              WHERE mt.user1_id = ? OR mt.user2_id = ?
              ORDER BY mt.last_message_at DESC";

    $stmt = $db->prepare($query);
    $stmt->execute([$userId, $userId, $userId, $userId, $userId, $userId]);

    $threads = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Response::success('Lấy danh sách tin nhắn thành công', $threads);
}

// ============================================
// GET - Lấy messages của một thread
// ============================================
else if ($method === 'GET' && isset($_GET['thread_id'])) {
    $currentUser = Auth::requireAuth();
    $userId = $currentUser['user_id'];
    $threadId = (int)$_GET['thread_id'];

    // Verify user is part of this thread
    $verifyQuery = "SELECT * FROM message_threads 
                    WHERE id = ? 
                    AND (user1_id = ? OR user2_id = ?)";
    $stmt = $db->prepare($verifyQuery);
    $stmt->execute([$threadId, $userId, $userId]);

    if (!$stmt->fetch()) {
        Response::forbidden('Bạn không có quyền truy cập thread này');
    }

    // Get messages
    $query = "SELECT 
                m.*,
                u.full_name as sender_name,
                u.avatar as sender_avatar
              FROM messages m
              LEFT JOIN users u ON m.sender_id = u.id
              WHERE m.thread_id = ?
              ORDER BY m.created_at ASC";

    $stmt = $db->prepare($query);
    $stmt->execute([$threadId]);

    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Mark messages as read
    $updateQuery = "UPDATE messages 
                    SET is_read = TRUE, read_at = NOW() 
                    WHERE thread_id = ? 
                    AND receiver_id = ? 
                    AND is_read = FALSE";
    $stmt = $db->prepare($updateQuery);
    $stmt->execute([$threadId, $userId]);

    Response::success('Lấy tin nhắn thành công', $messages);
}

// ============================================
// POST - Tạo thread mới hoặc gửi tin nhắn
// ============================================
else if ($method === 'POST') {
    $currentUser = Auth::requireAuth();
    $userId = $currentUser['user_id'];

    $request = json_decode(file_get_contents('php://input'), true);

    // Gửi tin nhắn
    if (isset($request['thread_id'])) {
        $threadId = (int)$request['thread_id'];
        $message = trim($request['message'] ?? '');
        $messageType = $request['message_type'] ?? 'text';
        $priceOffer = $request['price_offer'] ?? null;

        if (empty($message) && $messageType === 'text') {
            Response::badRequest('Nội dung tin nhắn không được để trống');
        }

        // Verify thread access
        $verifyQuery = "SELECT user1_id, user2_id FROM message_threads WHERE id = ?";
        $stmt = $db->prepare($verifyQuery);
        $stmt->execute([$threadId]);
        $thread = $stmt->fetch();

        if (!$thread) {
            Response::notFound('Không tìm thấy thread');
        }

        if ($thread['user1_id'] != $userId && $thread['user2_id'] != $userId) {
            Response::forbidden('Bạn không có quyền gửi tin nhắn trong thread này');
        }

        // Determine receiver
        $receiverId = ($thread['user1_id'] == $userId) ? $thread['user2_id'] : $thread['user1_id'];

        // Insert message
        $insertQuery = "INSERT INTO messages (thread_id, sender_id, receiver_id, message, message_type, price_offer) 
                        VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($insertQuery);
        $stmt->execute([$threadId, $userId, $receiverId, $message, $messageType, $priceOffer]);

        $messageId = $db->lastInsertId();

        // Update thread last_message_at
        $updateQuery = "UPDATE message_threads SET last_message_at = NOW() WHERE id = ?";
        $stmt = $db->prepare($updateQuery);
        $stmt->execute([$threadId]);

        Response::created('Gửi tin nhắn thành công', ['id' => $messageId]);
    }
    // Tạo thread mới
    else {
        $otherUserId = (int)$request['other_user_id'];
        $productId = isset($request['product_id']) ? (int)$request['product_id'] : null;
        $initialMessage = trim($request['message'] ?? '');

        if ($otherUserId == $userId) {
            Response::badRequest('Không thể nhắn tin cho chính mình');
        }

        // Check if thread exists
        $checkQuery = "SELECT id FROM message_threads 
                       WHERE ((user1_id = ? AND user2_id = ?) 
                           OR (user1_id = ? AND user2_id = ?))
                       AND (product_id = ? OR (product_id IS NULL AND ? IS NULL))";
        $stmt = $db->prepare($checkQuery);
        $stmt->execute([$userId, $otherUserId, $otherUserId, $userId, $productId, $productId]);
        $existingThread = $stmt->fetch();

        if ($existingThread) {
            $threadId = $existingThread['id'];
        } else {
            // Create new thread
            $insertThreadQuery = "INSERT INTO message_threads (user1_id, user2_id, product_id) 
                                  VALUES (?, ?, ?)";
            $stmt = $db->prepare($insertThreadQuery);
            $stmt->execute([$userId, $otherUserId, $productId]);
            $threadId = $db->lastInsertId();
        }

        // Send initial message if provided
        if (!empty($initialMessage)) {
            $insertQuery = "INSERT INTO messages (thread_id, sender_id, receiver_id, message) 
                            VALUES (?, ?, ?, ?)";
            $stmt = $db->prepare($insertQuery);
            $stmt->execute([$threadId, $userId, $otherUserId, $initialMessage]);

            // Update thread last_message_at
            $updateQuery = "UPDATE message_threads SET last_message_at = NOW() WHERE id = ?";
            $stmt = $db->prepare($updateQuery);
            $stmt->execute([$threadId]);
        }

        Response::created('Tạo thread thành công', ['thread_id' => $threadId]);
    }
}

// ============================================
// Method not allowed
// ============================================
else {
    Response::methodNotAllowed();
}
